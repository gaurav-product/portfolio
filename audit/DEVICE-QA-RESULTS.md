# Device QA results (R1 + R2)

Plan: [R1-R2-IMPLEMENTATION.md §6](R1-R2-IMPLEMENTATION.md). Build: branch `claude/beautiful-goldberg-radrlu` at `310332f` plus the uncommitted R1+R2 patch, served over the LAN preview (`http://192.168.1.4:4173`, PID 23384).

Rules: every number in this table was measured by the tester on the device. Anything not measured says "not measured". Observations (warmth, smoothness) are marked as observed. Nothing here is filled in by assumption.

Status values: PENDING · PASS · FAIL · BLOCKED · PARTIAL

| ID | Device · OS · browser | URL | Steps | Expected | Actual | Measured vs observed | Evidence | Frequency | Severity | Status | Date |
|---|---|---|---|---|---|---|---|---|---|---|---|
| D1 | Google Pixel (model not given) · Android "latest" (as reported; exact version not recorded) · Chrome (version not recorded) · on Wi-Fi Airtel_shiv_0298 | `/universe?intro=1` | Fresh incognito tab; time to title card; intro play or Skip; time to usable Earth; sound check | Title card at once; intro plays or skips; silent until tapped | — | — | — | — | — | PENDING | — |
