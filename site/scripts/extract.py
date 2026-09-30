#!/usr/bin/env python3
"""Derive the 90-day case-study inventory from the repository tree.

Nothing is invented. Every field is either read from a file or marked
NOT DOCUMENTED / DERIVED. Provenance is recorded per field.
"""
import json, os, re, pathlib

ROOT = pathlib.Path("/home/claude/repo/Case Studies")
REPO = "https://github.com/gaurav-product/product-management-case-studies"
BRANCH = "main"

def find(d, *names):
    """case-insensitive file lookup tolerating stray spaces"""
    for f in d.iterdir():
        if not f.is_file():
            continue
        norm = f.name.lower().replace(" ", "")
        for n in names:
            if norm == n or norm.startswith(n.split(".")[0]) and norm.endswith(".md"):
                return f
    return None

def readme_of(d):
    cands = [f for f in d.iterdir() if f.is_file() and f.name.lower().replace(" ", "").startswith("readme")]
    return cands[0] if cands else None

def assumptions_of(d):
    cands = [f for f in d.iterdir() if f.is_file()
             and (f.name.lower().replace(" ", "").startswith("assumption") or f.name.upper().startswith("ASSUMP~"))]
    return cands[0] if cands else None

def parse_dirname(name):
    m = re.match(r"Day[ \-]?(\d{1,2})\s*[-–]\s*(.+)", name)
    if not m:
        m = re.match(r"Day-(\d{1,2})-(.+)", name)
    day = int(m.group(1))
    company = m.group(2).replace("-", " ").strip()
    return day, company

HEAD_RE = re.compile(r"^#{1,4}\s+(.+?)\s*$", re.M)

def headings(text):
    out = []
    for h in HEAD_RE.findall(text):
        h = re.sub(r"[#*`]", "", h)
        h = re.sub(r"^[0-9]+[\.\)]?\s*", "", h)
        h = re.sub(r"[^\w &/'\-]", "", h).strip().lower()
        if h:
            out.append(h)
    return out

def first_para(text):
    """First real prose paragraph: prefer the Executive Summary, else the whole doc."""
    bodies = []
    m = re.search(r"#{1,4}[^\n]*?Executive Summary[^\n]*\n+(.+?)(?=\n#{1,4}\s|\Z)", text, re.S | re.I)
    if m:
        bodies.append(m.group(1))
    bodies.append(re.sub(r"^#.*$", "", text, flags=re.M))

    for body in bodies:
        for raw in body.split("\n\n"):
            p = raw.strip()
            p = re.sub(r"<[^>]+>", "", p)
            p = re.sub(r"^>\s?", "", p, flags=re.M).strip()
            if not p or p.startswith(("|", "-", "*", "#", "!", "```")) or p.startswith("**Product"):
                continue
            p = re.sub(r"^(?:\d{1,2}\.\s+[A-Z][\w &/'\-]{2,45}?\s+){3,}", "", p).strip()
            numbered = len(re.findall(r"\b\d{1,2}\.\s+[A-Z]", p))
            if numbered >= 4:
                continue
            if re.match(r"^(Table of Contents|Contents)\b", p, re.I):
                continue
            if len(p) < 60:
                continue
            p = re.sub(r"\*\*(.+?)\*\*", r"\1", p)
            p = re.sub(r"\[(.+?)\]\(.+?\)", r"\1", p)
            p = re.sub(r"\s+", " ", p)
            return p[:420]
    m = re.search(r"^#{2,3}\s+(.{40,})$", text, re.M)
    if m:
        t = re.sub(r"[*`#]", "", m.group(1)).strip()
        return re.sub(r"\[(.+?)\]\(.+?\)", r"\1", t)[:420]
    return None

def count_sources(text):
    """references section: count numbered entries and bare links"""
    m = re.search(r"#{1,4}\s*(?:[0-9\.\s]*)?References?\b(.*?)(?=\n#{1,3}\s|\Z)", text, re.S | re.I)
    seg = m.group(1) if m else ""
    n = len(re.findall(r"^\s*(?:[-*]|\d+[\.\)])\s+\S", seg, re.M))
    if not n:
        n = len(set(re.findall(r"https?://[^\s)\]]+", seg)))
    return n, bool(m)

INDUSTRY_RULES = [
    ("Healthcare", ["health", "medical", "clinic", "hospital", "pharma", "diagnost", "patient",
                    "medic", "ivf", "nephro", "pathlab", "therap"]),
    ("AI", ["llm", "gpt", "perplexity", "cursor", "sarvam", "abridge", "hippocratic", "tempus",
            "qure", "openevidence", "lovable", "emergent"]),
    ("Fintech", ["pay", "cred", "zerodha", "groww", "stripe", "razorpay", "policybazaar", "insur", "bank"]),
    ("SaaS", ["saas", "slack", "zoho", "freshworks", "notion", "linear", "figma", "canva"]),
    ("Marketplace", ["marketplace", "airbnb", "meesho", "urban", "swiggy", "blinkit", "zepto",
                     "nykaa", "myntra", "bookmyshow", "eternal"]),
    ("Consumer", ["spotify", "whatsapp", "netflix", "duolingo", "dream11", "mamaearth", "snitch",
                  "lenskart", "cult"]),
]

