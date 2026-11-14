import { Suspense, useEffect, useMemo, type MutableRefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { EarthView } from "./Earth";
import { WorldView } from "./World";
import { SolarView, type SolarProps } from "./Solar";
import { dotTexture } from "./textures";
import type { Destination } from "~/content/universe";
import type { StudyPin, Region } from "~/content/studyMap";
import type { SceneApi, SceneEvents, Tier } from "./bus";
import { MotionDriver, useMotionNeed, clampDt } from "./motion";

/** The Earth of the 90 case studies. */
export interface EarthProps { pins: StudyPin[]; regions: Region[]; dim: Set<number> | null; selected: number | null; hovered: string | null; intro: boolean; preview: MutableRefObject<HTMLElement | null> }
export interface SceneProps {
  earth?: EarthProps; world?: Destination | null; system?: SolarProps; tier: Tier; reduced: boolean; paused: boolean;
  events: MutableRefObject<SceneEvents>; api: MutableRefObject<SceneApi | null>;
  fromEarth?: boolean; hotspots?: { key: string; title: string }[];
  /** phones: the bottom sheet is expanded (the world re-frames its building above it) */
  sheetOpen?: boolean;
}

/** The 3D canvas: the solar system, the study Earth or one world — only one at a time (GPU memory stays small). */
export default function UniverseScene(p: SceneProps) {
  const dpr: [number, number] = p.tier === "high" ? [1, 1.75] : p.tier === "laptop" ? [1, 1.25] : [1, 1.5];
  return (
    <Canvas dpr={dpr} frameloop={p.paused ? "never" : "demand"} camera={{ fov: 42, near: 0.05, far: 900, position: [0, 1.1, 7.2] }}
      // only the top tier asks for the discrete GPU; laptops and phones keep the power-saving default
      gl={{ antialias: p.tier !== "mobile", powerPreference: p.tier === "high" ? "high-performance" : "default", alpha: false }}
      onCreated={({ gl, camera }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping; gl.toneMappingExposure = 1.05; gl.outputColorSpace = THREE.SRGBColorSpace;
        // ?gldebug=1 exposes the renderer's counters (frames drawn, GPU objects held) for the leak and idle tests
        if (new URLSearchParams(location.search).has("gldebug")) Object.assign(window, { __gosGL: gl, __gosCam: camera });
      }}
      aria-hidden>
      <MotionDriver paused={p.paused} />
      <Backdrop world={!!p.world} />
      <Stars count={p.tier === "high" ? 4200 : p.tier === "laptop" ? 2400 : 1200} reduced={p.reduced} />
      <Suspense fallback={null}>
        {p.world
          ? <WorldView key={p.world.slug} d={p.world} tier={p.tier} reduced={p.reduced} events={p.events} api={p.api} hotspots={p.hotspots ?? []} fromEarth={!!p.fromEarth} sheetOpen={p.sheetOpen ?? true} />
          : p.system ? <SolarView tier={p.tier} reduced={p.reduced} events={p.events} api={p.api} {...p.system} />
          : p.earth ? <EarthView tier={p.tier} reduced={p.reduced} events={p.events} api={p.api} {...p.earth} /> : null}
      </Suspense>
      {p.tier === "high" && <Bloom strength={p.world ? 0.55 : p.system ? 0.9 : 0.75} />}
    </Canvas>
  );
}

function Backdrop({ world }: { world: boolean }) {
  const { scene } = useThree();
  useEffect(() => {
    scene.background = new THREE.Color(world ? "#05090A" : "#020405");
    scene.fog = world ? new THREE.FogExp2("#05090A", 0.022) : null;
    return () => { scene.fog = null; };
  }, [scene, world]);
  return null;
}

/** A deep star field: soft points on a far sphere with a faint emerald / cyan cast, drifting very slowly. */
function Stars({ count, reduced }: { count: number; reduced: boolean }) {
  const { geo, mat } = useMemo(() => {
    const pos = new Float32Array(count * 3), col = new Float32Array(count * 3), c = new THREE.Color();
    for (let i = 0; i < count; i++) {
      const u = Math.random() * 2 - 1, th = Math.random() * Math.PI * 2, r = 260 + Math.random() * 260, s = Math.sqrt(1 - u * u);
      pos.set([r * s * Math.cos(th), r * u, r * s * Math.sin(th)], i * 3);
      const t = Math.random(); c.set(t > 0.94 ? "#9FFFD8" : t > 0.88 ? "#9FE9FF" : "#FFFFFF").multiplyScalar(0.45 + Math.random() * 0.55);
      col.set([c.r, c.g, c.b], i * 3);
    }
    const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.BufferAttribute(pos, 3)); g.setAttribute("color", new THREE.BufferAttribute(col, 3));
    const m = new THREE.PointsMaterial({ size: 2.2, map: dotTexture(), vertexColors: true, transparent: true, depthWrite: false, sizeAttenuation: true, blending: THREE.AdditiveBlending, fog: false });
    return { geo: g, mat: m };
  }, [count]);
  useEffect(() => () => { geo.dispose(); mat.map?.dispose(); mat.dispose(); }, [geo, mat]);
  const ref = useMemo(() => new THREE.Points(geo, mat), [geo, mat]);
  // decorative drift: off with reduced motion, and only ever an "ambient" need
  useMotionNeed(() => (reduced ? null : "ambient"));
  useFrame((_, dt) => { if (!reduced) ref.rotation.y += clampDt(dt) * 0.002; });
  return <primitive object={ref} />;
}

function Bloom({ strength }: { strength: number }) {
  const { gl, scene, camera, size } = useThree();
  const composer = useMemo(() => {
    const c = new EffectComposer(gl); c.addPass(new RenderPass(scene, camera));
    c.addPass(new UnrealBloomPass(new THREE.Vector2(size.width, size.height), strength, 0.6, 0.82)); c.addPass(new OutputPass());
    return c;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gl, scene, camera, strength]);
  useEffect(() => { composer.setSize(size.width, size.height); }, [composer, size]);
  // the bloom pass owns its own render targets: dispose every pass, not just the composer
  useEffect(() => () => { composer.passes.forEach((x) => (x as { dispose?: () => void }).dispose?.()); composer.dispose(); }, [composer]);
  useFrame(() => composer.render(), 1);
  return null;
}
