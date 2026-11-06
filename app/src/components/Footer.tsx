import { Link } from "react-router";
import { NAV } from "~/content/nav";
import { profile } from "~/content/profile";
import { Container } from "./ui";
import { Wordmark } from "./Header";
import { Icon } from "./Icon";
import { asset } from "~/lib/meta";

export function Footer() {
  return (
    <footer className="mt-28 border-t border-line-soft print:hidden">
      <Container wide className="grid gap-12 py-16 md:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <Wordmark />
          <p className="label mt-3">{profile.brandLine}</p>
          <p className="mt-4 max-w-sm text-sm text-muted">Every figure on this site is traced to the CV or a public repository, and labelled with its evidence status. Where evidence is missing, the page says so.</p>
        </div>
        <nav aria-label="Footer">
          <p className="label mb-3">Site</p>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
            {NAV.map((n) => <li key={n.to}><Link to={n.to} className="text-muted hover:text-ink">{n.label}</Link></li>)}
            <li><Link to="/skills" className="text-muted hover:text-ink">Skills</Link></li>
            <li><Link to="/lab-notes" className="text-muted hover:text-ink">Lab Notes</Link></li>
            <li><Link to="/recruiter" className="text-muted hover:text-ink">Recruiter Mode</Link></li>
            <li><Link to="/explore" className="text-muted hover:text-ink">Explore Mode</Link></li>
          </ul>
        </nav>
        <div>
          <p className="label mb-3">Contact</p>
          <ul className="grid gap-2 text-sm">
            <li><a href={`mailto:${profile.contact.email}`} className="inline-flex min-h-7 items-center gap-2 text-muted hover:text-ink"><Icon name="mail" />{profile.contact.email}</a></li>
            <li><a href={profile.contact.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-7 items-center gap-2 text-muted hover:text-ink"><Icon name="linkedin" />LinkedIn</a></li>
            <li><a href={profile.contact.github} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-7 items-center gap-2 text-muted hover:text-ink"><Icon name="github" />GitHub</a></li>
            <li><a href={asset(profile.cvFile)} download="Gaurav-Kumar-Singh-CV.pdf" className="inline-flex min-h-7 items-center gap-2 text-muted hover:text-ink"><Icon name="download" />Download CV (PDF)</a></li>
          </ul>
        </div>
      </Container>
      <Container wide className="flex flex-wrap justify-between gap-2 border-t border-line-soft py-5 text-xs text-dim">
        <span>© {new Date().getFullYear()} {profile.name}. Content © the author; code MIT.</span>
        <span>Illustrations are original vector artwork, not product screenshots.</span>
      </Container>
    </footer>
  );
}
