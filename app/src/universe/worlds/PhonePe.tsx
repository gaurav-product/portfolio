import { useContext, useEffect, useMemo, useRef, useState, type MutableRefObject, type ReactNode } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import type { SceneEvents, Tier } from "../bus";
import { ReducedMotion } from "../kit";
import { audio } from "../audio";
import { clampDt, useMotionNeed } from "../motion";

/**
 * PhonePe Smart Spend Coach — the Financial Intelligence Tower (bespoke world).
 *
 * Seven floors, one per stage of the case study, each a different architectural form:
 *   01 summary          a wide glass drum under a halo — the overview
 *   02 segments         separated glass wedges; one (the primary persona) is lit
 *   03 prototype        five upright phone-like slabs — the 5-screen prototype
 *   04 prd              a smooth disc with a scanning band and one bright "tap" ring — detection and the one-tap action
 *   05 prioritization   five bars of different heights — the five scored candidates
 *   06 tradeoffs        a cantilevered volume balanced by a counterweight
 *   07 experimentation  twin A / B volumes split by a gap, inside a guardrail ring
 * The forms are design devices, not data: no figure is drawn from the case study. Each floor opens its
 * case-study section (onHotspot) — the same sections the floor directory lists. Overall height matches the
 * shared world camera (about 9.5 units), so framing, panels and the directory stay as in every other world.
 */
const C = {
  violet: "#7B5CFF", deep: "#2A1758", glass: "#B7A6FF", cyan: "#35D6D0", green: "#4DFF4D", titanium: "#B9B6C8", body: "#14121E",
};
/** floor height band: [base y, height] */
const FLOORS: [number, number][] = [[1.0, 1.0], [2.25, 0.85], [3.35, 1.05], [4.65, 0.8], [5.7, 0.95], [6.9, 0.85], [8.0, 1.0]];
export const PHONEPE_KEYS = ["summary", "segments", "prototype", "prd", "prioritization", "tradeoffs", "experimentation"] as const;

function useTowerMats() {
  return useMemo(() => {
    const glass = new THREE.MeshStandardMaterial({ color: C.glass, metalness: 0.85, roughness: 0.08, transparent: true, opacity: 0.5, emissive: new THREE.Color(C.violet), emissiveIntensity: 0.28, envMapIntensity: 1.2 });
    const glassDeep = new THREE.MeshStandardMaterial({ color: "#5B44C8", metalness: 0.9, roughness: 0.12, transparent: true, opacity: 0.62, emissive: new THREE.Color(C.deep), emissiveIntensity: 0.6 });
    const titanium = new THREE.MeshStandardMaterial({ color: C.titanium, metalness: 1, roughness: 0.28 });
    const body = new THREE.MeshStandardMaterial({ color: C.body, metalness: 0.55, roughness: 0.45 });
    const violetLine = new THREE.MeshBasicMaterial({ color: C.violet, toneMapped: false });
    const cyanLine = new THREE.MeshBasicMaterial({ color: C.cyan, toneMapped: false });
    const greenLine = new THREE.MeshBasicMaterial({ color: C.green, toneMapped: false });
    const screen = new THREE.MeshStandardMaterial({ color: "#0D0A1C", emissive: new THREE.Color("#8F7BFF"), emissiveIntensity: 0.9, roughness: 0.3, metalness: 0.2 });
    return { glass, glassDeep, titanium, body, violetLine, cyanLine, greenLine, screen };
  }, []);
}
type TM = ReturnType<typeof useTowerMats>;

