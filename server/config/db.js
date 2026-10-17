import mongoose from 'mongoose';

export const dbState = {
  isConnected: false,
  mode: 'offline_fallback',
  uri: '',
  error: null
};

// Initial seed data used if MongoDB is offline / unconfigured
export const initialSeedDemos = [
  {
    _id: '671234567890abcdef100001',
    title: 'Neural Particle Constellation',
    description: 'An interactive canvas network of autonomous glowing particles that form dynamic constellations and react elastically to cursor proximity.',
    animationType: 'particles',
    parameters: {
      speed: 1.2,
      count: 90,
      colorScheme: 'cyber-violet',
      interactive: true
    },
    tags: ['particles', 'physics', 'interactive', 'glow'],
    author: 'ShaderLab Core',
    views: 142,
    createdAt: new Date('2026-03-01T10:00:00.000Z'),
    updatedAt: new Date('2026-03-01T10:00:00.000Z')
  },
  {
    _id: '671234567890abcdef100002',
    title: 'Kinetic Elastic Spheres',
    description: 'Real-time 2D physics simulation of multi-sized bouncing balls with realistic gravitational acceleration, wall restitution, and elastic kinetic collisions.',
    animationType: 'bouncing_balls',
    parameters: {
      speed: 1.0,
      count: 24,
      colorScheme: 'rainbow',
      interactive: true
    },
    tags: ['physics', 'gravity', 'collision', 'kinetics'],
    author: 'ShaderLab Core',
    views: 98,
    createdAt: new Date('2026-03-05T14:30:00.000Z'),
    updatedAt: new Date('2026-03-05T14:30:00.000Z')
  },
  {
    _id: '671234567890abcdef100003',
    title: 'Hyperdrive Warp Starfield',
    description: '3D perspective projection simulating traveling through deep space at relativistic warp velocity with motion streaks and radial parallax.',
    animationType: 'starfield',
    parameters: {
      speed: 1.8,
      count: 220,
      colorScheme: 'electric-blue',
      interactive: true
    },
    tags: ['3d-projection', 'space', 'warp', 'parallax'],
    author: 'ShaderLab Core',
    views: 215,
    createdAt: new Date('2026-03-10T08:15:00.000Z'),
    updatedAt: new Date('2026-03-10T08:15:00.000Z')
  }
];

// In-memory fallback database store
export const fallbackStore = {
  demos: JSON.parse(JSON.stringify(initialSeedDemos))
};

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/shaderlab';
  dbState.uri = uri;

  try {
    console.log(`[MongoDB] Attempting to connect to MongoDB at: ${uri.replace(/:([^:@]{4})[^:@]*@/, ':$1***@')}...`);
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000 // 3 seconds timeout
    });

    dbState.isConnected = true;
    dbState.mode = 'mongodb';
    dbState.error = null;
    console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host} (Database: ${conn.connection.name})`);
    return true;
  } catch (error) {
    dbState.isConnected = false;
    dbState.mode = 'offline_fallback';
    dbState.error = error.message;

    console.warn('\n===============================================================');
    console.warn('⚠️  [MongoDB Notice]: Could not establish MongoDB connection.');
    console.warn(`    Reason: ${error.message}`);
    console.warn('    Action: Enabling Intelligent In-Memory Storage Fallback.');
    console.warn('    All CRUD API operations (Create, Read, Update, Delete) are 100% functional.');
    console.warn('    To connect your MongoDB Atlas cluster:');
    console.warn('    Set MONGODB_URI in server/.env with your MongoDB Atlas connection string.');
    console.warn('===============================================================\n');
    return false;
  }
};
