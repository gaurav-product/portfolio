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
 * Entering the Product Universe uses a circular reveal from the click point.
 */
const BASE = (import.meta.env.BASE_URL || "/").replace(/\/$/, "");
const FILE = /\.(pdf|png|jpe?g|webp|avif|svg|mp4|webm|csv|zip|json|txt|xml)$/i;

export function Transitions() {
  const navigate = useNavigate();

  useEffect(() => {
    const html = document.documentElement;
    let clear: ReturnType<typeof setTimeout> | undefined;
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
      const reveal = path.startsWith("/universe") && !here.startsWith("/universe");
      html.dataset.vt = reveal ? "reveal" : "page";
      html.style.setProperty("--vt-x", `${e.clientX}px`);
      html.style.setProperty("--vt-y", `${e.clientY}px`);
      clearTimeout(clear);
      clear = setTimeout(() => { delete html.dataset.vt; }, 1200);
      navigate(path + url.search + url.hash, { viewTransition: true });
    };
    document.addEventListener("click", onClick, true);
    return () => { document.removeEventListener("click", onClick, true); clearTimeout(clear); };
  }, [navigate]);
  return null;
}
