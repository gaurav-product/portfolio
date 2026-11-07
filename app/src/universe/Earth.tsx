import { useEffect, useMemo, useRef, type MutableRefObject } from "react";
import { useFrame, useLoader, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import gsap from "gsap";
import type { StudyPin, Region } from "~/content/studyMap";
import type { SceneApi, SceneEvents, Tier } from "./bus";
import { audio } from "./audio";
import { asset } from "~/lib/meta";

/* Earth radius 2. The 90 study markers are grouped by derived category — a visual layout, not geography. */
const R = 2;
const HOME_DIST = 7.2;
const SUN = new THREE.Vector3(0.95, 0.28, 0.42).normalize();
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

/* one marker per study: instanced heads with per-pin colour, size, far-side fade and filter dimming on the GPU */
const pinVert = /* glsl */ `
attribute vec3 aColor; attribute float aDim;
uniform float uReveal;
varying vec3 vColor; varying float vAlpha;
void main() {
  vec4 c = modelMatrix * instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0);
  float facing = dot(normalize(c.xyz), normalize(cameraPosition - c.xyz));
  vAlpha = smoothstep(0.02, 0.3, facing) * uReveal * mix(1.0, 0.13, aDim);
  vColor = aColor;
  gl_Position = projectionMatrix * viewMatrix * modelMatrix * instanceMatrix * vec4(position, 1.0);
}`;
const pinFrag = /* glsl */ `
varying vec3 vColor; varying float vAlpha;
void main() { gl_FragColor = vec4(vColor * 1.35, vAlpha); if (vAlpha < 0.01) discard;
  #include <colorspace_fragment>
}`;
const PIN_ALT = R * 1.03; // just above the cloud shell
const TOP_BAR = 76; // px kept clear of category labels: the full-screen top bar (12–16px padding + 44px buttons) and a margin

export function EarthView({ tier, reduced, pins, regions, dim, selected, events, api, hovered, intro, preview }: {
  tier: Tier; reduced: boolean; pins: StudyPin[]; regions: Region[]; dim: Set<number> | null; selected: number | null;
  events: MutableRefObject<SceneEvents>; api: MutableRefObject<SceneApi | null>;
  hovered: string | null; intro: boolean; preview: MutableRefObject<HTMLElement | null>;
}) {
  const t = TEX[tier];
  const urls = [t.day, t.brc, ...(t.night ? [t.night] : [])].map(asset);
  const [day, brc, night] = useLoader(THREE.TextureLoader, urls);
  const { camera, gl, invalidate, size } = useThree();
  useMemo(() => {
    const aniso = Math.min(8, gl.capabilities.getMaxAnisotropy());
    day.colorSpace = THREE.SRGBColorSpace; day.anisotropy = aniso;
    if (night) night.colorSpace = THREE.SRGBColorSpace;
    brc.colorSpace = THREE.NoColorSpace;
  }, [day, brc, night, gl]);

  const spin = useRef<THREE.Group>(null!);
  const clouds = useRef<THREE.Mesh>(null!);
  const hoveredRef = useRef(hovered); hoveredRef.current = hovered;
  const selectedRef = useRef(selected); selectedRef.current = selected;
  const pausedUntil = useRef(0);
  /** while the camera is being directed, orbit controls must not clamp or fight it */
  const animating = useRef(false);

  const uniforms = useMemo(() => ({
    dayMap: { value: day }, nightMap: { value: night ?? day }, brcMap: { value: brc }, sunDir: { value: SUN }, hasNight: { value: night ? 1 : 0 }, rimColor: { value: new THREE.Color("#3FB8FF") },
  }), [day, night, brc]);
  const cloudUniforms = useMemo(() => ({ brcMap: { value: brc }, sunDir: { value: SUN } }), [brc]);
  const atmoUniforms = useMemo(() => ({ sunDir: { value: SUN }, glow: { value: new THREE.Color("#4FC3FF") } }), []);

  /* ---- the 90 pins: positions, instanced heads and an instanced (invisible) hit layer ---- */
  const local = useMemo(() => new Map(pins.map((p) => [p.day, latLon(p.lat, p.lon, PIN_ALT)])), [pins]);
  const byIndex = pins.map((p) => p.day);
  const pinUniforms = useMemo(() => ({ uReveal: { value: intro && !reduced ? 0 : 1 } }), [intro, reduced]);
  const { heads, hits } = useMemo(() => {
    const base = tier === "mobile" ? 0.036 : 0.03;
    const geo = new THREE.SphereGeometry(1, 14, 10);
    const colors = new Float32Array(pins.length * 3), dims = new Float32Array(pins.length);
    const c = new THREE.Color();
    pins.forEach((p, i) => { c.set(p.color); colors.set([c.r, c.g, c.b], i * 3); });
    geo.setAttribute("aColor", new THREE.InstancedBufferAttribute(colors, 3));
    geo.setAttribute("aDim", new THREE.InstancedBufferAttribute(dims, 1));
    const mat = new THREE.ShaderMaterial({ vertexShader: pinVert, fragmentShader: pinFrag, uniforms: pinUniforms, transparent: true, depthWrite: false, toneMapped: false });
    const heads = new THREE.InstancedMesh(geo, mat, pins.length);
    const hitGeo = new THREE.SphereGeometry(tier === "mobile" ? 0.12 : 0.075, 8, 6);
    const hits = new THREE.InstancedMesh(hitGeo, new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false, colorWrite: false }), pins.length);
    const o = new THREE.Object3D();
    pins.forEach((p, i) => {
      o.position.copy(local.get(p.day)!); o.scale.setScalar(base * (0.55 + 0.45 * (p.size / 9))); o.updateMatrix(); heads.setMatrixAt(i, o.matrix);
      o.scale.setScalar(1); o.updateMatrix(); hits.setMatrixAt(i, o.matrix);
    });
    heads.frustumCulled = false; hits.frustumCulled = false;
    return { heads, hits };
  }, [pins, local, tier, pinUniforms]);
  useEffect(() => () => { heads.geometry.dispose(); (heads.material as THREE.Material).dispose(); hits.geometry.dispose(); (hits.material as THREE.Material).dispose(); }, [heads, hits]);
  // filters dim non-matching pins (attribute update, no re-render of the scene graph)
  useEffect(() => {
    const a = heads.geometry.getAttribute("aDim") as THREE.InstancedBufferAttribute;
    pins.forEach((p, i) => a.setX(i, dim && !dim.has(p.day) ? 1 : 0));
    a.needsUpdate = true; invalidate();
  }, [dim, pins, heads, invalidate]);

  /* hover and selection rings, region labels */
  const ringGeo = useMemo(() => new THREE.RingGeometry(0.055, 0.07, 40), []);
  const hoverRing = useRef<THREE.Mesh>(null!), selRing = useRef<THREE.Mesh>(null!);
  const labels = useMemo(() => regions.map((r) => {
    const cv = document.createElement("canvas"); cv.width = 512; cv.height = 96; const g = cv.getContext("2d")!;
    g.font = "600 40px 'IBM Plex Mono', ui-monospace, monospace"; g.textAlign = "center"; g.fillStyle = "rgba(255,255,255,.9)";
    g.fillText(`${r.name.toUpperCase()} · ${r.count}`, 256, 62);
    const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace;
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false, toneMapped: false }));
    sp.scale.set(0.72, 0.135, 1); sp.position.copy(latLon(r.lat + 9, r.lon, R * 1.16));
    return sp;
  }), [regions]);
  useEffect(() => () => labels.forEach((l) => { l.material.map?.dispose(); l.material.dispose(); }), [labels]);
  useEffect(() => () => ringGeo.dispose(), [ringGeo]);

  /* orbit controls: drag to rotate, wheel/pinch to zoom, no pan */
  const controls = useMemo(() => {
    const c = new OrbitControls(camera, gl.domElement);
    c.enablePan = false; c.enableDamping = true; c.dampingFactor = 0.08; c.rotateSpeed = 0.55; c.zoomSpeed = 0.7;
    c.minDistance = 3.2; c.maxDistance = 14; c.minPolarAngle = 0.35; c.maxPolarAngle = Math.PI - 0.35;
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

  /* where a pin is in world space, and whether it faces the camera */
  const worldOf = (day: number) => { const l = local.get(day); return l ? spin.current.localToWorld(l.clone()) : null; };
  const facingOf = (day: number) => { const p = worldOf(day); if (!p) return 0; return p.clone().normalize().dot(camera.position.clone().sub(p).normalize()); };
  /** the spin angle that turns a pin to face a direction */
  const angleFacing = (day: number, dir: THREE.Vector3) => {
    const g = spin.current, keep = g.rotation.y; let best = keep, bestDot = -2;
    for (let i = 0; i < 360; i += 2) {
      g.rotation.y = keep + THREE.MathUtils.degToRad(i); g.updateMatrixWorld(true);
      const d = worldOf(day)!.normalize().dot(dir);
      if (d > bestDot) { bestDot = d; best = g.rotation.y; }
    }
    g.rotation.y = keep; g.updateMatrixWorld(true);
    return best;
  };
  const turnTo = (day: number, seconds: number) => {
    const target = angleFacing(day, camera.position.clone().normalize());
    let d = target - spin.current.rotation.y; d = Math.atan2(Math.sin(d), Math.cos(d));
    gsap.to(spin.current.rotation, { y: spin.current.rotation.y + d, duration: reduced ? 0 : seconds, ease: "power2.inOut", onUpdate: invalidate });
  };
  /** move the camera around the globe (never through it) to look along `dir` from `dist` */
  const move = useRef<gsap.core.Tween | null>(null);
  const flyTo = (dir: THREE.Vector3, dist: number) => {
    move.current?.kill();
    const sph = new THREE.Spherical().setFromVector3(dir);
    sph.phi = THREE.MathUtils.clamp(sph.phi, controls.minPolarAngle + 0.02, controls.maxPolarAngle - 0.02); sph.radius = 1;
    const to = new THREE.Vector3().setFromSpherical(sph);
    const fromDir = camera.position.clone().normalize(), d0 = camera.position.length();
    const q = new THREE.Quaternion().setFromUnitVectors(fromDir, to), qi = new THREE.Quaternion(), o = { t: 0 };
    direct(true);
    move.current = gsap.to(o, { t: 1, duration: reduced ? 0 : 1.4, ease: "power2.inOut",
      onUpdate: () => { qi.identity().slerp(q, o.t); camera.position.copy(fromDir).applyQuaternion(qi).multiplyScalar(d0 + (dist - d0) * o.t); camera.lookAt(0, 0, 0); invalidate(); },
      onComplete: () => direct(false) });
  };

  /* intro and the imperative API */
  const tl = useRef<gsap.core.Timeline | null>(null);
  useEffect(() => {
    const home = new THREE.Vector3(0, 1.1, HOME_DIST);
    const report = (p: number) => events.current.onIntro(p);
    const runIntro = () => {
      tl.current?.kill();
      if (reduced) { camera.position.copy(home); pinUniforms.uReveal.value = 1; report(1); invalidate(); return; }
      camera.position.set(16, 5, 66); pinUniforms.uReveal.value = 0; direct(true);
      const prog = { p: 0 };
      tl.current = gsap.timeline({ onUpdate: () => { report(prog.p); invalidate(); }, onComplete: () => { direct(false); report(1); audio.cue("earth"); } })
        .to(prog, { p: 1, duration: 9, ease: "none" }, 0)
        .to(camera.position, { x: 0, y: 1.1, z: HOME_DIST, duration: 7.4, ease: "power3.inOut" }, 0.6)
        .to(pinUniforms.uReveal, { value: 1, duration: 2.2, ease: "power1.out" }, 5.4)
        .add(() => audio.cue("zoom"), 2.4);
    };
    if (intro) runIntro();
    else { camera.position.copy(home); pinUniforms.uReveal.value = 1; report(1); }
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
      face(id) { const d = Number(id); if (!local.has(d)) return; pausedUntil.current = performance.now() + 8000; turnTo(d, 1.1); },
      focus(id) {
        if (id !== null) { tl.current?.kill(); pinUniforms.uReveal.value = 1; events.current.onIntro(1); }
        if (id === null) { pausedUntil.current = performance.now() + 4000; flyTo(camera.position.clone().normalize(), HOME_DIST); return; }
        const d = Number(id); if (!local.has(d)) return;
        pausedUntil.current = Infinity; audio.cue("select"); flyTo(worldOf(d)!.normalize(), gl.domElement.clientWidth < 900 ? 6.4 : 4.6); // narrow screens: stay back so the region stays readable
      },
      skipIntro() { if (tl.current?.isActive()) { tl.current.progress(1); } },
      replayIntro() { runIntro(); },
    };
    return () => { tl.current?.kill(); move.current?.kill(); api.current = null; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // keep the selected study clear of its panel: right-hand panel on wide screens, bottom sheet on narrow ones
  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera, w = size.width, h = size.height;
    if (selected === null || !w) cam.clearViewOffset();
    else if (w >= 900) cam.setViewOffset(w, h, Math.min(440, w * 0.4) / 2, 0, w, h);
    else cam.setViewOffset(w, h, 0, h * 0.27, w, h);
    invalidate();
    return () => cam.clearViewOffset();
  }, [selected, size, camera, invalidate]);
  // releasing a selection lets the slow spin resume after a moment
  useEffect(() => { if (selected === null && pausedUntil.current === Infinity) pausedUntil.current = performance.now() + 4000; }, [selected]);

  /* per frame: slow spin, clouds, rings, label fade and the preview card */
  const v = useMemo(() => ({ p: new THREE.Vector3(), n: new THREE.Vector3(), c: new THREE.Vector3(), q: new THREE.Quaternion(), up: new THREE.Vector3(0, 0, 1), right: new THREE.Vector3(), upv: new THREE.Vector3(), q2: new THREE.Vector3() }), []);
  useFrame((state, dt) => {
    const now = performance.now();
    if (!reduced && now > pausedUntil.current && !hoveredRef.current) spin.current.rotation.y += dt * 0.045;
    if (clouds.current && !reduced) clouds.current.rotation.y += dt * 0.008;
    if (!animating.current) controls.update();
    const time = state.clock.elapsedTime;
    const placeRing = (mesh: THREE.Mesh, day: number | null, color: string, pulse: number) => {
      const l = day !== null ? local.get(day) : null;
      if (!l || facingOf(day!) < 0.15) { mesh.visible = false; return; }
      mesh.visible = true; mesh.position.copy(l);
      mesh.quaternion.copy(v.q.setFromUnitVectors(v.up, l.clone().normalize()));
      mesh.scale.setScalar(1 + pulse);
      (mesh.material as THREE.MeshBasicMaterial).color.set(color);
    };
    const hd = hoveredRef.current ? Number(hoveredRef.current) : null;
    placeRing(hoverRing.current, hd, hd !== null ? pins.find((p) => p.day === hd)?.color ?? "#fff" : "#fff", reduced ? 0 : 0.15 * Math.sin(time * 5));
    placeRing(selRing.current, selectedRef.current, "#4DFF4D", reduced ? 0.3 : 0.3 + 0.25 * ((time * 0.8) % 1));
    // labels fade out wherever their on-screen box would reach the top bar (its buttons) or leave the screen
    const W = gl.domElement.clientWidth, H = gl.domElement.clientHeight;
    v.right.setFromMatrixColumn(camera.matrixWorld, 0); v.upv.setFromMatrixColumn(camera.matrixWorld, 1);
    const toPx = (p: THREE.Vector3) => { p.project(camera); return [(p.x * 0.5 + 0.5) * W, (-p.y * 0.5 + 0.5) * H]; };
    for (const l of labels) {
      l.getWorldPosition(v.p); v.n.copy(v.p).normalize(); v.c.copy(camera.position).sub(v.p).normalize();
      const facing = THREE.MathUtils.smoothstep(v.n.dot(v.c), 0.1, 0.45);
      let clear = 0;
      if (facing > 0) {
        const wx = l.scale.x * 0.5, wy = l.scale.y * 0.5;
        const [x0] = toPx(v.q2.copy(v.p).addScaledVector(v.right, -wx)), [x1] = toPx(v.q2.copy(v.p).addScaledVector(v.right, wx));
        const [, yTop] = toPx(v.q2.copy(v.p).addScaledVector(v.upv, wy));
        const left = Math.min(x0, x1), right = Math.max(x0, x1);
        // TOP_BAR: the top bar's height in CSS px (buttons 44px + padding) plus a margin
        clear = THREE.MathUtils.smoothstep(yTop, TOP_BAR, TOP_BAR + 24) * THREE.MathUtils.smoothstep(left, 0, 12) * THREE.MathUtils.smoothstep(W - right, 0, 12);
      }
      l.material.opacity = facing * clear * pinUniforms.uReveal.value * (selectedRef.current !== null ? 0.45 : 0.9);
      l.visible = l.material.opacity > 0.01;
    }
    const el = preview.current;
    if (el) {
      if (hd !== null && facingOf(hd) > 0.2) {
        v.p.copy(worldOf(hd)!).project(camera);
        const x = (v.p.x * 0.5 + 0.5) * gl.domElement.clientWidth, y = (-v.p.y * 0.5 + 0.5) * gl.domElement.clientHeight;
        el.style.transform = `translate(${Math.round(x)}px, ${Math.round(y)}px)`; el.dataset.visible = "true";
      } else el.dataset.visible = "false";
    }
  });

  const usable = (i: number | undefined) => i !== undefined && facingOf(byIndex[i]) > 0.25 && pinUniforms.uReveal.value > 0.5;
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
        <primitive object={heads} />
        <primitive object={hits}
          onPointerMove={(e: { instanceId?: number; stopPropagation(): void }) => {
            if (!usable(e.instanceId)) return; e.stopPropagation();
            const id = String(byIndex[e.instanceId!]);
            if (hoveredRef.current !== id) { document.body.style.cursor = "pointer"; audio.cue("hover"); events.current.onHover(id); }
          }}
          onPointerOut={() => { document.body.style.cursor = ""; events.current.onHover(null); }}
          onClick={(e: { instanceId?: number; stopPropagation(): void }) => { if (!usable(e.instanceId)) return; e.stopPropagation(); events.current.onSelect(String(byIndex[e.instanceId!])); }} />
        <mesh ref={hoverRing} geometry={ringGeo} visible={false}><meshBasicMaterial transparent opacity={0.9} side={THREE.DoubleSide} depthWrite={false} toneMapped={false} /></mesh>
        <mesh ref={selRing} geometry={ringGeo} visible={false}><meshBasicMaterial transparent opacity={0.95} side={THREE.DoubleSide} depthWrite={false} toneMapped={false} /></mesh>
        {labels.map((l, i) => <primitive key={i} object={l} />)}
      </group>
      <mesh scale={1.16}>
        <sphereGeometry args={[R, 64, 32]} />
        <shaderMaterial vertexShader={earthVert} fragmentShader={atmoFrag} uniforms={atmoUniforms} transparent side={THREE.BackSide} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
    </group>
  );
}
