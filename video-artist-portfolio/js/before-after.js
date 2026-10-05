/**
 * Dynamic Before / After Split Slider & Color Grade Comparison Suite
 * Supports touch & mouse dragging, LUT presets, and real-time color scopes.
 */

class BeforeAfterComparator {
  constructor() {
    this.container = document.querySelector('.before-after-container');
    if (!this.container) return;

    this.afterLayer = this.container.querySelector('.ba-after-layer');
    this.sliderLine = this.container.querySelector('.ba-slider-line');
    this.beforeImg = this.container.querySelector('.ba-before-img');
    this.afterImg = this.container.querySelector('.ba-after-img');
    this.presetButtons = document.querySelectorAll('.lut-preset-btn');
    this.modeButtons = document.querySelectorAll('.ba-mode-tab');
    
    this.isDragging = false;
    this.currentPosition = 50; // percentage

    // Image datasets for different presets & modes
    this.modes = {
      colorGrade: {
        title: 'Cinematic Color Grading (DaVinci Resolve)',
        presets: {
          tealOrange: {
            before: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1600&q=80',
            after: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
            beforeLabel: 'S-Log3 / Flat RAW',
            afterLabel: 'Teal & Orange Rec.709',
            description: 'ACES Color-Managed transform with custom print film emulation LUT.'
          },
          cyberpunk: {
            before: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1600&q=80',
            after: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1600&q=80',
            beforeLabel: 'Arri Log-C Raw',
            afterLabel: 'Neo-Tokyo Neon Master',
            description: 'Selective saturation boost on magenta/cyan channels with anamorphic halation.'
          },
          noirGold: {
            before: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1600&q=80',
            after: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=1600&q=80',
            beforeLabel: 'RED Raw IPP2',
            afterLabel: 'Golden Hour Moody Noir',
            description: 'Warm highlight rolloff, crushed micro-contrast and 35mm grain profile.'
          }
        }
      },
      photoManip: {
        title: 'High-End Visual Art & VFX Photo Manipulation',
        presets: {
          cyberArt: {
            before: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1600&q=80',
            after: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1600&q=80',
            beforeLabel: 'Studio Raw Shot',
            afterLabel: 'Cybernetic Visual Composite',
            description: 'Multi-layer matte painting, holographic HUD compositing and frequency separation retouch.'
          },
          fantasyWorld: {
            before: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80',
            after: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
            beforeLabel: 'Raw Landscape',
            afterLabel: 'Surreal Sci-Fi Matte',
            description: 'Atmospheric depth layering, celestial ring rendering and dynamic lighting pass.'
          }
        }
      }
    };

    this.activeMode = 'colorGrade';
    this.activePreset = 'tealOrange';

    this.init();
  }

  init() {
    this.bindEvents();
    this.updatePosition(50);
    this.initScopes();
  }

  bindEvents() {
    // Slider Dragging Events
    const onStart = (e) => {
      this.isDragging = true;
      this.handleDrag(e);
    };

    const onMove = (e) => {
      if (!this.isDragging) return;
      this.handleDrag(e);
    };

    const onEnd = () => {
      this.isDragging = false;
    };

    this.container.addEventListener('mousedown', onStart);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onEnd);

    this.container.addEventListener('touchstart', onStart, { passive: true });
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('touchend', onEnd);

