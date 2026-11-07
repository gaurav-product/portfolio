import { useEffect, useMemo, useRef, type MutableRefObject, type ReactNode } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import gsap from "gsap";
import type { Destination, BuildingSpec, GalleryItem } from "~/content/universe";
import type { SceneApi, SceneEvents, Tier } from "./bus";
import { windowsTexture, labelTexture, boardTexture, chartTexture } from "./textures";
import { audio } from "./audio";
import { asset } from "~/lib/meta";

/* A project's world: an original, procedural building on a plaza, the project's
 * real images on display stands, and a floor directory for the case study.
 * The architecture is a design device — not a depiction of a real facility. */
const TARGET = new THREE.Vector3(0, 2.4, 0);
const VIEW = new THREE.Vector3(9.5, 4.6, 15.5);

export function WorldView({ d, tier, reduced, events, api, hotspots, fromEarth }: {
  d: Destination; tier: Tier; reduced: boolean; events: MutableRefObject<SceneEvents>; api: MutableRefObject<SceneApi | null>;
  hotspots: { key: string; title: string }[]; fromEarth: boolean;
}) {
  const { camera, gl, scene, invalidate } = useThree();
  const pal = d.building.palette;

  /* reflections from a neutral studio environment (not on phones) */
  useEffect(() => {
    if (tier === "mobile") return;
    const pm = new THREE.PMREMGenerator(gl); const env = pm.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = env; scene.environmentIntensity = 0.55;
    return () => { scene.environment = null; env.dispose(); pm.dispose(); };
  }, [gl, scene, tier]);

  const controls = useMemo(() => {
    const c = new OrbitControls(camera, gl.domElement);
    c.target.copy(TARGET); c.enablePan = false; c.enableDamping = true; c.dampingFactor = 0.08;
    c.minDistance = 7; c.maxDistance = 30; c.maxPolarAngle = Math.PI / 2 - 0.06; c.minPolarAngle = 0.25;
    c.autoRotate = !reduced; c.autoRotateSpeed = 0.35;
    return c;
  }, [camera, gl, reduced]);
  const animating = useRef(false);
  useEffect(() => {
    const stopAuto = () => { controls.autoRotate = false; };
    controls.addEventListener("start", stopAuto);
    const tl = { k: null as gsap.core.Tween | null };
    const settle = () => { animating.current = false; controls.enabled = true; controls.update(); };
    if (reduced || !fromEarth) { camera.position.copy(reduced ? VIEW : new THREE.Vector3(16, 9, 26)); camera.lookAt(TARGET); }
    if (!reduced) {
      animating.current = true; controls.enabled = false;
      if (fromEarth) { camera.position.set(0, 26, 46); audio.cue("building"); }
      tl.k = gsap.to(camera.position, { x: VIEW.x, y: VIEW.y, z: VIEW.z, duration: fromEarth ? 3 : 1.8, ease: "power3.out", onUpdate: () => { camera.lookAt(TARGET); invalidate(); }, onComplete: settle });
    } else controls.update();
    events.current.onReady(d.slug);
    api.current = {
      rotate(dx, dy) { controls.autoRotate = false; const o = camera.position.clone().sub(TARGET), s = new THREE.Spherical().setFromVector3(o); s.theta -= dx; s.phi = THREE.MathUtils.clamp(s.phi - dy, 0.25, Math.PI / 2 - 0.06); camera.position.copy(TARGET).add(new THREE.Vector3().setFromSpherical(s)); controls.update(); invalidate(); },
      zoom(f) { const o = camera.position.clone().sub(TARGET); o.setLength(THREE.MathUtils.clamp(o.length() * f, 7, 30)); camera.position.copy(TARGET).add(o); controls.update(); invalidate(); },
      face() { /* globe only */ }, fly() { /* globe only */ },
      skipIntro() { tl.k?.progress(1); }, replayIntro() { /* globe only */ },
    };
    return () => { tl.k?.kill(); controls.removeEventListener("start", stopAuto); controls.dispose(); api.current = null; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useFrame(() => { if (!animating.current) controls.update(); });
  /* on wide screens the case-study panel covers the right: shift the picture so the building sits in the open area */
  const { size } = useThree();
  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    const shift = size.width >= 900 ? Math.min(250, size.width * 0.17) : 0;
    if (shift) cam.setViewOffset(size.width, size.height, shift, 0, size.width, size.height); else cam.clearViewOffset();
    invalidate();
    return () => { cam.clearViewOffset(); };
  }, [camera, size, invalidate]);

  const panels = d.gallery.slice(0, tier === "mobile" ? 4 : 8);
  return (
    <>
      <hemisphereLight args={["#CFEFE6", "#0B1110", 0.55]} />
      <directionalLight position={[10, 16, 8]} intensity={1.5} color="#FFF4E6" />
      <pointLight position={[0, 3, 5]} intensity={18} distance={20} color={pal.light} />
      <pointLight position={[-6, 6, -4]} intensity={10} distance={22} color={pal.accent} />
      <Plaza accent={pal.accent} />
      <Building spec={d.building} seed={d.slug.length * 31} />
      {panels.map((g, i) => <Panel key={i} item={g} index={i} count={panels.length} accent={pal.accent} events={events} />)}
      {hotspots.length > 0 && <Directory items={hotspots} accent={pal.accent} events={events} />}
    </>
  );
}

/* ---------------------------------------------------------------- plaza */
function Plaza({ accent }: { accent: string }) {
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
function useMats(spec: BuildingSpec, seed: number) {
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
type Mats = ReturnType<typeof useMats>;

function Building({ spec, seed }: { spec: BuildingSpec; seed: number }) {
  const m = useMats(spec, seed);
  useEffect(() => () => { Object.values(m).forEach((x) => (x as { dispose?: () => void }).dispose?.()); }, [m]);
  const B: Record<BuildingSpec["archetype"], () => ReactNode> = {
    tower: () => <Tower m={m} floors={spec.floors} spec={spec} />, campus: () => <Campus m={m} />, pavilion: () => <Pavilion m={m} />,
    retreat: () => <Retreat m={m} />, house: () => <House m={m} />, facility: () => <Facility m={m} />, station: () => <Station m={m} />,
    archive: () => <Archive m={m} />, workshop: () => <Workshop m={m} />, command: () => <Command m={m} />, hall: () => <Hall m={m} />,
  };
  return <group>{B[spec.archetype]()}</group>;
}

const Box = ({ s, p, mat, r }: { s: [number, number, number]; p: [number, number, number]; mat: THREE.Material; r?: [number, number, number] }) =>
  <mesh position={p} rotation={r} material={mat}><boxGeometry args={s} /></mesh>;
/** a glass volume with its lit window façade scaled to its size */
function GlassBox({ s, p, m, r }: { s: [number, number, number]; p: [number, number, number]; m: Mats; r?: [number, number, number] }) {
  const mat = useMemo(() => { const g = m.glass.clone(); g.emissiveMap = m.win.clone(); g.emissiveMap.needsUpdate = true; g.emissiveMap.repeat.set(Math.max(1, s[0] / 2), Math.max(1, s[1] / 2.2)); return g; }, [m, s]);
  return <mesh position={p} rotation={r} material={mat}><boxGeometry args={s} /></mesh>;
}

/* ---------------------------------------------------------------- archetypes */
function Tower({ m, floors, spec }: { m: Mats; floors: number; spec: BuildingSpec }) {
  const chart = useMemo(() => chartTexture(spec.palette.accent), [spec]);
  return (
    <group>
      <Box s={[5.2, 0.5, 5.2]} p={[0, 0.25, 0]} mat={m.body} />
      {Array.from({ length: floors }, (_, i) => <GlassBox key={i} m={m} s={[3.6 - i * 0.12, 0.92, 3.6 - i * 0.12]} p={[0, 0.98 + i * 0.95, 0]} r={[0, i * 0.07, 0]} />)}
      {Array.from({ length: floors }, (_, i) => <Box key={`s${i}`} s={[3.75 - i * 0.12, 0.05, 3.75 - i * 0.12]} p={[0, 0.5 + i * 0.95, 0]} r={[0, i * 0.07, 0]} mat={m.metal} />)}
      <mesh position={[0, 0.5 + floors * 0.95 + 0.4, 0]} material={m.accent}><torusGeometry args={[1.1, 0.04, 8, 64]} /></mesh>
      {/* decorative chart façade — illustrative, no data */}
      <mesh position={[0, 3.6, 1.95]}><planeGeometry args={[2.4, 4.6]} /><meshBasicMaterial map={chart} transparent opacity={0.85} toneMapped={false} blending={THREE.AdditiveBlending} /></mesh>
    </group>
  );
}
function Campus({ m }: { m: Mats }) {
  return (
    <group>
      <GlassBox m={m} s={[5.4, 3.4, 2.8]} p={[-2.9, 1.7, 0]} r={[0, 0.25, 0]} />
      <GlassBox m={m} s={[4.4, 4.6, 2.6]} p={[3.1, 2.3, -0.6]} r={[0, -0.2, 0]} />
      <Box s={[0.12, 5.2, 0.12]} p={[3.1, 2.6, 0.75]} mat={m.light} />
      {/* the handover bridge joining the family wing and the attendant wing */}
      <GlassBox m={m} s={[3.4, 0.9, 1.4]} p={[0.15, 2.7, 0.2]} />
      <Box s={[3.5, 0.06, 1.5]} p={[0.15, 2.22, 0.2]} mat={m.light} />
      <Box s={[3.0, 0.1, 2.0]} p={[-2.9, 3.45, 0]} r={[0, 0.25, 0]} mat={m.green} />
      <Box s={[2.6, 0.12, 1.8]} p={[0.3, 0.06, 2.6]} mat={m.water} />
      <mesh position={[-2.9, 3.9, 0]} material={m.accent}><torusGeometry args={[0.5, 0.06, 8, 32]} /></mesh>
    </group>
  );
}
function Pavilion({ m }: { m: Mats }) {
  return (
    <group>
      <Box s={[9, 0.3, 6]} p={[0, 0.15, 0]} mat={m.body} />
      <Box s={[5, 0.06, 3]} p={[0, 0.33, 2.2]} mat={m.water} />
      <GlassBox m={m} s={[6.4, 2.4, 3.4]} p={[0, 1.5, -0.9]} />
      <Box s={[9.4, 0.26, 6.4]} p={[0, 2.85, -0.2]} mat={m.body} />
      <Box s={[9.2, 0.04, 6.2]} p={[0, 2.7, -0.2]} mat={m.light} />
      {Array.from({ length: 22 }, (_, i) => <Box key={i} s={[0.08, 2.4, 0.3]} p={[-4.4 + i * 0.42, 1.5, 2.9]} mat={m.timber} />)}
    </group>
  );
}
function Retreat({ m }: { m: Mats }) {
  return (
    <group>
      {[0, 1, 2].map((i) => (
        <group key={i} position={[0, i * 1.1, -i * 0.6]}>
          <mesh material={m.glass} position={[0, 0.5, 0]}><cylinderGeometry args={[5 - i * 1.2, 5 - i * 1.2, 1, 48, 1, true, -Math.PI * 0.42, Math.PI * 0.84]} /></mesh>
          <mesh material={m.green} position={[0, 1.02, 0]}><cylinderGeometry args={[5.1 - i * 1.2, 5.1 - i * 1.2, 0.08, 48, 1, false, -Math.PI * 0.42, Math.PI * 0.84]} /></mesh>
          <mesh material={m.light} position={[0, 0.03, 0]}><cylinderGeometry args={[5.05 - i * 1.2, 5.05 - i * 1.2, 0.04, 48, 1, true, -Math.PI * 0.42, Math.PI * 0.84]} /></mesh>
        </group>
      ))}
      <Box s={[3, 0.06, 1.6]} p={[0, 0.05, 4.4]} mat={m.water} />
    </group>
  );
}
function House({ m }: { m: Mats }) {
  const vols: [number, number, number, number, number][] = [[3.4, 1.6, 3, 0, 0.8], [2.8, 1.4, 2.6, 0.6, 2.3], [2.2, 1.3, 2.2, -0.4, 3.65], [1.6, 1.1, 1.6, 0.2, 4.85]];
  return (
    <group>
      {vols.map(([w, h, dd, x, y], i) => <GlassBox key={i} m={m} s={[w, h, dd]} p={[x, y, 0]} r={[0, i * 0.35, 0]} />)}
      {vols.map(([w, , dd, x, y, ], i) => <Box key={`r${i}`} s={[w + 0.25, 0.08, dd + 0.25]} p={[x, y + vols[i][1] / 2 + 0.04, 0]} r={[0, i * 0.35, 0]} mat={m.timber} />)}
      {[[-2.6, 0.5, 2], [2.4, 0.4, 1.8], [-1.8, 0.35, -2.2]].map(([x, s, z], i) => <mesh key={i} position={[x, s, z]} material={m.light}><sphereGeometry args={[0.16, 12, 8]} /></mesh>)}
    </group>
  );
}
function Facility({ m }: { m: Mats }) {
  const rings = useRef<THREE.Group>(null!);
  useFrame((_, dt) => { rings.current.children.forEach((c, i) => { c.rotation.x += dt * (0.15 + i * 0.07); c.rotation.y += dt * 0.1; }); });
  return (
    <group>
      <mesh position={[0, 0.6, 0]} material={m.body}><cylinderGeometry args={[5.4, 5.8, 1.2, 64]} /></mesh>
      <mesh position={[0, 1.25, 0]} material={m.light}><cylinderGeometry args={[5.42, 5.42, 0.05, 64, 1, true]} /></mesh>
      <mesh position={[0, 3.2, 0]} material={m.glass}><cylinderGeometry args={[1.4, 1.4, 4, 48]} /></mesh>
      <mesh position={[0, 3.2, 0]} material={m.accent}><cylinderGeometry args={[0.45, 0.45, 3.6, 24]} /></mesh>
      <group ref={rings} position={[0, 3.4, 0]}>
        {[2.3, 2.9, 3.5].map((r) => <mesh key={r} material={m.light}><torusGeometry args={[r, 0.035, 8, 96]} /></mesh>)}
      </group>
      {[-1, 1].map((s) => <GlassBox key={s} m={m} s={[3.2, 2, 0.2]} p={[s * 3.6, 2.2, 2.6]} r={[0, -s * 0.6, 0]} />)}
    </group>
  );
}
function Station({ m }: { m: Mats }) {
  const dish = useRef<THREE.Group>(null!);
  useFrame((_, dt) => { dish.current.rotation.y += dt * 0.25; });
  return (
    <group>
      <GlassBox m={m} s={[7, 1.6, 3.4]} p={[0, 0.8, -0.6]} />
      <Box s={[7.3, 0.12, 3.7]} p={[0, 1.66, -0.6]} mat={m.body} />
      <Box s={[0.25, 3.2, 0.25]} p={[2.2, 3.2, -0.6]} mat={m.metal} />
      <group ref={dish} position={[2.2, 4.9, -0.6]}>
        <mesh rotation={[-0.9, 0, 0]} material={m.metal}><sphereGeometry args={[1.5, 32, 16, 0, Math.PI * 2, 0, 0.75]} /></mesh>
        <mesh rotation={[-0.9, 0, 0]} position={[0, 0.2, 0.25]} material={m.accent}><coneGeometry args={[0.07, 1.1, 8]} /></mesh>
      </group>
      {[-2.4, -0.6].map((x) => <Box key={x} s={[1.4, 1.1, 0.08]} p={[x, 2.4, 0.9]} mat={m.light} />)}
    </group>
  );
}
function Archive({ m }: { m: Mats }) {
  /* 90 lit volumes on a spiral shelf — one per published study */
  const vols = useMemo(() => {
    const g = new THREE.InstancedMesh(new THREE.BoxGeometry(0.22, 0.34, 0.12), m.light, 90), o = new THREE.Object3D();
    for (let i = 0; i < 90; i++) { const a = i * 0.42, y = 0.6 + i * 0.075; o.position.set(Math.cos(a) * 1.25, y, Math.sin(a) * 1.25); o.lookAt(0, y, 0); o.updateMatrix(); g.setMatrixAt(i, o.matrix); }
    return g;
  }, [m]);
  useEffect(() => () => vols.geometry.dispose(), [vols]);
  return (
    <group>
      <Box s={[4.6, 0.4, 4.6]} p={[0, 0.2, 0]} mat={m.body} />
      <mesh position={[0, 4, 0]} material={m.glass}><cylinderGeometry args={[1.9, 1.9, 7.4, 48, 1, true]} /></mesh>
      <mesh position={[0, 4, 0]} material={m.metal}><cylinderGeometry args={[0.18, 0.18, 7.4, 12]} /></mesh>
      <primitive object={vols} />
      <mesh position={[0, 7.85, 0]} material={m.body}><cylinderGeometry args={[2.1, 2.1, 0.3, 48]} /></mesh>
      <mesh position={[0, 8.05, 0]} material={m.accent}><torusGeometry args={[1.4, 0.04, 8, 64]} /></mesh>
    </group>
  );
}
function Workshop({ m }: { m: Mats }) {
  const parts = useRef<THREE.Group>(null!);
  useFrame(({ clock }) => { parts.current.children.forEach((c, i) => { c.position.y = 3.4 + i * 0.55 + Math.sin(clock.elapsedTime * 0.8 + i) * 0.12; }); });
  return (
    <group>
      <GlassBox m={m} s={[7.2, 2.2, 4]} p={[0, 1.1, -0.8]} />
      {[0, 1, 2, 3].map((i) => <mesh key={i} position={[-2.7 + i * 1.8, 2.55, -0.8]} rotation={[0, 0, Math.PI / 4]} material={m.body}><boxGeometry args={[1.28, 1.28, 4.1]} /></mesh>)}
      {/* a product, taken apart layer by layer */}
      <group ref={parts} position={[0, 0, 2.2]}>
        {[0, 1, 2, 3].map((i) => <mesh key={i} rotation={[-0.25, 0.4, 0]} material={i % 2 ? m.light : m.accent}><boxGeometry args={[1.6 - i * 0.18, 0.05, 1 - i * 0.1]} /></mesh>)}
      </group>
    </group>
  );
}
function Command({ m }: { m: Mats }) {
  const board = useMemo(() => boardTexture(["Live opportunities", "", "Walk-in drives · today, tomorrow, next 7 days", "Virtual interviews · registration links", "Delhi · Noida · Ghaziabad · Gurgaon"], "Concept visual · no real listings", "#35D6D0"), []);
  return (
    <group>
      <mesh position={[0, 1.6, 0]} scale={[1.5, 1, 1]} material={m.glass}><cylinderGeometry args={[3, 3.2, 3.2, 64]} /></mesh>
      <mesh position={[0, 3.25, 0]} scale={[1.5, 1, 1]} material={m.body}><cylinderGeometry args={[3.3, 3.3, 0.18, 64]} /></mesh>
      <mesh position={[0, 3.35, 0]} scale={[1.5, 1, 1]} material={m.light}><torusGeometry args={[3.1, 0.035, 8, 96]} /></mesh>
      <mesh position={[0, 5.2, -1.2]}><planeGeometry args={[6.4, 4]} /><meshBasicMaterial map={board} toneMapped={false} /></mesh>
      {[-3.6, -2.4, 2.4, 3.6].map((x) => <mesh key={x} position={[x, 0.55, 3.6]} material={m.glass}><capsuleGeometry args={[0.45, 0.4, 6, 16]} /></mesh>)}
    </group>
  );
}
function Hall({ m }: { m: Mats }) {
  const tickets = useRef<THREE.Group>(null!);
  const tex = useMemo(() => boardTexture(["ADMIT ONE", "", "Concept · not a real booking"], "Concept visual", "#FF9E6B"), []);
  useFrame(({ clock }) => { tickets.current.children.forEach((c, i) => { c.position.y = 3.2 + Math.sin(clock.elapsedTime * 0.7 + i * 1.3) * 0.3; c.rotation.y = Math.sin(clock.elapsedTime * 0.3 + i) * 0.4; }); });
  return (
    <group>
      <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={m.glass}><cylinderGeometry args={[3.4, 3.4, 9, 48, 1, true, 0, Math.PI]} /></mesh>
      {[-4.5, -1.5, 1.5, 4.5].map((x) => <mesh key={x} position={[x, 0, 0]} rotation={[0, Math.PI / 2, 0]} material={m.metal}><torusGeometry args={[3.45, 0.06, 8, 48, Math.PI]} /></mesh>)}
      <Box s={[9.4, 0.08, 7]} p={[0, 0.04, 0]} mat={m.body} />
      <group ref={tickets}>
        {[-3, -1, 1, 3].map((x, i) => <mesh key={x} position={[x, 3.2, 1.6 - (i % 2) * 1.2]}><planeGeometry args={[1.6, 1]} /><meshBasicMaterial map={tex} side={THREE.DoubleSide} toneMapped={false} /></mesh>)}
      </group>
      {[-3, 0, 3].map((x) => <mesh key={x} position={[x, 0.1, 2.4]} material={m.accent}><cylinderGeometry args={[0.9, 0.9, 0.04, 32]} /></mesh>)}
    </group>
  );
}

/* ---------------------------------------------------------------- display stands */
function Panel({ item, index, count, accent, events }: { item: GalleryItem; index: number; count: number; accent: string; events: MutableRefObject<SceneEvents> }) {
  const { invalidate } = useThree();
  // a curved gallery behind the building, facing the plaza: the building stays in view, the screens frame it
  const spread = Math.min(2.7, 0.5 * count), a = Math.PI + (count === 1 ? 0 : -spread / 2 + (spread * index) / (count - 1));
  const r = 12.5, pos = new THREE.Vector3(Math.sin(a) * r, 0, Math.cos(a) * r);
  const aspect = item.kind === "screenshot" ? 16 / 10 : item.width && item.height ? item.width / item.height : 16 / 10;
  const h = 2.7, w = Math.min(4.8, h * aspect);
  const mat = useMemo(() => new THREE.MeshBasicMaterial({ color: "#111" }), []);
  const label = useMemo(() => labelTexture(item.label, item.title, accent), [item, accent]);
  useEffect(() => {
    let tex: THREE.Texture | null = null, live = true;
    if (item.kind === "concept" || item.kind === "missing") { tex = boardTexture(item.lines ?? [item.title], item.label, accent); mat.map = tex; mat.color.set("#C8CCCA"); mat.needsUpdate = true; invalidate(); }
    else if (item.panel) new THREE.TextureLoader().load(asset(item.panel), (t) => { if (!live) { t.dispose(); return; } t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; tex = t; mat.map = t; mat.color.set("#C8CCCA"); mat.needsUpdate = true; invalidate(); });
    return () => { live = false; tex?.dispose(); mat.dispose(); label.dispose(); };
  }, [item, mat, label, accent, invalidate]);
  return (
    <group position={pos} rotation={[0, a + Math.PI, 0]}>
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
function Directory({ items, accent, events }: { items: { key: string; title: string }[]; accent: string; events: MutableRefObject<SceneEvents> }) {
  const list = items.slice(0, 7);
  const labels = useMemo(() => list.map((s, i) => labelTexture(`Floor ${String(i + 1).padStart(2, "0")}`, s.title, accent)), [list, accent]);
  useEffect(() => () => labels.forEach((l) => l.dispose()), [labels]);
  return (
    <group position={[-9.2, 0, 1.6]} rotation={[0, 0.95, 0]}>
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
