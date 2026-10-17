import express from 'express';
import {
  getDemos,
  getDemoById,
  createDemo,
  updateDemo,
  deleteDemo,
  resetDemos,
  getHealth
} from '../controllers/demoController.js';

const router = express.Router();

// Health check endpoint
router.get('/health', getHealth);

// Demo seed / reset endpoint
router.post('/demos/seed', resetDemos);

// Main CRUD endpoints
router.route('/demos')
  .get(getDemos)
  .post(createDemo);

router.route('/demos/:id')
  .get(getDemoById)
  .put(updateDemo)
  .delete(deleteDemo);

export default router;