    // Preset Selection Buttons
    this.presetButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const presetKey = btn.dataset.preset;
        this.presetButtons.forEach(b => b.classList.remove('active', 'border-neon-cyan', 'text-neon-cyan', 'bg-cyan-500/10'));
        btn.classList.add('active', 'border-neon-cyan', 'text-neon-cyan', 'bg-cyan-500/10');
        this.setPreset(presetKey);
        if (window.soundFX) window.soundFX.playClick();
      });
    });

    // Mode Toggle Tabs (Color Grading vs Photo Manipulation)
    this.modeButtons.forEach(tab => {
      tab.addEventListener('click', () => {
        const mode = tab.dataset.mode;
        this.modeButtons.forEach(t => t.classList.remove('active', 'border-neon-cyan', 'text-neon-cyan', 'bg-cyan-500/10'));
        tab.classList.add('active', 'border-neon-cyan', 'text-neon-cyan', 'bg-cyan-500/10');
        this.setMode(mode);
        if (window.soundFX) window.soundFX.playModeSwitch();
      });
    });
  }

  handleDrag(e) {
    const rect = this.container.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const offsetX = clientX - rect.left;
    let percentage = (offsetX / rect.width) * 100;

    if (percentage < 2) percentage = 2;
    if (percentage > 98) percentage = 98;

    this.updatePosition(percentage);
  }

  updatePosition(percentage) {
    this.currentPosition = percentage;
    if (this.afterLayer) {
      this.afterLayer.style.clipPath = `inset(0 0 0 ${percentage}%)`;
    }
    if (this.sliderLine) {
      this.sliderLine.style.left = `${percentage}%`;
    }
  }

  setPreset(presetKey) {
    this.activePreset = presetKey;
    const modeData = this.modes[this.activeMode];
    if (!modeData || !modeData.presets[presetKey]) return;

    const data = modeData.presets[presetKey];

    // Smooth transition
    this.container.classList.add('opacity-80');
    setTimeout(() => {
      if (this.beforeImg) this.beforeImg.src = data.before;
      if (this.afterImg) this.afterImg.src = data.after;
      
      const beforeLabel = this.container.querySelector('.ba-badge-before');
      const afterLabel = this.container.querySelector('.ba-badge-after');
      const descEl = document.getElementById('lut-description-text');

      if (beforeLabel) beforeLabel.textContent = data.beforeLabel;
      if (afterLabel) afterLabel.textContent = data.afterLabel;
      if (descEl) descEl.textContent = data.description;

      this.container.classList.remove('opacity-80');
      this.renderScopes();
    }, 150);
  }

  setMode(modeKey) {
    this.activeMode = modeKey;
    const presetsContainer = document.getElementById('ba-preset-buttons-container');
    if (!presetsContainer) return;

    presetsContainer.innerHTML = '';
    const modeData = this.modes[modeKey];
    const presetKeys = Object.keys(modeData.presets);

    presetKeys.forEach((key, index) => {
      const p = modeData.presets[key];
      const btn = document.createElement('button');
      btn.className = `lut-preset-btn px-4 py-2 rounded-lg text-xs font-mono font-bold tracking-wider uppercase border transition-all ${
        index === 0 ? 'active border-neon-cyan text-neon-cyan bg-cyan-500/10 shadow-[0_0_15px_rgba(0,245,212,0.2)]' : 'border-slate-800 text-slate-400 hover:border-slate-600 hover:text-white'
      }`;
      btn.dataset.preset = key;
      btn.innerHTML = `<i class="fa-solid fa-wand-magic-sparkles mr-1.5 opacity-70"></i> ${p.afterLabel.split(' ')[0]}`;
      
      btn.addEventListener('click', () => {
        document.querySelectorAll('.lut-preset-btn').forEach(b => b.classList.remove('active', 'border-neon-cyan', 'text-neon-cyan', 'bg-cyan-500/10'));
        btn.classList.add('active', 'border-neon-cyan', 'text-neon-cyan', 'bg-cyan-500/10');
        this.setPreset(key);
        if (window.soundFX) window.soundFX.playClick();
      });

      presetsContainer.appendChild(btn);
    });

    this.setPreset(presetKeys[0]);
  }

  initScopes() {
    this.renderScopes();
  }

  renderScopes() {
    const scopeWave = document.getElementById('scope-waveform-canvas');
    const scopeParade = document.getElementById('scope-parade-canvas');
    const scopeVectorscope = document.getElementById('scope-vectorscope-canvas');

    if (scopeWave) this.drawWaveform(scopeWave);
    if (scopeParade) this.drawParade(scopeParade);
    if (scopeVectorscope) this.drawVectorscope(scopeVectorscope);
  }

  drawWaveform(canvas) {
    const ctx = canvas.getContext('2d');
    const w = canvas.width = canvas.offsetWidth;
    const h = canvas.height = canvas.offsetHeight;

    ctx.fillStyle = '#05080e';
    ctx.fillRect(0, 0, w, h);

    // Grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    [0.2, 0.5, 0.8].forEach(pct => {
      ctx.beginPath();
      ctx.moveTo(0, h * pct);
      ctx.lineTo(w, h * pct);
      ctx.stroke();
    });

    // Waveform simulation
    ctx.strokeStyle = 'rgba(0, 245, 212, 0.7)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    for (let x = 0; x < w; x += 2) {
      const y = h * 0.5 + Math.sin(x * 0.08) * (h * 0.25) + (Math.random() - 0.5) * (h * 0.35);
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  drawParade(canvas) {
    const ctx = canvas.getContext('2d');
    const w = canvas.width = canvas.offsetWidth;
    const h = canvas.height = canvas.offsetHeight;

    ctx.fillStyle = '#05080e';
    ctx.fillRect(0, 0, w, h);

    const sectionW = w / 3;
    const channels = ['#ff3366', '#06d6a0', '#00b4d8'];

    channels.forEach((color, i) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      for (let x = i * sectionW; x < (i + 1) * sectionW; x += 2) {
        const y = h * 0.5 + Math.sin(x * 0.1) * (h * 0.22) + (Math.random() - 0.5) * (h * 0.28);
        if (x === i * sectionW) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    });
  }

  drawVectorscope(canvas) {
    const ctx = canvas.getContext('2d');
    const w = canvas.width = canvas.offsetWidth;
    const h = canvas.height = canvas.offsetHeight;

    ctx.fillStyle = '#05080e';
    ctx.fillRect(0, 0, w, h);

    const cx = w / 2;
    const cy = h / 2;
    const r = Math.min(cx, cy) * 0.8;

    // Outer circle & target cross
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.moveTo(cx - r, cy);
    ctx.lineTo(cx + r, cy);
    ctx.moveTo(cx, cy - r);
    ctx.lineTo(cx, cy + r);
    ctx.stroke();

    // Hue targets
    ctx.fillStyle = 'rgba(0, 245, 212, 0.8)';
    for (let i = 0; i < 40; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * r * 0.85;
      const px = cx + Math.cos(angle) * dist;
      const py = cy + Math.sin(angle) * dist;
      ctx.fillRect(px, py, 1.5, 1.5);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.beforeAfterSuite = new BeforeAfterComparator();
});
