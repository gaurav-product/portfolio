import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import gsap from "gsap";
import type { District } from "~/content/districts";

/** Procedural, abstract architecture — not a depiction of real facilities.
 *  Each district has its own silhouette (a design device, not a claim):
 *  Product Leadership — a stepped ascent to a summit spire (strategy → delivery)
 *  HealthTech Innovation — a care dome
 *  AI & Safety Lab — a contained geodesic core inside a guard ring
 *  Research & Analytics — towers rising like a bar chart
 *  Professional Experience — a working skyline
 *  Knowledge & Headquarters — a tiered rotunda under the halo */
const HOME = { pos: new THREE.Vector3(0, 21, 27), target: new THREE.Vector3(0, 0, 1.5) };
const C = { green: new THREE.Color("#6BE39A"), cyan: new THREE.Color("#35D6D0"), body: new THREE.Color("#16231F"), ground: new THREE.Color("#0B1110"), road: new THREE.Color("#121D19") };
const PLAZA = 2.9;

function rng(seed: number) { let s = seed; return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646; }

/** A solid with a glowing outline — the one building block of the city. */
function Solid({ geo, position, rotation, tone, lit }: { geo: THREE.BufferGeometry; position?: [number, number, number]; rotation?: [number, number, number]; tone: THREE.Color; lit: boolean }) {
  const edges = useMemo(() => new THREE.EdgesGeometry(geo, 20), [geo]);
  return (
    <group position={position} rotation={rotation}>
      <mesh geometry={geo}><meshLambertMaterial color={C.body} emissive={tone} emissiveIntensity={lit ? 0.16 : 0.04} /></mesh>
      <lineSegments geometry={edges}><lineBasicMaterial color={tone} transparent opacity={lit ? 1 : 0.62} /></lineSegments>
    </group>
  );
}

function Architecture({ id, tone, lit, seed }: { id: string; tone: THREE.Color; lit: boolean; seed: number }) {
  const parts = useMemo(() => {
    const box = (w: number, h: number, d = w) => new THREE.BoxGeometry(w, h, d);
    const cyl = (r: number, h: number, rt = r) => new THREE.CylinderGeometry(rt, r, h, 28, 1);
    type P = { geo: THREE.BufferGeometry; p: [number, number, number]; r?: [number, number, number] };
    const out: P[] = [];
    switch (id) {
      case "product-leadership": {
        // stepped terraces climbing to a summit spire
        const steps = [[2.6, 0.5], [2.0, 0.6], [1.45, 0.7], [0.95, 0.8]];
        let y = 0;
        for (const [w, h] of steps) { out.push({ geo: box(w, h), p: [0, y + h / 2, 0] }); y += h; }
        out.push({ geo: cyl(0.12, 1.6, 0.02), p: [0, y + 0.8, 0] });
        break;
      }
      case "healthtech-innovation": {
        out.push({ geo: cyl(2.15, 0.35), p: [0, 0.175, 0] });
        out.push({ geo: new THREE.SphereGeometry(1.95, 24, 8, 0, Math.PI * 2, 0, Math.PI / 2), p: [0, 0.35, 0] });
        out.push({ geo: cyl(0.35, 0.9, 0.25), p: [0, 2.4, 0] });
        break;
      }
      case "ai-safety-lab": {
        out.push({ geo: cyl(1.25, 0.9, 1.0), p: [0, 0.45, 0] });
        out.push({ geo: new THREE.IcosahedronGeometry(1.25, 1), p: [0, 2.25, 0] });
        out.push({ geo: new THREE.TorusGeometry(2.1, 0.06, 6, 48), p: [0, 2.25, 0], r: [Math.PI / 2.3, 0, 0] });
        break;
      }
      case "research-analytics": {
        // bars rising left to right, like a chart
        [0.9, 1.5, 2.2, 3.0, 3.9].forEach((h, i) => out.push({ geo: box(0.7, h, 0.9), p: [-1.8 + i * 0.9, h / 2, 0.2 - i * 0.12] }));
        break;
      }
      case "professional-experience": {
        const r = rng(seed + 11);
        for (let i = 0; i < 7; i++) {
          const a = (i / 7) * Math.PI * 2 + r() * 0.4, dist = i === 0 ? 0 : 1.1 + r() * 0.9;
          const h = i === 0 ? 4.2 : 1.2 + r() * 2.6, w = 0.5 + r() * 0.35;
          out.push({ geo: box(w, h, w), p: [Math.cos(a) * dist, h / 2, Math.sin(a) * dist] });
        }
        break;
      }
      default: { // knowledge-hq — tiered rotunda
        out.push({ geo: cyl(2.3, 0.6), p: [0, 0.3, 0] });
        out.push({ geo: cyl(1.7, 0.9, 1.55), p: [0, 1.05, 0] });
        out.push({ geo: cyl(1.05, 1.1, 0.85), p: [0, 2.05, 0] });
        out.push({ geo: new THREE.SphereGeometry(0.75, 16, 8), p: [0, 2.85, 0] });
      }
    }
    return out;
  }, [id, seed]);
  return <>{parts.map((x, i) => <Solid key={i} geo={x.geo} position={x.p} rotation={x.r} tone={tone} lit={lit} />)}</>;
}

