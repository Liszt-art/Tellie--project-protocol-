// Web Audio API ambient generator & sound effects for zero-broken audio links
class SoundEngine {
  private ctx: AudioContext | null = null;
  private ambientGain: GainNode | null = null;
  private noiseNode: AudioBufferSourceNode | null = null;
  private filterNode: BiquadFilterNode | null = null;
  private activeAmbientType: 'rain' | 'crickets' | 'starlight' | null = null;
  private cricketInterval: any = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Soft crystalline chime on interaction or spirit tap
  public playChime(freq = 528) {
    try {
      this.initContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, this.ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 1.3);
    } catch {
      // Audio autoplay policy fallback
    }
  }

  // Paper burn sizzle & release sound
  public playBurnSound() {
    try {
      this.initContext();
      if (!this.ctx) return;

      const bufferSize = this.ctx.sampleRate * 2.5;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);

      // Generate crackling/ember noise
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        // Intermittent crackles
        data[i] = white * (Math.random() > 0.85 ? 0.4 : 0.05);
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(800, this.ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(200, this.ctx.currentTime + 2.5);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 2.5);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start();
      noise.stop(this.ctx.currentTime + 2.6);

      // Add soft celestial release chord
      setTimeout(() => this.playChime(432), 600);
      setTimeout(() => this.playChime(648), 1200);
    } catch {
      // Fallback
    }
  }

  // Ambient soundscapes for Chốn An Toàn
  public startAmbient(type: 'rain' | 'crickets' | 'starlight') {
    this.stopAmbient();
    this.initContext();
    if (!this.ctx) return;

    this.activeAmbientType = type;
    this.ambientGain = this.ctx.createGain();
    this.ambientGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
    // Increased default volume higher than current to a pleasant, soothing level (0.28)
    this.ambientGain.gain.exponentialRampToValueAtTime(0.28, this.ctx.currentTime + 1.2);
    this.ambientGain.connect(this.ctx.destination);

    if (type === 'rain') {
      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        // Rich pink noise rain approximation
        data[i] = (lastOut + (0.04 * white)) / 1.02;
        lastOut = data[i];
      }
      this.noiseNode = this.ctx.createBufferSource();
      this.noiseNode.buffer = buffer;
      this.noiseNode.loop = true;

      this.filterNode = this.ctx.createBiquadFilter();
      this.filterNode.type = 'lowpass';
      this.filterNode.frequency.setValueAtTime(850, this.ctx.currentTime);

      this.noiseNode.connect(this.filterNode);
      this.filterNode.connect(this.ambientGain);
      this.noiseNode.start();
    } else if (type === 'starlight') {
      // Deep 432Hz meditative healing drone with rich harmonics
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const subOsc = this.ctx.createOscillator();
      osc1.type = 'sine';
      osc2.type = 'sine';
      subOsc.type = 'triangle';
      osc1.frequency.setValueAtTime(216, this.ctx.currentTime); // 432 / 2
      osc2.frequency.setValueAtTime(218.5, this.ctx.currentTime); // gentle binaural beat
      subOsc.frequency.setValueAtTime(108, this.ctx.currentTime);

      const subGain = this.ctx.createGain();
      subGain.gain.setValueAtTime(0.35, this.ctx.currentTime);
      subOsc.connect(subGain);
      subGain.connect(this.ambientGain);

      osc1.connect(this.ambientGain);
      osc2.connect(this.ambientGain);
      osc1.start();
      osc2.start();
      subOsc.start();
      (this as any).droneOscs = [osc1, osc2, subOsc];
    } else if (type === 'crickets') {
      // Warm night breeze + clear tranquil cricket trills
      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.08;
      }
      this.noiseNode = this.ctx.createBufferSource();
      this.noiseNode.buffer = buffer;
      this.noiseNode.loop = true;
      this.noiseNode.connect(this.ambientGain);
      this.noiseNode.start();

      this.cricketInterval = setInterval(() => {
        if (!this.ctx || !this.ambientGain) return;
        const cOsc = this.ctx.createOscillator();
        const cGain = this.ctx.createGain();
        cOsc.type = 'triangle';
        cOsc.frequency.setValueAtTime(4200 + (Math.random() * 400), this.ctx.currentTime);
        cGain.gain.setValueAtTime(0.045, this.ctx.currentTime);
        cGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.16);
        cOsc.connect(cGain);
        cGain.connect(this.ambientGain);
        cOsc.start();
        cOsc.stop(this.ctx.currentTime + 0.18);
      }, 600);
    }
  }

  public setAmbientVolume(vol: number) {
    if (!this.ctx || !this.ambientGain) return;
    const clamped = Math.max(0, Math.min(1, vol));
    this.ambientGain.gain.setValueAtTime(clamped * 0.45, this.ctx.currentTime);
  }

  public stopAmbient() {
    if (this.cricketInterval) {
      clearInterval(this.cricketInterval);
      this.cricketInterval = null;
    }
    if ((this as any).droneOscs) {
      (this as any).droneOscs.forEach((o: AudioScheduledSourceNode) => {
        try { o.stop(); } catch {}
      });
      (this as any).droneOscs = null;
    }
    if (this.noiseNode) {
      try { this.noiseNode.stop(); } catch {}
      this.noiseNode = null;
    }
    this.activeAmbientType = null;
  }

  public getActiveAmbient() {
    return this.activeAmbientType;
  }
}

export const sound = new SoundEngine();
