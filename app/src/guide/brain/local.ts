/**
 * The local brain: grounded, deterministic and on-device. It never composes new
 * facts. Every name, status, role, date and figure below is read from the
 * portfolio's content modules at runtime, and anything those modules do not
 * contain is answered with the refusal line. Questions about figures the
 * portfolio does not hold (revenue, users, salary, clinical validation…) are
 * refused before anything else is matched, exactly like Ask Gaurav.
 */
import { ask } from "~/lib/ask";
import { NO_EVIDENCE_TERMS } from "~/content/kb";
import { hasTerm } from "~/lib/text";
import { profile } from "~/content/profile";
import { projects } from "~/content/projects";
import { experience, education, tools } from "~/content/experience";
import { newsletter } from "~/content/newsletter";
import { ventures, VENTURES_NOTE, MODEL_NOTE } from "~/content/ventures";
import { worlds, type Cluster } from "~/content/universe";
import type { Block } from "~/content/types";
import type { Reply } from "../lang";
import type { Brain, GuideLink, GuideReply } from "./types";

export const REFUSAL: Record<Reply, string> = {
  en: "I don't have verified information about that yet. You can explore Gaurav's portfolio or contact him directly.",
  hinglish: "Iske baare mein mere paas abhi verified jaankari nahi hai. Aap Gaurav ka portfolio dekh sakte hain ya unse seedha contact kar sakte hain.",
  hi: "इसके बारे में मेरे पास अभी सत्यापित जानकारी नहीं है। आप गौरव का पोर्टफ़ोलियो देख सकते हैं या उनसे सीधे संपर्क कर सकते हैं।",
};

export const GREETING: Record<Reply, string> = {
  en: "Hey! I'm Oz, your Gaurav.OS AI guide. I can show you Gaurav's product work, AI experiments, case studies and professional journey. What would you like to explore?",
  hinglish: "Namaste! Gaurav.OS mein aapka swagat hai. Main Oz hoon, aapka AI guide. Aap mujhse Gaurav ke projects, product management experience aur AI experiments ke baare mein pooch sakte hain.",
  hi: "नमस्ते! Gaurav.OS में आपका स्वागत है। मैं Oz हूँ, आपका AI गाइड। आप मुझसे गौरव के प्रोजेक्ट्स, प्रोडक्ट मैनेजमेंट अनुभव और AI प्रयोगों के बारे में पूछ सकते हैं।",
};

/** Status words in Hindi / Hinglish, keyed by the portfolio's own status labels. */
const STATUS: Record<string, Record<Reply, string>> = {
  "SHIPPED": { en: "shipped", hi: "शिप हो चुका", hinglish: "shipped" },
  "PRE-LAUNCH · PROTOTYPE": { en: "pre-launch prototype", hi: "लॉन्च से पहले का प्रोटोटाइप", hinglish: "pre-launch prototype" },
  "MVP · NO USERS": { en: "MVP, no users yet", hi: "MVP, अभी कोई यूज़र नहीं", hinglish: "MVP, abhi koi users nahi" },
  "PROTOTYPE · DEMO MODE": { en: "prototype in demo mode", hi: "डेमो मोड में प्रोटोटाइप", hinglish: "demo mode mein prototype" },
  "PROTOTYPE · NOT DEPLOYED": { en: "prototype, not deployed", hi: "प्रोटोटाइप, अभी डिप्लॉय नहीं", hinglish: "prototype, abhi deploy nahi" },
  "ACADEMIC CASE": { en: "academic case study", hi: "अकादमिक केस स्टडी", hinglish: "academic case study" },
  "PUBLISHED": { en: "published", hi: "प्रकाशित", hinglish: "published" },
};
const status = (s: string, r: Reply) => STATUS[s]?.[r] ?? s.toLowerCase();
/** "Digital mindfulness platform" → "digital mindfulness platform", but keep acronyms ("AI", "MVP"). */
const lc = (s: string) => s.replace(/^([A-Z])([a-z])/, (_, a, b) => a.toLowerCase() + b);

