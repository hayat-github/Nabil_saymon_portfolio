/**
 * Main Controller & Audio Synthesizer (Web Audio API)
 * Dynamic Typewriter, SMPTE HUD Timecode Ticker, Sound FX, and Mobile Navigation.
 */

// Web Audio API Sound Synthesizer (Zero External Files!)
class SoundSynthesizer {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.initContext();
  }

  initContext() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    } catch (e) {
      this.enabled = false;
    }
  }

  ensureState() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playClick() {
    if (!this.enabled || !this.ctx) return;
    this.ensureState();

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.04);

    gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.04);
  }

  playModeSwitch() {
    if (!this.enabled || !this.ctx) return;
    this.ensureState();

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(440, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.08);
  }

  playModalOpen() {
    if (!this.enabled || !this.ctx) return;
    this.ensureState();

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600, this.ctx.currentTime + 0.15);

    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.15);
  }

  playTransmit() {
    if (!this.enabled || !this.ctx) return;
    this.ensureState();

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.linearRampToValueAtTime(1200, now + 0.25);

    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.25);
  }

  playSuccess() {
    if (!this.enabled || !this.ctx) return;
    this.ensureState();

    const notes = [523.25, 659.25, 783.99, 1046.50]; // C - E - G - C
    notes.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      const startTime = this.ctx.currentTime + (i * 0.07);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.07, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.2);
    });
  }

  playError() {
    if (!this.enabled || !this.ctx) return;
    this.ensureState();

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, this.ctx.currentTime);
    osc.frequency.setValueAtTime(120, this.ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.2);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.2);
  }

  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }
}

// Typewriter Effect
class HeroTypewriter {
  constructor() {
    this.element = document.getElementById('hero-typewriter-text');
    this.roles = [
      'Professional Video Editor',
      'Motion Designer',
      'Visual Storyteller'
    ];
    this.roleIndex = 0;
    this.charIndex = 0;
    this.isDeleting = false;
    this.typingSpeed = 90;
    this.deletingSpeed = 45;
    this.pauseDelay = 1800;

    if (this.element) {
      this.type();
    }
  }

  type() {
    const currentRole = this.roles[this.roleIndex];

    if (this.isDeleting) {
      this.element.textContent = currentRole.substring(0, this.charIndex - 1);
      this.charIndex--;
    } else {
      this.element.textContent = currentRole.substring(0, this.charIndex + 1);
      this.charIndex++;
    }

    let delay = this.isDeleting ? this.deletingSpeed : this.typingSpeed;

    if (!this.isDeleting && this.charIndex === currentRole.length) {
      delay = this.pauseDelay;
      this.isDeleting = true;
    } else if (this.isDeleting && this.charIndex === 0) {
      this.isDeleting = false;
      this.roleIndex = (this.roleIndex + 1) % this.roles.length;
      delay = 300;
    }

    setTimeout(() => this.type(), delay);
  }
}

// Master App Initialization
document.addEventListener('DOMContentLoaded', () => {
  // Initialize Web Audio Synthesizer
  window.soundFX = new SoundSynthesizer();

  // Audio Toggle Button
  const audioBtn = document.getElementById('global-audio-toggle');
  if (audioBtn) {
    audioBtn.addEventListener('click', () => {
      const active = window.soundFX.toggle();
      audioBtn.classList.toggle('active', active);
      audioBtn.innerHTML = active 
        ? '<i class="fa-solid fa-volume-high"></i> <span>AUDIO ON</span>' 
        : '<i class="fa-solid fa-volume-xmark"></i> <span>MUTED</span>';
      
      if (active) window.soundFX.playClick();
    });
  }

  // Typewriter
  new HeroTypewriter();

  // Live Header SMPTE Timecode Ticker
  const headerTimecode = document.getElementById('header-smpte-clock');
  if (headerTimecode) {
    let frame = 0;
    setInterval(() => {
      frame = (frame + 1) % 24;
      const now = new Date();
      const hrs = String(now.getHours()).padStart(2, '0');
      const mins = String(now.getMinutes()).padStart(2, '0');
      const secs = String(now.getSeconds()).padStart(2, '0');
      const frms = String(frame).padStart(2, '0');
      headerTimecode.textContent = `${hrs}:${mins}:${secs}:${frms}`;
    }, 1000 / 24); // 24fps tick
  }

  // Mobile Navigation Drawer Toggle
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileNav = document.getElementById('mobile-nav-drawer');

  if (menuBtn && mobileNav) {
    menuBtn.addEventListener('click', () => {
      mobileNav.classList.toggle('hidden');
      if (window.soundFX) window.soundFX.playClick();
    });

    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.add('hidden');
      });
    });
  }

  // Active Link Scroll Spy
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-spy-link');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 160;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  // Global Sound FX for interactive buttons
  document.querySelectorAll('button, .btn-cinema, .btn-ghost-cinema, .interactive-click').forEach(el => {
    el.addEventListener('mouseenter', () => {
      // gentle click on hover
    });
    el.addEventListener('click', () => {
      if (window.soundFX) window.soundFX.playClick();
    });
  });

  // Keyboard hotkeys (M for audio toggle, Esc for modal)
  window.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    if (e.key === 'm' || e.key === 'M') {
      if (audioBtn) audioBtn.click();
    }
  });
});
