/**
 * AudioManager — the Product Universe's sound, synthesised in the browser with
 * the Web Audio API. Every sound is original: no files, no downloads, nothing
 * licensed. Rules:
 *  - Silent by default. Nothing plays until the visitor turns sound on, and the
 *    AudioContext is only created inside a click (browser autoplay policy).
 *  - Separate buses: ambient (a calm space pad) and interface cues. Ambient can
 *    be off while cues stay on. One master volume.
 *  - When Oz speaks, ambient ducks (~12 dB) and comes back afterwards.
 *  - Preferences persist in localStorage ("gos-audio").
 */
export type Cue = "enter" | "earth" | "hover" | "select" | "zoom" | "building" | "panel" | "back" | "oz";
export interface AudioPrefs { enabled: boolean; volume: number; ambient: boolean }

const KEY = "gos-audio";
const DEFAULTS: AudioPrefs = { enabled: false, volume: 0.7, ambient: true };
const AMBIENT_LEVEL = 0.34, DUCKED = 0.085;

function load(): AudioPrefs {
  try { const p = JSON.parse(localStorage.getItem(KEY) ?? "null"); if (p && typeof p.enabled === "boolean") return { ...DEFAULTS, ...p, volume: Math.min(1, Math.max(0, Number(p.volume) || 0)) }; } catch { /* private mode */ }
  return { ...DEFAULTS };
}

class AudioManager {
  prefs: AudioPrefs = typeof window === "undefined" ? { ...DEFAULTS } : load();
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private ambientBus: GainNode | null = null;
  private uiBus: GainNode | null = null;
  private reverb: ConvolverNode | null = null;
  private pad: { stop: () => void } | null = null;
  private wantAmbient = false;
  private ducked = false;
  private lastHover = 0;
  private listeners = new Set<(p: AudioPrefs) => void>();

  constructor() {
    if (typeof window === "undefined") return;
    window.addEventListener("oz:speaking", (e) => this.duck(!!(e as CustomEvent<boolean>).detail));
    document.addEventListener("visibilitychange", () => { if (!this.ctx) return; document.hidden ? void this.ctx.suspend() : this.prefs.enabled && void this.ctx.resume(); });
  }

  subscribe(fn: (p: AudioPrefs) => void) { this.listeners.add(fn); return () => { this.listeners.delete(fn); }; }
  private emit() { try { localStorage.setItem(KEY, JSON.stringify(this.prefs)); } catch { /* ignore */ } this.listeners.forEach((f) => f(this.prefs)); }

  /** Call only from a user gesture (click / key press). */
  setEnabled(on: boolean) {
    this.prefs = { ...this.prefs, enabled: on };
    if (on) { this.ensure(); void this.ctx?.resume(); this.applyVolume(); this.syncAmbient(); }
    else this.fadeOutAll();
    this.emit();
  }
  setVolume(v: number) { this.prefs = { ...this.prefs, volume: Math.min(1, Math.max(0, v)) }; this.applyVolume(); this.emit(); }
  setAmbient(on: boolean) { this.prefs = { ...this.prefs, ambient: on }; this.syncAmbient(); this.emit(); }
  /** The Universe page says whether an ambient bed belongs on screen right now. */
  ambientWanted(on: boolean) { this.wantAmbient = on; this.syncAmbient(); }

  get supported() { return typeof window !== "undefined" && !!(window.AudioContext || (window as unknown as { webkitAudioContext?: unknown }).webkitAudioContext); }

