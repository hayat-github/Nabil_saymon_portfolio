/**
 * Cinematic Stellar Nebula Background — Deep Space Edition
 * Soothing, breathtaking aurora-nebula atmosphere with:
 * - Layered animated radial nebula clouds
 * - Flowing aurora ribbons
 * - Twinkling star field
 * - Cursor-reactive energy ripple
 * - Slow pulsing color breathing
 */

class CinematicNebulaBackground {
  constructor() {
    this.canvas = document.getElementById('render-wave-canvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');

    this.width = 0;
    this.height = 0;
    this.time = 0;
    this.mouse = { x: -9999, y: -9999, targetX: -9999, targetY: -9999 };

    // Star field
    this.stars = [];

    // Aurora ribbons (horizontal flowing bands)
    this.ribbons = [
      { yFrac: 0.35, amplitude: 60, freq: 0.004, speed: 0.0007, colorA: 'rgba(0,245,212,0.04)', colorB: 'rgba(0,245,212,0)' },
      { yFrac: 0.50, amplitude: 80, freq: 0.003, speed: 0.0005, colorA: 'rgba(114,9,183,0.05)', colorB: 'rgba(114,9,183,0)' },
      { yFrac: 0.65, amplitude: 70, freq: 0.005, speed: 0.0009, colorA: 'rgba(0,180,216,0.04)', colorB: 'rgba(0,180,216,0)' },
      { yFrac: 0.20, amplitude: 50, freq: 0.006, speed: 0.0006, colorA: 'rgba(247,37,133,0.03)', colorB: 'rgba(247,37,133,0)' },
    ];

    // Drifting nebula orbs
    this.nebulae = [
      { xFrac:0.15, yFrac:0.18, r:0.28, hue:175, sat:100, speed:{ x: 0.00012, y: 0.00008 }, phase:0 },
      { xFrac:0.78, yFrac:0.30, r:0.32, hue:285, sat:100, speed:{ x:-0.00010, y: 0.00010 }, phase:1.8 },
      { xFrac:0.50, yFrac:0.75, r:0.30, hue:200, sat:90,  speed:{ x: 0.00008, y:-0.00009 }, phase:3.5 },
      { xFrac:0.88, yFrac:0.70, r:0.22, hue:320, sat:100, speed:{ x:-0.00009, y:-0.00008 }, phase:0.9 },
      { xFrac:0.20, yFrac:0.65, r:0.25, hue:260, sat:90,  speed:{ x: 0.00011, y: 0.00007 }, phase:2.4 },
    ];

    this.init();
  }

  init() {
    this.resize();
    this.buildStars();
    this.bindEvents();
    this.animate();
  }

  resize() {
    const dpr = window.devicePixelRatio || 1;
    this.width  = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width  = this.width  * dpr;
    this.canvas.height = this.height * dpr;
    this.canvas.style.width  = this.width  + 'px';
    this.canvas.style.height = this.height + 'px';
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.scale(dpr, dpr);
  }

