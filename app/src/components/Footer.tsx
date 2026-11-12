import { Link } from "react-router";
import { NAV } from "~/content/nav";
import { profile } from "~/content/profile";
import { newsletter } from "~/content/newsletter";
import { Container } from "./ui";
import { Icon } from "./Icon";
import { asset } from "~/lib/meta";

const FOOTER_EXTRA = [
  { to: "/skills", label: "Skills" },
  { to: "/lab-notes", label: "Lab Notes" },
  { to: "/recruiter", label: "Recruiter Mode" },
  { to: "/explore/city", label: "3D city (Explore Mode)" },
] as const;

export function Footer() {
  return (
    <footer className="mt-28 border-t border-line-soft print:hidden">
      <Container wide className="grid gap-12 py-16 md:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <span className="block w-[260px] max-w-full overflow-hidden rounded-2xl border border-line-soft">
            {/* plain picture (not CinematicImage) so the footer never pulls the image manifest into every page */}
            <picture>
              <source type="image/avif" srcSet={`${asset("/cinematic/brand-gaurav-os-logo-480.avif")} 480w, ${asset("/cinematic/brand-gaurav-os-logo-768.avif")} 768w`} sizes="260px" />
              <img src={asset("/cinematic/brand-gaurav-os-logo-480.webp")} srcSet={`${asset("/cinematic/brand-gaurav-os-logo-480.webp")} 480w, ${asset("/cinematic/brand-gaurav-os-logo-768.webp")} 768w`} sizes="260px"
                alt="" aria-hidden="true" width={1536} height={1024} loading="lazy" decoding="async" className="block aspect-[16/9] w-full object-cover" />
            </picture>
          </span>
          <p className="sr-only">{profile.brand}: {profile.brandLine}</p>
          <p className="mt-4 max-w-sm text-sm text-muted">Every figure on this site is traced to the CV or a public repository, and labelled with its evidence status. Where evidence is missing, the page says so.</p>
        </div>
        <nav aria-label="Footer">
          <p className="label mb-3">Site</p>
          {/* NAV already lists Project Worlds, the 3D case studies and Emerging Ventures; only add what it lacks */}
          <ul className="grid grid-cols-2 gap-x-4 text-sm">
            {[...NAV, ...FOOTER_EXTRA].map((n) => <li key={n.to}><Link to={n.to} className="inline-flex min-h-8 items-center text-muted hover:text-ink">{n.label}</Link></li>)}
          </ul>
        </nav>
        <div>
          <p className="label mb-3">Contact</p>
          <ul className="grid gap-2 text-sm">
            <li><a href={`mailto:${profile.contact.email}`} className="inline-flex min-h-7 items-center gap-2 text-muted hover:text-ink"><Icon name="mail" />{profile.contact.email}</a></li>
            <li><a href={profile.contact.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-7 items-center gap-2 text-muted hover:text-ink"><Icon name="linkedin" />LinkedIn</a></li>
            <li><a href={profile.contact.github} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-7 items-center gap-2 text-muted hover:text-ink"><Icon name="github" />GitHub</a></li>
            {newsletter.url && <li><a href={newsletter.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-7 items-center gap-2 text-muted hover:text-ink"><Icon name="mail" />{newsletter.name} newsletter</a></li>}
            <li><a href={asset(profile.cvFile)} download="Gaurav-Kumar-Singh-CV.pdf" className="inline-flex min-h-7 items-center gap-2 text-muted hover:text-ink"><Icon name="download" />Download CV (PDF)</a></li>
          </ul>
        </div>
      </Container>
      <Container wide className="flex flex-wrap justify-between gap-2 border-t border-line-soft py-5 text-xs text-dim">
        <span>© {new Date().getFullYear()} {profile.name}. Content © the author; code MIT.</span>
        <span>Images are labelled illustrations, 3D renders or project artwork, not product screenshots.</span>
      </Container>
    </footer>
  );
}
