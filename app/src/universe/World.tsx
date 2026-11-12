import { useContext, useEffect, useMemo, useRef, type MutableRefObject, type ReactNode } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import gsap from "gsap";
import type { Destination, BuildingSpec, GalleryItem } from "~/content/universe";
import type { SceneApi, SceneEvents, Tier } from "./bus";
import { windowsTexture, labelTexture, boardTexture, chartTexture } from "./textures";
import { audio } from "./audio";
import { useMotionNeed, clampDt } from "./motion";
import { ReducedMotion, Plaza, useMats, type Mats, Box, GlassBox, Panel, Directory } from "./kit";
import { CareConnectScene, CC_ARRIVAL } from "./worlds/CareConnect";
import { PhonePeTower } from "./worlds/PhonePe";
import { sideLayout, SHEET, TOP_BAR_PX } from "./layout";


import { asset } from "~/lib/meta";

/* A project's world: an original, procedural building on a plaza, the project's
 * real images on display stands, and a floor directory for the case study.
 * The architecture is a design device — not a depiction of a real facility. */
const TARGET = new THREE.Vector3(0, 2.4, 0);
const VIEW = new THREE.Vector3(9.5, 4.6, 15.5);
const VIEW_DIST = VIEW.length();
/**
 * How to frame the building for the current layout:
 *  - side panel (wide screens, short landscape phones): shift the picture left of the panel
 *  - bottom sheet expanded (portrait phones): shift it up into the strip between the top bar and the sheet, and step back
 *  - bottom sheet collapsed: centred, slightly further back on narrow screens
 */
export function frameFor(w: number, h: number, sheetOpen: boolean) {
  if (sideLayout(w, h)) return { dx: w >= 900 ? Math.min(250, w * 0.17) : w * 0.2, dy: 0, dist: w >= 900 ? 1 : 1.1 };
  if (!sheetOpen) return { dx: 0, dy: 0, dist: w < h ? 1.25 : 1 };
  const visibleCentre = (TOP_BAR_PX + h * (1 - SHEET)) / 2;
  return { dx: 0, dy: Math.max(0, h / 2 - visibleCentre), dist: w < h ? 1.65 : 1.15 };
}

