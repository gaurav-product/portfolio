import { useEffect, useMemo, useRef, type MutableRefObject } from "react";
import { useFrame, useLoader, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import gsap from "gsap";
import type { Destination, Cluster } from "~/content/universe";
import type { SceneApi, SceneEvents, Tier } from "./bus";
import { audio } from "./audio";
import { asset } from "~/lib/meta";

/* Earth radius 2. Markers are a visual layout on the globe — not locations of the work. */
const R = 2;
const HOME_DIST = 7.2;
const SUN = new THREE.Vector3(0.95, 0.28, 0.42).normalize();
export const CLUSTER_COLOR: Record<Cluster, string> = {
  "Healthcare": "#4DFF4D", "AI": "#35D6D0", "Fintech": "#A98BFF", "Research & writing": "#F2C14E", "Emerging Ventures": "#FF9E6B",
};
const CLUSTER_ORDER: Cluster[] = ["Healthcare", "AI", "Fintech", "Research & writing", "Emerging Ventures"];
const TEX: Record<Tier, { day: string; night: string | null; brc: string; seg: number }> = {
  high: { day: "/universe/earth-day-4k.webp", night: "/universe/earth-night-2k.webp", brc: "/universe/earth-brc-2k.webp", seg: 96 },
  laptop: { day: "/universe/earth-day-2k.webp", night: "/universe/earth-night-2k.webp", brc: "/universe/earth-brc-1k.webp", seg: 72 },
  mobile: { day: "/universe/earth-day-1k.webp", night: "/universe/earth-night-1k.webp", brc: "/universe/earth-brc-1k.webp", seg: 48 },
};

export function latLon(lat: number, lon: number, r = R) {
  const phi = THREE.MathUtils.degToRad(90 - lat), theta = THREE.MathUtils.degToRad(lon + 180);
  return new THREE.Vector3(-r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta));
}

const earthVert = /* glsl */ `
varying vec2 vUv; varying vec3 vN; varying vec3 vW;
void main() { vUv = uv; vN = normalize(mat3(modelMatrix) * normal); vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`;
const earthFrag = /* glsl */ `
uniform sampler2D dayMap; uniform sampler2D nightMap; uniform sampler2D brcMap; uniform vec3 sunDir; uniform float hasNight; uniform vec3 rimColor;
varying vec2 vUv; varying vec3 vN; varying vec3 vW;
void main() {
  vec3 n = normalize(vN); vec3 v = normalize(cameraPosition - vW);
  float ndl = dot(n, sunDir);
  float dayMix = smoothstep(-0.18, 0.42, ndl);
  vec3 day = texture2D(dayMap, vUv).rgb;
  vec3 brc = texture2D(brcMap, vUv).rgb;
  vec3 night = hasNight > 0.5 ? texture2D(nightMap, vUv).rgb * vec3(1.35, 1.1, 0.8) : day * 0.02;
  night *= (1.0 - brc.b * 0.85); // clouds hide city lights
  vec3 lit = day * (0.05 + max(ndl, 0.0) * 1.08);
  float rough = clamp(brc.g, 0.0, 1.0);
  vec3 h = normalize(sunDir + v);
  float spec = pow(max(dot(n, h), 0.0), 90.0) * (1.0 - rough) * 0.38 * dayMix;
  vec3 col = mix(night, lit, dayMix) + spec * vec3(0.75, 0.86, 1.0);
  float rim = pow(1.0 - max(dot(n, v), 0.0), 2.6);
  col += rimColor * rim * (0.08 + 0.42 * smoothstep(-0.3, 0.6, ndl));
  gl_FragColor = vec4(col, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`;
const cloudFrag = /* glsl */ `
uniform sampler2D brcMap; uniform vec3 sunDir;
varying vec2 vUv; varying vec3 vN; varying vec3 vW;
void main() {
  vec3 n = normalize(vN); float ndl = dot(n, sunDir);
  float a = texture2D(brcMap, vUv).b;
  float light = smoothstep(-0.2, 0.5, ndl);
  gl_FragColor = vec4(vec3(0.92, 0.96, 1.0) * (0.08 + light), a * (0.12 + 0.78 * light));
  #include <colorspace_fragment>
}`;
const atmoFrag = /* glsl */ `
uniform vec3 sunDir; uniform vec3 glow;
varying vec2 vUv; varying vec3 vN; varying vec3 vW;
void main() {
  vec3 n = normalize(vN); vec3 v = normalize(cameraPosition - vW);
  // back faces: 0 at the shell's outer edge, rising towards the planet's limb — a soft halo, no hard ring
  float i = pow(clamp(-dot(n, v), 0.0, 1.0), 1.7) * 1.25;
  float lit = smoothstep(-0.45, 0.4, dot(n, sunDir));
  gl_FragColor = vec4(glow * (0.2 + 0.8 * lit), i * (0.2 + 0.8 * lit));
  #include <colorspace_fragment>
}`;

