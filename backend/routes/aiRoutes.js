import express from 'express';
import {
  generatePropertyDescription,
  planTrip,
} from '../controllers/aiController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/generate-description', protect, generatePropertyDescription);
router.post('/plan-trip', planTrip);

export default router;
