import { profile } from "~/content/profile";
/** Per-route SEO metadata. SITE_URL is set at build time for canonical/OG URLs. */
export const SITE_URL = (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(/\/$/, "") || "";
export const BASE = (import.meta.env.BASE_URL || "/").replace(/\/$/, "");
export const asset = (p: string) => BASE + p;

/** Search snippets read best between 50 and 160 characters: short descriptions gain the site
 *  context, long ones are cut at a word boundary. Content itself is never rewritten. */
export function fitDescription(d: string) {
  let out = d.trim().replace(/\s+/g, " ");
  if (out.length < 50) out = `${out.replace(/[.\s]*$/, "")}. From ${profile.name}'s product, AI and research portfolio.`;
  if (out.length > 160) out = out.slice(0, 157).replace(/[\s,;:—-]+\S*$/, "") + "…";
  return out;
}
/** `image`: a site-relative social card (e.g. "/og/careconnect.png"); defaults to the site-wide card. */
export function seo(title: string, rawDescription: string, path: string, image = "/og-default.png") {
  const description = fitDescription(rawDescription);
  const branded = `${title} · ${profile.brand}`;
  // titles over ~65 characters get truncated in results; long ones drop the brand suffix
  const full = title === profile.brand ? `${profile.name} — ${profile.brandLine} | ${profile.brand}` : branded.length > 65 ? title : branded;
  const tags: Record<string, string>[] = [
    { title: full },
    { name: "description", content: description },
    { property: "og:type", content: "website" },
    { property: "og:site_name", content: profile.brand },
    { property: "og:title", content: full },
    { property: "og:description", content: description },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: full },
    { name: "twitter:description", content: description },
  ];
  if (SITE_URL) {
    tags.push({ property: "og:url", content: SITE_URL + path }, { property: "og:image", content: SITE_URL + image },
      { name: "twitter:image", content: SITE_URL + image }, { tagName: "link", rel: "canonical", href: SITE_URL + path });
  }
  return tags;
}

/** schema.org Person + WebSite for the home page. Only public, approved
 *  identity facts: name, brand, positioning, city, email and profile links. */
export function structuredData() {
  const home = SITE_URL ? SITE_URL + "/" : undefined;
  return {
    "script:ld+json": {
      "@context": "https://schema.org",
      "@graph": [
        { "@type": "Person", "@id": home ? home + "#person" : "#person", name: profile.name,
          description: profile.seoDescription, url: home,
          email: `mailto:${profile.contact.email}`, address: { "@type": "PostalAddress", addressLocality: "New Delhi", addressCountry: "IN" },
          sameAs: [profile.contact.linkedin, profile.contact.github], knowsAbout: ["Product Management", "AI Product Development", "Healthcare Technology", "User Research", "Product Analytics"] },
        { "@type": "WebSite", name: profile.brand, alternateName: `${profile.brand} — ${profile.brandLine}`, url: home, description: profile.tagline,
          author: { "@id": home ? home + "#person" : "#person" } },
      ],
    },
  };
}