export function PhonePeTower({ hotspots, events, tier }: { hotspots: { key: string; title: string }[]; events: MutableRefObject<SceneEvents>; tier: Tier }) {
  const m = useTowerMats();
  useEffect(() => () => Object.values(m).forEach((x) => x.dispose()), [m]);
  const reduced = useContext(ReducedMotion);
  const [hover, setHover] = useState<number | null>(null);
  // a floor is clickable only if the project really has that section (it always does for PhonePe; checked anyway)
  const has = new Set(hotspots.map((h) => h.key));
  const seg = tier === "mobile" ? 32 : 64;

  const floor = (i: number, node: ReactNode) => {
    const key = PHONEPE_KEYS[i];
    const live = has.has(key);
    const [y, h] = FLOORS[i];
    return (
      <group key={key} position={[0, y, 0]}
        onPointerOver={live ? (e: ThreeEvent<PointerEvent>) => { e.stopPropagation(); setHover(i); document.body.style.cursor = "pointer"; audio.cue("hover"); } : undefined}
        onPointerOut={live ? () => { setHover((v) => (v === i ? null : v)); document.body.style.cursor = ""; } : undefined}
        onClick={live ? (e: ThreeEvent<MouseEvent>) => { e.stopPropagation(); events.current.onHotspot(key); } : undefined}>
        {node}
        {/* the floor's light line: brighter while pointed at */}
        <mesh position={[0, -0.04, 0]} rotation={[Math.PI / 2, 0, 0]} material={hover === i ? m.greenLine : m.violetLine}><torusGeometry args={[2.05 - i * 0.07, 0.022, 8, seg * 2]} /></mesh>
        {/* hit volume covering the whole floor band */}
        <mesh position={[0, h / 2, 0]}><cylinderGeometry args={[2.25 - i * 0.07, 2.25 - i * 0.07, h, 24]} /><meshBasicMaterial transparent opacity={0} depthWrite={false} colorWrite={false} /></mesh>
      </group>
    );
  };

  // scaled so the spire (about 10.7 units) sits inside the shared world camera's frame, which is set for ~9.5-unit buildings
  return (
    <group scale={tier === "mobile" ? 0.68 : 0.8}>
      <hemisphereLight args={["#D9D2FF", "#0B0A12", 0.5]} />
      <directionalLight position={[8, 14, 10]} intensity={1.35} color="#F1ECFF" />
      <directionalLight position={[-10, 6, -6]} intensity={0.8} color={C.cyan} />
      <pointLight position={[0, 1.2, 4.5]} intensity={14} distance={16} color={C.violet} />
      <pointLight position={[3.5, 7, 3]} intensity={8} distance={14} color="#9FFFC8" />
      <Plinth m={m} seg={seg} />
      <Spine m={m} reduced={reduced} />
      {floor(0, <Drum m={m} seg={seg} />)}
      {floor(1, <Wedges m={m} />)}
      {floor(2, <Screens m={m} />)}
      {floor(3, <Detection m={m} seg={seg} reduced={reduced} />)}
      {floor(4, <Bars m={m} />)}
      {floor(5, <Balance m={m} />)}
      {floor(6, <Split m={m} seg={seg} />)}
      <Crown m={m} seg={seg} reduced={reduced} />
    </group>
  );
}

/* ---------------------------------------------------------------- parts */
function Plinth({ m, seg }: { m: TM; seg: number }) {
  return (
    <group>
      <mesh position={[0, 0.18, 0]} material={m.body}><cylinderGeometry args={[4.4, 4.7, 0.36, 8]} /></mesh>
      <mesh position={[0, 0.37, 0]} material={m.violetLine}><cylinderGeometry args={[4.41, 4.41, 0.03, 8, 1, true]} /></mesh>
      <mesh position={[0, 0.58, 0]} material={m.titanium}><cylinderGeometry args={[3.3, 3.5, 0.42, 8]} /></mesh>
      <mesh position={[0, 0.8, 0]} material={m.cyanLine}><cylinderGeometry args={[3.31, 3.31, 0.025, 8, 1, true]} /></mesh>
      {/* entrance: a lit glass canopy facing the plaza */}
      <mesh position={[0, 0.62, 3.55]} material={m.glass}><boxGeometry args={[2.2, 0.5, 0.9]} /></mesh>
      <mesh position={[0, 0.9, 3.8]} material={m.violetLine}><boxGeometry args={[2.4, 0.04, 1.2]} /></mesh>
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[4.75, 4.85, seg * 2]} /><meshBasicMaterial color={C.violet} transparent opacity={0.6} toneMapped={false} /></mesh>
    </group>
  );
}

