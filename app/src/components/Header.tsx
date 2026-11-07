import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router";
import { NAV, PRIMARY_NAV } from "~/content/nav";
import { profile } from "~/content/profile";
import { Icon } from "./Icon";
import { cx } from "./ui";
import { useSearch } from "./Search";
import { asset } from "~/lib/meta";
import { track } from "~/lib/analytics";

export function Wordmark({ className = "" }: { className?: string }) {
  return <span className={cx("font-display text-[22px] font-bold tracking-tight", className)}>Gaurav<span className="text-green">.OS</span></span>;
}

export function Header() {
  const [open, setOpen] = useState(false);
  const { openSearch } = useSearch();
  const loc = useLocation();
  const drawerRef = useRef<HTMLDivElement>(null);
  const menuBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => setOpen(false), [loc.pathname]);
  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    drawerRef.current?.querySelector<HTMLElement>("a,button")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "Tab" && drawerRef.current) {
        const f = drawerRef.current.querySelectorAll<HTMLElement>("a,button");
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; (prev ?? menuBtn.current)?.focus(); };
  }, [open]);

  const navCls = ({ isActive }: { isActive: boolean }) =>
    cx("relative whitespace-nowrap px-3 py-2 text-[14px] transition-colors", isActive ? "text-ink after:absolute after:inset-x-3 after:-bottom-[21px] after:h-px after:bg-green" : "text-muted hover:text-ink");

  return (
    <header className="sticky top-0 z-40 border-b border-line-soft/80 bg-bg/80 backdrop-blur-xl print:hidden">
      <div className="mx-auto flex h-[72px] max-w-[1440px] items-center gap-4 px-4 sm:px-6 lg:px-10">
        <Link to="/" aria-label={`${profile.brand} — home`} className="shrink-0"><Wordmark /></Link>
        <nav aria-label="Primary" className="ml-6 hidden lg:flex items-center">
          {PRIMARY_NAV.map((n) => <NavLink key={n.to} to={n.to} className={navCls}>{n.label}</NavLink>)}
        </nav>
        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          <button type="button" onClick={openSearch} aria-label="Search the portfolio" aria-keyshortcuts="Control+K /" title="Search (Ctrl K)"
            className="inline-flex size-10 items-center justify-center rounded-full text-muted transition-colors hover:bg-raise hover:text-ink"><Icon name="search" /></button>
          <Link to="/recruiter" data-magnetic onClick={() => track("recruiter_mode_opened")} aria-label="Recruiter Mode" title="Recruiter Mode"
            className="inline-flex h-10 items-center gap-2 rounded-full px-3 text-sm text-muted transition-colors hover:bg-raise hover:text-ink"><Icon name="recruiter" /><span className="hidden xl:inline whitespace-nowrap">Recruiter Mode</span></Link>
          <a href={asset(profile.cvFile)} download="Gaurav-Kumar-Singh-CV.pdf" data-magnetic onClick={() => track("cv_downloaded")} className="hidden md:inline-flex h-10 items-center gap-2 rounded-full bg-ink px-4 text-sm font-semibold text-bg transition-colors hover:bg-white"><Icon name="download" size={16} />CV</a>
          <button ref={menuBtn} type="button" onClick={() => setOpen(true)} aria-expanded={open} aria-controls="nav-drawer" aria-label="Open menu" title="Menu"
            className="inline-flex size-10 items-center justify-center rounded-full border border-line text-ink transition-colors hover:bg-raise"><Icon name="menu" /></button>
        </div>
      </div>
      {open && (
        <div className="fixed inset-0 z-50">
          <button type="button" aria-label="Close menu" tabIndex={-1} className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <div ref={drawerRef} id="nav-drawer" role="dialog" aria-modal="true" aria-label="Site menu"
            onClick={(e) => { if ((e.target as HTMLElement).closest("a")) setOpen(false); /* also closes on the current page's link */ }}
            className="absolute right-0 top-0 flex h-dvh w-[min(360px,88vw)] flex-col overflow-y-auto border-l border-line bg-surface p-5">
            <div className="mb-4 flex items-center justify-between">
              <Wordmark />
              <button type="button" onClick={() => setOpen(false)} aria-label="Close menu" className="inline-flex size-10 items-center justify-center rounded-full border border-line hover:bg-raise"><Icon name="close" /></button>
            </div>
            <nav aria-label="Mobile">
              <ul className="grid gap-1">
                {NAV.map((n) => (
                  <li key={n.to}><NavLink to={n.to} end={n.to === "/"} className={({ isActive }) => cx("flex min-h-12 items-center rounded-lg px-3 text-[17px]", isActive ? "bg-raise text-green" : "text-ink hover:bg-raise")}>{n.label}</NavLink></li>
                ))}
              </ul>
            </nav>
            <div className="mt-6 grid gap-2 border-t border-line pt-5">
              <Link to="/recruiter" className="flex min-h-12 items-center gap-3 rounded-lg px-3 hover:bg-raise"><Icon name="recruiter" />Recruiter Mode</Link>
              <Link to="/skills" className="flex min-h-12 items-center gap-3 rounded-lg px-3 hover:bg-raise"><Icon name="product" />Skills library</Link>
              <Link to="/ask" className="flex min-h-12 items-center gap-3 rounded-lg px-3 hover:bg-raise"><Icon name="ask" />Ask Gaurav</Link>
              <a href={asset(profile.cvFile)} download="Gaurav-Kumar-Singh-CV.pdf" className="mt-2 flex min-h-12 items-center justify-center gap-2 rounded-full bg-green font-semibold text-green-ink"><Icon name="download" />Download CV</a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
