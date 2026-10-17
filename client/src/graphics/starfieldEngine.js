/**
 * Hyperdrive Warp Starfield Engine
 * 3D perspective projection simulating relativistic space travel with dynamic motion streaks and parallax steering.
 */

const STAR_SCHEMES = {
  'electric-blue': {
    near: '#38bdf8',
    mid: '#0284c7',
    far: '#1e3a8a',
    glow: 'rgba(56, 189, 248, 0.7)'
  },
  'cyber-violet': {
    near: '#e879f9',
    mid: '#a855f7',
    far: '#4c1d95',
    glow: 'rgba(168, 85, 247, 0.7)'
  },
  'matrix-green': {
    near: '#86efac',
    mid: '#22c55e',
    far: '#064e3b',
    glow: 'rgba(34, 197, 94, 0.7)'
  },
  'sunset-amber': {
    near: '#fde047',
    mid: '#f97316',
    far: '#7c2d12',
    glow: 'rgba(249, 115, 22, 0.7)'
  },
  'neon-pink': {
    near: '#f472b6',
    mid: '#db2777',
    far: '#831843',
    glow: 'rgba(219, 39, 119, 0.7)'
  },
  'rainbow': {
    near: '#ffffff',
    mid: '#60a5fa',
    far: '#3b82f6',
    glow: 'rgba(255, 255, 255, 0.8)'
  }
};

export class StarfieldEngine {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.speed = options.speed || 1.8;
    this.count = options.count || 220;
    this.colorSchemeName = options.colorScheme || 'electric-blue';
    this.isInteractive = options.interactive !== false;

    this.stars = [];
    this.maxDepth = 1000;
    this.fov = 320;
    this.isRunning = false;
    this.animationFrameId = null;
    this.lastTime = performance.now();
    this.fps = 60;
    this.fpsTimer = performance.now();
    this.framesThisSecond = 0;

    this.mouse = {
      offsetX: 0,
      offsetY: 0
    };

    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.initListeners();
    this.reset();
  }

  initListeners() {
    this.canvas.addEventListener('mousemove', this.handleMouseMove);
    this.canvas.addEventListener('mouseleave', this.handleMouseLeave);
  }

  handleMouseMove(e) {
    if (!this.isInteractive) return;
    const rect = this.canvas.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    this.mouse.offsetX = (e.clientX - rect.left - centerX) * 0.35;
    this.mouse.offsetY = (e.clientY - rect.top - centerY) * 0.35;
  }

  handleMouseLeave() {
    this.mouse.offsetX = 0;
    this.mouse.offsetY = 0;
  }

  reset() {
    const width = this.canvas.width || 800;
    const height = this.canvas.height || 500;
    this.stars = [];

    for (let i = 0; i < this.count; i++) {
      this.stars.push({
        x: (Math.random() - 0.5) * width * 2,
        y: (Math.random() - 0.5) * height * 2,
        z: Math.random() * this.maxDepth,
        pz: Math.random() * this.maxDepth,
        size: Math.random() * 1.5 + 0.8,
        hue: Math.random() * 360
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
    this.count = Math.max(30, Math.min(500, count));
    this.reset();
  }

  setColorScheme(schemeName) {
    if (STAR_SCHEMES[schemeName]) {
      this.colorSchemeName = schemeName;
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
    const zStep = this.speed * 450 * dt;

    for (let i = 0; i < this.stars.length; i++) {
      const s = this.stars[i];
      s.pz = s.z;
      s.z -= zStep;

      // Reset star when it flies past the camera
      if (s.z <= 0) {
        s.z = this.maxDepth;
        s.pz = this.maxDepth;
        s.x = (Math.random() - 0.5) * width * 2;
        s.y = (Math.random() - 0.5) * height * 2;
      }
    }
  }

  render() {
    const ctx = this.ctx;
    const width = this.canvas.width;
    const height = this.canvas.height;
    const cx = width / 2 + this.mouse.offsetX;
    const cy = height / 2 + this.mouse.offsetY;
    const scheme = STAR_SCHEMES[this.colorSchemeName] || STAR_SCHEMES['electric-blue'];

    // Deep space void with motion streak accumulation
    ctx.fillStyle = 'rgba(6, 8, 14, 0.35)';
    ctx.fillRect(0, 0, width, height);

    for (let i = 0; i < this.stars.length; i++) {
      const s = this.stars[i];

      // Perspective projection
      const k = this.fov / s.z;
      const sx = s.x * k + cx;
      const sy = s.y * k + cy;

      const pk = this.fov / s.pz;
      const px = s.x * pk + cx;
      const py = s.y * pk + cy;

      // Skip offscreen
      if (sx < 0 || sx >= width || sy < 0 || sy >= height) continue;

      const depthRatio = 1 - s.z / this.maxDepth;
      const radius = Math.max(0.6, s.size * k * 0.8);

      let strokeColor;
      if (this.colorSchemeName === 'rainbow') {
        strokeColor = `hsla(${s.hue}, 85%, 70%, ${depthRatio})`;
      } else {
        strokeColor = depthRatio > 0.7 ? scheme.near : depthRatio > 0.35 ? scheme.mid : scheme.far;
      }

      // Draw relativistic motion streak
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(sx, sy);
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = radius;
      ctx.lineCap = 'round';
      ctx.stroke();

      // Front star head dot with glow
      if (depthRatio > 0.5) {
        ctx.beginPath();
        ctx.arc(sx, sy, radius * 0.8, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = scheme.glow;
        ctx.shadowBlur = depthRatio * 10;
        ctx.fill();
      }
    }
    ctx.shadowBlur = 0;
  }

  destroy() {
    this.pause();
    this.canvas.removeEventListener('mousemove', this.handleMouseMove);
    this.canvas.removeEventListener('mouseleave', this.handleMouseLeave);
  }
}
