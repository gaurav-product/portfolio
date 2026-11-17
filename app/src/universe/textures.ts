import * as THREE from "three";

/** Canvas-drawn textures for the Universe: lit-window façades, panel labels and
 *  text-only concept boards. Nothing here imitates a product screen. */

function canvas(w: number, h: number) {
  const c = document.createElement("canvas"); c.width = w; c.height = h;
  return { c, g: c.getContext("2d")! };
}
function finish(c: HTMLCanvasElement, srgb = true) {
  const t = new THREE.CanvasTexture(c);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}
function rng(seed: number) { let s = seed % 2147483647 || 1; return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646; }

/** A façade of window cells; some lit warm, some cool, most dark. Used as emissiveMap on glass. */
export function windowsTexture(light: string, seed = 7, cols = 8, rows = 16, litRatio = 0.42) {
  const { c, g } = canvas(256, 512), r = rng(seed);
  g.fillStyle = "#000"; g.fillRect(0, 0, 256, 512);
  const cw = 256 / cols, rh = 512 / rows;
  for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
    if (r() > litRatio) continue;
    const a = 0.35 + r() * 0.65;
    g.fillStyle = r() > 0.8 ? `rgba(220,240,255,${a})` : hexA(light, a);
    g.fillRect(x * cw + 3, y * rh + 4, cw - 6, rh - 8);
  }
  const t = finish(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; return t;
}
const hexA = (hex: string, a: number) => { const n = parseInt(hex.slice(1), 16); return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`; };

/** A small caption plate under a panel: provenance tag + title. */
export function labelTexture(tag: string, title: string, accent: string) {
  const { c, g } = canvas(1024, 160);
  g.fillStyle = "rgba(11,17,16,.88)"; g.fillRect(0, 0, 1024, 160);
  g.fillStyle = accent; g.fillRect(0, 0, 8, 160);
  g.font = "600 30px 'IBM Plex Mono', ui-monospace, monospace"; g.fillStyle = accent; g.fillText(tag.toUpperCase().slice(0, 52), 32, 58);
  g.font = "600 46px 'Space Grotesk', Inter, system-ui, sans-serif"; g.fillStyle = "#F3F6F4"; g.fillText(fit(g, title, 960), 32, 122);
  return finish(c);
}
function fit(g: CanvasRenderingContext2D, s: string, w: number) { let t = s; while (g.measureText(t).width > w && t.length > 4) t = t.slice(0, -2); return t === s ? s : t.trimEnd() + "…"; }

/** A text-only board for concepts and missing assets — clearly labelled, never a fake screen. */
export function boardTexture(lines: string[], tag: string, accent: string) {
  const { c, g } = canvas(1280, 800);
  const grd = g.createLinearGradient(0, 0, 1280, 800); grd.addColorStop(0, "#0E1715"); grd.addColorStop(1, "#14201D");
  g.fillStyle = grd; g.fillRect(0, 0, 1280, 800);
  g.strokeStyle = hexA(accent, 0.55); g.lineWidth = 4; g.strokeRect(18, 18, 1244, 764);
  g.setLineDash([10, 12]); g.strokeStyle = hexA(accent, 0.25); g.strokeRect(40, 40, 1200, 720); g.setLineDash([]);
  g.fillStyle = accent; g.font = "600 30px 'IBM Plex Mono', ui-monospace, monospace"; g.fillText(tag.toUpperCase(), 72, 104);
  let y = 200;
  lines.forEach((l, i) => {
    if (!l) { y += 26; return; }
    const head = i === 0;
    g.font = head ? "700 64px 'Space Grotesk', Inter, sans-serif" : "500 40px Inter, system-ui, sans-serif";
    g.fillStyle = head ? "#F3F6F4" : "#C9D2CD";
    for (const part of wrap(g, l, 1130)) { g.fillText(part, 72, y); y += head ? 78 : 54; }
  });
  return finish(c);
}
/** "Screens to be added" board: text on the left, three EMPTY dashed phone outlines on the right. The outlines
 *  hold no interface at all, so nothing can be mistaken for a real product screen. */
export function placeholderTexture(lines: string[], tag: string, accent: string) {
  const { c, g } = canvas(1280, 800);
  const grd = g.createLinearGradient(0, 0, 1280, 800); grd.addColorStop(0, "#0E1715"); grd.addColorStop(1, "#121D1A");
  g.fillStyle = grd; g.fillRect(0, 0, 1280, 800);
  g.strokeStyle = hexA(accent, 0.18); g.lineWidth = 1;
  for (let x = 40; x < 1280; x += 40) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, 800); g.stroke(); }
  for (let y = 40; y < 800; y += 40) { g.beginPath(); g.moveTo(0, y); g.lineTo(1280, y); g.stroke(); }
  g.strokeStyle = hexA(accent, 0.5); g.lineWidth = 3; g.strokeRect(18, 18, 1244, 764);
  g.fillStyle = accent; g.font = "600 28px 'IBM Plex Mono', ui-monospace, monospace"; g.fillText(tag.toUpperCase(), 72, 102);
  let y = 210;
  lines.forEach((l, i) => {
    if (!l) { y += 22; return; }
    const head = i < 2;
    g.font = head ? "700 60px 'Space Grotesk', Inter, sans-serif" : "500 32px Inter, system-ui, sans-serif";
    g.fillStyle = head ? "#F3F6F4" : "#B9C4BF";
    for (const part of wrap(g, l, 600)) { g.fillText(part, 72, y); y += head ? 70 : 46; }
  });
  // three empty phone outlines, dashed: placeholders, not mock-ups
  g.setLineDash([12, 10]); g.lineWidth = 3;
  [[760, 190], [930, 150], [1100, 190]].forEach(([x, top], i) => {
    const w = 140, h = 300, r = 22;
    g.strokeStyle = hexA(accent, i === 1 ? 0.75 : 0.45);
    g.beginPath(); g.moveTo(x + r, top); g.arcTo(x + w, top, x + w, top + h, r); g.arcTo(x + w, top + h, x, top + h, r);
    g.arcTo(x, top + h, x, top, r); g.arcTo(x, top, x + w, top, r); g.closePath(); g.stroke();
  });
  g.setLineDash([]);
  g.fillStyle = hexA(accent, 0.8); g.font = "600 22px 'IBM Plex Mono', ui-monospace, monospace";
  g.fillText("AWAITING REAL SCREENS", 838, 560);
  return finish(c);
}
function wrap(g: CanvasRenderingContext2D, s: string, w: number) {
  const out: string[] = []; let line = "";
  for (const word of s.split(" ")) { const t = line ? `${line} ${word}` : word; if (g.measureText(t).width > w && line) { out.push(line); line = word; } else line = t; }
  if (line) out.push(line); return out;
}

/** Decorative bar-chart façade for the fintech tower — explicitly not data. */
export function chartTexture(color: string, seed = 3) {
  const { c, g } = canvas(256, 512), r = rng(seed);
  g.fillStyle = "#000"; g.fillRect(0, 0, 256, 512);
  for (let i = 0; i < 12; i++) { const h = 60 + r() * 380; g.fillStyle = hexA(color, 0.35 + r() * 0.5); g.fillRect(10 + i * 20, 500 - h, 12, h); }
  return finish(c);
}

/** Soft round sprite for stars and dust. */
export function dotTexture() {
  const { c, g } = canvas(64, 64);
  const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grd.addColorStop(0, "rgba(255,255,255,1)"); grd.addColorStop(0.25, "rgba(255,255,255,.7)"); grd.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = grd; g.fillRect(0, 0, 64, 64);
  return finish(c, false);
}
