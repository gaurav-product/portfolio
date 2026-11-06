// Original procedural 3D scenes for Gaurav.OS section headers.
// Rendered offline by brand/tools/render_3d.mjs (headless Chromium + three.js) into still images.
// Abstract by design: no text, no logos, no data. Each scene is a visual metaphor for its section,
// never a depiction of a real product, dashboard or facility.
import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

const W = 1600, H = 1000, PR = 2;
const C = { bg: 0x0b1110, body: 0x142420, body2: 0x1b2f29, green: 0x6be39a, cyan: 0x35d6d0, ink: 0xf3f6f4, amber: 0xf2c14e };

// deterministic randomness so a re-render is byte-for-byte reproducible in composition
let seed = 7;
const rnd = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;

function stage({ cam = [0, 6, 16], look = [0, 2, 0], fov = 35, fog = [22, 60] } = {}) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(PR); renderer.setSize(W, H);
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
  document.body.appendChild(renderer.domElement);
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(C.bg);
  scene.fog = new THREE.Fog(C.bg, fog[0], fog[1]);
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.25;
  const camera = new THREE.PerspectiveCamera(fov, W / H, 0.1, 200);
  camera.position.set(...cam); camera.lookAt(...look);
  scene.add(new THREE.HemisphereLight(0xcfe9dc, C.bg, 0.55));
  const key = new THREE.DirectionalLight(0xffffff, 1.4); key.position.set(8, 14, 10); scene.add(key);
  const rim = new THREE.DirectionalLight(C.cyan, 0.9); rim.position.set(-10, 6, -8); scene.add(rim);
  // ground: dark, slightly glossy, with a faint grid that dissolves into the fog
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), new THREE.MeshStandardMaterial({ color: 0x0a110f, roughness: 0.72, metalness: 0.25, envMapIntensity: 0.15 }));
  ground.rotation.x = -Math.PI / 2; scene.add(ground);
  const grid = new THREE.GridHelper(60, 60, 0x1f4033, 0x16281f); grid.position.y = 0.002;
  grid.material.transparent = true; grid.material.opacity = 0.35; scene.add(grid);
  scene.add(pool(8, C.green, 0.12));
  return { renderer, scene, camera };
}

/** soft light pooled on the ground under the subject */
function pool(r, color, strength) {
  const cv = document.createElement("canvas"); cv.width = cv.height = 256;
  const g = cv.getContext("2d"); const grad = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  const c = new THREE.Color(color); const rgb = `${Math.round(c.r * 255)},${Math.round(c.g * 255)},${Math.round(c.b * 255)}`;
  grad.addColorStop(0, `rgba(${rgb},${strength})`); grad.addColorStop(1, `rgba(${rgb},0)`);
  g.fillStyle = grad; g.fillRect(0, 0, 256, 256);
  const m = new THREE.Mesh(new THREE.PlaneGeometry(r * 2, r * 2), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(cv), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
  m.rotation.x = -Math.PI / 2; m.position.y = 0.01; return m;
}

/** a dark solid with a glowing outline — the shared building block with the Explore city */
function solid(geo, { tone = C.green, edge = 0.85, emissive = 0.05, color = C.body, metal = 0.5, rough = 0.35 } = {}) {
  const g = new THREE.Group();
  g.add(new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color, emissive: tone, emissiveIntensity: emissive, metalness: metal, roughness: rough })));
  const e = new THREE.LineSegments(new THREE.EdgesGeometry(geo, 25), new THREE.LineBasicMaterial({ color: tone, transparent: true, opacity: edge }));
  g.add(e); return g;
}
function glass(geo, tone = C.green) {
  const g = new THREE.Group();
  g.add(new THREE.Mesh(geo, new THREE.MeshPhysicalMaterial({ color: 0x1d3530, roughness: 0.08, metalness: 0.1, transparent: true, opacity: 0.32, clearcoat: 1, side: THREE.DoubleSide, depthWrite: false })));
  g.add(new THREE.LineSegments(new THREE.EdgesGeometry(geo, 25), new THREE.LineBasicMaterial({ color: tone, transparent: true, opacity: 0.9 })));
  return g;
}
const glowMat = (c, o = 1) => new THREE.MeshBasicMaterial({ color: c, transparent: o < 1, opacity: o, toneMapped: false });
function orb(r, c = C.green) { return new THREE.Mesh(new THREE.SphereGeometry(r, 32, 16), glowMat(c)); }
function ring(r, t, c = C.green, o = 1) { return new THREE.Mesh(new THREE.TorusGeometry(r, t, 12, 160), glowMat(c, o)); }
function beam(a, b, c = C.green, r = 0.02, o = 0.9) {
  const dir = new THREE.Vector3().subVectors(b, a); const len = dir.length();
  const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, len, 8, 1, true), glowMat(c, o));
  m.position.copy(a).addScaledVector(dir, 0.5); m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize()); return m;
}
function dust(n, spread, h, c = C.green, size = 0.05) {
  const pts = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) { pts[i * 3] = (rnd() - 0.5) * spread; pts[i * 3 + 1] = rnd() * h; pts[i * 3 + 2] = (rnd() - 0.5) * spread; }
  const geo = new THREE.BufferGeometry(); geo.setAttribute("position", new THREE.BufferAttribute(pts, 3));
  return new THREE.Points(geo, new THREE.PointsMaterial({ color: c, size, transparent: true, opacity: 0.75, toneMapped: false, depthWrite: false, blending: THREE.AdditiveBlending }));
}
function plinth(r = 3.2, h = 0.4) {
  const g = new THREE.Group();
  g.add(solid(new THREE.CylinderGeometry(r, r * 1.04, h, 96), { edge: 0.5 })); g.children[0].position.y = h / 2;
  const lip = ring(r + 0.02, 0.018, C.green, 0.9); lip.rotation.x = Math.PI / 2; lip.position.y = h; g.add(lip);
  return g;
}

