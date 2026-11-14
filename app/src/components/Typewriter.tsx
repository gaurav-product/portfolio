import { useEffect, useRef, useState } from "react";

/**
 * Kinetic typing for the hero line. The full sentence is rendered on the server and stays the
 * accessible text (screen readers read it once, never the animated characters). In the browser,
 * with motion allowed, the ending is rewritten through each phrase and settles on the final text,
 * once per session. The final sentence also reserves the layout space, so nothing shifts.
 */
export function Typewriter({ prefix, phrases, final, className = "" }: { prefix: string; phrases: string[]; final: string; className?: string }) {
  const [tail, setTail] = useState(final);
  const [typing, setTyping] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let played = false;
    try { played = sessionStorage.getItem("gos-typed") === "1"; sessionStorage.setItem("gos-typed", "1"); } catch { /* storage blocked: play once anyway */ }
    if (reduce || played) return;
    // steps: delete the final text, then type and delete each phrase, then type the final text and stop
    const steps: { to: string; ms: number; hold: number }[] = [{ to: "", ms: 18, hold: 260 }];
    for (const p of phrases) { steps.push({ to: p, ms: 46, hold: 1150 }, { to: "", ms: 20, hold: 220 }); }
    steps.push({ to: final, ms: 34, hold: 0 });
    let i = 0, cur = final;
    setTyping(true);
    const tick = () => {
      const s = steps[i];
      if (!s) { setTyping(false); return; }
      if (cur === s.to) { i++; timer.current = setTimeout(tick, s.hold); return; }
      cur = s.to.startsWith(cur) ? s.to.slice(0, cur.length + 1) : cur.slice(0, -1);
      setTail(cur);
      timer.current = setTimeout(tick, s.ms + (s.to.startsWith(cur) ? Math.random() * 40 : 0));
    };
    timer.current = setTimeout(tick, 900);
    return () => clearTimeout(timer.current);
  }, [final, phrases]);

  return (
    <span className={`relative inline-grid ${className}`} data-testid="typewriter">
      <span className="sr-only">{prefix}{final}</span>
      {/* layout reserve: the longest text, invisible, in the same grid cell */}
      {/* On phones the typed phrase starts on its own line, in the reserve and in the animation alike, so a
          half-typed word never hops between lines (a visible jump, and layout shift). The caret is the typed
          text's own right border rather than a separate element, so it never moves anything either. */}
      <span aria-hidden className="invisible col-start-1 row-start-1">{prefix}<br className="sm:hidden" /><span className="border-r-2 border-transparent pr-0.5">{final}</span></span>
      <span aria-hidden className="col-start-1 row-start-1">
        {prefix}<br className="sm:hidden" />
        <span className={`border-r-2 pr-0.5 text-green ${typing ? "border-green animate-[caretborder_1s_steps(1)_infinite]" : "border-transparent"}`} data-testid="typewriter-caret" data-typing={typing ? "true" : "false"}>{tail}</span>
      </span>
    </span>
  );
}
