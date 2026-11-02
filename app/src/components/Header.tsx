import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router";
import { NAV } from "~/content/nav";
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
    cx("relative whitespace-nowrap px-2 min-[1600px]:px-2.5 py-2 text-[14px] rounded-lg transition-colors", isActive ? "text-ink after:absolute after:inset-x-2 after:-bottom-[13px] after:h-0.5 after:bg-green" : "text-muted hover:text-ink");

  return (
    <header className="sticky top-0 z-40 border-b border-line-soft bg-bg/85 backdrop-blur-md print:hidden">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center gap-3 px-4 sm:px-6 lg:px-8">
        <Link to="/" aria-label={`${profile.brand} — home`} className="mr-2 shrink-0"><Wordmark /></Link>
        <nav aria-label="Primary" className="hidden min-[1440px]:flex items-center gap-0.5">
          {NAV.map((n) => <NavLink key={n.to} to={n.to} end={n.to === "/"} className={navCls}>{n.label}</NavLink>)}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <button type="button" onClick={openSearch} aria-label="Search the portfolio" aria-keyshortcuts="Control+K /"
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-line px-3 text-muted hover:text-ink hover:border-green/60">
            <Icon name="search" /><span className="hidden lg:inline min-[1440px]:hidden min-[1600px]:inline text-sm">Search</span><kbd className="hidden lg:inline min-[1440px]:hidden min-[1600px]:inline font-mono text-[11px] text-dim">⌘K</kbd>
          </button>
          <Link to="/explore" onClick={() => track("explore_mode_opened")} aria-label="Explore Mode" className="hidden sm:inline-flex h-10 items-center gap-2 rounded-lg border border-line px-3 text-sm text-muted hover:text-ink hover:border-green/60"><Icon name="explore" /><span className="min-[1440px]:hidden min-[1600px]:inline">Explore</span></Link>
          <Link to="/recruiter" onClick={() => track("recruiter_mode_opened")} className="inline-flex h-10 items-center gap-2 rounded-lg border border-line px-3 text-sm text-ink hover:border-green/60" aria-label="Recruiter Mode"><Icon name="recruiter" /><span className="hidden md:inline min-[1440px]:hidden min-[1600px]:inline whitespace-nowrap">Recruiter Mode</span></Link>
          <a href={asset(profile.cvFile)} download="Gaurav-Kumar-Singh-CV.pdf" onClick={() => track("cv_downloaded")} className="hidden md:inline-flex h-10 items-center gap-2 rounded-lg bg-green px-3 text-sm font-semibold text-green-ink hover:bg-[#7dff7d]"><Icon name="download" />CV</a>
          <button ref={menuBtn} type="button" onClick={() => setOpen(true)} aria-expanded={open} aria-controls="nav-drawer" aria-label="Open menu"
            className="min-[1440px]:hidden inline-flex size-10 items-center justify-center rounded-lg border border-line text-ink"><Icon name="menu" /></button>
        </div>
      </div>
      {open && (
        <div className="fixed inset-0 z-50 min-[1440px]:hidden">
          <button type="button" aria-label="Close menu" tabIndex={-1} className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <div ref={drawerRef} id="nav-drawer" role="dialog" aria-modal="true" aria-label="Site menu"
            onClick={(e) => { if ((e.target as HTMLElement).closest("a")) setOpen(false); /* also closes on the current page's link */ }}
            className="absolute right-0 top-0 flex h-dvh w-[min(360px,88vw)] flex-col overflow-y-auto border-l border-line bg-surface p-5">
            <div className="mb-4 flex items-center justify-between">
              <Wordmark />
              <button type="button" onClick={() => setOpen(false)} aria-label="Close menu" className="inline-flex size-10 items-center justify-center rounded-lg border border-line"><Icon name="close" /></button>
            </div>
            <nav aria-label="Mobile">
              <ul className="grid gap-1">
                {NAV.map((n) => (
                  <li key={n.to}><NavLink to={n.to} end={n.to === "/"} className={({ isActive }) => cx("flex min-h-12 items-center rounded-lg px-3 text-[17px]", isActive ? "bg-raise text-green" : "text-ink hover:bg-raise")}>{n.label}</NavLink></li>
                ))}
              </ul>
            </nav>
            <div className="mt-6 grid gap-2 border-t border-line pt-5">
              <Link to="/explore" className="flex min-h-12 items-center gap-3 rounded-lg px-3 hover:bg-raise"><Icon name="explore" />Explore Mode</Link>
              <Link to="/recruiter" className="flex min-h-12 items-center gap-3 rounded-lg px-3 hover:bg-raise"><Icon name="recruiter" />Recruiter Mode</Link>
              <Link to="/skills" className="flex min-h-12 items-center gap-3 rounded-lg px-3 hover:bg-raise"><Icon name="product" />Skills library</Link>
              <Link to="/ask" className="flex min-h-12 items-center gap-3 rounded-lg px-3 hover:bg-raise"><Icon name="ask" />Ask Gaurav</Link>
              <a href={asset(profile.cvFile)} download="Gaurav-Kumar-Singh-CV.pdf" className="mt-2 flex min-h-12 items-center justify-center gap-2 rounded-xl bg-green font-semibold text-green-ink"><Icon name="download" />Download CV</a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
