# Interaction inventory

Generated 2026-11-02T15:31:28.351Z by `tests/e2e/controls.spec.ts`.

| Metric | Value |
|---|---|
| Prerendered routes crawled | 303 |
| Control instances checked | 13714 |
| Unique controls (header/footer counted once) | 3729 |
| Links / buttons / fields | 3475 / 169 / 85 |
| Failures | **0** |

Each control is checked for: a real destination (internal routes and anchors resolve, downloads return 200, external links open safely), an accessible name, a real handler (React onClick or form submit), and labelled form fields. Behaviour of the stateful controls (calculators, boards, exports, search, Ask, Explore) is covered by the journeys in `tests/e2e/journeys.spec.ts`.

## Global controls (header and footer)

| Region | Kind | Name | Expected action | Instances | Result |
|---|---|---|---|---|---|
| header | link | Gaurav.OS — home | navigate → / | 303 | PASS |
| header | link | Home | navigate → / | 303 | PASS |
| header | link | About | navigate → /about | 303 | PASS |
| header | link | Experience | navigate → /experience | 304 | PASS |
| header | link | Projects | navigate → /projects | 303 | PASS |
| header | link | Case Studies | navigate → /case-studies | 303 | PASS |
| header | link | Product Thinking | navigate → /product-thinking | 303 | PASS |
| header | link | Research | navigate → /research | 303 | PASS |
| header | link | Product Atlas | navigate → /atlas | 303 | PASS |
| header | link | AI Lab | navigate → /ai-lab | 303 | PASS |
| header | link | Contact | navigate → /contact | 304 | PASS |
| header | link | Explore Mode | navigate → /explore | 303 | PASS |
| header | link | Recruiter Mode | navigate → /recruiter | 303 | PASS |
| header | link | CV | download /media/gaurav-kumar-singh-cv.pdf | 303 | PASS |
| footer | link | Home | navigate → / | 303 | PASS |
| footer | link | About | navigate → /about | 303 | PASS |
| footer | link | Experience | navigate → /experience | 303 | PASS |
| footer | link | Projects | navigate → /projects | 303 | PASS |
| footer | link | Case Studies | navigate → /case-studies | 303 | PASS |
| footer | link | Product Thinking | navigate → /product-thinking | 303 | PASS |
| footer | link | Research | navigate → /research | 303 | PASS |
| footer | link | Product Atlas | navigate → /atlas | 303 | PASS |
| footer | link | AI Lab | navigate → /ai-lab | 303 | PASS |
| footer | link | Contact | navigate → /contact | 303 | PASS |
| footer | link | Skills | navigate → /skills | 303 | PASS |
| footer | link | Lab Notes | navigate → /lab-notes | 303 | PASS |
| footer | link | Recruiter Mode | navigate → /recruiter | 303 | PASS |
| footer | link | Explore Mode | navigate → /explore | 303 | PASS |
| footer | link | gauravkumarsingh773@gmail.com | navigate → mailto:gauravkumarsingh773@gmail.com | 303 | PASS |
| footer | link | LinkedIn | navigate → https://www.linkedin.com/in/gaurav-singh-product | 303 | PASS |
| footer | link | GitHub | navigate → https://github.com/gaurav-product | 303 | PASS |
| footer | link | Download CV (PDF) | download /media/gaurav-kumar-singh-cv.pdf | 303 | PASS |
| header | button | Search the portfolio | run handler | 303 | PASS |
| header | button | Export Markdown | run handler | 4 | PASS, PASS (disabled, explained) |
| header | button | Reset | run handler | 6 | PASS |
| header | button | Start blank | run handler | 1 | PASS |
| header | link | All projects | navigate → /projects | 7 | PASS |
| header | link | github.com/gaurav-product/careconnect | navigate → https://github.com/gaurav-product/careconnect | 1 | PASS |
| header | link | the public repository | navigate → https://github.com/gaurav-product/product-management-case-studies | 1 | PASS |
| header | link | Download CV | download /media/gaurav-kumar-singh-cv.pdf | 2 | PASS |
| header | field | Search query | input (search) | 1 | PASS |
| header | button | Add decision | run handler | 1 | PASS |
| header | button | Export CSV | run handler | 3 | PASS |
| header | button | Add feature | run handler | 1 | PASS |
| header | link | github.com/gaurav-product/ghargyaan | navigate → https://github.com/gaurav-product/ghargyaan | 1 | PASS |
| header | link | github.com/gaurav-product/nexus | navigate → https://github.com/gaurav-product/nexus | 1 | PASS |
| header | button | Add step | run handler | 1 | PASS |
| header | link | product-management-case-studies | navigate → https://github.com/gaurav-product/product-management-case-studies | 1 | PASS |
| header | link | phonepe-smart-spend-coach-capstone | navigate → https://github.com/gaurav-product/phonepe-smart-spend-coach-capstone | 1 | PASS |
| header | button | Reset board | run handler | 1 | PASS |
| header | link | github.com/gaurav-product/aaroh | navigate → https://github.com/gaurav-product/aaroh | 1 | PASS |
| header | link | Email | navigate → mailto:gauravkumarsingh773@gmail.com | 1 | PASS |
| header | link | LinkedIn | navigate → https://www.linkedin.com/in/gaurav-singh-product | 1 | PASS |

## Page controls

### `/`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Explore my work | navigate → /projects | PASS |
| link | Recruiter Mode | navigate → /recruiter | PASS |
| link | Download CV | download /media/gaurav-kumar-singh-cv.pdf | PASS |
| link | Contact | navigate → /contact | PASS |
| link | How evidence is labelled | navigate → /about#evidence | PASS |
| link | Product Leadership | navigate → /explore?d=product-leadership | PASS |
| link | HealthTech Innovation | navigate → /explore?d=healthtech-innovation | PASS |
| link | AI & Safety Lab | navigate → /explore?d=ai-safety-lab | PASS |
| link | Research & Analytics | navigate → /explore?d=research-analytics | PASS |
| link | Experience & Growth | navigate → /explore?d=experience-growth | PASS |
| link | Knowledge & HQ | navigate → /explore?d=knowledge-hq | PASS |
| link | All projects | navigate → /projects | PASS |
| link | Evamastu | navigate → /projects/evamastu | PASS |
| link | Aaroh | navigate → /projects/aaroh | PASS |
| link | CareConnect | navigate → /projects/careconnect | PASS |
| link | GharGyaan | navigate → /projects/ghargyaan | PASS |
| link | PhonePe Smart Spend Coach | navigate → /projects/phonepe-smart-spend-coach | PASS |
| link | CASE STUDIES How each project was framed, decided and measured Read the case stu | navigate → /case-studies | PASS |
| link | Open the skills library | navigate → /skills | PASS |
| link | Discovery 17 demonstrated in work | navigate → /skills?category=Discovery | PASS |
| link | Product Strategy 12 demonstrated in work | navigate → /skills?category=Product%20Strategy | PASS |
| link | Execution 20 demonstrated in work | navigate → /skills?category=Execution | PASS |
| link | Analytics 13 demonstrated in work | navigate → /skills?category=Analytics | PASS |
| link | Growth 11 demonstrated in work | navigate → /skills?category=Growth | PASS |
| link | Design 10 demonstrated in work | navigate → /skills?category=Design | PASS |
| link | AI 17 demonstrated in work | navigate → /skills?category=AI | PASS |
| link | Healthcare 16 demonstrated in work | navigate → /skills?category=Healthcare | PASS |
| link | Technical 5 demonstrated in work | navigate → /skills?category=Technical | PASS |
| link | Communication & Collaboration 8 demonstrated in work | navigate → /skills?category=Communication%20%26%20Collaboration | PASS |
| link | Product Thinking | navigate → /product-thinking | PASS |
| link | Try the RICE calculator | navigate → /product-thinking/rice | PASS |
| link | Full timeline | navigate → /experience | PASS |
| link | MAY 2025 – APR 2026 · FULL-TIME Associate Product Manager Adhyatm Sadhna Kendra  | navigate → /experience/apm-adhyatm-sadhna-kendra | PASS |
| link | NOV 2024 – APR 2025 · INTERNSHIP Product Management Intern Adhyatm Sadhna Kendra | navigate → /experience/pm-intern-adhyatm-sadhna-kendra | PASS |
| link | SEP 2022 – JUL 2024 · REMOTE ROLE Research Expert Live Your Best Life (USA) · Re | navigate → /experience/research-expert-lybl | PASS |
| link | Research library | navigate → /research | PASS |
| link | Product Atlas | navigate → /atlas | PASS |
| link | LAB NOTE · DRAFT What building an AI health product taught me about AI UX | navigate → /lab-notes/ai-health-product-ai-ux | PASS |
| link | LAB NOTE · DRAFT Why I changed the CareConnect hypothesis | navigate → /lab-notes/why-i-changed-careconnect-hypothesis | PASS |
| link | Recruiter Mode | navigate → /recruiter | PASS |
| link | Get in touch | navigate → /contact | PASS |
| button | Watch the intro film (1:05) | run handler | PASS |
| button | Intro film | run handler | PASS |

### `/about`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Open the library | navigate → /research | PASS |
| link | Open on LinkedIn | navigate → https://www.linkedin.com/in/gaurav-singh-product | PASS |
| link | Skills library with evidence | navigate → /skills | PASS |

### `/ai-lab`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Full case study | navigate → /projects/ghargyaan | PASS |
| link | PRE-LAUNCH · PROTOTYPE Aaroh A non-diagnostic health platform: 20+ discovery int | navigate → /projects/aaroh | PASS |
| link | PROTOTYPE · DEMO MODE Nexus A situation inbox over email, calendar and documents | navigate → /projects/nexus | PASS |
| button | What products has Gaurav worked on? | run handler | PASS |
| button | What is his product discovery experience? | run handler | PASS |
| button | Tell me about Evamastu. | run handler | PASS |
| button | What is his AI product experience? | run handler | PASS |
| button | What does he know about product analytics? | run handler | PASS |
| button | What are his healthcare product projects? | run handler | PASS |
| button | What are his strongest case studies? | run handler | PASS |
| button | What tools has he used? | run handler | PASS |
| button | Send | submit form | PASS |
| button | Clear conversation | run handler | PASS (disabled at load) |
| field | Your question | input (text) | PASS |

### `/ask`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| button | What products has Gaurav worked on? | run handler | PASS |
| button | What is his product discovery experience? | run handler | PASS |
| button | Tell me about Evamastu. | run handler | PASS |
| button | What is his AI product experience? | run handler | PASS |
| button | What does he know about product analytics? | run handler | PASS |
| button | What are his healthcare product projects? | run handler | PASS |
| button | What are his strongest case studies? | run handler | PASS |
| button | What tools has he used? | run handler | PASS |
| button | Send | submit form | PASS |
| button | Clear conversation | run handler | PASS (disabled at load) |
| field | Your question | input (text) | PASS |

### `/atlas`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | — | navigate → /research/1 | PASS |
| link | — | navigate → /research/2 | PASS |
| link | — | navigate → /research/3 | PASS |
| link | — | navigate → /research/4 | PASS |
| link | — | navigate → /research/5 | PASS |
| link | — | navigate → /research/6 | PASS |
| link | — | navigate → /research/7 | PASS |
| link | — | navigate → /research/8 | PASS |
| link | — | navigate → /research/9 | PASS |
| link | — | navigate → /research/10 | PASS |
| link | — | navigate → /research/11 | PASS |
| link | — | navigate → /research/12 | PASS |
| link | — | navigate → /research/13 | PASS |
| link | — | navigate → /research/14 | PASS |
| link | — | navigate → /research/15 | PASS |
| link | — | navigate → /research/16 | PASS |
| link | — | navigate → /research/17 | PASS |
| link | — | navigate → /research/18 | PASS |
| link | — | navigate → /research/19 | PASS |
| link | — | navigate → /research/20 | PASS |
| link | — | navigate → /research/21 | PASS |
| link | — | navigate → /research/22 | PASS |
| link | — | navigate → /research/23 | PASS |
| link | — | navigate → /research/24 | PASS |
| link | — | navigate → /research/25 | PASS |
| link | — | navigate → /research/26 | PASS |
| link | — | navigate → /research/27 | PASS |
| link | — | navigate → /research/28 | PASS |
| link | — | navigate → /research/29 | PASS |
| link | — | navigate → /research/30 | PASS |
| link | — | navigate → /research/31 | PASS |
| link | — | navigate → /research/32 | PASS |
| link | — | navigate → /research/33 | PASS |
| link | — | navigate → /research/34 | PASS |
| link | — | navigate → /research/35 | PASS |
| link | — | navigate → /research/36 | PASS |
| link | — | navigate → /research/37 | PASS |
| link | — | navigate → /research/38 | PASS |
| link | — | navigate → /research/39 | PASS |
| link | — | navigate → /research/40 | PASS |
| link | — | navigate → /research/41 | PASS |
| link | — | navigate → /research/42 | PASS |
| link | — | navigate → /research/43 | PASS |
| link | — | navigate → /research/44 | PASS |
| link | — | navigate → /research/45 | PASS |
| link | — | navigate → /research/46 | PASS |
| link | — | navigate → /research/47 | PASS |
| link | — | navigate → /research/48 | PASS |
| link | — | navigate → /research/49 | PASS |
| link | — | navigate → /research/50 | PASS |
| link | — | navigate → /research/51 | PASS |
| link | — | navigate → /research/52 | PASS |
| link | — | navigate → /research/53 | PASS |
| link | — | navigate → /research/54 | PASS |
| link | — | navigate → /research/55 | PASS |
| link | — | navigate → /research/56 | PASS |
| link | — | navigate → /research/57 | PASS |
| link | — | navigate → /research/58 | PASS |
| link | — | navigate → /research/59 | PASS |
| link | — | navigate → /research/60 | PASS |
| link | — | navigate → /research/61 | PASS |
| link | — | navigate → /research/62 | PASS |
| link | — | navigate → /research/63 | PASS |
| link | — | navigate → /research/64 | PASS |
| link | — | navigate → /research/65 | PASS |
| link | — | navigate → /research/66 | PASS |
| link | — | navigate → /research/67 | PASS |
| link | — | navigate → /research/68 | PASS |
| link | — | navigate → /research/69 | PASS |
| link | — | navigate → /research/70 | PASS |
| link | — | navigate → /research/71 | PASS |
| link | — | navigate → /research/72 | PASS |
| link | — | navigate → /research/73 | PASS |
| link | — | navigate → /research/74 | PASS |
| link | — | navigate → /research/75 | PASS |
| link | — | navigate → /research/76 | PASS |
| link | — | navigate → /research/77 | PASS |
| link | — | navigate → /research/78 | PASS |
| link | — | navigate → /research/79 | PASS |
| link | — | navigate → /research/80 | PASS |
| link | — | navigate → /research/81 | PASS |
| link | — | navigate → /research/82 | PASS |
| link | — | navigate → /research/83 | PASS |
| link | — | navigate → /research/84 | PASS |
| link | — | navigate → /research/85 | PASS |
| link | — | navigate → /research/86 | PASS |
| link | — | navigate → /research/87 | PASS |
| link | — | navigate → /research/88 | PASS |
| link | — | navigate → /research/89 | PASS |
| link | — | navigate → /research/90 | PASS |
| link | 33 studies | navigate → /research?evidence=VERIFIED | PASS |
| link | 28 studies | navigate → /research?evidence=DOCUMENTED | PASS |
| link | 23 studies | navigate → /research?evidence=SOURCED | PASS |
| link | 6 studies | navigate → /research?evidence=NARRATIVE | PASS |
| button | All | run handler | PASS |
| button | Healthcare 24 | run handler | PASS |
| button | Consumer 22 | run handler | PASS |
| button | SaaS 7 | run handler | PASS |
| button | Marketplace 11 | run handler | PASS |
| button | Fintech 8 | run handler | PASS |
| button | AI 11 | run handler | PASS |
| button | B2B 6 | run handler | PASS |
| button | Analytics 1 | run handler | PASS |

### `/case-studies`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Evamastu | navigate → /projects/evamastu | PASS |
| link | Read the case study | navigate → /projects/evamastu | PASS |
| link | Executive summary | navigate → /projects/evamastu#summary | PASS |
| link | Metadata | navigate → /projects/evamastu#metadata | PASS |
| link | Research methodology | navigate → /projects/evamastu#methodology | PASS |
| link | Prioritization | navigate → /projects/evamastu#prioritization | PASS |
| link | PRD | navigate → /projects/evamastu#prd | PASS |
| link | Execution | navigate → /projects/evamastu#execution | PASS |
| link | Analytics | navigate → /projects/evamastu#analytics | PASS |
| link | Results | navigate → /projects/evamastu#results | PASS |
| link | Learnings | navigate → /projects/evamastu#learnings | PASS |
| link | Evidence | navigate → /projects/evamastu#evidence | PASS |
| link | Aaroh | navigate → /projects/aaroh | PASS |
| link | Read the case study | navigate → /projects/aaroh | PASS |
| link | Executive summary | navigate → /projects/aaroh#summary | PASS |
| link | Metadata | navigate → /projects/aaroh#metadata | PASS |
| link | Problem | navigate → /projects/aaroh#problem | PASS |
| link | Research methodology | navigate → /projects/aaroh#methodology | PASS |
| link | Insights | navigate → /projects/aaroh#insights | PASS |
| link | Vision | navigate → /projects/aaroh#vision | PASS |
| link | Strategy | navigate → /projects/aaroh#strategy | PASS |
| link | Prototype | navigate → /projects/aaroh#prototype | PASS |
| link | PRD | navigate → /projects/aaroh#prd | PASS |
| link | Analytics | navigate → /projects/aaroh#analytics | PASS |
| link | Risks | navigate → /projects/aaroh#risks | PASS |
| link | Next steps | navigate → /projects/aaroh#next | PASS |
| link | Evidence | navigate → /projects/aaroh#evidence | PASS |
| link | CareConnect | navigate → /projects/careconnect | PASS |
| link | Read the case study | navigate → /projects/careconnect | PASS |
| link | Executive summary | navigate → /projects/careconnect#summary | PASS |
| link | Metadata | navigate → /projects/careconnect#metadata | PASS |
| link | Problem | navigate → /projects/careconnect#problem | PASS |
| link | User segments | navigate → /projects/careconnect#segments | PASS |
| link | Insights | navigate → /projects/careconnect#insights | PASS |
| link | Product flows | navigate → /projects/careconnect#flows | PASS |
| link | Execution | navigate → /projects/careconnect#execution | PASS |
| link | Analytics | navigate → /projects/careconnect#analytics | PASS |
| link | Trade-offs | navigate → /projects/careconnect#tradeoffs | PASS |
| link | Risks | navigate → /projects/careconnect#risks | PASS |
| link | Next steps | navigate → /projects/careconnect#next | PASS |
| link | Evidence | navigate → /projects/careconnect#evidence | PASS |
| link | GharGyaan | navigate → /projects/ghargyaan | PASS |
| link | Read the case study | navigate → /projects/ghargyaan | PASS |
| link | Executive summary | navigate → /projects/ghargyaan#summary | PASS |
| link | Problem | navigate → /projects/ghargyaan#problem | PASS |
| link | Product flows | navigate → /projects/ghargyaan#flows | PASS |
| link | Experimentation | navigate → /projects/ghargyaan#experimentation | PASS |
| link | Risks | navigate → /projects/ghargyaan#risks | PASS |
| link | Evidence | navigate → /projects/ghargyaan#evidence | PASS |
| link | PhonePe Smart Spend Coach | navigate → /projects/phonepe-smart-spend-coach | PASS |
| link | Read the case study | navigate → /projects/phonepe-smart-spend-coach | PASS |
| link | Executive summary | navigate → /projects/phonepe-smart-spend-coach#summary | PASS |
| link | Metadata | navigate → /projects/phonepe-smart-spend-coach#metadata | PASS |
| link | Prioritization | navigate → /projects/phonepe-smart-spend-coach#prioritization | PASS |
| link | Experimentation | navigate → /projects/phonepe-smart-spend-coach#experimentation | PASS |
| link | Analytics | navigate → /projects/phonepe-smart-spend-coach#analytics | PASS |
| link | Learnings | navigate → /projects/phonepe-smart-spend-coach#learnings | PASS |
| link | Evidence | navigate → /projects/phonepe-smart-spend-coach#evidence | PASS |
| link | Nexus | navigate → /projects/nexus | PASS |
| link | Read the case study | navigate → /projects/nexus | PASS |
| link | Executive summary | navigate → /projects/nexus#summary | PASS |
| link | Strategy | navigate → /projects/nexus#strategy | PASS |
| link | Product flows | navigate → /projects/nexus#flows | PASS |
| link | Risks | navigate → /projects/nexus#risks | PASS |
| link | Evidence | navigate → /projects/nexus#evidence | PASS |

### `/contact`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | gauravkumarsingh773@gmail.com | navigate → mailto:gauravkumarsingh773@gmail.com | PASS |
| link | linkedin.com/in/gaurav-singh-product | navigate → https://www.linkedin.com/in/gaurav-singh-product | PASS |
| link | github.com/gaurav-product | navigate → https://github.com/gaurav-product | PASS |
| link | Download CV (PDF) | download /media/gaurav-kumar-singh-cv.pdf | PASS |
| link | View CV online | navigate → /cv | PASS |
| button | Copy email | run handler | PASS |
| button | Open in my email app | submit form | PASS |
| button | Clear | run handler | PASS |
| field | Your name | input (text) | PASS |
| field | Company or team (optional) | input (text) | PASS |
| field | Message | input (textarea) | PASS |

### `/cv`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Download PDF | download /media/gaurav-kumar-singh-cv.pdf | PASS |
| button | Print | run handler | PASS |

### `/experience`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Associate Product Manager | navigate → /experience/apm-adhyatm-sadhna-kendra | PASS |
| link | Role details | navigate → /experience/apm-adhyatm-sadhna-kendra | PASS |
| link | Evamastu case study | navigate → /projects/evamastu | PASS |
| link | Product Management Intern | navigate → /experience/pm-intern-adhyatm-sadhna-kendra | PASS |
| link | Role details | navigate → /experience/pm-intern-adhyatm-sadhna-kendra | PASS |
| link | Evamastu case study | navigate → /projects/evamastu | PASS |
| link | Research Expert | navigate → /experience/research-expert-lybl | PASS |
| link | Role details | navigate → /experience/research-expert-lybl | PASS |

### `/experience/apm-adhyatm-sadhna-kendra`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | All experience | navigate → /experience | PASS |
| link | Healthcare CV (November 2026) | navigate → /cv | PASS |
| link | Evamastu | navigate → /projects/evamastu | PASS |
| link | Product Management Intern | navigate → /experience/pm-intern-adhyatm-sadhna-kendra | PASS |

### `/experience/pm-intern-adhyatm-sadhna-kendra`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | All experience | navigate → /experience | PASS |
| link | Healthcare CV (November 2026) | navigate → /cv | PASS |
| link | Evamastu | navigate → /projects/evamastu | PASS |
| link | Associate Product Manager | navigate → /experience/apm-adhyatm-sadhna-kendra | PASS |
| link | Research Expert | navigate → /experience/research-expert-lybl | PASS |

### `/experience/research-expert-lybl`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | All experience | navigate → /experience | PASS |
| link | Healthcare CV (November 2026) | navigate → /cv | PASS |
| link | Product Management Intern | navigate → /experience/pm-intern-adhyatm-sadhna-kendra | PASS |

### `/explore`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Recruiter Mode | navigate → /recruiter | PASS |
| button | Reset camera | run handler | PASS |
| button | 2D map | run handler | PASS |
| button | Product Leadership | run handler | PASS |
| button | HealthTech Innovation | run handler | PASS |
| button | AI & Safety Lab | run handler | PASS |
| button | Research & Analytics | run handler | PASS |
| button | Experience & Growth | run handler | PASS |
| button | Knowledge & HQ | run handler | PASS |

### `/lab-notes`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | DRAFT WEEK 01 · AI PRODUCT · 4 MIN What building an AI health product taught me  | navigate → /lab-notes/ai-health-product-ai-ux | PASS |
| link | DRAFT WEEK 02 · PRODUCT STRATEGY · 3 MIN Why I changed the CareConnect hypothesi | navigate → /lab-notes/why-i-changed-careconnect-hypothesis | PASS |
| link | DRAFT WEEK 03 · RESEARCH · 3 MIN What discovery interviews changed about Aaroh T | navigate → /lab-notes/what-discovery-interviews-changed-about-aaroh | PASS |
| link | DRAFT WEEK 04 · PRODUCT ANALYTICS · 4 MIN What I learned from product funnel ana | navigate → /lab-notes/what-i-learned-from-funnel-analysis | PASS |
| link | DRAFT WEEK 05 · HEALTHCARE · 3 MIN Why AI features should begin with user proble | navigate → /lab-notes/ai-features-start-with-user-problems | PASS |
| button | All | run handler | PASS |
| button | AI Product | run handler | PASS |
| button | Product Strategy | run handler | PASS |
| button | Research | run handler | PASS |
| button | Product Analytics | run handler | PASS |
| button | Healthcare | run handler | PASS |

### `/lab-notes/ai-features-start-with-user-problems`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Lab Notes | navigate → /lab-notes | PASS |
| link | Previous note | navigate → /lab-notes/what-i-learned-from-funnel-analysis | PASS |

### `/lab-notes/ai-health-product-ai-ux`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Lab Notes | navigate → /lab-notes | PASS |
| link | Next note | navigate → /lab-notes/why-i-changed-careconnect-hypothesis | PASS |

### `/lab-notes/what-discovery-interviews-changed-about-aaroh`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Lab Notes | navigate → /lab-notes | PASS |
| link | Previous note | navigate → /lab-notes/why-i-changed-careconnect-hypothesis | PASS |
| link | Next note | navigate → /lab-notes/what-i-learned-from-funnel-analysis | PASS |

### `/lab-notes/what-i-learned-from-funnel-analysis`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Lab Notes | navigate → /lab-notes | PASS |
| link | Previous note | navigate → /lab-notes/what-discovery-interviews-changed-about-aaroh | PASS |
| link | Next note | navigate → /lab-notes/ai-features-start-with-user-problems | PASS |

### `/lab-notes/why-i-changed-careconnect-hypothesis`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Lab Notes | navigate → /lab-notes | PASS |
| link | Previous note | navigate → /lab-notes/ai-health-product-ai-ux | PASS |
| link | Next note | navigate → /lab-notes/what-discovery-interviews-changed-about-aaroh | PASS |

### `/product-thinking`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | RICE calculator Score features by Reach × Impact × Confidence ÷ Effort, sort and | navigate → /product-thinking/rice | PASS |
| link | MoSCoW board Sort scope into Must, Should, Could and Won't; move, reorder and re | navigate → /product-thinking/moscow | PASS |
| link | North Star builder Define an objective, a North Star, inputs and guardrails; exp | navigate → /product-thinking/north-star | PASS |
| link | Funnel explorer Edit steps and counts; see step and overall conversion. Sample o | navigate → /product-thinking/funnel | PASS |
| link | Experiment designer Hypothesis, arms, metrics, guardrails, duration and status;  | navigate → /product-thinking/experiment | PASS |
| link | PRD builder A structured PRD template you can fill and export as Markdown. Open | navigate → /product-thinking/prd | PASS |
| link | Decision log Record decisions with context, options and trade-offs; filter and e | navigate → /product-thinking/decisions | PASS |
| button | OBSERVE | run handler | PASS |
| button | FRAME | run handler | PASS |
| button | RESEARCH | run handler | PASS |
| button | HYPOTHESIZE | run handler | PASS |
| button | BUILD | run handler | PASS |
| button | MEASURE | run handler | PASS |
| button | LEARN | run handler | PASS |
| button | ITERATE | run handler | PASS |
| button | Previous | run handler | PASS |
| button | Next | run handler | PASS |
| button | RESEARCH | run handler | PASS |
| button | AI | run handler | PASS |
| button | HEALTHCARE | run handler | PASS |
| button | PRODUCT | run handler | PASS |
| button | BEHAVIOUR | run handler | PASS |
| field | A Ship a push-notification streak system to pull users back | input (radio) | PASS |
| field | B Find where in the first session users stop, and who they w | input (radio) | PASS |
| field | C Run a pricing experiment — low intent usually means low co | input (radio) | PASS |
| field | D Add more content so there is a reason to return | input (radio) | PASS |
| field | A Ship it with a disclaimer — users are explicitly asking fo | input (radio) | PASS |
| field | B Ship it to a small cohort and measure satisfaction | input (radio) | PASS |
| field | C Set the boundary as a product invariant before the demand  | input (radio) | PASS |
| field | D Delay the decision until there is more usage data | input (radio) | PASS |
| field | A Ship the original scope — the date is a commitment, learni | input (radio) | PASS |
| field | B Stop, reposition the product, and document the contradicti | input (radio) | PASS |
| field | C Keep the build and reframe the messaging around the new ev | input (radio) | PASS |
| field | D Split the difference and build both directions | input (radio) | PASS |

### `/product-thinking/decisions`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Product Thinking | navigate → /product-thinking | PASS |
| link | Next tool: RICE calculator | navigate → /product-thinking/rice | PASS |
| button | Edit decision: Never diagnose — understand, explain, recommend, support | run handler | PASS |
| button | Delete decision: Never diagnose — understand, explain, recommend, support | run handler | PASS |
| button | Edit decision: Seal all commercial features pending legal review | run handler | PASS |
| button | Delete decision: Seal all commercial features pending legal review | run handler | PASS |
| button | Edit decision: Freeze the prototype instead of adding screens | run handler | PASS |
| button | Delete decision: Freeze the prototype instead of adding screens | run handler | PASS |
| button | Edit decision: Run a strategy reset on positioning and scope | run handler | PASS |
| button | Delete decision: Run a strategy reset on positioning and scope | run handler | PASS |
| field | Filter decisions | input (search) | PASS |
| field | Status
All
Proposed
Decided
Revisited | input (select-one) | PASS |

### `/product-thinking/experiment`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Product Thinking | navigate → /product-thinking | PASS |
| link | Next tool: PRD builder | navigate → /product-thinking/prd | PASS |
| button | Remove secondary metrics 1 | run handler | PASS |
| button | Add secondary metric | run handler | PASS |
| button | Remove guardrails 1 | run handler | PASS |
| button | Add guardrail | run handler | PASS |
| field | Experiment name | input (text) | PASS |
| field | Hypothesis | input (textarea) | PASS |
| field | Control group | input (text) | PASS |
| field | Treatment group | input (text) | PASS |
| field | Primary metric | input (text) | PASS |
| field | Secondary metrics 1 | input (text) | PASS |
| field | Guardrails 1 | input (text) | PASS |
| field | Sample size assumptions | input (textarea) | PASS |
| field | Duration | input (text) | PASS |
| field | Success criteria | input (textarea) | PASS |
| field | Status | input (select-one) | PASS |

### `/product-thinking/funnel`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Product Thinking | navigate → /product-thinking | PASS |
| link | Next tool: Experiment designer | navigate → /product-thinking/experiment | PASS |
| button | Illustrative sample | run handler | PASS |
| button | PhonePe capstone — case data | run handler | PASS |
| button | Remove Visited landing page | run handler | PASS |
| button | Remove Started sign-up | run handler | PASS |
| button | Remove Completed onboarding | run handler | PASS |
| button | Remove Reached first value | run handler | PASS |
| field | Step 1 name | input (text) | PASS |
| field | Users at Visited landing page | input (number) | PASS |
| field | Step 2 name | input (text) | PASS |
| field | Users at Started sign-up | input (number) | PASS |
| field | Step 3 name | input (text) | PASS |
| field | Users at Completed onboarding | input (number) | PASS |
| field | Step 4 name | input (text) | PASS |
| field | Users at Reached first value | input (number) | PASS |

### `/product-thinking/moscow`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Product Thinking | navigate → /product-thinking | PASS |
| link | Next tool: North Star builder | navigate → /product-thinking/north-star | PASS |
| button | Add item | submit form | PASS |
| button | Move Sign-in to previous column | run handler | PASS (disabled, explained) |
| button | Move Sign-in to next column | run handler | PASS |
| button | Move Sign-in up | run handler | PASS (disabled, explained) |
| button | Move Sign-in down | run handler | PASS |
| button | Edit Sign-in | run handler | PASS |
| button | Delete Sign-in | run handler | PASS |
| button | Move Daily care record to previous column | run handler | PASS (disabled, explained) |
| button | Move Daily care record to next column | run handler | PASS |
| button | Move Daily care record up | run handler | PASS |
| button | Move Daily care record down | run handler | PASS (disabled, explained) |
| button | Edit Daily care record | run handler | PASS |
| button | Delete Daily care record | run handler | PASS |
| button | Move Handover summary to previous column | run handler | PASS |
| button | Move Handover summary to next column | run handler | PASS |
| button | Move Handover summary up | run handler | PASS (disabled, explained) |
| button | Move Handover summary down | run handler | PASS (disabled, explained) |
| button | Edit Handover summary | run handler | PASS |
| button | Delete Handover summary | run handler | PASS |
| button | Move Dark mode to previous column | run handler | PASS |
| button | Move Dark mode to next column | run handler | PASS |
| button | Move Dark mode up | run handler | PASS (disabled, explained) |
| button | Move Dark mode down | run handler | PASS (disabled, explained) |
| button | Edit Dark mode | run handler | PASS |
| button | Delete Dark mode | run handler | PASS |
| button | Move In-app payments to previous column | run handler | PASS |
| button | Move In-app payments to next column | run handler | PASS (disabled, explained) |
| button | Move In-app payments up | run handler | PASS (disabled, explained) |
| button | Move In-app payments down | run handler | PASS (disabled, explained) |
| button | Edit In-app payments | run handler | PASS |
| button | Delete In-app payments | run handler | PASS |
| field | New item | input (text) | PASS |
| field | Column | input (select-one) | PASS |

