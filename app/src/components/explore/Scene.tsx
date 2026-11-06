import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import gsap from "gsap";
import type { District } from "~/content/districts";

/** Procedural, abstract architecture — not a depiction of real facilities. */
const HOME = { pos: new THREE.Vector3(0, 19, 24), target: new THREE.Vector3(0, 0, 0) };
const C = { green: new THREE.Color("#6BE39A"), cyan: new THREE.Color("#35D6D0"), body: new THREE.Color("#16231F"), ground: new THREE.Color("#0B1110") };

function rng(seed: number) { let s = seed; return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646; }

function DistrictBlock({ d, selected, onSelect, seed }: { d: District; selected: boolean; onSelect: () => void; seed: number }) {
  const tone = d.tone === "green" ? C.green : C.cyan;
  const towers = useMemo(() => {
    const r = rng(seed + 11);
    return Array.from({ length: 6 }, (_, i) => {
      const a = (i / 6) * Math.PI * 2 + r();
      const dist = 0.6 + r() * 1.6;
      const h = 0.8 + r() * (i === 0 ? 3.6 : 2.4);
      return { x: Math.cos(a) * dist, z: Math.sin(a) * dist, w: 0.6 + r() * 0.5, h };
    });
  }, [seed]);
  const ref = useRef<THREE.Group>(null);
  // on-demand rendering: keep requesting frames only while the lift animation is settling
  useFrame((state, dt) => {
    const g = ref.current; if (!g) return;
    const goal = selected ? 0.25 : 0;
    g.position.y = THREE.MathUtils.damp(g.position.y, goal, 6, Math.min(dt, 0.05));
    if (Math.abs(g.position.y - goal) > 0.001) state.invalidate(); else g.position.y = goal;
  });
  return (
    <group ref={ref} position={[d.pos[0], 0, d.pos[1]]}
      onClick={(e) => { e.stopPropagation(); onSelect(); }}
      onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = "pointer"; }}
      onPointerOut={() => { document.body.style.cursor = ""; }}>
      <mesh rotation-x={-Math.PI / 2} position-y={0.01}><circleGeometry args={[2.9, 48]} /><meshBasicMaterial color={tone} transparent opacity={selected ? 0.16 : 0.06} /></mesh>
      <mesh rotation-x={-Math.PI / 2} position-y={0.02}><ringGeometry args={[2.85, 2.95, 64]} /><meshBasicMaterial color={tone} transparent opacity={selected ? 0.9 : 0.35} /></mesh>
      {towers.map((t, i) => (
        <group key={i} position={[t.x, t.h / 2, t.z]}>
          <mesh><boxGeometry args={[t.w, t.h, t.w]} /><meshStandardMaterial color={C.body} emissive={tone} emissiveIntensity={selected ? 0.18 : 0.06} roughness={0.6} metalness={0.3} /></mesh>
          <lineSegments><edgesGeometry args={[new THREE.BoxGeometry(t.w, t.h, t.w)]} /><lineBasicMaterial color={tone} transparent opacity={selected ? 0.95 : 0.5} /></lineSegments>
        </group>
      ))}
      <mesh position={[0, towers[0].h + 0.9, 0]}><sphereGeometry args={[0.16, 16, 16]} /><meshBasicMaterial color={tone} /></mesh>
    </group>
  );
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
    const to = d ? { pos: new THREE.Vector3(d.pos[0] * 1.3, 10.5, d.pos[1] * 1.3 + 12.5), target: new THREE.Vector3(d.pos[0], 0.5, d.pos[1]) } : HOME;
    const dur = reduced ? 0 : 1.4;
    const tl = gsap.timeline({ onUpdate: () => invalidate(), onComplete: () => invalidate() });
    tl.to(camera.position, { x: to.pos.x, y: to.pos.y, z: to.pos.z, duration: dur, ease: "power3.inOut" }, 0)
      .to(c.target, { x: to.target.x, y: to.target.y, z: to.target.z, duration: dur, ease: "power3.inOut" }, 0);
    invalidate();
    return () => { tl.kill(); };
  }, [selected, resetKey, districts, camera, reduced, invalidate]);
  const v = useMemo(() => new THREE.Vector3(), []);
  const last = useRef<Record<string, string>>({});
  useFrame(() => {
    controls.current?.update(); // emits "change" while damping, which requests the next frame
    for (const d of districts) {
      const el = labels.current[d.id]; if (!el) continue;
      v.set(d.pos[0], 4.6, d.pos[1]).project(camera);
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
  return (
    <Canvas frameloop="demand" camera={{ position: HOME.pos.toArray(), fov: 45, near: 0.1, far: 200 }} dpr={[1, 1.75]} gl={{ antialias: true, powerPreference: "high-performance" }}
      onPointerMissed={() => onSelect(null)} aria-hidden>
      <color attach="background" args={[C.ground]} />
      <fog attach="fog" args={[C.ground, 30, 70]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 18, 8]} intensity={1.1} />
      <gridHelper args={[80, 40, "#1f6b1f", "#16231F"]} position-y={0} />
      {/* HQ halo — floats above the Knowledge & Headquarters district at the centre */}
      <group position-y={5.2}>
        <mesh><torusGeometry args={[1.3, 0.05, 12, 96]} /><meshBasicMaterial color={C.green} /></mesh>
        <mesh rotation-x={Math.PI / 2.4}><torusGeometry args={[1.9, 0.025, 8, 96]} /><meshBasicMaterial color={C.cyan} transparent opacity={0.7} /></mesh>
      </group>
      {districts.map((d, i) => <DistrictBlock key={d.id} d={d} seed={i * 97} selected={selected === d.id} onSelect={() => onSelect(d.id)} />)}
      <Rig selected={selected} districts={districts} resetKey={resetKey} labels={labels} reduced={reduced} />
    </Canvas>
  );
}
