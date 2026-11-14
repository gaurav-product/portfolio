/** The owner's newsletter. Only what the owner has stated or shown is used.
 *
 *  There is no live data connection: LinkedIn offers no public API for newsletter statistics. The figures
 *  below are a MANUALLY MAINTAINED snapshot, read from Gaurav's own LinkedIn newsletter page as shown in his
 *  screen recording of 10 Nov 2026. They are self-reported (not independently verified) and are always shown
 *  with their date and source. To update: change `snapshot` (and its `asOf`) — nothing else is needed.
 *
 *  `url` is LinkedIn's subscribe page; `page` is the newsletter's public page (its editions). */
export const newsletter = {
  name: "The Teardown",
  platform: "LinkedIn",
  cadence: "Weekly",
  tagline: "Products, strategy and lessons", // from the newsletter's own logo
  /** the newsletter's own description on LinkedIn */
  description: "One product taken apart every week. What broke, why it broke, and what I would ship next as a PM.",
  subscribers: "806",
  subscribersNote: "self-reported, 10 Nov 2026",
  url: "https://www.linkedin.com/build-relation/newsletter-follow?entityUrn=7488215816266584064" as string | null, // LinkedIn subscribe page, supplied by Gaurav
  page: "https://www.linkedin.com/newsletters/7488215816266584064/", // the newsletter page (seen in the 10 Nov 2026 recording)
  profileUrl: "https://www.linkedin.com/in/gaurav-singh-product",
  snapshot: {
    asOf: "10 Nov 2026",
    subscribers: 806,
    /** "7 new subscribers · past 7 days", as LinkedIn showed it to the author */
    newLast7Days: 7,
    editions: 10,
    /** LinkedIn showed the latest edition as "Published 4 days ago" on 10 Nov 2026 */
    latestPublished: "about 6 Nov 2026",
    source: "Gaurav's LinkedIn newsletter page, as shown in his screen recording of 10 Nov 2026",
    verification: "Self-reported",
  },
} as const;
