# Matched OpenAI baseline - 2026-10-23

User approved reusing the existing local OPENAI_API_KEY for one approximately USD 0.001 comparison request. Do not copy this credential into GitHub or Vercel.

1. Freeze gpt-4o-mini, the model configured in Growth OS project prj_emaFPXFg4oAVawljJRLKeq0ByQ23 OPENAI_CONTENT_MODEL (preview/production), read 2026-10-23. Source judge.ts at 6d63a15ee1221a31f54e32bf4cb8707e746f22be reads that variable. This is configured identity, not proof of every historical deployed request.
2. Use exact SEO_PROMPT and R-atik-su input from the first Gemini result; require matching prompt/input/rendered hashes before network. No reviewer checklist, conversation history or Gemini response goes into the request.
3. One fixed Responses API POST, temperature 0.2, output cap 768, store=false, no tools, redirects, retries or fallback. 45s and 32KiB limits. Reserve a local lock before calling. Timeout or save failure never permits automatic rerun.
4. At the checked standard text rates ($0.15/$0.60 per million input/output tokens), preflight a conservative prompt UTF-8-byte count plus 512 framing tokens and full output cap against USD 0.001. This is a list-price bound under those rates, not a provider-side billing cap. Actual billed cost remains unknown; provider usage yields a separately labelled estimate.
5. Unit-test opt-in, exact one-call body/hashes, budget rejection, HTTP/timeout handling, incomplete responses and secret redaction. Run tests before the single live request. CI must never receive a provider credential or execute the CLI.
6. Preserve both observed outputs and timings, assistant review and limitations. Different providers/runners and one sample cannot establish speed superiority, human time savings or a model winner. Same prompt improves comparability but the assistant already saw Gemini, so review is not blind.
7. Open PR with actual result, check exact-head CI and squash. No Growth OS source, deployment, secrets, DNS or existing Gemini workflow changes.

Price source checked 2026-10-23: https://developers.openai.com/api/docs/models/gpt-4o-mini