export function WorldView({ d, tier, reduced, events, api, hotspots, fromEarth, sheetOpen = true }: {
  d: Destination; tier: Tier; reduced: boolean; events: MutableRefObject<SceneEvents>; api: MutableRefObject<SceneApi | null>;
  hotspots: { key: string; title: string }[]; fromEarth: boolean; sheetOpen?: boolean;
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
  const userZoomed = useRef(false);
  useEffect(() => {
    const stopAuto = () => { controls.autoRotate = false; };
    controls.addEventListener("start", stopAuto);
    // once the visitor zooms (wheel or pinch), layout changes no longer move the camera in or out
    const zoomed = () => { userZoomed.current = true; };
    const pinch = (e: TouchEvent) => { if (e.touches.length > 1) zoomed(); };
    gl.domElement.addEventListener("wheel", zoomed, { passive: true });
    gl.domElement.addEventListener("touchstart", pinch, { passive: true });
    const tl = { k: null as gsap.core.Animation | null };
    const endIntro = () => tl.k?.progress(1);
    let guard: ReturnType<typeof setTimeout> | undefined;
    const settle = () => { animating.current = false; controls.enabled = true; controls.update(); events.current.onIntro(1); };
    const fitted = VIEW.clone().setLength(VIEW_DIST * frameFor(gl.domElement.clientWidth, gl.domElement.clientHeight, true).dist);
    if (reduced || !fromEarth) { camera.position.copy(reduced ? fitted : new THREE.Vector3(16, 9, 26)); camera.lookAt(TARGET); }
    if (!reduced) {
      animating.current = true; controls.enabled = false;
      if (fromEarth) { camera.position.set(0, 26, 46); audio.cue("building"); }
      const to = VIEW.clone().setLength(VIEW_DIST * frameFor(gl.domElement.clientWidth, gl.domElement.clientHeight, true).dist);
      const look = () => { camera.lookAt(TARGET); invalidate(); };
      if (d.bespoke === "careconnect") {
        // bespoke arrival (about 4.6 s): down over the rejected brief, along the handover bridge, out to the walkway
        const [a, b] = CC_ARRIVAL; camera.position.copy(a); look(); audio.cue("building");
        const prog = { p: 0 };
        tl.k = gsap.timeline({ onUpdate: () => events.current.onIntro(prog.p), onComplete: settle })
          .to(prog, { p: 1, duration: 4.6, ease: "none" }, 0)
          .to(camera.position, { x: b.x, y: b.y, z: b.z, duration: 2.2, ease: "power2.inOut", onUpdate: look }, 0)
          .to(camera.position, { x: to.x, y: to.y, z: to.z, duration: 2.4, ease: "power3.out", onUpdate: look }, 2.2);
      } else {
        tl.k = gsap.to(camera.position, { x: to.x, y: to.y, z: to.z, duration: fromEarth ? 3 : 1.8, ease: "power3.out", onUpdate: (function (this: gsap.core.Tween) { events.current.onIntro(this.progress()); look(); }), onComplete: settle });
      }
      // touching the scene during the arrival ends it at once; and on a slow device it never runs past 7 s
      // (GSAP stretches tweens over very slow frames, so the wall-clock cap is what bounds the arrival)
      gl.domElement.addEventListener("pointerdown", endIntro, { once: true });
      guard = setTimeout(() => tl.k?.progress(1), 7000);
    } else controls.update();
    events.current.onReady(d.slug);
    api.current = {
      rotate(dx, dy) { controls.autoRotate = false; const o = camera.position.clone().sub(TARGET), s = new THREE.Spherical().setFromVector3(o); s.theta -= dx; s.phi = THREE.MathUtils.clamp(s.phi - dy, 0.25, Math.PI / 2 - 0.06); camera.position.copy(TARGET).add(new THREE.Vector3().setFromSpherical(s)); controls.update(); invalidate(); },
      zoom(f) { userZoomed.current = true; const o = camera.position.clone().sub(TARGET); o.setLength(THREE.MathUtils.clamp(o.length() * f, 7, 30)); camera.position.copy(TARGET).add(o); controls.update(); invalidate(); },
      face() { /* globe only */ }, focus() { /* globe only */ },
      skipIntro() { tl.k?.progress(1); }, replayIntro() { /* globe only */ },
    };
    // the canvas outlives this view (worlds share it), so an unused once-listener must be removed here
    return () => { clearTimeout(guard); tl.k?.kill(); gl.domElement.removeEventListener("pointerdown", endIntro); controls.removeEventListener("start", stopAuto); gl.domElement.removeEventListener("wheel", zoomed); gl.domElement.removeEventListener("touchstart", pinch); controls.dispose(); api.current = null; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // on-demand rendering: "fast" while the camera flies or damps, "ambient" for the slow auto-rotate (never with reduced motion)
  const damping = useRef(false);
  useMotionNeed(() => (animating.current || damping.current ? "fast" : reduced ? null : "ambient"));
  useFrame(() => { damping.current = !animating.current && controls.update(); });
  /* keep the building in the open area: beside the side panel, or above the bottom sheet on phones */
  const { size } = useThree();
  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera, { width: w, height: h } = size;
    const f = frameFor(w, h, sheetOpen);
    if (f.dx || f.dy) cam.setViewOffset(w, h, f.dx, f.dy, w, h); else cam.clearViewOffset();
    // portrait phones: step back so the whole building fits the narrow visible area (unless the visitor has zoomed)
    if (!animating.current && !userZoomed.current) { const o = camera.position.clone().sub(TARGET); o.setLength(VIEW_DIST * f.dist); camera.position.copy(TARGET).add(o); controls.update(); }
    invalidate();
    return () => { cam.clearViewOffset(); };
  }, [camera, size, sheetOpen, invalidate, controls]);

  const panels = d.gallery.slice(0, tier === "mobile" ? 4 : 8);
  if (d.bespoke === "careconnect") return (
    <ReducedMotion.Provider value={reduced}>
      <BespokeCareConnect d={d} tier={tier} events={events} />
      {hotspots.length > 0 && <Directory items={hotspots} accent={pal.accent} events={events} at={{ pos: [-12.5, 0, 4.5], rotY: 1.15 }} />}
    </ReducedMotion.Provider>
  );
  return (
    <ReducedMotion.Provider value={reduced}>
      {d.bespoke === "phonepe" ? (
        // R3: the Financial Intelligence Tower — seven distinct floors, each opening its case-study section (own lighting)
        <PhonePeTower hotspots={hotspots} events={events} tier={tier} />
      ) : (
        <>
          <hemisphereLight args={["#CFEFE6", "#0B1110", 0.55]} />
          <directionalLight position={[10, 16, 8]} intensity={1.5} color="#FFF4E6" />
          <pointLight position={[0, 3, 5]} intensity={18} distance={20} color={pal.light} />
          <pointLight position={[-6, 6, -4]} intensity={10} distance={22} color={pal.accent} />
          <Building spec={d.building} seed={d.slug.length * 31} />
        </>
      )}
      <Plaza accent={pal.accent} />
      {panels.map((g, i) => <Panel key={i} item={g} index={i} count={panels.length} accent={pal.accent} events={events} />)}
      {hotspots.length > 0 && <Directory items={hotspots} accent={pal.accent} events={events} />}
    </ReducedMotion.Provider>
  );
}



/** The bespoke CareConnect scene with its own materials (disposed on exit). */
function BespokeCareConnect({ d, tier, events }: { d: Destination; tier: Tier; events: MutableRefObject<SceneEvents> }) {
  const m = useMats(d.building, d.slug.length * 31);
  useEffect(() => () => { Object.values(m).forEach((x) => (x as { dispose?: () => void }).dispose?.()); }, [m]);
  return <CareConnectScene d={d} m={m} tier={tier} events={events} />;
}

function Building({ spec, seed }: { spec: BuildingSpec; seed: number }) {
  const m = useMats(spec, seed);
  useEffect(() => () => { Object.values(m).forEach((x) => (x as { dispose?: () => void }).dispose?.()); }, [m]);
  const B: Record<BuildingSpec["archetype"], () => ReactNode> = {
    tower: () => <Tower m={m} floors={spec.floors} spec={spec} />, campus: () => <Campus m={m} />, pavilion: () => <Pavilion m={m} />,
    retreat: () => <Retreat m={m} />, house: () => <House m={m} />, facility: () => <Facility m={m} />, station: () => <Station m={m} />,
    workshop: () => <Workshop m={m} />, command: () => <Command m={m} />, hall: () => <Hall m={m} />,
  };
  return <group>{B[spec.archetype]()}</group>;
}


/* ---------------------------------------------------------------- archetypes */
function Tower({ m, floors, spec }: { m: Mats; floors: number; spec: BuildingSpec }) {
  const chart = useMemo(() => chartTexture(spec.palette.accent), [spec]);
  useEffect(() => () => chart.dispose(), [chart]);
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
  const reduced = useContext(ReducedMotion);
  useFrame((_, raw) => { if (reduced) return; const dt = clampDt(raw); rings.current.children.forEach((c, i) => { c.rotation.x += dt * (0.15 + i * 0.07); c.rotation.y += dt * 0.1; }); });
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
  const reduced = useContext(ReducedMotion);
  useFrame((_, raw) => { if (!reduced) dish.current.rotation.y += clampDt(raw) * 0.25; });
  // the dish is an open shell: draw both faces (front faces only left it invisible from the plaza)
  const dishMat = useMemo(() => { const d = m.metal.clone(); d.side = THREE.DoubleSide; return d; }, [m]);
  // the ledger screens: an illustrative board, labelled as such (no real transactions)
  const ledger = useMemo(() => boardTexture(["STATEMENT LEDGER", "", "date · merchant · category · amount", "cleaned names · recurring payments", "categorised by rules first"], "Illustrative · no real transactions", "#4DFF4D"), []);
  useEffect(() => () => { dishMat.dispose(); ledger.dispose(); }, [dishMat, ledger]);
  return (
    <group>
      <GlassBox m={m} s={[7, 1.6, 3.4]} p={[0, 0.8, -0.6]} />
      <Box s={[7.3, 0.12, 3.7]} p={[0, 1.66, -0.6]} mat={m.body} />
      <Box s={[0.25, 3.2, 0.25]} p={[2.2, 3.2, -0.6]} mat={m.metal} />
      <group ref={dish} position={[2.2, 4.9, -0.6]}>
        <mesh rotation={[-0.9, 0, 0]} material={dishMat}><sphereGeometry args={[1.5, 32, 16, 0, Math.PI * 2, 0, 0.75]} /></mesh>
        <mesh rotation={[-0.9, 0, 0]} position={[0, 0.2, 0.25]} material={m.accent}><coneGeometry args={[0.07, 1.1, 8]} /></mesh>
      </group>
      {[-2.4, -0.6].map((x) => (
        <group key={x} position={[x, 2.45, 0.9]}>
          <mesh material={m.body}><boxGeometry args={[1.55, 1.05, 0.08]} /></mesh>
          <mesh position={[0, 0, 0.045]}><planeGeometry args={[1.45, 0.9]} /><meshBasicMaterial map={ledger} toneMapped={false} /></mesh>
        </group>
      ))}
    </group>
  );
}
function Workshop({ m }: { m: Mats }) {
  const parts = useRef<THREE.Group>(null!);
  const reduced = useContext(ReducedMotion);
  useFrame(({ clock }) => { if (reduced) return; parts.current.children.forEach((c, i) => { c.position.y = 3.4 + i * 0.55 + Math.sin(clock.elapsedTime * 0.8 + i) * 0.12; }); });
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
  useEffect(() => () => board.dispose(), [board]);
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
  useEffect(() => () => tex.dispose(), [tex]);
  const reduced = useContext(ReducedMotion);
  useFrame(({ clock }) => { if (reduced) return; tickets.current.children.forEach((c, i) => { c.position.y = 3.2 + Math.sin(clock.elapsedTime * 0.7 + i * 1.3) * 0.3; c.rotation.y = Math.sin(clock.elapsedTime * 0.3 + i) * 0.4; }); });
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
