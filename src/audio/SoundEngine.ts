/**
 * Pure Web Audio API Sound and Music Synthesizer
 * 100% Offline, Zero external audio file dependencies, 0 latency.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private isMusicPlaying = false;
  private musicTimer: number | null = null;
  private musicStep = 0;

  public musicEnabled = true;
  public soundEnabled = true;
  public voiceEnabled = true;
  public vibrationEnabled = true;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.musicGain = this.ctx.createGain();
        this.sfxGain = this.ctx.createGain();

        this.musicGain.gain.value = this.musicEnabled ? 0.25 : 0;
        this.sfxGain.gain.value = this.soundEnabled ? 0.6 : 0;

        this.musicGain.connect(this.ctx.destination);
        this.sfxGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMusicEnabled(enabled: boolean) {
    this.musicEnabled = enabled;
    if (this.musicGain && this.ctx) {
      this.musicGain.gain.setValueAtTime(enabled ? 0.25 : 0, this.ctx.currentTime);
    }
    if (enabled && !this.isMusicPlaying) {
      this.startMusic();
    } else if (!enabled && this.isMusicPlaying) {
      this.stopMusic();
    }
  }

  public setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
    if (this.sfxGain && this.ctx) {
      this.sfxGain.gain.setValueAtTime(enabled ? 0.6 : 0, this.ctx.currentTime);
    }
  }

  public triggerVibrate(pattern: number | number[] = 25) {
    if (this.vibrationEnabled && typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate(pattern);
      } catch {
        // ignore
      }
    }
  }

  // Play a synthesized marimba/wood tone
  private playTone(freq: number, type: OscillatorType, duration: number, gainVal: number, detune = 0) {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx || !this.sfxGain) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);
      if (detune) osc.detune.setValueAtTime(detune, now);

      gain.gain.setValueAtTime(gainVal, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + duration);
    } catch {
      // Audio error catch
    }
  }

  public playButtonClick() {
    this.triggerVibrate(15);
    // Wooden pop: quick downward pitch sine + noise thud
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx || !this.sfxGain) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.08);

      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(now);
      osc.stop(now + 0.08);
    } catch {
      // ignore
    }
  }

  public playPiecePickup() {
    this.triggerVibrate(15);
    // Gentle cheerful swoosh/pop
    this.playTone(440, 'sine', 0.12, 0.25);
    setTimeout(() => this.playTone(660, 'sine', 0.12, 0.2), 30);
  }

  public playPieceSnap() {
    this.triggerVibrate([20, 30, 20]);
    // Satisfying wooden snap: wooden click + bright marimba chime
    this.playTone(320, 'triangle', 0.06, 0.45);
    setTimeout(() => {
      this.playTone(784, 'sine', 0.25, 0.35); // G5
      this.playTone(1046.5, 'sine', 0.3, 0.25); // C6
    }, 25);
  }

  public playWrongPlacement() {
    this.triggerVibrate(40);
    // Gentle bouncy cartoon boing
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx || !this.sfxGain) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.linearRampToValueAtTime(190, now + 0.15);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(now);
      osc.stop(now + 0.15);
    } catch {
      // ignore
    }
  }

  public playStarEarned(index = 0) {
    this.triggerVibrate(30);
    const pitches = [523.25, 659.25, 783.99]; // C5, E5, G5
    const pitch = pitches[index % pitches.length];
    this.playTone(pitch, 'sine', 0.35, 0.35);
    this.playTone(pitch * 2, 'sine', 0.3, 0.15);
  }

  public playCoinEarned() {
    this.triggerVibrate(20);
    // Classic two-tone metallic coin ring
    this.playTone(987.77, 'sine', 0.15, 0.3); // B5
    setTimeout(() => {
      this.playTone(1318.51, 'sine', 0.35, 0.35); // E6
    }, 60);
  }

  public playHintUsed() {
    this.triggerVibrate(25);
    const notes = [587.33, 739.99, 880, 1174.66];
    notes.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 'sine', 0.25, 0.2), i * 50);
    });
  }

  public playVictoryFanfare() {
    this.triggerVibrate([40, 40, 60, 40, 100]);
    // Cheerful, triumphant fanfare arpeggio: C5 -> E5 -> G5 -> C6
    const chord = [523.25, 659.25, 783.99, 1046.5];
    chord.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 'triangle', 0.4, 0.35);
        this.playTone(freq * 1.5, 'sine', 0.3, 0.15);
      }, idx * 110);
    });

    // High sparkling bells on top
    setTimeout(() => {
      [1046.5, 1318.5, 1567.98, 2093.0].forEach((freq, i) => {
        setTimeout(() => this.playTone(freq, 'sine', 0.3, 0.2), i * 70);
      });
    }, 500);
  }

  public playDailyReward() {
    this.triggerVibrate([50, 50, 120]);
    const notes = [440, 554.37, 659.25, 880, 1108.73];
    notes.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 'triangle', 0.45, 0.3), i * 90);
    });
  }

  // Cheerful, looping background children's music
  public startMusic() {
    if (!this.musicEnabled || this.isMusicPlaying) return;
    this.initCtx();
    this.isMusicPlaying = true;
    this.musicStep = 0;

    // Pentatonic happy melody notes (C major pentatonic: C, D, E, G, A)
    const melody = [
      523.25, 0, 659.25, 783.99, 659.25, 587.33, 523.25, 0,
      659.25, 783.99, 880.0, 783.99, 659.25, 587.33, 523.25, 0,
      783.99, 880.0, 1046.5, 880.0, 783.99, 659.25, 587.33, 0,
      523.25, 659.25, 587.33, 523.25, 0, 783.99, 523.25, 0
    ];

    const bass = [
      261.63, 261.63, 329.63, 329.63, 392.0, 392.0, 261.63, 261.63,
      329.63, 329.63, 349.23, 349.23, 392.0, 392.0, 261.63, 261.63,
      349.23, 349.23, 392.0, 392.0, 329.63, 329.63, 261.63, 261.63,
      261.63, 329.63, 392.0, 392.0, 261.63, 261.63, 261.63, 261.63
    ];

    const beatInterval = 280; // ms per eighth-note

    const tick = () => {
      if (!this.isMusicPlaying || !this.musicEnabled) return;
      if (!this.ctx || !this.musicGain) return;

      const idx = this.musicStep % melody.length;
      const noteFreq = melody[idx];
      const bassFreq = bass[idx];

      const now = this.ctx.currentTime;

      // Play soft marimba melody note
      if (noteFreq > 0) {
        try {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(noteFreq, now);

          gain.gain.setValueAtTime(0.18, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);

          osc.connect(gain);
          gain.connect(this.musicGain);

          osc.start(now);
          osc.stop(now + 0.25);
        } catch {
          // ignore
        }
      }

      // Play soft bass every 2 beats
      if (idx % 2 === 0 && bassFreq > 0) {
        try {
          const bassOsc = this.ctx.createOscillator();
          const bassG = this.ctx.createGain();
          bassOsc.type = 'sine';
          bassOsc.frequency.setValueAtTime(bassFreq * 0.5, now);

          bassG.gain.setValueAtTime(0.2, now);
          bassG.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

          bassOsc.connect(bassG);
          bassG.connect(this.musicGain);

          bassOsc.start(now);
          bassOsc.stop(now + 0.36);
        } catch {
          // ignore
        }
      }

      this.musicStep++;
      this.musicTimer = window.setTimeout(tick, beatInterval);
    };

    tick();
  }

  public setVoiceEnabled(enabled: boolean) {
    this.voiceEnabled = enabled;
    if (!enabled && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // ignore
      }
    }
  }

  public speakVoice(text: string) {
    if (!this.voiceEnabled) return;
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    try {
      window.speechSynthesis.cancel(); // Stop any pending speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95; // Clear, slightly slower for young kids
      utterance.pitch = 1.25; // Warm, friendly, higher pitch
      utterance.volume = 0.9;
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    } catch {
      // Graceful fallback: do not crash if TTS fails or is unavailable
    }
  }

  public speakCongratulations(childName: string) {
    this.speakVoice(`Congratulations, ${childName}! Great job!`);
  }

  public stopVoice() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // ignore
      }
    }
  }

  public stopMusic() {
    this.isMusicPlaying = false;
    if (this.musicTimer !== null) {
      clearTimeout(this.musicTimer);
      this.musicTimer = null;
    }
  }
}

export const sounds = new SoundEngine();
