# Lighthouse — actual results

Lighthouse 12.8.2, run 2026-11-02T15:25:57.482Z against the production build served locally with gzip (as static hosts serve it), no CDN, no HTTP/2. Mobile uses Lighthouse's default throttling (slow 4G, 4× CPU).

| Form factor | Route | Performance | Accessibility | Best practices | SEO | LCP | CLS | TBT | Page weight | Audits below 90 |
|---|---|---|---|---|---|---|---|---|---|---|
| mobile | `/` | 91 | 100 | 100 | 100 | 2.9 s | 0 | 0 ms | Total size was 291 KiB | — |
| mobile | `/?nointro` | 91 | 100 | 100 | 100 | 2.9 s | 0 | 0 ms | Total size was 291 KiB | — |
| mobile | `/recruiter` | 93 | 100 | 100 | 100 | 2.6 s | 0 | 0 ms | Total size was 237 KiB | — |
| mobile | `/projects/careconnect` | 93 | 100 | 100 | 100 | 2.6 s | 0 | 0 ms | Total size was 260 KiB | — |
| mobile | `/product-thinking/rice` | 93 | 100 | 100 | 100 | 2.6 s | 0 | 0 ms | Total size was 241 KiB | — |
| mobile | `/research` | 94 | 100 | 100 | 100 | 2.4 s | 0 | 0 ms | Total size was 230 KiB | — |
| mobile | `/explore` | 94 | 100 | 100 | 100 | 2.6 s | 0 | 10 ms | Total size was 226 KiB | — |
| desktop | `/` | 100 | 100 | 100 | 100 | 0.6 s | 0.001 | 0 ms | Total size was 308 KiB | — |
| desktop | `/?nointro` | 100 | 100 | 100 | 100 | 0.6 s | 0.001 | 0 ms | Total size was 308 KiB | — |
| desktop | `/recruiter` | 100 | 100 | 100 | 100 | 0.5 s | 0 | 0 ms | Total size was 237 KiB | — |
| desktop | `/projects/careconnect` | 100 | 100 | 100 | 100 | 0.6 s | 0.001 | 0 ms | Total size was 260 KiB | — |
| desktop | `/product-thinking/rice` | 100 | 100 | 100 | 100 | 0.5 s | 0.003 | 0 ms | Total size was 241 KiB | — |
| desktop | `/research` | 100 | 100 | 100 | 100 | 0.6 s | 0.001 | 0 ms | Total size was 230 KiB | — |
| desktop | `/explore` | 89 | 100 | 100 | 100 | 0.5 s | 0 | 280 ms | Total size was 467 KiB | — |