  buildStars() {
    this.stars = [];
    const count = Math.floor((this.width * this.height) / 6000);
    for (let i = 0; i < count; i++) {
      this.stars.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        r: Math.random() * 1.4 + 0.3,
        alpha: Math.random() * 0.6 + 0.2,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinkleOffset: Math.random() * Math.PI * 2,
        color: Math.random() < 0.7 ? '#ffffff' : (Math.random() < 0.5 ? '#00f5d4' : '#a78bfa')
      });
    }
  }

  bindEvents() {
    window.addEventListener('resize', () => { this.resize(); this.buildStars(); });
    window.addEventListener('mousemove', (e) => {
      this.mouse.targetX = e.clientX;
      this.mouse.targetY = e.clientY;
    });
    window.addEventListener('mouseleave', () => {
      this.mouse.targetX = -9999;
      this.mouse.targetY = -9999;
    });
  }

  drawNebulaOrbs() {
    const ctx = this.ctx;
    const t = this.time;

    this.nebulae.forEach(n => {
      // Drift slowly
      n.xFrac += n.speed.x;
      n.yFrac += n.speed.y;
      if (n.xFrac < 0.05) n.speed.x *= -1;
      if (n.xFrac > 0.95) n.speed.x *= -1;
      if (n.yFrac < 0.05) n.speed.y *= -1;
      if (n.yFrac > 0.95) n.speed.y *= -1;

      const cx = n.xFrac * this.width;
      const cy = n.yFrac * this.height;
      const rad = n.r * Math.min(this.width, this.height);
      // Gentle breathing pulse
      const pulse = 1 + 0.08 * Math.sin(t * 0.018 + n.phase);
      const finalRad = rad * pulse;
      // Base opacity slightly responsive to mouse proximity
      const distToMouse = Math.hypot(cx - this.mouse.x, cy - this.mouse.y);
      const mouseBoost = Math.max(0, 1 - distToMouse / 600) * 0.025;

      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, finalRad);
      const alpha1 = (0.09 + mouseBoost).toFixed(3);
      const alpha2 = (0.04 + mouseBoost * 0.5).toFixed(3);
      g.addColorStop(0,   `hsla(${n.hue}, ${n.sat}%, 60%, ${alpha1})`);
      g.addColorStop(0.5, `hsla(${n.hue}, ${n.sat}%, 50%, ${alpha2})`);
      g.addColorStop(1,   `hsla(${n.hue}, ${n.sat}%, 40%, 0)`);

      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(cx, cy, finalRad, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  drawAuroraRibbons() {
    const ctx = this.ctx;
    const W = this.width;
    const H = this.height;
    const t = this.time;

    this.ribbons.forEach(rb => {
      const centerY = rb.yFrac * H;
      const ribbonH  = rb.amplitude * 2.5;

      ctx.beginPath();
      ctx.moveTo(0, H);

      // Top edge
      for (let x = 0; x <= W; x += 8) {
        const y = centerY
          - rb.amplitude * Math.sin(x * rb.freq + t * rb.speed * 300)
          - 20 * Math.cos(x * 0.002 + t * 0.03);
        ctx.lineTo(x, y);
      }

      ctx.lineTo(W, H);
      ctx.closePath();

      const g = ctx.createLinearGradient(0, centerY - rb.amplitude, 0, centerY + ribbonH);
      g.addColorStop(0, rb.colorA);
      g.addColorStop(0.5, rb.colorA);
      g.addColorStop(1, rb.colorB);
      ctx.fillStyle = g;
      ctx.fill();
    });
  }

  drawStars() {
    const ctx = this.ctx;
    const t = this.time;

    this.stars.forEach(s => {
      const twinkle = 0.5 + 0.5 * Math.sin(t * s.twinkleSpeed * 30 + s.twinkleOffset);
      const alpha = s.alpha * twinkle;

      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = s.color;
      ctx.shadowBlur = s.r * 3;
      ctx.shadowColor = s.color;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  }

  drawCursorRipple() {
    if (this.mouse.x < 0 || this.mouse.x > this.width) return;

    const ctx = this.ctx;
    const cx  = this.mouse.x;
    const cy  = this.mouse.y;

    // Soft energy glow halo around cursor
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, 180);
    g.addColorStop(0,   'rgba(0, 245, 212, 0.045)');
    g.addColorStop(0.5, 'rgba(0, 180, 216, 0.025)');
    g.addColorStop(1,   'rgba(0, 245, 212, 0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(cx, cy, 180, 0, Math.PI * 2);
    ctx.fill();
  }

  animate() {
    this.time += 1;
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    // Lerp mouse
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.07;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.07;

    // Layer 1: Drifting nebula orb clouds
    this.drawNebulaOrbs();

    // Layer 2: Flowing aurora ribbon waves
    this.drawAuroraRibbons();

    // Layer 3: Twinkling star field
    this.drawStars();

    // Layer 4: Cursor energy halo
    this.drawCursorRipple();

    requestAnimationFrame(() => this.animate());
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new CinematicNebulaBackground();
});
