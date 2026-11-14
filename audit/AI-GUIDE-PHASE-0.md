# Gaurav.OS AI Guide: Phase 0 audit

Date: 6 November 2026 · Branch `claude/beautiful-goldberg-radrlu` · Draft PR gaurav-product/portfolio#1

## 0. Which codebase

| Candidate | Finding |
|---|---|
| `github.com/gaurav-product/portfolio` → `app/` on this branch | **The target.** A React application holding all current portfolio content, tests and CI. |
| `gaurav-os.lovable.app` | A separate, older implementation. The only trace here is a comment in `RoboGuide.tsx` ("ported from the Lovable implementation"). It is not used, not modified, and Lovable is not used. |
| `main` branch (`site/`, `docs/`) | The earlier static site that GitHub Pages serves today. It is untouched. |

## 1. Current architecture

**Stack**
- React 19, TypeScript and Vite 7.
- React Router 7 in framework mode, with `ssr: false` and **static prerender of all 310 routes**.
- Tailwind 4, with design tokens in `src/app.css`.
- three.js and React Three Fiber (Explore Mode only, lazy-loaded), and GSAP.

**Hosting**
- **GitHub Pages**: static files only, with no server runtime.
- Deployment is a manual workflow, `.github/workflows/app-deploy-pages.yml`.
- CI is `app-ci.yml`: typecheck, Vitest, build, then Playwright.

**Content**
- Typed modules in `src/content/`: profile, projects, experience, capabilities, districts, newsletter and kb.
- Generated data in `src/data/generated/`.

**Environment variables**
- Only `VITE_SITE_URL` and `BASE_PATH`. There are no secrets and no `.env` files in the repository.

## 2. Entry points

- `src/root.tsx`: the `Layout` (head, header, footer and search provider) wraps every route. **This is the single place to mount a site-wide widget.**
- `src/routes.ts`: the route table.
- `react-router.config.ts`: the prerender list.

## 3. Best location for the guide

A fixed floating launcher in the bottom-right corner, mounted once in `root.tsx`:
- The **launcher is tiny and inline**.
- The **conversation panel, voice engine and brain load lazily on first open**, so no page pays for them up front.

It must not interfere with any of these:
- the intro film overlay (it sits above with a higher z-index);
- the Explore Mode scene controls;
- the header and menu drawer;
- print (it is hidden in print).

## 4. Reusable pieces

| Existing | Reuse |
|---|---|
| `lib/ask.ts` with `content/kb.ts` | A **deterministic, grounded answer engine**: it refuses unsupported asks (revenue, users, clinical claims and similar), matches 14 verified answers, and otherwise falls back to site search. This becomes the guide's default brain. |
| `lib/search.ts` | Search across all pages: the "point to the right page" fallback. |
| `content/profile.ts`, `content/projects.ts`, `content/experience.ts`, `content/newsletter.ts` | The facts for recruiter intents: names, statuses, roles, tools and contact details. |
| `components/RoboGuide.tsx` | A decorative SVG robot with pointer tracking. It stays where it is (`/ask`, `/ai-lab`), and the new guide is a separate, original character. |
| `lib/analytics.ts` | Event names and a timestamp only, pushed to `window.dataLayer` with no third parties. Guide events are added here. |
| UI kit (`ui.tsx`, `Icon.tsx`) and tokens | Buttons, icons, colours and focus styles. |

## 5. Recommended approach

These run entirely in the browser and need no new infrastructure:
- the character and its state machine;
- the widget;
- voice: Web Speech API recognition and speech synthesis, behind replaceable adapters;
- navigation.

The brain sits behind a `Brain` interface:
- **`local`** (the default, works today): the grounded engine plus new recruiter intents, with templated Hindi and Hinglish answers built from the same content modules. It is deterministic and never composes new facts.
- **`remote`** (optional): it calls a configurable HTTPS endpoint (`VITE_GUIDE_API_URL`, a public URL and not a secret). On timeout or error it falls back to `local` and says so.

The **server endpoint** (`guide-api/`) is a small web-standard `fetch` handler. It holds the provider key server-side, validates input, limits size and rate, and grounds the model in a generated knowledge pack.
- It is **written and tested locally but not deployed.**
- Deploying it is an architectural change (it needs a host such as Cloudflare Workers, Vercel or Netlify) and needs an API key, so it **requires the owner's approval**.

## 6. Voice and AI requirements

**Recognition**
- `SpeechRecognition` / `webkitSpeechRecognition` works in Chrome and Edge, and in Safari 14.1 and later.
- **Firefox does not support it**, so typing remains the fallback.
- It needs HTTPS (or localhost) and an explicit click.

**Languages**
- `en-IN` and `hi-IN`.
- Hinglish is recognised as whichever language is selected. Engines do not code-switch reliably.

**Speech synthesis**
- `speechSynthesis` is available in all modern browsers.
- Which voices exist depends on the operating system. An `en-IN` or `hi-IN` voice is preferred when present, and is never promised.

**Lip-sync**
- `SpeechSynthesisUtterance` `boundary` events, where the browser fires them, drive mouth pulses per word.
- Otherwise a speaking loop runs while the utterance plays. This is **not phoneme-accurate**.

## 7. Security

- There is no secret in the client, and a static site cannot hold one.
- The endpoint template reads `AI_PROVIDER`, `AI_MODEL` and `AI_API_KEY` from server-side environment variables only.
- The endpoint:
  - validates input as JSON with a set shape;
  - limits size (message 500 characters, history 6 turns, body 8 KB);
  - rate-limits best-effort per IP;
  - returns only safe error messages;
  - stores no logs of message content.
- No audio is recorded or stored. Recognition runs in the browser engine, and some browsers, such as Chrome, send the audio to their own speech service; the panel says so.
- Conversations live in memory for the session only.

## 8. Performance risks

| Risk | Mitigation |
|---|---|
| The launcher on every page | An inline SVG under 3 KB, with CSS animation only |
| Panel, voice and brain code | Lazy chunk, loaded on first open |
| Animation loops | CSS animations only, paused when minimised, closed or under reduced motion |
| Voice resources | Recognition and synthesis are cancelled on close, page hide and unmount |
| Lighthouse | Re-run after the change |

## 9. Implementation plan

1. **Phase 1:** character SVG with a 9-state machine; launcher and panel; text chat on the local brain; mobile layout and accessibility.
2. **Phase 2:** recognition and synthesis adapters; English and Hindi; interrupt, mute, replay and stop; boundary-driven mouth.
3. **Phase 3:** `Brain` interface with local and remote providers; the `guide-api/` endpoint template and knowledge pack; documentation.
4. **Phase 4:** navigation intents ("open RupeeRadar", "I'm a recruiter") using the existing router.
5. **Phase 5:** unit tests (state machine, language, brain grounding and refusals); Playwright tests (widget, typing, mocked speech, interrupt, keyboard, mobile, reduced motion); the full existing suite; the audit; Lighthouse.

## 10. Files

**New**
- `src/guide/*`: machine, language, brain, voice, character, launcher and panel.
- `tests/unit/guide.test.ts`
- `tests/e2e/guide.spec.ts`
- `guide-api/*`: the endpoint template, knowledge-pack builder and README.
- `audit/AI-GUIDE.md`

**Modified**
- `src/root.tsx`: mounts the launcher.
- `src/app.css`: guide animations.
- `src/lib/analytics.ts`: guide event names.
- `app/README.md`: configuration.

No framework migration and no new runtime dependency are needed.