/** A lit sign at the plaza edge with the district's name — typography built into the world.
 *  Decorative: the accessible name lives on the HTML district button. */
function Sign({ d, tone, lit, offsetX = 0 }: { d: District; tone: THREE.Color; lit: boolean; offsetX?: number }) {
  const tex = useMemo(() => {
    const cv = document.createElement("canvas"); cv.width = 1024; cv.height = 192;
    const g = cv.getContext("2d")!;
    g.fillStyle = "#0E1714"; g.fillRect(0, 0, cv.width, cv.height);
    g.fillStyle = `#${tone.getHexString()}`;
    g.font = "500 44px 'IBM Plex Mono', ui-monospace, monospace"; g.textBaseline = "middle";
    g.fillText(d.index, 44, 96);
    g.fillStyle = "#F3F6F4";
    g.font = "700 64px 'Space Grotesk', ui-sans-serif, system-ui, sans-serif";
    let size = 64; while (g.measureText(d.name).width > 820 && size > 36) { size -= 2; g.font = `700 ${size}px 'Space Grotesk', ui-sans-serif, system-ui, sans-serif`; }
    g.fillText(d.name, 140, 100);
    const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
    return t;
  }, [d, tone]);
  useEffect(() => () => tex.dispose(), [tex]);
  const W = 4.4, H = W * 192 / 1024;
  // leans back toward the default camera so the name reads from above the city
  return (
    <group position={[offsetX, 0, PLAZA + 0.45]}>
      {[-W / 2 + 0.25, W / 2 - 0.25].map((x) => <mesh key={x} position={[x, 0.25, -0.05]}><boxGeometry args={[0.07, 0.5, 0.07]} /><meshLambertMaterial color={C.body} /></mesh>)}
      <group position-y={0.5} rotation-x={-0.55}>
        <mesh position-y={H / 2}><planeGeometry args={[W, H]} /><meshBasicMaterial map={tex} toneMapped={false} /></mesh>
        <mesh position={[0, 0.015, 0.003]}><planeGeometry args={[W, 0.035]} /><meshBasicMaterial color={tone} transparent opacity={lit ? 1 : 0.7} /></mesh>
      </group>
    </group>
  );
}

function DistrictBlock({ d, selected, onSelect, seed }: { d: District; selected: boolean; onSelect: () => void; seed: number }) {
  const tone = d.tone === "green" ? C.green : C.cyan;
  const ref = useRef<THREE.Group>(null);
  // on-demand rendering: keep requesting frames only while the lift animation is settling
  useFrame((state, dt) => {
    const g = ref.current; if (!g) return;
    const goal = selected ? 0.25 : 0;
    g.position.y = THREE.MathUtils.damp(g.position.y, goal, 6, Math.min(dt, 0.05));
    if (Math.abs(g.position.y - goal) > 0.001) state.invalidate(); else g.position.y = goal;
  });
  return (
    <group position={[d.pos[0], 0, d.pos[1]]}>
      <group ref={ref}
        onClick={(e) => { e.stopPropagation(); onSelect(); }}
        onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = "pointer"; }}
        onPointerOut={() => { document.body.style.cursor = ""; }}>
        <mesh rotation-x={-Math.PI / 2} position-y={0.01}><circleGeometry args={[PLAZA, 48]} /><meshBasicMaterial color={tone} transparent opacity={selected ? 0.14 : 0.05} /></mesh>
        <mesh rotation-x={-Math.PI / 2} position-y={0.02}><ringGeometry args={[PLAZA - 0.05, PLAZA + 0.05, 72]} /><meshBasicMaterial color={tone} transparent opacity={selected ? 0.9 : 0.35} /></mesh>
        <Architecture id={d.id} tone={tone} lit={selected} seed={seed} />
      </group>
      <Sign d={d} tone={tone} lit={selected} offsetX={d.id === "knowledge-hq" ? 0.7 : 0} />
    </group>
  );
}

