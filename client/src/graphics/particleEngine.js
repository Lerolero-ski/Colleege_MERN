/**
 * Neural Particle Constellation Engine
 * High-performance HTML5 Canvas particle simulation with spatial connections and interactive physics.
 */

const COLOR_SCHEMES = {
  'cyber-violet': {
    primary: '#8b5cf6',
    secondary: '#06b6d4',
    particle: 'rgba(167, 139, 250, 0.9)',
    line: (alpha) => `rgba(139, 92, 246, ${alpha})`,
    glow: 'rgba(139, 92, 246, 0.6)'
  },
  'matrix-green': {
    primary: '#10b981',
    secondary: '#34d399',
    particle: 'rgba(52, 211, 153, 0.95)',
    line: (alpha) => `rgba(16, 185, 129, ${alpha})`,
    glow: 'rgba(52, 211, 153, 0.6)'
  },
  'electric-blue': {
    primary: '#0ea5e9',
    secondary: '#38bdf8',
    particle: 'rgba(56, 189, 248, 0.9)',
    line: (alpha) => `rgba(14, 165, 233, ${alpha})`,
    glow: 'rgba(56, 189, 248, 0.6)'
  },
  'sunset-amber': {
    primary: '#f59e0b',
    secondary: '#ef4444',
    particle: 'rgba(251, 191, 36, 0.9)',
    line: (alpha) => `rgba(245, 158, 11, ${alpha})`,
    glow: 'rgba(245, 158, 11, 0.6)'
  },
  'neon-pink': {
    primary: '#ec4899',
    secondary: '#f43f5e',
    particle: 'rgba(244, 114, 182, 0.9)',
    line: (alpha) => `rgba(236, 72, 153, ${alpha})`,
    glow: 'rgba(236, 72, 153, 0.6)'
  },
  'rainbow': {
    primary: '#8b5cf6',
    secondary: '#ec4899',
    particle: 'rainbow',
    line: (alpha) => `rgba(200, 200, 255, ${alpha * 0.7})`,
    glow: 'rgba(255, 255, 255, 0.5)'
  }
};

export class ParticleEngine {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.speed = options.speed || 1.0;
    this.count = options.count || 85;
    this.colorSchemeName = options.colorScheme || 'cyber-violet';
    this.isInteractive = options.interactive !== false;

    this.particles = [];
    this.isRunning = false;
    this.animationFrameId = null;
    this.lastTime = performance.now();
    this.fps = 60;
    this.fpsTimer = performance.now();
    this.framesThisSecond = 0;

    this.mouse = {
      x: null,
      y: null,
      radius: 130
    };

    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.handleResize = this.handleResize.bind(this);