  private ensure() {
    if (this.ctx || !this.supported) return;
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AC(); this.ctx = ctx;
    const comp = ctx.createDynamicsCompressor(); comp.threshold.value = -18; comp.ratio.value = 3; comp.connect(ctx.destination);
    this.master = ctx.createGain(); this.master.gain.value = 0; this.master.connect(comp);
    this.reverb = ctx.createConvolver(); this.reverb.buffer = this.impulse(2.8); const wet = ctx.createGain(); wet.gain.value = 0.32; this.reverb.connect(wet).connect(this.master);
    this.ambientBus = ctx.createGain(); this.ambientBus.gain.value = AMBIENT_LEVEL; this.ambientBus.connect(this.master); this.ambientBus.connect(this.reverb);
    this.uiBus = ctx.createGain(); this.uiBus.gain.value = 0.8; this.uiBus.connect(this.master); this.uiBus.connect(this.reverb);
  }
  /** A synthetic room: decaying stereo noise. */
  private impulse(seconds: number) {
    const ctx = this.ctx!, len = Math.floor(ctx.sampleRate * seconds), buf = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let c = 0; c < 2; c++) { const d = buf.getChannelData(c); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3.2); }
    return buf;
  }
  private applyVolume() {
    if (!this.ctx || !this.master) return;
    const t = this.ctx.currentTime, target = this.prefs.enabled ? this.prefs.volume * 0.9 : 0;
    this.master.gain.cancelScheduledValues(t); this.master.gain.setTargetAtTime(target, t, 0.12);
  }
  private fadeOutAll() { this.applyVolume(); this.stopPad(); }
  private duck(on: boolean) {
    this.ducked = on;
    if (!this.ctx || !this.ambientBus) return;
    const t = this.ctx.currentTime; this.ambientBus.gain.cancelScheduledValues(t);
    this.ambientBus.gain.setTargetAtTime(on ? DUCKED : AMBIENT_LEVEL, t, on ? 0.15 : 0.8);
  }
  private syncAmbient() {
    const should = this.prefs.enabled && this.prefs.ambient && this.wantAmbient;
    if (should && !this.pad) { this.ensure(); if (this.ctx) this.pad = this.startPad(); if (this.ducked) this.duck(true); }
    if (!should) this.stopPad();
  }
  private stopPad() { this.pad?.stop(); this.pad = null; }

  /** A slow, calm space pad: detuned voices of an open Am(add9) chord through a breathing low-pass, plus rare high glints. */
  private startPad() {
    const ctx = this.ctx!, out = ctx.createGain(); out.gain.value = 0; out.connect(this.ambientBus!);
    const t0 = ctx.currentTime; out.gain.setTargetAtTime(1, t0, 2.2);
    const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 700; lp.Q.value = 0.7; lp.connect(out);
    const lfo = ctx.createOscillator(), lfoGain = ctx.createGain(); lfo.frequency.value = 0.045; lfoGain.gain.value = 380; lfo.connect(lfoGain).connect(lp.frequency); lfo.start();
    const nodes: AudioScheduledSourceNode[] = [lfo];
    for (const [f, g] of [[55, 0.32], [110, 0.18], [164.81, 0.12], [220, 0.08], [246.94, 0.05], [329.63, 0.04]] as const) {
      for (const det of [-6, 6]) {
        const o = ctx.createOscillator(); o.type = f < 100 ? "sine" : "triangle"; o.frequency.value = f; o.detune.value = det;
        const v = ctx.createGain(); v.gain.value = g / 2; o.connect(v).connect(lp); o.start(); nodes.push(o);
      }
    }
    let glint: ReturnType<typeof setTimeout>;
    const sparkle = () => { glint = setTimeout(() => { this.tone(1318.5 + (Math.random() > 0.5 ? 440 : 0), 0.02, 2.6, "sine", this.ambientBus!); sparkle(); }, 7000 + Math.random() * 9000); };
    sparkle();
    return { stop: () => { clearTimeout(glint); const t = ctx.currentTime; out.gain.cancelScheduledValues(t); out.gain.setTargetAtTime(0, t, 0.5); setTimeout(() => { nodes.forEach((n) => { try { n.stop(); } catch { /* stopped */ } }); out.disconnect(); }, 2500); } };
  }

  // ---- primitives
  private tone(freq: number, peak: number, dur: number, type: OscillatorType, bus: AudioNode, attack = 0.01, glideTo?: number, at = 0) {
    const ctx = this.ctx!, t = ctx.currentTime + at, o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, t); if (glideTo) o.frequency.exponentialRampToValueAtTime(glideTo, t + dur);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(peak, t + attack); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(bus); o.start(t); o.stop(t + dur + 0.05);
  }
  private noise(dur: number, from: number, to: number, peak: number, bus: AudioNode, q = 1.2) {
    const ctx = this.ctx!, t = ctx.currentTime, len = Math.floor(ctx.sampleRate * dur), buf = ctx.createBuffer(1, len, ctx.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource(); src.buffer = buf;
    const bp = ctx.createBiquadFilter(); bp.type = "bandpass"; bp.Q.value = q; bp.frequency.setValueAtTime(from, t); bp.frequency.exponentialRampToValueAtTime(to, t + dur);
    const g = ctx.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(peak, t + dur * 0.45); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(bp).connect(g).connect(bus); src.start(t); src.stop(t + dur + 0.05);
  }

  /** Play an interface cue. Silent unless sound is on; hover cues are throttled. */
  cue(c: Cue) {
    if (!this.prefs.enabled) return;
    this.ensure(); if (!this.ctx || !this.uiBus) return;
    if (this.ctx.state !== "running") void this.ctx.resume();
    const ui = this.uiBus;
    switch (c) {
      case "hover": { const n = performance.now(); if (n - this.lastHover < 90) return; this.lastHover = n; this.tone(1567.98, 0.035, 0.12, "sine", ui, 0.004); break; }
      case "select": this.tone(880, 0.12, 0.9, "sine", ui); this.tone(1318.51, 0.08, 1.1, "sine", ui, 0.01, undefined, 0.07); this.tone(1760, 0.04, 1.2, "triangle", ui, 0.01, undefined, 0.14); break;
      case "zoom": this.noise(1.1, 260, 2600, 0.16, ui, 0.9); break;
      case "back": this.noise(1.0, 2400, 280, 0.14, ui, 0.9); this.tone(110, 0.12, 1.2, "sine", ui, 0.2); break;
      case "building": this.tone(72, 0.4, 1.6, "sine", ui, 0.01, 38); this.noise(1.4, 180, 900, 0.08, ui, 0.6); this.tone(987.77, 0.06, 1.4, "sine", ui, 0.02, undefined, 0.35); break;
      case "panel": this.tone(2637, 0.04, 0.28, "triangle", ui, 0.003); this.tone(3951, 0.025, 0.32, "sine", ui, 0.003, undefined, 0.03); break;
      case "enter": this.noise(2.2, 120, 1800, 0.12, ui, 0.7); this.tone(55, 0.3, 2.6, "sine", ui, 1.2); break;
      case "earth": for (const [i, f] of [220, 261.63, 329.63, 493.88].entries()) this.tone(f, 0.06, 3.2, "triangle", ui, 0.9, undefined, i * 0.12); break;
      case "oz": this.tone(523.25, 0.07, 0.16, "square", ui, 0.005, 659.25); this.tone(783.99, 0.06, 0.2, "triangle", ui, 0.005, undefined, 0.11); break;
    }
  }
}

export const audio = new AudioManager();