/** Plain text for display and speech from the portfolio's content blocks. */
export function blocksToText(blocks: Block[]): string {
  return blocks.map((b) =>
    "p" in b ? b.p : "ul" in b ? b.ul.map((x) => `• ${x}`).join("\n") : "ol" in b ? b.ol.map((x, i) => `${i + 1}. ${x}`).join("\n") :
    "note" in b ? `Note: ${b.note}` : "flow" in b ? b.flow.join(" → ") : "kv" in b ? b.kv.map(([k, v]) => `${k}: ${v}`).join("\n") :
    "quote" in b ? `“${b.quote}”` : "table" in b ? b.table.rows.map((r) => r.join(" — ")).join("\n") : "").filter(Boolean).join("\n");
}
/** Speech: no bullets, arrows or URLs; capped so the guide never reads a whole page aloud. */
export function toSpeech(text: string, max = 420): string {
  let s = text.replace(/https?:\/\/\S+/g, "").replace(/•\s*/g, "").replace(/→/g, ", then ").replace(/[“”]/g, "").replace(/\n+/g, ". ")
    .replace(/×/g, " by ").replace(/\s+/g, " ").replace(/\.\s*\./g, ".").trim();
  if (s.length > max) s = s.slice(0, max).replace(/[^.!?।]*$/, "").trim() || s.slice(0, max);
  return s;
}

const PAGES: { keys: RegExp; to: string; label: string; also?: GuideLink }[] = [
  ...projects.map((p) => ({ keys: new RegExp(`\\b${p.name.toLowerCase().replace(/[^a-z0-9 ]/g, "").split(" ").slice(0, 2).join(" ")}\\b|${p.slug.replace(/-/g, "[ -]?")}`, "i"), to: `/projects/${p.slug}`, label: p.name })),
  { keys: /\b(project )?worlds?\b|\bbuildings?\b/i, to: "/worlds", label: "the project worlds" },
  { keys: /\b(projects?|work|portfolio)\b|प्रोजेक्ट/i, to: "/projects", label: "Explore my work" },
  { keys: /\bcase stud(y|ies)\b/i, to: "/case-studies", label: "Case studies" },
  { keys: /\b(experience|career|jobs?)\b|अनुभव/i, to: "/experience", label: "Experience" },
  { keys: /\babout\b|परिचय/i, to: "/about", label: "About" },
  { keys: /\bcontact\b|संपर्क/i, to: "/contact", label: "Contact" },
  { keys: /\b(cv|resume|résumé)\b/i, to: "/cv", label: "CV" },
  { keys: /\brecruiter\b/i, to: "/recruiter", label: "Recruiter Mode" },
  { keys: /\bresearch\b/i, to: "/research", label: "Research library" },
  { keys: /\b(ai lab|lab)\b/i, to: "/ai-lab", label: "AI Lab" },
  ...ventures.map((v) => ({ keys: new RegExp(v.name.replace(/ /g, "[ -]?"), "i"), to: `/ventures/${v.slug}`, label: `${v.name} (concept)`, also: { label: `Visit ${v.name} in 3D`, to: `/ventures/${v.slug}/world` } })),
  { keys: /\b(emerging ventures?|ventures?|concepts? in development)\b/i, to: "/ventures", label: "Emerging Ventures" },
  { keys: /\b(earth|globe)\b|पृथ्वी|अर्थ/i, to: "/universe?at=earth", label: "the 90 case studies on the 3D Earth" },
  { keys: /\b(universe|solar system|planets?)\b|सौर/i, to: "/universe", label: "the Gaurav.OS solar system" },
  { keys: /\bexplore( mode)?\b|\b3d\b|\bcity\b/i, to: "/explore", label: "Explore Mode" },
  { keys: /\bskills?\b/i, to: "/skills", label: "Skills library" },
  { keys: /\bproduct thinking\b|\btools?\b/i, to: "/product-thinking", label: "Product Thinking" },
  { keys: /\b(newsletter|teardown)\b.*\b3d\b|\b3d\b.*\b(newsletter|teardown)\b/i, to: "/writing/the-teardown", label: `${newsletter.name} in 3D` },
  { keys: /\bnewsletter\b|\bteardown\b/i, to: "/about#writing-h", label: newsletter.name, also: { label: "See it in 3D", to: "/writing/the-teardown" } },
];
const NAV_VERB = /\b(open|go to|goto|take me|show me|navigate|le chalo|le chaliye|kholo|khol do|dikhao|dikhaiye)\b|खोलो|दिखाओ|ले चलो/i;

