import Demo from '../models/Demo.js';
import { dbState, fallbackStore, initialSeedDemos } from '../config/db.js';
import mongoose from 'mongoose';

// Helper to generate unique MongoDB-like ObjectId string for fallback store
const generateId = () => new mongoose.Types.ObjectId().toString();

/**
 * @desc   Fetch all demos with optional search and filter
 * @route  GET /api/demos
 */
export const getDemos = async (req, res) => {
  try {
    const { search, type, sort = 'newest' } = req.query;

    if (dbState.isConnected) {
      const query = {};

      if (type && type !== 'all') {
        query.animationType = type;
      }

      if (search && search.trim() !== '') {
        const regex = new RegExp(search.trim(), 'i');
        query.$or = [
          { title: regex },
          { description: regex },
          { tags: regex }
        ];
      }

      let sortOption = { createdAt: -1 };
      if (sort === 'oldest') sortOption = { createdAt: 1 };
      if (sort === 'views') sortOption = { views: -1 };
      if (sort === 'title') sortOption = { title: 1 };

      const demos = await Demo.find(query).sort(sortOption);
      return res.status(200).json({
        success: true,
        count: demos.length,
        data: demos,
        source: 'mongodb'
      });
    }

    // Offline fallback store handling
    let results = [...fallbackStore.demos];

    if (type && type !== 'all') {
      results = results.filter((d) => d.animationType === type);
    }

    if (search && search.trim() !== '') {
      const q = search.trim().toLowerCase();
      results = results.filter(
        (d) =>
          d.title.toLowerCase().includes(q) ||
          d.description.toLowerCase().includes(q) ||
          (d.tags && d.tags.some((t) => t.toLowerCase().includes(q)))
      );
    }

    if (sort === 'newest') {
      results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sort === 'oldest') {
      results.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sort === 'views') {
      results.sort((a, b) => (b.views || 0) - (a.views || 0));
    } else if (sort === 'title') {
      results.sort((a, b) => a.title.localeCompare(b.title));
    }

    return res.status(200).json({
      success: true,
      count: results.length,
      data: results,
      source: 'offline_fallback'
    });
  } catch (error) {
    console.error('Error in getDemos:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve demos',
      error: error.message
    });
  }
};

/**
 * @desc   Fetch single demo by ID
 * @route  GET /api/demos/:id
 */
export const getDemoById = async (req, res) => {
  try {
    const { id } = req.params;

    if (dbState.isConnected) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: `Invalid demo ID format: ${id}`
        });
      }

      const demo = await Demo.findByIdAndUpdate(
        id,
        { $inc: { views: 1 } },
        { new: true }
      );

      if (!demo) {
        return res.status(404).json({
          success: false,
          message: `Demo with ID ${id} not found`
        });
      }

      return res.status(200).json({
        success: true,
        data: demo,
        source: 'mongodb'
      });
    }

    // Offline fallback
    const index = fallbackStore.demos.findIndex((d) => d._id === id);
    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: `Demo with ID ${id} not found`
      });
    }

    fallbackStore.demos[index].views = (fallbackStore.demos[index].views || 0) + 1;
    return res.status(200).json({
      success: true,
      data: fallbackStore.demos[index],
      source: 'offline_fallback'
    });
  } catch (error) {
    console.error('Error in getDemoById:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve demo',
      error: error.message
    });
  }
};

/**
 * @desc   Create a new demo
 * @route  POST /api/demos
 */
export const createDemo = async (req, res) => {
  try {
    const { title, description, animationType, parameters, tags, author } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Demo title is required'
      });
    }

    if (!description || !description.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Demo description is required'
      });
    }

    const validTypes = ['particles', 'bouncing_balls', 'starfield', 'matrix_rain'];
    if (!animationType || !validTypes.includes(animationType)) {
      return res.status(400).json({
        success: false,
        message: `Animation type must be one of: ${validTypes.join(', ')}`
      });
    }

    const newDemoData = {
      title: title.trim(),
      description: description.trim(),
      animationType,
      parameters: {
        speed: Number(parameters?.speed) || 1.0,
        count: Number(parameters?.count) || (animationType === 'bouncing_balls' ? 24 : 100),
        colorScheme: parameters?.colorScheme || 'cyber-violet',
        interactive: parameters?.interactive !== false
      },
      tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map((t) => t.trim()) : ['canvas', animationType]),
      author: author && author.trim() ? author.trim() : 'Anonymous Lab Developer',
      views: 0
    };

    if (dbState.isConnected) {
      const demo = await Demo.create(newDemoData);
      return res.status(201).json({
        success: true,
        message: 'Demo created successfully',
        data: demo,
        source: 'mongodb'
      });
    }

    // Offline fallback
    const savedDemo = {
      _id: generateId(),
      ...newDemoData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    fallbackStore.demos.unshift(savedDemo);

    return res.status(201).json({
      success: true,
      message: 'Demo created successfully (in-memory mode)',
      data: savedDemo,
      source: 'offline_fallback'
    });
  } catch (error) {
    console.error('Error in createDemo:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create demo',
      error: error.message
    });
  }
};

