# Lighthouse — actual results

Lighthouse 12.8.2, run 2026-11-06T12:44:02.751Z against the production build served locally with gzip (as static hosts serve it), no CDN, no HTTP/2. Mobile uses Lighthouse's default throttling (slow 4G, 4× CPU).

| Form factor | Route | Performance | Accessibility | Best practices | SEO | LCP | CLS | TBT | Page weight | Audits below 90 |
|---|---|---|---|---|---|---|---|---|---|---|
| mobile | `/` | 88 | 100 | 100 | 100 | 3.2 s | 0 | 0 ms | Total size was 388 KiB | — |
| mobile | `/?nointro` | 89 | 100 | 100 | 100 | 3.3 s | 0 | 0 ms | Total size was 388 KiB | — |
| mobile | `/recruiter` | 93 | 100 | 100 | 100 | 2.6 s | 0 | 0 ms | Total size was 261 KiB | — |
| mobile | `/projects/careconnect` | 93 | 100 | 100 | 100 | 2.6 s | 0 | 0 ms | Total size was 249 KiB | — |
| mobile | `/product-thinking/rice` | 94 | 100 | 100 | 100 | 2.5 s | 0 | 0 ms | Total size was 231 KiB | — |
| mobile | `/research` | 94 | 100 | 100 | 100 | 2.5 s | 0 | 0 ms | Total size was 241 KiB | — |
| mobile | `/research/90` | 88 | 100 | 100 | 100 | 3.1 s | 0 | 0 ms | Total size was 326 KiB | — |
| mobile | `/ai-lab` | 90 | 100 | 100 | 100 | 2.9 s | 0 | 0 ms | Total size was 296 KiB | — |
| mobile | `/explore` | 95 | 100 | 100 | 100 | 2.5 s | 0.016 | 20 ms | Total size was 246 KiB | — |
| mobile | `/about` | 93 | 100 | 100 | 100 | 2.7 s | 0 | 0 ms | Total size was 272 KiB | — |
| mobile | `/districts/ai-safety-lab` | 93 | 100 | 100 | 100 | 2.6 s | 0 | 0 ms | Total size was 260 KiB | — |
| desktop | `/` | 100 | 100 | 100 | 100 | 0.8 s | 0 | 0 ms | Total size was 528 KiB | — |
| desktop | `/?nointro` | 99 | 100 | 100 | 100 | 0.8 s | 0 | 0 ms | Total size was 528 KiB | — |
| desktop | `/recruiter` | 100 | 100 | 100 | 100 | 0.5 s | 0 | 0 ms | Total size was 261 KiB | — |
| desktop | `/projects/careconnect` | 100 | 100 | 100 | 100 | 0.5 s | 0.001 | 0 ms | Total size was 249 KiB | — |
| desktop | `/product-thinking/rice` | 100 | 100 | 100 | 100 | 0.5 s | 0.002 | 0 ms | Total size was 231 KiB | — |
| desktop | `/research` | 100 | 100 | 100 | 100 | 0.6 s | 0 | 0 ms | Total size was 275 KiB | — |
| desktop | `/research/90` | 100 | 100 | 100 | 100 | 0.6 s | 0 | 0 ms | Total size was 326 KiB | — |
| desktop | `/ai-lab` | 100 | 100 | 100 | 100 | 0.6 s | 0.001 | 0 ms | Total size was 329 KiB | — |
| desktop | `/explore` | 93 | 100 | 100 | 100 | 0.5 s | 0.027 | 220 ms | Total size was 487 KiB | — |
| desktop | `/about` | 100 | 100 | 100 | 100 | 0.6 s | 0.001 | 0 ms | Total size was 257 KiB | — |
| desktop | `/districts/ai-safety-lab` | 100 | 100 | 100 | 100 | 0.6 s | 0 | 0 ms | Total size was 272 KiB | — |
