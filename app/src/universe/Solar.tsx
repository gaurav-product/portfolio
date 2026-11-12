import { useEffect, useMemo, useRef, type MutableRefObject } from "react";
import { useFrame, useLoader, useThree, type ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import gsap from "gsap";
import type { Planet, PlanetLook } from "~/content/solar";
import type { SceneApi, SceneEvents, Tier } from "./bus";
import { audio } from "./audio";
import { useMotionNeed, clampDt } from "./motion";
import { sideLayout } from "./layout";
import { asset } from "~/lib/meta";

/**
 * The Gaurav.OS solar system: the Sun (Gaurav.OS), the Earth of the 90 case studies and one planet per
 * actual project. Planets orbit slowly (never with reduced motion) and freeze while one is selected, so
 * the camera can frame it. The page owns state; this view renders, reports hover / select, and exposes
 * the camera through SceneApi. Labels are DOM elements positioned from here (`labels`).
 */
export interface SolarProps {
  planets: Planet[]; selected: string | null; hovered: string | null;
  labels: MutableRefObject<HTMLDivElement | null>;
}
const SUN_R = 1.7;
const HOME_DIR = new THREE.Vector3(0, 0.52, 1).normalize();

/** Distance that fits the outer orbit in view for this aspect (portrait phones step back and look down more). */
export function homeFor(w: number, h: number, outer: number) {
  const aspect = w / Math.max(1, h), fov = THREE.MathUtils.degToRad(42);
  const side = sideLayout(w, h) && w >= 900; // a panel may open on the right
  const needH = (outer * 1.08) / Math.tan(fov / 2) * 0.62;
  const needW = (outer * 1.12) / (Math.tan(fov / 2) * aspect);
  const dist = Math.max(16, Math.min(80, Math.max(needH, needW) * (side ? 1.18 : 1.1)));
  const dir = aspect < 0.8 ? new THREE.Vector3(0, 1.25, 1).normalize() : HOME_DIR;
  return { dist, dir };
}

export function SolarView({ tier, reduced, planets, selected, hovered, labels, events, api }: SolarProps & {
  tier: Tier; reduced: boolean; events: MutableRefObject<SceneEvents>; api: MutableRefObject<SceneApi | null>;
}) {
  const { camera, gl, invalidate, size } = useThree();
  const outer = planets[planets.length - 1].orbit + 1;
  const time = useRef(0);               // orbital clock (seconds); stands still while a planet is selected
  const positions = useRef(new Map<string, THREE.Vector3>(planets.map((p) => [p.slug, new THREE.Vector3()])));
  const selectedRef = useRef(selected); selectedRef.current = selected;
  const hoveredRef = useRef(hovered); hoveredRef.current = hovered;
  const animating = useRef(false);
  const follow = useRef<string | null>(null);

  const controls = useMemo(() => {
    const c = new OrbitControls(camera, gl.domElement);
    c.enablePan = false; c.enableDamping = true; c.dampingFactor = 0.08; c.rotateSpeed = 0.6; c.zoomSpeed = 0.8;
    c.minDistance = 2.2; c.maxDistance = 90; c.maxPolarAngle = Math.PI * 0.49; c.minPolarAngle = 0.12;
    return c;
  }, [camera, gl]);

  const tl = useRef<gsap.core.Animation | null>(null);
  const fly = (to: THREE.Vector3, target: THREE.Vector3, duration: number) => {
    tl.current?.kill();
    if (reduced || duration === 0) { camera.position.copy(to); controls.target.copy(target); controls.update(); invalidate(); animating.current = false; controls.enabled = true; return; }
    animating.current = true; controls.enabled = false;
    const from = { t: controls.target.clone() };
    tl.current = gsap.timeline({ onComplete: () => { animating.current = false; controls.enabled = true; controls.update(); } })
      .to(camera.position, { x: to.x, y: to.y, z: to.z, duration, ease: "power3.inOut", onUpdate: () => { camera.lookAt(controls.target); invalidate(); } }, 0)
      .to(from.t, { x: target.x, y: target.y, z: target.z, duration, ease: "power3.inOut", onUpdate: () => { controls.target.copy(from.t); } }, 0);
  };
  const home = (duration: number) => {
    const { dist, dir } = homeFor(size.width, size.height, outer);
    follow.current = null;
    fly(dir.clone().multiplyScalar(dist), new THREE.Vector3(0, 0, 0), duration);
  };
  const frameOn = (slug: string, duration: number) => {
    const p = planets.find((x) => x.slug === slug); if (!p) return;
    const at = positions.current.get(slug)!.clone();
    // look at the planet from just outside its orbit, a little above; the side panel sits on the right
    const out = at.clone().setY(0).normalize();
    // mostly along the orbit, a little sunward: the planet shows its sunlit half and the terminator
    const side = new THREE.Vector3(-out.z, 0, out.x);
    const dir = side.multiplyScalar(0.82).add(out.multiplyScalar(-0.38)).normalize();
    const dist = p.size * (p.kind === "earth" ? 6.2 : 7) + 1.2;
    const to = at.clone().add(dir.multiplyScalar(dist)).add(new THREE.Vector3(0, dist * 0.32, 0));
    follow.current = slug;
    fly(to, at, duration);
  };

  useEffect(() => {
    const endIntro = () => tl.current?.progress(1);
    const { dist, dir } = homeFor(gl.domElement.clientWidth, gl.domElement.clientHeight, outer);
    controls.target.set(0, 0, 0);
    if (reduced) { camera.position.copy(dir.clone().multiplyScalar(dist)); camera.lookAt(0, 0, 0); controls.update(); }
    else {
      // a short arrival: from deep space down to the system (about 2.4 s; any input ends it)
      camera.position.copy(dir.clone().multiplyScalar(dist * 2.4).add(new THREE.Vector3(0, dist * 0.6, 0)));
      camera.lookAt(0, 0, 0);
      fly(dir.clone().multiplyScalar(dist), new THREE.Vector3(0, 0, 0), 2.4);
      gl.domElement.addEventListener("pointerdown", endIntro, { once: true });
    }
    events.current.onReady("system");
    api.current = {
      rotate(dx, dy) { const o = camera.position.clone().sub(controls.target), s = new THREE.Spherical().setFromVector3(o); s.theta -= dx; s.phi = THREE.MathUtils.clamp(s.phi - dy, 0.12, Math.PI * 0.49); camera.position.copy(controls.target).add(new THREE.Vector3().setFromSpherical(s)); controls.update(); invalidate(); },
      zoom(f) { const o = camera.position.clone().sub(controls.target); o.setLength(THREE.MathUtils.clamp(o.length() * f, controls.minDistance, controls.maxDistance)); camera.position.copy(controls.target).add(o); controls.update(); invalidate(); },
      face() { invalidate(); },
      focus(id) { if (id) frameOn(id, 1.6); else home(1.4); },
      skipIntro() { tl.current?.progress(1); }, replayIntro() { home(1.4); },
    };
    // the canvas outlives this view (system ⇄ Earth share it): remove an unused once-listener, and a hover cursor
    return () => { tl.current?.kill(); gl.domElement.removeEventListener("pointerdown", endIntro); document.body.style.cursor = ""; controls.dispose(); api.current = null; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // keep the system framed when the window changes shape (unless a planet is framed)
  useEffect(() => { if (!follow.current && !animating.current) { const { dist, dir } = homeFor(size.width, size.height, outer); camera.position.copy(dir.clone().multiplyScalar(dist)); controls.target.set(0, 0, 0); controls.update(); invalidate(); } },
    [size.width, size.height]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera, { width: w, height: h } = size;
    if (selected && sideLayout(w, h)) cam.setViewOffset(w, h, Math.min(230, w * 0.16), 0, w, h);
    else if (selected) cam.setViewOffset(w, h, 0, Math.max(0, h / 2 - (72 + h * 0.42) / 2), w, h);
    else cam.clearViewOffset();
    invalidate();
    return () => { cam.clearViewOffset(); };
  }, [camera, size, selected, invalidate]);

  const damping = useRef(false);
  useMotionNeed(() => (animating.current || damping.current ? "fast" : reduced || selectedRef.current ? null : "ambient"));
  const v = useMemo(() => new THREE.Vector3(), []);
  useFrame((_, raw) => {
    const dt = clampDt(raw);
    if (!reduced && !selectedRef.current) time.current += dt;
    // planet positions this frame
    for (const p of planets) {
      const a = p.phase + time.current * p.speed;
      positions.current.get(p.slug)!.set(Math.cos(a) * p.orbit, Math.sin(a) * p.orbit * p.tilt * 4, -Math.sin(a) * p.orbit);
    }
    // the camera follows a framed planet (its orbit is frozen, so this only matters during the flight)
    if (follow.current && !animating.current) { const at = positions.current.get(follow.current)!; if (at.distanceToSquared(controls.target) > 1e-6) controls.target.copy(at); }
    damping.current = !animating.current && controls.update();
    // labels: project each planet to the screen
    const box = labels.current; if (!box) return;
    const w = size.width, h = size.height;
    for (const el of Array.from(box.children) as HTMLElement[]) {
      const slug = el.dataset.slug!; const p = slug === "sun" ? null : planets.find((x) => x.slug === slug);
      // the Sun's label sits BELOW it (the inner planets crowd the space above); planet labels sit above each planet
      v.copy(slug === "sun" ? new THREE.Vector3(0, -SUN_R - 0.2, 0) : positions.current.get(slug)!).add(new THREE.Vector3(0, p ? p.size + 0.25 : 0, 0)).project(camera);
      const behind = v.z > 1;
      el.style.transform = `translate(${((v.x + 1) / 2) * w}px, ${((1 - v.y) / 2) * h}px) translate(-50%, ${slug === "sun" ? "0%" : "-100%"})`;
      el.dataset.visible = String(!behind);
      el.dataset.active = String(slug === hoveredRef.current || slug === selectedRef.current);
    }
  });

  return (
    <group>
      <ambientLight intensity={0.42} color="#AFC4FF" />
      <hemisphereLight args={["#DDE8FF", "#0B1110", 0.25]} />
      <pointLight position={[0, 0, 0]} intensity={3.1} decay={0} color="#FFF1D6" />
      <Sun tier={tier} reduced={reduced} />
      {planets.map((p) => (
        <group key={`o-${p.slug}`}>
          <Orbit p={p} active={p.slug === hovered || p.slug === selected} />
          <Trail p={p} time={time} />
        </group>
      ))}
      {planets.map((p) => (
        <PlanetBody key={p.slug} p={p} tier={tier} reduced={reduced} positions={positions} time={time} selected={selected === p.slug} dimmed={!!selected && selected !== p.slug}
          onOver={() => { if (hoveredRef.current !== p.slug) { audio.cue("hover"); events.current.onHover(p.slug); } }}
          onOut={() => events.current.onHover(null)}
          onPick={() => { audio.cue("select"); events.current.onSelect(p.slug); }} />
      ))}
    </group>
  );
}

/* ---------------------------------------------------------------- the Sun: Gaurav.OS */
const sunVert = /* glsl */ `varying vec3 vN; varying vec3 vP; varying vec3 vW;
void main(){ vN = normalize(mat3(modelMatrix) * normal); vP = position; vec4 w = modelMatrix * vec4(position,1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`;
const sunFrag = /* glsl */ `uniform float uTime; varying vec3 vN; varying vec3 vP; varying vec3 vW;
float h(vec3 p){ return fract(sin(dot(p, vec3(127.1,311.7,74.7))) * 43758.5453); }
float n3(vec3 p){ vec3 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);
  return mix(mix(mix(h(i),h(i+vec3(1,0,0)),f.x), mix(h(i+vec3(0,1,0)),h(i+vec3(1,1,0)),f.x), f.y),
             mix(mix(h(i+vec3(0,0,1)),h(i+vec3(1,0,1)),f.x), mix(h(i+vec3(0,1,1)),h(i+vec3(1,1,1)),f.x), f.y), f.z); }
float fbm(vec3 p){ float a = 0.5, s = 0.0; for (int i = 0; i < 5; i++) { s += a * n3(p); p *= 2.03; a *= 0.5; } return s; }
void main(){
  vec3 p = normalize(vP) * 2.2;
  float t = uTime * 0.06;
  float g = fbm(p + vec3(t, t * 0.7, -t));
  float c = fbm(p * 2.4 - vec3(t * 1.6) + g);
  vec3 hot = vec3(1.0, 0.97, 0.86), mid = vec3(1.0, 0.74, 0.32), cool = vec3(0.86, 0.42, 0.12);
  vec3 col = mix(cool, mid, smoothstep(0.25, 0.6, c));
  col = mix(col, hot, smoothstep(0.55, 0.85, c + g * 0.25));
  vec3 v = normalize(cameraPosition - vW);
  float limb = pow(max(dot(normalize(vN), v), 0.0), 0.45);
  col *= 0.55 + 0.75 * limb;
  col += vec3(0.30, 1.0, 0.30) * pow(1.0 - limb, 3.0) * 0.55; // a faint Gaurav.OS green at the limb
  gl_FragColor = vec4(col * 1.35, 1.0);
}`;
function glowTexture(inner: string, outer: string) {
  const c = document.createElement("canvas"); c.width = c.height = 256; const g = c.getContext("2d")!;
  const r = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  r.addColorStop(0, inner); r.addColorStop(0.22, inner); r.addColorStop(0.45, outer); r.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = r; g.fillRect(0, 0, 256, 256);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
function Sun({ tier, reduced }: { tier: Tier; reduced: boolean }) {
  const mat = useMemo(() => new THREE.ShaderMaterial({ uniforms: { uTime: { value: 0 } }, vertexShader: sunVert, fragmentShader: sunFrag }), []);
  const corona = useMemo(() => glowTexture("rgba(255,214,140,0.9)", "rgba(110,255,140,0.12)"), []);
  const halo = useMemo(() => glowTexture("rgba(255,180,90,0.35)", "rgba(77,255,77,0.05)"), []);
  useEffect(() => () => { mat.dispose(); corona.dispose(); halo.dispose(); }, [mat, corona, halo]);
  const seg = tier === "mobile" ? 48 : 72;
  useFrame((_, dt) => { if (!reduced) mat.uniforms.uTime.value += clampDt(dt); });
  return (
    <group>
      <mesh material={mat} raycast={() => null}><sphereGeometry args={[SUN_R, seg, seg / 2]} /></mesh>
      <sprite scale={[SUN_R * 5.4, SUN_R * 5.4, 1]} raycast={() => null}><spriteMaterial map={corona} transparent depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} /></sprite>
      <sprite scale={[SUN_R * 12, SUN_R * 12, 1]} raycast={() => null}><spriteMaterial map={halo} transparent depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} /></sprite>
    </group>
  );
}

/* ---------------------------------------------------------------- orbits and trails */
function Orbit({ p, active }: { p: Planet; active: boolean }) {
  const { line, mat } = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= 256; i++) { const a = (i / 256) * Math.PI * 2; pts.push(new THREE.Vector3(Math.cos(a) * p.orbit, Math.sin(a) * p.orbit * p.tilt * 4, -Math.sin(a) * p.orbit)); }
    const g = new THREE.BufferGeometry().setFromPoints(pts);
    const m = new THREE.LineBasicMaterial({ color: p.look.glow, transparent: true, opacity: 0.16, depthWrite: false, toneMapped: false });
    return { line: new THREE.Line(g, m), mat: m };
  }, [p]);
  useEffect(() => () => { line.geometry.dispose(); mat.dispose(); }, [line, mat]);
  useEffect(() => { mat.opacity = active ? 0.55 : 0.16; }, [active, mat]);
  return <primitive object={line} raycast={() => null} />;
}

