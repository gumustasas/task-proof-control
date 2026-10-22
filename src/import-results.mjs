import { readFile } from 'node:fs/promises';
import { attachScenarios } from './scenarios.mjs';
try{
  const paths=process.argv.slice(2);if(paths.length!==4)throw new Error('Kullanım: node src/import-results.mjs snapshot.json observation.json results.json mapping.json');
  const values=[];for(const path of paths){const text=await readFile(path,'utf8');if(Buffer.byteLength(text)>2_000_000)throw new Error('Dosya en fazla 2 MB olabilir.');values.push(JSON.parse(text.replace(/^\uFEFF/,'')));}
  const result=attachScenarios(...values);
  console.log(JSON.stringify({...result.snapshot,importTrust:result.trust},null,2));
}catch(e){console.error(e.message);process.exitCode=1;}