### `/product-thinking/north-star`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Product Thinking | navigate → /product-thinking | PASS |
| link | Next tool: Funnel explorer | navigate → /product-thinking/funnel | PASS |
| button | Remove input metric 1 | run handler | PASS |
| button | Remove input metric 2 | run handler | PASS |
| button | + Add input metric | run handler | PASS |
| button | Remove guardrails 1 | run handler | PASS |
| button | Remove guardrails 2 | run handler | PASS |
| button | Add guardrail | run handler | PASS |
| field | Product objective | input (textarea) | PASS |
| field | North Star Metric | input (text) | PASS |
| field | Precise definition | input (textarea) | PASS |
| field | Input metric 1 name | input (text) | PASS |
| field | Input metric 1 description | input (text) | PASS |
| field | Input metric 2 name | input (text) | PASS |
| field | Input metric 2 description | input (text) | PASS |
| field | Guardrails 1 | input (text) | PASS |
| field | Guardrails 2 | input (text) | PASS |

### `/product-thinking/prd`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Product Thinking | navigate → /product-thinking | PASS |
| link | Next tool: Decision log | navigate → /product-thinking/decisions | PASS |
| button | Remove non-goals 1 | run handler | PASS |
| button | Add non-goal | run handler | PASS |
| button | Remove requirements 1 | run handler | PASS |
| button | Add requirement | run handler | PASS |
| button | Remove user stories 1 | run handler | PASS |
| button | Add user storie | run handler | PASS |
| button | Remove acceptance criteria 1 | run handler | PASS |
| button | Add acceptance criteria | run handler | PASS |
| button | Remove dependencies 1 | run handler | PASS |
| button | Add dependencie | run handler | PASS |
| button | Remove risks 1 | run handler | PASS |
| button | Add risk | run handler | PASS |
| button | Remove success metrics 1 | run handler | PASS |
| button | Add success metric | run handler | PASS |
| field | Title | input (text) | PASS |
| field | Problem | input (textarea) | PASS |
| field | Goal | input (textarea) | PASS |
| field | Users | input (textarea) | PASS |
| field | Non-goals 1 | input (text) | PASS |
| field | Requirements 1 | input (text) | PASS |
| field | User stories 1 | input (text) | PASS |
| field | Acceptance criteria 1 | input (text) | PASS |
| field | Dependencies 1 | input (text) | PASS |
| field | Risks 1 | input (text) | PASS |
| field | Success metrics 1 | input (text) | PASS |

### `/product-thinking/rice`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Product Thinking | navigate → /product-thinking | PASS |
| link | Next tool: MoSCoW board | navigate → /product-thinking/moscow | PASS |
| button | Remove Weekly progress email | run handler | PASS |
| button | Remove Guided onboarding checklist | run handler | PASS |
| button | Remove Practitioner chat | run handler | PASS |
| field | Sort by score | input (checkbox) | PASS |
| field | Feature name, row 1 | input (text) | PASS |
| field | Reach for Weekly progress email | input (number) | PASS |
| field | Impact for Weekly progress email | input (select-one) | PASS |
| field | Confidence for Weekly progress email | input (number) | PASS |
| field | Effort for Weekly progress email | input (number) | PASS |
| field | Feature name, row 2 | input (text) | PASS |
| field | Reach for Guided onboarding checklist | input (number) | PASS |
| field | Impact for Guided onboarding checklist | input (select-one) | PASS |
| field | Confidence for Guided onboarding checklist | input (number) | PASS |
| field | Effort for Guided onboarding checklist | input (number) | PASS |
| field | Feature name, row 3 | input (text) | PASS |
| field | Reach for Practitioner chat | input (number) | PASS |
| field | Impact for Practitioner chat | input (select-one) | PASS |
| field | Confidence for Practitioner chat | input (number) | PASS |
| field | Effort for Practitioner chat | input (number) | PASS |

### `/projects`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Evamastu | navigate → /projects/evamastu | PASS |
| link | Aaroh | navigate → /projects/aaroh | PASS |
| link | CareConnect | navigate → /projects/careconnect | PASS |
| link | GharGyaan | navigate → /projects/ghargyaan | PASS |
| link | PhonePe Smart Spend Coach | navigate → /projects/phonepe-smart-spend-coach | PASS |
| link | Nexus | navigate → /projects/nexus | PASS |
| link | 90-Day Product Case Studies | navigate → /projects/90-day-case-studies | PASS |
| button | All | run handler | PASS |
| button | Healthcare | run handler | PASS |
| button | AI | run handler | PASS |
| button | Product Management | run handler | PASS |
| button | Research | run handler | PASS |
| button | Analytics | run handler | PASS |
| button | Growth | run handler | PASS |
| button | Academic | run handler | PASS |
| button | Independent Builds | run handler | PASS |
| button | Professional Projects | run handler | PASS |
| field | Search projects | input (search) | PASS |

### `/projects/90-day-case-studies`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Executive summary | navigate → #summary | PASS |
| link | Method | navigate → #methodology | PASS |
| link | Evidence and references | navigate → #evidence | PASS |
| link | github.com/gaurav-product/product-management-case-studies | navigate → https://github.com/gaurav-product/product-management-case-studies | PASS |
| link | github.com/gaurav-product/product-management-case-studies | navigate → https://github.com/gaurav-product/product-management-case-studies | PASS |
| link | github.com/gaurav-product/product-management-case-studies | navigate → https://github.com/gaurav-product/product-management-case-studies | PASS |
| link | Market research | navigate → /skills/market-research | PASS |
| link | Competitive research | navigate → /skills/competitive-research | PASS |
| link | TAM, SAM and SOM | navigate → /skills/tam-sam-som | PASS |
| link | Jobs to Be Done | navigate → /skills/jtbd | PASS |
| link | RICE | navigate → /skills/rice | PASS |
| link | MoSCoW | navigate → /skills/moscow | PASS |
| link | Product Requirement Document | navigate → /skills/prd | PASS |
| link | Experiment design | navigate → /skills/experiment-design | PASS |
| link | North Star Metric | navigate → /skills/north-star | PASS |
| link | Research & Analytics | navigate → /explore?d=research-analytics | PASS |
| link | PREVIOUS PROJECT Nexus | navigate → /projects/nexus | PASS |
| link | NEXT PROJECT Evamastu | navigate → /projects/evamastu | PASS |

### `/projects/aaroh`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Executive summary | navigate → #summary | PASS |
| link | Project metadata | navigate → #metadata | PASS |
| link | Problem statement | navigate → #problem | PASS |
| link | Research methodology | navigate → #methodology | PASS |
| link | User insights | navigate → #insights | PASS |
| link | Product vision | navigate → #vision | PASS |
| link | Product strategy and decisions | navigate → #strategy | PASS |
| link | PRD and requirements | navigate → #prd | PASS |
| link | Prototype | navigate → #prototype | PASS |
| link | Analytics framework | navigate → #analytics | PASS |
| link | Risks and limitations | navigate → #risks | PASS |
| link | Next steps | navigate → #next | PASS |
| link | Evidence and references | navigate → #evidence | PASS |
| link | Healthcare CV (November 2026) | navigate → /cv | PASS |
| link | github.com/gaurav-product/aaroh | navigate → https://github.com/gaurav-product/aaroh | PASS |
| link | Healthcare CV (November 2026) | navigate → /cv | PASS |
| link | github.com/gaurav-product/aaroh | navigate → https://github.com/gaurav-product/aaroh | PASS |
| link | Healthcare CV (November 2026) | navigate → /cv | PASS |
| link | github.com/gaurav-product/aaroh | navigate → https://github.com/gaurav-product/aaroh | PASS |
| link | Healthcare CV (November 2026) | navigate → /cv | PASS |
| link | Healthcare CV (November 2026) | navigate → /cv | PASS |
| link | github.com/gaurav-product/aaroh | navigate → https://github.com/gaurav-product/aaroh | PASS |
| link | Healthcare CV (November 2026) | navigate → /cv | PASS |
| link | github.com/gaurav-product/aaroh | navigate → https://github.com/gaurav-product/aaroh | PASS |
| link | Healthcare CV (November 2026) | navigate → /cv | PASS |
| link | github.com/gaurav-product/aaroh | navigate → https://github.com/gaurav-product/aaroh | PASS |
| link | Customer interviews | navigate → /skills/discovery-interviews | PASS |
| link | Product Requirement Document | navigate → /skills/prd | PASS |
| link | AI product strategy | navigate → /skills/ai-product-strategy | PASS |
| link | Guardrails | navigate → /skills/guardrails | PASS |
| link | Non-diagnostic product design | navigate → /skills/non-diagnostic-design | PASS |
| link | Consent-based onboarding | navigate → /skills/consent-onboarding | PASS |
| link | North Star Metric | navigate → /skills/north-star | PASS |
| link | RICE | navigate → /skills/rice | PASS |
| link | MoSCoW | navigate → /skills/moscow | PASS |
| link | Product vision | navigate → /skills/product-vision | PASS |
| link | HealthTech Innovation | navigate → /explore?d=healthtech-innovation | PASS |
| link | PREVIOUS PROJECT Evamastu | navigate → /projects/evamastu | PASS |
| link | NEXT PROJECT CareConnect | navigate → /projects/careconnect | PASS |

### `/projects/careconnect`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Executive summary | navigate → #summary | PASS |
| link | Project metadata | navigate → #metadata | PASS |
| link | Problem statement | navigate → #problem | PASS |
| link | Research insight | navigate → #insights | PASS |
| link | User segments | navigate → #segments | PASS |
| link | Core workflow | navigate → #flows | PASS |
| link | Key decisions and trade-offs | navigate → #tradeoffs | PASS |
| link | Analytics framework | navigate → #analytics | PASS |
| link | Execution and testing | navigate → #execution | PASS |
| link | Risks and limitations | navigate → #risks | PASS |
| link | Next steps | navigate → #next | PASS |
| link | Evidence and references | navigate → #evidence | PASS |
| link | Healthcare CV (November 2026) | navigate → /cv | PASS |
| link | github.com/gaurav-product/careconnect | navigate → https://github.com/gaurav-product/careconnect | PASS |
| link | github.com/gaurav-product/careconnect | navigate → https://github.com/gaurav-product/careconnect | PASS |
| link | github.com/gaurav-product/careconnect | navigate → https://github.com/gaurav-product/careconnect | PASS |
| link | github.com/gaurav-product/careconnect | navigate → https://github.com/gaurav-product/careconnect | PASS |
| link | github.com/gaurav-product/careconnect | navigate → https://github.com/gaurav-product/careconnect | PASS |
| link | github.com/gaurav-product/careconnect | navigate → https://github.com/gaurav-product/careconnect | PASS |
| link | github.com/gaurav-product/careconnect | navigate → https://github.com/gaurav-product/careconnect | PASS |
| link | github.com/gaurav-product/careconnect | navigate → https://github.com/gaurav-product/careconnect | PASS |
| link | Healthcare CV (November 2026) | navigate → /cv | PASS |
| link | github.com/gaurav-product/careconnect | navigate → https://github.com/gaurav-product/careconnect | PASS |
| link | github.com/gaurav-product/careconnect | navigate → https://github.com/gaurav-product/careconnect | PASS |
| link | github.com/gaurav-product/careconnect | navigate → https://github.com/gaurav-product/careconnect | PASS |
| link | Healthcare CV (November 2026) | navigate → /cv | PASS |
| link | github.com/gaurav-product/careconnect | navigate → https://github.com/gaurav-product/careconnect | PASS |
| link | Problem framing | navigate → /skills/problem-framing | PASS |
| link | Hypothesis generation | navigate → /skills/hypothesis | PASS |
| link | Pivoting on evidence | navigate → /skills/pivot | PASS |
| link | Decision logs | navigate → /skills/decision-log | PASS |
| link | North Star Metric | navigate → /skills/north-star | PASS |
| link | Guardrail metrics | navigate → /skills/guardrail-metrics | PASS |
| link | Claim registers | navigate → /skills/claim-register | PASS |
| link | Caregiver journey | navigate → /skills/caregiver-journey | PASS |
| link | Post-discharge care | navigate → /skills/post-discharge | PASS |
| link | HealthTech Innovation | navigate → /explore?d=healthtech-innovation | PASS |
| link | PREVIOUS PROJECT Aaroh | navigate → /projects/aaroh | PASS |
| link | NEXT PROJECT GharGyaan | navigate → /projects/ghargyaan | PASS |

### `/projects/evamastu`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Executive summary | navigate → #summary | PASS |
| link | Project metadata | navigate → #metadata | PASS |
| link | Research methodology | navigate → #methodology | PASS |
| link | PRD and requirements | navigate → #prd | PASS |
| link | Prioritization | navigate → #prioritization | PASS |
| link | Analytics framework | navigate → #analytics | PASS |
| link | Results | navigate → #results | PASS |
| link | Execution | navigate → #execution | PASS |
| link | Learnings | navigate → #learnings | PASS |
| link | Evidence and limitations | navigate → #evidence | PASS |
| link | Healthcare CV (November 2026) | navigate → /cv | PASS |
| link | Healthcare CV (November 2026) | navigate → /cv | PASS |
| link | Healthcare CV (November 2026) | navigate → /cv | PASS |
| link | Healthcare CV (November 2026) | navigate → /cv | PASS |
| link | Healthcare CV (November 2026) | navigate → /cv | PASS |
| link | Healthcare CV (November 2026) | navigate → /cv | PASS |
| link | Healthcare CV (November 2026) | navigate → /cv | PASS |
| link | Healthcare CV (November 2026) | navigate → /cv | PASS |
| link | Healthcare CV (November 2026) | navigate → /cv | PASS |
| link | Product Requirement Document | navigate → /skills/prd | PASS |
| link | Cohort analysis | navigate → /skills/cohort-analysis | PASS |
| link | Funnel analysis | navigate → /skills/funnel-analysis | PASS |
| link | RICE | navigate → /skills/rice | PASS |
| link | MoSCoW | navigate → /skills/moscow | PASS |
| link | Stakeholder interviews | navigate → /skills/stakeholder-interviews | PASS |
| link | Sprint planning | navigate → /skills/sprint-planning | PASS |
| link | Onboarding | navigate → /skills/onboarding | PASS |
| link | User stories | navigate → /skills/user-stories | PASS |
| link | Product Leadership | navigate → /explore?d=product-leadership | PASS |
| link | PREVIOUS PROJECT 90-Day Product Case Studies | navigate → /projects/90-day-case-studies | PASS |
| link | NEXT PROJECT Aaroh | navigate → /projects/aaroh | PASS |

### `/projects/ghargyaan`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Executive summary | navigate → #summary | PASS |
| link | Problem statement | navigate → #problem | PASS |
| link | Safety-first architecture | navigate → #flows | PASS |
| link | Evaluation | navigate → #experimentation | PASS |
| link | Risks and limitations | navigate → #risks | PASS |
| link | Evidence and references | navigate → #evidence | PASS |
| link | github.com/gaurav-product/ghargyaan | navigate → https://github.com/gaurav-product/ghargyaan | PASS |
| link | github.com/gaurav-product/ghargyaan | navigate → https://github.com/gaurav-product/ghargyaan | PASS |
| link | github.com/gaurav-product/ghargyaan | navigate → https://github.com/gaurav-product/ghargyaan | PASS |
| link | github.com/gaurav-product/ghargyaan | navigate → https://github.com/gaurav-product/ghargyaan | PASS |
| link | Healthcare CV (November 2026) | navigate → /cv | PASS |
| link | github.com/gaurav-product/ghargyaan | navigate → https://github.com/gaurav-product/ghargyaan | PASS |
| link | github.com/gaurav-product/ghargyaan | navigate → https://github.com/gaurav-product/ghargyaan | PASS |
| link | Healthcare CV (November 2026) | navigate → /cv | PASS |
| link | Guardrails | navigate → /skills/guardrails | PASS |
| link | Crisis routing | navigate → /skills/crisis-routing | PASS |
| link | Evaluation datasets | navigate → /skills/evaluation-datasets | PASS |
| link | Evidence labelling | navigate → /skills/evidence-labelling | PASS |
| link | Hallucination mitigation | navigate → /skills/hallucination-mitigation | PASS |
| link | Human-in-the-loop | navigate → /skills/human-in-the-loop | PASS |
| link | Model evaluation | navigate → /skills/model-evaluation | PASS |
| link | Privacy and consent | navigate → /skills/privacy | PASS |
| link | AI & Safety Lab | navigate → /explore?d=ai-safety-lab | PASS |
| link | PREVIOUS PROJECT CareConnect | navigate → /projects/careconnect | PASS |
| link | NEXT PROJECT PhonePe Smart Spend Coach | navigate → /projects/phonepe-smart-spend-coach | PASS |

### `/projects/nexus`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Executive summary | navigate → #summary | PASS |
| link | Product thesis | navigate → #strategy | PASS |
| link | Situation types | navigate → #flows | PASS |
| link | Limitations | navigate → #risks | PASS |
| link | Evidence and references | navigate → #evidence | PASS |
| link | github.com/gaurav-product/nexus | navigate → https://github.com/gaurav-product/nexus | PASS |
| link | github.com/gaurav-product/nexus | navigate → https://github.com/gaurav-product/nexus | PASS |
| link | github.com/gaurav-product/nexus | navigate → https://github.com/gaurav-product/nexus | PASS |
| link | github.com/gaurav-product/nexus | navigate → https://github.com/gaurav-product/nexus | PASS |
| link | github.com/gaurav-product/nexus | navigate → https://github.com/gaurav-product/nexus | PASS |
| link | AI product strategy | navigate → /skills/ai-product-strategy | PASS |
| link | Guardrails | navigate → /skills/guardrails | PASS |
| link | Hallucination mitigation | navigate → /skills/hallucination-mitigation | PASS |
| link | RAG concepts | navigate → /skills/rag | PASS |
| link | Privacy and consent | navigate → /skills/privacy | PASS |
| link | Hypothesis generation | navigate → /skills/hypothesis | PASS |
| link | Competitive research | navigate → /skills/competitive-research | PASS |
| link | AI & Safety Lab | navigate → /explore?d=ai-safety-lab | PASS |
| link | PREVIOUS PROJECT PhonePe Smart Spend Coach | navigate → /projects/phonepe-smart-spend-coach | PASS |
| link | NEXT PROJECT 90-Day Product Case Studies | navigate → /projects/90-day-case-studies | PASS |

### `/projects/phonepe-smart-spend-coach`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Executive summary | navigate → #summary | PASS |
| link | Project metadata | navigate → #metadata | PASS |
| link | Prioritization | navigate → #prioritization | PASS |
| link | Pilot funnel analysis | navigate → #analytics | PASS |
| link | Experiment design | navigate → #experimentation | PASS |
| link | Learnings | navigate → #learnings | PASS |
| link | Evidence and references | navigate → #evidence | PASS |
| link | github.com/gaurav-product/phonepe-smart-spend-coach-capstone | navigate → https://github.com/gaurav-product/phonepe-smart-spend-coach-capstone | PASS |
| link | github.com/gaurav-product/phonepe-smart-spend-coach-capstone | navigate → https://github.com/gaurav-product/phonepe-smart-spend-coach-capstone | PASS |
| link | Healthcare CV (November 2026) | navigate → /cv | PASS |
| link | github.com/gaurav-product/phonepe-smart-spend-coach-capstone | navigate → https://github.com/gaurav-product/phonepe-smart-spend-coach-capstone | PASS |
| link | github.com/gaurav-product/phonepe-smart-spend-coach-capstone | navigate → https://github.com/gaurav-product/phonepe-smart-spend-coach-capstone | PASS |
| link | github.com/gaurav-product/phonepe-smart-spend-coach-capstone | navigate → https://github.com/gaurav-product/phonepe-smart-spend-coach-capstone | PASS |
| link | github.com/gaurav-product/phonepe-smart-spend-coach-capstone | navigate → https://github.com/gaurav-product/phonepe-smart-spend-coach-capstone | PASS |
| link | github.com/gaurav-product/phonepe-smart-spend-coach-capstone | navigate → https://github.com/gaurav-product/phonepe-smart-spend-coach-capstone | PASS |
| link | Healthcare CV (November 2026) | navigate → /cv | PASS |
| link | Funnel analysis | navigate → /skills/funnel-analysis | PASS |
| link | A/B testing | navigate → /skills/ab-testing | PASS |
| link | Experiment design | navigate → /skills/experiment-design | PASS |
| link | Guardrail metrics | navigate → /skills/guardrail-metrics | PASS |
| link | RICE | navigate → /skills/rice | PASS |
| link | Product Requirement Document | navigate → /skills/prd | PASS |
| link | Usability testing | navigate → /skills/usability-testing | PASS |
| link | Hypothesis generation | navigate → /skills/hypothesis | PASS |
| link | Research & Analytics | navigate → /explore?d=research-analytics | PASS |
| link | PREVIOUS PROJECT GharGyaan | navigate → /projects/ghargyaan | PASS |
| link | NEXT PROJECT Nexus | navigate → /projects/nexus | PASS |

### `/recruiter`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | MAY 2025 – APR 2026 Associate Product Manager Adhyatm Sadhna Kendra · New Delhi | navigate → /experience/apm-adhyatm-sadhna-kendra | PASS |
| link | NOV 2024 – APR 2025 Product Management Intern Adhyatm Sadhna Kendra · New Delhi | navigate → /experience/pm-intern-adhyatm-sadhna-kendra | PASS |
| link | SEP 2022 – JUL 2024 Research Expert Live Your Best Life (USA) · Remote | navigate → /experience/research-expert-lybl | PASS |
| link | 01 Evamastu — Digital mindfulness platform Professional · Adhyatm Sadhna Kendra  | navigate → /projects/evamastu | PASS |
| link | 02 Aaroh — AI root-cause health platform Independent · founder · Founder and pro | navigate → /projects/aaroh | PASS |
| link | 03 CareConnect — Post-discharge care accountability layer Independent build · Se | navigate → /projects/careconnect | PASS |
| link | 04 GharGyaan — Everyday self-care knowledge app Independent build · Self-directe | navigate → /projects/ghargyaan | PASS |
| link | 05 PhonePe Smart Spend Coach — Feature design and growth case Academic case stud | navigate → /projects/phonepe-smart-spend-coach | PASS |
| link | Problem discovery | navigate → /skills/problem-discovery | PASS |
| link | Problem framing | navigate → /skills/problem-framing | PASS |
| link | Opportunity identification | navigate → /skills/opportunity-identification | PASS |
| link | User research | navigate → /skills/user-research | PASS |
| link | Product roadmap | navigate → /skills/roadmap-planning | PASS |
| link | MVP definition | navigate → /skills/mvp | PASS |
| link | Feature prioritization | navigate → /skills/feature-prioritization | PASS |
| link | RICE | navigate → /skills/rice | PASS |
| link | North Star Metric | navigate → /skills/north-star | PASS |
| link | KPIs | navigate → /skills/kpis | PASS |
| link | Input and output metrics | navigate → /skills/input-output-metrics | PASS |
| link | Engagement | navigate → /skills/engagement | PASS |
| link | AI product strategy | navigate → /skills/ai-product-strategy | PASS |
| link | AI use-case discovery | navigate → /skills/ai-use-cases | PASS |
| link | AI feasibility | navigate → /skills/ai-feasibility | PASS |
| link | AI product requirements | navigate → /skills/ai-requirements | PASS |
| link | Patient journey | navigate → /skills/patient-journey | PASS |
| link | Caregiver journey | navigate → /skills/caregiver-journey | PASS |
| link | Provider workflow | navigate → /skills/provider-workflow | PASS |
| link | Digital health discovery | navigate → /skills/digital-health-discovery | PASS |
| link | Open the research library | navigate → /research | PASS |
| link | Email Gaurav | navigate → mailto:gauravkumarsingh773@gmail.com | PASS |
| link | Full portfolio | navigate → / | PASS |
| button | All roles | run handler | PASS |
| button | Associate Product Manager | run handler | PASS |
| button | Product Analyst | run handler | PASS |
| button | AI Product | run handler | PASS |
| button | Healthcare Product | run handler | PASS |
| button | Product Research | run handler | PASS |
| button | Show the detailed profile | run handler | PASS |

