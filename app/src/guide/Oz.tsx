import { useId } from "react";
import type { GuideState } from "./machine";

/**
 * Oz — the Gaurav.OS mascot. An original cartoon: a round emerald jelly-bean
 * with oversized eyes, rosy cheeks, stubby arms and a sprout antenna with a
 * glowing bulb. Pure SVG + CSS (see guide.css): no image downloads, no canvas,
 * no animation loop of its own. Everything it does is driven by `data-state`
 * and three CSS variables: --ex/--ey (where the eyes look) and --mouth (how
 * open the mouth is while talking).
 */
export function Oz({ state, mood, size = 72, className = "" }: { state: GuideState; mood?: "dance" | "poke" | null; size?: number; className?: string }) {
  const uid = useId().replace(/[^a-zA-Z0-9-]/g, ""); // unique gradient ids: two Oz can share a page
  const skin = `oz-skin-${uid}`, bulb = `oz-bulb-${uid}`;
  return (
    <svg viewBox="0 0 120 132" width={size} height={size * 1.1} aria-hidden="true" focusable="false"
      className={`oz ${className}`} data-state={state} data-mood={mood ?? undefined}>
      <defs>
        <radialGradient id={skin} cx="38%" cy="30%" r="80%">
          <stop offset="0" stopColor="#B4F7CB" />
          <stop offset=".45" stopColor="#6BE39A" />
          <stop offset="1" stopColor="#24A866" />
        </radialGradient>
        <radialGradient id={bulb} cx="40%" cy="35%" r="70%">
          <stop offset="0" stopColor="#E9FFFE" />
          <stop offset=".5" stopColor="#35D6D0" />
          <stop offset="1" stopColor="#168C88" />
        </radialGradient>
      </defs>

      <ellipse className="oz-shadow" cx="60" cy="125" rx="26" ry="4.5" fill="#000" opacity=".35" />

      <g className="oz-float">
        <g className="oz-body">
          {/* antenna: a sprout stem, a leaf and a glowing bulb */}
          <g className="oz-antenna">
            <path d="M60 30 C 59 20, 64 15, 66 9" stroke="#24A866" strokeWidth="3.4" fill="none" strokeLinecap="round" />
            <path d="M61 22 C 52 20, 47 14, 49 9 C 56 9, 61 15, 61 22 Z" fill="#6BE39A" stroke="#24A866" strokeWidth="1.4" />
            <circle className="oz-bulb" cx="66.5" cy="8" r="5.6" fill={`url(#${bulb})`} />
          </g>

          {/* arms behind the body */}
          <g className="oz-arm oz-arm-l"><ellipse cx="20" cy="80" rx="7" ry="11" fill="#2DB46F" transform="rotate(28 20 80)" /></g>
          <g className="oz-arm oz-arm-r"><ellipse cx="100" cy="80" rx="7" ry="11" fill="#2DB46F" transform="rotate(-28 100 80)" /></g>

          {/* jelly-bean body */}
          <path d="M60 28 C 88 28, 104 46, 104 74 C 104 100, 86 116, 60 116 C 34 116, 16 100, 16 74 C 16 46, 32 28, 60 28 Z"
            fill={`url(#${skin})`} stroke="#1E8E57" strokeWidth="2" />
          <ellipse cx="44" cy="44" rx="13" ry="7" fill="#fff" opacity=".35" transform="rotate(-20 44 44)" />
          <ellipse cx="60" cy="98" rx="20" ry="10" fill="#C9FAD9" opacity=".45" />

          {/* face */}
          <g className="oz-face">
            <g className="oz-eyes">
              {[42, 78].map((x) => (
                <g key={x} className="oz-eye">
                  <ellipse cx={x} cy="66" rx="13" ry="15" fill="#fff" stroke="#1E8E57" strokeWidth="1.6" />
                  <g className="oz-pupil">
                    <circle cx={x} cy="68" r="7.6" fill="#0B1110" />
                    <circle cx={x - 2.6} cy="64.6" r="2.7" fill="#fff" />
                    <circle cx={x + 2.8} cy="71" r="1.2" fill="#fff" opacity=".8" />
                  </g>
                  {/* eyelid: drops for blinks, half-closes when sleepy */}
                  <rect className="oz-lid" x={x - 14} y="50" width="28" height="31" rx="13" fill="#3FC47F" />
                </g>
              ))}
              {/* happy eyes: ^ ^ */}
              <g className="oz-eyes-happy" fill="none" stroke="#0B1110" strokeWidth="3.6" strokeLinecap="round">
                <path d="M33 69 Q 42 58 51 69" /><path d="M69 69 Q 78 58 87 69" />
              </g>
            </g>
            <ellipse cx="29" cy="86" rx="6" ry="3.6" fill="#FF8FA3" opacity=".7" />
            <ellipse cx="91" cy="86" rx="6" ry="3.6" fill="#FF8FA3" opacity=".7" />

            {/* mouths — only the one matching the state is shown */}
            <path className="oz-mouth oz-mouth-smile" d="M50 90 Q 60 99 70 90" stroke="#0B1110" strokeWidth="3" fill="none" strokeLinecap="round" />
            <g className="oz-mouth oz-mouth-talk">
              <ellipse className="oz-talk" cx="60" cy="93" rx="8" ry="6" fill="#0B1110" />
              <ellipse cx="60" cy="96.5" rx="4.4" ry="2" fill="#FF6F8B" />
            </g>
            <ellipse className="oz-mouth oz-mouth-o" cx="60" cy="93" rx="4.2" ry="5" fill="#0B1110" />
            <path className="oz-mouth oz-mouth-wobble" d="M49 93 q 3.6 -4 7.3 0 t 7.3 0 t 7.3 0" stroke="#0B1110" strokeWidth="2.8" fill="none" strokeLinecap="round" />
            <path className="oz-mouth oz-mouth-grin" d="M47 88 Q 60 104 73 88 Z" fill="#0B1110" />
          </g>
        </g>

        {/* extras */}
        <g className="oz-x oz-zzz" fill="#35D6D0" fontFamily="Space Grotesk, sans-serif" fontWeight="700">
          <text x="92" y="30" fontSize="13">z</text><text x="101" y="19" fontSize="10">z</text><text x="108" y="10" fontSize="8">z</text>
        </g>
        <text className="oz-x oz-q" x="98" y="36" fontSize="24" fill="#35D6D0" fontFamily="Space Grotesk, sans-serif" fontWeight="700">?</text>
        <g className="oz-x oz-dots" fill="#35D6D0"><circle cx="92" cy="30" r="3" /><circle cx="101" cy="24" r="3" /><circle cx="110" cy="18" r="3" /></g>
        <g className="oz-x oz-waves" fill="none" stroke="#35D6D0" strokeWidth="2.4" strokeLinecap="round">
          <path d="M8 58 q -5 8 0 16" /><path d="M2 54 q -7 12 0 24" /><path d="M112 58 q 5 8 0 16" /><path d="M118 54 q 7 12 0 24" />
        </g>
        <g className="oz-x oz-sparkles" fill="#F2C14E">
          <path d="M14 30 l2 6 6 2 -6 2 -2 6 -2 -6 -6 -2 6 -2 z" /><path d="M104 42 l1.4 4 4 1.4 -4 1.4 -1.4 4 -1.4 -4 -4 -1.4 4 -1.4 z" />
        </g>
        <path className="oz-x oz-sweat" d="M98 50 q 5 7 0 10 q -5 -3 0 -10 z" fill="#7FD3FF" />
      </g>
    </svg>
  );
}