/** A fading arc behind the planet (vertex colours fade to black under additive blending). */
function Trail({ p, time }: { p: Planet; time: MutableRefObject<number> }) {
  const { line, geo, mat } = useMemo(() => {
    const N = 64, pos = new Float32Array(N * 3), col = new Float32Array(N * 3), c = new THREE.Color(p.look.glow);
    for (let i = 0; i < N; i++) { const k = 1 - i / (N - 1); col.set([c.r * k * k, c.g * k * k, c.b * k * k], i * 3); }
    const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.BufferAttribute(pos, 3)); g.setAttribute("color", new THREE.BufferAttribute(col, 3));
    const m = new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false });
    return { line: new THREE.Line(g, m), geo: g, mat: m };
  }, [p]);
  useEffect(() => () => { geo.dispose(); mat.dispose(); }, [geo, mat]);
  useFrame(() => {
    const a0 = p.phase + time.current * p.speed, attr = geo.getAttribute("position") as THREE.BufferAttribute, N = attr.count, span = 0.9;
    for (let i = 0; i < N; i++) { const a = a0 - (i / (N - 1)) * span; attr.setXYZ(i, Math.cos(a) * p.orbit, Math.sin(a) * p.orbit * p.tilt * 4, -Math.sin(a) * p.orbit); }
    attr.needsUpdate = true;
  });
  return <primitive object={line} raycast={() => null} />;
}