/** Roads from the headquarters to every district, with a lit centre line. */
function Roads({ districts }: { districts: District[] }) {
  const roads = useMemo(() => districts.filter((d) => d.pos[0] !== 0 || d.pos[1] !== 0).map((d) => {
    const v = new THREE.Vector2(d.pos[0], d.pos[1]); const len = v.length() - PLAZA * 2;
    const mid = v.clone().normalize().multiplyScalar(PLAZA + len / 2);
    return { id: d.id, len, x: mid.x, z: mid.y, rot: Math.atan2(d.pos[0], d.pos[1]), tone: d.tone === "green" ? C.green : C.cyan };
  }), [districts]);
  return <>{roads.map((r) => (
    <group key={r.id} position={[r.x, 0, r.z]} rotation-y={r.rot}>
      <mesh rotation-x={-Math.PI / 2} position-y={0.005}><planeGeometry args={[0.95, r.len]} /><meshBasicMaterial color={C.road} /></mesh>
      <mesh rotation-x={-Math.PI / 2} position-y={0.012}><planeGeometry args={[0.05, r.len]} /><meshBasicMaterial color={r.tone} transparent opacity={0.55} /></mesh>
      {[-0.47, 0.47].map((x) => <mesh key={x} rotation-x={-Math.PI / 2} position={[x, 0.011, 0]}><planeGeometry args={[0.02, r.len]} /><meshBasicMaterial color={r.tone} transparent opacity={0.18} /></mesh>)}
    </group>
  ))}</>;
}

function Rig({ selected, districts, resetKey, labels, reduced }: { selected: string | null; districts: District[]; resetKey: number; labels: React.MutableRefObject<Record<string, HTMLElement | null>>; reduced: boolean }) {
  const { camera, gl, size, invalidate } = useThree();
  const controls = useRef<OrbitControls | null>(null);
  useEffect(() => {
    const c = new OrbitControls(camera, gl.domElement);
    c.enableDamping = true; c.maxPolarAngle = Math.PI / 2.2; c.minDistance = 8; c.maxDistance = 42; c.enablePan = false; c.target.copy(HOME.target);
    controls.current = c;
    const onChange = () => invalidate();
    c.addEventListener("change", onChange);
    return () => { c.removeEventListener("change", onChange); c.dispose(); };
  }, [camera, gl, invalidate]);
  useEffect(() => {
    const c = controls.current; if (!c) return;
    const d = districts.find((x) => x.id === selected);
    // the district panel covers the right of the scene on wide screens, so frame the stop left of centre there
    const shift = size.width >= 900 ? Math.min(4, size.width / 400) : 0;
    const to = d ? { pos: new THREE.Vector3(d.pos[0] * 1.25 + shift, 11.5, d.pos[1] * 1.25 + 15), target: new THREE.Vector3(d.pos[0] + shift, 1, d.pos[1]) } : HOME;
    // glide along an arc that rises over the city between stops, rather than a straight cut
    const from = camera.position.clone(), fromT = c.target.clone();
    const lift = Math.min(8, from.distanceTo(to.pos) * 0.35);
    const ctrl = from.clone().lerp(to.pos, 0.5).add(new THREE.Vector3(0, lift, 0));
    const path = new THREE.QuadraticBezierCurve3(from, ctrl, to.pos);
    const s = { t: 0 };
    const step = () => { path.getPoint(s.t, camera.position); c.target.lerpVectors(fromT, to.target, s.t); invalidate(); };
    const tween = gsap.to(s, { t: 1, duration: reduced ? 0 : 1.9, ease: "power2.inOut", onUpdate: step, onComplete: step });
    invalidate();
    return () => { tween.kill(); };
  // eslint-disable-next-line react-hooks/exhaustive-deps -- re-framing on every resize would fight the user's orbit
  }, [selected, resetKey, districts, camera, reduced, invalidate]);
  const v = useMemo(() => new THREE.Vector3(), []);
  const last = useRef<Record<string, string>>({});
  useFrame(() => {
    controls.current?.update(); // emits "change" while damping, which requests the next frame
    for (const d of districts) {
      const el = labels.current[d.id]; if (!el) continue;
      v.set(d.pos[0], 5.4, d.pos[1]).project(camera);
      // whole pixels, written only when changed: no sub-pixel jitter, stable click targets
      const t = `translate(-50%, -100%) translate(${Math.round(((v.x + 1) / 2) * size.width)}px, ${Math.round(((1 - v.y) / 2) * size.height)}px)`;
      if (last.current[d.id] !== t) { el.style.transform = t; last.current[d.id] = t; }
      el.style.opacity = v.z < 1 ? "1" : "0";
    }
  });
  return null;
}

