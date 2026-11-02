/** Identity and positioning. Facts: Healthcare CV (Nov 2026). Positioning
 *  line: owner's brief. No phone number anywhere in public code. */
export const profile = {
  name: "Gaurav Kumar Singh",
  brand: "Gaurav.OS",
  brandLine: "Product × AI × Building",
  headline: "Product Management · AI Product Development · Healthcare Technology · Research & Analytics",
  cvHeadline: "Healthcare Product, Research and Analytics",
  intro:
    "I build digital products by combining product discovery, user research, analytical thinking, technology and responsible AI.",
  summary:
    "Health and wellness product and research professional with 3+ years across discovery, delivery and analytics. Owned a digital mindfulness platform end to end, PRD through release, where cohort analysis across 50+ participant groups drove a 20–25% lift in user consistency. Ran 30+ structured user interviews for a US wellness company and led its product research, competitive analysis and A/B testing. Builds health products with safety designed in: a post-discharge care record, a non-diagnostic health platform with 8 consented practitioners, and a self-care app gated by a 214-case safety test suite.",
  location: "New Delhi, India",
  availability: "Available to interview immediately",
  roles: [
    "Associate Product Manager", "Product Manager", "Product Analyst", "AI Product Manager",
    "Product Operations", "Product Research", "Healthcare Product", "Digital Health / HealthTech",
    "Product Strategy & Growth",
  ],
  capabilityTags: [
    "Product Management", "Product Discovery", "AI Product Development", "Healthcare Technology",
    "User Research", "Product Analytics", "Product Strategy",
  ],
  contact: {
    email: "gauravkumarsingh773@gmail.com",
    linkedin: "https://www.linkedin.com/in/gaurav-singh-product",
    linkedinLabel: "linkedin.com/in/gaurav-singh-product",
    github: "https://github.com/gaurav-product",
    githubLabel: "github.com/gaurav-product",
  },
  cvFile: "/media/gaurav-kumar-singh-cv.pdf",
  /** Replaceable portrait. Set src to a new file (and update provenance) to swap
   *  in an original photograph; set src to null to show the brand mark instead. */
  portrait: {
    src: "/media/portrait/gaurav-portrait-provisional.webp" as string | null,
    alt: "Gaurav Kumar Singh",
    provenance: "Provisional — cropped from Gaurav.OS artwork supplied by Gaurav; to be replaced with an original photograph.",
    width: 370, height: 370,
  },
} as const;

/** Homepage highlights. Each figure is defined precisely and sourced. */
export const highlights = [
  {
    value: "3+ years", label: "Product & research experience",
    definition: "Sep 2022 – Apr 2026: research role at Live Your Best Life (USA), then PM internship and APM role at Adhyatm Sadhna Kendra.",
    source: "cv",
  },
  {
    value: "30+", label: "Structured user interviews",
    definition: "Conducted at Live Your Best Life (USA), 2022–2024. A further 20+ discovery interviews were run for Aaroh.",
    source: "cv",
  },
  {
    value: "20–25%", label: "Lift in user consistency",
    definition: "Evamastu, within 6 weeks of the onboarding redesign that followed cohort analysis across 50+ participant cohorts.",
    source: "cv",
  },
  {
    value: "90", label: "Published product case studies",
    definition: "Daily case studies, Jul–Sep 2026, in a public repository. 90 directories, 90 written.",
    source: "repo-corpus",
  },
] as const;
