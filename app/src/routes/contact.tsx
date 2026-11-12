import { newsletter } from "~/content/newsletter";
import { heroArt } from "~/components/CinematicImage";
import { useState } from "react";
import { profile } from "~/content/profile";
import { PageHero, Container, ButtonLink, Button } from "~/components/ui";
import { Icon } from "~/components/Icon";
import { seo, asset } from "~/lib/meta";
import { track } from "~/lib/analytics";

export const meta = () => seo("Contact", `Contact ${profile.name}: email, LinkedIn, GitHub and CV.`, "/contact");

/** No backend and no data collection: the form validates, then opens the
 *  visitor's own email app with the message prefilled. It says so. */
export default function Contact() {
  const [form, setForm] = useState({ name: "", org: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const er: Record<string, string> = {};
    if (form.name.trim().length < 2) er.name = "Please enter your name.";
    if (form.message.trim().length < 10) er.message = "Please write at least 10 characters.";
    setErrors(er);
    if (Object.keys(er).length) { document.getElementById(`c-${Object.keys(er)[0]}`)?.focus(); return; }
    const subject = `Portfolio enquiry from ${form.name.trim()}${form.org.trim() ? ` (${form.org.trim()})` : ""}`;
    track("contact_click", { via: "form" });
    window.location.href = `mailto:${profile.contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(form.message.trim())}`;
    setSent(true);
  };
  const copy = async () => {
    try { await navigator.clipboard.writeText(profile.contact.email); setCopied(true); setTimeout(() => setCopied(false), 2500); } catch { setCopied(false); }
  };

  return (
    <>
      <PageHero {...heroArt("render-contact")} eyebrow="Contact" title="Let’s build something useful." intro={`${profile.availability}. Email is the fastest route.`} />
      <Container className="grid gap-10 py-14 lg:grid-cols-[1fr_1.1fr]">
        <section aria-labelledby="direct" className="grid content-start gap-3">
          <h2 id="direct" className="label mb-1">Direct</h2>
          <div className="card flex flex-wrap items-center justify-between gap-3 p-5">
            <a href={`mailto:${profile.contact.email}`} onClick={() => track("contact_click", { via: "email" })} className="inline-flex min-w-0 items-center gap-3 text-lg hover:text-green"><Icon name="mail" className="shrink-0" /><span className="min-w-0 [overflow-wrap:anywhere]">{profile.contact.email}</span></a>
            <Button onClick={copy} icon="copy" aria-live="polite">{copied ? "Copied" : "Copy email"}</Button>
          </div>
          <a href={profile.contact.linkedin} target="_blank" rel="noopener noreferrer" className="card card-link flex items-center gap-3 p-5"><Icon name="linkedin" />{profile.contact.linkedinLabel}<Icon name="external" size={14} className="ml-auto text-dim" /></a>
          <a href={profile.contact.github} target="_blank" rel="noopener noreferrer" className="card card-link flex items-center gap-3 p-5"><Icon name="github" />{profile.contact.githubLabel}<Icon name="external" size={14} className="ml-auto text-dim" /></a>
          {newsletter.url && <a href={newsletter.url} target="_blank" rel="noopener noreferrer" className="card card-link flex items-center gap-3 p-5"><Icon name="mail" /><span>Subscribe to {newsletter.name} <span className="text-dim">· {newsletter.cadence.toLowerCase()} on {newsletter.platform}</span></span><Icon name="external" size={14} className="ml-auto text-dim" /></a>}
          <div className="mt-3 flex flex-wrap gap-3">
            <ButtonLink to={asset(profile.cvFile)} download="Gaurav-Kumar-Singh-CV.pdf" variant="primary" icon="download" onClick={() => track("cv_downloaded", { from: "contact" })}>Download CV (PDF)</ButtonLink>
            <ButtonLink to="/cv" icon="arrow">View CV online</ButtonLink>
          </div>
          <p className="text-sm text-dim">The public CV omits the phone number. It is shared on request.</p>
        </section>

        <section aria-labelledby="compose" className="card p-6">
          <h2 id="compose" className="font-display text-2xl font-bold">Write a message</h2>
          <p className="mt-1 text-sm text-muted">This opens your email app with the message ready to send. Nothing is stored or sent by this site.</p>
          <form noValidate onSubmit={submit} className="mt-6 grid gap-4">
            {([["name", "Your name", "text", true], ["org", "Company or team (optional)", "text", false]] as const).map(([k, l, t, req]) => (
              <div key={k}>
                <label htmlFor={`c-${k}`} className="mb-1.5 block text-sm font-medium">{l}</label>
                <input id={`c-${k}`} type={t} value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} required={req} maxLength={120}
                  aria-invalid={!!errors[k]} aria-describedby={errors[k] ? `c-${k}-err` : undefined} className="field" autoComplete={k === "name" ? "name" : "organization"} />
                {errors[k] && <p id={`c-${k}-err`} className="mt-1 text-sm text-red">{errors[k]}</p>}
              </div>
            ))}
            <div>
              <label htmlFor="c-message" className="mb-1.5 block text-sm font-medium">Message</label>
              <textarea id="c-message" rows={6} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required maxLength={3000}
                aria-invalid={!!errors.message} aria-describedby={errors.message ? "c-message-err" : undefined} className="field" />
              {errors.message && <p id="c-message-err" className="mt-1 text-sm text-red">{errors.message}</p>}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button type="submit" className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-green px-5 font-semibold text-green-ink hover:bg-[#8cebb2]"><Icon name="mail" />Open in my email app</button>
              <button type="button" onClick={() => { setForm({ name: "", org: "", message: "" }); setErrors({}); setSent(false); }} className="min-h-11 rounded-xl px-4 text-muted hover:text-ink">Clear</button>
            </div>
            {sent && <p role="status" className="text-sm text-green">Your email app should now be open with the message. If nothing happened, email {profile.contact.email} directly.</p>}
          </form>
        </section>
      </Container>
    </>
  );
}