export default function Scene({ districts, selected, onSelect, resetKey, labels, reduced }:
  { districts: District[]; selected: string | null; onSelect: (id: string | null) => void; resetKey: number; labels: React.MutableRefObject<Record<string, HTMLElement | null>>; reduced: boolean }) {
  // The city assembles one district at a time — headquarters first, then outward. Besides the
  // effect, this splits the first render's GPU upload into small tasks instead of one long block.
  const order = useMemo(() => [...districts].sort((a, b) => Math.hypot(...a.pos) - Math.hypot(...b.pos)), [districts]);
  const [built, setBuilt] = useState(0);
  useEffect(() => {
    if (built >= order.length) return;
    const t = setTimeout(() => setBuilt((n) => n + 1), built === 0 ? 0 : reduced ? 0 : 90);
    return () => clearTimeout(t);
  }, [built, order.length, reduced]);
  const shown = new Set(order.slice(0, built).map((d) => d.id));
  return (
    <Canvas frameloop="demand" camera={{ position: HOME.pos.toArray(), fov: 45, near: 0.1, far: 200 }} dpr={[1, 1.75]} gl={{ antialias: true, powerPreference: "high-performance" }}
      onPointerMissed={() => onSelect(null)} aria-hidden
      // production build: skip the synchronous shader-status check, which blocks the main thread while programs compile
      onCreated={({ gl }) => { if (!import.meta.env.DEV) gl.debug.checkShaderErrors = false; }}>
      <color attach="background" args={[C.ground]} />
      <fog attach="fog" args={[C.ground, 32, 72]} />
      <hemisphereLight args={["#cfe9dc", "#0B1110", 0.45]} />
      <directionalLight position={[10, 18, 8]} intensity={1.0} />
      <directionalLight position={[-12, 8, -10]} intensity={0.25} color="#35D6D0" />
      <gridHelper args={[80, 40, "#1B3A2D", "#13201C"]} position-y={0} />
      {/* HQ halo — floats above the Knowledge & Headquarters district at the centre */}
      <group position-y={5.4}>
        <mesh><torusGeometry args={[1.3, 0.05, 12, 96]} /><meshBasicMaterial color={C.green} /></mesh>
        <mesh rotation-x={Math.PI / 2.4}><torusGeometry args={[1.9, 0.025, 8, 96]} /><meshBasicMaterial color={C.cyan} transparent opacity={0.7} /></mesh>
      </group>
      {built >= order.length && <Roads districts={districts} />}
      {districts.map((d, i) => shown.has(d.id) && <DistrictBlock key={d.id} d={d} seed={i * 97} selected={selected === d.id} onSelect={() => onSelect(d.id)} />)}
      <Rig selected={selected} districts={districts} resetKey={resetKey} labels={labels} reduced={reduced} />
    </Canvas>
  );
}
