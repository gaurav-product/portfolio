/** The owner's newsletter. Only what the owner has stated is shown: name, platform, cadence and the
 *  self-reported subscriber count. `url` is LinkedIn's subscribe page for it; without one, readers are
 *  sent to the LinkedIn profile, where the newsletter is listed. */
export const newsletter = {
  name: "The Teardown",
  platform: "LinkedIn",
  cadence: "Weekly",
  subscribers: "674",
  subscribersNote: "self-reported, Nov 2026",
  url: "https://www.linkedin.com/build-relation/newsletter-follow?entityUrn=7488215816266584064" as string | null, // LinkedIn subscribe page, supplied by Gaurav
  profileUrl: "https://www.linkedin.com/in/gaurav-singh-product",
} as const;
