/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

class GamelanSoundEngine {
  private ctx: AudioContext | null = null;
  private masterVolume: GainNode | null = null;
  private bgmVolumeNode: GainNode | null = null;
  private sfxVolumeNode: GainNode | null = null;
  private bgmInterval: any = null;
  private isBgmPlaying = false;
  private isForestPlaying = false;
  private forestInterval: any = null;
  private bgmVolume = 0.5;
  private sfxVolume = 0.6;

  // Pentatonic Slendro Scale frequencies (approximate)
  // Barang, Gulu, Dada, Lima, Nem
  private slendroScale = [220, 252, 291, 330, 382, 440, 504, 582, 660, 764];

  constructor() {
    // Avoid active audio context on load due to autoplay policy
  }

  private initContext() {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(e => console.warn("Failed to resume AudioContext:", e));
      }
      return;
    }
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
      
      this.masterVolume = this.ctx.createGain();
      this.masterVolume.gain.setValueAtTime(1.0, this.ctx.currentTime);
      this.masterVolume.connect(this.ctx.destination);

      this.bgmVolumeNode = this.ctx.createGain();
      this.bgmVolumeNode.gain.setValueAtTime(this.bgmVolume, this.ctx.currentTime);
      this.bgmVolumeNode.connect(this.masterVolume);

      this.sfxVolumeNode = this.ctx.createGain();
      this.sfxVolumeNode.gain.setValueAtTime(this.sfxVolume, this.ctx.currentTime);
      this.sfxVolumeNode.connect(this.masterVolume);
    } catch (e) {
      console.error("Web Audio API not supported", e);
    }
  }

  setVolumes(bgm: number, sfx: number) {
    this.bgmVolume = bgm;
    this.sfxVolume = sfx;
    if (this.bgmVolumeNode && this.ctx) {
      this.bgmVolumeNode.gain.linearRampToValueAtTime(bgm, this.ctx.currentTime + 0.1);
    }
    if (this.sfxVolumeNode && this.ctx) {
      this.sfxVolumeNode.gain.linearRampToValueAtTime(sfx, this.ctx.currentTime + 0.1);
    }
  }

  playGong() {
    this.initContext();
    if (!this.ctx || !this.sfxVolumeNode) return;

    const t = this.ctx.currentTime;
    
    // Fundamental deep tone
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(74, t); // Deep D2
    // Slight pitch drop over time typical of gongs
    osc1.frequency.exponentialRampToValueAtTime(72, t + 4.0);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(111, t); // Harmonics
    osc2.frequency.exponentialRampToValueAtTime(109, t + 4.0);

    // Filter to sweeten the tone and remove harshness
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(180, t);
    filter.frequency.exponentialRampToValueAtTime(100, t + 3.0);

    gainNode.gain.setValueAtTime(0.01, t);
    gainNode.gain.linearRampToValueAtTime(0.8, t + 0.15); // Build up slow strike
    gainNode.gain.exponentialRampToValueAtTime(0.001, t + 6.0); // Long decay

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.sfxVolumeNode);

    osc1.start(t);
    osc2.start(t);

    osc1.stop(t + 6.0);
    osc2.stop(t + 6.0);
  }

  playSaron(noteIndex = 4, delay = 0) {
    this.initContext();
    if (!this.ctx || !this.sfxVolumeNode) return;

    const t = this.ctx.currentTime + delay;
    const freq = this.slendroScale[noteIndex % this.slendroScale.length];

    const osc = this.ctx.createOscillator();
    const modulator = this.ctx.createOscillator();
    const modGain = this.ctx.createGain();
    const gainNode = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    // FM Synthesis for Javanese bronze bell texture
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, t);

    modulator.type = 'sine';
    modulator.frequency.setValueAtTime(freq * 2.05, t); // Inharmonic metal ratio

    modGain.gain.setValueAtTime(freq * 0.4, t);
    modGain.gain.exponentialRampToValueAtTime(0.1, t + 1.2);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(freq * 1.5, t);
    filter.Q.setValueAtTime(1.5, t);

    gainNode.gain.setValueAtTime(0.6, t);
    gainNode.gain.exponentialRampToValueAtTime(0.001, t + 1.5); // Ring decay

    modulator.connect(modGain);
    modGain.connect(osc.frequency);
    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.sfxVolumeNode);

    modulator.start(t);
    osc.start(t);

    modulator.stop(t + 1.6);
    osc.stop(t + 1.6);
  }

  playKendhang() {
    this.initContext();
    if (!this.ctx || !this.sfxVolumeNode) return;

    const t = this.ctx.currentTime;
    
    // Drum head simulation
    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    osc.type = 'sine';
    // Deep wooden pitch drops quickly for kick sound
    osc.frequency.setValueAtTime(140, t);
    osc.frequency.exponentialRampToValueAtTime(65, t + 0.15);

    gainNode.gain.setValueAtTime(0.7, t);
    gainNode.gain.exponentialRampToValueAtTime(0.001, t + 0.4);

    osc.connect(gainNode);
    gainNode.connect(this.sfxVolumeNode);

    osc.start(t);
    osc.stop(t + 0.45);
  }

  playClick() {
    this.initContext();
    if (!this.ctx || !this.sfxVolumeNode) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(900, t);
    osc.frequency.exponentialRampToValueAtTime(400, t + 0.05);

    gainNode.gain.setValueAtTime(0.15, t);
    gainNode.gain.exponentialRampToValueAtTime(0.001, t + 0.06);

    osc.connect(gainNode);
    gainNode.connect(this.sfxVolumeNode);

    osc.start(t);
    osc.stop(t + 0.07);
  }

  toggleForestAmbient(enable: boolean) {
    this.initContext();
    if (!this.ctx || !this.sfxVolumeNode) return;

    if (!enable) {
      this.isForestPlaying = false;
      if (this.forestInterval) {
        clearInterval(this.forestInterval);
        this.forestInterval = null;
      }
      return;
    }

    if (this.isForestPlaying) return;
    this.isForestPlaying = true;

    // Procedural crickets and forest wind
    const playCricketChirp = () => {
      if (!this.isForestPlaying || !this.ctx || !this.sfxVolumeNode) return;
      const t = this.ctx.currentTime;
      
      const duration = 0.8 + Math.random() * 0.5;
      const baseFreq = 4000 + Math.random() * 500;
      
      const osc = this.ctx.createOscillator();
      const mod = this.ctx.createOscillator();
      const modGain = this.ctx.createGain();
      const gainNode = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq, t);

      // Rapid volume/pitch pulsing like a cricket chirp
      mod.type = 'square';
      mod.frequency.setValueAtTime(45, t); // Pulsing frequency

      modGain.gain.setValueAtTime(baseFreq * 0.05, t);

      gainNode.gain.setValueAtTime(0.001, t);
      gainNode.gain.linearRampToValueAtTime(0.015, t + duration * 0.1);
      gainNode.gain.setValueAtTime(0.015, t + duration * 0.8);
      gainNode.gain.exponentialRampToValueAtTime(0.001, t + duration);

      mod.connect(modGain);
      modGain.connect(osc.frequency);
      osc.connect(gainNode);
      gainNode.connect(this.sfxVolumeNode);

      mod.start(t);
      osc.start(t);
      mod.stop(t + duration + 0.1);
      osc.stop(t + duration + 0.1);
    };

    // Wind noise
    const playWindBreeze = () => {
      if (!this.isForestPlaying || !this.ctx || !this.sfxVolumeNode) return;
      const t = this.ctx.currentTime;
      const dur = 4.0;

      // Create white noise
      const bufferSize = this.ctx.sampleRate * dur;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noiseNode = this.ctx.createBufferSource();
      noiseNode.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(300, t);
      // Sweeping wind frequency
      filter.frequency.exponentialRampToValueAtTime(450, t + 2.0);
      filter.frequency.exponentialRampToValueAtTime(250, t + 4.0);
      filter.Q.setValueAtTime(1.2, t);

      const gainNode = this.ctx.createGain();
      gainNode.gain.setValueAtTime(0.001, t);
      gainNode.gain.linearRampToValueAtTime(0.05, t + 1.5);
      gainNode.gain.linearRampToValueAtTime(0.001, t + 4.0);

      noiseNode.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(this.sfxVolumeNode);

      noiseNode.start(t);
      noiseNode.stop(t + dur);
    };

    // Run intervals
    this.forestInterval = setInterval(() => {
      if (Math.random() > 0.4) playCricketChirp();
      if (Math.random() > 0.7) playWindBreeze();
    }, 1200);
  }

  // Meditative backgrounds BGM loop
  startBGM() {
    this.initContext();
    if (this.isBgmPlaying) return;
    this.isBgmPlaying = true;

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    let beat = 0;
    const playRhythm = () => {
      if (!this.isBgmPlaying || !this.ctx) return;

      // Every 8 beats (8 seconds), strike a deep resonant Gong
      if (beat % 8 === 0) {
        this.playGong();
      }

      // Randomly sound a celestial high bell note to build an epic, emotional ambiance
      if (beat % 2 === 0 || Math.random() > 0.6) {
        // Pentatonic melodies
        const melody = [2, 4, 5, 7, 4, 2, 7, 9, 5, 4];
        const note = melody[Math.floor(Math.random() * melody.length)];
        // Ensure saron sound is soft and played with beautiful spatial feeling
        this.playSaron(note);
      }

      // War drum subtle ambient pulse
      if (beat % 4 === 2 && Math.random() > 0.5) {
        this.playKendhang();
      }

      beat++;
    };

    // Trigger BGM notes on a meditative 1.25s cadence
    playRhythm();
    this.bgmInterval = setInterval(playRhythm, 1250);
  }

  stopBGM() {
    this.isBgmPlaying = false;
    if (this.bgmInterval) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
  }
}

export const gamelanSynth = new GamelanSoundEngine();
export default gamelanSynth;
