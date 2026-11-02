# Lighthouse — actual results

Lighthouse 12.8.2, run 2026-11-02T19:52:43.317Z against the production build served locally with gzip (as static hosts serve it), no CDN, no HTTP/2. Mobile uses Lighthouse's default throttling (slow 4G, 4× CPU).

| Form factor | Route | Performance | Accessibility | Best practices | SEO | LCP | CLS | TBT | Page weight | Audits below 90 |
|---|---|---|---|---|---|---|---|---|---|---|
| mobile | `/` | 89 | 100 | 100 | 100 | 3.3 s | 0 | 0 ms | Total size was 368 KiB | — |
| mobile | `/?nointro` | 87 | 100 | 100 | 100 | 3.3 s | 0 | 10 ms | Total size was 368 KiB | — |
| mobile | `/recruiter` | 93 | 100 | 100 | 100 | 2.6 s | 0 | 0 ms | Total size was 246 KiB | — |
| mobile | `/projects/careconnect` | 93 | 100 | 100 | 100 | 2.6 s | 0 | 0 ms | Total size was 273 KiB | — |
| mobile | `/product-thinking/rice` | 94 | 100 | 100 | 100 | 2.5 s | 0 | 0 ms | Total size was 244 KiB | — |
| mobile | `/research` | 94 | 100 | 100 | 100 | 2.5 s | 0 | 0 ms | Total size was 237 KiB | — |
| mobile | `/research/90` | 88 | 100 | 100 | 100 | 3.1 s | 0 | 0 ms | Total size was 324 KiB | — |
| mobile | `/ai-lab` | 90 | 100 | 100 | 100 | 2.9 s | 0 | 0 ms | Total size was 306 KiB | — |
| mobile | `/explore` | 94 | 100 | 100 | 100 | 2.5 s | 0.012 | 30 ms | Total size was 255 KiB | — |
| mobile | `/about` | 94 | 100 | 100 | 100 | 2.5 s | 0 | 0 ms | Total size was 260 KiB | — |
| mobile | `/districts/ai-safety-lab` | 93 | 100 | 100 | 100 | 2.6 s | 0 | 0 ms | Total size was 270 KiB | — |
| desktop | `/` | 99 | 100 | 100 | 100 | 0.8 s | 0.001 | 0 ms | Total size was 527 KiB | — |
| desktop | `/?nointro` | 99 | 100 | 100 | 100 | 0.8 s | 0.001 | 0 ms | Total size was 527 KiB | — |
| desktop | `/recruiter` | 100 | 100 | 100 | 100 | 0.5 s | 0 | 0 ms | Total size was 246 KiB | — |
| desktop | `/projects/careconnect` | 100 | 100 | 100 | 100 | 0.6 s | 0.001 | 0 ms | Total size was 273 KiB | — |
| desktop | `/product-thinking/rice` | 100 | 100 | 100 | 100 | 0.5 s | 0.003 | 0 ms | Total size was 244 KiB | — |
| desktop | `/research` | 100 | 100 | 100 | 100 | 0.6 s | 0.001 | 0 ms | Total size was 270 KiB | — |
| desktop | `/research/90` | 100 | 100 | 100 | 100 | 0.6 s | 0 | 0 ms | Total size was 324 KiB | — |
| desktop | `/ai-lab` | 100 | 100 | 100 | 100 | 0.7 s | 0.001 | 0 ms | Total size was 339 KiB | — |
| desktop | `/explore` | 89 | 100 | 100 | 100 | 0.5 s | 0.027 | 270 ms | Total size was 475 KiB | — |
| desktop | `/about` | 100 | 100 | 100 | 100 | 0.5 s | 0.001 | 0 ms | Total size was 245 KiB | — |
| desktop | `/districts/ai-safety-lab` | 100 | 100 | 100 | 100 | 0.6 s | 0 | 0 ms | Total size was 282 KiB | — |
