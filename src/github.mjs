const SHA = /^[a-f0-9]{40}$/;
const ID = /^[A-Za-z0-9_.-]+$/;
export class GitHubReadError extends Error {
  constructor(code, message) { super(message); this.code = code; }
}
export function parsePullUrl(input) {
  let u; try { u = new URL(input); } catch { throw new GitHubReadError('INVALID_URL', 'Geçerli bir GitHub PR bağlantısı girin.'); }
  const parts = u.pathname.split('/').filter(Boolean);
  if (u.protocol !== 'https:' || u.hostname !== 'github.com' || u.port || u.username || u.password || u.search || u.hash || parts.length !== 4 || parts[2] !== 'pull' || !/^[1-9]\d*$/.test(parts[3]) || !parts.slice(0,2).every(x=>ID.test(x) && !['.','..'].includes(x))) {
    throw new GitHubReadError('INVALID_URL', 'Yalnız https://github.com/sahip/repo/pull/numara bağlantısı kabul edilir.');
  }
  const number = Number(parts[3]); if (!Number.isSafeInteger(number)) throw new GitHubReadError('INVALID_URL','PR numarası geçersiz.');
  return {owner:parts[0],repo:parts[1],number};
}
async function boundedJson(response) {
  const reader = response.body?.getReader(); if (!reader) throw new GitHubReadError('BAD_RESPONSE','GitHub yanıtı boş.');
  const chunks=[]; let size=0;
  for (;;) {
    const {done,value}=await reader.read(); if(done)break;
    size+=value.length; if(size>2_000_000){await reader.cancel();throw new GitHubReadError('BODY_LIMIT','GitHub yanıt boyutu sınırı aşıldı.');}chunks.push(value);
  }
  const buffer=new Uint8Array(size);let offset=0;for(const c of chunks){buffer.set(c,offset);offset+=c.length;}
  try{return JSON.parse(new TextDecoder().decode(buffer));}catch{throw new GitHubReadError('BAD_RESPONSE','GitHub yanıtı çözümlenemedi.');}
}
export async function collectPull(input, {fetcher=fetch,token='',maxPages=3,maxRequests=32,timeoutMs=20_000,now=()=>new Date().toISOString()}={}) {
  const {owner,repo,number}=parsePullUrl(input);
  const prefix='/repos/'+encodeURIComponent(owner)+'/'+encodeURIComponent(repo);
  const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),timeoutMs);
  let calls=0;const warnings=[];
  const get=async(path)=>{
    if(++calls>maxRequests)throw new GitHubReadError('REQUEST_LIMIT','GitHub istek bütçesi aşıldı.');
    let response;
    try{response=await fetcher('https://api.github.com'+path,{method:'GET',redirect:'error',signal:controller.signal,headers:{Accept:'application/vnd.github+json','User-Agent':'TaskProof/0.1',...(token?{Authorization:'Bearer '+token}: {})}});}
    catch{throw new GitHubReadError(controller.signal.aborted?'TIMEOUT':'NETWORK','GitHub bağlantısı tamamlanamadı.');}
    if(response.status===401)throw new GitHubReadError('AUTH','GitHub kimlik doğrulaması başarısız.');
    if(response.status===404)throw new GitHubReadError('NOT_FOUND','PR bulunamadı veya erişim izni yok.');
    if(response.status===429||(response.status===403&&response.headers.get('x-ratelimit-remaining')==='0'))throw new GitHubReadError('RATE_LIMIT','GitHub kullanım sınırına ulaşıldı; daha sonra yeniden deneyin.');
    if(!response.ok)throw new GitHubReadError('HTTP_'+response.status,'GitHub isteği başarısız ('+response.status+').');
    return {data:await boundedJson(response),next:/<[^>]+>;\s*rel="next"/.test(response.headers.get('link')??'')};
  };
  const list=async(path,key)=>{
    const items=[];
    for(let page=1;page<=maxPages;page++){
      const r=await get(path+(path.includes('?')?'&':'?')+'per_page=100&page='+page);
      const rows=key?r.data[key]:r.data;
      if(!Array.isArray(rows))throw new GitHubReadError('BAD_RESPONSE','GitHub liste yanıtı geçersiz.');
      items.push(...rows);if(!r.next)return items;
    }
    warnings.push('Sayfalama sınırı: '+path);return items;
  };
  try{
    const pr=(await get(prefix+'/pulls/'+number)).data;
    const sha=pr.head?.sha;if(!SHA.test(sha??''))throw new GitHubReadError('BAD_RESPONSE','PR commit bilgisi geçersiz.');
    const checks=await list(prefix+'/commits/'+sha+'/check-runs','check_runs');
    const runs=await list(prefix+'/actions/runs?head_sha='+sha,'workflow_runs');
    const observations=[];
    for(const check of checks){
      if(check.head_sha!==sha){warnings.push('Başka commit kontrolü atlandı: '+check.id);continue;}
      observations.push({kind:'check',id:check.id,name:check.name,status:check.status,conclusion:check.conclusion,commitSha:sha,url:check.html_url});
    }
    const currentRuns=runs.filter(r=>r.head_sha===sha);
    if(currentRuns.length!==runs.length)warnings.push('Başka commit workflow kayıtları atlandı.');
    if(currentRuns.length>5)warnings.push('Yalnız ilk 5 workflow için iş ayrıntısı alındı.');
    for(const run of currentRuns.slice(0,5)){
      observations.push({kind:'workflow',id:run.id,name:run.name,status:run.status,conclusion:run.conclusion,commitSha:sha,url:run.html_url,attempt:run.run_attempt});
      const jobs=await list(prefix+'/actions/runs/'+run.id+'/jobs?filter=latest','jobs');
      for(const job of jobs){
        if(job.head_sha!==sha){warnings.push('Commit eşleşmeyen iş atlandı: '+job.id);continue;}
        observations.push({kind:'job',id:job.id,runId:run.id,name:job.name,status:job.status,conclusion:job.conclusion,commitSha:sha,url:job.html_url,steps:(job.steps??[]).map(s=>({name:s.name,status:s.status,conclusion:s.conclusion}))});
      }
    }
    const final=(await get(prefix+'/pulls/'+number)).data;
    if(final.head?.sha!==sha)throw new GitHubReadError('HEAD_CHANGED','Okuma sırasında PR commit’i değişti. Yeniden yükleyin.');
    const safe=(value,max=500)=>typeof value==='string'?value.slice(0,max):'';
    return {schemaVersion:1,kind:'github-observation',repository:owner+'/'+repo,prNumber:number,headSha:sha,title:safe(pr.title),url:'https://github.com/'+owner+'/'+repo+'/pull/'+number,state:safe(final.state),merged:final.merged===true,collectedAt:now(),calls,complete:warnings.length===0,warnings,observations,
      interpretation:'Bu kayıt CI metadata’sıdır; tek başına kabul şartlarını doğrulamaz.'};
  }finally{clearTimeout(timer);}
}
