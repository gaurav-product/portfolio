import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
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
/** Opening shot: high above and far back, so the intro descends onto the city. */
const INTRO = new THREE.Vector3(0, 52, 78);
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

/** Traffic: soft light pulses flowing along each road, out from headquarters and back — the city is busy.
 *  One instanced mesh for all of them. Decorative motion only (no data): static when `live` is false
 *  (reduced motion, software rendering, or off screen). */
function Traffic({ districts, live }: { districts: District[]; live: boolean }) {
  const lanes = useMemo(() => districts.filter((d) => d.pos[0] !== 0 || d.pos[1] !== 0).map((d) => {
    const dir = new THREE.Vector2(d.pos[0], d.pos[1]); const len = dir.length(); dir.normalize();
    return { dir, from: PLAZA * 0.9, to: len - PLAZA * 0.9, side: new THREE.Vector2(-dir.y, dir.x), tone: d.tone === "green" ? C.green : C.cyan };
  }), [districts]);
  const PER = 7;
  const mesh = useMemo(() => {
    const g = new THREE.CapsuleGeometry(0.07, 0.42, 4, 8); g.rotateX(Math.PI / 2);
    const m = new THREE.MeshBasicMaterial({ toneMapped: false, transparent: true, opacity: 0.9 });
    const im = new THREE.InstancedMesh(g, m, lanes.length * PER);
    lanes.forEach((l, i) => { for (let k = 0; k < PER; k++) im.setColorAt(i * PER + k, l.tone); });
    return im;
  }, [lanes]);
  useEffect(() => () => { mesh.geometry.dispose(); (mesh.material as THREE.Material).dispose(); mesh.dispose(); }, [mesh]);
  const o = useMemo(() => new THREE.Object3D(), []);
  const place = (t: number) => {
    lanes.forEach((l, i) => {
      for (let k = 0; k < PER; k++) {
        const outbound = k % 2 === 0, phase = (k / PER + t * (0.05 + (k % 3) * 0.012)) % 1;
        const along = l.from + (outbound ? phase : 1 - phase) * (l.to - l.from), lane = outbound ? 0.22 : -0.22;
        o.position.set(l.dir.x * along + l.side.x * lane, 0.09, l.dir.y * along + l.side.y * lane);
        o.rotation.set(0, Math.atan2(l.dir.x, l.dir.y), 0);
        o.updateMatrix(); mesh.setMatrixAt(i * PER + k, o.matrix);
      }
    });
    mesh.instanceMatrix.needsUpdate = true;
  };
  useEffect(() => { place(0); }, [mesh]); // eslint-disable-line react-hooks/exhaustive-deps
  useFrame((state) => { if (live) place(state.clock.elapsedTime); });
  return <primitive object={mesh} raycast={() => null} />;
}

/** Bloom on capable GPUs only: the glow is what makes the city read as light rather than wireframe. */
function Bloom() {
  const { gl, scene, camera, size } = useThree();
  const composer = useMemo(() => {
    const c = new EffectComposer(gl);
    c.addPass(new RenderPass(scene, camera));
    c.addPass(new UnrealBloomPass(new THREE.Vector2(size.width, size.height), 0.6, 0.55, 0.6));
    c.addPass(new OutputPass());
    return c;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gl, scene, camera]);
  useEffect(() => { composer.setPixelRatio(gl.getPixelRatio()); composer.setSize(size.width, size.height); }, [composer, gl, size]);
  useEffect(() => () => composer.dispose(), [composer]);
  useFrame(() => composer.render(), 1); // priority 1 takes over rendering from the default pass
  return null;
}

function radialTexture(color: THREE.Color) {
  const cv = document.createElement("canvas"); cv.width = cv.height = 128;
  const g = cv.getContext("2d")!; const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  const rgb = `${Math.round(color.r * 255)},${Math.round(color.g * 255)},${Math.round(color.b * 255)}`;
  grad.addColorStop(0, `rgba(${rgb},1)`); grad.addColorStop(1, `rgba(${rgb},0)`); g.fillStyle = grad; g.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(cv);
}

/** Sky, drifting light and pools of glow under each district. */
function Atmosphere({ districts, live }: { districts: District[]; live: boolean }) {
  const stars = useMemo(() => {
    const r = rng(42), pts: number[] = [];
    for (let i = 0; i < 700; i++) { const th = r() * Math.PI * 2, ph = r() * Math.PI * 0.42; pts.push(Math.cos(th) * Math.sin(ph) * 95, Math.cos(ph) * 95 - 8, Math.sin(th) * Math.sin(ph) * 95); }
    const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3)); return g;
  }, []);
  const dust = useMemo(() => {
    const r = rng(7), pts: number[] = [];
    for (let i = 0; i < 420; i++) pts.push((r() - 0.5) * 56, 0.5 + r() * 12, (r() - 0.5) * 56);
    const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3)); return g;
  }, []);
  const pools = useMemo(() => ({ green: radialTexture(C.green), cyan: radialTexture(C.cyan) }), []);
  const dustRef = useRef<THREE.Points>(null);
  useFrame((state, dt) => {
    if (!live || !dustRef.current) return;
    dustRef.current.rotation.y += Math.min(dt, 0.05) * 0.015; dustRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.4;
  });
  return (
    <>
      <points geometry={stars}><pointsMaterial color="#cfe9dc" size={1.6} sizeAttenuation={false} transparent opacity={0.7} fog={false} depthWrite={false} /></points>
      <points ref={dustRef} geometry={dust}><pointsMaterial color={C.green} size={0.09} transparent opacity={0.55} depthWrite={false} blending={THREE.AdditiveBlending} /></points>
      {districts.map((d) => (
        <mesh key={d.id} rotation-x={-Math.PI / 2} position={[d.pos[0], 0.008, d.pos[1]]}>
          <planeGeometry args={[11, 11]} />
          <meshBasicMaterial map={d.tone === "green" ? pools.green : pools.cyan} transparent opacity={0.16} depthWrite={false} blending={THREE.AdditiveBlending} />
        </mesh>
      ))}
    </>
  );
}

