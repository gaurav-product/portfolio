import { profile } from "~/content/profile";
import { asset } from "~/lib/meta";
import { cx } from "./ui";

/** Hero portrait inside the brand ring. Source, alt text and provenance live in
 *  content/profile.ts — replacing the photograph is a content change only. */
export function Portrait({ size = 260, className = "" }: { size?: number; className?: string }) {
  const p = profile.portrait;
  return (
    <figure className={cx("relative mx-auto shrink-0", className)} style={{ width: size, height: size }} data-testid="portrait">
      <span aria-hidden className="absolute -inset-3 rounded-full border border-green/25" />
      <span aria-hidden className="absolute inset-0 rounded-full shadow-[0_0_0_2px_rgb(77_255_77/.9),0_0_36px_-4px_rgb(77_255_77/.6)]" />
      {p.src ? (
        <img src={asset(p.src)} alt={p.alt} width={p.width} height={p.height} fetchPriority="high" decoding="async"
          className="h-full w-full rounded-full object-cover" data-provenance={p.provenance} />
      ) : (
        <span className="grid h-full w-full place-items-center rounded-full bg-surface font-display text-3xl font-bold">G<span className="text-green">.OS</span></span>
      )}
    </figure>
  );
}