function Spine({ m, reduced }: { m: TM; reduced: boolean }) {
  const pulse = useRef<THREE.Mesh>(null!);
  useMotionNeed(() => (reduced ? null : "ambient"));
  useFrame(({ clock }) => { if (!reduced) pulse.current.position.y = 1 + ((clock.elapsedTime * 1.6) % 8.2); });
  return (
    <group>
      <mesh position={[0, 4.8, 0]} material={m.titanium}><cylinderGeometry args={[0.32, 0.4, 8.4, 24]} /></mesh>
      <mesh position={[0, 4.8, 0.33]} material={m.cyanLine}><boxGeometry args={[0.04, 8.2, 0.04]} /></mesh>
      {/* a data pulse climbing the spine (static with reduced motion) */}
      <mesh ref={pulse} position={[0, 5, 0.34]} material={m.greenLine}><sphereGeometry args={[0.07, 12, 8]} /></mesh>
    </group>
  );
}

/** 01 — the overview: a wide glass drum under a halo */
function Drum({ m, seg }: { m: TM; seg: number }) {
  return (
    <group>
      <mesh position={[0, 0.5, 0]} material={m.glass}><cylinderGeometry args={[1.95, 1.95, 1, seg, 1, true]} /></mesh>
      <mesh position={[0, 0.02, 0]} material={m.titanium}><cylinderGeometry args={[2.05, 2.05, 0.06, seg]} /></mesh>
      <mesh position={[0, 1.04, 0]} rotation={[Math.PI / 2, 0, 0]} material={m.cyanLine}><torusGeometry args={[2.0, 0.03, 8, seg * 2]} /></mesh>
      {Array.from({ length: 16 }, (_, i) => { const a = (i / 16) * Math.PI * 2; return <mesh key={i} position={[Math.cos(a) * 1.97, 0.5, Math.sin(a) * 1.97]} rotation={[0, -a, 0]} material={m.titanium}><boxGeometry args={[0.03, 1, 0.08]} /></mesh>; })}
    </group>
  );
}

/** 02 — segmentation: separated wedges; the primary persona's wedge is lit */
function Wedges({ m }: { m: TM }) {
  return (
    <group>
      {Array.from({ length: 5 }, (_, i) => {
        const a0 = (i / 5) * Math.PI * 2 + 0.06, len = (Math.PI * 2) / 5 - 0.12;
        return <mesh key={i} position={[0, 0.42, 0]} material={i === 0 ? m.screen : m.glassDeep}><cylinderGeometry args={[1.85, 1.85, 0.8, 24, 1, false, a0, len]} /></mesh>;
      })}
      <mesh position={[0, 0.02, 0]} material={m.titanium}><cylinderGeometry args={[1.95, 1.95, 0.05, 40]} /></mesh>
    </group>
  );
}

/** 03 — the 5-screen prototype: upright phone-like slabs around the spine */
function Screens({ m }: { m: TM }) {
  return (
    <group>
      <mesh position={[0, 0.02, 0]} material={m.titanium}><cylinderGeometry args={[1.85, 1.85, 0.05, 40]} /></mesh>
      {Array.from({ length: 5 }, (_, i) => {
        const a = (i / 5) * Math.PI * 2 + 0.3;
        return (
          <group key={i} position={[Math.cos(a) * 1.35, 0.55, Math.sin(a) * 1.35]} rotation={[0, -a + Math.PI / 2, 0]}>
            <mesh material={m.body}><boxGeometry args={[0.62, 1.0, 0.08]} /></mesh>
            <mesh position={[0, 0, 0.045]} material={m.screen}><planeGeometry args={[0.52, 0.86]} /></mesh>
          </group>
        );
      })}
    </group>
  );
}