/** Keeps the city alive (halo turning, light drifting) on capable GPUs, only while the scene is on screen. */
function Pulse({ live }: { live: boolean }) {
  const halo = useRef<THREE.Group>(null);
  useFrame((state, dt) => {
    if (!halo.current) return;
    if (live) { halo.current.rotation.y += Math.min(dt, 0.05) * 0.3; state.invalidate(); }
  });
  return (
    <group ref={halo} position-y={5.4}>
      <mesh><torusGeometry args={[1.3, 0.05, 12, 96]} /><meshBasicMaterial color={C.green} /></mesh>
      <mesh rotation-x={Math.PI / 2.4}><torusGeometry args={[1.9, 0.025, 8, 96]} /><meshBasicMaterial color={C.cyan} transparent opacity={0.7} /></mesh>
    </group>
  );
}

function Rig({ selected, districts, resetKey, labels, reduced, intro, onIntroDone }: { selected: string | null; districts: District[]; resetKey: number; labels: React.MutableRefObject<Record<string, HTMLElement | null>>; reduced: boolean; intro: React.MutableRefObject<boolean>; onIntroDone: () => void }) {
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
    const opening = intro.current; intro.current = false;
    const dist = from.distanceTo(to.pos);
    if (dist < 0.01 && fromT.distanceTo(to.target) < 0.01) { if (opening) onIntroDone(); return; } // nothing to move
    const lift = opening ? 0 : Math.min(8, dist * 0.35);
    const ctrl = from.clone().lerp(to.pos, 0.5).add(new THREE.Vector3(0, lift, 0));
    const path = new THREE.QuadraticBezierCurve3(from, ctrl, to.pos);
    const s = { t: 0 };
    const step = () => { path.getPoint(s.t, camera.position); c.target.lerpVectors(fromT, to.target, s.t); invalidate(); };
    const tween = gsap.to(s, { t: 1, duration: reduced ? 0 : opening ? 3.6 : 1.9, ease: opening ? "power3.inOut" : "power2.inOut", onUpdate: step,
      onComplete: () => { step(); if (opening) onIntroDone(); } });
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

export type Tier = "full" | "lite";
export default function Scene({ districts, selected, onSelect, resetKey, labels, reduced, intro = false, onIntroDone = () => {}, onTier = () => {}, forceTier }:
  { districts: District[]; selected: string | null; onSelect: (id: string | null) => void; resetKey: number; labels: React.MutableRefObject<Record<string, HTMLElement | null>>; reduced: boolean;
    intro?: boolean; onIntroDone?: () => void; onTier?: (t: Tier) => void; forceTier?: Tier }) {
  // Device tier: a software renderer (no GPU) gets the same city without bloom, ambient motion or the fly-in.
  const [tier, setTier] = useState<Tier | null>(null);
  const introRef = useRef(intro);
  const [visible, setVisible] = useState(true);
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = host.current; if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting)); io.observe(el);
    return () => io.disconnect();
  }, []);
  const live = tier === "full" && !reduced && visible;
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
    <div ref={host} className="h-full w-full">
    <Canvas frameloop="demand" camera={{ position: (intro ? INTRO : HOME.pos).toArray(), fov: 45, near: 0.1, far: 220 }} dpr={[1, 1.75]} gl={{ antialias: true, powerPreference: "high-performance" }}
      onPointerMissed={() => onSelect(null)} aria-hidden
      // production build: skip the synchronous shader-status check, which blocks the main thread while programs compile
      onCreated={({ gl, camera }) => {
        if (!import.meta.env.DEV) gl.debug.checkShaderErrors = false;
        const ctx = gl.getContext(); const ext = ctx.getExtension("WEBGL_debug_renderer_info");
        const name = String(ext ? ctx.getParameter(ext.UNMASKED_RENDERER_WEBGL) : ctx.getParameter(ctx.RENDERER));
        const t: Tier = forceTier ?? (/swiftshader|llvmpipe|software|basic render/i.test(name) ? "lite" : "full"); // ?tier= overrides, for QA
        if (t === "lite" && introRef.current) { introRef.current = false; camera.position.copy(HOME.pos); camera.lookAt(HOME.target); onIntroDone(); }
        setTier(t); onTier(t);
      }}>
      <color attach="background" args={[C.ground]} />
      <fog attach="fog" args={[C.ground, 34, 84]} />
      <hemisphereLight args={["#cfe9dc", "#0B1110", 0.45]} />
      <directionalLight position={[10, 18, 8]} intensity={1.0} />
      <directionalLight position={[-12, 8, -10]} intensity={0.25} color="#35D6D0" />
      <gridHelper args={[80, 40, "#1B3A2D", "#13201C"]} position-y={0} />
      {/* HQ halo — floats above the Knowledge & Headquarters district at the centre */}
      <Pulse live={live} />
      <Atmosphere districts={districts} live={live} />
      {tier === "full" && <Bloom />}
      {built >= order.length && <Roads districts={districts} />}
      {built >= order.length && <Traffic districts={districts} live={live} />}
      {districts.map((d, i) => shown.has(d.id) && <DistrictBlock key={d.id} d={d} seed={i * 97} selected={selected === d.id} onSelect={() => onSelect(d.id)} />)}
      {tier && <Rig selected={selected} districts={districts} resetKey={resetKey} labels={labels} reduced={reduced} intro={introRef} onIntroDone={onIntroDone} />}
    </Canvas>
    </div>
  );
}