/* ---------------------------------------------------------------- planets */
const atmoVert = sunVert;
const atmoFrag = /* glsl */ `uniform vec3 uGlow; uniform float uBoost; varying vec3 vN; varying vec3 vW;
void main(){ vec3 v = normalize(cameraPosition - vW); float i = pow(clamp(-dot(normalize(vN), v), 0.0, 1.0), 1.6);
  vec3 sun = normalize(-vW); float lit = 0.35 + 0.65 * smoothstep(-0.4, 0.5, dot(normalize(vN), sun));
  gl_FragColor = vec4(uGlow * lit, i * (0.55 + uBoost) * lit); }`;

function PlanetBody({ p, tier, reduced, positions, time, selected, dimmed, onOver, onOut, onPick }: {
  p: Planet; tier: Tier; reduced: boolean; positions: MutableRefObject<Map<string, THREE.Vector3>>; time: MutableRefObject<number>;
  selected: boolean; dimmed: boolean; onOver: () => void; onOut: () => void; onPick: () => void;
}) {
  const group = useRef<THREE.Group>(null!);
  const spin = useRef<THREE.Group>(null!);
  const earthUrl = asset(tier === "high" ? "/universe/earth-day-2k.webp" : "/universe/earth-day-1k.webp");
  const tex = p.look.style === "earth" ? <EarthMap url={earthUrl} p={p} dimmed={dimmed} /> : <ProcMap p={p} dimmed={dimmed} />;
  const atmo = useMemo(() => new THREE.ShaderMaterial({ uniforms: { uGlow: { value: new THREE.Color(p.look.glow) }, uBoost: { value: 0 } }, vertexShader: atmoVert, fragmentShader: atmoFrag, side: THREE.BackSide, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }), [p]);
  useEffect(() => () => atmo.dispose(), [atmo]);
  useEffect(() => { atmo.uniforms.uBoost.value = selected ? 0.45 : 0; }, [selected, atmo]);
  useFrame((_, raw) => {
    group.current.position.copy(positions.current.get(p.slug)!);
    if (!reduced) spin.current.rotation.y += clampDt(raw) * 0.12;
  });
  const seg = tier === "mobile" ? 32 : 56;
  const over = (e: ThreeEvent<PointerEvent>) => { e.stopPropagation(); document.body.style.cursor = "pointer"; onOver(); };
  const out = () => { document.body.style.cursor = ""; onOut(); };
  return (
    <group ref={group}>
      <group ref={spin} rotation={[0.22, 0, 0.08]}>
        <mesh raycast={() => null}><sphereGeometry args={[p.size, seg, seg / 2]} />{tex}</mesh>
      </group>
      <mesh material={atmo} scale={1.16} raycast={() => null}><sphereGeometry args={[p.size, seg, seg / 2]} /></mesh>
      {p.look.ring && <Ring p={p} />}
      {p.look.moons ? <Moons p={p} reduced={reduced} /> : null}
      {/* generous invisible hit target: small planets stay easy to tap */}
      <mesh onPointerOver={over} onPointerOut={out} onClick={(e) => { e.stopPropagation(); onPick(); }}>
        <sphereGeometry args={[Math.max(p.size * 1.3, 0.85), 12, 8]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} colorWrite={false} />
      </mesh>
    </group>
  );
}

