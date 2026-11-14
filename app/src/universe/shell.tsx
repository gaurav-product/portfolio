import { Component, type ReactNode } from "react";
import { Link } from "react-router";
import { Icon } from "~/components/Icon";
import { SoundController } from "./SoundController";
import type { Tier } from "./bus";

/** Shared by the study Earth (/universe) and every 3D world page. */
export function webgl() { try { const c = document.createElement("canvas"); return !!(c.getContext("webgl2") || c.getContext("webgl")); } catch { return false; } }
/** True when WebGL is drawn on the CPU (no graphics processor): 3D would be slow, so the list leads. */
export function softwareGL() {
  try {
    const gl = document.createElement("canvas").getContext("webgl"); const ext = gl?.getExtension("WEBGL_debug_renderer_info");
    const name = String(ext ? gl!.getParameter(ext.UNMASKED_RENDERER_WEBGL) : gl?.getParameter(gl.RENDERER) ?? "");
    return /swiftshader|llvmpipe|softpipe|software|basic render/i.test(name);
  } catch { return false; }
}
export function detectTier(forced: string | null): Tier {
  if (forced === "high" || forced === "laptop" || forced === "mobile") return forced;
  if (matchMedia("(pointer: coarse)").matches || innerWidth < 768) return "mobile";
  return (navigator.hardwareConcurrency ?? 8) <= 4 ? "laptop" : "high";
}
export { SIDE_QUERY, sideLayout, SHEET, TOP_BAR_PX } from "./layout";
export const store = { get: (k: string) => { try { return localStorage.getItem(k); } catch { return null; } }, set: (k: string, v: string) => { try { localStorage.setItem(k, v); } catch { /* ignore */ } } };

const btn = "inline-flex min-h-11 items-center gap-2 rounded-full border border-white/15 bg-black/40 px-4 text-sm backdrop-blur-md hover:bg-white/10";

/** The full-screen frame: Exit, an optional back link, the title, page-specific actions, Recruiter view and sound. */
export function Shell({ children, exit, back, title, actions }: {
  children: ReactNode; exit: () => void; back?: { to: string; label: string; onClick?: () => void }; title: string; actions?: ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-40 overflow-hidden bg-[#020405] text-white" data-testid="universe">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-center justify-between gap-3 p-3 pl-[max(0.75rem,env(safe-area-inset-left))] pr-[max(0.75rem,env(safe-area-inset-right))] pt-[max(0.75rem,env(safe-area-inset-top))] sm:p-4 sm:pl-[max(1rem,env(safe-area-inset-left))] sm:pr-[max(1rem,env(safe-area-inset-right))] sm:pt-[max(1rem,env(safe-area-inset-top))]">
        <div className="pointer-events-auto flex items-center gap-2">
          <button type="button" onClick={exit} className={btn} data-testid="exit-universe"><Icon name="close" size={16} /><span>Exit<span className="max-sm:hidden"> cinematic mode</span></span></button>
          {back && <Link to={back.to} onClick={back.onClick} data-cursor="back" className={btn} data-testid="world-back" aria-label={back.label}><Icon name="back" size={16} /><span className="max-sm:sr-only">{back.label}</span></Link>}
        </div>
        <p className="pointer-events-none font-display text-lg font-bold max-md:hidden">Gaurav<span className="text-green">.OS</span> <span className="ml-2 font-mono text-[11px] font-normal uppercase tracking-[.22em] text-white/50">{title}</span></p>
        <div className="pointer-events-auto flex items-center gap-2">
          {actions}
          <Link to="/recruiter" className={btn}><Icon name="recruiter" size={16} /><span className="max-sm:sr-only">Recruiter view</span></Link>
          <SoundController />
        </div>
      </div>
      {children}
    </div>
  );
}
export const shellButton = btn;

export class CanvasBoundary extends Component<{ children: ReactNode; onFail: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onFail(); }
  render() { return this.state.failed ? null : this.props.children; }
}
