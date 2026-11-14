import { isImmersive } from "~/lib/immersive";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import "./transitions.css";

/**
 * Cinematic page transitions through the browser's View Transitions API, via
 * React Router's own `viewTransition` navigation — no new library, no app
 * remount, and the router keeps full control of history and data.
 *
 * One capture-phase click listener upgrades ordinary internal link clicks.
 * Everything else is left exactly as the browser and the router would do it:
 *  - browsers without document.startViewTransition (e.g. Firefox), and reduced
 *    motion → normal instant navigation;
 *  - modified clicks (new tab/window), non-primary buttons, target/download,
 *    external, same-page hash links, files, data-no-transition;
 *  - Back/Forward (popstate) and direct URLs are never intercepted.
 * A new click while a transition runs simply starts a new navigation; the
 * browser skips the unfinished transition, so nothing can get stuck.
 * Entering a full-screen 3D page (the study Earth or a 3D world) uses a circular reveal from the click point.
 * The `data-vt` flag that selects the animation is removed when the browser's
 * own transition finishes (ViewTransition.finished), with a 5 s safety
 * fallback — never on a fixed timer, which a slow device could outlast.
 */
const BASE = (import.meta.env.BASE_URL || "/").replace(/\/$/, "");
const FILE = /\.(pdf|png|jpe?g|webp|avif|svg|mp4|webm|csv|zip|json|txt|xml)$/i;

export function Transitions() {
  const navigate = useNavigate();

  useEffect(() => {
    const html = document.documentElement;
    const SAFETY_MS = 5000;
    let clear: ReturnType<typeof setTimeout> | undefined;
    let pending = 0; // id of the click whose transition has not started yet
    let latest = 0;  // id of the newest click; an older transition never clears a newer flag
    const finish = (id: number) => { if (id === latest) { delete html.dataset.vt; clearTimeout(clear); } };

    // React Router starts the transition through document.startViewTransition: observe it to learn
    // when the browser's real transition (including our CSS animation) has finished or was skipped.
    const doc = document as Document & { startViewTransition?: Document["startViewTransition"] };
    const original = doc.startViewTransition;
    if (original) {
      doc.startViewTransition = function (this: Document, ...args: Parameters<Document["startViewTransition"]>) {
        const t = original.apply(this, args); // arguments passed through untouched (callback or options)
        if (pending) { const id = pending; pending = 0; t.finished.finally(() => finish(id)).catch(() => {}); }
        return t;
      } as Document["startViewTransition"];
    }
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (!("startViewTransition" in document) || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a || a.hasAttribute("download") || a.hasAttribute("data-no-transition") || (a.target && a.target !== "_self")) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || FILE.test(url.pathname)) return;
      let path = url.pathname;
      if (BASE && path.startsWith(BASE)) path = path.slice(BASE.length) || "/";
      const here = location.pathname.replace(BASE, "") || "/";
      if (path === here && url.search === location.search) return; // same page (incl. #hash): let the browser scroll
      e.preventDefault(); // the Link's own handler sees this and stands down; its onClick (analytics) has still run
      const reveal = isImmersive(path) && !isImmersive(here);
      html.dataset.vt = reveal ? "reveal" : "page";
      html.style.setProperty("--vt-x", `${e.clientX}px`);
      html.style.setProperty("--vt-y", `${e.clientY}px`);
      const id = ++latest; pending = id;
      clearTimeout(clear);
      clear = setTimeout(() => finish(id), SAFETY_MS); // safety net if no transition ever starts
      navigate(path + url.search + url.hash, { viewTransition: true });
    };
    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("click", onClick, true); clearTimeout(clear);
      if (original) doc.startViewTransition = original;
    };
  }, [navigate]);
  return null;
}