function EarthMap({ url, p, dimmed }: { url: string; p: Planet; dimmed: boolean }) {
  const map = useLoader(THREE.TextureLoader, url);
  useMemo(() => { map.colorSpace = THREE.SRGBColorSpace; }, [map]);
  return <meshStandardMaterial map={map} roughness={0.75} metalness={0} emissive={p.look.accent} emissiveIntensity={dimmed ? 0.03 : 0.1} />;
}

function ProcMap({ p, dimmed }: { p: Planet; dimmed: boolean }) {
  const map = useMemo(() => planetTexture(p.look, p.slug), [p]);
  useEffect(() => () => map.dispose(), [map]);
  return <meshStandardMaterial map={map} roughness={p.look.style === "grid" ? 0.45 : 0.82} metalness={p.look.style === "grid" ? 0.35 : 0.05}
    emissive="#FFFFFF" emissiveMap={map} emissiveIntensity={dimmed ? 0.07 : 0.26} />;
}

function Ring({ p }: { p: Planet }) {
  const mat = useMemo(() => {
    const c = document.createElement("canvas"); c.width = 256; c.height = 8; const g = c.getContext("2d")!;
    const r = g.createLinearGradient(0, 0, 256, 0);
    r.addColorStop(0, "rgba(255,255,255,0)"); r.addColorStop(0.2, hexA(p.look.accent, 0.5)); r.addColorStop(0.5, hexA(p.look.glow, 0.25)); r.addColorStop(0.75, hexA(p.look.accent, 0.45)); r.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = r; g.fillRect(0, 0, 256, 8);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
    return new THREE.MeshBasicMaterial({ map: t, transparent: true, side: THREE.DoubleSide, depthWrite: false, toneMapped: false });
  }, [p]);
  useEffect(() => () => { mat.map?.dispose(); mat.dispose(); }, [mat]);
  // ring UVs run radially so the gradient reads as bands
  const geo = useMemo(() => {
    const g = new THREE.RingGeometry(p.size * 1.28, p.size * 1.75, 96, 1);
    const pos = g.getAttribute("position") as THREE.BufferAttribute, uv = g.getAttribute("uv") as THREE.BufferAttribute, v = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) { v.fromBufferAttribute(pos, i); uv.setXY(i, (v.length() - p.size * 1.35) / (p.size * 0.47), 0.5); }
    return g;
  }, [p]);
  useEffect(() => () => geo.dispose(), [geo]);
  return <mesh geometry={geo} material={mat} rotation={[-Math.PI / 2 + 0.38, 0.18, 0]} raycast={() => null} />;
}

