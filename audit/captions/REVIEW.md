# Introduction film captions: draft for owner review

**Status: NOT APPROVED. Not published. The site has no caption track.**

- **Film:** `Gaurav_OS_Master_45s_FINAL.mp4`, received 16 Nov 2026. SHA-1 `6853682f16ff554594b631377d7f4514005251cd`. Served as `app/public/media/gaurav-os-intro-45s.mp4`, with identical streams.
- **How the draft was made:** fully locally, with ffmpeg 9.0.2's `whisper` filter (whisper.cpp) and the free `ggml-small.en` model. The audio was resampled to 16 kHz. No cloud service was used.
- **Raw output:** `gaurav-os-intro-45s.machine-draft.vtt`, exactly as the model produced it. Nothing in it has been corrected.

## What needs your check

The model mishears names. The "likely intended" column is only a guess, based on names that already appear in the portfolio. It has **not** been checked against the audio by a person. Please listen and confirm or correct each row.

| Time | Machine heard | Likely intended (unverified) | Confirmed by Gaurav |
|---|---|---|---|
| 0:10.3 | "At IWA Mastu, I shipped as an Associate Product Manager." | "At Evamastu, I shipped as an Associate Product Manager." | ☐ |
| 0:14.1 | "On my own, RO, CareConnect, Ghargan, Nexus, Rupi Reda." | "On my own: Aaroh, CareConnect, GharGyaan, Nexus, RupeeRadar." | ☐ |
| 0:19.4–0:21.6 | "Each labor. / for exactly what it is." | "Each labelled for exactly what it is." (?) | ☐ |
| 0:23.4 | "And a phone pick app." | Unclear. Perhaps a reference to the PhonePe case study / capstone. **Please supply the exact words.** | ☐ |
| 0:39.98 | "This is Gaurav.os" | "This is Gaurav.OS." | ☐ |

The other lines read correctly as written, but a person still needs to check them against the audio:
- 0:00 "I'm Gaurav. I build products at the intersection of people, technology and AI."
- 0:05 "I start with real problems and turn them into clear product experiences."
- 0:24.8 "Then 90 product case studies in public."
- 0:28.6 "I share what I learn, what I build, and what doesn't work."
- 0:32.5 "From discovery to execution, I use AI to move faster, think deeper, and build smarter."

## Content check

As far as the transcript can be read, nothing spoken contradicts the portfolio's evidence:
- Evamastu: "shipped as an Associate Product Manager"
- Personal projects listed without launch claims
- "90 product case studies in public"

The on-screen status labels in the film also match the site:
- Evamastu: shipped employer product
- Aaroh: pre-launch prototype
- GharGyaan: prototype, demo mode
- Nexus: prototype, demo mode
- RupeeRadar: prototype, not deployed
- PhonePe Smart Spend Coach: academic case study

## To publish captions

1. Correct the table above, or send the exact script.
2. Then a reviewed `gaurav-os-intro-45s.en.vtt` can go into `app/public/media/`, attached to both players with `<track kind="captions" srclang="en" default>`.