/** 04 — detection and the one-tap action: a smooth disc, a scanning band and a single bright ring */
function Detection({ m, seg, reduced }: { m: TM; seg: number; reduced: boolean }) {
  const band = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => { if (!reduced) band.current.position.y = 0.4 + Math.sin(clock.elapsedTime * 1.2) * 0.26; });
  return (
    <group>
      <mesh position={[0, 0.4, 0]} material={m.glassDeep}><cylinderGeometry args={[1.75, 1.6, 0.8, seg]} /></mesh>
      <mesh ref={band} position={[0, 0.4, 0]} rotation={[Math.PI / 2, 0, 0]} material={m.cyanLine}><torusGeometry args={[1.72, 0.02, 6, seg * 2]} /></mesh>
      {/* the one tap: a single bright ring on the façade, facing the plaza */}
      <mesh position={[0, 0.42, 1.74]} material={m.greenLine}><torusGeometry args={[0.2, 0.035, 10, 40]} /></mesh>
      <mesh position={[0, 0.42, 1.73]}><circleGeometry args={[0.15, 32]} /><meshBasicMaterial color={C.green} transparent opacity={0.35} toneMapped={false} /></mesh>
    </group>
  );
}

/** 05 — prioritisation: five candidates as bars of different heights (one stands out) */
function Bars({ m }: { m: TM }) {
  const hs = [0.45, 0.62, 0.92, 0.38, 0.55];
  return (
    <group>
      <mesh position={[0, 0.02, 0]} material={m.titanium}><cylinderGeometry args={[1.75, 1.75, 0.05, 40]} /></mesh>
      {hs.map((h, i) => {
        const a = (i / 5) * Math.PI * 2 + 0.9;
        return <mesh key={i} position={[Math.cos(a) * 1.15, h / 2 + 0.04, Math.sin(a) * 1.15]} rotation={[0, -a, 0]} material={i === 2 ? m.screen : m.glass}><boxGeometry args={[0.55, h, 0.7]} /></mesh>;
      })}
    </group>
  );
}

/** 06 — trade-offs and corrections: a cantilevered volume balanced by a counterweight */
function Balance({ m }: { m: TM }) {
  return (
    <group rotation={[0, 0.5, 0]}>
      <mesh position={[0.55, 0.42, 0]} material={m.glass}><boxGeometry args={[2.9, 0.78, 1.5]} /></mesh>
      <mesh position={[-1.25, 0.32, 0]} material={m.body}><boxGeometry args={[0.9, 0.58, 1.3]} /></mesh>
      <mesh position={[0, 0.84, 0]} material={m.titanium}><boxGeometry args={[3.9, 0.05, 0.08]} /></mesh>
      <mesh position={[0, 0.02, 0]} material={m.titanium}><cylinderGeometry args={[0.6, 0.6, 0.05, 32]} /></mesh>
    </group>
  );
}

/** 07 — experiment design: twin A / B volumes split by a gap, inside a guardrail ring */
function Split({ m, seg }: { m: TM; seg: number }) {
  return (
    <group>
      {[-1, 1].map((s) => <mesh key={s} position={[s * 0.62, 0.5, 0]} material={s < 0 ? m.glass : m.glassDeep}><boxGeometry args={[1.05, 1, 1.6]} /></mesh>)}
      <mesh position={[0, 0.5, 0]} material={m.cyanLine}><boxGeometry args={[0.03, 1.05, 1.62]} /></mesh>
      <mesh position={[0, 0.5, 0]} rotation={[Math.PI / 2, 0, 0]} material={m.greenLine}><torusGeometry args={[1.62, 0.02, 6, seg * 2]} /></mesh>
    </group>
  );
}

function Crown({ m, seg, reduced }: { m: TM; seg: number; reduced: boolean }) {
  const halo = useRef<THREE.Mesh>(null!);
  useFrame((_, raw) => { if (!reduced) halo.current.rotation.z += clampDt(raw) * 0.3; });
  return (
    <group position={[0, 9.15, 0]}>
      <mesh material={m.titanium}><cylinderGeometry args={[1.0, 1.4, 0.18, 8]} /></mesh>
      <mesh position={[0, 0.75, 0]} material={m.titanium}><coneGeometry args={[0.14, 1.4, 12]} /></mesh>
      <mesh ref={halo} position={[0, 0.35, 0]} rotation={[Math.PI / 2, 0, 0]} material={m.violetLine}><torusGeometry args={[0.85, 0.02, 6, seg * 2, Math.PI * 1.6]} /></mesh>
      <mesh position={[0, 1.5, 0]} material={m.greenLine}><sphereGeometry args={[0.06, 12, 8]} /></mesh>
    </group>
  );
}