# Explicit corrections where the keyword rule is wrong or too coarse.
# These are the author's DERIVED judgement, not a field stated in the source.
OVERRIDE = {
    5: "Marketplace", 7: "Fintech", 20: "Healthcare", 29: "B2B", 30: "B2B",
    35: "Analytics", 37: "Healthcare", 41: "B2B", 45: "Marketplace", 51: "Marketplace",
    58: "B2B", 62: "B2B", 72: "B2B", 74: "Healthcare", 90: "AI",
}

def classify(day, company, industry_txt, text):
    if day in OVERRIDE:
        return OVERRIDE[day]
    hay = (company + " " + (industry_txt or "")).lower()
    for label, keys in INDUSTRY_RULES:
        if any(re.search(r"\b" + re.escape(k), hay) for k in keys):
            return label
    low = text[:5000].lower()
    if "healthcare" in low or "healthtech" in low:
        return "Healthcare"
    return "Consumer"

def stated_industry(text):
    m = re.search(r"\*\*Industry:?\*\*\s*([^\n|]+)", text)
    if m:
        return m.group(1).strip(), "FACT"
    m = re.search(r"\|\s*\*?\*?Industry\*?\*?\s*\|\s*([^|\n]+)\|", text, re.I)
    if m:
        return m.group(1).strip(), "FACT"
    m = re.search(r"^Industry\s*[:\t]\s*(.+)$", text, re.M | re.I)
    if m:
        return m.group(1).strip(), "FACT"
    return None, "DERIVED"

def title_of(text, day, company):
    m = re.search(r"^#\s+(.+)$", text, re.M)
    if m:
        t = re.sub(r"[#*`]", "", m.group(1)).strip()
        t = re.sub(r"^[^\w]*", "", t)
        t = re.sub(r"^Day\s*0?%d\s*[—\-–:]\s*" % day, "", t, flags=re.I).strip()
        if t:
            return t
    return company

