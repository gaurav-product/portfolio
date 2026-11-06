import { newsletter } from "~/content/newsletter";
import { CinematicImage } from "./CinematicImage";
import { ButtonLink, Pill } from "./ui";
import { track } from "~/lib/analytics";

/** Feature block for the owner's newsletter. States only the owner-supplied facts. */
export function NewsletterFeature({ headingLevel = 2 }: { headingLevel?: 2 | 3 }) {
  const H = headingLevel === 2 ? "h2" : "h3";
  const href = newsletter.url ?? newsletter.profileUrl;
  return (
    <div className="card relative grid overflow-hidden lg:grid-cols-[1.1fr_1fr]" data-testid="newsletter">
      <div aria-hidden="true" className="relative min-h-56 overflow-hidden border-b border-line-soft lg:order-2 lg:border-b-0 lg:border-l">
        <CinematicImage id="render-teardown" decorative sizes="(min-width: 1024px) 40vw, 100vw" className="h-full" imgClassName="h-full object-cover" />
        <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-surface/80 via-transparent to-transparent lg:bg-gradient-to-r" />
      </div>
      <div className="flex flex-col justify-center p-7 sm:p-10">
        <p className="eyebrow">My newsletter · {newsletter.cadence} on {newsletter.platform}</p>
        <H className="mt-3 text-4xl font-bold sm:text-5xl">{newsletter.name}</H>
        <p className="mt-4 max-w-md text-lg leading-relaxed text-muted">A {newsletter.cadence.toLowerCase()} newsletter I write and publish on {newsletter.platform}.</p>
        <p className="mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-2">
          <span className="font-display text-4xl font-bold">{newsletter.subscribers}</span>
          <span className="text-muted">subscribers</span>
          <Pill tone="amber">Self-reported</Pill>
          <span className="w-full text-xs text-dim">As reported by Gaurav ({newsletter.subscribersNote.replace("self-reported, ", "")}).</span>
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <ButtonLink to={href} external variant="primary" icon="linkedin" onClick={() => track("cta_click", { cta: "newsletter_subscribe" })}
            aria-label={`Subscribe on ${newsletter.platform} to ${newsletter.name}`}>{newsletter.url ? `Subscribe on ${newsletter.platform}` : `Read ${newsletter.name}`}</ButtonLink>
        </div>
        {!newsletter.url && <p className="mt-3 text-xs text-dim">Opens my LinkedIn profile, where the newsletter is listed.</p>}
      </div>
    </div>
  );
}
