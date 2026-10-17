import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Demo from '../models/Demo.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const sampleDemos = [
  {
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
    views: 142
  },
  {
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
    views: 98
  },
  {
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
    views: 215
  },
  {
    title: 'Matrix Digital Cyber Rain',
    description: 'Cascading phosphorescent katakana & digital glyph streams with randomized drop velocities and neon luminescence fading.',
    animationType: 'matrix_rain',
    parameters: {
      speed: 1.1,
      count: 45,
      colorScheme: 'matrix-green',
      interactive: true
    },
    tags: ['matrix', 'cyberpunk', 'canvas', 'retro'],
    author: 'ShaderLab Core',
    views: 180
  }
];

const seedDatabase = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/shaderlab';

  console.log(`Connecting to MongoDB at ${uri.replace(/:([^:@]{4})[^:@]*@/, ':$1***@')}...`);
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log('Connected to MongoDB successfully.');

    console.log('Clearing existing demos collection...');
    await Demo.deleteMany({});

    console.log('Inserting seed demo documents...');
    const inserted = await Demo.insertMany(sampleDemos);

    console.log(`\nSuccessfully seeded ${inserted.length} demos into MongoDB:`);
    inserted.forEach((d, idx) => {
      console.log(`  [${idx + 1}] ID: ${d._id} | "${d.title}" (${d.animationType})`);
    });

    console.log('\nSample MongoDB Document Output:');
    console.log(JSON.stringify(inserted[0], null, 2));

    await mongoose.connection.close();
    console.log('\nDatabase connection closed. Seeding complete.');
    process.exit(0);
  } catch (error) {
    console.error('\n⚠️ Failed to connect to MongoDB Atlas / Local MongoDB:');
    console.error(error.message);
    console.log('\nNote: ShaderLab includes an automatic in-memory fallback store so the application will run and CRUD operations will work immediately.');
    console.log('When you have your MongoDB Atlas URI, set it in server/.env and run: npm run seed --prefix server');
    process.exit(0);
  }
};

seedDatabase();