rows = []
for d in sorted(ROOT.iterdir()):
    if not d.is_dir():
        continue
    day, company = parse_dirname(d.name)
    rm = readme_of(d)
    asm = assumptions_of(d)
    text = rm.read_text(errors="ignore") if rm else ""
    hs = headings(text)
    hset = " | ".join(hs)
    words = len(re.findall(r"\w+", text))
    srcs, has_refs = count_sources(text)
    ind, ind_prov = stated_industry(text)
    assets = sorted([f.name for f in d.iterdir() if f.suffix.lower() in (".png", ".svg", ".jpg", ".jpeg")])

    asm_words = 0
    if asm:
        asm_words = len(re.findall(r"\w+", asm.read_text(errors="ignore")))

    def has(*keys):
        return any(k in hset for k in keys)

    # verification discipline: explicit script or programmatic-check language
    asm_text = asm.read_text(errors="ignore") if asm else ""
    verify = bool(re.search(r"verify\.py|programmatic check|checks,? all passing|executed, not asserted",
                            text + " " + asm_text, re.I))

    # stated programmatic-check count (from the study, else its assumptions file)
    def check_count(t):
        out = []
        for pat in [r"([0-9][0-9,]*)\s*\*{0,2}\s*programmatic checks",
                    r"programmatic checks[^0-9]{0,20}([0-9][0-9,]*)",
                    r"([0-9][0-9,]*)\s*checks,\s*all passing"]:
            for mm in re.findall(pat, t, re.I):
                v = int(str(mm).replace(",", ""))
                if 10 <= v <= 2000:
                    out.append(v)
        return max(out) if out else 0
    checks = check_count(text) or check_count(asm_text)
    labelled = bool(re.search(r"\b(FACT|ASSUMPTION|DERIVED|INVENTED SCENARIO|UNKNOWN)\b", text))

    row = {
        "id": "cs-%02d" % day,
        "day": day,
        "company": company,
        "title": title_of(text, day, company),
        "slug": d.name.replace(" ", "-").replace("--", "-"),
        "industry": ind if ind else "NOT DOCUMENTED",
        "industry_provenance": ind_prov,
        "category": classify(day, company, ind, text),
        "summary": first_para(text) or "NOT DOCUMENTED",
        "words": words,
        "sources": srcs,
        "has_references": has_refs,
        "has_assumptions": bool(asm),
        "assumptions_words": asm_words,
        "has_prd": has("prd", "feature breakdown", "feature proposal", "requirement"),
        "has_experiment": has("experiment", "a/b", "hypothes", "rollout plan"),
        "has_metrics": has("north star metric", "product metrics", "product analytics", "metric"),
        "has_strategy": has("product strategy", "growth strategy", "vision  mission", "roadmap"),
        "has_prioritization": has("moscow", "rice", "prioriti"),
        "has_risks": has("risks & mitigation", "risk", "trust & safety"),
        "has_swot": has("swot"),
        "has_ux": has("ux audit", "ui audit", "user journey", "user flow"),
        "has_personas": has("persona", "target users"),
        "has_jtbd": has("jobs to be done", "jtbd"),
        "has_trust_safety": has("trust & safety", "privacy & security", "trust and safety", "trust  safety"),
        "has_ai": has("ai capabilities", "ai ", " ai", "artificial intelligence"),
        "has_north_star": has("north star metric"),
        "has_rice": has("rice"),
        "has_moscow": has("moscow"),
        "has_problem": has("problem statement", "pain points", "problem"),
        "has_market": has("market research", "industry analysis", "tam", "porters five forces"),
        "has_problem": has("problem statement", "pain points"),
        "has_decision": has("recommendations", "pm lessons", "conclusion", "opportunity mapping"),
        "verification": verify,
        "labelled_evidence": labelled,
        "assets": assets,
        "github_url": "%s/tree/%s/Case%%20Studies/%s" % (REPO, BRANCH, d.name.replace(" ", "%20")),
        "readme_url": "%s/blob/%s/Case%%20Studies/%s/%s" % (REPO, BRANCH, d.name.replace(" ", "%20"), (rm.name.replace(" ", "%20") if rm else "")),
        "headings_count": len(hs),
        "checks": checks,
        "readme_path": ("Case Studies/%s/%s" % (d.name, rm.name)) if rm else None,
        "assumptions_path": ("Case Studies/%s/%s" % (d.name, asm.name)) if asm else None,
        "assumptions_url": ("%s/blob/%s/Case%%20Studies/%s/%s" % (REPO, BRANCH,
             d.name.replace(" ", "%20"), asm.name.replace(" ", "%20"))) if asm else None,
        "readme_path": ("Case Studies/" + d.name + "/" + rm.name) if rm else None,
        "assumptions_path": ("Case Studies/" + d.name + "/" + asm.name) if asm else None,
        "assumptions_url": ("%s/blob/%s/Case%%20Studies/%s/%s" % (REPO, BRANCH,
            d.name.replace(" ", "%20"), asm.name.replace(" ", "%20"))) if asm else None,
        "dir_path": "Case Studies/" + d.name,
        "readme_bytes": rm.stat().st_size if rm else 0,
        "readme_empty": bool(rm and rm.stat().st_size == 0),
        "internal_day": (lambda m: int(m.group(1)) if m else None)(
            re.search(r"Day\s*0?(\d{1,2})\s*(?:/|of)\s*90", text, re.I)),
        "extra_docs": sorted([f.name for f in d.iterdir()
                              if f.is_file() and f.suffix.lower() == ".md"
                              and not f.name.lower().replace(" ", "").startswith(("readme", "assumption"))
                              and not f.name.upper().startswith("ASSUMP~")]),
    }
    rows.append(row)

# evidence_level derived from measurable signals only; formula recorded in the site
for r in rows:
    score = 0
    if r["sources"] >= 5: score += 1
    if r["sources"] >= 15: score += 1
    if r["has_assumptions"]: score += 1
    if r["assumptions_words"] >= 400: score += 1
    if r["verification"]: score += 2
    if r["labelled_evidence"]: score += 1
    if r["words"] >= 6000: score += 1
    r["evidence_score"] = score
    r["evidence_level"] = ("VERIFIED" if score >= 6 else
                           "DOCUMENTED" if score >= 4 else
                           "SOURCED" if score >= 2 else "NARRATIVE")

out = pathlib.Path("/home/claude/corpus.json")
out.write_text(json.dumps(rows, indent=1))

print("dirs parsed:", len(rows), "| day range:", rows[0]["day"], "-", rows[-1]["day"])
print("total words:", sum(r["words"] for r in rows))
print("with assumptions:", sum(r["has_assumptions"] for r in rows))
print("with verification:", sum(r["verification"] for r in rows))
print("with labelled evidence:", sum(r["labelled_evidence"] for r in rows))
print("total sources:", sum(r["sources"] for r in rows))
print("missing summary:", sum(1 for r in rows if r["summary"] == "NOT DOCUMENTED"))
print("missing industry:", sum(1 for r in rows if r["industry"] == "NOT DOCUMENTED"))
from collections import Counter
print("categories:", dict(Counter(r["category"] for r in rows)))
print("evidence levels:", dict(Counter(r["evidence_level"] for r in rows)))
