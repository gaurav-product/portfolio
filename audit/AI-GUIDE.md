# Gaurav.OS AI Guide — "Oz" — handover

Status date: 6 Nov 2026. Branch `claude/beautiful-goldberg-radrlu`. **Not deployed.** Deploying needs the owner's approval.

## 1. Summary

Oz is an original cartoon mascot that floats on every page of the portfolio except `/cv` and print.

**Look and feel**
- An emerald jelly-bean body with a sprout antenna and big eyes.
- On desktop, the eyes follow the cursor. Oz blinks, bobs, dances now and then, and squishes when poked.
- Visitors can drag Oz anywhere. Keyboard users can move it with the arrow keys. The position is remembered.

**Conversation**
- Visitors type or speak a question in English, Hindi (Devanagari) or Hinglish (Hindi in Roman script).
- Oz answers **only from the portfolio's own verified content**. Anything else gets the refusal line:
  > "I don't have verified information about that yet. You can explore Gaurav's portfolio or contact him directly."
- Oz can open pages: "open RupeeRadar", "take me to the contact page".

**Moods**
- Oz has 9 visible states: sleeping, greeting, idle, listening, thinking, speaking, happy, confused and error.
- Each state has its own face, mouth and extras: zzz, sound waves, thinking dots, sparkles, a question mark, a sweat drop.

**Sound**
- Oz never makes a sound or uses the microphone unless the visitor asks.
- Voice replies are **off by default**. The speaker button turns them on and the choice is remembered.
- A question asked by voice is answered aloud, because the visitor chose voice.

## 2. Architecture

```
root.tsx ── <GuideRoot/>  (every page; ~12–19 KB transfer: launcher, mascot SVG, CSS, state)
              │  state machine (machine.ts), position/drag, cursor-follow, bubbles, idle moods
              └─ lazy chunk: GuidePanel.tsx (loads on first open)
                   ├─ brain:  local.ts  (default, on-device, grounded)  |  remote.ts (optional, VITE_GUIDE_API_URL)
                   ├─ voice:  tts.ts (speechSynthesis)  stt.ts (Web Speech recognition)
                   └─ lang.ts (detect en / hi / hinglish, explicit "in Hindi" overrides)
guide-api/ (repo root, NOT deployed) — server endpoint that holds the AI key; grounded by a knowledge
           pack generated from app/src/content (app/scripts/build-guide-knowledge.mjs)
```

- **State machine.** `next(state, event)` is pure. Events that don't apply in the current state are ignored, which removes race conditions such as a late `SPEECH_END` after the panel has closed.
- **Local brain.** It runs in this order:
  1. Refuses questions about figures the portfolio doesn't hold (revenue, users, salary…).
  2. Matches templated intents built from the content modules: projects, experience, AI work, recruiter, contact, education, tools, newsletter and navigation.
  3. Falls back to the existing Ask Gaurav knowledge base.
  4. Then falls back to related search results.
  5. Otherwise refuses.

  Hindi answers are built from the data fields. Knowledge-base answers are never machine-translated: they are shown in English with a note.
- **Remote brain.** It is used only if the site is built with `VITE_GUIDE_API_URL`. It has a 12 s timeout and validates the response shape, accepting only internal links. On any failure it falls back to the local brain and labels the answer "Verified local answer (AI service unavailable)".
- **Lip-sync.** Where the speech engine reports word boundaries, they open the mouth. Otherwise a CSS talk loop runs while audio plays. It is not phoneme-accurate.

## 3. Files

**New**
- `app/src/guide/`:
  - `machine.ts`, `lang.ts`, `Oz.tsx`, `guide.css`, `GuideRoot.tsx`, `GuidePanel.tsx`, `knowledge.ts`
  - `brain/types.ts`, `brain/local.ts`, `brain/remote.ts`
  - `voice/tts.ts`, `voice/stt.ts`