### `/research`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | DAY 01 NARRATIVE Practo Practo Product Case Study Healthcare (derived) · 3,571 w | navigate → /research/1 | PASS |
| link | DAY 02 SOURCED Spotify Spotify Product Case Study Consumer (derived) · 11,756 wo | navigate → /research/2 | PASS |
| link | DAY 03 SOURCED WhatsApp WhatsApp Product Management Case Study Consumer (derived | navigate → /research/3 | PASS |
| link | DAY 04 SOURCED Notion Notion: A Product Management Case Study SaaS (derived) · 1 | navigate → /research/4 | PASS |
| link | DAY 05 SOURCED Airbnb Airbnb Product Management Case Study Marketplace (derived) | navigate → /research/5 | PASS |
| link | DAY 06 SOURCED Duolingo Duolingo Product Teardown & Strategy Case Study Consumer | navigate → /research/6 | PASS |
| link | DAY 07 DOCUMENTED PhonePe PhonePe — Product Teardown & Strategy Case Study Finte | navigate → /research/7 | PASS |
| link | DAY 08 SOURCED Blinkit Blinkit Product Teardown Marketplace (derived) · 6,337 wo | navigate → /research/8 | PASS |
| link | DAY 09 SOURCED Swiggy Swiggy Marketplace (derived) · 8,472 words · 7 refs | navigate → /research/9 | PASS |
| link | DAY 10 SOURCED LinkedIn LinkedIn — AI Career Companion Strategy Consumer (derive | navigate → /research/10 | PASS |
| link | DAY 11 SOURCED Google Maps Google Maps — Product Management Case Study Consumer  | navigate → /research/11 | PASS |
| link | DAY 12 SOURCED Netflix Netflix — Product Management Case Study Consumer (derived | navigate → /research/12 | PASS |
| link | DAY 13 NARRATIVE Amazon Amazon — Product Management Case Study Consumer (derived | navigate → /research/13 | PASS |
| link | DAY 14 SOURCED Canva Canva — Product Management Case Study SaaS (derived) · 11,8 | navigate → /research/14 | PASS |
| link | DAY 15 NARRATIVE Perplexity Perplexity: The Answer Engine Challenging Search AI  | navigate → /research/15 | PASS |
| link | DAY 16 NARRATIVE Cursor Cursor: The $60B Bet That Code Editors Are the New Platf | navigate → /research/16 | PASS |
| link | DAY 17 NARRATIVE Figma Figma: From a $20B Rejected Buyout to a $68B IPO to the " | navigate → /research/17 | PASS |
| link | DAY 18 NARRATIVE Linear Linear: Betting the Issue Tracker Becomes the "System fo | navigate → /research/18 | PASS |
| link | DAY 19 SOURCED Lovable Lovable — Turning the 99% Into Software Builders AI (deri | navigate → /research/19 | PASS |
| link | DAY 20 SOURCED Cult.fit Cult.fit — Product Management Case Study Healthcare (der | navigate → /research/20 | PASS |
| link | DAY 21 SOURCED CRED CRED — Product Management Case Study Fintech (derived) · 7,9 | navigate → /research/21 | PASS |
| link | DAY 22 SOURCED Zerodha Zerodha — Product Management Case Study Fintech (derived) | navigate → /research/22 | PASS |
| link | DAY 23 SOURCED Rapido Rapido — Product Management Case Study Consumer (derived)  | navigate → /research/23 | PASS |
| link | DAY 24 SOURCED Meesho 1. Cover Marketplace (derived) · 11,505 words · 30 refs | navigate → /research/24 | PASS |
| button | Show more (66 remaining) | run handler | PASS |
| field | Search studies | input (search) | PASS |
| field | Category
All categories (derived)
Healthcare
Consumer
SaaS
M | input (select-one) | PASS |
| field | Evidence level
All evidence levels
VERIFIED
DOCUMENTED
SOURC | input (select-one) | PASS |
| field | Date range
All days
Days 1–30
Days 31–60
Days 61–90 | input (select-one) | PASS |

### `/research/1`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Research library | navigate → /research | PASS |
| link | Read the full study on GitHub | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day%2001%20-%20Practo/README.md | PASS |
| link | Directory | navigate → https://github.com/gaurav-product/product-management-case-studies/tree/main/Case%20Studies/Day%2001%20-%20Practo | PASS |
| link | Evamastu | navigate → /projects/evamastu | PASS |
| link | Aaroh | navigate → /projects/aaroh | PASS |
| link | CareConnect | navigate → /projects/careconnect | PASS |
| link | Day 2 · Spotify | navigate → /research/2 | PASS |

### `/research/10`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Research library | navigate → /research | PASS |
| link | Read the full study on GitHub | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-10-LinkedIn/README.md | PASS |
| link | Directory | navigate → https://github.com/gaurav-product/product-management-case-studies/tree/main/Case%20Studies/Day-10-LinkedIn | PASS |
| link | Day 9 · Swiggy | navigate → /research/9 | PASS |
| link | Day 11 · Google Maps | navigate → /research/11 | PASS |

### `/research/11`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Research library | navigate → /research | PASS |
| link | Read the full study on GitHub | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-11-Google-Maps/README.md | PASS |
| link | Directory | navigate → https://github.com/gaurav-product/product-management-case-studies/tree/main/Case%20Studies/Day-11-Google-Maps | PASS |
| link | Day 10 · LinkedIn | navigate → /research/10 | PASS |
| link | Day 12 · Netflix | navigate → /research/12 | PASS |

### `/research/12`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Research library | navigate → /research | PASS |
| link | Read the full study on GitHub | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-12-Netflix/README.md | PASS |
| link | Directory | navigate → https://github.com/gaurav-product/product-management-case-studies/tree/main/Case%20Studies/Day-12-Netflix | PASS |
| link | Day 11 · Google Maps | navigate → /research/11 | PASS |
| link | Day 13 · Amazon | navigate → /research/13 | PASS |

### `/research/13`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Research library | navigate → /research | PASS |
| link | Read the full study on GitHub | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-13-Amazon/README.md | PASS |
| link | Directory | navigate → https://github.com/gaurav-product/product-management-case-studies/tree/main/Case%20Studies/Day-13-Amazon | PASS |
| link | Day 12 · Netflix | navigate → /research/12 | PASS |
| link | Day 14 · Canva | navigate → /research/14 | PASS |

### `/research/14`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Research library | navigate → /research | PASS |
| link | Read the full study on GitHub | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-14-Canva/README.md | PASS |
| link | Directory | navigate → https://github.com/gaurav-product/product-management-case-studies/tree/main/Case%20Studies/Day-14-Canva | PASS |
| link | Day 13 · Amazon | navigate → /research/13 | PASS |
| link | Day 15 · Perplexity | navigate → /research/15 | PASS |

### `/research/15`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Research library | navigate → /research | PASS |
| link | Read the full study on GitHub | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-15-Perplexity/README.md | PASS |
| link | Directory | navigate → https://github.com/gaurav-product/product-management-case-studies/tree/main/Case%20Studies/Day-15-Perplexity | PASS |
| link | Aaroh | navigate → /projects/aaroh | PASS |
| link | GharGyaan | navigate → /projects/ghargyaan | PASS |
| link | Nexus | navigate → /projects/nexus | PASS |
| link | Day 14 · Canva | navigate → /research/14 | PASS |
| link | Day 16 · Cursor | navigate → /research/16 | PASS |

### `/research/16`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Research library | navigate → /research | PASS |
| link | Read the full study on GitHub | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-16-Cursor/README.md | PASS |
| link | Directory | navigate → https://github.com/gaurav-product/product-management-case-studies/tree/main/Case%20Studies/Day-16-Cursor | PASS |
| link | Aaroh | navigate → /projects/aaroh | PASS |
| link | GharGyaan | navigate → /projects/ghargyaan | PASS |
| link | Nexus | navigate → /projects/nexus | PASS |
| link | Day 15 · Perplexity | navigate → /research/15 | PASS |
| link | Day 17 · Figma | navigate → /research/17 | PASS |

### `/research/17`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Research library | navigate → /research | PASS |
| link | Read the full study on GitHub | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-17-Figma/README.md | PASS |
| link | Directory | navigate → https://github.com/gaurav-product/product-management-case-studies/tree/main/Case%20Studies/Day-17-Figma | PASS |
| link | Day 16 · Cursor | navigate → /research/16 | PASS |
| link | Day 18 · Linear | navigate → /research/18 | PASS |

### `/research/18`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Research library | navigate → /research | PASS |
| link | Read the full study on GitHub | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-18-Linear/README.md | PASS |
| link | Directory | navigate → https://github.com/gaurav-product/product-management-case-studies/tree/main/Case%20Studies/Day-18-Linear | PASS |
| link | Day 17 · Figma | navigate → /research/17 | PASS |
| link | Day 19 · Lovable | navigate → /research/19 | PASS |

### `/research/19`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Research library | navigate → /research | PASS |
| link | Read the full study on GitHub | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-19-Lovable/README.md | PASS |
| link | Directory | navigate → https://github.com/gaurav-product/product-management-case-studies/tree/main/Case%20Studies/Day-19-Lovable | PASS |
| link | Aaroh | navigate → /projects/aaroh | PASS |
| link | GharGyaan | navigate → /projects/ghargyaan | PASS |
| link | Nexus | navigate → /projects/nexus | PASS |
| link | Day 18 · Linear | navigate → /research/18 | PASS |
| link | Day 20 · Cult.fit | navigate → /research/20 | PASS |

### `/research/2`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Research library | navigate → /research | PASS |
| link | Read the full study on GitHub | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day%2002%20-%20Spotify/README%20.md | PASS |
| link | Directory | navigate → https://github.com/gaurav-product/product-management-case-studies/tree/main/Case%20Studies/Day%2002%20-%20Spotify | PASS |
| link | Day 1 · Practo | navigate → /research/1 | PASS |
| link | Day 3 · WhatsApp | navigate → /research/3 | PASS |

### `/research/20`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Research library | navigate → /research | PASS |
| link | Read the full study on GitHub | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-20-Cult.fit/README.md | PASS |
| link | Directory | navigate → https://github.com/gaurav-product/product-management-case-studies/tree/main/Case%20Studies/Day-20-Cult.fit | PASS |
| link | Evamastu | navigate → /projects/evamastu | PASS |
| link | Aaroh | navigate → /projects/aaroh | PASS |
| link | CareConnect | navigate → /projects/careconnect | PASS |
| link | Day 19 · Lovable | navigate → /research/19 | PASS |
| link | Day 21 · CRED | navigate → /research/21 | PASS |

### `/research/21`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Research library | navigate → /research | PASS |
| link | Read the full study on GitHub | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-21-CRED/README.md | PASS |
| link | Directory | navigate → https://github.com/gaurav-product/product-management-case-studies/tree/main/Case%20Studies/Day-21-CRED | PASS |
| link | Day 20 · Cult.fit | navigate → /research/20 | PASS |
| link | Day 22 · Zerodha | navigate → /research/22 | PASS |

### `/research/22`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Research library | navigate → /research | PASS |
| link | Read the full study on GitHub | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-22-Zerodha/README.md | PASS |
| link | Directory | navigate → https://github.com/gaurav-product/product-management-case-studies/tree/main/Case%20Studies/Day-22-Zerodha | PASS |
| link | Day 21 · CRED | navigate → /research/21 | PASS |
| link | Day 23 · Rapido | navigate → /research/23 | PASS |

### `/research/23`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Research library | navigate → /research | PASS |
| link | Read the full study on GitHub | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-23-Rapido/README.md | PASS |
| link | Directory | navigate → https://github.com/gaurav-product/product-management-case-studies/tree/main/Case%20Studies/Day-23-Rapido | PASS |
| link | Day 22 · Zerodha | navigate → /research/22 | PASS |
| link | Day 24 · Meesho | navigate → /research/24 | PASS |

### `/research/24`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Research library | navigate → /research | PASS |
| link | Read the full study on GitHub | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-24-Meesho/README.md | PASS |
| link | Directory | navigate → https://github.com/gaurav-product/product-management-case-studies/tree/main/Case%20Studies/Day-24-Meesho | PASS |
| link | Day 23 · Rapido | navigate → /research/23 | PASS |
| link | Day 25 · Urban Company | navigate → /research/25 | PASS |

### `/research/25`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Research library | navigate → /research | PASS |
| link | Read the full study on GitHub | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-25-Urban-Company/README.md | PASS |
| link | Directory | navigate → https://github.com/gaurav-product/product-management-case-studies/tree/main/Case%20Studies/Day-25-Urban-Company | PASS |
| link | Day 24 · Meesho | navigate → /research/24 | PASS |
| link | Day 26 · Emergent | navigate → /research/26 | PASS |

### `/research/26`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Research library | navigate → /research | PASS |
| link | Read the full study on GitHub | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-26-Emergent/README.md | PASS |
| link | Directory | navigate → https://github.com/gaurav-product/product-management-case-studies/tree/main/Case%20Studies/Day-26-Emergent | PASS |
| link | Aaroh | navigate → /projects/aaroh | PASS |
| link | GharGyaan | navigate → /projects/ghargyaan | PASS |
| link | Nexus | navigate → /projects/nexus | PASS |
| link | Day 25 · Urban Company | navigate → /research/25 | PASS |
| link | Day 27 · Slack | navigate → /research/27 | PASS |

### `/research/27`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Research library | navigate → /research | PASS |
| link | Read the full study on GitHub | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-27-Slack/README.md | PASS |
| link | Directory | navigate → https://github.com/gaurav-product/product-management-case-studies/tree/main/Case%20Studies/Day-27-Slack | PASS |
| link | Day 26 · Emergent | navigate → /research/26 | PASS |
| link | Day 28 · Apollo 24 7 | navigate → /research/28 | PASS |

### `/research/28`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Research library | navigate → /research | PASS |
| link | Read the full study on GitHub | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-28-Apollo-24-7/README.md | PASS |
| link | ASSUMPTIONS file | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-28-Apollo-24-7/assumptions.md | PASS |
| link | Directory | navigate → https://github.com/gaurav-product/product-management-case-studies/tree/main/Case%20Studies/Day-28-Apollo-24-7 | PASS |
| link | Evamastu | navigate → /projects/evamastu | PASS |
| link | Aaroh | navigate → /projects/aaroh | PASS |
| link | CareConnect | navigate → /projects/careconnect | PASS |
| link | Day 27 · Slack | navigate → /research/27 | PASS |
| link | Day 29 · Google Ads | navigate → /research/29 | PASS |

### `/research/29`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Research library | navigate → /research | PASS |
| link | Read the full study on GitHub | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-29-Google-Ads/README.md | PASS |
| link | ASSUMPTIONS file | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-29-Google-Ads/assumptions.md | PASS |
| link | Directory | navigate → https://github.com/gaurav-product/product-management-case-studies/tree/main/Case%20Studies/Day-29-Google-Ads | PASS |
| link | Day 28 · Apollo 24 7 | navigate → /research/28 | PASS |
| link | Day 30 · Meta Ads | navigate → /research/30 | PASS |

### `/research/3`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Research library | navigate → /research | PASS |
| link | Read the full study on GitHub | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day%2003%20-%20WhatsApp/readme.md | PASS |
| link | Directory | navigate → https://github.com/gaurav-product/product-management-case-studies/tree/main/Case%20Studies/Day%2003%20-%20WhatsApp | PASS |
| link | Day 2 · Spotify | navigate → /research/2 | PASS |
| link | Day 4 · Notion | navigate → /research/4 | PASS |

### `/research/30`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Research library | navigate → /research | PASS |
| link | Read the full study on GitHub | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-30-Meta-Ads/README.md | PASS |
| link | ASSUMPTIONS file | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-30-Meta-Ads/assumptions.md | PASS |
| link | Directory | navigate → https://github.com/gaurav-product/product-management-case-studies/tree/main/Case%20Studies/Day-30-Meta-Ads | PASS |
| link | Day 29 · Google Ads | navigate → /research/29 | PASS |
| link | Day 31 · ChatGPT | navigate → /research/31 | PASS |

### `/research/31`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Research library | navigate → /research | PASS |
| link | Read the full study on GitHub | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-31-ChatGPT/README.md | PASS |
| link | ASSUMPTIONS file | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-31-ChatGPT/assumptions.md | PASS |
| link | Directory | navigate → https://github.com/gaurav-product/product-management-case-studies/tree/main/Case%20Studies/Day-31-ChatGPT | PASS |
| link | Day 30 · Meta Ads | navigate → /research/30 | PASS |
| link | Day 32 · Sarvam AI | navigate → /research/32 | PASS |

### `/research/32`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Research library | navigate → /research | PASS |
| link | Read the full study on GitHub | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-32-Sarvam-AI/README.md | PASS |
| link | ASSUMPTIONS file | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-32-Sarvam-AI/assumptions.md | PASS |
| link | Directory | navigate → https://github.com/gaurav-product/product-management-case-studies/tree/main/Case%20Studies/Day-32-Sarvam-AI | PASS |
| link | Aaroh | navigate → /projects/aaroh | PASS |
| link | GharGyaan | navigate → /projects/ghargyaan | PASS |
| link | Nexus | navigate → /projects/nexus | PASS |
| link | Day 31 · ChatGPT | navigate → /research/31 | PASS |
| link | Day 33 · PharmEasy | navigate → /research/33 | PASS |

### `/research/33`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Research library | navigate → /research | PASS |
| link | Read the full study on GitHub | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-33-PharmEasy/README.md | PASS |
| link | ASSUMPTIONS file | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-33-PharmEasy/ASSUMPTIONS.md | PASS |
| link | Directory | navigate → https://github.com/gaurav-product/product-management-case-studies/tree/main/Case%20Studies/Day-33-PharmEasy | PASS |
| link | Evamastu | navigate → /projects/evamastu | PASS |
| link | Aaroh | navigate → /projects/aaroh | PASS |
| link | CareConnect | navigate → /projects/careconnect | PASS |
| link | Day 32 · Sarvam AI | navigate → /research/32 | PASS |
| link | Day 34 · Zoho | navigate → /research/34 | PASS |

### `/research/34`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Research library | navigate → /research | PASS |
| link | Read the full study on GitHub | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-34-Zoho/README.md | PASS |
| link | ASSUMPTIONS file | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-34-Zoho/ASSUMPTIONS.md | PASS |
| link | Directory | navigate → https://github.com/gaurav-product/product-management-case-studies/tree/main/Case%20Studies/Day-34-Zoho | PASS |
| link | Day 33 · PharmEasy | navigate → /research/33 | PASS |
| link | Day 35 · AppsFlyer | navigate → /research/35 | PASS |

### `/research/35`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Research library | navigate → /research | PASS |
| link | Read the full study on GitHub | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-35-AppsFlyer/README.md | PASS |
| link | ASSUMPTIONS file | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-35-AppsFlyer/ASSUMPTIONS.md | PASS |
| link | Directory | navigate → https://github.com/gaurav-product/product-management-case-studies/tree/main/Case%20Studies/Day-35-AppsFlyer | PASS |
| link | Evamastu | navigate → /projects/evamastu | PASS |
| link | PhonePe Smart Spend Coach | navigate → /projects/phonepe-smart-spend-coach | PASS |
| link | 90-Day Product Case Studies | navigate → /projects/90-day-case-studies | PASS |
| link | Day 34 · Zoho | navigate → /research/34 | PASS |
| link | Day 36 · Paytm | navigate → /research/36 | PASS |

### `/research/36`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Research library | navigate → /research | PASS |
| link | Read the full study on GitHub | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-36-Paytm/README.md | PASS |
| link | ASSUMPTIONS file | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-36-Paytm/ASSUMPTIONS.md | PASS |
| link | Directory | navigate → https://github.com/gaurav-product/product-management-case-studies/tree/main/Case%20Studies/Day-36-Paytm | PASS |
| link | Day 35 · AppsFlyer | navigate → /research/35 | PASS |
| link | Day 37 · Amaha | navigate → /research/37 | PASS |

### `/research/37`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Research library | navigate → /research | PASS |
| link | Read the full study on GitHub | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-37-Amaha/README.md | PASS |
| link | ASSUMPTIONS file | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-37-Amaha/ASSUMPTIONS.md | PASS |
| link | Directory | navigate → https://github.com/gaurav-product/product-management-case-studies/tree/main/Case%20Studies/Day-37-Amaha | PASS |
| link | Evamastu | navigate → /projects/evamastu | PASS |
| link | Aaroh | navigate → /projects/aaroh | PASS |
| link | CareConnect | navigate → /projects/careconnect | PASS |
| link | Day 36 · Paytm | navigate → /research/36 | PASS |
| link | Day 38 · Razorpay | navigate → /research/38 | PASS |

### `/research/38`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Research library | navigate → /research | PASS |
| link | Read the full study on GitHub | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-38-Razorpay/README.md | PASS |
| link | ASSUMPTIONS file | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-38-Razorpay/ASSUMPTIONS.md | PASS |
| link | Directory | navigate → https://github.com/gaurav-product/product-management-case-studies/tree/main/Case%20Studies/Day-38-Razorpay | PASS |
| link | Day 37 · Amaha | navigate → /research/37 | PASS |
| link | Day 39 · Myntra | navigate → /research/39 | PASS |

### `/research/39`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Research library | navigate → /research | PASS |
| link | Read the full study on GitHub | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-39-Myntra/README.md | PASS |
| link | ASSUMPTIONS file | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-39-Myntra/ASSUMPTIONS.md | PASS |
| link | Directory | navigate → https://github.com/gaurav-product/product-management-case-studies/tree/main/Case%20Studies/Day-39-Myntra | PASS |
| link | Day 38 · Razorpay | navigate → /research/38 | PASS |
| link | Day 40 · Freshworks | navigate → /research/40 | PASS |

### `/research/4`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Research library | navigate → /research | PASS |
| link | Read the full study on GitHub | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day%2004%20-%20Notion/README.md | PASS |
| link | Directory | navigate → https://github.com/gaurav-product/product-management-case-studies/tree/main/Case%20Studies/Day%2004%20-%20Notion | PASS |
| link | Day 3 · WhatsApp | navigate → /research/3 | PASS |
| link | Day 5 · Airbnb | navigate → /research/5 | PASS |

### `/research/40`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Research library | navigate → /research | PASS |
| link | Read the full study on GitHub | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-40-Freshworks/README.md | PASS |
| link | ASSUMPTIONS file | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-40-Freshworks/ASSUMPTIONS.md | PASS |
| link | Directory | navigate → https://github.com/gaurav-product/product-management-case-studies/tree/main/Case%20Studies/Day-40-Freshworks | PASS |
| link | Day 39 · Myntra | navigate → /research/39 | PASS |
| link | Day 41 · InMobi | navigate → /research/41 | PASS |

### `/research/41`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Research library | navigate → /research | PASS |
| link | Read the full study on GitHub | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-41-InMobi/README.md | PASS |
| link | ASSUMPTIONS file | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-41-InMobi/ASSUMP~1.MD | PASS |
| link | Directory | navigate → https://github.com/gaurav-product/product-management-case-studies/tree/main/Case%20Studies/Day-41-InMobi | PASS |
| link | Day 40 · Freshworks | navigate → /research/40 | PASS |
| link | Day 42 · Groww | navigate → /research/42 | PASS |

### `/research/42`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Research library | navigate → /research | PASS |
| link | Read the full study on GitHub | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-42-Groww/README.md | PASS |
| link | ASSUMPTIONS file | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-42-Groww/ASSUMP~1.MD | PASS |
| link | Directory | navigate → https://github.com/gaurav-product/product-management-case-studies/tree/main/Case%20Studies/Day-42-Groww | PASS |
| link | Day 41 · InMobi | navigate → /research/41 | PASS |
| link | Day 43 · Stripe | navigate → /research/43 | PASS |

### `/research/43`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Research library | navigate → /research | PASS |
| link | Read the full study on GitHub | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-43-Stripe/README.md | PASS |
| link | ASSUMPTIONS file | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-43-Stripe/ASSUMPTIONS.md | PASS |
| link | Directory | navigate → https://github.com/gaurav-product/product-management-case-studies/tree/main/Case%20Studies/Day-43-Stripe | PASS |
| link | Day 42 · Groww | navigate → /research/42 | PASS |
| link | Day 44 · Nykaa | navigate → /research/44 | PASS |

### `/research/44`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Research library | navigate → /research | PASS |
| link | Read the full study on GitHub | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-44-Nykaa/README.md | PASS |
| link | ASSUMPTIONS file | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-44-Nykaa/ASSUMPTIONS.md | PASS |
| link | Directory | navigate → https://github.com/gaurav-product/product-management-case-studies/tree/main/Case%20Studies/Day-44-Nykaa | PASS |
| link | Day 43 · Stripe | navigate → /research/43 | PASS |
| link | Day 45 · Eternal | navigate → /research/45 | PASS |

### `/research/45`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Research library | navigate → /research | PASS |
| link | Read the full study on GitHub | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-45-Eternal/README.md | PASS |
| link | ASSUMPTIONS file | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-45-Eternal/ASSUMPTIONS.md | PASS |
| link | Directory | navigate → https://github.com/gaurav-product/product-management-case-studies/tree/main/Case%20Studies/Day-45-Eternal | PASS |
| link | Day 44 · Nykaa | navigate → /research/44 | PASS |
| link | Day 46 · ALLEN Digital | navigate → /research/46 | PASS |

### `/research/46`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Research library | navigate → /research | PASS |
| link | Read the full study on GitHub | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-46-ALLEN-Digital/README.md | PASS |
| link | ASSUMPTIONS file | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-46-ALLEN-Digital/ASSUMPTIONS.md | PASS |
| link | Directory | navigate → https://github.com/gaurav-product/product-management-case-studies/tree/main/Case%20Studies/Day-46-ALLEN-Digital | PASS |
| link | Day 45 · Eternal | navigate → /research/45 | PASS |
| link | Day 47 · HealthifyMe | navigate → /research/47 | PASS |

### `/research/47`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Research library | navigate → /research | PASS |
| link | Read the full study on GitHub | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-47-HealthifyMe/README.md | PASS |
| link | ASSUMPTIONS file | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-47-HealthifyMe/ASSUMPTIONS.md | PASS |
| link | Directory | navigate → https://github.com/gaurav-product/product-management-case-studies/tree/main/Case%20Studies/Day-47-HealthifyMe | PASS |
| link | Evamastu | navigate → /projects/evamastu | PASS |
| link | Aaroh | navigate → /projects/aaroh | PASS |
| link | CareConnect | navigate → /projects/careconnect | PASS |
| link | Day 46 · ALLEN Digital | navigate → /research/46 | PASS |
| link | Day 48 · Snitch | navigate → /research/48 | PASS |

### `/research/48`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Research library | navigate → /research | PASS |
| link | Read the full study on GitHub | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-48-Snitch/README.md | PASS |
| link | ASSUMPTIONS file | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-48-Snitch/ASSUMPTIONS.md | PASS |
| link | Directory | navigate → https://github.com/gaurav-product/product-management-case-studies/tree/main/Case%20Studies/Day-48-Snitch | PASS |
| link | Day 47 · HealthifyMe | navigate → /research/47 | PASS |
| link | Day 49 · River Mobility | navigate → /research/49 | PASS |

### `/research/49`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Research library | navigate → /research | PASS |
| link | Read the full study on GitHub | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-49-River-Mobility/README.md | PASS |
| link | ASSUMPTIONS file | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-49-River-Mobility/ASSUMPTIONS.md | PASS |
| link | Directory | navigate → https://github.com/gaurav-product/product-management-case-studies/tree/main/Case%20Studies/Day-49-River-Mobility | PASS |
| link | Day 48 · Snitch | navigate → /research/48 | PASS |
| link | Day 50 · Zepto | navigate → /research/50 | PASS |

### `/research/5`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Research library | navigate → /research | PASS |
| link | Read the full study on GitHub | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day%2005%20-%20Airbnb/README.md | PASS |
| link | Directory | navigate → https://github.com/gaurav-product/product-management-case-studies/tree/main/Case%20Studies/Day%2005%20-%20Airbnb | PASS |
| link | Day 4 · Notion | navigate → /research/4 | PASS |
| link | Day 6 · Duolingo | navigate → /research/6 | PASS |

### `/research/50`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Research library | navigate → /research | PASS |
| link | Read the full study on GitHub | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-50-Zepto/README.md | PASS |
| link | ASSUMPTIONS file | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-50-Zepto/ASSUMPTIONS.md | PASS |
| link | Directory | navigate → https://github.com/gaurav-product/product-management-case-studies/tree/main/Case%20Studies/Day-50-Zepto | PASS |
| link | Day 49 · River Mobility | navigate → /research/49 | PASS |
| link | Day 51 · Ola | navigate → /research/51 | PASS |

### `/research/51`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Research library | navigate → /research | PASS |
| link | Read the full study on GitHub | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-51-Ola/README.md | PASS |
| link | ASSUMPTIONS file | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-51-Ola/ASSUMPTIONS.md | PASS |
| link | Directory | navigate → https://github.com/gaurav-product/product-management-case-studies/tree/main/Case%20Studies/Day-51-Ola | PASS |
| link | Day 50 · Zepto | navigate → /research/50 | PASS |
| link | Day 52 · Lenskart | navigate → /research/52 | PASS |

### `/research/52`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Research library | navigate → /research | PASS |
| link | Read the full study on GitHub | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-52-Lenskart/README.md | PASS |
| link | ASSUMPTIONS file | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-52-Lenskart/ASSUMPTIONS.md | PASS |
| link | Directory | navigate → https://github.com/gaurav-product/product-management-case-studies/tree/main/Case%20Studies/Day-52-Lenskart | PASS |
| link | Day 51 · Ola | navigate → /research/51 | PASS |
| link | Day 53 · PhysicsWallah | navigate → /research/53 | PASS |

### `/research/53`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Research library | navigate → /research | PASS |
| link | Read the full study on GitHub | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-53-PhysicsWallah/README.md | PASS |
| link | ASSUMPTIONS file | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-53-PhysicsWallah/ASSUMPTIONS.md | PASS |
| link | Directory | navigate → https://github.com/gaurav-product/product-management-case-studies/tree/main/Case%20Studies/Day-53-PhysicsWallah | PASS |
| link | Day 52 · Lenskart | navigate → /research/52 | PASS |
| link | Day 54 · Dream11 | navigate → /research/54 | PASS |

### `/research/54`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Research library | navigate → /research | PASS |
| link | Read the full study on GitHub | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-54-Dream11/README.md | PASS |
| link | ASSUMPTIONS file | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-54-Dream11/ASSUMPTIONS.md | PASS |
| link | Directory | navigate → https://github.com/gaurav-product/product-management-case-studies/tree/main/Case%20Studies/Day-54-Dream11 | PASS |
| link | Day 53 · PhysicsWallah | navigate → /research/53 | PASS |
| link | Day 55 · Mamaearth | navigate → /research/55 | PASS |

### `/research/55`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Research library | navigate → /research | PASS |
| link | Read the full study on GitHub | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-55-Mamaearth/README.md | PASS |
| link | ASSUMPTIONS file | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-55-Mamaearth/ASSUMPTIONS.md | PASS |
| link | Directory | navigate → https://github.com/gaurav-product/product-management-case-studies/tree/main/Case%20Studies/Day-55-Mamaearth | PASS |
| link | Day 54 · Dream11 | navigate → /research/54 | PASS |
| link | Day 56 · MediBuddy | navigate → /research/56 | PASS |

### `/research/56`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Research library | navigate → /research | PASS |
| link | Read the full study on GitHub | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-56-MediBuddy/README.md | PASS |
| link | ASSUMPTIONS file | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-56-MediBuddy/ASSUMPTIONS.md | PASS |
| link | Directory | navigate → https://github.com/gaurav-product/product-management-case-studies/tree/main/Case%20Studies/Day-56-MediBuddy | PASS |
| link | Evamastu | navigate → /projects/evamastu | PASS |
| link | Aaroh | navigate → /projects/aaroh | PASS |
| link | CareConnect | navigate → /projects/careconnect | PASS |
| link | Day 55 · Mamaearth | navigate → /research/55 | PASS |
| link | Day 57 · Policybazaar | navigate → /research/57 | PASS |

### `/research/57`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Research library | navigate → /research | PASS |
| link | Read the full study on GitHub | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-57-Policybazaar/README.md | PASS |
| link | ASSUMPTIONS file | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-57-Policybazaar/ASSUMPTIONS.md | PASS |
| link | Directory | navigate → https://github.com/gaurav-product/product-management-case-studies/tree/main/Case%20Studies/Day-57-Policybazaar | PASS |
| link | Day 56 · MediBuddy | navigate → /research/56 | PASS |
| link | Day 58 · Delhivery | navigate → /research/58 | PASS |

### `/research/58`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Research library | navigate → /research | PASS |
| link | Read the full study on GitHub | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-58-Delhivery/README.md | PASS |
| link | ASSUMPTIONS file | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-58-Delhivery/ASSUMPTIONS.md | PASS |
| link | Directory | navigate → https://github.com/gaurav-product/product-management-case-studies/tree/main/Case%20Studies/Day-58-Delhivery | PASS |
| link | Day 57 · Policybazaar | navigate → /research/57 | PASS |
| link | Day 59 · ixigo | navigate → /research/59 | PASS |

### `/research/59`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Research library | navigate → /research | PASS |
| link | Read the full study on GitHub | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-59-ixigo/README.md | PASS |
| link | ASSUMPTIONS file | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-59-ixigo/ASSUMPTIONS.md | PASS |
| link | Directory | navigate → https://github.com/gaurav-product/product-management-case-studies/tree/main/Case%20Studies/Day-59-ixigo | PASS |
| link | Day 58 · Delhivery | navigate → /research/58 | PASS |
| link | Day 60 · IndiGo | navigate → /research/60 | PASS |

### `/research/6`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Research library | navigate → /research | PASS |
| link | Read the full study on GitHub | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day%2006%20-%20Duolingo/README.md | PASS |
| link | Directory | navigate → https://github.com/gaurav-product/product-management-case-studies/tree/main/Case%20Studies/Day%2006%20-%20Duolingo | PASS |
| link | Day 5 · Airbnb | navigate → /research/5 | PASS |
| link | Day 7 · PhonePe | navigate → /research/7 | PASS |

### `/research/60`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Research library | navigate → /research | PASS |
| link | Read the full study on GitHub | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-60-IndiGo/README.md | PASS |
| link | ASSUMPTIONS file | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-60-IndiGo/ASSUMPTIONS.md | PASS |
| link | Directory | navigate → https://github.com/gaurav-product/product-management-case-studies/tree/main/Case%20Studies/Day-60-IndiGo | PASS |
| link | Day 59 · ixigo | navigate → /research/59 | PASS |
| link | Day 61 · Atomberg | navigate → /research/61 | PASS |

### `/research/61`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Research library | navigate → /research | PASS |
| link | Read the full study on GitHub | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-61-Atomberg/README.md | PASS |
| link | ASSUMPTIONS file | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-61-Atomberg/ASSUMPTIONS.md | PASS |
| link | Directory | navigate → https://github.com/gaurav-product/product-management-case-studies/tree/main/Case%20Studies/Day-61-Atomberg | PASS |
| link | Day 60 · IndiGo | navigate → /research/60 | PASS |
| link | Day 62 · CtrlS | navigate → /research/62 | PASS |

### `/research/62`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Research library | navigate → /research | PASS |
| link | Read the full study on GitHub | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-62-CtrlS/README.md | PASS |
| link | ASSUMPTIONS file | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-62-CtrlS/ASSUMPTIONS.md | PASS |
| link | Directory | navigate → https://github.com/gaurav-product/product-management-case-studies/tree/main/Case%20Studies/Day-62-CtrlS | PASS |
| link | Day 61 · Atomberg | navigate → /research/61 | PASS |
| link | Day 63 · BookMyShow | navigate → /research/63 | PASS |

### `/research/63`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Research library | navigate → /research | PASS |
| link | Read the full study on GitHub | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-63-BookMyShow/README.md | PASS |
| link | ASSUMPTIONS file | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-63-BookMyShow/ASSUMPTIONS.md | PASS |
| link | Directory | navigate → https://github.com/gaurav-product/product-management-case-studies/tree/main/Case%20Studies/Day-63-BookMyShow | PASS |
| link | Day 62 · CtrlS | navigate → /research/62 | PASS |
| link | Day 64 · Zypp Electric | navigate → /research/64 | PASS |

### `/research/64`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Research library | navigate → /research | PASS |
| link | Read the full study on GitHub | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-64-Zypp-Electric/README.md | PASS |
| link | ASSUMPTIONS file | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-64-Zypp-Electric/ASSUMPTIONS.md | PASS |
| link | Directory | navigate → https://github.com/gaurav-product/product-management-case-studies/tree/main/Case%20Studies/Day-64-Zypp-Electric | PASS |
| link | Day 63 · BookMyShow | navigate → /research/63 | PASS |
| link | Day 65 · Vodafone Idea | navigate → /research/65 | PASS |

### `/research/65`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Research library | navigate → /research | PASS |
| link | Read the full study on GitHub | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-65-Vodafone-Idea/README.md | PASS |
| link | ASSUMPTIONS file | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-65-Vodafone-Idea/ASSUMPTIONS.md | PASS |
| link | Directory | navigate → https://github.com/gaurav-product/product-management-case-studies/tree/main/Case%20Studies/Day-65-Vodafone-Idea | PASS |
| link | Day 64 · Zypp Electric | navigate → /research/64 | PASS |
| link | Day 66 · Star Health | navigate → /research/66 | PASS |

### `/research/66`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Research library | navigate → /research | PASS |
| link | Read the full study on GitHub | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-66-Star-Health/README.md | PASS |
| link | ASSUMPTIONS file | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-66-Star-Health/ASSUMPTIONS.md | PASS |
| link | Directory | navigate → https://github.com/gaurav-product/product-management-case-studies/tree/main/Case%20Studies/Day-66-Star-Health | PASS |
| link | Evamastu | navigate → /projects/evamastu | PASS |
| link | Aaroh | navigate → /projects/aaroh | PASS |
| link | CareConnect | navigate → /projects/careconnect | PASS |
| link | Day 65 · Vodafone Idea | navigate → /research/65 | PASS |
| link | Day 67 · Max Healthcare | navigate → /research/67 | PASS |

### `/research/67`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Research library | navigate → /research | PASS |
| link | Read the full study on GitHub | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-67-Max-Healthcare/README.md | PASS |
| link | ASSUMPTIONS file | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-67-Max-Healthcare/ASSUMPTIONS.md | PASS |
| link | Directory | navigate → https://github.com/gaurav-product/product-management-case-studies/tree/main/Case%20Studies/Day-67-Max-Healthcare | PASS |
| link | Evamastu | navigate → /projects/evamastu | PASS |
| link | Aaroh | navigate → /projects/aaroh | PASS |
| link | CareConnect | navigate → /projects/careconnect | PASS |
| link | Day 66 · Star Health | navigate → /research/66 | PASS |
| link | Day 68 · Dr Lal PathLabs | navigate → /research/68 | PASS |

### `/research/68`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Research library | navigate → /research | PASS |
| link | Read the full study on GitHub | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-68-Dr-Lal-PathLabs/README.md | PASS |
| link | ASSUMPTIONS file | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-68-Dr-Lal-PathLabs/ASSUMPTIONS.md | PASS |
| link | Directory | navigate → https://github.com/gaurav-product/product-management-case-studies/tree/main/Case%20Studies/Day-68-Dr-Lal-PathLabs | PASS |
| link | Evamastu | navigate → /projects/evamastu | PASS |
| link | Aaroh | navigate → /projects/aaroh | PASS |
| link | CareConnect | navigate → /projects/careconnect | PASS |
| link | Day 67 · Max Healthcare | navigate → /research/67 | PASS |
| link | Day 69 · MedPlus | navigate → /research/69 | PASS |

### `/research/69`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Research library | navigate → /research | PASS |
| link | Read the full study on GitHub | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-69-MedPlus/README.md | PASS |
| link | ASSUMPTIONS file | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-69-MedPlus/ASSUMPTIONS.md | PASS |
| link | Directory | navigate → https://github.com/gaurav-product/product-management-case-studies/tree/main/Case%20Studies/Day-69-MedPlus | PASS |
| link | Evamastu | navigate → /projects/evamastu | PASS |
| link | Aaroh | navigate → /projects/aaroh | PASS |
| link | CareConnect | navigate → /projects/careconnect | PASS |
| link | Day 68 · Dr Lal PathLabs | navigate → /research/68 | PASS |
| link | Day 70 · Poly Medicure | navigate → /research/70 | PASS |

### `/research/7`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Research library | navigate → /research | PASS |
| link | Read the full study on GitHub | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day%2007%20-%20PhonePe/README.md | PASS |
| link | Directory | navigate → https://github.com/gaurav-product/product-management-case-studies/tree/main/Case%20Studies/Day%2007%20-%20PhonePe | PASS |
| link | Day 6 · Duolingo | navigate → /research/6 | PASS |
| link | Day 8 · Blinkit | navigate → /research/8 | PASS |

### `/research/70`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Research library | navigate → /research | PASS |
| link | Read the full study on GitHub | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-70-Poly-Medicure/README.md | PASS |
| link | ASSUMPTIONS file | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-70-Poly-Medicure/ASSUMPTIONS.md | PASS |
| link | Directory | navigate → https://github.com/gaurav-product/product-management-case-studies/tree/main/Case%20Studies/Day-70-Poly-Medicure | PASS |
| link | Evamastu | navigate → /projects/evamastu | PASS |
| link | Aaroh | navigate → /projects/aaroh | PASS |
| link | CareConnect | navigate → /projects/careconnect | PASS |
| link | Day 69 · MedPlus | navigate → /research/69 | PASS |
| link | Day 71 · Akums | navigate → /research/71 | PASS |

### `/research/71`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Research library | navigate → /research | PASS |
| link | Read the full study on GitHub | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-71-Akums/README.md | PASS |
| link | ASSUMPTIONS file | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-71-Akums/ASSUMPTIONS.md | PASS |
| link | Directory | navigate → https://github.com/gaurav-product/product-management-case-studies/tree/main/Case%20Studies/Day-71-Akums | PASS |
| link | Evamastu | navigate → /projects/evamastu | PASS |
| link | Aaroh | navigate → /projects/aaroh | PASS |
| link | CareConnect | navigate → /projects/careconnect | PASS |
| link | Day 70 · Poly Medicure | navigate → /research/70 | PASS |
| link | Day 72 · Entero Healthcare | navigate → /research/72 | PASS |

### `/research/72`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Research library | navigate → /research | PASS |
| link | Read the full study on GitHub | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-72-Entero-Healthcare/README.md | PASS |
| link | ASSUMPTIONS file | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-72-Entero-Healthcare/ASSUMPTIONS.md | PASS |
| link | Directory | navigate → https://github.com/gaurav-product/product-management-case-studies/tree/main/Case%20Studies/Day-72-Entero-Healthcare | PASS |
| link | Day 71 · Akums | navigate → /research/71 | PASS |
| link | Day 73 · Rainbow Children's Medicare | navigate → /research/73 | PASS |

### `/research/73`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Research library | navigate → /research | PASS |
| link | Read the full study on GitHub | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-73-Rainbow-Children's-Medicare/README.md | PASS |
| link | ASSUMPTIONS file | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-73-Rainbow-Children's-Medicare/ASSUMPTIONS.md | PASS |
| link | Directory | navigate → https://github.com/gaurav-product/product-management-case-studies/tree/main/Case%20Studies/Day-73-Rainbow-Children's-Medicare | PASS |
| link | Evamastu | navigate → /projects/evamastu | PASS |
| link | Aaroh | navigate → /projects/aaroh | PASS |
| link | CareConnect | navigate → /projects/careconnect | PASS |
| link | Day 72 · Entero Healthcare | navigate → /research/72 | PASS |
| link | Day 74 · Cipla | navigate → /research/74 | PASS |

### `/research/74`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Research library | navigate → /research | PASS |
| link | Read the full study on GitHub | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-74-Cipla/README.md | PASS |
| link | ASSUMPTIONS file | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-74-Cipla/ASSUMPTIONS.md | PASS |
| link | Directory | navigate → https://github.com/gaurav-product/product-management-case-studies/tree/main/Case%20Studies/Day-74-Cipla | PASS |
| link | Evamastu | navigate → /projects/evamastu | PASS |
| link | Aaroh | navigate → /projects/aaroh | PASS |
| link | CareConnect | navigate → /projects/careconnect | PASS |
| link | Day 73 · Rainbow Children's Medicare | navigate → /research/73 | PASS |
| link | Day 75 · Medi Assist | navigate → /research/75 | PASS |

### `/research/75`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Research library | navigate → /research | PASS |
| link | Read the full study on GitHub | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-75-Medi-Assist/README.md | PASS |
| link | ASSUMPTIONS file | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-75-Medi-Assist/ASSUMPTIONS.md | PASS |
| link | Directory | navigate → https://github.com/gaurav-product/product-management-case-studies/tree/main/Case%20Studies/Day-75-Medi-Assist | PASS |
| link | Evamastu | navigate → /projects/evamastu | PASS |
| link | Aaroh | navigate → /projects/aaroh | PASS |
| link | CareConnect | navigate → /projects/careconnect | PASS |
| link | Day 74 · Cipla | navigate → /research/74 | PASS |
| link | Day 76 · Dr Agarwals Healthcare | navigate → /research/76 | PASS |

### `/research/76`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Research library | navigate → /research | PASS |
| link | Read the full study on GitHub | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-76-Dr-Agarwals-Healthcare/README.md | PASS |
| link | ASSUMPTIONS file | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-76-Dr-Agarwals-Healthcare/ASSUMPTIONS.md | PASS |
| link | Directory | navigate → https://github.com/gaurav-product/product-management-case-studies/tree/main/Case%20Studies/Day-76-Dr-Agarwals-Healthcare | PASS |
| link | Evamastu | navigate → /projects/evamastu | PASS |
| link | Aaroh | navigate → /projects/aaroh | PASS |
| link | CareConnect | navigate → /projects/careconnect | PASS |
| link | Day 75 · Medi Assist | navigate → /research/75 | PASS |
| link | Day 77 · NephroPlus | navigate → /research/77 | PASS |

### `/research/77`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Research library | navigate → /research | PASS |
| link | Read the full study on GitHub | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-77-NephroPlus/README.md | PASS |
| link | ASSUMPTIONS file | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-77-NephroPlus/ASSUMPTIONS.md | PASS |
| link | Directory | navigate → https://github.com/gaurav-product/product-management-case-studies/tree/main/Case%20Studies/Day-77-NephroPlus | PASS |
| link | Evamastu | navigate → /projects/evamastu | PASS |
| link | Aaroh | navigate → /projects/aaroh | PASS |
| link | CareConnect | navigate → /projects/careconnect | PASS |
| link | Day 76 · Dr Agarwals Healthcare | navigate → /research/76 | PASS |
| link | Day 78 · Oura | navigate → /research/78 | PASS |

### `/research/78`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Research library | navigate → /research | PASS |
| link | Read the full study on GitHub | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-78-Oura/README.md | PASS |
| link | ASSUMPTIONS file | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-78-Oura/ASSUMPTIONS.md | PASS |
| link | Directory | navigate → https://github.com/gaurav-product/product-management-case-studies/tree/main/Case%20Studies/Day-78-Oura | PASS |
| link | Evamastu | navigate → /projects/evamastu | PASS |
| link | Aaroh | navigate → /projects/aaroh | PASS |
| link | CareConnect | navigate → /projects/careconnect | PASS |
| link | Day 77 · NephroPlus | navigate → /research/77 | PASS |
| link | Day 79 · Ultrahuman | navigate → /research/79 | PASS |

### `/research/79`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Research library | navigate → /research | PASS |
| link | Read the full study on GitHub | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-79-Ultrahuman/README.md | PASS |
| link | ASSUMPTIONS file | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-79-Ultrahuman/ASSUMPTIONS.md | PASS |
| link | Directory | navigate → https://github.com/gaurav-product/product-management-case-studies/tree/main/Case%20Studies/Day-79-Ultrahuman | PASS |
| link | Evamastu | navigate → /projects/evamastu | PASS |
| link | Aaroh | navigate → /projects/aaroh | PASS |
| link | CareConnect | navigate → /projects/careconnect | PASS |
| link | Day 78 · Oura | navigate → /research/78 | PASS |
| link | Day 80 · Hims and Hers | navigate → /research/80 | PASS |

### `/research/8`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Research library | navigate → /research | PASS |
| link | Read the full study on GitHub | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-08-Blinkit/README.md | PASS |
| link | Directory | navigate → https://github.com/gaurav-product/product-management-case-studies/tree/main/Case%20Studies/Day-08-Blinkit | PASS |
| link | Day 7 · PhonePe | navigate → /research/7 | PASS |
| link | Day 9 · Swiggy | navigate → /research/9 | PASS |

### `/research/80`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Research library | navigate → /research | PASS |
| link | Read the full study on GitHub | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-80-Hims-and-Hers/README.md | PASS |
| link | ASSUMPTIONS file | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-80-Hims-and-Hers/ASSUMPTIONS.md | PASS |
| link | Directory | navigate → https://github.com/gaurav-product/product-management-case-studies/tree/main/Case%20Studies/Day-80-Hims-and-Hers | PASS |
| link | Evamastu | navigate → /projects/evamastu | PASS |
| link | Aaroh | navigate → /projects/aaroh | PASS |
| link | CareConnect | navigate → /projects/careconnect | PASS |
| link | Day 79 · Ultrahuman | navigate → /research/79 | PASS |
| link | Day 81 · Hinge Health | navigate → /research/81 | PASS |

### `/research/81`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Research library | navigate → /research | PASS |
| link | Read the full study on GitHub | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-81-Hinge-Health/README.md | PASS |
| link | ASSUMPTIONS file | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-81-Hinge-Health/ASSUMPTIONS.md | PASS |
| link | Directory | navigate → https://github.com/gaurav-product/product-management-case-studies/tree/main/Case%20Studies/Day-81-Hinge-Health | PASS |
| link | Evamastu | navigate → /projects/evamastu | PASS |
| link | Aaroh | navigate → /projects/aaroh | PASS |
| link | CareConnect | navigate → /projects/careconnect | PASS |
| link | Day 80 · Hims and Hers | navigate → /research/80 | PASS |
| link | Day 82 · Doximity | navigate → /research/82 | PASS |

### `/research/82`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Research library | navigate → /research | PASS |
| link | Read the full study on GitHub | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-82-Doximity/README.md | PASS |
| link | ASSUMPTIONS file | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-82-Doximity/ASSUMPTIONS.md | PASS |
| link | Directory | navigate → https://github.com/gaurav-product/product-management-case-studies/tree/main/Case%20Studies/Day-82-Doximity | PASS |
| link | Evamastu | navigate → /projects/evamastu | PASS |
| link | Aaroh | navigate → /projects/aaroh | PASS |
| link | CareConnect | navigate → /projects/careconnect | PASS |
| link | Day 81 · Hinge Health | navigate → /research/81 | PASS |
| link | Day 83 · OpenEvidence | navigate → /research/83 | PASS |

### `/research/83`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Research library | navigate → /research | PASS |
| link | Read the full study on GitHub | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-83-OpenEvidence/README.md | PASS |
| link | ASSUMPTIONS file | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-83-OpenEvidence/ASSUMPTIONS.md | PASS |
| link | Directory | navigate → https://github.com/gaurav-product/product-management-case-studies/tree/main/Case%20Studies/Day-83-OpenEvidence | PASS |
| link | Aaroh | navigate → /projects/aaroh | PASS |
| link | GharGyaan | navigate → /projects/ghargyaan | PASS |
| link | Nexus | navigate → /projects/nexus | PASS |
| link | Day 82 · Doximity | navigate → /research/82 | PASS |
| link | Day 84 · Abridge | navigate → /research/84 | PASS |

### `/research/84`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Research library | navigate → /research | PASS |
| link | Read the full study on GitHub | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-84-Abridge/README.md | PASS |
| link | ASSUMPTIONS file | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-84-Abridge/ASSUMPTIONS.md | PASS |
| link | Directory | navigate → https://github.com/gaurav-product/product-management-case-studies/tree/main/Case%20Studies/Day-84-Abridge | PASS |
| link | Aaroh | navigate → /projects/aaroh | PASS |
| link | GharGyaan | navigate → /projects/ghargyaan | PASS |
| link | Nexus | navigate → /projects/nexus | PASS |
| link | Day 83 · OpenEvidence | navigate → /research/83 | PASS |
| link | Day 85 · Eka Care | navigate → /research/85 | PASS |

### `/research/85`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Research library | navigate → /research | PASS |
| link | Read the full study on GitHub | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-85-Eka-Care/README.md | PASS |
| link | ASSUMPTIONS file | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-85-Eka-Care/ASSUMPTIONS.md | PASS |
| link | Directory | navigate → https://github.com/gaurav-product/product-management-case-studies/tree/main/Case%20Studies/Day-85-Eka-Care | PASS |
| link | Day 84 · Abridge | navigate → /research/84 | PASS |
| link | Day 86 · Hippocratic AI | navigate → /research/86 | PASS |

### `/research/86`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Research library | navigate → /research | PASS |
| link | Read the full study on GitHub | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-86-Hippocratic-AI/README.md | PASS |
| link | ASSUMPTIONS file | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-86-Hippocratic-AI/ASSUMPTIONS.md | PASS |
| link | Directory | navigate → https://github.com/gaurav-product/product-management-case-studies/tree/main/Case%20Studies/Day-86-Hippocratic-AI | PASS |
| link | Aaroh | navigate → /projects/aaroh | PASS |
| link | GharGyaan | navigate → /projects/ghargyaan | PASS |
| link | Nexus | navigate → /projects/nexus | PASS |
| link | Day 85 · Eka Care | navigate → /research/85 | PASS |
| link | Day 87 · Tempus AI | navigate → /research/87 | PASS |

### `/research/87`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Research library | navigate → /research | PASS |
| link | Read the full study on GitHub | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-87-Tempus-AI/README.md | PASS |
| link | ASSUMPTIONS file | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-87-Tempus-AI/ASSUMPTIONS.md | PASS |
| link | Directory | navigate → https://github.com/gaurav-product/product-management-case-studies/tree/main/Case%20Studies/Day-87-Tempus-AI | PASS |
| link | Aaroh | navigate → /projects/aaroh | PASS |
| link | GharGyaan | navigate → /projects/ghargyaan | PASS |
| link | Nexus | navigate → /projects/nexus | PASS |
| link | Day 86 · Hippocratic AI | navigate → /research/86 | PASS |
| link | Day 88 · Qure ai | navigate → /research/88 | PASS |

### `/research/88`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Research library | navigate → /research | PASS |
| link | Read the full study on GitHub | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-88-Qure-ai/README.md | PASS |
| link | ASSUMPTIONS file | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-88-Qure-ai/ASSUMPTIONS.md | PASS |
| link | Directory | navigate → https://github.com/gaurav-product/product-management-case-studies/tree/main/Case%20Studies/Day-88-Qure-ai | PASS |
| link | Aaroh | navigate → /projects/aaroh | PASS |
| link | GharGyaan | navigate → /projects/ghargyaan | PASS |
| link | Nexus | navigate → /projects/nexus | PASS |
| link | Day 87 · Tempus AI | navigate → /research/87 | PASS |
| link | Day 89 · Gaudium IVF | navigate → /research/89 | PASS |

### `/research/89`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Research library | navigate → /research | PASS |
| link | Read the full study on GitHub | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-89-Gaudium-IVF/README.md | PASS |
| link | ASSUMPTIONS file | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-89-Gaudium-IVF/ASSUMPTIONS.md | PASS |
| link | Directory | navigate → https://github.com/gaurav-product/product-management-case-studies/tree/main/Case%20Studies/Day-89-Gaudium-IVF | PASS |
| link | Evamastu | navigate → /projects/evamastu | PASS |
| link | Aaroh | navigate → /projects/aaroh | PASS |
| link | CareConnect | navigate → /projects/careconnect | PASS |
| link | Day 88 · Qure ai | navigate → /research/88 | PASS |
| link | Day 90 · Health in ChatGPT | navigate → /research/90 | PASS |

### `/research/9`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Research library | navigate → /research | PASS |
| link | Read the full study on GitHub | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-09-Swiggy/README.md | PASS |
| link | Directory | navigate → https://github.com/gaurav-product/product-management-case-studies/tree/main/Case%20Studies/Day-09-Swiggy | PASS |
| link | Day 8 · Blinkit | navigate → /research/8 | PASS |
| link | Day 10 · LinkedIn | navigate → /research/10 | PASS |

### `/research/90`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Research library | navigate → /research | PASS |
| link | Read the full study on GitHub | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-90-Health-in-ChatGPT/README.md | PASS |
| link | ASSUMPTIONS file | navigate → https://github.com/gaurav-product/product-management-case-studies/blob/main/Case%20Studies/Day-90-Health-in-ChatGPT/ASSUMPTIONS.md | PASS |
| link | Directory | navigate → https://github.com/gaurav-product/product-management-case-studies/tree/main/Case%20Studies/Day-90-Health-in-ChatGPT | PASS |
| link | Aaroh | navigate → /projects/aaroh | PASS |
| link | GharGyaan | navigate → /projects/ghargyaan | PASS |
| link | Nexus | navigate → /projects/nexus | PASS |
| link | Day 89 · Gaudium IVF | navigate → /research/89 | PASS |

### `/search`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| button | Evamastu | run handler | PASS |
| button | funnel analysis | run handler | PASS |
| button | AI safety | run handler | PASS |
| button | RICE | run handler | PASS |
| button | post-discharge | run handler | PASS |
| button | Day 90 | run handler | PASS |

### `/skills`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Problem discovery WORK DISCOVERY Finding the problems worth solving before choos | navigate → /skills/problem-discovery | PASS |
| link | Problem framing WORK DISCOVERY Stating a problem so that someone could disagree  | navigate → /skills/problem-framing | PASS |
| link | Opportunity identification WORK DISCOVERY Spotting where an unmet need meets a f | navigate → /skills/opportunity-identification | PASS |
| link | User research WORK DISCOVERY Systematic study of users' behaviour, needs and con | navigate → /skills/user-research | PASS |
| link | Customer interviews WORK DISCOVERY Structured conversations with prospective use | navigate → /skills/discovery-interviews | PASS |
| link | Stakeholder interviews WORK DISCOVERY Interviews with the people around the user | navigate → /skills/stakeholder-interviews | PASS |
| link | Jobs to Be Done CASE STUDIES DISCOVERY Describing the progress a person is tryin | navigate → /skills/jtbd | PASS |
| link | Jobs-to-be-Done interviews NONE DISCOVERY Interviews that reconstruct the moment | navigate → /skills/jtbd-interviews | PASS |
| link | User personas WORK DISCOVERY Evidence-based archetypes of target users. | navigate → /skills/personas | PASS |
| link | User segmentation WORK DISCOVERY Dividing users into groups that behave differen | navigate → /skills/segmentation | PASS |
| link | Empathy mapping NONE DISCOVERY Mapping what a user says, thinks, does and feels. | navigate → /skills/empathy-mapping | PASS |
| link | User journey mapping WORK DISCOVERY Mapping a user's steps, touchpoints and pain | navigate → /skills/journey-mapping | PASS |
| link | Pain-point analysis WORK DISCOVERY Identifying and ranking the frictions users e | navigate → /skills/pain-points | PASS |
| link | Opportunity solution trees NONE DISCOVERY Linking an outcome to opportunities an | navigate → /skills/ost | PASS |
| link | Assumption mapping WORK DISCOVERY Listing and ranking the assumptions a plan dep | navigate → /skills/assumption-mapping | PASS |
| link | Hypothesis generation WORK DISCOVERY Writing beliefs as falsifiable statements. | navigate → /skills/hypothesis | PASS |
| link | Problem validation WORK DISCOVERY Testing that a problem is real, frequent and p | navigate → /skills/problem-validation | PASS |
| link | Market research CASE STUDIES DISCOVERY Understanding market size, structure and  | navigate → /skills/market-research | PASS |
| link | Competitive research WORK DISCOVERY Studying alternatives users already have. | navigate → /skills/competitive-research | PASS |
| link | Voice of Customer WORK DISCOVERY Capturing customer language and feedback system | navigate → /skills/voc | PASS |
| link | Qualitative research WORK DISCOVERY Interviews, observation and synthesis of mea | navigate → /skills/qualitative-research | PASS |
| link | Quantitative research WORK DISCOVERY Measurement across many users. | navigate → /skills/quantitative-research | PASS |
| link | Product vision WORK PRODUCT STRATEGY The future a product is trying to create. | navigate → /skills/product-vision | PASS |
| link | Product mission CASE STUDIES PRODUCT STRATEGY What the product does, for whom, n | navigate → /skills/product-mission | PASS |
| link | Product positioning WORK PRODUCT STRATEGY How a product is framed against altern | navigate → /skills/positioning | PASS |
| link | Product strategy WORK PRODUCT STRATEGY The choices about where to play and how t | navigate → /skills/product-strategy | PASS |
| link | Product-market fit NONE PRODUCT STRATEGY Evidence that a market pulls a product. | navigate → /skills/pmf | PASS |
| link | Market segmentation WORK PRODUCT STRATEGY Dividing a market into addressable gro | navigate → /skills/market-segmentation | PASS |
| link | TAM, SAM and SOM CASE STUDIES PRODUCT STRATEGY Total, serviceable and obtainable | navigate → /skills/tam-sam-som | PASS |
| link | Competitive differentiation WORK PRODUCT STRATEGY What makes a product meaningfu | navigate → /skills/differentiation | PASS |
| link | Value proposition WORK PRODUCT STRATEGY The promise of value to a specific user. | navigate → /skills/value-proposition | PASS |
| link | Business model CASE STUDIES PRODUCT STRATEGY How a product creates and captures  | navigate → /skills/business-model | PASS |
| link | Monetization WORK PRODUCT STRATEGY Choosing how and when to charge. | navigate → /skills/monetization | PASS |
| link | Go-to-market strategy WORK PRODUCT STRATEGY How a product reaches its first user | navigate → /skills/gtm | PASS |
| link | Product lifecycle WORK PRODUCT STRATEGY Managing a product from introduction thr | navigate → /skills/product-lifecycle | PASS |
| link | Strategic trade-offs WORK PRODUCT STRATEGY Choosing what to give up, explicitly. | navigate → /skills/tradeoffs | PASS |
| link | Strategic roadmap WORK PRODUCT STRATEGY Sequencing bets over time against a goal | navigate → /skills/roadmap | PASS |
| link | Opportunity sizing CASE STUDIES PRODUCT STRATEGY Estimating the value of solving | navigate → /skills/opportunity-sizing | PASS |
| link | Build vs buy WORK PRODUCT STRATEGY Deciding what to build, buy or partner for. | navigate → /skills/build-vs-buy | PASS |
| link | Product roadmap WORK EXECUTION Turning strategy into a sequenced plan. | navigate → /skills/roadmap-planning | PASS |
| link | Quarterly planning NONE EXECUTION Committing a quarter's goals and capacity. | navigate → /skills/quarterly-planning | PASS |
| link | MVP definition WORK EXECUTION The smallest product that tests the riskiest assum | navigate → /skills/mvp | PASS |
| link | Feature prioritization WORK EXECUTION Ordering features by value, cost and risk. | navigate → /skills/feature-prioritization | PASS |
| link | RICE WORK EXECUTION Reach × Impact × Confidence ÷ Effort. | navigate → /skills/rice | PASS |
| link | MoSCoW WORK EXECUTION Must, Should, Could, Won't. | navigate → /skills/moscow | PASS |
| link | ICE NONE EXECUTION Impact × Confidence × Ease. | navigate → /skills/ice | PASS |
| link | Kano Model NONE EXECUTION Classifying features as basic, performance or delight. | navigate → /skills/kano | PASS |
| link | Impact vs effort NONE EXECUTION A two-axis quick prioritization. | navigate → /skills/impact-effort | PASS |
| link | Value vs complexity NONE EXECUTION Weighing user value against delivery complexi | navigate → /skills/value-complexity | PASS |
| link | Cost of delay NONE EXECUTION The value lost by waiting. | navigate → /skills/cost-of-delay | PASS |
| link | Dependency mapping WORK EXECUTION Making cross-team and technical dependencies e | navigate → /skills/dependency-mapping | PASS |
| link | Scope management WORK EXECUTION Holding scope to the goal. | navigate → /skills/scope-management | PASS |
| link | Product Requirement Document WORK EXECUTION The written definition of what to bu | navigate → /skills/prd | PASS |
| link | Product requirement specifications CASE STUDIES EXECUTION Detailed functional sp | navigate → /skills/prs | PASS |
| link | User stories WORK EXECUTION Requirements written from the user's point of view. | navigate → /skills/user-stories | PASS |
| link | Acceptance criteria WORK EXECUTION Testable conditions for done. | navigate → /skills/acceptance-criteria | PASS |
| link | Functional requirements CASE STUDIES EXECUTION What the system must do. | navigate → /skills/functional-requirements | PASS |
| link | Non-functional requirements WORK EXECUTION Performance, security, accessibility  | navigate → /skills/nfr | PASS |
| link | User flows WORK EXECUTION Step-by-step paths through a product. | navigate → /skills/user-flows | PASS |
| link | Wireframes NONE EXECUTION Low-fidelity layouts. | navigate → /skills/wireframes | PASS |
| link | Prototypes WORK EXECUTION Interactive models of a product. | navigate → /skills/prototypes | PASS |
| link | Backlog management WORK EXECUTION Keeping the backlog ordered and current. | navigate → /skills/backlog | PASS |
| link | Sprint planning WORK EXECUTION Committing a sprint's scope. | navigate → /skills/sprint-planning | PASS |
| link | Sprint reviews NONE EXECUTION Demonstrating and inspecting sprint output. | navigate → /skills/sprint-reviews | PASS |
| link | Sprint retrospectives NONE EXECUTION Improving how the team works. | navigate → /skills/retrospectives | PASS |
| link | Agile WORK EXECUTION Iterative, feedback-driven delivery. | navigate → /skills/agile | PASS |
| link | Scrum NONE EXECUTION An Agile framework of sprints and roles. | navigate → /skills/scrum | PASS |
| link | Kanban NONE EXECUTION Flow-based work management. | navigate → /skills/kanban | PASS |
| link | Cross-functional collaboration WORK EXECUTION Working across design, engineering | navigate → /skills/cross-functional | PASS |
| link | Engineering handoff WORK EXECUTION Transferring requirements to engineering clea | navigate → /skills/eng-handoff | PASS |
| link | QA and UAT WORK EXECUTION Testing quality and user acceptance. | navigate → /skills/qa-uat | PASS |
| link | Release management WORK EXECUTION Planning and coordinating releases. | navigate → /skills/release-management | PASS |
| link | Change management NONE EXECUTION Helping users and teams adopt change. | navigate → /skills/change-management | PASS |
| link | Information architecture WORK DESIGN Structuring content so people can find it. | navigate → /skills/information-architecture | PASS |
| link | UX research WORK DESIGN Research focused on interaction and usability. | navigate → /skills/ux-research | PASS |
| link | Interaction design WORK DESIGN Designing how users act and the system responds. | navigate → /skills/interaction-design | PASS |
| link | Usability testing WORK DESIGN Watching users attempt real tasks. | navigate → /skills/usability-testing | PASS |
| link | Low-fidelity prototypes NONE DESIGN Rough interactive sketches. | navigate → /skills/lofi | PASS |
| link | High-fidelity prototypes WORK DESIGN Near-final interactive designs. | navigate → /skills/hifi | PASS |
| link | Design systems NONE DESIGN Reusable components and tokens. | navigate → /skills/design-systems | PASS |
| link | Accessibility WORK DESIGN Making products usable by everyone. | navigate → /skills/accessibility | PASS |
| link | Responsive design WORK DESIGN Layouts that work at every size. | navigate → /skills/responsive | PASS |
| link | Onboarding WORK DESIGN A new user's first experience. | navigate → /skills/onboarding | PASS |
| link | Activation WORK DESIGN The moment a user first gets value. | navigate → /skills/activation | PASS |
| link | Retention WORK DESIGN Bringing users back because they get value. | navigate → /skills/retention-design | PASS |
| link | Customer journey CASE STUDIES DESIGN The end-to-end relationship with a product. | navigate → /skills/customer-journey | PASS |
| link | North Star Metric WORK ANALYTICS The one metric that best captures delivered val | navigate → /skills/north-star | PASS |
| link | KPIs WORK ANALYTICS The key indicators a team tracks. | navigate → /skills/kpis | PASS |
| link | Input and output metrics WORK ANALYTICS Leading actions vs lagging results. | navigate → /skills/input-output-metrics | PASS |
| link | Engagement WORK ANALYTICS How actively users use a product. | navigate → /skills/engagement | PASS |
| link | Churn NONE ANALYTICS Users or revenue lost over time. | navigate → /skills/churn | PASS |
| link | Conversion WORK ANALYTICS The share of users who complete a step. | navigate → /skills/conversion | PASS |
| link | Funnel analysis WORK ANALYTICS Measuring step-by-step conversion through a flow. | navigate → /skills/funnel-analysis | PASS |
| link | Cohort analysis WORK ANALYTICS Comparing groups that started at the same time or | navigate → /skills/cohort-analysis | PASS |
| link | Segmentation analysis WORK ANALYTICS Breaking metrics down by user group. | navigate → /skills/segmentation-analytics | PASS |
| link | DAU, WAU and MAU NONE ANALYTICS Daily, weekly and monthly active users. | navigate → /skills/dau-wau-mau | PASS |
| link | Stickiness NONE ANALYTICS DAU ÷ MAU — how habitual use is. | navigate → /skills/stickiness | PASS |
| link | Time to value WORK ANALYTICS How long until a user first gets value. | navigate → /skills/time-to-value | PASS |
| link | Customer lifetime value NONE ANALYTICS Expected value of a customer over time. | navigate → /skills/ltv | PASS |
| link | CAC NONE ANALYTICS Cost to acquire a customer. | navigate → /skills/cac | PASS |
| link | LTV:CAC NONE ANALYTICS Lifetime value relative to acquisition cost. | navigate → /skills/ltv-cac | PASS |
| link | AARRR funnel NONE ANALYTICS Acquisition, activation, retention, referral, revenu | navigate → /skills/aarrr | PASS |
| link | Event tracking WORK ANALYTICS Recording user actions as events. | navigate → /skills/event-tracking | PASS |
| link | Instrumentation WORK ANALYTICS Designing what to measure before launch. | navigate → /skills/instrumentation | PASS |
| link | Analytics dashboards WORK ANALYTICS Visualising product metrics. | navigate → /skills/dashboards | PASS |
| link | Data-driven decision-making WORK ANALYTICS Letting evidence decide. | navigate → /skills/data-driven | PASS |
| link | Hypothesis development WORK GROWTH Turning an observation into a testable bet. | navigate → /skills/hypothesis-development | PASS |
| link | A/B testing WORK GROWTH Randomised comparison of variants. | navigate → /skills/ab-testing | PASS |
| link | Experiment design WORK GROWTH Defining variants, metrics, duration and stopping  | navigate → /skills/experiment-design | PASS |
| link | Control and treatment groups WORK GROWTH Comparing a baseline with a change. | navigate → /skills/control-treatment | PASS |
| link | Primary metrics WORK GROWTH The metric an experiment is decided on. | navigate → /skills/primary-metrics | PASS |
| link | Guardrail metrics WORK GROWTH Metrics that must not get worse. | navigate → /skills/guardrail-metrics | PASS |
| link | Statistical significance NONE GROWTH Whether a difference is likely to be real. | navigate → /skills/stat-sig | PASS |
| link | Sample size NONE GROWTH How many users a test needs. | navigate → /skills/sample-size | PASS |
| link | Experiment duration WORK GROWTH How long a test must run. | navigate → /skills/experiment-duration | PASS |
| link | Conversion optimization WORK GROWTH Improving conversion at a step. | navigate → /skills/cro | PASS |
| link | Growth loops NONE GROWTH Self-reinforcing acquisition cycles. | navigate → /skills/growth-loops | PASS |
| link | Referral loops NONE GROWTH Users bringing in users. | navigate → /skills/referral-loops | PASS |
| link | Funnel optimization WORK GROWTH Systematically reducing loss across a funnel. | navigate → /skills/funnel-optimization | PASS |
| link | Onboarding optimization WORK GROWTH Improving first-run completion and value. | navigate → /skills/onboarding-optimization | PASS |
| link | Retention strategies NONE GROWTH Deliberate efforts to keep users. | navigate → /skills/retention-strategies | PASS |
| link | Iteration WORK GROWTH Changing one thing at a time and re-measuring. | navigate → /skills/iteration | PASS |
| link | AI product strategy WORK AI Deciding where AI earns its place in a product. | navigate → /skills/ai-product-strategy | PASS |
| link | AI use-case discovery WORK AI Finding user problems AI is suited to. | navigate → /skills/ai-use-cases | PASS |
| link | AI feasibility WORK AI Judging whether AI can do a job reliably enough. | navigate → /skills/ai-feasibility | PASS |
| link | AI product requirements WORK AI Requirements that include model behaviour and li | navigate → /skills/ai-requirements | PASS |
| link | LLM product design WORK AI Designing products around language models. | navigate → /skills/llm-design | PASS |
| link | Prompt engineering NONE AI Designing instructions for models. | navigate → /skills/prompt-engineering | PASS |
| link | RAG concepts WORK AI Retrieval-augmented generation. | navigate → /skills/rag | PASS |
| link | Context engineering WORK AI Choosing what context a model sees. | navigate → /skills/context-engineering | PASS |
| link | Agentic workflows NONE AI Models that plan and act with tools. | navigate → /skills/agentic | PASS |
| link | Model evaluation WORK AI Measuring model or system behaviour against cases. | navigate → /skills/model-evaluation | PASS |
| link | Evaluation datasets WORK AI Curated cases that define good behaviour. | navigate → /skills/evaluation-datasets | PASS |
| link | Hallucination mitigation WORK AI Preventing unsupported model output. | navigate → /skills/hallucination-mitigation | PASS |
| link | AI safety WORK AI Preventing harm from AI behaviour. | navigate → /skills/ai-safety | PASS |
| link | Human-in-the-loop WORK AI Keeping humans in decisions that matter. | navigate → /skills/human-in-the-loop | PASS |
| link | Model limitations WORK AI Knowing and stating what a model cannot do. | navigate → /skills/model-limitations | PASS |
| link | Guardrails WORK AI Hard limits on system behaviour. | navigate → /skills/guardrails | PASS |
| link | AI UX WORK AI Interfaces that make AI behaviour legible. | navigate → /skills/ai-ux | PASS |
| link | Cost and latency NONE AI Trading model quality against cost and speed. | navigate → /skills/cost-latency | PASS |
| link | AI observability NONE AI Monitoring AI behaviour in production. | navigate → /skills/ai-observability | PASS |
| link | Responsible AI WORK AI Designing AI for fairness, safety and accountability. | navigate → /skills/responsible-ai | PASS |
| link | Privacy and consent WORK AI Collecting only what is needed, with consent. | navigate → /skills/privacy | PASS |
| link | Patient journey WORK HEALTHCARE A patient's path through care. | navigate → /skills/patient-journey | PASS |
| link | Caregiver journey WORK HEALTHCARE The family and attendant side of care. | navigate → /skills/caregiver-journey | PASS |
| link | Provider workflow WORK HEALTHCARE How practitioners actually work. | navigate → /skills/provider-workflow | PASS |
| link | Digital health discovery WORK HEALTHCARE Discovery for health products. | navigate → /skills/digital-health-discovery | PASS |
| link | Healthcare onboarding WORK HEALTHCARE First-run experiences for health products. | navigate → /skills/health-onboarding | PASS |
| link | Patient engagement WORK HEALTHCARE Sustained participation in care. | navigate → /skills/patient-engagement | PASS |
| link | Post-discharge care WORK HEALTHCARE Care after leaving hospital. | navigate → /skills/post-discharge | PASS |
| link | Care continuity WORK HEALTHCARE Information that survives handoffs. | navigate → /skills/care-continuity | PASS |
| link | Health information architecture WORK HEALTHCARE Structuring health information f | navigate → /skills/health-ia | PASS |
| link | Non-diagnostic product design WORK HEALTHCARE Designing health products that nev | navigate → /skills/non-diagnostic-design | PASS |
| link | Consent-based onboarding WORK HEALTHCARE Onboarding participants with explicit c | navigate → /skills/consent-onboarding | PASS |
| link | Evidence labelling WORK HEALTHCARE Showing how strong the evidence behind guidan | navigate → /skills/evidence-labelling | PASS |
| link | Clinical safety boundaries WORK HEALTHCARE Limits that keep a product out of cli | navigate → /skills/clinical-safety | PASS |
| link | Crisis routing WORK HEALTHCARE Sending emergencies to the right help immediately | navigate → /skills/crisis-routing | PASS |
| link | Healthcare privacy WORK HEALTHCARE Protecting health data. | navigate → /skills/health-privacy | PASS |
| link | Responsible health communication WORK HEALTHCARE Plain, honest, non-alarming hea | navigate → /skills/responsible-health-comms | PASS |
| link | React and TypeScript WORK TECHNICAL Building web interfaces. | navigate → /skills/react-typescript | PASS |
| link | SQLite WORK TECHNICAL Embedded relational database. | navigate → /skills/sqlite | PASS |
| link | Claude API and MCP WORK TECHNICAL Building with Anthropic's platform. | navigate → /skills/claude-api | PASS |
| link | Automated testing WORK TECHNICAL Unit, integration and end-to-end tests. | navigate → /skills/testing-automation | PASS |
| link | GitHub WORK TECHNICAL Version control and public artefacts. | navigate → /skills/github | PASS |
| link | Stakeholder management WORK COMMUNICATION & COLLABORATION Aligning people with d | navigate → /skills/stakeholder-management | PASS |
| link | Cross-functional communication WORK COMMUNICATION & COLLABORATION Clear communic | navigate → /skills/cross-functional-comms | PASS |
| link | Product documentation WORK COMMUNICATION & COLLABORATION Writing that a team can | navigate → /skills/documentation | PASS |
| link | Decision logs WORK COMMUNICATION & COLLABORATION Recording decisions with contex | navigate → /skills/decision-log | PASS |
| link | Claim registers WORK COMMUNICATION & COLLABORATION Grading conclusions by eviden | navigate → /skills/claim-register | PASS |
| link | Risk registers CASE STUDIES COMMUNICATION & COLLABORATION Tracking risks and mit | navigate → /skills/risk-register | PASS |
| link | Sprint reporting WORK COMMUNICATION & COLLABORATION Reporting sprint outcomes. | navigate → /skills/sprint-reporting | PASS |
| link | Release coordination WORK COMMUNICATION & COLLABORATION Coordinating teams aroun | navigate → /skills/release-coordination | PASS |
| link | Process improvement CASE STUDIES COMMUNICATION & COLLABORATION Improving how wor | navigate → /skills/process-improvement | PASS |
| link | Pivoting on evidence WORK COMMUNICATION & COLLABORATION Changing direction when  | navigate → /skills/pivot | PASS |
| field | Search skills | input (search) | PASS |
| field | Category
All
Discovery
Product Strategy
Execution
Analytics
 | input (select-one) | PASS |
| field | Evidence status
All
Demonstrated in work
Applied in case stu | input (select-one) | PASS |

### `/skills/aarrr`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | North Star Metric | navigate → /skills/north-star | PASS |
| link | KPIs | navigate → /skills/kpis | PASS |
| link | Input and output metrics | navigate → /skills/input-output-metrics | PASS |
| link | Engagement | navigate → /skills/engagement | PASS |
| link | Churn | navigate → /skills/churn | PASS |
| link | Conversion | navigate → /skills/conversion | PASS |
| link | Funnel analysis | navigate → /skills/funnel-analysis | PASS |
| link | Cohort analysis | navigate → /skills/cohort-analysis | PASS |

### `/skills/ab-testing`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | Research Expert — Live Your Best Life (USA) · Employment | navigate → /experience/research-expert-lybl | PASS |
| link | PhonePe Smart Spend Coach · Academic case study · Masai School × IIT Roorkee | navigate → /projects/phonepe-smart-spend-coach | PASS |
| link | PhonePe Smart Spend Coach | navigate → /projects/phonepe-smart-spend-coach | PASS |
| link | Hypothesis development | navigate → /skills/hypothesis-development | PASS |
| link | Experiment design | navigate → /skills/experiment-design | PASS |
| link | Control and treatment groups | navigate → /skills/control-treatment | PASS |
| link | Primary metrics | navigate → /skills/primary-metrics | PASS |
| link | Guardrail metrics | navigate → /skills/guardrail-metrics | PASS |
| link | Statistical significance | navigate → /skills/stat-sig | PASS |
| link | Sample size | navigate → /skills/sample-size | PASS |
| link | Experiment duration | navigate → /skills/experiment-duration | PASS |

### `/skills/acceptance-criteria`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | Product Management Intern — Adhyatm Sadhna Kendra · Employment | navigate → /experience/pm-intern-adhyatm-sadhna-kendra | PASS |
| link | Aaroh · Independent · founder | navigate → /projects/aaroh | PASS |
| link | Product roadmap | navigate → /skills/roadmap-planning | PASS |
| link | Quarterly planning | navigate → /skills/quarterly-planning | PASS |
| link | MVP definition | navigate → /skills/mvp | PASS |
| link | Feature prioritization | navigate → /skills/feature-prioritization | PASS |
| link | RICE | navigate → /skills/rice | PASS |
| link | MoSCoW | navigate → /skills/moscow | PASS |
| link | ICE | navigate → /skills/ice | PASS |
| link | Kano Model | navigate → /skills/kano | PASS |

### `/skills/accessibility`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | GharGyaan · Independent build | navigate → /projects/ghargyaan | PASS |
| link | CareConnect · Independent build | navigate → /projects/careconnect | PASS |
| link | Information architecture | navigate → /skills/information-architecture | PASS |
| link | UX research | navigate → /skills/ux-research | PASS |
| link | Interaction design | navigate → /skills/interaction-design | PASS |
| link | Usability testing | navigate → /skills/usability-testing | PASS |
| link | Low-fidelity prototypes | navigate → /skills/lofi | PASS |
| link | High-fidelity prototypes | navigate → /skills/hifi | PASS |
| link | Design systems | navigate → /skills/design-systems | PASS |
| link | Responsive design | navigate → /skills/responsive | PASS |

### `/skills/activation`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | Aaroh · Independent · founder | navigate → /projects/aaroh | PASS |
| link | Information architecture | navigate → /skills/information-architecture | PASS |
| link | UX research | navigate → /skills/ux-research | PASS |
| link | Interaction design | navigate → /skills/interaction-design | PASS |
| link | Usability testing | navigate → /skills/usability-testing | PASS |
| link | Low-fidelity prototypes | navigate → /skills/lofi | PASS |
| link | High-fidelity prototypes | navigate → /skills/hifi | PASS |
| link | Design systems | navigate → /skills/design-systems | PASS |
| link | Accessibility | navigate → /skills/accessibility | PASS |

### `/skills/agentic`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | AI product strategy | navigate → /skills/ai-product-strategy | PASS |
| link | AI use-case discovery | navigate → /skills/ai-use-cases | PASS |
| link | AI feasibility | navigate → /skills/ai-feasibility | PASS |
| link | AI product requirements | navigate → /skills/ai-requirements | PASS |
| link | LLM product design | navigate → /skills/llm-design | PASS |
| link | Prompt engineering | navigate → /skills/prompt-engineering | PASS |
| link | RAG concepts | navigate → /skills/rag | PASS |
| link | Context engineering | navigate → /skills/context-engineering | PASS |

### `/skills/agile`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | Associate Product Manager — Adhyatm Sadhna Kendra · Employment | navigate → /experience/apm-adhyatm-sadhna-kendra | PASS |
| link | Product roadmap | navigate → /skills/roadmap-planning | PASS |
| link | Quarterly planning | navigate → /skills/quarterly-planning | PASS |
| link | MVP definition | navigate → /skills/mvp | PASS |
| link | Feature prioritization | navigate → /skills/feature-prioritization | PASS |
| link | RICE | navigate → /skills/rice | PASS |
| link | MoSCoW | navigate → /skills/moscow | PASS |
| link | ICE | navigate → /skills/ice | PASS |
| link | Kano Model | navigate → /skills/kano | PASS |

### `/skills/ai-feasibility`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | PhonePe Smart Spend Coach · Academic case study · Masai School × IIT Roorkee | navigate → /projects/phonepe-smart-spend-coach | PASS |
| link | AI product strategy | navigate → /skills/ai-product-strategy | PASS |
| link | AI use-case discovery | navigate → /skills/ai-use-cases | PASS |
| link | AI product requirements | navigate → /skills/ai-requirements | PASS |
| link | LLM product design | navigate → /skills/llm-design | PASS |
| link | Prompt engineering | navigate → /skills/prompt-engineering | PASS |
| link | RAG concepts | navigate → /skills/rag | PASS |
| link | Context engineering | navigate → /skills/context-engineering | PASS |
| link | Agentic workflows | navigate → /skills/agentic | PASS |

### `/skills/ai-observability`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | AI product strategy | navigate → /skills/ai-product-strategy | PASS |
| link | AI use-case discovery | navigate → /skills/ai-use-cases | PASS |
| link | AI feasibility | navigate → /skills/ai-feasibility | PASS |
| link | AI product requirements | navigate → /skills/ai-requirements | PASS |
| link | LLM product design | navigate → /skills/llm-design | PASS |
| link | Prompt engineering | navigate → /skills/prompt-engineering | PASS |
| link | RAG concepts | navigate → /skills/rag | PASS |
| link | Context engineering | navigate → /skills/context-engineering | PASS |

### `/skills/ai-product-strategy`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | Aaroh · Independent · founder | navigate → /projects/aaroh | PASS |
| link | Nexus · Independent build | navigate → /projects/nexus | PASS |
| link | Aaroh | navigate → /projects/aaroh | PASS |
| link | Nexus | navigate → /projects/nexus | PASS |
| link | AI use-case discovery | navigate → /skills/ai-use-cases | PASS |
| link | AI feasibility | navigate → /skills/ai-feasibility | PASS |
| link | AI product requirements | navigate → /skills/ai-requirements | PASS |
| link | LLM product design | navigate → /skills/llm-design | PASS |
| link | Prompt engineering | navigate → /skills/prompt-engineering | PASS |
| link | RAG concepts | navigate → /skills/rag | PASS |
| link | Context engineering | navigate → /skills/context-engineering | PASS |
| link | Agentic workflows | navigate → /skills/agentic | PASS |

### `/skills/ai-requirements`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | Aaroh · Independent · founder | navigate → /projects/aaroh | PASS |
| link | AI product strategy | navigate → /skills/ai-product-strategy | PASS |
| link | AI use-case discovery | navigate → /skills/ai-use-cases | PASS |
| link | AI feasibility | navigate → /skills/ai-feasibility | PASS |
| link | LLM product design | navigate → /skills/llm-design | PASS |
| link | Prompt engineering | navigate → /skills/prompt-engineering | PASS |
| link | RAG concepts | navigate → /skills/rag | PASS |
| link | Context engineering | navigate → /skills/context-engineering | PASS |
| link | Agentic workflows | navigate → /skills/agentic | PASS |

### `/skills/ai-safety`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | GharGyaan · Independent build | navigate → /projects/ghargyaan | PASS |
| link | Aaroh · Independent · founder | navigate → /projects/aaroh | PASS |
| link | AI product strategy | navigate → /skills/ai-product-strategy | PASS |
| link | AI use-case discovery | navigate → /skills/ai-use-cases | PASS |
| link | AI feasibility | navigate → /skills/ai-feasibility | PASS |
| link | AI product requirements | navigate → /skills/ai-requirements | PASS |
| link | LLM product design | navigate → /skills/llm-design | PASS |
| link | Prompt engineering | navigate → /skills/prompt-engineering | PASS |
| link | RAG concepts | navigate → /skills/rag | PASS |
| link | Context engineering | navigate → /skills/context-engineering | PASS |

### `/skills/ai-use-cases`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | Aaroh · Independent · founder | navigate → /projects/aaroh | PASS |
| link | AI product strategy | navigate → /skills/ai-product-strategy | PASS |
| link | AI feasibility | navigate → /skills/ai-feasibility | PASS |
| link | AI product requirements | navigate → /skills/ai-requirements | PASS |
| link | LLM product design | navigate → /skills/llm-design | PASS |
| link | Prompt engineering | navigate → /skills/prompt-engineering | PASS |
| link | RAG concepts | navigate → /skills/rag | PASS |
| link | Context engineering | navigate → /skills/context-engineering | PASS |
| link | Agentic workflows | navigate → /skills/agentic | PASS |

### `/skills/ai-ux`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | GharGyaan · Independent build | navigate → /projects/ghargyaan | PASS |
| link | AI product strategy | navigate → /skills/ai-product-strategy | PASS |
| link | AI use-case discovery | navigate → /skills/ai-use-cases | PASS |
| link | AI feasibility | navigate → /skills/ai-feasibility | PASS |
| link | AI product requirements | navigate → /skills/ai-requirements | PASS |
| link | LLM product design | navigate → /skills/llm-design | PASS |
| link | Prompt engineering | navigate → /skills/prompt-engineering | PASS |
| link | RAG concepts | navigate → /skills/rag | PASS |
| link | Context engineering | navigate → /skills/context-engineering | PASS |

### `/skills/assumption-mapping`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | 90-day case studies — 79 of 90 studies · Case-study corpus | navigate → /research | PASS |
| link | CareConnect · Independent build | navigate → /projects/careconnect | PASS |
| link | Problem discovery | navigate → /skills/problem-discovery | PASS |
| link | Problem framing | navigate → /skills/problem-framing | PASS |
| link | Opportunity identification | navigate → /skills/opportunity-identification | PASS |
| link | User research | navigate → /skills/user-research | PASS |
| link | Customer interviews | navigate → /skills/discovery-interviews | PASS |
| link | Stakeholder interviews | navigate → /skills/stakeholder-interviews | PASS |
| link | Jobs to Be Done | navigate → /skills/jtbd | PASS |
| link | Jobs-to-be-Done interviews | navigate → /skills/jtbd-interviews | PASS |

### `/skills/backlog`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | Associate Product Manager — Adhyatm Sadhna Kendra · Employment | navigate → /experience/apm-adhyatm-sadhna-kendra | PASS |
| link | Product Management Intern — Adhyatm Sadhna Kendra · Employment | navigate → /experience/pm-intern-adhyatm-sadhna-kendra | PASS |
| link | Product roadmap | navigate → /skills/roadmap-planning | PASS |
| link | Quarterly planning | navigate → /skills/quarterly-planning | PASS |
| link | MVP definition | navigate → /skills/mvp | PASS |
| link | Feature prioritization | navigate → /skills/feature-prioritization | PASS |
| link | RICE | navigate → /skills/rice | PASS |
| link | MoSCoW | navigate → /skills/moscow | PASS |
| link | ICE | navigate → /skills/ice | PASS |
| link | Kano Model | navigate → /skills/kano | PASS |

### `/skills/build-vs-buy`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | CareConnect · Independent build | navigate → /projects/careconnect | PASS |
| link | Product vision | navigate → /skills/product-vision | PASS |
| link | Product mission | navigate → /skills/product-mission | PASS |
| link | Product positioning | navigate → /skills/positioning | PASS |
| link | Product strategy | navigate → /skills/product-strategy | PASS |
| link | Product-market fit | navigate → /skills/pmf | PASS |
| link | Market segmentation | navigate → /skills/market-segmentation | PASS |
| link | TAM, SAM and SOM | navigate → /skills/tam-sam-som | PASS |
| link | Competitive differentiation | navigate → /skills/differentiation | PASS |

### `/skills/business-model`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | 90-day case studies — 90 of 90 studies · Case-study corpus | navigate → /research | PASS |
| link | Product vision | navigate → /skills/product-vision | PASS |
| link | Product mission | navigate → /skills/product-mission | PASS |
| link | Product positioning | navigate → /skills/positioning | PASS |
| link | Product strategy | navigate → /skills/product-strategy | PASS |
| link | Product-market fit | navigate → /skills/pmf | PASS |
| link | Market segmentation | navigate → /skills/market-segmentation | PASS |
| link | TAM, SAM and SOM | navigate → /skills/tam-sam-som | PASS |
| link | Competitive differentiation | navigate → /skills/differentiation | PASS |

### `/skills/cac`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | North Star Metric | navigate → /skills/north-star | PASS |
| link | KPIs | navigate → /skills/kpis | PASS |
| link | Input and output metrics | navigate → /skills/input-output-metrics | PASS |
| link | Engagement | navigate → /skills/engagement | PASS |
| link | Churn | navigate → /skills/churn | PASS |
| link | Conversion | navigate → /skills/conversion | PASS |
| link | Funnel analysis | navigate → /skills/funnel-analysis | PASS |
| link | Cohort analysis | navigate → /skills/cohort-analysis | PASS |

### `/skills/care-continuity`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | CareConnect · Independent build | navigate → /projects/careconnect | PASS |
| link | Patient journey | navigate → /skills/patient-journey | PASS |
| link | Caregiver journey | navigate → /skills/caregiver-journey | PASS |
| link | Provider workflow | navigate → /skills/provider-workflow | PASS |
| link | Digital health discovery | navigate → /skills/digital-health-discovery | PASS |
| link | Healthcare onboarding | navigate → /skills/health-onboarding | PASS |
| link | Patient engagement | navigate → /skills/patient-engagement | PASS |
| link | Post-discharge care | navigate → /skills/post-discharge | PASS |
| link | Health information architecture | navigate → /skills/health-ia | PASS |

### `/skills/caregiver-journey`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | CareConnect · Independent build | navigate → /projects/careconnect | PASS |
| link | CareConnect | navigate → /projects/careconnect | PASS |
| link | Patient journey | navigate → /skills/patient-journey | PASS |
| link | Provider workflow | navigate → /skills/provider-workflow | PASS |
| link | Digital health discovery | navigate → /skills/digital-health-discovery | PASS |
| link | Healthcare onboarding | navigate → /skills/health-onboarding | PASS |
| link | Patient engagement | navigate → /skills/patient-engagement | PASS |
| link | Post-discharge care | navigate → /skills/post-discharge | PASS |
| link | Care continuity | navigate → /skills/care-continuity | PASS |
| link | Health information architecture | navigate → /skills/health-ia | PASS |

### `/skills/change-management`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | Product roadmap | navigate → /skills/roadmap-planning | PASS |
| link | Quarterly planning | navigate → /skills/quarterly-planning | PASS |
| link | MVP definition | navigate → /skills/mvp | PASS |
| link | Feature prioritization | navigate → /skills/feature-prioritization | PASS |
| link | RICE | navigate → /skills/rice | PASS |
| link | MoSCoW | navigate → /skills/moscow | PASS |
| link | ICE | navigate → /skills/ice | PASS |
| link | Kano Model | navigate → /skills/kano | PASS |

### `/skills/churn`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | North Star Metric | navigate → /skills/north-star | PASS |
| link | KPIs | navigate → /skills/kpis | PASS |
| link | Input and output metrics | navigate → /skills/input-output-metrics | PASS |
| link | Engagement | navigate → /skills/engagement | PASS |
| link | Conversion | navigate → /skills/conversion | PASS |
| link | Funnel analysis | navigate → /skills/funnel-analysis | PASS |
| link | Cohort analysis | navigate → /skills/cohort-analysis | PASS |
| link | Segmentation analysis | navigate → /skills/segmentation-analytics | PASS |

### `/skills/claim-register`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | CareConnect · Independent build | navigate → /projects/careconnect | PASS |
| link | CareConnect | navigate → /projects/careconnect | PASS |
| link | Stakeholder management | navigate → /skills/stakeholder-management | PASS |
| link | Cross-functional communication | navigate → /skills/cross-functional-comms | PASS |
| link | Product documentation | navigate → /skills/documentation | PASS |
| link | Decision logs | navigate → /skills/decision-log | PASS |
| link | Risk registers | navigate → /skills/risk-register | PASS |
| link | Sprint reporting | navigate → /skills/sprint-reporting | PASS |
| link | Release coordination | navigate → /skills/release-coordination | PASS |
| link | Process improvement | navigate → /skills/process-improvement | PASS |

### `/skills/claude-api`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | Aaroh · Independent · founder | navigate → /projects/aaroh | PASS |
| link | React and TypeScript | navigate → /skills/react-typescript | PASS |
| link | SQLite | navigate → /skills/sqlite | PASS |
| link | Automated testing | navigate → /skills/testing-automation | PASS |
| link | GitHub | navigate → /skills/github | PASS |

### `/skills/clinical-safety`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | Aaroh · Independent · founder | navigate → /projects/aaroh | PASS |
| link | Patient journey | navigate → /skills/patient-journey | PASS |
| link | Caregiver journey | navigate → /skills/caregiver-journey | PASS |
| link | Provider workflow | navigate → /skills/provider-workflow | PASS |
| link | Digital health discovery | navigate → /skills/digital-health-discovery | PASS |
| link | Healthcare onboarding | navigate → /skills/health-onboarding | PASS |
| link | Patient engagement | navigate → /skills/patient-engagement | PASS |
| link | Post-discharge care | navigate → /skills/post-discharge | PASS |
| link | Care continuity | navigate → /skills/care-continuity | PASS |

### `/skills/cohort-analysis`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | Associate Product Manager — Adhyatm Sadhna Kendra · Employment | navigate → /experience/apm-adhyatm-sadhna-kendra | PASS |
| link | Evamastu | navigate → /projects/evamastu | PASS |
| link | North Star Metric | navigate → /skills/north-star | PASS |
| link | KPIs | navigate → /skills/kpis | PASS |
| link | Input and output metrics | navigate → /skills/input-output-metrics | PASS |
| link | Engagement | navigate → /skills/engagement | PASS |
| link | Churn | navigate → /skills/churn | PASS |
| link | Conversion | navigate → /skills/conversion | PASS |
| link | Funnel analysis | navigate → /skills/funnel-analysis | PASS |
| link | Segmentation analysis | navigate → /skills/segmentation-analytics | PASS |

### `/skills/competitive-research`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | Research Expert — Live Your Best Life (USA) · Employment | navigate → /experience/research-expert-lybl | PASS |
| link | Nexus · Independent build | navigate → /projects/nexus | PASS |
| link | Nexus | navigate → /projects/nexus | PASS |
| link | 90-Day Product Case Studies | navigate → /projects/90-day-case-studies | PASS |
| link | Problem discovery | navigate → /skills/problem-discovery | PASS |
| link | Problem framing | navigate → /skills/problem-framing | PASS |
| link | Opportunity identification | navigate → /skills/opportunity-identification | PASS |
| link | User research | navigate → /skills/user-research | PASS |
| link | Customer interviews | navigate → /skills/discovery-interviews | PASS |
| link | Stakeholder interviews | navigate → /skills/stakeholder-interviews | PASS |
| link | Jobs to Be Done | navigate → /skills/jtbd | PASS |
| link | Jobs-to-be-Done interviews | navigate → /skills/jtbd-interviews | PASS |

### `/skills/consent-onboarding`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | Aaroh · Independent · founder | navigate → /projects/aaroh | PASS |
| link | Aaroh | navigate → /projects/aaroh | PASS |
| link | Patient journey | navigate → /skills/patient-journey | PASS |
| link | Caregiver journey | navigate → /skills/caregiver-journey | PASS |
| link | Provider workflow | navigate → /skills/provider-workflow | PASS |
| link | Digital health discovery | navigate → /skills/digital-health-discovery | PASS |
| link | Healthcare onboarding | navigate → /skills/health-onboarding | PASS |
| link | Patient engagement | navigate → /skills/patient-engagement | PASS |
| link | Post-discharge care | navigate → /skills/post-discharge | PASS |
| link | Care continuity | navigate → /skills/care-continuity | PASS |

### `/skills/context-engineering`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | Nexus · Independent build | navigate → /projects/nexus | PASS |
| link | AI product strategy | navigate → /skills/ai-product-strategy | PASS |
| link | AI use-case discovery | navigate → /skills/ai-use-cases | PASS |
| link | AI feasibility | navigate → /skills/ai-feasibility | PASS |
| link | AI product requirements | navigate → /skills/ai-requirements | PASS |
| link | LLM product design | navigate → /skills/llm-design | PASS |
| link | Prompt engineering | navigate → /skills/prompt-engineering | PASS |
| link | RAG concepts | navigate → /skills/rag | PASS |
| link | Agentic workflows | navigate → /skills/agentic | PASS |

### `/skills/control-treatment`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | PhonePe Smart Spend Coach · Academic case study · Masai School × IIT Roorkee | navigate → /projects/phonepe-smart-spend-coach | PASS |
| link | Hypothesis development | navigate → /skills/hypothesis-development | PASS |
| link | A/B testing | navigate → /skills/ab-testing | PASS |
| link | Experiment design | navigate → /skills/experiment-design | PASS |
| link | Primary metrics | navigate → /skills/primary-metrics | PASS |
| link | Guardrail metrics | navigate → /skills/guardrail-metrics | PASS |
| link | Statistical significance | navigate → /skills/stat-sig | PASS |
| link | Sample size | navigate → /skills/sample-size | PASS |
| link | Experiment duration | navigate → /skills/experiment-duration | PASS |

### `/skills/conversion`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | PhonePe Smart Spend Coach · Academic case study · Masai School × IIT Roorkee | navigate → /projects/phonepe-smart-spend-coach | PASS |
| link | North Star Metric | navigate → /skills/north-star | PASS |
| link | KPIs | navigate → /skills/kpis | PASS |
| link | Input and output metrics | navigate → /skills/input-output-metrics | PASS |
| link | Engagement | navigate → /skills/engagement | PASS |
| link | Churn | navigate → /skills/churn | PASS |
| link | Funnel analysis | navigate → /skills/funnel-analysis | PASS |
| link | Cohort analysis | navigate → /skills/cohort-analysis | PASS |
| link | Segmentation analysis | navigate → /skills/segmentation-analytics | PASS |

### `/skills/cost-latency`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | AI product strategy | navigate → /skills/ai-product-strategy | PASS |
| link | AI use-case discovery | navigate → /skills/ai-use-cases | PASS |
| link | AI feasibility | navigate → /skills/ai-feasibility | PASS |
| link | AI product requirements | navigate → /skills/ai-requirements | PASS |
| link | LLM product design | navigate → /skills/llm-design | PASS |
| link | Prompt engineering | navigate → /skills/prompt-engineering | PASS |
| link | RAG concepts | navigate → /skills/rag | PASS |
| link | Context engineering | navigate → /skills/context-engineering | PASS |

### `/skills/cost-of-delay`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | Product roadmap | navigate → /skills/roadmap-planning | PASS |
| link | Quarterly planning | navigate → /skills/quarterly-planning | PASS |
| link | MVP definition | navigate → /skills/mvp | PASS |
| link | Feature prioritization | navigate → /skills/feature-prioritization | PASS |
| link | RICE | navigate → /skills/rice | PASS |
| link | MoSCoW | navigate → /skills/moscow | PASS |
| link | ICE | navigate → /skills/ice | PASS |
| link | Kano Model | navigate → /skills/kano | PASS |

### `/skills/crisis-routing`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | GharGyaan · Independent build | navigate → /projects/ghargyaan | PASS |
| link | GharGyaan | navigate → /projects/ghargyaan | PASS |
| link | Patient journey | navigate → /skills/patient-journey | PASS |
| link | Caregiver journey | navigate → /skills/caregiver-journey | PASS |
| link | Provider workflow | navigate → /skills/provider-workflow | PASS |
| link | Digital health discovery | navigate → /skills/digital-health-discovery | PASS |
| link | Healthcare onboarding | navigate → /skills/health-onboarding | PASS |
| link | Patient engagement | navigate → /skills/patient-engagement | PASS |
| link | Post-discharge care | navigate → /skills/post-discharge | PASS |
| link | Care continuity | navigate → /skills/care-continuity | PASS |

### `/skills/cro`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | PhonePe Smart Spend Coach · Academic case study · Masai School × IIT Roorkee | navigate → /projects/phonepe-smart-spend-coach | PASS |
| link | Hypothesis development | navigate → /skills/hypothesis-development | PASS |
| link | A/B testing | navigate → /skills/ab-testing | PASS |
| link | Experiment design | navigate → /skills/experiment-design | PASS |
| link | Control and treatment groups | navigate → /skills/control-treatment | PASS |
| link | Primary metrics | navigate → /skills/primary-metrics | PASS |
| link | Guardrail metrics | navigate → /skills/guardrail-metrics | PASS |
| link | Statistical significance | navigate → /skills/stat-sig | PASS |
| link | Sample size | navigate → /skills/sample-size | PASS |

### `/skills/cross-functional`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | Associate Product Manager — Adhyatm Sadhna Kendra · Employment | navigate → /experience/apm-adhyatm-sadhna-kendra | PASS |
| link | Product roadmap | navigate → /skills/roadmap-planning | PASS |
| link | Quarterly planning | navigate → /skills/quarterly-planning | PASS |
| link | MVP definition | navigate → /skills/mvp | PASS |
| link | Feature prioritization | navigate → /skills/feature-prioritization | PASS |
| link | RICE | navigate → /skills/rice | PASS |
| link | MoSCoW | navigate → /skills/moscow | PASS |
| link | ICE | navigate → /skills/ice | PASS |
| link | Kano Model | navigate → /skills/kano | PASS |

### `/skills/cross-functional-comms`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | Research Expert — Live Your Best Life (USA) · Employment | navigate → /experience/research-expert-lybl | PASS |
| link | Stakeholder management | navigate → /skills/stakeholder-management | PASS |
| link | Product documentation | navigate → /skills/documentation | PASS |
| link | Decision logs | navigate → /skills/decision-log | PASS |
| link | Claim registers | navigate → /skills/claim-register | PASS |
| link | Risk registers | navigate → /skills/risk-register | PASS |
| link | Sprint reporting | navigate → /skills/sprint-reporting | PASS |
| link | Release coordination | navigate → /skills/release-coordination | PASS |
| link | Process improvement | navigate → /skills/process-improvement | PASS |

### `/skills/customer-journey`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | 90-day case studies — 90 of 90 studies · Case-study corpus | navigate → /research | PASS |
| link | Information architecture | navigate → /skills/information-architecture | PASS |
| link | UX research | navigate → /skills/ux-research | PASS |
| link | Interaction design | navigate → /skills/interaction-design | PASS |
| link | Usability testing | navigate → /skills/usability-testing | PASS |
| link | Low-fidelity prototypes | navigate → /skills/lofi | PASS |
| link | High-fidelity prototypes | navigate → /skills/hifi | PASS |
| link | Design systems | navigate → /skills/design-systems | PASS |
| link | Accessibility | navigate → /skills/accessibility | PASS |

### `/skills/dashboards`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | Associate Product Manager — Adhyatm Sadhna Kendra · Employment | navigate → /experience/apm-adhyatm-sadhna-kendra | PASS |
| link | North Star Metric | navigate → /skills/north-star | PASS |
| link | KPIs | navigate → /skills/kpis | PASS |
| link | Input and output metrics | navigate → /skills/input-output-metrics | PASS |
| link | Engagement | navigate → /skills/engagement | PASS |
| link | Churn | navigate → /skills/churn | PASS |
| link | Conversion | navigate → /skills/conversion | PASS |
| link | Funnel analysis | navigate → /skills/funnel-analysis | PASS |
| link | Cohort analysis | navigate → /skills/cohort-analysis | PASS |

### `/skills/data-driven`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | Associate Product Manager — Adhyatm Sadhna Kendra · Employment | navigate → /experience/apm-adhyatm-sadhna-kendra | PASS |
| link | Research Expert — Live Your Best Life (USA) · Employment | navigate → /experience/research-expert-lybl | PASS |
| link | North Star Metric | navigate → /skills/north-star | PASS |
| link | KPIs | navigate → /skills/kpis | PASS |
| link | Input and output metrics | navigate → /skills/input-output-metrics | PASS |
| link | Engagement | navigate → /skills/engagement | PASS |
| link | Churn | navigate → /skills/churn | PASS |
| link | Conversion | navigate → /skills/conversion | PASS |
| link | Funnel analysis | navigate → /skills/funnel-analysis | PASS |
| link | Cohort analysis | navigate → /skills/cohort-analysis | PASS |

### `/skills/dau-wau-mau`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | North Star Metric | navigate → /skills/north-star | PASS |
| link | KPIs | navigate → /skills/kpis | PASS |
| link | Input and output metrics | navigate → /skills/input-output-metrics | PASS |
| link | Engagement | navigate → /skills/engagement | PASS |
| link | Churn | navigate → /skills/churn | PASS |
| link | Conversion | navigate → /skills/conversion | PASS |
| link | Funnel analysis | navigate → /skills/funnel-analysis | PASS |
| link | Cohort analysis | navigate → /skills/cohort-analysis | PASS |

### `/skills/decision-log`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | CareConnect · Independent build | navigate → /projects/careconnect | PASS |
| link | Aaroh · Independent · founder | navigate → /projects/aaroh | PASS |
| link | CareConnect | navigate → /projects/careconnect | PASS |
| link | Stakeholder management | navigate → /skills/stakeholder-management | PASS |
| link | Cross-functional communication | navigate → /skills/cross-functional-comms | PASS |
| link | Product documentation | navigate → /skills/documentation | PASS |
| link | Claim registers | navigate → /skills/claim-register | PASS |
| link | Risk registers | navigate → /skills/risk-register | PASS |
| link | Sprint reporting | navigate → /skills/sprint-reporting | PASS |
| link | Release coordination | navigate → /skills/release-coordination | PASS |
| link | Process improvement | navigate → /skills/process-improvement | PASS |

### `/skills/dependency-mapping`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | Aaroh · Independent · founder | navigate → /projects/aaroh | PASS |
| link | Product roadmap | navigate → /skills/roadmap-planning | PASS |
| link | Quarterly planning | navigate → /skills/quarterly-planning | PASS |
| link | MVP definition | navigate → /skills/mvp | PASS |
| link | Feature prioritization | navigate → /skills/feature-prioritization | PASS |
| link | RICE | navigate → /skills/rice | PASS |
| link | MoSCoW | navigate → /skills/moscow | PASS |
| link | ICE | navigate → /skills/ice | PASS |
| link | Kano Model | navigate → /skills/kano | PASS |

### `/skills/design-systems`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | Information architecture | navigate → /skills/information-architecture | PASS |
| link | UX research | navigate → /skills/ux-research | PASS |
| link | Interaction design | navigate → /skills/interaction-design | PASS |
| link | Usability testing | navigate → /skills/usability-testing | PASS |
| link | Low-fidelity prototypes | navigate → /skills/lofi | PASS |
| link | High-fidelity prototypes | navigate → /skills/hifi | PASS |
| link | Accessibility | navigate → /skills/accessibility | PASS |
| link | Responsive design | navigate → /skills/responsive | PASS |

### `/skills/differentiation`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | GharGyaan · Independent build | navigate → /projects/ghargyaan | PASS |
| link | Nexus · Independent build | navigate → /projects/nexus | PASS |
| link | Product vision | navigate → /skills/product-vision | PASS |
| link | Product mission | navigate → /skills/product-mission | PASS |
| link | Product positioning | navigate → /skills/positioning | PASS |
| link | Product strategy | navigate → /skills/product-strategy | PASS |
| link | Product-market fit | navigate → /skills/pmf | PASS |
| link | Market segmentation | navigate → /skills/market-segmentation | PASS |
| link | TAM, SAM and SOM | navigate → /skills/tam-sam-som | PASS |
| link | Value proposition | navigate → /skills/value-proposition | PASS |

### `/skills/digital-health-discovery`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | Aaroh · Independent · founder | navigate → /projects/aaroh | PASS |
| link | 90-day case studies — 24 of 90 studies · Case-study corpus | navigate → /research | PASS |
| link | Patient journey | navigate → /skills/patient-journey | PASS |
| link | Caregiver journey | navigate → /skills/caregiver-journey | PASS |
| link | Provider workflow | navigate → /skills/provider-workflow | PASS |
| link | Healthcare onboarding | navigate → /skills/health-onboarding | PASS |
| link | Patient engagement | navigate → /skills/patient-engagement | PASS |
| link | Post-discharge care | navigate → /skills/post-discharge | PASS |
| link | Care continuity | navigate → /skills/care-continuity | PASS |
| link | Health information architecture | navigate → /skills/health-ia | PASS |

### `/skills/discovery-interviews`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | Aaroh · Independent · founder | navigate → /projects/aaroh | PASS |
| link | Research Expert — Live Your Best Life (USA) · Employment | navigate → /experience/research-expert-lybl | PASS |
| link | Aaroh | navigate → /projects/aaroh | PASS |
| link | Problem discovery | navigate → /skills/problem-discovery | PASS |
| link | Problem framing | navigate → /skills/problem-framing | PASS |
| link | Opportunity identification | navigate → /skills/opportunity-identification | PASS |
| link | User research | navigate → /skills/user-research | PASS |
| link | Stakeholder interviews | navigate → /skills/stakeholder-interviews | PASS |
| link | Jobs to Be Done | navigate → /skills/jtbd | PASS |
| link | Jobs-to-be-Done interviews | navigate → /skills/jtbd-interviews | PASS |
| link | User personas | navigate → /skills/personas | PASS |

### `/skills/documentation`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | GharGyaan · Independent build | navigate → /projects/ghargyaan | PASS |
| link | CareConnect · Independent build | navigate → /projects/careconnect | PASS |
| link | Stakeholder management | navigate → /skills/stakeholder-management | PASS |
| link | Cross-functional communication | navigate → /skills/cross-functional-comms | PASS |
| link | Decision logs | navigate → /skills/decision-log | PASS |
| link | Claim registers | navigate → /skills/claim-register | PASS |
| link | Risk registers | navigate → /skills/risk-register | PASS |
| link | Sprint reporting | navigate → /skills/sprint-reporting | PASS |
| link | Release coordination | navigate → /skills/release-coordination | PASS |
| link | Process improvement | navigate → /skills/process-improvement | PASS |

### `/skills/empathy-mapping`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | Problem discovery | navigate → /skills/problem-discovery | PASS |
| link | Problem framing | navigate → /skills/problem-framing | PASS |
| link | Opportunity identification | navigate → /skills/opportunity-identification | PASS |
| link | User research | navigate → /skills/user-research | PASS |
| link | Customer interviews | navigate → /skills/discovery-interviews | PASS |
| link | Stakeholder interviews | navigate → /skills/stakeholder-interviews | PASS |
| link | Jobs to Be Done | navigate → /skills/jtbd | PASS |
| link | Jobs-to-be-Done interviews | navigate → /skills/jtbd-interviews | PASS |

### `/skills/eng-handoff`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | Associate Product Manager — Adhyatm Sadhna Kendra · Employment | navigate → /experience/apm-adhyatm-sadhna-kendra | PASS |
| link | Product roadmap | navigate → /skills/roadmap-planning | PASS |
| link | Quarterly planning | navigate → /skills/quarterly-planning | PASS |
| link | MVP definition | navigate → /skills/mvp | PASS |
| link | Feature prioritization | navigate → /skills/feature-prioritization | PASS |
| link | RICE | navigate → /skills/rice | PASS |
| link | MoSCoW | navigate → /skills/moscow | PASS |
| link | ICE | navigate → /skills/ice | PASS |
| link | Kano Model | navigate → /skills/kano | PASS |

### `/skills/engagement`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | Research Expert — Live Your Best Life (USA) · Employment | navigate → /experience/research-expert-lybl | PASS |
| link | North Star Metric | navigate → /skills/north-star | PASS |
| link | KPIs | navigate → /skills/kpis | PASS |
| link | Input and output metrics | navigate → /skills/input-output-metrics | PASS |
| link | Churn | navigate → /skills/churn | PASS |
| link | Conversion | navigate → /skills/conversion | PASS |
| link | Funnel analysis | navigate → /skills/funnel-analysis | PASS |
| link | Cohort analysis | navigate → /skills/cohort-analysis | PASS |
| link | Segmentation analysis | navigate → /skills/segmentation-analytics | PASS |

### `/skills/evaluation-datasets`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | GharGyaan · Independent build | navigate → /projects/ghargyaan | PASS |
| link | GharGyaan | navigate → /projects/ghargyaan | PASS |
| link | AI product strategy | navigate → /skills/ai-product-strategy | PASS |
| link | AI use-case discovery | navigate → /skills/ai-use-cases | PASS |
| link | AI feasibility | navigate → /skills/ai-feasibility | PASS |
| link | AI product requirements | navigate → /skills/ai-requirements | PASS |
| link | LLM product design | navigate → /skills/llm-design | PASS |
| link | Prompt engineering | navigate → /skills/prompt-engineering | PASS |
| link | RAG concepts | navigate → /skills/rag | PASS |
| link | Context engineering | navigate → /skills/context-engineering | PASS |

### `/skills/event-tracking`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | CareConnect · Independent build | navigate → /projects/careconnect | PASS |
| link | GharGyaan · Independent build | navigate → /projects/ghargyaan | PASS |
| link | North Star Metric | navigate → /skills/north-star | PASS |
| link | KPIs | navigate → /skills/kpis | PASS |
| link | Input and output metrics | navigate → /skills/input-output-metrics | PASS |
| link | Engagement | navigate → /skills/engagement | PASS |
| link | Churn | navigate → /skills/churn | PASS |
| link | Conversion | navigate → /skills/conversion | PASS |
| link | Funnel analysis | navigate → /skills/funnel-analysis | PASS |
| link | Cohort analysis | navigate → /skills/cohort-analysis | PASS |

### `/skills/evidence-labelling`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | GharGyaan · Independent build | navigate → /projects/ghargyaan | PASS |
| link | GharGyaan | navigate → /projects/ghargyaan | PASS |
| link | Patient journey | navigate → /skills/patient-journey | PASS |
| link | Caregiver journey | navigate → /skills/caregiver-journey | PASS |
| link | Provider workflow | navigate → /skills/provider-workflow | PASS |
| link | Digital health discovery | navigate → /skills/digital-health-discovery | PASS |
| link | Healthcare onboarding | navigate → /skills/health-onboarding | PASS |
| link | Patient engagement | navigate → /skills/patient-engagement | PASS |
| link | Post-discharge care | navigate → /skills/post-discharge | PASS |
| link | Care continuity | navigate → /skills/care-continuity | PASS |

### `/skills/experiment-design`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | PhonePe Smart Spend Coach · Academic case study · Masai School × IIT Roorkee | navigate → /projects/phonepe-smart-spend-coach | PASS |
| link | 90-day case studies — 76 of 90 studies · Case-study corpus | navigate → /research | PASS |
| link | PhonePe Smart Spend Coach | navigate → /projects/phonepe-smart-spend-coach | PASS |
| link | 90-Day Product Case Studies | navigate → /projects/90-day-case-studies | PASS |
| link | Hypothesis development | navigate → /skills/hypothesis-development | PASS |
| link | A/B testing | navigate → /skills/ab-testing | PASS |
| link | Control and treatment groups | navigate → /skills/control-treatment | PASS |
| link | Primary metrics | navigate → /skills/primary-metrics | PASS |
| link | Guardrail metrics | navigate → /skills/guardrail-metrics | PASS |
| link | Statistical significance | navigate → /skills/stat-sig | PASS |
| link | Sample size | navigate → /skills/sample-size | PASS |
| link | Experiment duration | navigate → /skills/experiment-duration | PASS |

### `/skills/experiment-duration`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | PhonePe Smart Spend Coach · Academic case study · Masai School × IIT Roorkee | navigate → /projects/phonepe-smart-spend-coach | PASS |
| link | Hypothesis development | navigate → /skills/hypothesis-development | PASS |
| link | A/B testing | navigate → /skills/ab-testing | PASS |
| link | Experiment design | navigate → /skills/experiment-design | PASS |
| link | Control and treatment groups | navigate → /skills/control-treatment | PASS |
| link | Primary metrics | navigate → /skills/primary-metrics | PASS |
| link | Guardrail metrics | navigate → /skills/guardrail-metrics | PASS |
| link | Statistical significance | navigate → /skills/stat-sig | PASS |
| link | Sample size | navigate → /skills/sample-size | PASS |

### `/skills/feature-prioritization`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | Associate Product Manager — Adhyatm Sadhna Kendra · Employment | navigate → /experience/apm-adhyatm-sadhna-kendra | PASS |
| link | PhonePe Smart Spend Coach · Academic case study · Masai School × IIT Roorkee | navigate → /projects/phonepe-smart-spend-coach | PASS |
| link | Product roadmap | navigate → /skills/roadmap-planning | PASS |
| link | Quarterly planning | navigate → /skills/quarterly-planning | PASS |
| link | MVP definition | navigate → /skills/mvp | PASS |
| link | RICE | navigate → /skills/rice | PASS |
| link | MoSCoW | navigate → /skills/moscow | PASS |
| link | ICE | navigate → /skills/ice | PASS |
| link | Kano Model | navigate → /skills/kano | PASS |
| link | Impact vs effort | navigate → /skills/impact-effort | PASS |

### `/skills/functional-requirements`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | 90-day case studies — 78 of 90 studies · Case-study corpus | navigate → /research | PASS |
| link | Product roadmap | navigate → /skills/roadmap-planning | PASS |
| link | Quarterly planning | navigate → /skills/quarterly-planning | PASS |
| link | MVP definition | navigate → /skills/mvp | PASS |
| link | Feature prioritization | navigate → /skills/feature-prioritization | PASS |
| link | RICE | navigate → /skills/rice | PASS |
| link | MoSCoW | navigate → /skills/moscow | PASS |
| link | ICE | navigate → /skills/ice | PASS |
| link | Kano Model | navigate → /skills/kano | PASS |

### `/skills/funnel-analysis`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | Associate Product Manager — Adhyatm Sadhna Kendra · Employment | navigate → /experience/apm-adhyatm-sadhna-kendra | PASS |
| link | PhonePe Smart Spend Coach · Academic case study · Masai School × IIT Roorkee | navigate → /projects/phonepe-smart-spend-coach | PASS |
| link | Evamastu | navigate → /projects/evamastu | PASS |
| link | PhonePe Smart Spend Coach | navigate → /projects/phonepe-smart-spend-coach | PASS |
| link | North Star Metric | navigate → /skills/north-star | PASS |
| link | KPIs | navigate → /skills/kpis | PASS |
| link | Input and output metrics | navigate → /skills/input-output-metrics | PASS |
| link | Engagement | navigate → /skills/engagement | PASS |
| link | Churn | navigate → /skills/churn | PASS |
| link | Conversion | navigate → /skills/conversion | PASS |
| link | Cohort analysis | navigate → /skills/cohort-analysis | PASS |
| link | Segmentation analysis | navigate → /skills/segmentation-analytics | PASS |

### `/skills/funnel-optimization`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | Associate Product Manager — Adhyatm Sadhna Kendra · Employment | navigate → /experience/apm-adhyatm-sadhna-kendra | PASS |
| link | Hypothesis development | navigate → /skills/hypothesis-development | PASS |
| link | A/B testing | navigate → /skills/ab-testing | PASS |
| link | Experiment design | navigate → /skills/experiment-design | PASS |
| link | Control and treatment groups | navigate → /skills/control-treatment | PASS |
| link | Primary metrics | navigate → /skills/primary-metrics | PASS |
| link | Guardrail metrics | navigate → /skills/guardrail-metrics | PASS |
| link | Statistical significance | navigate → /skills/stat-sig | PASS |
| link | Sample size | navigate → /skills/sample-size | PASS |

### `/skills/github`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | 90-Day Product Case Studies · Independent research & writing | navigate → /projects/90-day-case-studies | PASS |
| link | React and TypeScript | navigate → /skills/react-typescript | PASS |
| link | SQLite | navigate → /skills/sqlite | PASS |
| link | Claude API and MCP | navigate → /skills/claude-api | PASS |
| link | Automated testing | navigate → /skills/testing-automation | PASS |

### `/skills/growth-loops`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | Hypothesis development | navigate → /skills/hypothesis-development | PASS |
| link | A/B testing | navigate → /skills/ab-testing | PASS |
| link | Experiment design | navigate → /skills/experiment-design | PASS |
| link | Control and treatment groups | navigate → /skills/control-treatment | PASS |
| link | Primary metrics | navigate → /skills/primary-metrics | PASS |
| link | Guardrail metrics | navigate → /skills/guardrail-metrics | PASS |
| link | Statistical significance | navigate → /skills/stat-sig | PASS |
| link | Sample size | navigate → /skills/sample-size | PASS |

### `/skills/gtm`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | CareConnect · Independent build | navigate → /projects/careconnect | PASS |
| link | Product vision | navigate → /skills/product-vision | PASS |
| link | Product mission | navigate → /skills/product-mission | PASS |
| link | Product positioning | navigate → /skills/positioning | PASS |
| link | Product strategy | navigate → /skills/product-strategy | PASS |
| link | Product-market fit | navigate → /skills/pmf | PASS |
| link | Market segmentation | navigate → /skills/market-segmentation | PASS |
| link | TAM, SAM and SOM | navigate → /skills/tam-sam-som | PASS |
| link | Competitive differentiation | navigate → /skills/differentiation | PASS |

### `/skills/guardrail-metrics`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | PhonePe Smart Spend Coach · Academic case study · Masai School × IIT Roorkee | navigate → /projects/phonepe-smart-spend-coach | PASS |
| link | CareConnect · Independent build | navigate → /projects/careconnect | PASS |
| link | CareConnect | navigate → /projects/careconnect | PASS |
| link | PhonePe Smart Spend Coach | navigate → /projects/phonepe-smart-spend-coach | PASS |
| link | Hypothesis development | navigate → /skills/hypothesis-development | PASS |
| link | A/B testing | navigate → /skills/ab-testing | PASS |
| link | Experiment design | navigate → /skills/experiment-design | PASS |
| link | Control and treatment groups | navigate → /skills/control-treatment | PASS |
| link | Primary metrics | navigate → /skills/primary-metrics | PASS |
| link | Statistical significance | navigate → /skills/stat-sig | PASS |
| link | Sample size | navigate → /skills/sample-size | PASS |
| link | Experiment duration | navigate → /skills/experiment-duration | PASS |

### `/skills/guardrails`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | GharGyaan · Independent build | navigate → /projects/ghargyaan | PASS |
| link | Aaroh · Independent · founder | navigate → /projects/aaroh | PASS |
| link | Aaroh | navigate → /projects/aaroh | PASS |
| link | GharGyaan | navigate → /projects/ghargyaan | PASS |
| link | Nexus | navigate → /projects/nexus | PASS |
| link | AI product strategy | navigate → /skills/ai-product-strategy | PASS |
| link | AI use-case discovery | navigate → /skills/ai-use-cases | PASS |
| link | AI feasibility | navigate → /skills/ai-feasibility | PASS |
| link | AI product requirements | navigate → /skills/ai-requirements | PASS |
| link | LLM product design | navigate → /skills/llm-design | PASS |
| link | Prompt engineering | navigate → /skills/prompt-engineering | PASS |
| link | RAG concepts | navigate → /skills/rag | PASS |
| link | Context engineering | navigate → /skills/context-engineering | PASS |

### `/skills/hallucination-mitigation`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | GharGyaan · Independent build | navigate → /projects/ghargyaan | PASS |
| link | Nexus · Independent build | navigate → /projects/nexus | PASS |
| link | GharGyaan | navigate → /projects/ghargyaan | PASS |
| link | Nexus | navigate → /projects/nexus | PASS |
| link | AI product strategy | navigate → /skills/ai-product-strategy | PASS |
| link | AI use-case discovery | navigate → /skills/ai-use-cases | PASS |
| link | AI feasibility | navigate → /skills/ai-feasibility | PASS |
| link | AI product requirements | navigate → /skills/ai-requirements | PASS |
| link | LLM product design | navigate → /skills/llm-design | PASS |
| link | Prompt engineering | navigate → /skills/prompt-engineering | PASS |
| link | RAG concepts | navigate → /skills/rag | PASS |
| link | Context engineering | navigate → /skills/context-engineering | PASS |

### `/skills/health-ia`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | GharGyaan · Independent build | navigate → /projects/ghargyaan | PASS |
| link | Patient journey | navigate → /skills/patient-journey | PASS |
| link | Caregiver journey | navigate → /skills/caregiver-journey | PASS |
| link | Provider workflow | navigate → /skills/provider-workflow | PASS |
| link | Digital health discovery | navigate → /skills/digital-health-discovery | PASS |
| link | Healthcare onboarding | navigate → /skills/health-onboarding | PASS |
| link | Patient engagement | navigate → /skills/patient-engagement | PASS |
| link | Post-discharge care | navigate → /skills/post-discharge | PASS |
| link | Care continuity | navigate → /skills/care-continuity | PASS |

### `/skills/health-onboarding`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | Associate Product Manager — Adhyatm Sadhna Kendra · Employment | navigate → /experience/apm-adhyatm-sadhna-kendra | PASS |
| link | Patient journey | navigate → /skills/patient-journey | PASS |
| link | Caregiver journey | navigate → /skills/caregiver-journey | PASS |
| link | Provider workflow | navigate → /skills/provider-workflow | PASS |
| link | Digital health discovery | navigate → /skills/digital-health-discovery | PASS |
| link | Patient engagement | navigate → /skills/patient-engagement | PASS |
| link | Post-discharge care | navigate → /skills/post-discharge | PASS |
| link | Care continuity | navigate → /skills/care-continuity | PASS |
| link | Health information architecture | navigate → /skills/health-ia | PASS |

### `/skills/health-privacy`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | CareConnect · Independent build | navigate → /projects/careconnect | PASS |
| link | Patient journey | navigate → /skills/patient-journey | PASS |
| link | Caregiver journey | navigate → /skills/caregiver-journey | PASS |
| link | Provider workflow | navigate → /skills/provider-workflow | PASS |
| link | Digital health discovery | navigate → /skills/digital-health-discovery | PASS |
| link | Healthcare onboarding | navigate → /skills/health-onboarding | PASS |
| link | Patient engagement | navigate → /skills/patient-engagement | PASS |
| link | Post-discharge care | navigate → /skills/post-discharge | PASS |
| link | Care continuity | navigate → /skills/care-continuity | PASS |

### `/skills/hifi`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | PhonePe Smart Spend Coach · Academic case study · Masai School × IIT Roorkee | navigate → /projects/phonepe-smart-spend-coach | PASS |
| link | Aaroh · Independent · founder | navigate → /projects/aaroh | PASS |
| link | Information architecture | navigate → /skills/information-architecture | PASS |
| link | UX research | navigate → /skills/ux-research | PASS |
| link | Interaction design | navigate → /skills/interaction-design | PASS |
| link | Usability testing | navigate → /skills/usability-testing | PASS |
| link | Low-fidelity prototypes | navigate → /skills/lofi | PASS |
| link | Design systems | navigate → /skills/design-systems | PASS |
| link | Accessibility | navigate → /skills/accessibility | PASS |
| link | Responsive design | navigate → /skills/responsive | PASS |

### `/skills/human-in-the-loop`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | Aaroh · Independent · founder | navigate → /projects/aaroh | PASS |
| link | Nexus · Independent build | navigate → /projects/nexus | PASS |
| link | GharGyaan | navigate → /projects/ghargyaan | PASS |
| link | AI product strategy | navigate → /skills/ai-product-strategy | PASS |
| link | AI use-case discovery | navigate → /skills/ai-use-cases | PASS |
| link | AI feasibility | navigate → /skills/ai-feasibility | PASS |
| link | AI product requirements | navigate → /skills/ai-requirements | PASS |
| link | LLM product design | navigate → /skills/llm-design | PASS |
| link | Prompt engineering | navigate → /skills/prompt-engineering | PASS |
| link | RAG concepts | navigate → /skills/rag | PASS |
| link | Context engineering | navigate → /skills/context-engineering | PASS |

### `/skills/hypothesis`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | CareConnect · Independent build | navigate → /projects/careconnect | PASS |
| link | GharGyaan · Independent build | navigate → /projects/ghargyaan | PASS |
| link | PhonePe Smart Spend Coach · Academic case study · Masai School × IIT Roorkee | navigate → /projects/phonepe-smart-spend-coach | PASS |
| link | CareConnect | navigate → /projects/careconnect | PASS |
| link | PhonePe Smart Spend Coach | navigate → /projects/phonepe-smart-spend-coach | PASS |
| link | Nexus | navigate → /projects/nexus | PASS |
| link | Problem discovery | navigate → /skills/problem-discovery | PASS |
| link | Problem framing | navigate → /skills/problem-framing | PASS |
| link | Opportunity identification | navigate → /skills/opportunity-identification | PASS |
| link | User research | navigate → /skills/user-research | PASS |
| link | Customer interviews | navigate → /skills/discovery-interviews | PASS |
| link | Stakeholder interviews | navigate → /skills/stakeholder-interviews | PASS |
| link | Jobs to Be Done | navigate → /skills/jtbd | PASS |
| link | Jobs-to-be-Done interviews | navigate → /skills/jtbd-interviews | PASS |

### `/skills/hypothesis-development`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | PhonePe Smart Spend Coach · Academic case study · Masai School × IIT Roorkee | navigate → /projects/phonepe-smart-spend-coach | PASS |
| link | A/B testing | navigate → /skills/ab-testing | PASS |
| link | Experiment design | navigate → /skills/experiment-design | PASS |
| link | Control and treatment groups | navigate → /skills/control-treatment | PASS |
| link | Primary metrics | navigate → /skills/primary-metrics | PASS |
| link | Guardrail metrics | navigate → /skills/guardrail-metrics | PASS |
| link | Statistical significance | navigate → /skills/stat-sig | PASS |
| link | Sample size | navigate → /skills/sample-size | PASS |
| link | Experiment duration | navigate → /skills/experiment-duration | PASS |

### `/skills/ice`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | Product roadmap | navigate → /skills/roadmap-planning | PASS |
| link | Quarterly planning | navigate → /skills/quarterly-planning | PASS |
| link | MVP definition | navigate → /skills/mvp | PASS |
| link | Feature prioritization | navigate → /skills/feature-prioritization | PASS |
| link | RICE | navigate → /skills/rice | PASS |
| link | MoSCoW | navigate → /skills/moscow | PASS |
| link | Kano Model | navigate → /skills/kano | PASS |
| link | Impact vs effort | navigate → /skills/impact-effort | PASS |

### `/skills/impact-effort`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | Product roadmap | navigate → /skills/roadmap-planning | PASS |
| link | Quarterly planning | navigate → /skills/quarterly-planning | PASS |
| link | MVP definition | navigate → /skills/mvp | PASS |
| link | Feature prioritization | navigate → /skills/feature-prioritization | PASS |
| link | RICE | navigate → /skills/rice | PASS |
| link | MoSCoW | navigate → /skills/moscow | PASS |
| link | ICE | navigate → /skills/ice | PASS |
| link | Kano Model | navigate → /skills/kano | PASS |

### `/skills/information-architecture`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | CareConnect · Independent build | navigate → /projects/careconnect | PASS |
| link | UX research | navigate → /skills/ux-research | PASS |
| link | Interaction design | navigate → /skills/interaction-design | PASS |
| link | Usability testing | navigate → /skills/usability-testing | PASS |
| link | Low-fidelity prototypes | navigate → /skills/lofi | PASS |
| link | High-fidelity prototypes | navigate → /skills/hifi | PASS |
| link | Design systems | navigate → /skills/design-systems | PASS |
| link | Accessibility | navigate → /skills/accessibility | PASS |
| link | Responsive design | navigate → /skills/responsive | PASS |

### `/skills/input-output-metrics`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | CareConnect · Independent build | navigate → /projects/careconnect | PASS |
| link | North Star Metric | navigate → /skills/north-star | PASS |
| link | KPIs | navigate → /skills/kpis | PASS |
| link | Engagement | navigate → /skills/engagement | PASS |
| link | Churn | navigate → /skills/churn | PASS |
| link | Conversion | navigate → /skills/conversion | PASS |
| link | Funnel analysis | navigate → /skills/funnel-analysis | PASS |
| link | Cohort analysis | navigate → /skills/cohort-analysis | PASS |
| link | Segmentation analysis | navigate → /skills/segmentation-analytics | PASS |

### `/skills/instrumentation`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | Aaroh · Independent · founder | navigate → /projects/aaroh | PASS |
| link | North Star Metric | navigate → /skills/north-star | PASS |
| link | KPIs | navigate → /skills/kpis | PASS |
| link | Input and output metrics | navigate → /skills/input-output-metrics | PASS |
| link | Engagement | navigate → /skills/engagement | PASS |
| link | Churn | navigate → /skills/churn | PASS |
| link | Conversion | navigate → /skills/conversion | PASS |
| link | Funnel analysis | navigate → /skills/funnel-analysis | PASS |
| link | Cohort analysis | navigate → /skills/cohort-analysis | PASS |

### `/skills/interaction-design`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | CareConnect · Independent build | navigate → /projects/careconnect | PASS |
| link | Information architecture | navigate → /skills/information-architecture | PASS |
| link | UX research | navigate → /skills/ux-research | PASS |
| link | Usability testing | navigate → /skills/usability-testing | PASS |
| link | Low-fidelity prototypes | navigate → /skills/lofi | PASS |
| link | High-fidelity prototypes | navigate → /skills/hifi | PASS |
| link | Design systems | navigate → /skills/design-systems | PASS |
| link | Accessibility | navigate → /skills/accessibility | PASS |
| link | Responsive design | navigate → /skills/responsive | PASS |

### `/skills/iteration`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | CareConnect · Independent build | navigate → /projects/careconnect | PASS |
| link | Hypothesis development | navigate → /skills/hypothesis-development | PASS |
| link | A/B testing | navigate → /skills/ab-testing | PASS |
| link | Experiment design | navigate → /skills/experiment-design | PASS |
| link | Control and treatment groups | navigate → /skills/control-treatment | PASS |
| link | Primary metrics | navigate → /skills/primary-metrics | PASS |
| link | Guardrail metrics | navigate → /skills/guardrail-metrics | PASS |
| link | Statistical significance | navigate → /skills/stat-sig | PASS |
| link | Sample size | navigate → /skills/sample-size | PASS |

### `/skills/journey-mapping`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | 90-day case studies — 90 of 90 studies · Case-study corpus | navigate → /research | PASS |
| link | CareConnect · Independent build | navigate → /projects/careconnect | PASS |
| link | Problem discovery | navigate → /skills/problem-discovery | PASS |
| link | Problem framing | navigate → /skills/problem-framing | PASS |
| link | Opportunity identification | navigate → /skills/opportunity-identification | PASS |
| link | User research | navigate → /skills/user-research | PASS |
| link | Customer interviews | navigate → /skills/discovery-interviews | PASS |
| link | Stakeholder interviews | navigate → /skills/stakeholder-interviews | PASS |
| link | Jobs to Be Done | navigate → /skills/jtbd | PASS |
| link | Jobs-to-be-Done interviews | navigate → /skills/jtbd-interviews | PASS |

### `/skills/jtbd`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | 90-day case studies — 90 of 90 studies · Case-study corpus | navigate → /research | PASS |
| link | 90-Day Product Case Studies | navigate → /projects/90-day-case-studies | PASS |
| link | Problem discovery | navigate → /skills/problem-discovery | PASS |
| link | Problem framing | navigate → /skills/problem-framing | PASS |
| link | Opportunity identification | navigate → /skills/opportunity-identification | PASS |
| link | User research | navigate → /skills/user-research | PASS |
| link | Customer interviews | navigate → /skills/discovery-interviews | PASS |
| link | Stakeholder interviews | navigate → /skills/stakeholder-interviews | PASS |
| link | Jobs-to-be-Done interviews | navigate → /skills/jtbd-interviews | PASS |
| link | User personas | navigate → /skills/personas | PASS |

### `/skills/jtbd-interviews`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | Problem discovery | navigate → /skills/problem-discovery | PASS |
| link | Problem framing | navigate → /skills/problem-framing | PASS |
| link | Opportunity identification | navigate → /skills/opportunity-identification | PASS |
| link | User research | navigate → /skills/user-research | PASS |
| link | Customer interviews | navigate → /skills/discovery-interviews | PASS |
| link | Stakeholder interviews | navigate → /skills/stakeholder-interviews | PASS |
| link | Jobs to Be Done | navigate → /skills/jtbd | PASS |
| link | User personas | navigate → /skills/personas | PASS |

### `/skills/kanban`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | Product roadmap | navigate → /skills/roadmap-planning | PASS |
| link | Quarterly planning | navigate → /skills/quarterly-planning | PASS |
| link | MVP definition | navigate → /skills/mvp | PASS |
| link | Feature prioritization | navigate → /skills/feature-prioritization | PASS |
| link | RICE | navigate → /skills/rice | PASS |
| link | MoSCoW | navigate → /skills/moscow | PASS |
| link | ICE | navigate → /skills/ice | PASS |
| link | Kano Model | navigate → /skills/kano | PASS |

### `/skills/kano`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | Product roadmap | navigate → /skills/roadmap-planning | PASS |
| link | Quarterly planning | navigate → /skills/quarterly-planning | PASS |
| link | MVP definition | navigate → /skills/mvp | PASS |
| link | Feature prioritization | navigate → /skills/feature-prioritization | PASS |
| link | RICE | navigate → /skills/rice | PASS |
| link | MoSCoW | navigate → /skills/moscow | PASS |
| link | ICE | navigate → /skills/ice | PASS |
| link | Impact vs effort | navigate → /skills/impact-effort | PASS |

### `/skills/kpis`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | Research Expert — Live Your Best Life (USA) · Employment | navigate → /experience/research-expert-lybl | PASS |
| link | North Star Metric | navigate → /skills/north-star | PASS |
| link | Input and output metrics | navigate → /skills/input-output-metrics | PASS |
| link | Engagement | navigate → /skills/engagement | PASS |
| link | Churn | navigate → /skills/churn | PASS |
| link | Conversion | navigate → /skills/conversion | PASS |
| link | Funnel analysis | navigate → /skills/funnel-analysis | PASS |
| link | Cohort analysis | navigate → /skills/cohort-analysis | PASS |
| link | Segmentation analysis | navigate → /skills/segmentation-analytics | PASS |

### `/skills/llm-design`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | GharGyaan · Independent build | navigate → /projects/ghargyaan | PASS |
| link | AI product strategy | navigate → /skills/ai-product-strategy | PASS |
| link | AI use-case discovery | navigate → /skills/ai-use-cases | PASS |
| link | AI feasibility | navigate → /skills/ai-feasibility | PASS |
| link | AI product requirements | navigate → /skills/ai-requirements | PASS |
| link | Prompt engineering | navigate → /skills/prompt-engineering | PASS |
| link | RAG concepts | navigate → /skills/rag | PASS |
| link | Context engineering | navigate → /skills/context-engineering | PASS |
| link | Agentic workflows | navigate → /skills/agentic | PASS |

### `/skills/lofi`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | Information architecture | navigate → /skills/information-architecture | PASS |
| link | UX research | navigate → /skills/ux-research | PASS |
| link | Interaction design | navigate → /skills/interaction-design | PASS |
| link | Usability testing | navigate → /skills/usability-testing | PASS |
| link | High-fidelity prototypes | navigate → /skills/hifi | PASS |
| link | Design systems | navigate → /skills/design-systems | PASS |
| link | Accessibility | navigate → /skills/accessibility | PASS |
| link | Responsive design | navigate → /skills/responsive | PASS |

### `/skills/ltv`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | North Star Metric | navigate → /skills/north-star | PASS |
| link | KPIs | navigate → /skills/kpis | PASS |
| link | Input and output metrics | navigate → /skills/input-output-metrics | PASS |
| link | Engagement | navigate → /skills/engagement | PASS |
| link | Churn | navigate → /skills/churn | PASS |
| link | Conversion | navigate → /skills/conversion | PASS |
| link | Funnel analysis | navigate → /skills/funnel-analysis | PASS |
| link | Cohort analysis | navigate → /skills/cohort-analysis | PASS |

### `/skills/ltv-cac`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | North Star Metric | navigate → /skills/north-star | PASS |
| link | KPIs | navigate → /skills/kpis | PASS |
| link | Input and output metrics | navigate → /skills/input-output-metrics | PASS |
| link | Engagement | navigate → /skills/engagement | PASS |
| link | Churn | navigate → /skills/churn | PASS |
| link | Conversion | navigate → /skills/conversion | PASS |
| link | Funnel analysis | navigate → /skills/funnel-analysis | PASS |
| link | Cohort analysis | navigate → /skills/cohort-analysis | PASS |

### `/skills/market-research`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | 90-day case studies — 79 of 90 studies · Case-study corpus | navigate → /research | PASS |
| link | 90-Day Product Case Studies | navigate → /projects/90-day-case-studies | PASS |
| link | Problem discovery | navigate → /skills/problem-discovery | PASS |
| link | Problem framing | navigate → /skills/problem-framing | PASS |
| link | Opportunity identification | navigate → /skills/opportunity-identification | PASS |
| link | User research | navigate → /skills/user-research | PASS |
| link | Customer interviews | navigate → /skills/discovery-interviews | PASS |
| link | Stakeholder interviews | navigate → /skills/stakeholder-interviews | PASS |
| link | Jobs to Be Done | navigate → /skills/jtbd | PASS |
| link | Jobs-to-be-Done interviews | navigate → /skills/jtbd-interviews | PASS |

### `/skills/market-segmentation`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | CareConnect · Independent build | navigate → /projects/careconnect | PASS |
| link | Product vision | navigate → /skills/product-vision | PASS |
| link | Product mission | navigate → /skills/product-mission | PASS |
| link | Product positioning | navigate → /skills/positioning | PASS |
| link | Product strategy | navigate → /skills/product-strategy | PASS |
| link | Product-market fit | navigate → /skills/pmf | PASS |
| link | TAM, SAM and SOM | navigate → /skills/tam-sam-som | PASS |
| link | Competitive differentiation | navigate → /skills/differentiation | PASS |
| link | Value proposition | navigate → /skills/value-proposition | PASS |

### `/skills/model-evaluation`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | GharGyaan · Independent build | navigate → /projects/ghargyaan | PASS |
| link | GharGyaan | navigate → /projects/ghargyaan | PASS |
| link | AI product strategy | navigate → /skills/ai-product-strategy | PASS |
| link | AI use-case discovery | navigate → /skills/ai-use-cases | PASS |
| link | AI feasibility | navigate → /skills/ai-feasibility | PASS |
| link | AI product requirements | navigate → /skills/ai-requirements | PASS |
| link | LLM product design | navigate → /skills/llm-design | PASS |
| link | Prompt engineering | navigate → /skills/prompt-engineering | PASS |
| link | RAG concepts | navigate → /skills/rag | PASS |
| link | Context engineering | navigate → /skills/context-engineering | PASS |

### `/skills/model-limitations`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | GharGyaan · Independent build | navigate → /projects/ghargyaan | PASS |
| link | AI product strategy | navigate → /skills/ai-product-strategy | PASS |
| link | AI use-case discovery | navigate → /skills/ai-use-cases | PASS |
| link | AI feasibility | navigate → /skills/ai-feasibility | PASS |
| link | AI product requirements | navigate → /skills/ai-requirements | PASS |
| link | LLM product design | navigate → /skills/llm-design | PASS |
| link | Prompt engineering | navigate → /skills/prompt-engineering | PASS |
| link | RAG concepts | navigate → /skills/rag | PASS |
| link | Context engineering | navigate → /skills/context-engineering | PASS |

### `/skills/monetization`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | Aaroh · Independent · founder | navigate → /projects/aaroh | PASS |
| link | Product vision | navigate → /skills/product-vision | PASS |
| link | Product mission | navigate → /skills/product-mission | PASS |
| link | Product positioning | navigate → /skills/positioning | PASS |
| link | Product strategy | navigate → /skills/product-strategy | PASS |
| link | Product-market fit | navigate → /skills/pmf | PASS |
| link | Market segmentation | navigate → /skills/market-segmentation | PASS |
| link | TAM, SAM and SOM | navigate → /skills/tam-sam-som | PASS |
| link | Competitive differentiation | navigate → /skills/differentiation | PASS |

### `/skills/moscow`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | Associate Product Manager — Adhyatm Sadhna Kendra · Employment | navigate → /experience/apm-adhyatm-sadhna-kendra | PASS |
| link | Aaroh · Independent · founder | navigate → /projects/aaroh | PASS |
| link | Evamastu | navigate → /projects/evamastu | PASS |
| link | Aaroh | navigate → /projects/aaroh | PASS |
| link | 90-Day Product Case Studies | navigate → /projects/90-day-case-studies | PASS |
| link | Product roadmap | navigate → /skills/roadmap-planning | PASS |
| link | Quarterly planning | navigate → /skills/quarterly-planning | PASS |
| link | MVP definition | navigate → /skills/mvp | PASS |
| link | Feature prioritization | navigate → /skills/feature-prioritization | PASS |
| link | RICE | navigate → /skills/rice | PASS |
| link | ICE | navigate → /skills/ice | PASS |
| link | Kano Model | navigate → /skills/kano | PASS |
| link | Impact vs effort | navigate → /skills/impact-effort | PASS |

### `/skills/mvp`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | CareConnect · Independent build | navigate → /projects/careconnect | PASS |
| link | Aaroh · Independent · founder | navigate → /projects/aaroh | PASS |
| link | Product roadmap | navigate → /skills/roadmap-planning | PASS |
| link | Quarterly planning | navigate → /skills/quarterly-planning | PASS |
| link | Feature prioritization | navigate → /skills/feature-prioritization | PASS |
| link | RICE | navigate → /skills/rice | PASS |
| link | MoSCoW | navigate → /skills/moscow | PASS |
| link | ICE | navigate → /skills/ice | PASS |
| link | Kano Model | navigate → /skills/kano | PASS |
| link | Impact vs effort | navigate → /skills/impact-effort | PASS |

### `/skills/nfr`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | CareConnect · Independent build | navigate → /projects/careconnect | PASS |
| link | GharGyaan · Independent build | navigate → /projects/ghargyaan | PASS |
| link | Product roadmap | navigate → /skills/roadmap-planning | PASS |
| link | Quarterly planning | navigate → /skills/quarterly-planning | PASS |
| link | MVP definition | navigate → /skills/mvp | PASS |
| link | Feature prioritization | navigate → /skills/feature-prioritization | PASS |
| link | RICE | navigate → /skills/rice | PASS |
| link | MoSCoW | navigate → /skills/moscow | PASS |
| link | ICE | navigate → /skills/ice | PASS |
| link | Kano Model | navigate → /skills/kano | PASS |

### `/skills/non-diagnostic-design`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | Aaroh · Independent · founder | navigate → /projects/aaroh | PASS |
| link | GharGyaan · Independent build | navigate → /projects/ghargyaan | PASS |
| link | Aaroh | navigate → /projects/aaroh | PASS |
| link | Patient journey | navigate → /skills/patient-journey | PASS |
| link | Caregiver journey | navigate → /skills/caregiver-journey | PASS |
| link | Provider workflow | navigate → /skills/provider-workflow | PASS |
| link | Digital health discovery | navigate → /skills/digital-health-discovery | PASS |
| link | Healthcare onboarding | navigate → /skills/health-onboarding | PASS |
| link | Patient engagement | navigate → /skills/patient-engagement | PASS |
| link | Post-discharge care | navigate → /skills/post-discharge | PASS |
| link | Care continuity | navigate → /skills/care-continuity | PASS |

### `/skills/north-star`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | CareConnect · Independent build | navigate → /projects/careconnect | PASS |
| link | Aaroh · Independent · founder | navigate → /projects/aaroh | PASS |
| link | 90-day case studies — 80 of 90 studies · Case-study corpus | navigate → /research | PASS |
| link | Aaroh | navigate → /projects/aaroh | PASS |
| link | CareConnect | navigate → /projects/careconnect | PASS |
| link | 90-Day Product Case Studies | navigate → /projects/90-day-case-studies | PASS |
| link | KPIs | navigate → /skills/kpis | PASS |
| link | Input and output metrics | navigate → /skills/input-output-metrics | PASS |
| link | Engagement | navigate → /skills/engagement | PASS |
| link | Churn | navigate → /skills/churn | PASS |
| link | Conversion | navigate → /skills/conversion | PASS |
| link | Funnel analysis | navigate → /skills/funnel-analysis | PASS |
| link | Cohort analysis | navigate → /skills/cohort-analysis | PASS |
| link | Segmentation analysis | navigate → /skills/segmentation-analytics | PASS |

### `/skills/onboarding`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | Associate Product Manager — Adhyatm Sadhna Kendra · Employment | navigate → /experience/apm-adhyatm-sadhna-kendra | PASS |
| link | Research Expert — Live Your Best Life (USA) · Employment | navigate → /experience/research-expert-lybl | PASS |
| link | Evamastu | navigate → /projects/evamastu | PASS |
| link | Information architecture | navigate → /skills/information-architecture | PASS |
| link | UX research | navigate → /skills/ux-research | PASS |
| link | Interaction design | navigate → /skills/interaction-design | PASS |
| link | Usability testing | navigate → /skills/usability-testing | PASS |
| link | Low-fidelity prototypes | navigate → /skills/lofi | PASS |
| link | High-fidelity prototypes | navigate → /skills/hifi | PASS |
| link | Design systems | navigate → /skills/design-systems | PASS |
| link | Accessibility | navigate → /skills/accessibility | PASS |

### `/skills/onboarding-optimization`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | Associate Product Manager — Adhyatm Sadhna Kendra · Employment | navigate → /experience/apm-adhyatm-sadhna-kendra | PASS |
| link | Hypothesis development | navigate → /skills/hypothesis-development | PASS |
| link | A/B testing | navigate → /skills/ab-testing | PASS |
| link | Experiment design | navigate → /skills/experiment-design | PASS |
| link | Control and treatment groups | navigate → /skills/control-treatment | PASS |
| link | Primary metrics | navigate → /skills/primary-metrics | PASS |
| link | Guardrail metrics | navigate → /skills/guardrail-metrics | PASS |
| link | Statistical significance | navigate → /skills/stat-sig | PASS |
| link | Sample size | navigate → /skills/sample-size | PASS |

### `/skills/opportunity-identification`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | PhonePe Smart Spend Coach · Academic case study · Masai School × IIT Roorkee | navigate → /projects/phonepe-smart-spend-coach | PASS |
| link | 90-day case studies — 82 of 90 studies · Case-study corpus | navigate → /research | PASS |
| link | Problem discovery | navigate → /skills/problem-discovery | PASS |
| link | Problem framing | navigate → /skills/problem-framing | PASS |
| link | User research | navigate → /skills/user-research | PASS |
| link | Customer interviews | navigate → /skills/discovery-interviews | PASS |
| link | Stakeholder interviews | navigate → /skills/stakeholder-interviews | PASS |
| link | Jobs to Be Done | navigate → /skills/jtbd | PASS |
| link | Jobs-to-be-Done interviews | navigate → /skills/jtbd-interviews | PASS |
| link | User personas | navigate → /skills/personas | PASS |

### `/skills/opportunity-sizing`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | 90-day case studies — 79 of 90 studies · Case-study corpus | navigate → /research | PASS |
| link | Product vision | navigate → /skills/product-vision | PASS |
| link | Product mission | navigate → /skills/product-mission | PASS |
| link | Product positioning | navigate → /skills/positioning | PASS |
| link | Product strategy | navigate → /skills/product-strategy | PASS |
| link | Product-market fit | navigate → /skills/pmf | PASS |
| link | Market segmentation | navigate → /skills/market-segmentation | PASS |
| link | TAM, SAM and SOM | navigate → /skills/tam-sam-som | PASS |
| link | Competitive differentiation | navigate → /skills/differentiation | PASS |

### `/skills/ost`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | Problem discovery | navigate → /skills/problem-discovery | PASS |
| link | Problem framing | navigate → /skills/problem-framing | PASS |
| link | Opportunity identification | navigate → /skills/opportunity-identification | PASS |
| link | User research | navigate → /skills/user-research | PASS |
| link | Customer interviews | navigate → /skills/discovery-interviews | PASS |
| link | Stakeholder interviews | navigate → /skills/stakeholder-interviews | PASS |
| link | Jobs to Be Done | navigate → /skills/jtbd | PASS |
| link | Jobs-to-be-Done interviews | navigate → /skills/jtbd-interviews | PASS |

### `/skills/pain-points`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | 90-day case studies — 90 of 90 studies · Case-study corpus | navigate → /research | PASS |
| link | Research Expert — Live Your Best Life (USA) · Employment | navigate → /experience/research-expert-lybl | PASS |
| link | Problem discovery | navigate → /skills/problem-discovery | PASS |
| link | Problem framing | navigate → /skills/problem-framing | PASS |
| link | Opportunity identification | navigate → /skills/opportunity-identification | PASS |
| link | User research | navigate → /skills/user-research | PASS |
| link | Customer interviews | navigate → /skills/discovery-interviews | PASS |
| link | Stakeholder interviews | navigate → /skills/stakeholder-interviews | PASS |
| link | Jobs to Be Done | navigate → /skills/jtbd | PASS |
| link | Jobs-to-be-Done interviews | navigate → /skills/jtbd-interviews | PASS |

### `/skills/patient-engagement`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | Associate Product Manager — Adhyatm Sadhna Kendra · Employment | navigate → /experience/apm-adhyatm-sadhna-kendra | PASS |
| link | Patient journey | navigate → /skills/patient-journey | PASS |
| link | Caregiver journey | navigate → /skills/caregiver-journey | PASS |
| link | Provider workflow | navigate → /skills/provider-workflow | PASS |
| link | Digital health discovery | navigate → /skills/digital-health-discovery | PASS |
| link | Healthcare onboarding | navigate → /skills/health-onboarding | PASS |
| link | Post-discharge care | navigate → /skills/post-discharge | PASS |
| link | Care continuity | navigate → /skills/care-continuity | PASS |
| link | Health information architecture | navigate → /skills/health-ia | PASS |

### `/skills/patient-journey`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | CareConnect · Independent build | navigate → /projects/careconnect | PASS |
| link | Caregiver journey | navigate → /skills/caregiver-journey | PASS |
| link | Provider workflow | navigate → /skills/provider-workflow | PASS |
| link | Digital health discovery | navigate → /skills/digital-health-discovery | PASS |
| link | Healthcare onboarding | navigate → /skills/health-onboarding | PASS |
| link | Patient engagement | navigate → /skills/patient-engagement | PASS |
| link | Post-discharge care | navigate → /skills/post-discharge | PASS |
| link | Care continuity | navigate → /skills/care-continuity | PASS |
| link | Health information architecture | navigate → /skills/health-ia | PASS |

### `/skills/personas`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | 90-day case studies — 90 of 90 studies · Case-study corpus | navigate → /research | PASS |
| link | PhonePe Smart Spend Coach · Academic case study · Masai School × IIT Roorkee | navigate → /projects/phonepe-smart-spend-coach | PASS |
| link | Problem discovery | navigate → /skills/problem-discovery | PASS |
| link | Problem framing | navigate → /skills/problem-framing | PASS |
| link | Opportunity identification | navigate → /skills/opportunity-identification | PASS |
| link | User research | navigate → /skills/user-research | PASS |
| link | Customer interviews | navigate → /skills/discovery-interviews | PASS |
| link | Stakeholder interviews | navigate → /skills/stakeholder-interviews | PASS |
| link | Jobs to Be Done | navigate → /skills/jtbd | PASS |
| link | Jobs-to-be-Done interviews | navigate → /skills/jtbd-interviews | PASS |

### `/skills/pivot`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | CareConnect · Independent build | navigate → /projects/careconnect | PASS |
| link | CareConnect | navigate → /projects/careconnect | PASS |
| link | Stakeholder management | navigate → /skills/stakeholder-management | PASS |
| link | Cross-functional communication | navigate → /skills/cross-functional-comms | PASS |
| link | Product documentation | navigate → /skills/documentation | PASS |
| link | Decision logs | navigate → /skills/decision-log | PASS |
| link | Claim registers | navigate → /skills/claim-register | PASS |
| link | Risk registers | navigate → /skills/risk-register | PASS |
| link | Sprint reporting | navigate → /skills/sprint-reporting | PASS |
| link | Release coordination | navigate → /skills/release-coordination | PASS |

### `/skills/pmf`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | Product vision | navigate → /skills/product-vision | PASS |
| link | Product mission | navigate → /skills/product-mission | PASS |
| link | Product positioning | navigate → /skills/positioning | PASS |
| link | Product strategy | navigate → /skills/product-strategy | PASS |
| link | Market segmentation | navigate → /skills/market-segmentation | PASS |
| link | TAM, SAM and SOM | navigate → /skills/tam-sam-som | PASS |
| link | Competitive differentiation | navigate → /skills/differentiation | PASS |
| link | Value proposition | navigate → /skills/value-proposition | PASS |

### `/skills/positioning`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | Nexus · Independent build | navigate → /projects/nexus | PASS |
| link | CareConnect · Independent build | navigate → /projects/careconnect | PASS |
| link | Product vision | navigate → /skills/product-vision | PASS |
| link | Product mission | navigate → /skills/product-mission | PASS |
| link | Product strategy | navigate → /skills/product-strategy | PASS |
| link | Product-market fit | navigate → /skills/pmf | PASS |
| link | Market segmentation | navigate → /skills/market-segmentation | PASS |
| link | TAM, SAM and SOM | navigate → /skills/tam-sam-som | PASS |
| link | Competitive differentiation | navigate → /skills/differentiation | PASS |
| link | Value proposition | navigate → /skills/value-proposition | PASS |

### `/skills/post-discharge`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | CareConnect · Independent build | navigate → /projects/careconnect | PASS |
| link | CareConnect | navigate → /projects/careconnect | PASS |
| link | Patient journey | navigate → /skills/patient-journey | PASS |
| link | Caregiver journey | navigate → /skills/caregiver-journey | PASS |
| link | Provider workflow | navigate → /skills/provider-workflow | PASS |
| link | Digital health discovery | navigate → /skills/digital-health-discovery | PASS |
| link | Healthcare onboarding | navigate → /skills/health-onboarding | PASS |
| link | Patient engagement | navigate → /skills/patient-engagement | PASS |
| link | Care continuity | navigate → /skills/care-continuity | PASS |
| link | Health information architecture | navigate → /skills/health-ia | PASS |

### `/skills/prd`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | Associate Product Manager — Adhyatm Sadhna Kendra · Employment | navigate → /experience/apm-adhyatm-sadhna-kendra | PASS |
| link | Aaroh · Independent · founder | navigate → /projects/aaroh | PASS |
| link | PhonePe Smart Spend Coach · Academic case study · Masai School × IIT Roorkee | navigate → /projects/phonepe-smart-spend-coach | PASS |
| link | 90-day case studies — 78 of 90 studies · Case-study corpus | navigate → /research | PASS |
| link | Evamastu | navigate → /projects/evamastu | PASS |
| link | Aaroh | navigate → /projects/aaroh | PASS |
| link | PhonePe Smart Spend Coach | navigate → /projects/phonepe-smart-spend-coach | PASS |
| link | 90-Day Product Case Studies | navigate → /projects/90-day-case-studies | PASS |
| link | Product roadmap | navigate → /skills/roadmap-planning | PASS |
| link | Quarterly planning | navigate → /skills/quarterly-planning | PASS |
| link | MVP definition | navigate → /skills/mvp | PASS |
| link | Feature prioritization | navigate → /skills/feature-prioritization | PASS |
| link | RICE | navigate → /skills/rice | PASS |
| link | MoSCoW | navigate → /skills/moscow | PASS |
| link | ICE | navigate → /skills/ice | PASS |
| link | Kano Model | navigate → /skills/kano | PASS |

### `/skills/primary-metrics`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | PhonePe Smart Spend Coach · Academic case study · Masai School × IIT Roorkee | navigate → /projects/phonepe-smart-spend-coach | PASS |
| link | Hypothesis development | navigate → /skills/hypothesis-development | PASS |
| link | A/B testing | navigate → /skills/ab-testing | PASS |
| link | Experiment design | navigate → /skills/experiment-design | PASS |
| link | Control and treatment groups | navigate → /skills/control-treatment | PASS |
| link | Guardrail metrics | navigate → /skills/guardrail-metrics | PASS |
| link | Statistical significance | navigate → /skills/stat-sig | PASS |
| link | Sample size | navigate → /skills/sample-size | PASS |
| link | Experiment duration | navigate → /skills/experiment-duration | PASS |

### `/skills/privacy`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | GharGyaan · Independent build | navigate → /projects/ghargyaan | PASS |
| link | Nexus · Independent build | navigate → /projects/nexus | PASS |
| link | GharGyaan | navigate → /projects/ghargyaan | PASS |
| link | Nexus | navigate → /projects/nexus | PASS |
| link | AI product strategy | navigate → /skills/ai-product-strategy | PASS |
| link | AI use-case discovery | navigate → /skills/ai-use-cases | PASS |
| link | AI feasibility | navigate → /skills/ai-feasibility | PASS |
| link | AI product requirements | navigate → /skills/ai-requirements | PASS |
| link | LLM product design | navigate → /skills/llm-design | PASS |
| link | Prompt engineering | navigate → /skills/prompt-engineering | PASS |
| link | RAG concepts | navigate → /skills/rag | PASS |
| link | Context engineering | navigate → /skills/context-engineering | PASS |

### `/skills/problem-discovery`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | CareConnect · Independent build | navigate → /projects/careconnect | PASS |
| link | Aaroh · Independent · founder | navigate → /projects/aaroh | PASS |
| link | Problem framing | navigate → /skills/problem-framing | PASS |
| link | Opportunity identification | navigate → /skills/opportunity-identification | PASS |
| link | User research | navigate → /skills/user-research | PASS |
| link | Customer interviews | navigate → /skills/discovery-interviews | PASS |
| link | Stakeholder interviews | navigate → /skills/stakeholder-interviews | PASS |
| link | Jobs to Be Done | navigate → /skills/jtbd | PASS |
| link | Jobs-to-be-Done interviews | navigate → /skills/jtbd-interviews | PASS |
| link | User personas | navigate → /skills/personas | PASS |

### `/skills/problem-framing`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | CareConnect · Independent build | navigate → /projects/careconnect | PASS |
| link | 90-day case studies — 90 of 90 studies · Case-study corpus | navigate → /research | PASS |
| link | CareConnect | navigate → /projects/careconnect | PASS |
| link | Problem discovery | navigate → /skills/problem-discovery | PASS |
| link | Opportunity identification | navigate → /skills/opportunity-identification | PASS |
| link | User research | navigate → /skills/user-research | PASS |
| link | Customer interviews | navigate → /skills/discovery-interviews | PASS |
| link | Stakeholder interviews | navigate → /skills/stakeholder-interviews | PASS |
| link | Jobs to Be Done | navigate → /skills/jtbd | PASS |
| link | Jobs-to-be-Done interviews | navigate → /skills/jtbd-interviews | PASS |
| link | User personas | navigate → /skills/personas | PASS |

### `/skills/problem-validation`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | CareConnect · Independent build | navigate → /projects/careconnect | PASS |
| link | Problem discovery | navigate → /skills/problem-discovery | PASS |
| link | Problem framing | navigate → /skills/problem-framing | PASS |
| link | Opportunity identification | navigate → /skills/opportunity-identification | PASS |
| link | User research | navigate → /skills/user-research | PASS |
| link | Customer interviews | navigate → /skills/discovery-interviews | PASS |
| link | Stakeholder interviews | navigate → /skills/stakeholder-interviews | PASS |
| link | Jobs to Be Done | navigate → /skills/jtbd | PASS |
| link | Jobs-to-be-Done interviews | navigate → /skills/jtbd-interviews | PASS |

### `/skills/process-improvement`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | 90-day case studies — 79 of 90 studies · Case-study corpus | navigate → /research | PASS |
| link | Stakeholder management | navigate → /skills/stakeholder-management | PASS |
| link | Cross-functional communication | navigate → /skills/cross-functional-comms | PASS |
| link | Product documentation | navigate → /skills/documentation | PASS |
| link | Decision logs | navigate → /skills/decision-log | PASS |
| link | Claim registers | navigate → /skills/claim-register | PASS |
| link | Risk registers | navigate → /skills/risk-register | PASS |
| link | Sprint reporting | navigate → /skills/sprint-reporting | PASS |
| link | Release coordination | navigate → /skills/release-coordination | PASS |

### `/skills/product-lifecycle`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | Associate Product Manager — Adhyatm Sadhna Kendra · Employment | navigate → /experience/apm-adhyatm-sadhna-kendra | PASS |
| link | Product vision | navigate → /skills/product-vision | PASS |
| link | Product mission | navigate → /skills/product-mission | PASS |
| link | Product positioning | navigate → /skills/positioning | PASS |
| link | Product strategy | navigate → /skills/product-strategy | PASS |
| link | Product-market fit | navigate → /skills/pmf | PASS |
| link | Market segmentation | navigate → /skills/market-segmentation | PASS |
| link | TAM, SAM and SOM | navigate → /skills/tam-sam-som | PASS |
| link | Competitive differentiation | navigate → /skills/differentiation | PASS |

### `/skills/product-mission`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | 90-day case studies — 90 of 90 studies · Case-study corpus | navigate → /research | PASS |
| link | Product vision | navigate → /skills/product-vision | PASS |
| link | Product positioning | navigate → /skills/positioning | PASS |
| link | Product strategy | navigate → /skills/product-strategy | PASS |
| link | Product-market fit | navigate → /skills/pmf | PASS |
| link | Market segmentation | navigate → /skills/market-segmentation | PASS |
| link | TAM, SAM and SOM | navigate → /skills/tam-sam-som | PASS |
| link | Competitive differentiation | navigate → /skills/differentiation | PASS |
| link | Value proposition | navigate → /skills/value-proposition | PASS |

### `/skills/product-strategy`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | Aaroh · Independent · founder | navigate → /projects/aaroh | PASS |
| link | 90-day case studies — 90 of 90 studies · Case-study corpus | navigate → /research | PASS |
| link | Product vision | navigate → /skills/product-vision | PASS |
| link | Product mission | navigate → /skills/product-mission | PASS |
| link | Product positioning | navigate → /skills/positioning | PASS |
| link | Product-market fit | navigate → /skills/pmf | PASS |
| link | Market segmentation | navigate → /skills/market-segmentation | PASS |
| link | TAM, SAM and SOM | navigate → /skills/tam-sam-som | PASS |
| link | Competitive differentiation | navigate → /skills/differentiation | PASS |
| link | Value proposition | navigate → /skills/value-proposition | PASS |

### `/skills/product-vision`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | Aaroh · Independent · founder | navigate → /projects/aaroh | PASS |
| link | Aaroh | navigate → /projects/aaroh | PASS |
| link | Product mission | navigate → /skills/product-mission | PASS |
| link | Product positioning | navigate → /skills/positioning | PASS |
| link | Product strategy | navigate → /skills/product-strategy | PASS |
| link | Product-market fit | navigate → /skills/pmf | PASS |
| link | Market segmentation | navigate → /skills/market-segmentation | PASS |
| link | TAM, SAM and SOM | navigate → /skills/tam-sam-som | PASS |
| link | Competitive differentiation | navigate → /skills/differentiation | PASS |
| link | Value proposition | navigate → /skills/value-proposition | PASS |

### `/skills/prompt-engineering`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | AI product strategy | navigate → /skills/ai-product-strategy | PASS |
| link | AI use-case discovery | navigate → /skills/ai-use-cases | PASS |
| link | AI feasibility | navigate → /skills/ai-feasibility | PASS |
| link | AI product requirements | navigate → /skills/ai-requirements | PASS |
| link | LLM product design | navigate → /skills/llm-design | PASS |
| link | RAG concepts | navigate → /skills/rag | PASS |
| link | Context engineering | navigate → /skills/context-engineering | PASS |
| link | Agentic workflows | navigate → /skills/agentic | PASS |

### `/skills/prototypes`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | Aaroh · Independent · founder | navigate → /projects/aaroh | PASS |
| link | PhonePe Smart Spend Coach · Academic case study · Masai School × IIT Roorkee | navigate → /projects/phonepe-smart-spend-coach | PASS |
| link | Product roadmap | navigate → /skills/roadmap-planning | PASS |
| link | Quarterly planning | navigate → /skills/quarterly-planning | PASS |
| link | MVP definition | navigate → /skills/mvp | PASS |
| link | Feature prioritization | navigate → /skills/feature-prioritization | PASS |
| link | RICE | navigate → /skills/rice | PASS |
| link | MoSCoW | navigate → /skills/moscow | PASS |
| link | ICE | navigate → /skills/ice | PASS |
| link | Kano Model | navigate → /skills/kano | PASS |

### `/skills/provider-workflow`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | Aaroh · Independent · founder | navigate → /projects/aaroh | PASS |
| link | Patient journey | navigate → /skills/patient-journey | PASS |
| link | Caregiver journey | navigate → /skills/caregiver-journey | PASS |
| link | Digital health discovery | navigate → /skills/digital-health-discovery | PASS |
| link | Healthcare onboarding | navigate → /skills/health-onboarding | PASS |
| link | Patient engagement | navigate → /skills/patient-engagement | PASS |
| link | Post-discharge care | navigate → /skills/post-discharge | PASS |
| link | Care continuity | navigate → /skills/care-continuity | PASS |
| link | Health information architecture | navigate → /skills/health-ia | PASS |

### `/skills/prs`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | 90-day case studies — 78 of 90 studies · Case-study corpus | navigate → /research | PASS |
| link | Product roadmap | navigate → /skills/roadmap-planning | PASS |
| link | Quarterly planning | navigate → /skills/quarterly-planning | PASS |
| link | MVP definition | navigate → /skills/mvp | PASS |
| link | Feature prioritization | navigate → /skills/feature-prioritization | PASS |
| link | RICE | navigate → /skills/rice | PASS |
| link | MoSCoW | navigate → /skills/moscow | PASS |
| link | ICE | navigate → /skills/ice | PASS |
| link | Kano Model | navigate → /skills/kano | PASS |

### `/skills/qa-uat`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | CareConnect · Independent build | navigate → /projects/careconnect | PASS |
| link | GharGyaan · Independent build | navigate → /projects/ghargyaan | PASS |
| link | Product roadmap | navigate → /skills/roadmap-planning | PASS |
| link | Quarterly planning | navigate → /skills/quarterly-planning | PASS |
| link | MVP definition | navigate → /skills/mvp | PASS |
| link | Feature prioritization | navigate → /skills/feature-prioritization | PASS |
| link | RICE | navigate → /skills/rice | PASS |
| link | MoSCoW | navigate → /skills/moscow | PASS |
| link | ICE | navigate → /skills/ice | PASS |
| link | Kano Model | navigate → /skills/kano | PASS |

### `/skills/qualitative-research`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | Research Expert — Live Your Best Life (USA) · Employment | navigate → /experience/research-expert-lybl | PASS |
| link | Problem discovery | navigate → /skills/problem-discovery | PASS |
| link | Problem framing | navigate → /skills/problem-framing | PASS |
| link | Opportunity identification | navigate → /skills/opportunity-identification | PASS |
| link | User research | navigate → /skills/user-research | PASS |
| link | Customer interviews | navigate → /skills/discovery-interviews | PASS |
| link | Stakeholder interviews | navigate → /skills/stakeholder-interviews | PASS |
| link | Jobs to Be Done | navigate → /skills/jtbd | PASS |
| link | Jobs-to-be-Done interviews | navigate → /skills/jtbd-interviews | PASS |

### `/skills/quantitative-research`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | Associate Product Manager — Adhyatm Sadhna Kendra · Employment | navigate → /experience/apm-adhyatm-sadhna-kendra | PASS |
| link | Research Expert — Live Your Best Life (USA) · Employment | navigate → /experience/research-expert-lybl | PASS |
| link | Problem discovery | navigate → /skills/problem-discovery | PASS |
| link | Problem framing | navigate → /skills/problem-framing | PASS |
| link | Opportunity identification | navigate → /skills/opportunity-identification | PASS |
| link | User research | navigate → /skills/user-research | PASS |
| link | Customer interviews | navigate → /skills/discovery-interviews | PASS |
| link | Stakeholder interviews | navigate → /skills/stakeholder-interviews | PASS |
| link | Jobs to Be Done | navigate → /skills/jtbd | PASS |
| link | Jobs-to-be-Done interviews | navigate → /skills/jtbd-interviews | PASS |

### `/skills/quarterly-planning`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | Product roadmap | navigate → /skills/roadmap-planning | PASS |
| link | MVP definition | navigate → /skills/mvp | PASS |
| link | Feature prioritization | navigate → /skills/feature-prioritization | PASS |
| link | RICE | navigate → /skills/rice | PASS |
| link | MoSCoW | navigate → /skills/moscow | PASS |
| link | ICE | navigate → /skills/ice | PASS |
| link | Kano Model | navigate → /skills/kano | PASS |
| link | Impact vs effort | navigate → /skills/impact-effort | PASS |

### `/skills/rag`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | GharGyaan · Independent build | navigate → /projects/ghargyaan | PASS |
| link | Nexus · Independent build | navigate → /projects/nexus | PASS |
| link | Nexus | navigate → /projects/nexus | PASS |
| link | AI product strategy | navigate → /skills/ai-product-strategy | PASS |
| link | AI use-case discovery | navigate → /skills/ai-use-cases | PASS |
| link | AI feasibility | navigate → /skills/ai-feasibility | PASS |
| link | AI product requirements | navigate → /skills/ai-requirements | PASS |
| link | LLM product design | navigate → /skills/llm-design | PASS |
| link | Prompt engineering | navigate → /skills/prompt-engineering | PASS |
| link | Context engineering | navigate → /skills/context-engineering | PASS |
| link | Agentic workflows | navigate → /skills/agentic | PASS |

### `/skills/react-typescript`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | CareConnect · Independent build | navigate → /projects/careconnect | PASS |
| link | GharGyaan · Independent build | navigate → /projects/ghargyaan | PASS |
| link | SQLite | navigate → /skills/sqlite | PASS |
| link | Claude API and MCP | navigate → /skills/claude-api | PASS |
| link | Automated testing | navigate → /skills/testing-automation | PASS |
| link | GitHub | navigate → /skills/github | PASS |

### `/skills/referral-loops`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | Hypothesis development | navigate → /skills/hypothesis-development | PASS |
| link | A/B testing | navigate → /skills/ab-testing | PASS |
| link | Experiment design | navigate → /skills/experiment-design | PASS |
| link | Control and treatment groups | navigate → /skills/control-treatment | PASS |
| link | Primary metrics | navigate → /skills/primary-metrics | PASS |
| link | Guardrail metrics | navigate → /skills/guardrail-metrics | PASS |
| link | Statistical significance | navigate → /skills/stat-sig | PASS |
| link | Sample size | navigate → /skills/sample-size | PASS |

### `/skills/release-coordination`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | Associate Product Manager — Adhyatm Sadhna Kendra · Employment | navigate → /experience/apm-adhyatm-sadhna-kendra | PASS |
| link | Stakeholder management | navigate → /skills/stakeholder-management | PASS |
| link | Cross-functional communication | navigate → /skills/cross-functional-comms | PASS |
| link | Product documentation | navigate → /skills/documentation | PASS |
| link | Decision logs | navigate → /skills/decision-log | PASS |
| link | Claim registers | navigate → /skills/claim-register | PASS |
| link | Risk registers | navigate → /skills/risk-register | PASS |
| link | Sprint reporting | navigate → /skills/sprint-reporting | PASS |
| link | Process improvement | navigate → /skills/process-improvement | PASS |

### `/skills/release-management`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | Associate Product Manager — Adhyatm Sadhna Kendra · Employment | navigate → /experience/apm-adhyatm-sadhna-kendra | PASS |
| link | Product roadmap | navigate → /skills/roadmap-planning | PASS |
| link | Quarterly planning | navigate → /skills/quarterly-planning | PASS |
| link | MVP definition | navigate → /skills/mvp | PASS |
| link | Feature prioritization | navigate → /skills/feature-prioritization | PASS |
| link | RICE | navigate → /skills/rice | PASS |
| link | MoSCoW | navigate → /skills/moscow | PASS |
| link | ICE | navigate → /skills/ice | PASS |
| link | Kano Model | navigate → /skills/kano | PASS |

### `/skills/responsible-ai`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | Aaroh · Independent · founder | navigate → /projects/aaroh | PASS |
| link | AI product strategy | navigate → /skills/ai-product-strategy | PASS |
| link | AI use-case discovery | navigate → /skills/ai-use-cases | PASS |
| link | AI feasibility | navigate → /skills/ai-feasibility | PASS |
| link | AI product requirements | navigate → /skills/ai-requirements | PASS |
| link | LLM product design | navigate → /skills/llm-design | PASS |
| link | Prompt engineering | navigate → /skills/prompt-engineering | PASS |
| link | RAG concepts | navigate → /skills/rag | PASS |
| link | Context engineering | navigate → /skills/context-engineering | PASS |

### `/skills/responsible-health-comms`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | GharGyaan · Independent build | navigate → /projects/ghargyaan | PASS |
| link | Patient journey | navigate → /skills/patient-journey | PASS |
| link | Caregiver journey | navigate → /skills/caregiver-journey | PASS |
| link | Provider workflow | navigate → /skills/provider-workflow | PASS |
| link | Digital health discovery | navigate → /skills/digital-health-discovery | PASS |
| link | Healthcare onboarding | navigate → /skills/health-onboarding | PASS |
| link | Patient engagement | navigate → /skills/patient-engagement | PASS |
| link | Post-discharge care | navigate → /skills/post-discharge | PASS |
| link | Care continuity | navigate → /skills/care-continuity | PASS |

### `/skills/responsive`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | GharGyaan · Independent build | navigate → /projects/ghargyaan | PASS |
| link | Information architecture | navigate → /skills/information-architecture | PASS |
| link | UX research | navigate → /skills/ux-research | PASS |
| link | Interaction design | navigate → /skills/interaction-design | PASS |
| link | Usability testing | navigate → /skills/usability-testing | PASS |
| link | Low-fidelity prototypes | navigate → /skills/lofi | PASS |
| link | High-fidelity prototypes | navigate → /skills/hifi | PASS |
| link | Design systems | navigate → /skills/design-systems | PASS |
| link | Accessibility | navigate → /skills/accessibility | PASS |

### `/skills/retention-design`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | Associate Product Manager — Adhyatm Sadhna Kendra · Employment | navigate → /experience/apm-adhyatm-sadhna-kendra | PASS |
| link | Information architecture | navigate → /skills/information-architecture | PASS |
| link | UX research | navigate → /skills/ux-research | PASS |
| link | Interaction design | navigate → /skills/interaction-design | PASS |
| link | Usability testing | navigate → /skills/usability-testing | PASS |
| link | Low-fidelity prototypes | navigate → /skills/lofi | PASS |
| link | High-fidelity prototypes | navigate → /skills/hifi | PASS |
| link | Design systems | navigate → /skills/design-systems | PASS |
| link | Accessibility | navigate → /skills/accessibility | PASS |

### `/skills/retention-strategies`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | Hypothesis development | navigate → /skills/hypothesis-development | PASS |
| link | A/B testing | navigate → /skills/ab-testing | PASS |
| link | Experiment design | navigate → /skills/experiment-design | PASS |
| link | Control and treatment groups | navigate → /skills/control-treatment | PASS |
| link | Primary metrics | navigate → /skills/primary-metrics | PASS |
| link | Guardrail metrics | navigate → /skills/guardrail-metrics | PASS |
| link | Statistical significance | navigate → /skills/stat-sig | PASS |
| link | Sample size | navigate → /skills/sample-size | PASS |

### `/skills/retrospectives`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | Product roadmap | navigate → /skills/roadmap-planning | PASS |
| link | Quarterly planning | navigate → /skills/quarterly-planning | PASS |
| link | MVP definition | navigate → /skills/mvp | PASS |
| link | Feature prioritization | navigate → /skills/feature-prioritization | PASS |
| link | RICE | navigate → /skills/rice | PASS |
| link | MoSCoW | navigate → /skills/moscow | PASS |
| link | ICE | navigate → /skills/ice | PASS |
| link | Kano Model | navigate → /skills/kano | PASS |

### `/skills/rice`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | Associate Product Manager — Adhyatm Sadhna Kendra · Employment | navigate → /experience/apm-adhyatm-sadhna-kendra | PASS |
| link | PhonePe Smart Spend Coach · Academic case study · Masai School × IIT Roorkee | navigate → /projects/phonepe-smart-spend-coach | PASS |
| link | 90-day case studies — 88 of 90 studies · Case-study corpus | navigate → /research | PASS |
| link | Evamastu | navigate → /projects/evamastu | PASS |
| link | Aaroh | navigate → /projects/aaroh | PASS |
| link | PhonePe Smart Spend Coach | navigate → /projects/phonepe-smart-spend-coach | PASS |
| link | 90-Day Product Case Studies | navigate → /projects/90-day-case-studies | PASS |
| link | Product roadmap | navigate → /skills/roadmap-planning | PASS |
| link | Quarterly planning | navigate → /skills/quarterly-planning | PASS |
| link | MVP definition | navigate → /skills/mvp | PASS |
| link | Feature prioritization | navigate → /skills/feature-prioritization | PASS |
| link | MoSCoW | navigate → /skills/moscow | PASS |
| link | ICE | navigate → /skills/ice | PASS |
| link | Kano Model | navigate → /skills/kano | PASS |
| link | Impact vs effort | navigate → /skills/impact-effort | PASS |

### `/skills/risk-register`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | 90-day case studies — 90 of 90 studies · Case-study corpus | navigate → /research | PASS |
| link | Stakeholder management | navigate → /skills/stakeholder-management | PASS |
| link | Cross-functional communication | navigate → /skills/cross-functional-comms | PASS |
| link | Product documentation | navigate → /skills/documentation | PASS |
| link | Decision logs | navigate → /skills/decision-log | PASS |
| link | Claim registers | navigate → /skills/claim-register | PASS |
| link | Sprint reporting | navigate → /skills/sprint-reporting | PASS |
| link | Release coordination | navigate → /skills/release-coordination | PASS |
| link | Process improvement | navigate → /skills/process-improvement | PASS |

### `/skills/roadmap`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | Aaroh · Independent · founder | navigate → /projects/aaroh | PASS |
| link | 90-day case studies — 90 of 90 studies · Case-study corpus | navigate → /research | PASS |
| link | Product vision | navigate → /skills/product-vision | PASS |
| link | Product mission | navigate → /skills/product-mission | PASS |
| link | Product positioning | navigate → /skills/positioning | PASS |
| link | Product strategy | navigate → /skills/product-strategy | PASS |
| link | Product-market fit | navigate → /skills/pmf | PASS |
| link | Market segmentation | navigate → /skills/market-segmentation | PASS |
| link | TAM, SAM and SOM | navigate → /skills/tam-sam-som | PASS |
| link | Competitive differentiation | navigate → /skills/differentiation | PASS |

### `/skills/roadmap-planning`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | Associate Product Manager — Adhyatm Sadhna Kendra · Employment | navigate → /experience/apm-adhyatm-sadhna-kendra | PASS |
| link | Quarterly planning | navigate → /skills/quarterly-planning | PASS |
| link | MVP definition | navigate → /skills/mvp | PASS |
| link | Feature prioritization | navigate → /skills/feature-prioritization | PASS |
| link | RICE | navigate → /skills/rice | PASS |
| link | MoSCoW | navigate → /skills/moscow | PASS |
| link | ICE | navigate → /skills/ice | PASS |
| link | Kano Model | navigate → /skills/kano | PASS |
| link | Impact vs effort | navigate → /skills/impact-effort | PASS |

### `/skills/sample-size`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | Hypothesis development | navigate → /skills/hypothesis-development | PASS |
| link | A/B testing | navigate → /skills/ab-testing | PASS |
| link | Experiment design | navigate → /skills/experiment-design | PASS |
| link | Control and treatment groups | navigate → /skills/control-treatment | PASS |
| link | Primary metrics | navigate → /skills/primary-metrics | PASS |
| link | Guardrail metrics | navigate → /skills/guardrail-metrics | PASS |
| link | Statistical significance | navigate → /skills/stat-sig | PASS |
| link | Experiment duration | navigate → /skills/experiment-duration | PASS |

### `/skills/scope-management`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | Associate Product Manager — Adhyatm Sadhna Kendra · Employment | navigate → /experience/apm-adhyatm-sadhna-kendra | PASS |
| link | Aaroh · Independent · founder | navigate → /projects/aaroh | PASS |
| link | Product roadmap | navigate → /skills/roadmap-planning | PASS |
| link | Quarterly planning | navigate → /skills/quarterly-planning | PASS |
| link | MVP definition | navigate → /skills/mvp | PASS |
| link | Feature prioritization | navigate → /skills/feature-prioritization | PASS |
| link | RICE | navigate → /skills/rice | PASS |
| link | MoSCoW | navigate → /skills/moscow | PASS |
| link | ICE | navigate → /skills/ice | PASS |
| link | Kano Model | navigate → /skills/kano | PASS |

### `/skills/scrum`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | Product roadmap | navigate → /skills/roadmap-planning | PASS |
| link | Quarterly planning | navigate → /skills/quarterly-planning | PASS |
| link | MVP definition | navigate → /skills/mvp | PASS |
| link | Feature prioritization | navigate → /skills/feature-prioritization | PASS |
| link | RICE | navigate → /skills/rice | PASS |
| link | MoSCoW | navigate → /skills/moscow | PASS |
| link | ICE | navigate → /skills/ice | PASS |
| link | Kano Model | navigate → /skills/kano | PASS |

### `/skills/segmentation`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | Associate Product Manager — Adhyatm Sadhna Kendra · Employment | navigate → /experience/apm-adhyatm-sadhna-kendra | PASS |
| link | CareConnect · Independent build | navigate → /projects/careconnect | PASS |
| link | Problem discovery | navigate → /skills/problem-discovery | PASS |
| link | Problem framing | navigate → /skills/problem-framing | PASS |
| link | Opportunity identification | navigate → /skills/opportunity-identification | PASS |
| link | User research | navigate → /skills/user-research | PASS |
| link | Customer interviews | navigate → /skills/discovery-interviews | PASS |
| link | Stakeholder interviews | navigate → /skills/stakeholder-interviews | PASS |
| link | Jobs to Be Done | navigate → /skills/jtbd | PASS |
| link | Jobs-to-be-Done interviews | navigate → /skills/jtbd-interviews | PASS |

### `/skills/segmentation-analytics`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | Associate Product Manager — Adhyatm Sadhna Kendra · Employment | navigate → /experience/apm-adhyatm-sadhna-kendra | PASS |
| link | North Star Metric | navigate → /skills/north-star | PASS |
| link | KPIs | navigate → /skills/kpis | PASS |
| link | Input and output metrics | navigate → /skills/input-output-metrics | PASS |
| link | Engagement | navigate → /skills/engagement | PASS |
| link | Churn | navigate → /skills/churn | PASS |
| link | Conversion | navigate → /skills/conversion | PASS |
| link | Funnel analysis | navigate → /skills/funnel-analysis | PASS |
| link | Cohort analysis | navigate → /skills/cohort-analysis | PASS |

### `/skills/sprint-planning`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | Associate Product Manager — Adhyatm Sadhna Kendra · Employment | navigate → /experience/apm-adhyatm-sadhna-kendra | PASS |
| link | Evamastu | navigate → /projects/evamastu | PASS |
| link | Product roadmap | navigate → /skills/roadmap-planning | PASS |
| link | Quarterly planning | navigate → /skills/quarterly-planning | PASS |
| link | MVP definition | navigate → /skills/mvp | PASS |
| link | Feature prioritization | navigate → /skills/feature-prioritization | PASS |
| link | RICE | navigate → /skills/rice | PASS |
| link | MoSCoW | navigate → /skills/moscow | PASS |
| link | ICE | navigate → /skills/ice | PASS |
| link | Kano Model | navigate → /skills/kano | PASS |

### `/skills/sprint-reporting`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | Research Expert — Live Your Best Life (USA) · Employment | navigate → /experience/research-expert-lybl | PASS |
| link | Stakeholder management | navigate → /skills/stakeholder-management | PASS |
| link | Cross-functional communication | navigate → /skills/cross-functional-comms | PASS |
| link | Product documentation | navigate → /skills/documentation | PASS |
| link | Decision logs | navigate → /skills/decision-log | PASS |
| link | Claim registers | navigate → /skills/claim-register | PASS |
| link | Risk registers | navigate → /skills/risk-register | PASS |
| link | Release coordination | navigate → /skills/release-coordination | PASS |
| link | Process improvement | navigate → /skills/process-improvement | PASS |

### `/skills/sprint-reviews`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | Product roadmap | navigate → /skills/roadmap-planning | PASS |
| link | Quarterly planning | navigate → /skills/quarterly-planning | PASS |
| link | MVP definition | navigate → /skills/mvp | PASS |
| link | Feature prioritization | navigate → /skills/feature-prioritization | PASS |
| link | RICE | navigate → /skills/rice | PASS |
| link | MoSCoW | navigate → /skills/moscow | PASS |
| link | ICE | navigate → /skills/ice | PASS |
| link | Kano Model | navigate → /skills/kano | PASS |

### `/skills/sqlite`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | CareConnect · Independent build | navigate → /projects/careconnect | PASS |
| link | React and TypeScript | navigate → /skills/react-typescript | PASS |
| link | Claude API and MCP | navigate → /skills/claude-api | PASS |
| link | Automated testing | navigate → /skills/testing-automation | PASS |
| link | GitHub | navigate → /skills/github | PASS |

### `/skills/stakeholder-interviews`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | Product Management Intern — Adhyatm Sadhna Kendra · Employment | navigate → /experience/pm-intern-adhyatm-sadhna-kendra | PASS |
| link | Evamastu | navigate → /projects/evamastu | PASS |
| link | Problem discovery | navigate → /skills/problem-discovery | PASS |
| link | Problem framing | navigate → /skills/problem-framing | PASS |
| link | Opportunity identification | navigate → /skills/opportunity-identification | PASS |
| link | User research | navigate → /skills/user-research | PASS |
| link | Customer interviews | navigate → /skills/discovery-interviews | PASS |
| link | Jobs to Be Done | navigate → /skills/jtbd | PASS |
| link | Jobs-to-be-Done interviews | navigate → /skills/jtbd-interviews | PASS |
| link | User personas | navigate → /skills/personas | PASS |

### `/skills/stakeholder-management`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | Product Management Intern — Adhyatm Sadhna Kendra · Employment | navigate → /experience/pm-intern-adhyatm-sadhna-kendra | PASS |
| link | Cross-functional communication | navigate → /skills/cross-functional-comms | PASS |
| link | Product documentation | navigate → /skills/documentation | PASS |
| link | Decision logs | navigate → /skills/decision-log | PASS |
| link | Claim registers | navigate → /skills/claim-register | PASS |
| link | Risk registers | navigate → /skills/risk-register | PASS |
| link | Sprint reporting | navigate → /skills/sprint-reporting | PASS |
| link | Release coordination | navigate → /skills/release-coordination | PASS |
| link | Process improvement | navigate → /skills/process-improvement | PASS |

### `/skills/stat-sig`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | Hypothesis development | navigate → /skills/hypothesis-development | PASS |
| link | A/B testing | navigate → /skills/ab-testing | PASS |
| link | Experiment design | navigate → /skills/experiment-design | PASS |
| link | Control and treatment groups | navigate → /skills/control-treatment | PASS |
| link | Primary metrics | navigate → /skills/primary-metrics | PASS |
| link | Guardrail metrics | navigate → /skills/guardrail-metrics | PASS |
| link | Sample size | navigate → /skills/sample-size | PASS |
| link | Experiment duration | navigate → /skills/experiment-duration | PASS |

### `/skills/stickiness`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | North Star Metric | navigate → /skills/north-star | PASS |
| link | KPIs | navigate → /skills/kpis | PASS |
| link | Input and output metrics | navigate → /skills/input-output-metrics | PASS |
| link | Engagement | navigate → /skills/engagement | PASS |
| link | Churn | navigate → /skills/churn | PASS |
| link | Conversion | navigate → /skills/conversion | PASS |
| link | Funnel analysis | navigate → /skills/funnel-analysis | PASS |
| link | Cohort analysis | navigate → /skills/cohort-analysis | PASS |

### `/skills/tam-sam-som`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | 90-day case studies — 79 of 90 studies · Case-study corpus | navigate → /research | PASS |
| link | 90-Day Product Case Studies | navigate → /projects/90-day-case-studies | PASS |
| link | Product vision | navigate → /skills/product-vision | PASS |
| link | Product mission | navigate → /skills/product-mission | PASS |
| link | Product positioning | navigate → /skills/positioning | PASS |
| link | Product strategy | navigate → /skills/product-strategy | PASS |
| link | Product-market fit | navigate → /skills/pmf | PASS |
| link | Market segmentation | navigate → /skills/market-segmentation | PASS |
| link | Competitive differentiation | navigate → /skills/differentiation | PASS |
| link | Value proposition | navigate → /skills/value-proposition | PASS |

### `/skills/testing-automation`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | CareConnect · Independent build | navigate → /projects/careconnect | PASS |
| link | GharGyaan · Independent build | navigate → /projects/ghargyaan | PASS |
| link | React and TypeScript | navigate → /skills/react-typescript | PASS |
| link | SQLite | navigate → /skills/sqlite | PASS |
| link | Claude API and MCP | navigate → /skills/claude-api | PASS |
| link | GitHub | navigate → /skills/github | PASS |

### `/skills/time-to-value`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | PhonePe Smart Spend Coach · Academic case study · Masai School × IIT Roorkee | navigate → /projects/phonepe-smart-spend-coach | PASS |
| link | North Star Metric | navigate → /skills/north-star | PASS |
| link | KPIs | navigate → /skills/kpis | PASS |
| link | Input and output metrics | navigate → /skills/input-output-metrics | PASS |
| link | Engagement | navigate → /skills/engagement | PASS |
| link | Churn | navigate → /skills/churn | PASS |
| link | Conversion | navigate → /skills/conversion | PASS |
| link | Funnel analysis | navigate → /skills/funnel-analysis | PASS |
| link | Cohort analysis | navigate → /skills/cohort-analysis | PASS |

### `/skills/tradeoffs`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | CareConnect · Independent build | navigate → /projects/careconnect | PASS |
| link | Aaroh · Independent · founder | navigate → /projects/aaroh | PASS |
| link | Product vision | navigate → /skills/product-vision | PASS |
| link | Product mission | navigate → /skills/product-mission | PASS |
| link | Product positioning | navigate → /skills/positioning | PASS |
| link | Product strategy | navigate → /skills/product-strategy | PASS |
| link | Product-market fit | navigate → /skills/pmf | PASS |
| link | Market segmentation | navigate → /skills/market-segmentation | PASS |
| link | TAM, SAM and SOM | navigate → /skills/tam-sam-som | PASS |
| link | Competitive differentiation | navigate → /skills/differentiation | PASS |

### `/skills/usability-testing`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | PhonePe Smart Spend Coach · Academic case study · Masai School × IIT Roorkee | navigate → /projects/phonepe-smart-spend-coach | PASS |
| link | PhonePe Smart Spend Coach | navigate → /projects/phonepe-smart-spend-coach | PASS |
| link | Information architecture | navigate → /skills/information-architecture | PASS |
| link | UX research | navigate → /skills/ux-research | PASS |
| link | Interaction design | navigate → /skills/interaction-design | PASS |
| link | Low-fidelity prototypes | navigate → /skills/lofi | PASS |
| link | High-fidelity prototypes | navigate → /skills/hifi | PASS |
| link | Design systems | navigate → /skills/design-systems | PASS |
| link | Accessibility | navigate → /skills/accessibility | PASS |
| link | Responsive design | navigate → /skills/responsive | PASS |

### `/skills/user-flows`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | CareConnect · Independent build | navigate → /projects/careconnect | PASS |
| link | Product roadmap | navigate → /skills/roadmap-planning | PASS |
| link | Quarterly planning | navigate → /skills/quarterly-planning | PASS |
| link | MVP definition | navigate → /skills/mvp | PASS |
| link | Feature prioritization | navigate → /skills/feature-prioritization | PASS |
| link | RICE | navigate → /skills/rice | PASS |
| link | MoSCoW | navigate → /skills/moscow | PASS |
| link | ICE | navigate → /skills/ice | PASS |
| link | Kano Model | navigate → /skills/kano | PASS |

### `/skills/user-research`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | Research Expert — Live Your Best Life (USA) · Employment | navigate → /experience/research-expert-lybl | PASS |
| link | Product Management Intern — Adhyatm Sadhna Kendra · Employment | navigate → /experience/pm-intern-adhyatm-sadhna-kendra | PASS |
| link | Problem discovery | navigate → /skills/problem-discovery | PASS |
| link | Problem framing | navigate → /skills/problem-framing | PASS |
| link | Opportunity identification | navigate → /skills/opportunity-identification | PASS |
| link | Customer interviews | navigate → /skills/discovery-interviews | PASS |
| link | Stakeholder interviews | navigate → /skills/stakeholder-interviews | PASS |
| link | Jobs to Be Done | navigate → /skills/jtbd | PASS |
| link | Jobs-to-be-Done interviews | navigate → /skills/jtbd-interviews | PASS |
| link | User personas | navigate → /skills/personas | PASS |

### `/skills/user-stories`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | Product Management Intern — Adhyatm Sadhna Kendra · Employment | navigate → /experience/pm-intern-adhyatm-sadhna-kendra | PASS |
| link | Evamastu | navigate → /projects/evamastu | PASS |
| link | Product roadmap | navigate → /skills/roadmap-planning | PASS |
| link | Quarterly planning | navigate → /skills/quarterly-planning | PASS |
| link | MVP definition | navigate → /skills/mvp | PASS |
| link | Feature prioritization | navigate → /skills/feature-prioritization | PASS |
| link | RICE | navigate → /skills/rice | PASS |
| link | MoSCoW | navigate → /skills/moscow | PASS |
| link | ICE | navigate → /skills/ice | PASS |
| link | Kano Model | navigate → /skills/kano | PASS |

### `/skills/ux-research`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | PhonePe Smart Spend Coach · Academic case study · Masai School × IIT Roorkee | navigate → /projects/phonepe-smart-spend-coach | PASS |
| link | Information architecture | navigate → /skills/information-architecture | PASS |
| link | Interaction design | navigate → /skills/interaction-design | PASS |
| link | Usability testing | navigate → /skills/usability-testing | PASS |
| link | Low-fidelity prototypes | navigate → /skills/lofi | PASS |
| link | High-fidelity prototypes | navigate → /skills/hifi | PASS |
| link | Design systems | navigate → /skills/design-systems | PASS |
| link | Accessibility | navigate → /skills/accessibility | PASS |
| link | Responsive design | navigate → /skills/responsive | PASS |

### `/skills/value-complexity`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | Product roadmap | navigate → /skills/roadmap-planning | PASS |
| link | Quarterly planning | navigate → /skills/quarterly-planning | PASS |
| link | MVP definition | navigate → /skills/mvp | PASS |
| link | Feature prioritization | navigate → /skills/feature-prioritization | PASS |
| link | RICE | navigate → /skills/rice | PASS |
| link | MoSCoW | navigate → /skills/moscow | PASS |
| link | ICE | navigate → /skills/ice | PASS |
| link | Kano Model | navigate → /skills/kano | PASS |

### `/skills/value-proposition`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | CareConnect · Independent build | navigate → /projects/careconnect | PASS |
| link | Product vision | navigate → /skills/product-vision | PASS |
| link | Product mission | navigate → /skills/product-mission | PASS |
| link | Product positioning | navigate → /skills/positioning | PASS |
| link | Product strategy | navigate → /skills/product-strategy | PASS |
| link | Product-market fit | navigate → /skills/pmf | PASS |
| link | Market segmentation | navigate → /skills/market-segmentation | PASS |
| link | TAM, SAM and SOM | navigate → /skills/tam-sam-som | PASS |
| link | Competitive differentiation | navigate → /skills/differentiation | PASS |

### `/skills/voc`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | Research Expert — Live Your Best Life (USA) · Employment | navigate → /experience/research-expert-lybl | PASS |
| link | Problem discovery | navigate → /skills/problem-discovery | PASS |
| link | Problem framing | navigate → /skills/problem-framing | PASS |
| link | Opportunity identification | navigate → /skills/opportunity-identification | PASS |
| link | User research | navigate → /skills/user-research | PASS |
| link | Customer interviews | navigate → /skills/discovery-interviews | PASS |
| link | Stakeholder interviews | navigate → /skills/stakeholder-interviews | PASS |
| link | Jobs to Be Done | navigate → /skills/jtbd | PASS |
| link | Jobs-to-be-Done interviews | navigate → /skills/jtbd-interviews | PASS |

### `/skills/wireframes`

| Kind | Name | Expected action | Result |
|---|---|---|---|
| link | Skip to content | navigate → #main | PASS |
| link | Skills library | navigate → /skills | PASS |
| link | Product roadmap | navigate → /skills/roadmap-planning | PASS |
| link | Quarterly planning | navigate → /skills/quarterly-planning | PASS |
| link | MVP definition | navigate → /skills/mvp | PASS |
| link | Feature prioritization | navigate → /skills/feature-prioritization | PASS |
| link | RICE | navigate → /skills/rice | PASS |
| link | MoSCoW | navigate → /skills/moscow | PASS |
| link | ICE | navigate → /skills/ice | PASS |
| link | Kano Model | navigate → /skills/kano | PASS |

