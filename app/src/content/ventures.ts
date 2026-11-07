/** Emerging Ventures — early-stage product concepts the owner is developing
 *  (owner's brief, 7 Nov 2026). They are NOT built, launched or validated, so
 *  they live apart from the project library and are never counted as builds.
 *  Every business-model line is a hypothesis; every figure is illustrative. */
export interface Venture {
  slug: string;
  name: string;
  category: string;
  status: "Concept in development";
  vision: string;
  problem: string[];
  solution: string;
  market?: { label: string; items: string[] }[];
  features: { name: string; detail: string }[];
  model: string[];
  example?: { label: string; rows: [string, string][]; note: string };
  trust?: string[];
  openQuestions: string[];
  look: string;
}

export const VENTURES_NOTE = "Early-stage concept. Not built, not launched and not validated: no users, revenue or results exist.";
export const MODEL_NOTE = "Hypotheses, not validated revenue streams.";

export const ventures: Venture[] = [
  {
    slug: "interview-radar",
    name: "Interview Radar",
    category: "HRTech / JobTech",
    status: "Concept in development",
    vision: "Never miss an interview opportunity happening around you.",
    problem: [
      "Job seekers often do not know which companies nearby are organising walk-in interviews, when they are happening or how to apply.",
      "Companies and recruiters struggle to reach suitable candidates for urgent hiring requirements and walk-in drives.",
    ],
    solution: "A centralised platform that helps job seekers discover relevant hiring drives and interview opportunities in real time.",
    market: [
      { label: "Proposed launch market", items: ["Delhi", "Noida", "Ghaziabad", "Gurgaon"] },
      { label: "Target users", items: ["Freshers", "Graduates", "Experienced professionals", "Recruiters", "Companies"] },
    ],
    features: [
      { name: "Live walk-in interviews", detail: "Today, tomorrow and the next seven days." },
      { name: "Virtual interviews", detail: "Online opportunities and registration links." },
      { name: "Company dashboard", detail: "Employers publish hiring drives." },
      { name: "Automated job discovery", detail: "Listings collected from authorised sources and company career pages." },
      { name: "Location-based discovery", detail: "City and distance-based opportunities." },
      { name: "Smart filters", detail: "Experience, salary, qualifications, industry and role." },
      { name: "Interview reminders", detail: "Date, time and location notifications." },
      { name: "Verification", detail: "Controls against fraudulent listings and recruiters." },
    ],
    model: ["Free discovery for job seekers", "Paid company job postings", "Recruiter subscriptions", "Premium enterprise hiring plans"],
    openQuestions: [
      "Which sources may be collected automatically, and on what terms?",
      "How are recruiters and listings verified before they reach job seekers?",
      "Will employers pay for walk-in drive reach before there is candidate supply?",
    ],
    look: "A glass recruitment command centre: live opportunity boards, interview pods and a Delhi NCR map wall.",
  },
  {
    slug: "repass",
    name: "Repass",
    category: "Consumer Marketplace / Recommerce",
    status: "Concept in development",
    vision: "Your Booking, Someone Else's Plan.",
    problem: [
      "A person buys a movie, concert, sports or experience booking and later cannot attend.",
      "The booking becomes unusable, a refund may be unavailable, and the purchase amount is lost.",
    ],
    solution: "A proposed verified resale marketplace where people sell eligible unused bookings to other people — sellers recover some of the value, buyers find more affordable plans.",
    market: [{ label: "Proposed categories", items: ["Movies", "Concerts", "Sports", "Events and shows", "Experiences", "Travel bookings — only where transfer is legally and contractually permitted"] }],
    features: [
      { name: "Sell your booking", detail: "List an eligible unused booking." },
      { name: "Smart resale price suggestions", detail: "A suggested price for a quick sale." },
      { name: "Booking verification", detail: "Check that a booking is real and eligible before it is listed." },
      { name: "Buyer and seller marketplace", detail: "Discovery for buyers, reach for sellers." },
      { name: "Secure payment flow", detail: "Payment held until the booking is transferred." },
      { name: "Official ticket transfer", detail: "Where the original provider supports it." },
      { name: "Last-minute deals", detail: "Bookings close to their date." },
      { name: "An alternative to losing the value", detail: "Eligible resale instead of an unused booking." },
    ],
    model: ["Transaction fee", "Buyer convenience fee", "Featured listings", "Partnerships with ticketing providers and event organisers"],
    example: {
      label: "Illustrative example — not transaction data",
      rows: [["Original ticket price", "₹2,000"], ["Illustrative resale price", "₹1,000"], ["Illustrative buyer saving", "50%"], ["Illustrative seller recovery", "₹1,000"]],
      note: "Numbers chosen to explain the idea. No booking has been resold.",
    },
    trust: [
      "Not every ticket or booking can legally be resold or transferred. Repass would only support bookings where the original provider's terms and the applicable rules permit transfer or resale.",
      "Indian Railways tickets and other restricted bookings are excluded — they cannot be freely resold.",
      "Verification, official transfer and payment protection are core product challenges, not solved problems.",
    ],
    openQuestions: [
      "Which providers permit transfer, and through which official mechanism?",
      "How is a booking verified without access to the provider's systems?",
      "How are disputes handled if a transferred booking fails at the venue?",
    ],
    look: "A digital ticket hall: floating ticket displays, event zones and a verification and trust desk.",
  },
];

export const ventureBySlug = (s: string) => ventures.find((v) => v.slug === s);