- `app/scripts/build-guide-knowledge.mjs`
- `guide-api/`: `src/handler.ts`, `src/worker.ts`, `src/knowledge.generated.ts`, `README.md`, `package.json`, `tsconfig.json`, `wrangler.toml`, `.gitignore`
- `app/tests/unit/guide.test.ts` (18 tests) and `app/tests/e2e/guide.spec.ts` (11 tests)
- `audit/AI-GUIDE-PHASE-0.md` (audit), this file, and `audit/screens/oz/*.png`

**Changed**
- `app/src/root.tsx`: mounts `<GuideRoot/>`.
- `app/src/lib/analytics.ts`: adds 5 guide events.
- `app/src/content/kb.ts`: the products answer now names all 8 projects.
- `app/src/content/newsletter.ts`, `experience.ts`, unit test: The Teardown now shows **800 subscribers** (owner-stated, Nov 2026).
- `public/media/gaurav-kumar-singh-cv.pdf`: regenerated.

**Dependencies**
- The site has no new dependencies.
- `guide-api` adds `@anthropic-ai/sdk` (server only).

## 4. AI and voice configuration

| Variable | Where | Secret | Purpose |
|---|---|---|---|
| `VITE_GUIDE_API_URL` | site build | no (public URL) | turns on the remote brain |
| `AI_API_KEY` | guide-api server secret | **yes** | Anthropic key; never in the site |
| `AI_PROVIDER` | guide-api | no | `anthropic` or `mock` |
| `AI_MODEL` | guide-api | no | default `claude-opus-5-5` |
| `ALLOWED_ORIGIN` | guide-api | no | exact site origin for CORS |

- **Refusal fallback.** The endpoint sends `fallbacks: "default"` with beta header `server-side-fallback-2026-07-01`. If the model declines a request on policy grounds, the API retries it on Anthropic's recommended fallback model. If the final `stop_reason` is still `"refusal"`, the visitor gets the refusal line.
- **Request limits.**
  - Message: 500 characters.
  - History: 6 turns.
  - Body: 8 KB.
  - Rate: 12 requests per minute per IP (best effort, per instance).
- **Privacy.** Nothing is logged or stored. Error messages are generic.
- **Voice.**
  - **Speaking.** Speech uses the browser's `speechSynthesis` and prefers en-IN and hi-IN voices. Hinglish is read with an en-IN voice.
  - **Listening.** Recognition uses Web Speech in `en-IN`, or `hi-IN` when Hindi is chosen. It handles one utterance per press. Audio is never recorded or stored by the site.

## 5. Browser limits (honest)

- **Microphone.** Speech input works in Chrome, Edge and Safari. **Firefox has none**, so Oz says so and offers typing. Chrome sends audio to Google's speech service; that is the browser's behaviour, not the site's. The microphone needs HTTPS, which GitHub Pages provides.
- **Voices.** Which voices exist depends on the device. Many desktops have no hi-IN voice, so Hindi text is then read by the closest available voice or not at all. A device with no voices gets a one-time message, and the answers stay as text.
- **Lip-sync.** It is approximate: word-boundary pulses, or a loop.

## 6. Test results (this branch, 6 Nov 2026)

- `tsc`: clean. `guide-api` `tsc --noEmit`: clean.
- Vitest: **71/71**, including 18 guide tests:
  - state machine;
  - language detection;
  - grounding and refusals in all 3 languages;
  - the project list matches the data;
  - navigation intents;
  - remote response validation;
  - speech text cleaning;
  - chunking and voice choice;
  - knowledge pack.
- Playwright, all projects: **71/71**. The 11 guide tests cover:
  - Oz is on every page except `/cv`;
  - the conversation survives navigation;
  - no automatic sound or microphone;
  - grounded answer and refusal;
  - Hindi and Hinglish;
  - speaking with en-IN and interrupting;
  - microphone happy path;
  - microphone permission denied;
  - keyboard open, Escape and focus return, arrow keys;
  - drag versus click, and the position persisting after reload;
  - reduced motion turns off animation;
  - mobile fit with no overflow.

  The speech engines were **fakes** in these tests: headless Chromium has no voices or microphone. The tests prove the wiring, not real voice quality.