interface MarkerRef { group: THREE.Group; head: THREE.MeshBasicMaterial; beam: THREE.MeshBasicMaterial; ring: THREE.Mesh; ringMat: THREE.MeshBasicMaterial; cluster: Cluster; facing: number }

export function EarthView({ tier, reduced, list, events, api, hovered, intro, returnFrom, preview }: {
  tier: Tier; reduced: boolean; list: Destination[]; events: MutableRefObject<SceneEvents>; api: MutableRefObject<SceneApi | null>;
  hovered: string | null; intro: boolean; returnFrom: string | null; preview: MutableRefObject<HTMLElement | null>;
}) {
  const t = TEX[tier];
  const urls = [t.day, t.brc, ...(t.night ? [t.night] : [])].map(asset);
  const [day, brc, night] = useLoader(THREE.TextureLoader, urls);
  const { camera, gl, invalidate } = useThree();
  useMemo(() => {
    const aniso = Math.min(8, gl.capabilities.getMaxAnisotropy());
    day.colorSpace = THREE.SRGBColorSpace; day.anisotropy = aniso;
    if (night) night.colorSpace = THREE.SRGBColorSpace;
    brc.colorSpace = THREE.NoColorSpace;
  }, [day, brc, night, gl]);

  const spin = useRef<THREE.Group>(null!);
  const clouds = useRef<THREE.Mesh>(null!);
  const markers = useRef<Record<string, MarkerRef>>({});
  const hoveredRef = useRef(hovered); hoveredRef.current = hovered;
  const reveal = useRef(intro && !reduced ? 0 : 1);
  const pausedUntil = useRef(0);
  const busy = useRef(false);
  /** while the camera is being directed, orbit controls must not clamp or fight it */
  const animating = useRef(false);

  const uniforms = useMemo(() => ({
    dayMap: { value: day }, nightMap: { value: night ?? day }, brcMap: { value: brc }, sunDir: { value: SUN }, hasNight: { value: night ? 1 : 0 }, rimColor: { value: new THREE.Color("#3FB8FF") },
  }), [day, night, brc]);
  const cloudUniforms = useMemo(() => ({ brcMap: { value: brc }, sunDir: { value: SUN } }), [brc]);
  const atmoUniforms = useMemo(() => ({ sunDir: { value: SUN }, glow: { value: new THREE.Color("#4FC3FF") } }), []);

  /* orbit controls: drag to rotate, wheel/pinch to zoom, no pan */
  const controls = useMemo(() => {
    const c = new OrbitControls(camera, gl.domElement);
    c.enablePan = false; c.enableDamping = true; c.dampingFactor = 0.08; c.rotateSpeed = 0.55; c.zoomSpeed = 0.7;
    c.minDistance = 3.4; c.maxDistance = 14; c.minPolarAngle = 0.35; c.maxPolarAngle = Math.PI - 0.35;
    return c;
  }, [camera, gl]);
  useEffect(() => {
    const pause = () => { pausedUntil.current = performance.now() + 6000; };
    controls.addEventListener("start", pause);
    const redraw = () => invalidate();
    controls.addEventListener("change", redraw);
    return () => { controls.removeEventListener("start", pause); controls.removeEventListener("change", redraw); controls.dispose(); };
  }, [controls, invalidate]);

  const direct = (on: boolean) => { animating.current = on; controls.enabled = !on; if (!on) controls.update(); };

  /* where a marker currently is, in world space */
  const worldOf = (slug: string) => { const m = markers.current[slug]; return m ? m.group.getWorldPosition(new THREE.Vector3()) : null; };
  /** the spin angle that turns a marker to face a direction */
  const angleFacing = (slug: string, dir: THREE.Vector3) => {
    const g = spin.current, keep = g.rotation.y; let best = keep, bestDot = -2;
    for (let i = 0; i < 360; i += 2) {
      g.rotation.y = keep + THREE.MathUtils.degToRad(i); g.updateMatrixWorld(true);
      const p = worldOf(slug)!.normalize(), d = p.dot(dir);
      if (d > bestDot) { bestDot = d; best = g.rotation.y; }
    }
    g.rotation.y = keep; g.updateMatrixWorld(true);
    return best;
  };

  /* intro, return-from-world, and the imperative API */
  const tl = useRef<gsap.core.Timeline | null>(null);
  useEffect(() => {
    const home = new THREE.Vector3(0, 1.1, HOME_DIST);
    const report = (p: number) => events.current.onIntro(p);
    const runIntro = () => {
      tl.current?.kill();
      if (reduced) { camera.position.copy(home); reveal.current = 1; report(1); invalidate(); return; }
      camera.position.set(16, 5, 66); reveal.current = 0; direct(true);
      const prog = { p: 0 };
      tl.current = gsap.timeline({ onUpdate: () => { report(prog.p); invalidate(); }, onComplete: () => { direct(false); report(1); audio.cue("earth"); } })
        .to(prog, { p: 1, duration: 9, ease: "none" }, 0)
        .to(camera.position, { x: 0, y: 1.1, z: HOME_DIST, duration: 7.4, ease: "power3.inOut" }, 0.6)
        .to(reveal, { current: 1, duration: 2.2, ease: "power1.out" }, 5.4)
        .add(() => audio.cue("zoom"), 2.4);
    };
    if (returnFrom) {
      // come back out of the world we were in, facing its marker — the visitor keeps their place
      tl.current?.kill();
      const dir = new THREE.Vector3(0, 0.15, 1).normalize();
      spin.current.rotation.y = angleFacing(returnFrom, dir); spin.current.updateMatrixWorld(true);
      const p = worldOf(returnFrom)!.normalize();
      camera.position.copy(p.clone().multiplyScalar(reduced ? HOME_DIST : 2.9));
      if (!reduced) { direct(true); audio.cue("back"); gsap.to(camera.position, { x: p.x * HOME_DIST, y: p.y * HOME_DIST, z: p.z * HOME_DIST, duration: 2, ease: "power2.out", onUpdate: invalidate, onComplete: () => direct(false) }); }
      reveal.current = 1; report(1);
    } else if (intro) runIntro();
    else { camera.position.copy(home); reveal.current = 1; report(1); }
    controls.update();
    events.current.onReady("earth");

    api.current = {
      rotate(dx, dy) {
        pausedUntil.current = performance.now() + 6000;
        const s = new THREE.Spherical().setFromVector3(camera.position);
        s.theta -= dx; s.phi = THREE.MathUtils.clamp(s.phi - dy, 0.35, Math.PI - 0.35);
        camera.position.setFromSpherical(s); controls.update(); invalidate();
      },
      zoom(f) { const d = THREE.MathUtils.clamp(camera.position.length() * f, controls.minDistance, controls.maxDistance); camera.position.setLength(d); controls.update(); invalidate(); },
      face(slug) {
        if (!markers.current[slug] || busy.current) return;
        pausedUntil.current = performance.now() + 8000;
        const target = angleFacing(slug, camera.position.clone().normalize());
        let d = target - spin.current.rotation.y; d = Math.atan2(Math.sin(d), Math.cos(d));
        gsap.to(spin.current.rotation, { y: spin.current.rotation.y + d, duration: reduced ? 0 : 1.1, ease: "power2.inOut", onUpdate: invalidate });
      },
      fly(slug) {
        if (busy.current || !markers.current[slug]) return;
        busy.current = true; tl.current?.kill(); reveal.current = 1; direct(true);
        const done = () => { busy.current = false; events.current.onArrive(slug); };
        if (reduced) { done(); return; }
        audio.cue("select");
        const dir = camera.position.clone().normalize();
        const target = angleFacing(slug, dir);
        let d = target - spin.current.rotation.y; d = Math.atan2(Math.sin(d), Math.cos(d));
        gsap.timeline({ onUpdate: invalidate, onComplete: done })
          .to(spin.current.rotation, { y: spin.current.rotation.y + d, duration: 1.1, ease: "power2.inOut" }, 0)
          .add(() => audio.cue("zoom"), 0.9)
          .to(camera.position, { x: dir.x * 2.45, y: dir.y * 2.45, z: dir.z * 2.45, duration: 1.5, ease: "power3.in" }, 0.85);
      },
      skipIntro() { if (tl.current?.isActive()) { tl.current.progress(1); } },
      replayIntro() { runIntro(); },
    };
    return () => { tl.current?.kill(); api.current = null; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* per frame: slow spin, clouds drift, markers fade on the far side, preview card follows the hovered marker */
  const v = useMemo(() => ({ p: new THREE.Vector3(), n: new THREE.Vector3(), c: new THREE.Vector3() }), []);
  useFrame((state, dt) => {
    const now = performance.now();
    if (!reduced && !busy.current && now > pausedUntil.current && !hoveredRef.current) spin.current.rotation.y += dt * 0.045;
    if (clouds.current && !reduced) clouds.current.rotation.y += dt * 0.008;
    if (!animating.current) controls.update();
    const time = state.clock.elapsedTime;
    let order = 0;
    for (const slug in markers.current) {
      const m = markers.current[slug];
      m.group.getWorldPosition(v.p); v.n.copy(v.p).normalize(); v.c.copy(camera.position).sub(v.p).normalize();
      const facing = THREE.MathUtils.smoothstep(v.n.dot(v.c), 0.02, 0.3); m.facing = facing;
      const r = THREE.MathUtils.clamp((reveal.current - CLUSTER_ORDER.indexOf(m.cluster) * 0.12) * 2.2, 0, 1);
      const hot = hoveredRef.current === slug ? 1 : 0;
      const a = facing * r;
      m.head.opacity = a; m.beam.opacity = a * 0.55; m.ringMat.opacity = a * (0.35 + 0.35 * Math.sin(time * 2.4 + order));
      const s = 1 + hot * 0.7 + (reduced ? 0 : 0.08 * Math.sin(time * 2 + order));
      m.group.scale.setScalar(s); m.ring.scale.setScalar(1 + ((time * 0.6 + order * 0.2) % 1) * (reduced ? 0 : 1.6));
      m.group.visible = a > 0.01;
      order++;
    }
    const el = preview.current, h = hoveredRef.current;
    if (el) {
      const m = h ? markers.current[h] : null;
      if (m && m.facing > 0.2) {
        m.group.getWorldPosition(v.p); v.p.project(camera);
        const x = (v.p.x * 0.5 + 0.5) * gl.domElement.clientWidth, y = (-v.p.y * 0.5 + 0.5) * gl.domElement.clientHeight;
        el.style.transform = `translate(${Math.round(x)}px, ${Math.round(y)}px)`; el.dataset.visible = "true";
      } else el.dataset.visible = "false";
    }
  });

  return (
    <group rotation={[0, 0, THREE.MathUtils.degToRad(-23.4)]}>
      <group ref={spin} rotation={[0, -1.2, 0]}>
        <mesh>
          <sphereGeometry args={[R, t.seg, t.seg / 2]} />
          <shaderMaterial vertexShader={earthVert} fragmentShader={earthFrag} uniforms={uniforms} />
        </mesh>
        {tier !== "mobile" && (
          <mesh ref={clouds} scale={1.012}>
            <sphereGeometry args={[R, t.seg, t.seg / 2]} />
            <shaderMaterial vertexShader={earthVert} fragmentShader={cloudFrag} uniforms={cloudUniforms} transparent depthWrite={false} />
          </mesh>
        )}
        {list.map((d) => <Marker key={d.slug} d={d} reg={markers} events={events} />)}
      </group>
      <mesh scale={1.16}>
        <sphereGeometry args={[R, 64, 32]} />
        <shaderMaterial vertexShader={earthVert} fragmentShader={atmoFrag} uniforms={atmoUniforms} transparent side={THREE.BackSide} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
    </group>
  );
}

function Marker({ d, reg, events }: { d: Destination; reg: MutableRefObject<Record<string, MarkerRef>>; events: MutableRefObject<SceneEvents> }) {
  const color = CLUSTER_COLOR[d.cluster];
  const pos = useMemo(() => latLon(d.lat, d.lon, R * 1.002), [d.lat, d.lon]);
  const quat = useMemo(() => new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), pos.clone().normalize()), [pos]);
  const group = useRef<THREE.Group>(null!), head = useRef<THREE.MeshBasicMaterial>(null!), beam = useRef<THREE.MeshBasicMaterial>(null!), ring = useRef<THREE.Mesh>(null!), ringMat = useRef<THREE.MeshBasicMaterial>(null!);
  useEffect(() => {
    reg.current[d.slug] = { group: group.current, head: head.current, beam: beam.current, ring: ring.current, ringMat: ringMat.current, cluster: d.cluster, facing: 1 };
    return () => { delete reg.current[d.slug]; };
  }, [d.slug, d.cluster, reg]);
  const usable = () => (reg.current[d.slug]?.facing ?? 0) > 0.25;
  return (
    <group ref={group} position={pos} quaternion={quat}>
      <mesh position={[0, 0.14, 0]}>
        <cylinderGeometry args={[0.006, 0.006, 0.28, 6]} />
        <meshBasicMaterial ref={beam} color={color} transparent blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh position={[0, 0.29, 0]}>
        <sphereGeometry args={[d.concept ? 0.032 : 0.04, 16, 12]} />
        <meshBasicMaterial ref={head} color={color} transparent toneMapped={false} />
      </mesh>
      <mesh ref={ring} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.004, 0]}>
        <ringGeometry args={[0.05, 0.065, 32]} />
        <meshBasicMaterial ref={ringMat} color={color} transparent side={THREE.DoubleSide} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
      </mesh>
      {/* generous invisible hit area */}
      <mesh position={[0, 0.22, 0]}
        onPointerOver={(e) => { if (!usable()) return; e.stopPropagation(); document.body.style.cursor = "pointer"; audio.cue("hover"); events.current.onHover(d.slug); }}
        onPointerOut={() => { document.body.style.cursor = ""; events.current.onHover(null); }}
        onClick={(e) => { if (!usable()) return; e.stopPropagation(); events.current.onSelect(d.slug); }}>
        <sphereGeometry args={[0.13, 8, 6]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  );
}
