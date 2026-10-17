/**
 * Matrix Digital Rain Engine
 * Phosphorescent falling glyph stream with randomized drop frequencies and fading tails.
 */

const MATRIX_PALETTES = {
  'matrix-green': {
    head: '#e0ffe8',
    stream: '#22c55e',
    trail: '#15803d',
    glow: 'rgba(34, 197, 94, 0.8)'
  },
  'cyber-violet': {
    head: '#fae8ff',
    stream: '#c084fc',
    trail: '#7e22ce',
    glow: 'rgba(192, 132, 252, 0.8)'
  },
  'electric-blue': {
    head: '#e0f2fe',
    stream: '#38bdf8',
    trail: '#0369a1',
    glow: 'rgba(56, 189, 248, 0.8)'
  },
  'sunset-amber': {
    head: '#fef3c7',
    stream: '#fbbf24',
    trail: '#b45309',
    glow: 'rgba(251, 191, 36, 0.8)'
  },
  'neon-pink': {
    head: '#fce7f3',
    stream: '#f472b6',
    trail: '#be185d',
    glow: 'rgba(244, 114, 182, 0.8)'
  },
  'rainbow': {
    head: '#ffffff',
    stream: '#38bdf8',
    trail: '#8b5cf6',
    glow: 'rgba(255, 255, 255, 0.8)'
  }
};

const GLYPHS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFλπΩΔΨ§#<>/';

export class MatrixRainEngine {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.speed = options.speed || 1.1;
    this.count = options.count || 45;
    this.colorSchemeName = options.colorScheme || 'matrix-green';

    this.fontSize = 15;
    this.columns = 0;
    this.drops = [];
    this.isRunning = false;
    this.animationFrameId = null;
    this.lastTime = performance.now();
    this.fps = 60;
    this.fpsTimer = performance.now();
    this.framesThisSecond = 0;

    this.reset();
  }

  reset() {
    const width = this.canvas.width || 800;
    this.columns = Math.floor(width / this.fontSize);
    this.drops = [];

    for (let i = 0; i < this.columns; i++) {
      this.drops[i] = {
        y: Math.random() * -100,
        speed: (Math.random() * 0.8 + 0.6) * this.speed,
        length: Math.floor(Math.random() * 15 + 10)
      };
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
    for (let i = 0; i < this.drops.length; i++) {
      this.drops[i].speed = (Math.random() * 0.8 + 0.6) * this.speed;
    }
  }

  setCount(count) {
    this.count = count;
  }

  setColorScheme(schemeName) {
    if (MATRIX_PALETTES[schemeName]) {
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

    this.render(dt);
    this.animationFrameId = requestAnimationFrame(() => this.animate());
  }

  render(dt) {
    const ctx = this.ctx;
    const width = this.canvas.width;
    const height = this.canvas.height;
    const palette = MATRIX_PALETTES[this.colorSchemeName] || MATRIX_PALETTES['matrix-green'];

    // Fade effect for stream trailing
    ctx.fillStyle = 'rgba(7, 9, 14, 0.16)';
    ctx.fillRect(0, 0, width, height);

    ctx.font = `${this.fontSize}px 'JetBrains Mono', monospace`;

    for (let i = 0; i < this.drops.length; i++) {
      const drop = this.drops[i];
      const char = GLYPHS.charAt(Math.floor(Math.random() * GLYPHS.length));
      const x = i * this.fontSize;
      const y = drop.y * this.fontSize;

      // Glow head character
      ctx.fillStyle = palette.head;
      ctx.shadowColor = palette.glow;
      ctx.shadowBlur = 8;
      ctx.fillText(char, x, y);

      // Trailing character
      const trailChar = GLYPHS.charAt(Math.floor(Math.random() * GLYPHS.length));
      ctx.fillStyle = palette.stream;
      ctx.shadowBlur = 0;
      ctx.fillText(trailChar, x, y - this.fontSize);

      // Advance drop
      drop.y += drop.speed * 40 * dt;

      // Reset when reaching bottom with random staggered offset
      if (y > height && Math.random() > 0.975) {
        drop.y = 0;
        drop.speed = (Math.random() * 0.8 + 0.6) * this.speed;
      }
    }
    ctx.shadowBlur = 0;
  }

  destroy() {
    this.pause();
  }
}