- **Accessibility crawler.** 310 routes × desktop and mobile: **0 problems**.
- **Lighthouse.**
  - Accessibility, best practices and SEO: 100 on every audited page.
  - Desktop performance: 97–100.
  - Mobile performance: 86–93, which is **1–2 points below the previous commit** (home 88 → 86). The cost is the always-loaded launcher (+12–19 KB transfer).
- **guide-api, local tests without a key:**
  - 405, 400, 413, 403 (wrong origin), 503 (no key);
  - mock mode;
  - link filtering.

  **It has never been called against the live Anthropic API.**

## 7. Desktop and mobile verification

The screenshots are in `audit/screens/oz/`:

1. Launcher (desktop)
2. Oz close-up
3. Greeting
4. Projects answer
5. Refusal (confused face)
6. Hindi
7. Mobile launcher
8. Mobile Hinglish

**Not checked on real hardware:** a real iPhone or Android device, Safari, and real microphones and voices.

## 8. Remaining issues

- Live AI is unverified until the endpoint is deployed with a key.
- Mobile Lighthouse performance is down 1–2 points. Possible fix: mount the launcher after the browser is idle.
- On desktop, the panel subtitle "Gaurav.OS AI Guide" is truncated next to the controls. This is cosmetic.
- Hindi answers that come from the Ask Gaurav knowledge base are shown in English with a note. This is deliberate, to avoid machine-translating facts.
- The rate limit in guide-api is per instance only. Add a platform rule for a hard limit.

## 9. Commands

These commands run from `app/`.

Type-check:

```bash
npm run typecheck
```

Unit tests:

```bash
npm test
```

Build, then end-to-end tests:

```bash
npm run build && npx playwright test --trace off
```

Accessibility crawler:

```bash
npm run audit
```

Lighthouse:

```bash
npm run lighthouse
```

Regenerate the AI knowledge pack after content edits:

```bash
node scripts/build-guide-knowledge.mjs
```

## 10. Deployment

**Site.** The existing Pages workflow is unchanged. Oz ships with the local brain and needs no secrets.

**Live AI (optional, needs approval):** follow `guide-api/README.md` → "Deploy".
1. Store `wrangler secret put AI_API_KEY`.
2. Run `wrangler deploy`.
3. Smoke-test with curl.
4. Set the Actions variable `VITE_GUIDE_API_URL`.
5. Rebuild the site.

## 11. Checklist

**Completed and verified**
- [x] Original cartoon mascot, 9 states, cursor-following eyes, blink, float, dance, poke
- [x] On every page, survives navigation, draggable and keyboard-movable, position remembered, hidden on `/cv` and in print
- [x] Cheeky text bubbles: at most one per visit, never with sound
- [x] Text chat, grounded answers, refusal line in 3 languages, links, page navigation
- [x] English, Hindi and Hinglish detection, with explicit language switching
- [x] Voice output with Indian voices preferred, Replay and Stop, interrupt by speaking, speed control
- [x] Voice input, one utterance per press, with clear messages for denied, no microphone, unsupported and network errors
- [x] Accessibility: labelled controls, live status, Escape, focus return, reduced motion; crawler finds 0 problems
- [x] No key in the browser; remote brain only through a server; mock mode
- [x] Unit, e2e, crawler and Lighthouse runs, with screenshots

**Needs credentials or approval**
- [ ] Deploy `guide-api` (owner approval plus `AI_API_KEY`)
- [ ] Set `VITE_GUIDE_API_URL` and rebuild
- [ ] Verify live AI answers stay grounded, using a few real questions and refusal probes
- [ ] Optional neural TTS provider; the `TTS` adapter interface is ready

**Not verified here**
- [ ] Real devices: iOS Safari, Android Chrome, real microphones and voices
