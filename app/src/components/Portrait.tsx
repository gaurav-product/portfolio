import { profile } from "~/content/profile";
import { asset } from "~/lib/meta";
import { cx } from "./ui";

/** Hero portrait inside the brand ring. Source, alt text and provenance live in
 *  content/profile.ts — replacing the photograph is a content change only. */
export function Portrait({ size = 260, className = "" }: { size?: number; className?: string }) {
  const p = profile.portrait;
  return (
    <figure className={cx("relative mx-auto shrink-0", className)} style={{ width: size, height: size }} data-testid="portrait">
      <span aria-hidden className="absolute -inset-2 rounded-full border border-ink/10" />
      <span aria-hidden className="absolute inset-0 rounded-full shadow-[0_0_0_1px_rgb(107_227_154/.55),0_18px_50px_-12px_rgb(0_0_0/.8)]" />
      {p.src ? (
        <img src={asset(p.src)} alt={p.alt} width={p.width} height={p.height} fetchPriority="high" decoding="async"
          className="h-full w-full rounded-full object-cover" data-provenance={p.provenance} />
      ) : (
        <span className="grid h-full w-full place-items-center rounded-full bg-surface font-display text-3xl font-bold">G<span className="text-green">.OS</span></span>
      )}
    </figure>
  );
}