/**
 * @desc   Update an existing demo
 * @route  PUT /api/demos/:id
 */
export const updateDemo = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, animationType, parameters, tags, author } = req.body;

    if (dbState.isConnected) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: `Invalid demo ID format: ${id}`
        });
      }

      const updateFields = {};
      if (title !== undefined) updateFields.title = title.trim();
      if (description !== undefined) updateFields.description = description.trim();
      if (animationType !== undefined) updateFields.animationType = animationType;
      if (parameters !== undefined) updateFields.parameters = parameters;
      if (tags !== undefined) updateFields.tags = Array.isArray(tags) ? tags : tags.split(',').map((t) => t.trim());
      if (author !== undefined) updateFields.author = author.trim();

      const updatedDemo = await Demo.findByIdAndUpdate(id, updateFields, {
        new: true,
        runValidators: true
      });

      if (!updatedDemo) {
        return res.status(404).json({
          success: false,
          message: `Demo with ID ${id} not found`
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Demo updated successfully',
        data: updatedDemo,
        source: 'mongodb'
      });
    }

    // Offline fallback
    const index = fallbackStore.demos.findIndex((d) => d._id === id);
    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: `Demo with ID ${id} not found`
      });
    }

    const current = fallbackStore.demos[index];
    const updatedDemo = {
      ...current,
      title: title !== undefined ? title.trim() : current.title,
      description: description !== undefined ? description.trim() : current.description,
      animationType: animationType !== undefined ? animationType : current.animationType,
      parameters: parameters !== undefined ? { ...current.parameters, ...parameters } : current.parameters,
      tags: tags !== undefined ? (Array.isArray(tags) ? tags : tags.split(',').map((t) => t.trim())) : current.tags,
      author: author !== undefined ? author.trim() : current.author,
      updatedAt: new Date()
    };

    fallbackStore.demos[index] = updatedDemo;

    return res.status(200).json({
      success: true,
      message: 'Demo updated successfully (in-memory mode)',
      data: updatedDemo,
      source: 'offline_fallback'
    });
  } catch (error) {
    console.error('Error in updateDemo:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update demo',
      error: error.message
    });
  }
};

/**
 * @desc   Delete demo by ID
 * @route  DELETE /api/demos/:id
 */
export const deleteDemo = async (req, res) => {
  try {
    const { id } = req.params;

    if (dbState.isConnected) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: `Invalid demo ID format: ${id}`
        });
      }

      const deletedDemo = await Demo.findByIdAndDelete(id);

      if (!deletedDemo) {
        return res.status(404).json({
          success: false,
          message: `Demo with ID ${id} not found`
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Demo deleted successfully',
        data: deletedDemo,
        source: 'mongodb'
      });
    }

    // Offline fallback
    const index = fallbackStore.demos.findIndex((d) => d._id === id);
    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: `Demo with ID ${id} not found`
      });
    }

    const [deleted] = fallbackStore.demos.splice(index, 1);
    return res.status(200).json({
      success: true,
      message: 'Demo deleted successfully (in-memory mode)',
      data: deleted,
      source: 'offline_fallback'
    });
  } catch (error) {
    console.error('Error in deleteDemo:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete demo',
      error: error.message
    });
  }
};

/**
 * @desc   Reset or re-seed sample demos
 * @route  POST /api/demos/seed
 */
export const resetDemos = async (req, res) => {
  try {
    if (dbState.isConnected) {
      await Demo.deleteMany({});
      const seeded = await Demo.insertMany(initialSeedDemos.map(({ _id, ...rest }) => rest));
      return res.status(200).json({
        success: true,
        message: 'Database seeded with default 3 sample demos',
        count: seeded.length,
        data: seeded
      });
    }

    fallbackStore.demos = JSON.parse(JSON.stringify(initialSeedDemos));
    return res.status(200).json({
      success: true,
      message: 'Reset default sample demos in memory',
      count: fallbackStore.demos.length,
      data: fallbackStore.demos
    });
  } catch (error) {
    console.error('Error in resetDemos:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to reset demo dataset',
      error: error.message
    });
  }
};

/**
 * @desc   System health and MongoDB connectivity status
 * @route  GET /api/health
 */
export const getHealth = async (req, res) => {
  const count = dbState.isConnected
    ? await Demo.countDocuments().catch(() => 0)
    : fallbackStore.demos.length;

  return res.status(200).json({
    status: 'online',
    appName: 'ShaderLab — Graphics Demo Playground API',
    uptime: Math.floor(process.uptime()),
    database: {
      mode: dbState.mode,
      connected: dbState.isConnected,
      totalDemos: count,
      atlasConfigured: Boolean(process.env.MONGODB_URI && process.env.MONGODB_URI.includes('mongodb+srv')),
      notice: dbState.isConnected
        ? 'Connected to MongoDB Atlas'
        : 'Running with intelligent fallback store (CRUD works 100%). Configure MONGODB_URI in server/.env for MongoDB Atlas persistence.'
    }
  });
};
