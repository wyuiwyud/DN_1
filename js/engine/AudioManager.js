/**
 * AudioManager.js
 * Procedural Web Audio API Sound Generator & Synthesizer
 * No external MP3/WAV assets required - Instant loading and zero dependency!
 */
class AudioManager {
    constructor() {
        this.ctx = null;
        this.soundEnabled = true;
        this.musicEnabled = true;
        this.bgmOscillator = null;
        this.bgmGain = null;
        this.isMusicPlaying = false;
        this.volume = 0.3;
    }

    init() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                this.ctx = new AudioContext();
            }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    playSound(type) {
        if (!this.soundEnabled) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);

        switch (type) {
            case 'shoot':
            case 'laser':
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(880, now);
                osc.frequency.exponentialRampToValueAtTime(110, now + 0.15);
                gain.gain.setValueAtTime(this.volume * 0.5, now);
                gain.gain.linearRampToValueAtTime(0.01, now + 0.15);
                osc.start(now);
                osc.stop(now + 0.15);
                break;

            case 'pickup':
            case 'coin':
                osc.type = 'sine';
                osc.frequency.setValueAtTime(523.25, now); // C5
                osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
                osc.frequency.setValueAtTime(783.99, now + 0.16); // G5
                gain.gain.setValueAtTime(this.volume * 0.4, now);
                gain.gain.linearRampToValueAtTime(0.01, now + 0.25);
                osc.start(now);
                osc.stop(now + 0.25);
                break;

            case 'jump':
                osc.type = 'square';
                osc.frequency.setValueAtTime(150, now);
                osc.frequency.exponentialRampToValueAtTime(400, now + 0.12);
                gain.gain.setValueAtTime(this.volume * 0.4, now);
                gain.gain.linearRampToValueAtTime(0.01, now + 0.12);
                osc.start(now);
                osc.stop(now + 0.12);
                break;

            case 'hit':
            case 'explosion':
                // Noise buffer simulation
                const bufferSize = this.ctx.sampleRate * 0.2;
                const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
                const data = buffer.getChannelData(0);
                for (let i = 0; i < bufferSize; i++) {
                    data[i] = Math.random() * 2 - 1;
                }
                const noise = this.ctx.createBufferSource();
                noise.buffer = buffer;
                
                const filter = this.ctx.createBiquadFilter();
                filter.type = 'lowpass';
                filter.frequency.setValueAtTime(800, now);
                filter.frequency.linearRampToValueAtTime(50, now + 0.2);

                const noiseGain = this.ctx.createGain();
                noiseGain.gain.setValueAtTime(this.volume * 0.7, now);
                noiseGain.gain.linearRampToValueAtTime(0.01, now + 0.2);

                noise.connect(filter);
                filter.connect(noiseGain);
                noiseGain.connect(this.ctx.destination);

                noise.start(now);
                noise.stop(now + 0.2);
                return;

            case 'click':
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(400, now);
                gain.gain.setValueAtTime(this.volume * 0.3, now);
                gain.gain.linearRampToValueAtTime(0.01, now + 0.05);
                osc.start(now);
                osc.stop(now + 0.05);
                break;

            case 'gameover':
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(300, now);
                osc.frequency.linearRampToValueAtTime(100, now + 0.4);
                gain.gain.setValueAtTime(this.volume * 0.6, now);
                gain.gain.linearRampToValueAtTime(0.01, now + 0.4);
                osc.start(now);
                osc.stop(now + 0.4);
                break;
        }
    }

    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        return this.soundEnabled;
    }

    toggleMusic() {
        this.musicEnabled = !this.musicEnabled;
        if (!this.musicEnabled) {
            this.stopBGM();
        }
        return this.musicEnabled;
    }

    stopBGM() {
        this.isMusicPlaying = false;
    }
}

window.audioManager = new AudioManager();
