/**
 * Audio Service for Real-time Cashier Alerts
 * Uses standard Web Audio API synthesis so no external audio files are required.
 */

class AudioService {
  constructor() {
    this.audioContext = null;
    this.soundEnabled = localStorage.getItem('warung-sound-enabled') !== 'false';
  }

  getAudioContext() {
    if (!this.audioContext) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.audioContext = new AudioCtx();
      }
    }
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
    return this.audioContext;
  }

  isSoundEnabled() {
    return this.soundEnabled;
  }

  setSoundEnabled(enabled) {
    this.soundEnabled = enabled;
    localStorage.setItem('warung-sound-enabled', enabled ? 'true' : 'false');
  }

  toggleSound() {
    this.setSoundEnabled(!this.soundEnabled);
    if (this.soundEnabled) {
      this.playOrderChime();
    }
    return this.soundEnabled;
  }

  playOrderChime() {
    if (!this.soundEnabled) return;

    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;

      // Two-tone pleasant restaurant chime (G5 -> C6)
      const playTone = (freq, startTime, duration) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.001, startTime);
        gain.gain.exponentialRampToValueAtTime(0.28, startTime + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + duration);
      };

      playTone(783.99, now, 0.35);         // G5
      playTone(1046.50, now + 0.16, 0.55); // C6
    } catch (e) {
      console.warn('Audio playback error:', e);
    }
  }
}

export const audioService = new AudioService();
