# The Teardown, Interview Radar and Repass: preserve their 3D experiences or redirect?

Status: 7 Nov 2026. **Comparison only; nothing is removed or changed.** This decision gates the 90-study Earth implementation.

Fixed by the owner:
- None of the three goes on the 90-study Earth.
- None goes into the `/worlds` hub, which is for the 7 actual projects only.
- The Teardown is a separate writing destination.
- The concepts stay under `/ventures`, labelled as concepts in development.

## 1. What each 3D experience contains today

| Experience | Building | Content inside | Case-study floors | Entry points today |
|---|---|---|---|---|
| The Teardown (`/universe/the-teardown`) | Teardown workshop (procedural) | **1 panel:** the owner-supplied brand artwork. The side panel shows the newsletter facts (weekly, LinkedIn, 800 subscribers, self-reported) and the subscribe link. | none | Only the Earth marker |
| Interview Radar (`/universe/interview-radar`) | Recruitment command centre (procedural; its "live opportunities" board is labelled CONCEPT VISUAL) | **3 concept boards** (vision, proposed features, business-model hypotheses), all text-only and labelled concept visuals. The side panel holds the full concept text. | none | Earth marker; `/ventures` card "Visit in 3D"; `/ventures/interview-radar` "Visit in the 3D universe"; Oz |
| Repass (`/universe/repass`) | Ticket hall (procedural; floating "ADMIT ONE — concept" tickets) | **4 concept boards** (vision, features, business-model hypotheses, illustrative example labelled "not transaction data"); full concept text including the legal and trust limits | none | Earth marker; `/ventures` card; `/ventures/repass`; Oz |

**All three are honest. None shows product screens or fabricated results.**
- **The Teardown's world is thin:** one image and a summary.
- **The two concept worlds have more:** distinct buildings plus 3–4 labelled boards.
- **None has case-study floors,** so Phase 7's floor navigation would not apply to them under either option.

## 2. The options

### Option A: preserve each experience at its own separate route

| Item | Detail |
|---|---|
| New routes | `/writing/the-teardown`; `/ventures/interview-radar/world`; `/ventures/repass/world` |
| Old URLs | `/universe/the-teardown`, `/universe/interview-radar`, `/universe/repass` redirect to the new routes |
| How visitors get there | **The Teardown:** a new "See it in 3D" link in the Writing section on `/about`, its only home besides LinkedIn. **Concepts:** the existing "Visit in 3D" buttons on `/ventures` and the concept pages, re-pointed. **Oz:** "take me to Repass" opens the concept page and offers "in 3D". |
| Inside the world | Same building, panels and side panel. The back button leads to the experience's own home: `/about#writing-h` for The Teardown, `/ventures/<slug>` for the concepts. **Not** to the Earth or `/worlds`. |
| Implementation | The world view becomes route-configurable (back target, label, which content source). The building and panel code is reused unchanged. |
| Pages | 334 → **337** |
| Bundle | Unchanged (the same lazy world chunk) |
| Tests | Concept-world tests move to the new routes; redirect tests are added |
| Maintenance | 3 extra worlds to keep in step with design-system and Phase 7 changes. The Teardown world needs no case-study floors. |
| SEO | Each world gets its own canonical URL and title. Low search value for the thin Teardown world. |
| Discoverability | Lower than today, because the Earth marker disappears and the hub excludes them. The 3D worlds become a "bonus" reached only from their own pages. |

### Option B: redirect to their regular content pages (retire the 3D experiences)

| Item | Detail |
|---|---|
| Old URLs | `/universe/the-teardown` → `/about#writing-h`; `/universe/interview-radar` → `/ventures/interview-radar`; `/universe/repass` → `/ventures/repass` |
| What visitors lose | The workshop, command-centre and ticket-hall scenes and their 3D boards. **No content is lost:** every word on the boards already appears on `/ventures/<slug>` and on `/about`. |
| UI changes | The "Visit in 3D" buttons are removed from `/ventures`, the concept pages and the `/projects` Emerging Ventures section. Oz links point to the concept pages. |
| Code | The Workshop, Command and Hall building archetypes and the concept-board panels become unused. They could stay in the code base, but unused code drifts, so they would be removed in the same change. |
| Pages | **334** |
| Tests | Concept-world tests are replaced by redirect tests |
| Maintenance | Fewer surfaces |
| Discoverability | Content is where people already look: `/ventures` and `/about` |

### Option C: hybrid (for completeness)

Keep the two concept worlds under `/ventures/<slug>/world` (Option A for the concepts) and redirect The Teardown (Option B), because its world adds little beyond one image.

**Pages: 336.**

## 3. Consequences side by side

| | A: preserve | B: redirect | C: hybrid |
|---|---|---|---|
| 3D experiences kept | 3 | 0 | 2 (concepts) |
| Content preserved | All | All (already on regular pages) | All |
| Routes | 337 | 334 | 336 |
| Code kept | All three archetypes | Three archetypes retired | Command and Hall kept; Workshop retired |
| New links needed | `/about` "See it in 3D"; "Visit in 3D" re-pointed | Remove "Visit in 3D" buttons | Concept links re-pointed; Teardown none |
| Separation from Earth and `/worlds` | Yes | Yes | Yes |
| Old URLs | Redirect to the new 3D routes | Redirect to content pages | Mixed |
| Extra test and maintenance load | Highest | Lowest | Middle |
| Risk | Low | Low | Low |

**Effort.** All three options are small next to the Earth work itself. A and C add about 150–250 lines for the configurable world route and links; B removes about 300 lines.

## 4. What I need from you

Choose **A**, **B** or **C**. Nothing is removed until you decide, and the 90-study Earth implementation stays on hold until then.
