import express from 'express';
import {
  getProperties,
  getPropertyDetails,
  createProperty,
  updateProperty,
  deleteProperty,
  getMyProperties,
} from '../controllers/propertyController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getProperties)
  .post(protect, createProperty);

router.get('/owner/me', protect, getMyProperties);

router.route('/:id')
  .get(getPropertyDetails)
  .put(protect, updateProperty)
  .delete(protect, deleteProperty);

export default router;
