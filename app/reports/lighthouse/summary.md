# Lighthouse — actual results

Lighthouse 12.8.2, run 2026-11-02T16:53:44.804Z against the production build served locally with gzip (as static hosts serve it), no CDN, no HTTP/2. Mobile uses Lighthouse's default throttling (slow 4G, 4× CPU).

| Form factor | Route | Performance | Accessibility | Best practices | SEO | LCP | CLS | TBT | Page weight | Audits below 90 |
|---|---|---|---|---|---|---|---|---|---|---|
| mobile | `/` | 89 | 100 | 100 | 100 | 3.1 s | 0 | 0 ms | Total size was 328 KiB | — |
| mobile | `/?nointro` | 89 | 100 | 100 | 100 | 3.0 s | 0 | 0 ms | Total size was 328 KiB | — |
| mobile | `/recruiter` | 93 | 100 | 100 | 100 | 2.6 s | 0 | 0 ms | Total size was 245 KiB | — |
| mobile | `/projects/careconnect` | 93 | 100 | 100 | 100 | 2.6 s | 0 | 10 ms | Total size was 271 KiB | — |
| mobile | `/product-thinking/rice` | 93 | 100 | 100 | 100 | 2.6 s | 0 | 0 ms | Total size was 243 KiB | — |
| mobile | `/research` | 94 | 100 | 100 | 100 | 2.5 s | 0 | 0 ms | Total size was 232 KiB | — |
| mobile | `/research/90` | 88 | 100 | 100 | 100 | 3.1 s | 0 | 0 ms | Total size was 322 KiB | — |
| mobile | `/ai-lab` | 88 | 100 | 100 | 100 | 3.1 s | 0 | 0 ms | Total size was 300 KiB | — |
| mobile | `/explore` | 94 | 100 | 100 | 100 | 2.6 s | 0 | 20 ms | Total size was 228 KiB | — |
| desktop | `/` | 100 | 100 | 100 | 100 | 0.6 s | 0.001 | 0 ms | Total size was 345 KiB | — |
| desktop | `/?nointro` | 100 | 100 | 100 | 100 | 0.6 s | 0.001 | 0 ms | Total size was 345 KiB | — |
| desktop | `/recruiter` | 100 | 100 | 100 | 100 | 0.5 s | 0 | 0 ms | Total size was 245 KiB | — |
| desktop | `/projects/careconnect` | 100 | 100 | 100 | 100 | 0.6 s | 0.001 | 0 ms | Total size was 271 KiB | — |
| desktop | `/product-thinking/rice` | 100 | 100 | 100 | 100 | 0.5 s | 0.003 | 0 ms | Total size was 243 KiB | — |
| desktop | `/research` | 100 | 100 | 100 | 100 | 0.5 s | 0.001 | 0 ms | Total size was 232 KiB | — |
| desktop | `/research/90` | 100 | 100 | 100 | 100 | 0.6 s | 0 | 0 ms | Total size was 322 KiB | — |
| desktop | `/ai-lab` | 100 | 100 | 100 | 100 | 0.6 s | 0.001 | 0 ms | Total size was 300 KiB | — |
| desktop | `/explore` | 89 | 100 | 100 | 100 | 0.5 s | 0 | 280 ms | Total size was 469 KiB | — |
