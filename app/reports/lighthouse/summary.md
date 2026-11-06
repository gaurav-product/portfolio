# Lighthouse — actual results

Lighthouse 12.8.2, run 2026-11-06T11:37:20.994Z against the production build served locally with gzip (as static hosts serve it), no CDN, no HTTP/2. Mobile uses Lighthouse's default throttling (slow 4G, 4× CPU).

| Form factor | Route | Performance | Accessibility | Best practices | SEO | LCP | CLS | TBT | Page weight | Audits below 90 |
|---|---|---|---|---|---|---|---|---|---|---|
| mobile | `/` | 88 | 100 | 100 | 100 | 3.2 s | 0 | 0 ms | Total size was 371 KiB | — |
| mobile | `/?nointro` | 88 | 100 | 100 | 100 | 3.2 s | 0 | 0 ms | Total size was 371 KiB | — |
| mobile | `/recruiter` | 93 | 100 | 100 | 100 | 2.6 s | 0 | 0 ms | Total size was 260 KiB | — |
| mobile | `/projects/careconnect` | 94 | 100 | 100 | 100 | 2.5 s | 0 | 0 ms | Total size was 245 KiB | — |
| mobile | `/product-thinking/rice` | 94 | 100 | 100 | 100 | 2.5 s | 0 | 0 ms | Total size was 230 KiB | — |
| mobile | `/research` | 94 | 100 | 100 | 100 | 2.5 s | 0 | 0 ms | Total size was 239 KiB | — |
| mobile | `/research/90` | 88 | 100 | 100 | 100 | 3.1 s | 0 | 0 ms | Total size was 325 KiB | — |
| mobile | `/ai-lab` | 89 | 100 | 100 | 100 | 2.9 s | 0 | 0 ms | Total size was 294 KiB | — |
| mobile | `/explore` | 95 | 100 | 100 | 100 | 2.5 s | 0.016 | 10 ms | Total size was 243 KiB | — |
| mobile | `/about` | 93 | 100 | 100 | 100 | 2.7 s | 0 | 0 ms | Total size was 270 KiB | — |
| mobile | `/districts/ai-safety-lab` | 94 | 100 | 100 | 100 | 2.6 s | 0 | 0 ms | Total size was 258 KiB | — |
| desktop | `/` | 99 | 100 | 100 | 100 | 0.8 s | 0 | 0 ms | Total size was 530 KiB | — |
| desktop | `/?nointro` | 99 | 100 | 100 | 100 | 0.8 s | 0 | 0 ms | Total size was 530 KiB | — |
| desktop | `/recruiter` | 100 | 100 | 100 | 100 | 0.6 s | 0 | 0 ms | Total size was 260 KiB | — |
| desktop | `/projects/careconnect` | 100 | 100 | 100 | 100 | 0.5 s | 0.001 | 0 ms | Total size was 245 KiB | — |
| desktop | `/product-thinking/rice` | 100 | 100 | 100 | 100 | 0.5 s | 0.002 | 0 ms | Total size was 230 KiB | — |
| desktop | `/research` | 100 | 100 | 100 | 100 | 0.6 s | 0 | 0 ms | Total size was 273 KiB | — |
| desktop | `/research/90` | 100 | 100 | 100 | 100 | 0.6 s | 0 | 0 ms | Total size was 325 KiB | — |
| desktop | `/ai-lab` | 100 | 100 | 100 | 100 | 0.7 s | 0.001 | 0 ms | Total size was 327 KiB | — |
| desktop | `/explore` | 91 | 100 | 100 | 100 | 0.5 s | 0.027 | 250 ms | Total size was 480 KiB | — |
| desktop | `/about` | 100 | 100 | 100 | 100 | 0.5 s | 0.001 | 0 ms | Total size was 255 KiB | — |
| desktop | `/districts/ai-safety-lab` | 100 | 100 | 100 | 100 | 0.6 s | 0 | 0 ms | Total size was 270 KiB | — |
