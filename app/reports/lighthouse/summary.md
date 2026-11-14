# Lighthouse — actual results

Lighthouse 12.8.2, run 2026-11-07T07:28:56.046Z against the production build served locally with gzip (as static hosts serve it), no CDN, no HTTP/2. Mobile uses Lighthouse's default throttling (slow 4G, 4× CPU).

| Form factor | Route | Performance | Accessibility | Best practices | SEO | LCP | CLS | TBT | Page weight | Audits below 90 |
|---|---|---|---|---|---|---|---|---|---|---|
| mobile | `/` | 86 | 100 | 100 | 100 | 3.4 s | 0 | 0 ms | Total size was 411 KiB | — |
| mobile | `/?nointro` | 86 | 100 | 100 | 100 | 3.4 s | 0 | 0 ms | Total size was 411 KiB | — |
| mobile | `/recruiter` | 91 | 100 | 100 | 100 | 2.8 s | 0 | 0 ms | Total size was 276 KiB | — |
| mobile | `/projects/careconnect` | 84 | 100 | 100 | 100 | 3.8 s | 0 | 0 ms | Total size was 1,869 KiB | — |
| mobile | `/product-thinking/rice` | 93 | 100 | 100 | 100 | 2.6 s | 0 | 10 ms | Total size was 249 KiB | — |
| mobile | `/research` | 93 | 100 | 100 | 100 | 2.6 s | 0 | 0 ms | Total size was 257 KiB | — |
| mobile | `/research/90` | 88 | 100 | 100 | 100 | 3.1 s | 0 | 0 ms | Total size was 341 KiB | — |
| mobile | `/ai-lab` | 88 | 100 | 100 | 100 | 3.1 s | 0 | 0 ms | Total size was 313 KiB | — |
| mobile | `/explore` | 93 | 100 | 100 | 100 | 2.8 s | 0.016 | 20 ms | Total size was 266 KiB | — |
| mobile | `/about` | 89 | 100 | 100 | 100 | 3.0 s | 0 | 0 ms | Total size was 316 KiB | — |
| mobile | `/districts/ai-safety-lab` | 92 | 100 | 100 | 100 | 2.8 s | 0 | 0 ms | Total size was 282 KiB | — |
| desktop | `/` | 99 | 100 | 100 | 100 | 0.9 s | 0 | 0 ms | Total size was 558 KiB | — |
| desktop | `/?nointro` | 99 | 100 | 100 | 100 | 0.8 s | 0 | 0 ms | Total size was 558 KiB | — |
| desktop | `/recruiter` | 100 | 100 | 100 | 100 | 0.6 s | 0 | 0 ms | Total size was 280 KiB | — |
| desktop | `/projects/careconnect` | 100 | 100 | 100 | 100 | 0.7 s | 0.001 | 0 ms | Total size was 1,869 KiB | — |
| desktop | `/product-thinking/rice` | 100 | 100 | 100 | 100 | 0.5 s | 0.002 | 0 ms | Total size was 249 KiB | — |
| desktop | `/research` | 100 | 100 | 100 | 100 | 0.6 s | 0 | 0 ms | Total size was 295 KiB | — |
| desktop | `/research/90` | 100 | 100 | 100 | 100 | 0.7 s | 0 | 0 ms | Total size was 341 KiB | — |
| desktop | `/ai-lab` | 99 | 100 | 100 | 100 | 0.7 s | 0.001 | 0 ms | Total size was 347 KiB | — |
| desktop | `/explore` | 94 | 100 | 100 | 100 | 0.5 s | 0.027 | 190 ms | Total size was 509 KiB | — |
| desktop | `/about` | 100 | 100 | 100 | 100 | 0.6 s | 0.001 | 0 ms | Total size was 310 KiB | — |
| desktop | `/districts/ai-safety-lab` | 100 | 100 | 100 | 100 | 0.6 s | 0 | 0 ms | Total size was 294 KiB | — |