    this.initListeners();
    this.reset();
  }

  initListeners() {
    this.canvas.addEventListener('mousemove', this.handleMouseMove);
    this.canvas.addEventListener('mouseleave', this.handleMouseLeave);
    window.addEventListener('resize', this.handleResize);
  }

  handleMouseMove(e) {
    if (!this.isInteractive) return;
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;
    this.mouse.x = (e.clientX - rect.left) * scaleX;
    this.mouse.y = (e.clientY - rect.top) * scaleY;
  }

  handleMouseLeave() {
    this.mouse.x = null;
    this.mouse.y = null;
  }

  handleResize() {
    // If the canvas resolution matches client display, maintain boundaries
    if (this.canvas.parentElement) {
      const rect = this.canvas.parentElement.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.canvas.width = rect.width * dpr;
      this.canvas.height = rect.height * dpr;
    }
  }

  reset() {
    const width = this.canvas.width || 800;
    const height = this.canvas.height || 500;
    this.particles = [];

    const scheme = COLOR_SCHEMES[this.colorSchemeName] || COLOR_SCHEMES['cyber-violet'];

    for (let i = 0; i < this.count; i++) {
      const radius = Math.random() * 2.2 + 1.2;
      const hue = Math.random() * 360;
      this.particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        radius,
        baseRadius: radius,
        color: scheme.particle === 'rainbow' ? `hsl(${hue}, 85%, 65%)` : scheme.particle,
        alpha: Math.random() * 0.5 + 0.5
      });
    }
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTime = performance.now();
    this.animate();
  }

  pause() {
    this.isRunning = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  setSpeed(speed) {
    this.speed = Math.max(0.1, Math.min(5, speed));
  }

  setCount(count) {
    this.count = Math.max(10, Math.min(300, count));
    this.reset();
  }

  setColorScheme(schemeName) {
    if (COLOR_SCHEMES[schemeName]) {
      this.colorSchemeName = schemeName;
      this.reset();
    }
  }

  animate() {
    if (!this.isRunning) return;

    const now = performance.now();
    this.framesThisSecond++;
    if (now > this.fpsTimer + 1000) {
      this.fps = Math.round((this.framesThisSecond * 1000) / (now - this.fpsTimer));
      this.fpsTimer = now;
      this.framesThisSecond = 0;
    }

    const dt = Math.min((now - this.lastTime) / 1000, 0.1);
    this.lastTime = now;

    this.update(dt);
    this.render();

    this.animationFrameId = requestAnimationFrame(() => this.animate());
  }

  update(dt) {
    const width = this.canvas.width;
    const height = this.canvas.height;
    const speedMult = this.speed * 60 * dt;
    const maxDist = 120;

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      // Update position
      p.x += p.vx * speedMult;
      p.y += p.vy * speedMult;

      // Bounce at boundaries
      if (p.x < p.radius) {
        p.x = p.radius;
        p.vx *= -1;
      } else if (p.x > width - p.radius) {
        p.x = width - p.radius;
        p.vx *= -1;
      }

      if (p.y < p.radius) {
        p.y = p.radius;
        p.vy *= -1;
      } else if (p.y > height - p.radius) {
        p.y = height - p.radius;
        p.vy *= -1;
      }

      // Mouse interaction (gentle attraction / repulsion bubble)
      if (this.isInteractive && this.mouse.x !== null && this.mouse.y !== null) {
        const dx = this.mouse.x - p.x;
        const dy = this.mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < this.mouse.radius && dist > 0) {
          const force = (1 - dist / this.mouse.radius) * 2.5;
          // Slight push away from cursor with elastic recoil
          p.x -= (dx / dist) * force;
          p.y -= (dy / dist) * force;
          p.radius = p.baseRadius * 1.5;
        } else {
          p.radius = p.baseRadius;
        }
      }
    }
  }

  render() {
    const ctx = this.ctx;
    const width = this.canvas.width;
    const height = this.canvas.height;
    const scheme = COLOR_SCHEMES[this.colorSchemeName] || COLOR_SCHEMES['cyber-violet'];

    // Clear canvas with subtle trail persistence
    ctx.fillStyle = '#090c14';
    ctx.fillRect(0, 0, width, height);

    // Draw connecting lines between close particles
    const maxDist = 110;
    const len = this.particles.length;

    for (let i = 0; i < len; i++) {
      const p1 = this.particles[i];
      for (let j = i + 1; j < len; j++) {
        const p2 = this.particles[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.35;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = scheme.line(alpha);
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    // Connect particles to mouse cursor if in range
    if (this.isInteractive && this.mouse.x !== null && this.mouse.y !== null) {
      for (let i = 0; i < len; i++) {
        const p = this.particles[i];
        const dx = this.mouse.x - p.x;
        const dy = this.mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < this.mouse.radius) {
          const alpha = (1 - dist / this.mouse.radius) * 0.6;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(this.mouse.x, this.mouse.y);
          ctx.strokeStyle = scheme.line(alpha);
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }
      }

      // Draw subtle cursor ring
      ctx.beginPath();
      ctx.arc(this.mouse.x, this.mouse.y, this.mouse.radius, 0, Math.PI * 2);
      ctx.strokeStyle = scheme.line(0.12);
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 6]);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Draw glowing particles
    for (let i = 0; i < len; i++) {
      const p = this.particles[i];

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.shadowColor = scheme.glow;
      ctx.shadowBlur = 8;
      ctx.fill();
    }
    ctx.shadowBlur = 0;
  }

  destroy() {
    this.pause();
    this.canvas.removeEventListener('mousemove', this.handleMouseMove);
    this.canvas.removeEventListener('mouseleave', this.handleMouseLeave);
    window.removeEventListener('resize', this.handleResize);
  }
}
