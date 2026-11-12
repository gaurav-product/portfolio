import { createContext, useEffect, useMemo, type MutableRefObject } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { BuildingSpec, GalleryItem } from "~/content/universe";
import type { SceneEvents } from "./bus";
import { windowsTexture, labelTexture, boardTexture } from "./textures";
import { audio } from "./audio";
import { asset } from "~/lib/meta";

/**
 * WorldKit v2: the parts every 3D world shares — plaza, materials, glass volumes, display
 * stations (screenshots or concept boards), the floor directory and reduced motion.
 * Shared archetype buildings live in World.tsx; bespoke worlds (R2: CareConnect) in worlds/.
 * Everything created here is disposed when it unmounts.
 */

/** Reduced motion for decorative parts (rings, dish, floating panels, tickets, drifting markers). */
export const ReducedMotion = createContext(false);

/* ---------------------------------------------------------------- plaza */
export function Plaza({ accent }: { accent: string }) {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[60, 64]} />
        <meshStandardMaterial color="#0C1412" roughness={0.42} metalness={0.55} />
      </mesh>
      {[6, 9.5, 14, 20].map((r, i) => (
        <mesh key={r} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
          <ringGeometry args={[r, r + 0.03, 96]} />
          <meshBasicMaterial color={accent} transparent opacity={0.28 - i * 0.05} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

/* ---------------------------------------------------------------- materials */
export function useMats(spec: BuildingSpec, seed: number) {
  return useMemo(() => {
    const p = spec.palette;
    const win = windowsTexture(p.light, seed);
    const glass = new THREE.MeshStandardMaterial({ color: p.glass, metalness: 0.9, roughness: 0.08, transparent: true, opacity: 0.42, emissive: new THREE.Color(p.light), emissiveMap: win, emissiveIntensity: 1.25 });
    const body = new THREE.MeshStandardMaterial({ color: p.body, metalness: 0.35, roughness: 0.55 });
    const metal = new THREE.MeshStandardMaterial({ color: "#AFC2BC", metalness: 0.95, roughness: 0.22 });
    const light = new THREE.MeshBasicMaterial({ color: p.light, toneMapped: false });
    const accent = new THREE.MeshBasicMaterial({ color: p.accent, toneMapped: false });
    const green = new THREE.MeshStandardMaterial({ color: "#2F6B45", roughness: 0.9 });
    const water = new THREE.MeshStandardMaterial({ color: "#0A2A2A", metalness: 0.9, roughness: 0.05 });
    const timber = new THREE.MeshStandardMaterial({ color: "#8A6A4A", roughness: 0.7 });
    return { win, glass, body, metal, light, accent, green, water, timber };
  }, [spec, seed]);
}
export type Mats = ReturnType<typeof useMats>;

export const Box = ({ s, p, mat, r }: { s: [number, number, number]; p: [number, number, number]; mat: THREE.Material; r?: [number, number, number] }) =>
  <mesh position={p} rotation={r} material={mat}><boxGeometry args={s} /></mesh>;
/** a glass volume with its lit window façade scaled to its size */
export function GlassBox({ s, p, m, r }: { s: [number, number, number]; p: [number, number, number]; m: Mats; r?: [number, number, number] }) {
  // keyed on the size values (the array itself is new on every render) and disposed with its cloned texture
  const [sx, sy] = s;
  const mat = useMemo(() => { const g = m.glass.clone(); g.emissiveMap = m.win.clone(); g.emissiveMap.needsUpdate = true; g.emissiveMap.repeat.set(Math.max(1, sx / 2), Math.max(1, sy / 2.2)); return g; }, [m, sx, sy]);
  useEffect(() => () => { mat.emissiveMap?.dispose(); mat.dispose(); }, [mat]);
  return <mesh position={p} rotation={r} material={mat}><boxGeometry args={s} /></mesh>;
}

/* ---------------------------------------------------------------- display stands */
/** Where a display station stands: position, facing (rotation about y), screen height. */
export interface Placement { pos: [number, number, number]; rotY: number; h?: number }

/**
 * A display station: one gallery item (actual screenshot, brand art, render or text-only concept board)
 * on a stand, with its provenance label underneath. Clicking it opens the image viewer at `index`.
 * Without `at`, stations stand on a curved gallery behind the building, facing the plaza.
 */
export function Panel({ item, index, count, accent, events, at, delay = 0 }: { item: GalleryItem; index: number; count: number; accent: string; events: MutableRefObject<SceneEvents>; at?: Placement; /** ms before the image loads: stagger decoding so a camera flight stays smooth */ delay?: number }) {
  const { invalidate } = useThree();
  const spread = Math.min(2.7, 0.5 * count), a = Math.PI + (count === 1 ? 0 : -spread / 2 + (spread * index) / (count - 1));
  const r = 12.5, pos = at ? new THREE.Vector3(...at.pos) : new THREE.Vector3(Math.sin(a) * r, 0, Math.cos(a) * r);
  const rotY = at ? at.rotY : a + Math.PI;
  const aspect = item.kind === "screenshot" ? 16 / 10 : item.width && item.height ? item.width / item.height : 16 / 10;
  const h = at?.h ?? 2.7, w = Math.min(h * 1.78, h * aspect);
  const mat = useMemo(() => new THREE.MeshBasicMaterial({ color: "#111" }), []);
  const label = useMemo(() => labelTexture(item.label, item.title, accent), [item, accent]);
  useEffect(() => {
    let tex: THREE.Texture | null = null, live = true, timer: ReturnType<typeof setTimeout> | undefined;
    if (item.kind === "concept" || item.kind === "missing") { tex = boardTexture(item.lines ?? [item.title], item.label, accent); mat.map = tex; mat.color.set("#C8CCCA"); mat.needsUpdate = true; invalidate(); }
    else if (item.panel) { const src = asset(item.panel); timer = setTimeout(() => new THREE.TextureLoader().load(src, (t) => { if (!live) { t.dispose(); return; } t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; tex = t; mat.map = t; mat.color.set("#C8CCCA"); mat.needsUpdate = true; invalidate(); }), delay); }
    return () => { live = false; clearTimeout(timer); tex?.dispose(); mat.dispose(); label.dispose(); };
  }, [item, mat, label, accent, invalidate, delay]);
  return (
    <group position={pos} rotation={[0, rotY, 0]}>
      <mesh position={[0, 0.7, 0]}><boxGeometry args={[0.1, 1.4, 0.1]} /><meshStandardMaterial color="#AFC2BC" metalness={0.9} roughness={0.25} /></mesh>
      <mesh position={[0, 1.45 + h / 2, -0.05]}><boxGeometry args={[w + 0.16, h + 0.16, 0.08]} /><meshStandardMaterial color="#0B1110" metalness={0.6} roughness={0.3} /></mesh>
      <mesh position={[0, 1.45 + h / 2, 0]} material={mat}
        onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = "zoom-in"; audio.cue("hover"); }}
        onPointerOut={() => { document.body.style.cursor = ""; }}
        onClick={(e) => { e.stopPropagation(); events.current.onPanel(index); }}>
        <planeGeometry args={[w, h]} />
      </mesh>
      <mesh position={[0, 1.12, 0.01]}><planeGeometry args={[Math.max(3, w), 0.47]} /><meshBasicMaterial map={label} transparent /></mesh>
    </group>
  );
}

/* ---------------------------------------------------------------- floor directory (case-study sections) */
export function Directory({ items, accent, events, at }: { items: { key: string; title: string }[]; accent: string; events: MutableRefObject<SceneEvents>; at?: Placement }) {
  // keyed on the content, not the array identity (a new array each render rebuilt every label texture)
  const sig = items.slice(0, 7).map((x) => `${x.key}:${x.title}`).join("|");
  const list = useMemo(() => items.slice(0, 7), [sig]); // eslint-disable-line react-hooks/exhaustive-deps
  const labels = useMemo(() => list.map((s, i) => labelTexture(`Floor ${String(i + 1).padStart(2, "0")}`, s.title, accent)), [list, accent]);
  useEffect(() => () => labels.forEach((l) => l.dispose()), [labels]);
  return (
    <group position={at?.pos ?? [-9.2, 0, 1.6]} rotation={[0, at?.rotY ?? 0.95, 0]}>
      <mesh position={[0, (list.length * 0.78 + 0.6) / 2, -0.1]}><boxGeometry args={[0.1, list.length * 0.78 + 0.6, 0.1]} /><meshStandardMaterial color="#AFC2BC" metalness={0.9} roughness={0.25} /></mesh>
      {list.map((s, i) => (
        <group key={s.key} position={[0, 0.6 + i * 0.78, 0]}
          onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = "pointer"; audio.cue("hover"); }}
          onPointerOut={() => { document.body.style.cursor = ""; }}
          onClick={(e) => { e.stopPropagation(); events.current.onHotspot(s.key); }}>
          <mesh position={[0.18, 0, 0]}><sphereGeometry args={[0.13, 16, 12]} /><meshBasicMaterial color={accent} toneMapped={false} /></mesh>
          <mesh position={[2.05, 0, 0]}><planeGeometry args={[3.5, 0.55]} /><meshBasicMaterial map={labels[i]} transparent /></mesh>
        </group>
      ))}
    </group>
  );
}
