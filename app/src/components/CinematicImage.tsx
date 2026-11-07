import { cinematic } from "~/content/cinematic";
import { asset } from "~/lib/meta";
import { cx } from "./ui";

/** Responsive cinematic illustration at its original aspect ratio.
 *  decorative → alt="" (used as a backdrop behind real HTML text).
 *  tag → shows "Illustration" so it is never mistaken for a screenshot. */
export function CinematicImage({ id, className = "", decorative = false, tag = false, priority = false, sizes = "100vw", imgClassName = "" }:
  { id: string; className?: string; decorative?: boolean; tag?: boolean; priority?: boolean; sizes?: string; imgClassName?: string }) {
  const c = cinematic(id);
  const set = (m: Record<string, { file: string }>) => Object.entries(m).map(([w, f]) => `${asset(f.file)} ${w}w`).join(", ");
  return (
    <span className={cx("relative block", className)} data-cinematic={id}>
      {/* AVIF first (≈40 % smaller), WebP for browsers without AVIF */}
      <picture>
        {c.avif && <source type="image/avif" srcSet={set(c.avif)} sizes={sizes} />}
        <img src={asset(c.sizes["960"].file)} srcSet={set(c.sizes)} sizes={sizes} width={c.width} height={c.height}
          alt={decorative ? "" : `${c.alt} (Illustration)`} aria-hidden={decorative || undefined}
          loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : undefined} decoding={priority ? "sync" : "async"}
          className={cx("block h-auto w-full", imgClassName)} />
      </picture>
      {tag && <span className="pointer-events-none absolute bottom-2 right-2 rounded-md bg-black/60 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[.14em] text-white/80">Illustration</span>}
    </span>
  );
}

/** Header art for a page: the 3D render beside the title on desktop, a slim banner on phones. */
export function heroArt(id: string) {
  return {
    backdrop: <CinematicImage id={id} decorative sizes="52vw" className="h-full" imgClassName="!object-center" />,
    mobileArt: <CinematicImage id={id} decorative sizes="100vw" className="h-full" imgClassName="h-full object-cover" />,
  };
}
