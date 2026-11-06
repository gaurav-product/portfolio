# guide-api — optional AI brain for Oz (NOT DEPLOYED)

The portfolio is a static GitHub Pages site. A static site cannot keep a secret,
so a live language model needs a small server in between. This folder is that
server, written and type-checked but **not deployed**. Deploying it needs the
owner's approval and an API key.

Without it, Oz runs on the **local grounded brain** in the browser. That brain
answers from the portfolio's own content modules and refuses everything else.
The local brain is what ships today.

## How the pieces connect

```
browser (Oz panel) ──POST {message, lang, history}──▶ guide-api (this folder) ──▶ Anthropic Messages API
        ▲                                                    │  AI_API_KEY lives only here
        └──────────── {text, kind, links} ◀──────────────────┘
```

- **Site side:** `app/src/guide/brain/remote.ts`. It is used only when the site is
  built with `VITE_GUIDE_API_URL` set. It has a 12 s timeout and validates the
  response shape. On any failure it falls back to the local brain, and the panel
  labels that answer as local.
- **Server side:** `src/handler.ts` is a web-standard fetch handler. `src/worker.ts`
  is the Cloudflare Workers entry.

## Environment variables

| Name | Where | Secret? | Value |
|---|---|---|---|
| `AI_API_KEY` | server only (`wrangler secret put AI_API_KEY`) | **yes** | Anthropic API key |
| `AI_PROVIDER` | server | no | `anthropic` (default) or `mock` (returns the refusal line; for wiring tests) |
| `AI_MODEL` | server | no | default `claude-opus-5-5` |
| `ALLOWED_ORIGIN` | server | no | `https://gaurav-product.github.io` (exact origin; other origins get 403) |
| `VITE_GUIDE_API_URL` | **site build** (GitHub Actions variable) | no, it is a public URL | the deployed endpoint URL |

Never put the API key in the site, a `VITE_*` variable, GitHub Actions
*variables* or a commit. `.gitignore` here excludes `.dev.vars`, `.env*` and
`.wrangler/`.

## What the endpoint does

- **Grounding.** The system prompt holds the knowledge pack
  (`src/knowledge.generated.ts`), generated from the site's content modules. The
  model is told to answer only from it, to keep project statuses as written, and
  to reply with the exact refusal line otherwise.
- **Refusal fallback.** Requests carry `fallbacks: "default"` with beta header
  `server-side-fallback-2026-07-01`. If the model declines on policy grounds, the
  API re-runs the request on Anthropic's recommended fallback model. If the final
  `stop_reason` is still `"refusal"`, the visitor gets the refusal line.
- **Input limits.**
  - Body: at most 8 KB.
  - Message: at most 500 characters.
  - History: the last 6 turns, at most 600 characters each.
  - Invalid input gets a generic 4xx.
- **Rate limit.** Best effort: 12 requests per minute per IP, per instance. Add a
  platform rate-limit rule (for example, Cloudflare WAF) for a hard limit.
- **Output.**
  - `{text, kind: "answer"|"refused", links}`.
  - Links are filtered to internal site paths, at most 3.
  - Errors are generic and never echo provider details.
- **Privacy.** Nothing is logged or stored. There is no database. Microphone
  audio never leaves the browser; only the typed or recognised text is sent.

## Regenerate the knowledge pack

Run this after editing content in `app/src/content/`:

```bash
cd app && node scripts/build-guide-knowledge.mjs
```

## Deploy (only after approval)

1. Install the dependencies:

   ```bash
   cd guide-api && npm install
   ```

2. Store the key as a server-side secret:

   ```bash
   npx wrangler secret put AI_API_KEY
   ```

3. Deploy:

   ```bash
   npx wrangler deploy
   ```

4. Smoke-test the deployed endpoint:

   ```bash
   curl -s -X POST "$URL" -H 'origin: https://gaurav-product.github.io' -H 'content-type: application/json' -d '{"message":"What has Gaurav built?","lang":"en"}'
   ```

5. In the GitHub repository, go to **Settings → Secrets and variables → Actions →
   Variables** and add `VITE_GUIDE_API_URL` = the worker URL. Make sure the Pages
   build passes it to `npm run build`. Then rebuild the site.

6. Ask Oz something. Answers from the endpoint are labelled "Live AI · grounded" in the panel.
   If the endpoint fails, the panel falls back to the local brain and labels the
   answer accordingly.

Other hosts (Vercel, Netlify, Deno, Node) can call `handle(request, env)` from
`src/handler.ts` directly.

## Verification status

- Type-checks: `npx tsc --noEmit`.
- Tested locally without a key: 405, 400, 413, 403 (origin), 503 (no key), mock mode, and link filtering.
- **Not tested against the live Anthropic API.** No key was available. Treat live AI as unverified until steps 4–6 above have been run.
