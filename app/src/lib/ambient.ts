/** Ambient soundscape for Explore Mode, synthesised in the browser with the Web
 *  Audio API — no audio file is downloaded. Muted by default; only a user
 *  gesture starts it (browser autoplay rules agree). */
export class Ambient {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private nodes: AudioScheduledSourceNode[] = [];

  get playing() { return !!this.ctx && this.ctx.state === "running"; }

  async start() {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) throw new Error("Web Audio is not available");
    if (!this.ctx) this.build(new AC());
    await this.ctx!.resume();
    this.master!.gain.cancelScheduledValues(this.ctx!.currentTime);
    this.master!.gain.linearRampToValueAtTime(0.06, this.ctx!.currentTime + 1.5);
  }

  async stop() {
    if (!this.ctx || !this.master) return;
    const t = this.ctx.currentTime;
    this.master.gain.cancelScheduledValues(t);
    this.master.gain.setValueAtTime(this.master.gain.value, t);
    this.master.gain.linearRampToValueAtTime(0, t + 0.4);
    await new Promise((r) => setTimeout(r, 450));
    await this.ctx.suspend();
  }

  dispose() { this.nodes.forEach((n) => { try { n.stop(); } catch {} }); this.ctx?.close(); this.ctx = null; this.master = null; this.nodes = []; }

  private build(ctx: AudioContext) {
    this.ctx = ctx;
    const master = ctx.createGain(); master.gain.value = 0; master.connect(ctx.destination); this.master = master;
    const filter = ctx.createBiquadFilter(); filter.type = "lowpass"; filter.frequency.value = 520; filter.Q.value = 0.6; filter.connect(master);
    // a soft drone: root, fifth and a detuned octave
    for (const [f, g] of [[55, 0.5], [82.41, 0.28], [110.6, 0.16]] as const) {
      const o = ctx.createOscillator(); o.type = "sine"; o.frequency.value = f;
      const v = ctx.createGain(); v.gain.value = g; o.connect(v).connect(filter); o.start(); this.nodes.push(o);
    }
    // slow "breathing" on the filter
    const lfo = ctx.createOscillator(); lfo.frequency.value = 0.07;
    const depth = ctx.createGain(); depth.gain.value = 180; lfo.connect(depth).connect(filter.frequency); lfo.start(); this.nodes.push(lfo);
    // faint filtered noise for air
    const buf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate); const d = buf.getChannelData(0);
    let last = 0; for (let i = 0; i < d.length; i++) { last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02; d[i] = last * 3.5; }
    const noise = ctx.createBufferSource(); noise.buffer = buf; noise.loop = true;
    const ng = ctx.createGain(); ng.gain.value = 0.12; noise.connect(ng).connect(filter); noise.start(); this.nodes.push(noise);
  }
}
