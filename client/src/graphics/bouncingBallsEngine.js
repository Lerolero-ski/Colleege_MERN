/**
 * Kinetic Elastic Spheres Engine
 * 2D rigid-body sphere physics with gravity, elastic boundary restitution, and sphere-to-sphere collision resolution.
 */

const PALETTES = {
  'rainbow': ['#f43f5e', '#fb923c', '#facc15', '#4ade80', '#22d3ee', '#818cf8', '#c084fc', '#f472b6'],
  'cyber-violet': ['#c084fc', '#a855f7', '#9333ea', '#6366f1', '#818cf8', '#38bdf8'],
  'matrix-green': ['#4ade80', '#22c55e', '#16a34a', '#86efac', '#a7f3d0'],
  'electric-blue': ['#38bdf8', '#0ea5e9', '#0284c7', '#67e8f9', '#bae6fd'],
  'sunset-amber': ['#f43f5e', '#fb7185', '#fb923c', '#f97316', '#facc15'],
  'neon-pink': ['#ec4899', '#f472b6', '#db2777', '#f43f5e', '#fb7185']
};

export class BouncingBallsEngine {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.speed = options.speed || 1.0;
    this.count = options.count || 24;
    this.colorSchemeName = options.colorScheme || 'rainbow';
    this.isInteractive = options.interactive !== false;

    this.balls = [];
    this.gravity = 0.35;
    this.restitution = 0.88; // Bounciness
    this.friction = 0.998;   // Air resistance
    this.isRunning = false;
    this.animationFrameId = null;
    this.lastTime = performance.now();
    this.fps = 60;
    this.fpsTimer = performance.now();
    this.framesThisSecond = 0;

    this.handleClick = this.handleClick.bind(this);
    this.initListeners();
    this.reset();
  }

  initListeners() {
    this.canvas.addEventListener('click', this.handleClick);
  }

  handleClick(e) {
    if (!this.isInteractive) return;
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    // Launch a new ball with randomized velocity burst
    const palette = PALETTES[this.colorSchemeName] || PALETTES['rainbow'];
    const radius = Math.random() * 16 + 12;
    this.balls.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 16,
      vy: -Math.random() * 14 - 6,
      radius,
      mass: radius,
      color: palette[Math.floor(Math.random() * palette.length)],
      trail: []
    });

    // Keep ball count under reasonable limit
    if (this.balls.length > 80) {
      this.balls.shift();
    }
  }

  reset() {
    const width = this.canvas.width || 800;
    const height = this.canvas.height || 500;
    this.balls = [];
    const palette = PALETTES[this.colorSchemeName] || PALETTES['rainbow'];

    for (let i = 0; i < this.count; i++) {
      const radius = Math.random() * 14 + 10;
      this.balls.push({
        x: Math.random() * (width - radius * 4) + radius * 2,
        y: Math.random() * (height * 0.5) + radius,
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.5) * 4,
        radius,
        mass: radius,
        color: palette[i % palette.length],
        trail: []
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
    this.count = Math.max(5, Math.min(60, count));
    this.reset();
  }

  setColorScheme(schemeName) {
    if (PALETTES[schemeName]) {
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
    const step = this.speed * 60 * dt;
    const len = this.balls.length;

    for (let i = 0; i < len; i++) {
      const b = this.balls[i];

      // Apply gravity and friction
      b.vy += this.gravity * step;
      b.vx *= Math.pow(this.friction, step);
      b.vy *= Math.pow(this.friction, step);

      // Move position
      b.x += b.vx * step;
      b.y += b.vy * step;

      // Wall boundaries (Floor, Ceiling, Left, Right)
      if (b.x - b.radius < 0) {
        b.x = b.radius;
        b.vx = -b.vx * this.restitution;
      } else if (b.x + b.radius > width) {
        b.x = width - b.radius;
        b.vx = -b.vx * this.restitution;
      }

      if (b.y - b.radius < 0) {
        b.y = b.radius;
        b.vy = -b.vy * this.restitution;
      } else if (b.y + b.radius > height) {
        b.y = height - b.radius;
        b.vy = -b.vy * this.restitution;
        // Dampen tiny jitter on the floor
        if (Math.abs(b.vy) < 0.6) b.vy = 0;
      }

      // Record motion trail
      b.trail.push({ x: b.x, y: b.y });
      if (b.trail.length > 5) b.trail.shift();
    }

    // Elastic Ball-to-Ball Collision Resolution
    for (let i = 0; i < len; i++) {
      const b1 = this.balls[i];
      for (let j = i + 1; j < len; j++) {
        const b2 = this.balls[j];
        const dx = b2.x - b1.x;
        const dy = b2.y - b1.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const minDist = b1.radius + b2.radius;

        if (dist < minDist && dist > 0) {
          // Normal vector
          const nx = dx / dist;
          const ny = dy / dist;

          // Separate overlapping balls
          const overlap = minDist - dist;
          b1.x -= nx * overlap * 0.5;
          b1.y -= ny * overlap * 0.5;
          b2.x += nx * overlap * 0.5;
          b2.y += ny * overlap * 0.5;

          // Relative velocity
          const kx = b1.vx - b2.vx;
          const ky = b1.vy - b2.vy;
          const p = 2 * (nx * kx + ny * ky) / (b1.mass + b2.mass);

          // Elastic impulse update
          b1.vx -= p * b2.mass * nx;
          b1.vy -= p * b2.mass * ny;
          b2.vx += p * b1.mass * nx;
          b2.vy += p * b1.mass * ny;
        }
      }
    }
  }

  render() {
    const ctx = this.ctx;
    const width = this.canvas.width;
    const height = this.canvas.height;

    // Dark sleek backdrop with slight motion blur
    ctx.fillStyle = 'rgba(10, 13, 20, 0.4)';
    ctx.fillRect(0, 0, width, height);

    // Draw grid lines on background for physics lab feel
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.025)';
    ctx.lineWidth = 1;
    const gridSize = 40;
    for (let x = 0; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Render spheres with radial shading for 3D depth
    for (let i = 0; i < this.balls.length; i++) {
      const b = this.balls[i];

      // Draw faint motion trail
      if (b.trail.length > 1) {
        ctx.beginPath();
        ctx.moveTo(b.trail[0].x, b.trail[0].y);
        for (let t = 1; t < b.trail.length; t++) {
          ctx.lineTo(b.trail[t].x, b.trail[t].y);
        }
        ctx.strokeStyle = b.color + '44';
        ctx.lineWidth = b.radius * 0.6;
        ctx.lineCap = 'round';
        ctx.stroke();
      }

      // 3D Sphere gradient
      const grad = ctx.createRadialGradient(
        b.x - b.radius * 0.35,
        b.y - b.radius * 0.35,
        b.radius * 0.1,
        b.x,
        b.y,
        b.radius
      );
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.3, b.color);
      grad.addColorStop(1, '#07090e');

      ctx.beginPath();
      ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.shadowColor = b.color;
      ctx.shadowBlur = 12;
      ctx.fill();
    }
    ctx.shadowBlur = 0;
  }

  destroy() {
    this.pause();
    this.canvas.removeEventListener('click', this.handleClick);
  }
}
