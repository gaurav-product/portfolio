import { newsletter } from "~/content/newsletter";
import { CinematicImage } from "./CinematicImage";
import { ButtonLink, Pill } from "./ui";
import { track } from "~/lib/analytics";

/**
 * Feature block for the owner's newsletter. States only owner-supplied facts: the figures are a dated,
 * self-reported snapshot from his LinkedIn newsletter page (content/newsletter.ts) — never presented as live.
 */
export function NewsletterFeature({ headingLevel = 2 }: { headingLevel?: 2 | 3 }) {
  const H = headingLevel === 2 ? "h2" : "h3";
  const href = newsletter.url ?? newsletter.profileUrl;
  const s = newsletter.snapshot;
  const stats: [string, string][] = [
    [String(s.subscribers), "subscribers"],
    [`+${s.newLast7Days}`, "new in the past 7 days"],
    [String(s.editions), "editions published"],
    [newsletter.cadence, "on LinkedIn"],
  ];
  return (
    <div className="card relative grid overflow-hidden lg:grid-cols-[1.1fr_1fr]" data-testid="newsletter">
      <div aria-hidden="true" className="relative min-h-56 overflow-hidden border-b border-line-soft lg:order-2 lg:border-b-0 lg:border-l">
        <CinematicImage id="brand-the-teardown" decorative sizes="(min-width: 1024px) 40vw, 100vw" className="h-full" imgClassName="h-full object-cover" />
      </div>
      <div className="flex flex-col justify-center p-7 sm:p-10">
        <p className="eyebrow">My newsletter · {newsletter.cadence} on {newsletter.platform}</p>
        <H className="mt-3 text-4xl font-bold sm:text-5xl">{newsletter.name}</H>
        <p className="mt-4 max-w-md text-lg leading-relaxed text-muted">{newsletter.description}</p>
        <p className="mt-4 inline-flex w-fit items-center gap-2 rounded-full border border-green/40 bg-green/10 px-3 py-1 text-sm text-ink" data-testid="newsletter-latest">
          <span aria-hidden className="size-1.5 rounded-full bg-green" />Latest edition published {s.latestPublished}
        </p>
        <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4" data-testid="newsletter-stats">
          {stats.map(([v, l]) => (
            <div key={l} className="rounded-xl border border-line-soft bg-raise/40 px-3 py-2.5">
              <dt className="sr-only">{l}</dt>
              <dd><span className="block font-display text-2xl font-bold leading-none">{v}</span><span className="mt-1 block text-xs text-dim">{l}</span></dd>
            </div>
          ))}
        </dl>
        <p className="mt-3 flex flex-wrap items-center gap-2 text-xs text-dim" data-testid="newsletter-source">
          <Pill tone="amber">{s.verification}</Pill>
          <span>Snapshot as of {s.asOf}, read from my LinkedIn newsletter page. Updated by hand — not a live feed.</span>
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <ButtonLink to={href} external variant="primary" icon="linkedin" onClick={() => track("cta_click", { cta: "newsletter_subscribe" })}
            /* each accessible name starts with the visible text (WCAG 2.5.3, label in name) */
            aria-label={newsletter.url ? `Subscribe on ${newsletter.platform} to ${newsletter.name}` : `Read ${newsletter.name} on ${newsletter.platform}`}>{newsletter.url ? `Subscribe on ${newsletter.platform}` : `Read ${newsletter.name}`}</ButtonLink>
          <ButtonLink to={newsletter.page} external icon="arrow" onClick={() => track("cta_click", { cta: "newsletter_editions" })}
            aria-label={`Read the ${s.editions} editions of ${newsletter.name} on ${newsletter.platform}`}>{`Read the ${s.editions} editions`}</ButtonLink>
        </div>
      </div>
    </div>
  );
}