// ------------------------------------------------------------------ scenes
const SCENES = {
  /** About — the operating loop: eight stages orbit a glass core */
  about() {
    const s = stage({ cam: [0, 5.2, 15], look: [0, 3, 0] });
    s.scene.add(plinth(3.4));
    const core = glass(new THREE.BoxGeometry(2.2, 2.2, 2.2)); core.position.y = 3.2; core.rotation.set(0.35, 0.6, 0); s.scene.add(core);
    const heart = orb(0.55); heart.position.y = 3.2; s.scene.add(heart);
    const loop = new THREE.Group(); loop.position.y = 3.2; loop.rotation.x = 1.15; loop.rotation.z = 0.15;
    loop.add(ring(3.6, 0.03, C.green, 0.95));
    for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2; const n = orb(i === 0 ? 0.22 : 0.15, i % 2 ? C.cyan : C.green); n.position.set(Math.cos(a) * 3.6, Math.sin(a) * 3.6, 0); loop.add(n); }
    s.scene.add(loop);
    const outer = ring(4.6, 0.012, C.cyan, 0.5); outer.position.y = 3.2; outer.rotation.x = 1.35; s.scene.add(outer);
    s.scene.add(dust(260, 22, 9));
    return s;
  },
  /** Projects — products as stacked, shipped layers on a launch plinth */
  projects() {
    const s = stage({ cam: [6, 6.5, 14], look: [0, 2.6, 0] });
    s.scene.add(plinth(3.6));
    for (let i = 0; i < 5; i++) {
      const slab = new THREE.Group();
      const card = solid(new THREE.BoxGeometry(4.2, 0.16, 2.8), { tone: i === 4 ? C.green : i % 2 ? C.cyan : C.green, edge: 0.9, emissive: 0.04 });
      slab.add(card);
      // abstract interface blocks on each layer — shapes only, no text or numbers
      for (let k = 0; k < 4; k++) { const h = 0.08 + rnd() * 0.45; const b = solid(new THREE.BoxGeometry(0.7, h, 0.5), { tone: k === 0 ? C.green : C.cyan, edge: 1, emissive: 0.12, color: C.body2 }); b.position.set(-1.4 + k * 0.95, 0.08 + h / 2, 0.6); slab.add(b); }
      const bar = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.03, 0.06), glowMat(i === 4 ? C.green : C.ink, 0.7)); bar.position.set(-0.6, 0.1, -0.7); slab.add(bar);
      slab.position.set(Math.sin(i * 0.8) * 0.5, 0.9 + i * 0.95, Math.cos(i * 0.8) * 0.3);
      slab.rotation.y = -0.35 + i * 0.16; slab.rotation.z = (i % 2 ? 1 : -1) * 0.03;
      s.scene.add(slab);
    }
    const top = orb(0.18); top.position.set(0.4, 6.1, 0.2); s.scene.add(top);
    s.scene.add(beam(new THREE.Vector3(0.4, 0.4, 0.2), new THREE.Vector3(0.4, 6, 0.2), C.green, 0.012, 0.5));
    s.scene.add(dust(220, 22, 9, C.cyan, 0.045));
    return s;
  },
  /** Case studies — a decision tree: many options, one evidenced path lit */
  "case-studies"() {
    const s = stage({ cam: [0, 4.2, 16], look: [0, 3, 0] });
    s.scene.add(plinth(3));
    const lit = new Set(["0", "0-1", "0-1-0", "0-1-0-1"]);
    const grow = (id, p, depth, spread, dir) => {
      const node = orb(lit.has(id) ? 0.2 : 0.11, lit.has(id) ? C.green : 0x4f8a76); node.position.copy(p); s.scene.add(node);
      if (depth === 0) return;
      for (let k = 0; k < 2; k++) {
        const q = p.clone().add(new THREE.Vector3((k ? 1 : -1) * spread, 1.15, (rnd() - 0.5) * 0.8));
        const cid = `${id}-${k}`;
        s.scene.add(beam(p, q, lit.has(cid) ? C.green : 0x3d7564, lit.has(cid) ? 0.035 : 0.018, lit.has(cid) ? 1 : 0.9));
        grow(cid, q, depth - 1, spread * 0.55, dir);
      }
    };
    grow("0", new THREE.Vector3(0, 0.6, 0), 4, 2.4, 1);
    s.scene.add(dust(200, 22, 9));
    return s;
  },
  /** Product Thinking — a funnel: many inputs narrowing to one decision */
  "product-thinking"() {
    const s = stage({ cam: [0, 6, 15], look: [0, 3, 0] });
    s.scene.add(plinth(2.4));
    const n = 7;
    for (let i = 0; i < n; i++) {
      const r = 3.6 - i * 0.45, y = 6.2 - i * 0.8;
      const rg = ring(r, i === n - 1 ? 0.05 : 0.025, i === n - 1 ? C.green : i % 2 ? C.cyan : C.green, 0.95 - i * 0.04); rg.rotation.x = Math.PI / 2; rg.position.y = y; s.scene.add(rg);
      const disc = new THREE.Mesh(new THREE.CircleGeometry(r, 96), new THREE.MeshBasicMaterial({ color: C.green, transparent: true, opacity: 0.025, side: THREE.DoubleSide, depthWrite: false })); disc.rotation.x = -Math.PI / 2; disc.position.y = y; s.scene.add(disc);
    }
    for (let i = 0; i < 90; i++) { const t = rnd(); const a = rnd() * Math.PI * 2; const r = (3.6 - t * 2.9) * Math.sqrt(rnd()); const p = orb(0.035, rnd() > 0.7 ? C.cyan : C.green); p.position.set(Math.cos(a) * r, 6.4 - t * 5, Math.sin(a) * r); s.scene.add(p); }
    const target = orb(0.32); target.position.y = 0.95; s.scene.add(target);
    const halo = ring(0.7, 0.02, C.green, 0.8); halo.rotation.x = Math.PI / 2; halo.position.y = 0.95; s.scene.add(halo);
    s.scene.add(dust(150, 22, 9, C.cyan, 0.04));
    return s;
  },
  /** Skills — a field of capabilities; the evidenced ones stand tall and lit */
  skills() {
    const s = stage({ cam: [9, 8, 13], look: [0, 1, 0] });
    const N = 7, gap = 0.95;
    for (let x = 0; x < N; x++) for (let z = 0; z < N; z++) {
      const d = Math.hypot(x - 3, z - 3); const h = Math.max(0.25, 2.8 - d * 0.55 + rnd() * 0.9);
      const lit = h > 1.6;
      const b = solid(new THREE.BoxGeometry(0.72, h, 0.72), { tone: lit ? C.green : 0x2f5a4c, edge: lit ? 0.95 : 0.55, emissive: lit ? 0.08 : 0.02 });
      b.position.set((x - 3) * gap, h / 2, (z - 3) * gap); s.scene.add(b);
      if (lit) { const cap = new THREE.Mesh(new THREE.PlaneGeometry(0.6, 0.6), glowMat(rnd() > 0.6 ? C.cyan : C.green, 0.9)); cap.rotation.x = -Math.PI / 2; cap.position.set((x - 3) * gap, h + 0.005, (z - 3) * gap); s.scene.add(cap); }
    }
    s.scene.add(dust(200, 22, 8));
    return s;
  },
  /** Product Atlas — a globe of points with arcs between markets */
  atlas() {
    const s = stage({ cam: [0, 4.2, 15], look: [0, 3.6, 0] });
    s.scene.add(plinth(2.2, 0.3));
    const R = 3, pos = [], g = new THREE.Group(); g.position.y = 3.8; g.rotation.set(0.3, 0.5, 0.12);
    const M = 900;
    for (let i = 0; i < M; i++) { const y = 1 - (i / (M - 1)) * 2, r = Math.sqrt(1 - y * y), th = i * 2.399963; pos.push(Math.cos(th) * r * R, y * R, Math.sin(th) * r * R); }
    const geo = new THREE.BufferGeometry(); geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    g.add(new THREE.Points(geo, new THREE.PointsMaterial({ color: C.green, size: 0.06, transparent: true, opacity: 0.9, toneMapped: false })));
    g.add(new THREE.Mesh(new THREE.SphereGeometry(R * 0.985, 48, 24), new THREE.MeshStandardMaterial({ color: 0x0f1d19, roughness: 0.6, metalness: 0.2, transparent: true, opacity: 0.85 })));
    const pick = () => { const i = Math.floor(rnd() * M); return new THREE.Vector3(pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2]); };
    for (let k = 0; k < 14; k++) {
      const a = pick(), b = pick(); const mid = a.clone().add(b).multiplyScalar(0.5); mid.setLength(R * (1.25 + rnd() * 0.25));
      const curve = new THREE.QuadraticBezierCurve3(a, mid, b);
      g.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 48, 0.012, 6), glowMat(k % 3 ? C.green : C.cyan, 0.9)));
      const pa = orb(0.06, C.ink); pa.position.copy(a); g.add(pa);
    }
    s.scene.add(g);
    const eq = ring(R + 0.7, 0.014, C.cyan, 0.6); eq.position.y = 3.8; eq.rotation.x = 1.4; s.scene.add(eq);
    s.scene.add(dust(160, 22, 9, C.cyan, 0.04));
    return s;
  },
  /** Contact — a beacon sending signal outward */
  contact() {
    const s = stage({ cam: [0, 5.5, 15], look: [0, 2.8, 0] });
    s.scene.add(plinth(2.6));
    const mast = solid(new THREE.CylinderGeometry(0.12, 0.28, 4.2, 24), { edge: 0.8 }); mast.position.y = 2.5; s.scene.add(mast);
    const head = orb(0.26); head.position.y = 4.9; s.scene.add(head);
    for (let i = 0; i < 6; i++) { const rg = ring(0.9 + i * 0.85, 0.02, i % 2 ? C.cyan : C.green, 0.9 - i * 0.13); rg.position.y = 4.9; rg.rotation.x = Math.PI / 2 - 0.12; s.scene.add(rg); }
    for (let i = 0; i < 4; i++) { const rg = ring(3 + i * 1.6, 0.015, C.green, 0.55 - i * 0.1); rg.rotation.x = Math.PI / 2; rg.position.y = 0.02; s.scene.add(rg); }
    s.scene.add(beam(new THREE.Vector3(0, 4.9, 0), new THREE.Vector3(0, 9, 0), C.green, 0.03, 0.2));
    s.scene.add(dust(200, 22, 10));
    return s;
  },
  /** Lab Notes — loose pages in the air, ideas still being worked */
  "lab-notes"() {
    const s = stage({ cam: [2, 5, 15], look: [0, 3, 0] });
    s.scene.add(plinth(2.8));
    for (let i = 0; i < 6; i++) {
      const page = new THREE.Group();
      page.add(glass(new THREE.PlaneGeometry(2.1, 2.8), i === 2 ? C.green : C.cyan));
      // ruled lines only — shapes, never words
      for (let l = 0; l < 7; l++) { const ln = new THREE.Mesh(new THREE.PlaneGeometry(l === 0 ? 1.1 : 1.5 - rnd() * 0.5, 0.035), glowMat(l === 0 ? C.green : 0x9fc7b8, l === 0 ? 0.9 : 0.3)); ln.position.set(-0.75 + (ln.geometry.parameters.width / 2), 1.0 - l * 0.3, 0.01); page.add(ln); }
      const a = -0.9 + i * 0.36;
      page.position.set(Math.sin(a) * 3.4, 2.4 + Math.sin(i * 1.7) * 0.6 + i * 0.12, Math.cos(a) * 1.6 - 1.2);
      page.rotation.set(-0.1 + rnd() * 0.15, -a * 0.9, (rnd() - 0.5) * 0.25);
      s.scene.add(page);
    }
    const spark = orb(0.25); spark.position.set(0, 1.2, 0.6); s.scene.add(spark);
    s.scene.add(dust(200, 22, 9));
    return s;
  },
  /** Ask Gaurav — retrieval: an index of cards orbits the core; only a matching card connects */
  ask() {
    const s = stage({ cam: [0, 5.4, 15], look: [0, 3.2, 0] });
    s.scene.add(plinth(2.4));
    const core = new THREE.Mesh(new THREE.IcosahedronGeometry(1.1, 1), new THREE.MeshStandardMaterial({ color: 0x163029, emissive: C.green, emissiveIntensity: 0.25, metalness: 0.4, roughness: 0.3, flatShading: true }));
    core.position.y = 3.2; s.scene.add(core);
    const wire = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(1.12, 1)), new THREE.LineBasicMaterial({ color: C.green })); wire.position.y = 3.2; s.scene.add(wire);
    const orbit = new THREE.Group(); orbit.position.y = 3.2; orbit.rotation.set(0.35, 0, 0.12);
    orbit.add(ring(3.4, 0.012, C.cyan, 0.6));
    let hit = null;
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2; const card = solid(new THREE.BoxGeometry(0.75, 0.5, 0.05), { tone: i === 3 ? C.green : C.cyan, edge: i === 3 ? 1 : 0.6, emissive: i === 3 ? 0.3 : 0.03 });
      card.position.set(Math.cos(a) * 3.4, 0, Math.sin(a) * 3.4); card.lookAt(0, 0, 0); orbit.add(card); if (i === 3) hit = card;
    }
    s.scene.add(orbit);
    orbit.updateMatrixWorld(); const hp = new THREE.Vector3(); hit.getWorldPosition(hp);
    s.scene.add(beam(new THREE.Vector3(0, 3.2, 0), hp, C.green, 0.03, 1));
    s.scene.add(dust(200, 22, 9, C.cyan, 0.045));
    return s;
  },
  /** Search — a lens sweeping across a field of points, sharpening what it finds */
  search() {
    const s = stage({ cam: [0, 7.5, 13], look: [0, 1.4, 0] });
    for (let i = 0; i < 520; i++) { const x = (rnd() - 0.5) * 16, z = (rnd() - 0.5) * 10; const near = Math.hypot(x - 1, z) < 2.1; const p = orb(near ? 0.07 : 0.035, near ? C.green : 0x3a6a5a); p.position.set(x, 0.05, z); s.scene.add(p); }
    const lens = new THREE.Group(); lens.position.set(1, 2.6, 0); lens.rotation.x = -1.2;
    lens.add(ring(2.1, 0.06, C.green)); lens.add(new THREE.Mesh(new THREE.CircleGeometry(2.08, 96), new THREE.MeshPhysicalMaterial({ color: 0x24443a, transparent: true, opacity: 0.18, roughness: 0.05, clearcoat: 1, depthWrite: false })));
    s.scene.add(lens);
    const handle = solid(new THREE.CylinderGeometry(0.14, 0.18, 2.6, 16), { edge: 1, emissive: 0.15, color: C.body2 }); handle.position.set(3.1, 1.3, 1.3); handle.rotation.set(0.6, 0, 0.9); s.scene.add(handle);
    s.scene.add(pool(3, C.green, 0.35));
    s.scene.add(dust(120, 22, 8, C.cyan, 0.04));
    return s;
  },
};

export async function render(id) {
  seed = 7; const s = SCENES[id]();
  const composer = new EffectComposer(s.renderer);
  composer.addPass(new RenderPass(s.scene, s.camera));
  composer.addPass(new UnrealBloomPass(new THREE.Vector2(W * PR, H * PR), 0.75, 0.6, 0.5));
  composer.addPass(new OutputPass());
  composer.render();
  return s.renderer.domElement.toDataURL("image/png");
}
export const ids = Object.keys(SCENES);
