/**
 * Skills & NLE Software Tech Stack Suite
 * Real-time animated VU audio/video meters, broadcast specs, and keyframe curve graph.
 */

class SkillsMatrixSuite {
  constructor() {
    this.vuMeterContainer = document.querySelectorAll('.vu-meter-bar');
    this.keyframeCanvas = document.getElementById('keyframe-bezier-canvas');
    this.init();
  }

  init() {
    this.animateVUMeters();
    if (this.keyframeCanvas) {
      this.drawKeyframeCurve();
      window.addEventListener('resize', () => this.drawKeyframeCurve());
    }
  }

  animateVUMeters() {
    // Dynamic randomized bounce for VU meter audio levels
    setInterval(() => {
      this.vuMeterContainer.forEach(bar => {
        const targetPercent = Math.floor(Math.random() * 65) + 30; // 30% to 95%
        bar.style.width = `${targetPercent}%`;
      });
    }, 450);
  }

  drawKeyframeCurve() {
    const canvas = this.keyframeCanvas;
    const ctx = canvas.getContext('2d');
    const w = canvas.width = canvas.offsetWidth;
    const h = canvas.height = canvas.offsetHeight;

    ctx.clearRect(0, 0, w, h);

    // Dark grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 30) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += 25) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Bezier ease-in-out curve
    const p0 = { x: 30, y: h - 30 };
    const p1 = { x: w * 0.45, y: h - 30 };
    const p2 = { x: w * 0.55, y: 30 };
    const p3 = { x: w - 30, y: 30 };

    // Draw control handles
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(p0.x, p0.y);
    ctx.lineTo(p1.x, p1.y);
    ctx.moveTo(p3.x, p3.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
    ctx.setLineDash([]);

    // Curve line
    ctx.strokeStyle = '#00f5d4';
    ctx.lineWidth = 3;
    ctx.shadowColor = 'rgba(0, 245, 212, 0.8)';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.moveTo(p0.x, p0.y);
    ctx.bezierCurveTo(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Draw keyframe node diamond points
    const drawDiamond = (p, color) => {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y - 6);
      ctx.lineTo(p.x + 6, p.y);
      ctx.lineTo(p.x, p.y + 6);
      ctx.lineTo(p.x - 6, p.y);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    };

    drawDiamond(p0, '#ff3366');
    drawDiamond(p3, '#00f5d4');
    
    // Draw handle points
    ctx.fillStyle = '#ffbe0b';
    ctx.beginPath();
    ctx.arc(p1.x, p1.y, 4, 0, Math.PI * 2);
    ctx.arc(p2.x, p2.y, 4, 0, Math.PI * 2);
    ctx.fill();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new SkillsMatrixSuite();
});