const has = (t: string, re: RegExp) => re.test(t);
const L = (en: string, hinglish: string, hi: string, r: Reply) => (r === "en" ? en : r === "hinglish" ? hinglish : hi);
const reply = (r: Reply, kind: GuideReply["kind"], text: string, links: GuideLink[] = [], extra: Partial<GuideReply> = {}): GuideReply =>
  ({ text, speech: toSpeech(text), lang: r, kind, links, source: "local", ...extra });

/** Intent answers built from content modules. Returns null when no intent applies. */
function intent(q: string, r: Reply): GuideReply | null {
  const t = q.toLowerCase();
  const live = projects.filter((p) => p.kind !== "research");

  // explicit language switch
  if (/^(please )?(speak|talk|reply|answer|bolo|baat karo)?\s*(in )?(hindi|english)( please| mein| me| main| mein bolo)?[.!]*$/i.test(q.trim()) || /^(हिंदी|हिन्दी|अंग्रेज़ी)( में)?( बोलो)?$/.test(q.trim()))
    return reply(r, "answer", L("Sure! I'll reply in English.", "Theek hai! Ab main Hinglish mein jawab dunga.", "ठीक है! अब मैं हिंदी में जवाब दूँगा।", r));

  // Product Universe clusters: "show me Gaurav's healthcare projects", "explore the AI projects"
  const CL: [RegExp, Cluster][] = [[/\bhealth ?(care|tech)?\b|हेल्थ/i, "Healthcare"], [/\b(ai|artificial intelligence)\b/i, "AI"], [/\b(fintech|finance|money|payments?)\b/i, "Fintech"]];
  const cl = /\b(projects?|work|builds?|products?)\b|प्रोजेक्ट/i.test(q) ? CL.find(([re]) => re.test(q)) : undefined;
  if (cl && !/\b(experience|skills?)\b/i.test(q)) {
    const items = worlds.filter((d) => d.cluster === cl[1]);
    const lines = items.map((d) => `• ${d.name}: ${lc(d.category)} (${status(d.status, r)})`).join("\n");
    const name = { Healthcare: ["healthcare", "healthcare", "हेल्थकेयर"], AI: ["AI", "AI", "AI"], Fintech: ["fintech", "fintech", "फ़िनटेक"] }[cl[1] as "Healthcare" | "AI" | "Fintech"];
    return reply(r, "answer", L(`His ${name[0]} work, each with its real status:\n${lines}\nTap one to visit its 3D world.`, `Unka ${name[1]} kaam, asli status ke saath:\n${lines}\nKisi par tap karke uski 3D duniya dekhiye.`, `उनका ${name[2]} काम, असली स्टेटस के साथ:\n${lines}`, r),
      items.map((d) => ({ label: d.name, to: d.worldPath })).slice(0, 4));
  }

  // Emerging Ventures: concepts, never presented as built products
  const vt = ventures.find((v) => new RegExp(v.name.replace(/ /g, "[ -]?"), "i").test(q));
  if (vt && !NAV_VERB.test(q)) {
    return reply(r, "answer", L(
      `${vt.name} is a ${vt.status.toLowerCase()} (${vt.category}): “${vt.vision}” ${vt.solution} ${VENTURES_NOTE} Business-model ideas are ${MODEL_NOTE.toLowerCase()}`,
      `${vt.name} ek early-stage concept hai (${vt.category}): “${vt.vision}” Yeh abhi bana nahi hai, launch nahi hua aur validate nahi hua — koi users ya revenue nahi.`,
      `${vt.name} एक शुरुआती कॉन्सेप्ट है (${vt.category}): “${vt.vision}” यह अभी बना नहीं है, लॉन्च नहीं हुआ और वैलिडेट नहीं हुआ है।`, r),
      [{ label: "Read the concept", to: `/ventures/${vt.slug}` }, { label: `Visit ${vt.name} in 3D`, to: `/ventures/${vt.slug}/world` }]);
  }
  if (/\b(emerging ventures?|ventures?|startup (ideas?|concepts?)|concepts?|what('?s| is) next|next chapter)\b/i.test(q) && !NAV_VERB.test(q)) {
    const lines = ventures.map((v) => `• ${v.name}: ${v.category} — “${v.vision}”`).join("\n");
    return reply(r, "answer", L(`Two concepts in development — not built, launched or validated yet:\n${lines}`, `Do concepts development mein hain — abhi bane nahi, launch ya validate nahi hue:\n${lines}`, `दो कॉन्सेप्ट विकास में हैं — अभी बने नहीं, लॉन्च या वैलिडेट नहीं हुए:\n${lines}`, r),
      [{ label: "Emerging Ventures", to: "/ventures" }, ...ventures.map((v) => ({ label: v.name, to: `/ventures/${v.slug}` }))]);
  }

  // navigation: "open RupeeRadar", "take me to the CV"
  if (has(t, NAV_VERB) || has(q, NAV_VERB)) {
    const page = PAGES.find((p) => p.keys.test(q));
    if (page) return reply(r, "answer", L(`Opening ${page.label} for you.`, `${page.label} khol raha hoon.`, `${page.label} खोल रहा हूँ।`, r), [{ label: page.label, to: page.to }, ...(page.also ? [page.also] : [])], { navigate: page.to });
  }

  // greetings and identity
  if (/^(hi|hii+|hello|hey|hey there|yo|namaste|namaskar|hola)\b[!. ]*$/i.test(q.trim()) || /^(नमस्ते|नमस्कार)/.test(q.trim()))
    return reply(r, "answer", GREETING[r]);
  if (/\b(who are you|what are you|your name|are you gaurav|are you (a )?(bot|ai|human))\b|tum kaun|aap kaun|kaun ho|तुम कौन|आप कौन/i.test(q))
    return reply(r, "answer", L(
      `I'm Oz, the Gaurav.OS AI guide: a little helper that lives on this site. I'm not Gaurav, and I only share what his portfolio verifies. Ask me about his projects, experience or how to reach him!`,
      `Main Oz hoon, Gaurav.OS ka AI guide. Main Gaurav nahi hoon, aur sirf wahi batata hoon jo unke portfolio mein verified hai. Projects, experience ya contact ke baare mein poochiye!`,
      `मैं Oz हूँ, Gaurav.OS का AI गाइड। मैं गौरव नहीं हूँ, और सिर्फ़ वही बताता हूँ जो उनके पोर्टफ़ोलियो में सत्यापित है।`, r));

  // recruiter
  if (/\b(i'?m|i am|as) an? (recruiter|hiring manager|hr)\b|\brecruiter\b|\bhiring\b|recruiter hoon|हायरिंग|रिक्रूटर/i.test(q))
    return reply(r, "answer", L(
      `Welcome! Fastest route: Recruiter Mode has the 30-second overview, role-by-role ordering and the CV on one page. ${profile.name} is ${profile.availability.toLowerCase()}, based in ${profile.location}.`,
      `Welcome! Sabse tez raasta: Recruiter Mode mein 30-second overview aur CV ek hi page par hai. ${profile.name} abhi interview ke liye available hain, ${profile.location} mein.`,
      `स्वागत है! सबसे तेज़ रास्ता: Recruiter Mode में 30 सेकंड का ओवरव्यू और CV एक ही पेज पर है। ${profile.name} अभी इंटरव्यू के लिए उपलब्ध हैं।`, r),
      [{ label: "Recruiter Mode", to: "/recruiter" }, { label: "CV", to: "/cv" }]);

  // projects list (generated from the project data, so it never goes stale)
  if (/\b(projects?|what (has|did) he (build|built|make|made)|built|portfolio work)\b|projects? (kya|kaun)|प्रोजेक्ट/i.test(q) && !/\b(strongest|best)\b/i.test(q)) {
    const lines = live.map((p) => `• ${p.name}: ${lc(p.subtitle)} (${status(p.status, r)})`).join("\n");
    return reply(r, "answer", L(`Here are his ${live.length} projects, each with its real status:\n${lines}`, `Yeh rahe unke ${live.length} projects, har ek apne asli status ke saath:\n${lines}`, `ये रहे उनके ${live.length} प्रोजेक्ट्स, हर एक अपने असली स्टेटस के साथ:\n${lines}`, r),
      [{ label: "Explore my work", to: "/projects" }]);
  }

  // about Gaurav
  if (/\b(tell me about|who is|about) (gaurav|him)\b|\bintroduce\b|gaurav (ke baare|kaun)|गौरव (के बारे|कौन)/i.test(q))
    return reply(r, "answer", L(
      `${profile.name} works across ${profile.cvHeadline.toLowerCase()}, based in ${profile.location}. ${profile.summary.split(". ").slice(0, 2).join(". ")}.`,
      `${profile.name} healthcare product, research aur analytics mein kaam karte hain, ${profile.location} se. Unke paas discovery, delivery aur analytics mein 3+ saal ka anubhav hai, aur unhone Evamastu platform ko PRD se release tak own kiya.`,
      `${profile.name} हेल्थकेयर प्रोडक्ट, रिसर्च और एनालिटिक्स में काम करते हैं। उनके पास डिस्कवरी, डिलीवरी और एनालिटिक्स में 3+ साल का अनुभव है, और उन्होंने Evamastu प्लेटफ़ॉर्म को PRD से रिलीज़ तक संभाला।`, r),
      [{ label: "About", to: "/about" }, { label: "Experience", to: "/experience" }]);

  // product management experience
  if (/\b(product (management )?experience|pm experience|work experience|career|roles?|jobs?)\b|experience (kya|kitna)|अनुभव/i.test(q)) {
    const lines = experience.map((e) => `• ${e.role}, ${e.employer} (${e.period})`).join("\n");
    return reply(r, "answer", L(`His roles so far:\n${lines}\nThe Experience page has the outcomes for each.`, `Ab tak ke roles:\n${lines}\nHar role ke outcomes Experience page par hain.`, `अब तक की भूमिकाएँ:\n${lines}\nहर भूमिका के नतीजे Experience पेज पर हैं।`, r),
      [{ label: "Experience", to: "/experience" }]);
  }

  // AI work
  if (/\b(ai|artificial intelligence|llm|machine learning)\b.*\b(work|experience|projects?|experiments?)\b|\b(ai (kaam|projects?))\b|एआई/i.test(q)) {
    const ai = live.filter((p) => p.categories.includes("AI"));
    const lines = ai.map((p) => `• ${p.name}: ${lc(p.subtitle)} (${status(p.status, r)})`).join("\n");
    return reply(r, "answer", L(`His AI work is about deciding where AI earns its place, with safety designed in:\n${lines}`, `Unka AI kaam safety ke saath design kiya gaya hai:\n${lines}`, `उनका AI काम सुरक्षा को ध्यान में रखकर बनाया गया है:\n${lines}`, r),
      [{ label: "AI Lab", to: "/ai-lab" }]);
  }

  // suitability for PM roles: only verified points
  if (/\b(suitable|why (should we )?hire|good fit|right fit|strengths?)\b|kyun hire|क्यों/i.test(q))
    return reply(r, "answer", L(
      `I can't judge fit for you, but here's what the evidence shows: product ownership of Evamastu from PRD to release, 30+ structured user interviews in research, independent builds with honest status labels, and an AI-enabled PM programme. The case studies let you judge the thinking directly.`,
      `Fit main tay nahi kar sakta, par evidence yeh dikhata hai: Evamastu ka PRD se release tak ownership, 30+ structured user interviews, aur honest status ke saath independent builds. Case studies mein aap unki soch khud dekh sakte hain.`,
      `फ़िट का फ़ैसला मैं नहीं कर सकता, पर सबूत यह दिखाते हैं: Evamastu का PRD से रिलीज़ तक स्वामित्व, 30+ यूज़र इंटरव्यू, और ईमानदार स्टेटस के साथ स्वतंत्र प्रोजेक्ट्स।`, r),
      [{ label: "Case studies", to: "/case-studies" }, { label: "Recruiter Mode", to: "/recruiter" }]);

  // where to see the work
  if (/\b(where can i (see|find)|see his work|show (me )?(his )?work)\b|kaam (kahan|dikhao)|काम कहाँ/i.test(q))
    return reply(r, "answer", L(`Start with "Explore my work" for every project as a chapter, or Recruiter Mode for the one-page overview. The 90 research case studies are in the Research library.`, `"Explore my work" mein har project hai, aur Recruiter Mode mein ek page ka overview. 90 case studies Research library mein hain.`, `"Explore my work" में हर प्रोजेक्ट है, और Recruiter Mode में एक पेज का ओवरव्यू।`, r),
      [{ label: "Explore my work", to: "/projects" }, { label: "Recruiter Mode", to: "/recruiter" }, { label: "Research", to: "/research" }]);

  // newsletter
  if (/\b(newsletter|teardown|write|writing|linkedin posts?)\b/i.test(q))
    return reply(r, "answer", L(`He writes ${newsletter.name}, a ${newsletter.cadence.toLowerCase()} ${newsletter.platform} newsletter on ${newsletter.tagline.toLowerCase()}. ${newsletter.subscribers} subscribers, as he reports it.`, `Woh ${newsletter.name} likhte hain, ${newsletter.platform} par ek weekly newsletter. ${newsletter.subscribers} subscribers, unke bataye anusaar.`, `वे ${newsletter.name} लिखते हैं, ${newsletter.platform} पर एक साप्ताहिक न्यूज़लेटर।`, r),
      newsletter.url ? [{ label: `Subscribe to ${newsletter.name}`, to: newsletter.url }] : []);

  // contact
  if (/\b(contact|reach|email|e-mail|hire him|get in touch|connect)\b|sampark|baat kaise|संपर्क|ईमेल/i.test(q))
    return reply(r, "answer", L(`Email ${profile.contact.email}, or connect on LinkedIn. He's ${profile.availability.toLowerCase()}.`, `Email karein: ${profile.contact.email}, ya LinkedIn par connect karein. Woh abhi interview ke liye available hain.`, `ईमेल करें: ${profile.contact.email}, या LinkedIn पर जुड़ें।`, r),
      [{ label: "Contact", to: "/contact" }, { label: "LinkedIn", to: profile.contact.linkedin }]);

  // education
  if (/\b(education|degree|study|studied|college|university|qualification)\b|padhai|पढ़ाई|शिक्षा/i.test(q)) {
    const lines = education.map((e) => `• ${e.what}, ${e.org} (${e.period})`).join("\n");
    return reply(r, "answer", L(`Education:\n${lines}`, `Padhai:\n${lines}`, `शिक्षा:\n${lines}`, r), [{ label: "About", to: "/about" }]);
  }

  // tools
  if (/\b(tools?|technolog(y|ies)|tech stack|software|stack)\b|kaun se tools|टूल/i.test(q)) {
    const lines = Object.entries(tools).map(([k, v]) => `• ${k}: ${(v as readonly string[]).slice(0, 6).join(", ")}`).join("\n");
    return reply(r, "answer", L(`From his CV:\n${lines}`, `Unke CV se:\n${lines}`, `उनके CV से:\n${lines}`, r), [{ label: "Skills library", to: "/skills" }]);
  }
  return null;
}

const NOTE_EN: Record<Exclude<Reply, "en">, string> = {
  hinglish: "(Yeh verified jawab abhi English mein hai.)",
  hi: "(यह सत्यापित जवाब अभी अंग्रेज़ी में है।)",
};

export function answerLocally(text: string, r: Reply): GuideReply {
  const q = text.trim().slice(0, 500);
  if (!q) return reply(r, "none", L("Ask me anything about Gaurav's work!", "Gaurav ke kaam ke baare mein kuch bhi poochiye!", "गौरव के काम के बारे में कुछ भी पूछिए!", r));
  // 1. refuse unsupported asks before anything else
  if (NO_EVIDENCE_TERMS.some((t) => hasTerm(q, t)) || /revenue|users? count|salary|कमाई|सैलरी|kitna kamate/i.test(q))
    return reply(r, "refused", REFUSAL[r], [{ label: "Contact", to: "/contact" }]);
  // 2. intents built from content data
  const i = intent(q, r);
  if (i) return i;
  // 3. the verified Ask Gaurav answers (English source text)
  const a = ask(q);
  if (a.kind === "refused") return reply(r, "refused", REFUSAL[r], [{ label: "Contact", to: "/contact" }]);
  if (a.kind === "answer") {
    const body = blocksToText(a.entry.answer);
    const text = r === "en" ? body : `${NOTE_EN[r]}\n${body}`;
    return { text, speech: toSpeech(body), lang: r === "en" ? "en" : r, kind: "answer", links: a.entry.links, source: "local" };
  }
  if (a.kind === "related") {
    const links = a.hits.slice(0, 3).map((h) => ({ label: h.title, to: h.to }));
    return reply(r, "related", L("I don't have a short verified answer for that, but these pages are related:", "Iska chhota verified jawab mere paas nahi hai, par yeh pages related hain:", "इसका छोटा सत्यापित जवाब मेरे पास नहीं है, पर ये पेज जुड़े हुए हैं:", r), links);
  }
  return reply(r, "none", REFUSAL[r], [{ label: "Explore my work", to: "/projects" }, { label: "Contact", to: "/contact" }]);
}

export const localBrain: Brain = {
  name: "local",
  async answer({ text, reply: r }) { return answerLocally(text, r); },
};
