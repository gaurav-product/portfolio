# Lighthouse — actual results

Lighthouse 12.8.2, run 2026-11-02T19:07:10.686Z against the production build served locally with gzip (as static hosts serve it), no CDN, no HTTP/2. Mobile uses Lighthouse's default throttling (slow 4G, 4× CPU).

| Form factor | Route | Performance | Accessibility | Best practices | SEO | LCP | CLS | TBT | Page weight | Audits below 90 |
|---|---|---|---|---|---|---|---|---|---|---|
| mobile | `/` | 84 | 100 | 100 | 100 | 3.7 s | 0 | 80 ms | Total size was 419 KiB | — |
| mobile | `/?nointro` | 85 | 100 | 100 | 100 | 3.6 s | 0 | 0 ms | Total size was 419 KiB | — |
| mobile | `/recruiter` | 93 | 100 | 100 | 100 | 2.6 s | 0 | 0 ms | Total size was 246 KiB | — |
| mobile | `/projects/careconnect` | 95 | 100 | 100 | 100 | 2.4 s | 0 | 10 ms | Total size was 273 KiB | — |
| mobile | `/product-thinking/rice` | 93 | 100 | 100 | 100 | 2.6 s | 0 | 0 ms | Total size was 244 KiB | — |
| mobile | `/research` | 94 | 100 | 100 | 100 | 2.5 s | 0 | 0 ms | Total size was 235 KiB | — |
| mobile | `/research/90` | 87 | 100 | 100 | 100 | 3.1 s | 0 | 10 ms | Total size was 323 KiB | — |
| mobile | `/ai-lab` | 89 | 100 | 100 | 100 | 2.9 s | 0 | 0 ms | Total size was 304 KiB | — |
| mobile | `/explore` | 93 | 100 | 100 | 100 | 2.6 s | 0.012 | 30 ms | Total size was 307 KiB | — |
| mobile | `/about` | 93 | 100 | 100 | 100 | 2.6 s | 0 | 0 ms | Total size was 299 KiB | — |
| mobile | `/districts/ai-safety-lab` | 91 | 100 | 100 | 100 | 3.0 s | 0 | 0 ms | Total size was 318 KiB | — |
| desktop | `/` | 99 | 100 | 100 | 100 | 0.9 s | 0.001 | 0 ms | Total size was 529 KiB | — |
| desktop | `/?nointro` | 99 | 100 | 100 | 100 | 0.8 s | 0.001 | 0 ms | Total size was 529 KiB | — |
| desktop | `/recruiter` | 100 | 100 | 100 | 100 | 0.6 s | 0 | 0 ms | Total size was 246 KiB | — |
| desktop | `/projects/careconnect` | 100 | 100 | 100 | 100 | 0.6 s | 0.001 | 0 ms | Total size was 273 KiB | — |
| desktop | `/product-thinking/rice` | 100 | 100 | 100 | 100 | 0.5 s | 0.003 | 0 ms | Total size was 244 KiB | — |
| desktop | `/research` | 100 | 100 | 100 | 100 | 0.6 s | 0.001 | 0 ms | Total size was 317 KiB | — |
| desktop | `/research/90` | 100 | 100 | 100 | 100 | 0.6 s | 0 | 0 ms | Total size was 323 KiB | — |
| desktop | `/ai-lab` | 100 | 100 | 100 | 100 | 0.7 s | 0.001 | 0 ms | Total size was 387 KiB | — |
| desktop | `/explore` | 91 | 100 | 100 | 100 | 0.5 s | 0.027 | 250 ms | Total size was 474 KiB | — |
| desktop | `/about` | 100 | 100 | 100 | 100 | 0.6 s | 0.001 | 0 ms | Total size was 268 KiB | — |
| desktop | `/districts/ai-safety-lab` | 100 | 100 | 100 | 100 | 0.7 s | 0 | 0 ms | Total size was 395 KiB | — |