function Moons({ p, reduced }: { p: Planet; reduced: boolean }) {
  const g = useRef<THREE.Group>(null!);
  useFrame((_, raw) => { if (!reduced) g.current.rotation.y += clampDt(raw) * 0.6; });
  return (
    <group ref={g} rotation={[0.3, 0, 0]}>
      {Array.from({ length: p.look.moons! }, (_, i) => (
        <mesh key={i} position={[Math.cos(i * Math.PI) * p.size * 1.6, 0, Math.sin(i * Math.PI) * p.size * 1.6]} raycast={() => null}>
          <sphereGeometry args={[p.size * 0.16, 16, 12]} /><meshStandardMaterial color={p.look.accent} emissive={p.look.accent} emissiveIntensity={0.5} roughness={0.6} />
        </mesh>
      ))}
    </group>
  );
}

/* ---------------------------------------------------------------- procedural surfaces (original, drawn in code) */
function hexA(hex: string, a: number) { const n = parseInt(hex.slice(1), 16); return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`; }
function seeded(s: string) { let x = 0; for (const ch of s) x = (x * 31 + ch.charCodeAt(0)) % 2147483647; x = x || 7; return () => ((x = (x * 16807) % 2147483647) - 1) / 2147483646; }

export function planetTexture(look: PlanetLook, seed: string) {
  const W = 512, H = 256, c = document.createElement("canvas"); c.width = W; c.height = H;
  const g = c.getContext("2d")!, r = seeded(seed);
  const vg = g.createLinearGradient(0, 0, 0, H); vg.addColorStop(0, look.second); vg.addColorStop(0.5, look.base); vg.addColorStop(1, look.second);
  g.fillStyle = vg; g.fillRect(0, 0, W, H);
  const blob = (x: number, y: number, rad: number, col: string) => { const gr = g.createRadialGradient(x, y, 0, x, y, rad); gr.addColorStop(0, col); gr.addColorStop(1, "rgba(0,0,0,0)"); g.fillStyle = gr; g.fillRect(x - rad, y - rad, rad * 2, rad * 2); };
  switch (look.style) {
    case "calm": // soft wellness bands and still ripples
      for (let i = 0; i < 9; i++) { g.fillStyle = hexA(i % 2 ? look.accent : look.second, 0.08 + r() * 0.08); g.fillRect(0, (i / 9) * H + r() * 8, W, 10 + r() * 18); }
      for (let i = 0; i < 4; i++) { const x = r() * W, y = 60 + r() * 140; for (let k = 1; k < 6; k++) { g.strokeStyle = hexA(look.accent, 0.22 - k * 0.035); g.lineWidth = 1.5; g.beginPath(); g.ellipse(x, y, k * 11, k * 6, 0, 0, Math.PI * 2); g.stroke(); } }
      break;
    case "veins": { // roots: branching gold veins on deep green
      for (let i = 0; i < 26; i++) blob(r() * W, r() * H, 20 + r() * 40, hexA(look.second, 0.35));
      const branch = (x: number, y: number, a: number, len: number, w: number, depth: number) => {
        if (depth > 5 || len < 4) return; const x2 = x + Math.cos(a) * len, y2 = y + Math.sin(a) * len;
        g.strokeStyle = hexA(look.accent, 0.35 + 0.1 * (5 - depth)); g.lineWidth = w; g.beginPath(); g.moveTo(x, y); g.lineTo(x2, y2); g.stroke();
        branch(x2, y2, a - 0.4 - r() * 0.3, len * 0.72, w * 0.7, depth + 1); branch(x2, y2, a + 0.4 + r() * 0.3, len * 0.72, w * 0.7, depth + 1);
      };
      for (let i = 0; i < 7; i++) branch(r() * W, H * (0.15 + r() * 0.7), Math.PI / 2 + (r() - 0.5) * 1.4, 26 + r() * 12, 2.6, 0);
      break; }
    case "network": { // connected care: linked nodes over a blue → violet sphere
      const pts = Array.from({ length: 44 }, () => [r() * W, 20 + r() * (H - 40)] as [number, number]);
      g.lineWidth = 1.2;
      pts.forEach(([x, y], i) => pts.slice(i + 1).forEach(([x2, y2]) => { const d = Math.hypot(x - x2, y - y2); if (d < 70) { g.strokeStyle = hexA(look.accent, 0.4 * (1 - d / 70)); g.beginPath(); g.moveTo(x, y); g.lineTo(x2, y2); g.stroke(); } }));
      pts.forEach(([x, y]) => blob(x, y, 7, hexA(look.accent, 0.9)));
      break; }
    case "terrain": // home-grown: green and olive lands with warm lantern spots
      for (let i = 0; i < 60; i++) blob(r() * W, r() * H, 14 + r() * 36, hexA(r() > 0.5 ? look.second : "#3E5A2A", 0.45));
      for (let i = 0; i < 18; i++) blob(r() * W, 30 + r() * (H - 60), 4 + r() * 6, hexA(look.accent, 0.75));
      break;
    case "grid": { // decision engine: a lat/long data grid with linked nodes
      g.strokeStyle = hexA(look.accent, 0.28); g.lineWidth = 1;
      for (let x = 0; x <= W; x += 32) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, H); g.stroke(); }
      for (let y = 16; y < H; y += 24) { g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); }
      for (let i = 0; i < 16; i++) { const x = Math.round(r() * 16) * 32, y = 16 + Math.round(r() * 9) * 24; g.strokeStyle = hexA(look.glow, 0.55); g.lineWidth = 2; g.beginPath(); g.moveTo(x, y); g.lineTo(x + 64, y + (r() > 0.5 ? 24 : -24)); g.stroke(); blob(x, y, 6, hexA(look.accent, 0.95)); }
      break; }
    case "bands": // fintech gas giant: violet bands with turbulence
      for (let y = 0; y < H; y += 2) { const t = Math.sin(y * 0.09 + r() * 0.4) * 0.5 + 0.5; g.fillStyle = hexA(t > 0.6 ? look.accent : look.second, 0.1 + t * 0.22); g.fillRect(0, y, W, 2); }
      for (let i = 0; i < 6; i++) blob(r() * W, 40 + r() * (H - 80), 16 + r() * 18, hexA(look.accent, 0.35));
      break;
    case "radar": // financial intelligence: emerald with scan rings and ledger lines
      for (let i = 0; i < 40; i++) blob(r() * W, r() * H, 10 + r() * 30, hexA(look.second, 0.5));
      for (let k = 1; k < 7; k++) { g.strokeStyle = hexA(look.accent, 0.32 - k * 0.04); g.lineWidth = 1.6; g.beginPath(); g.ellipse(W * 0.3, H * 0.5, k * 22, k * 13, 0, 0, Math.PI * 2); g.stroke(); }
      g.strokeStyle = hexA(look.accent, 0.25); for (let y = 30; y < H - 20; y += 14) { g.beginPath(); g.moveTo(W * 0.62, y); g.lineTo(W * 0.62 + 40 + r() * 120, y); g.stroke(); }
      break;
  }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; t.wrapS = THREE.RepeatWrapping;
  return t;
}
