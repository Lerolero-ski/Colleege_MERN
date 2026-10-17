import { ParticleEngine } from './particleEngine.js';
import { BouncingBallsEngine } from './bouncingBallsEngine.js';
import { StarfieldEngine } from './starfieldEngine.js';
import { MatrixRainEngine } from './matrixRainEngine.js';

export const createGraphicsEngine = (animationType, canvas, options = {}) => {
  if (!canvas) return null;

  switch (animationType) {
    case 'particles':
      return new ParticleEngine(canvas, options);
    case 'bouncing_balls':
      return new BouncingBallsEngine(canvas, options);
    case 'starfield':
      return new StarfieldEngine(canvas, options);
    case 'matrix_rain':
      return new MatrixRainEngine(canvas, options);
    default:
      console.warn(`Unknown animationType "${animationType}", falling back to particles`);
      return new ParticleEngine(canvas, options);
  }
};

export const ANIMATION_TYPES = [
  {
    id: 'particles',
    name: 'Neural Particles',
    badge: 'Particles',
    description: 'Dynamic constellation mesh with elastic cursor interactivity and distance connections',
    color: 'from-violet-500 to-indigo-600',
    accent: '#8b5cf6',
    defaultParams: { speed: 1.2, count: 90, colorScheme: 'cyber-violet', interactive: true }
  },
  {
    id: 'bouncing_balls',
    name: 'Kinetic Spheres',
    badge: 'Bouncing Balls',
    description: 'Real-time 2D rigid physics with gravity, wall restitution, and sphere collisions',
    color: 'from-amber-500 to-rose-600',
    accent: '#f59e0b',
    defaultParams: { speed: 1.0, count: 24, colorScheme: 'rainbow', interactive: true }
  },
  {
    id: 'starfield',
    name: 'Warp Starfield',
    badge: 'Starfield',
    description: '3D perspective projection hyperspace simulation with relativistic streaks',
    color: 'from-cyan-500 to-blue-600',
    accent: '#06b6d4',
    defaultParams: { speed: 1.8, count: 220, colorScheme: 'electric-blue', interactive: true }
  },
  {
    id: 'matrix_rain',
    name: 'Digital Matrix',
    badge: 'Matrix Rain',
    description: 'Phosphorescent cascading alphanumeric and Japanese glyph streams',
    color: 'from-emerald-500 to-green-600',
    accent: '#10b981',
    defaultParams: { speed: 1.1, count: 45, colorScheme: 'matrix-green', interactive: false }
  }
];

export const COLOR_OPTIONS = [
  { id: 'cyber-violet', name: 'Cyber Violet', hex: '#8b5cf6' },
  { id: 'electric-blue', name: 'Electric Blue', hex: '#0ea5e9' },
  { id: 'matrix-green', name: 'Matrix Green', hex: '#10b981' },
  { id: 'sunset-amber', name: 'Sunset Amber', hex: '#f59e0b' },
  { id: 'neon-pink', name: 'Neon Pink', hex: '#ec4899' },
  { id: 'rainbow', name: 'Chroma Rainbow', hex: '#c084fc' }
];
