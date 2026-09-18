import express from 'express';
import {
  getMyNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from '../controllers/notificationController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(protect); // All notification routes require authentication

router.route('/')
  .get(getMyNotifications);

router.route('/read-all')
  .put(markAllNotificationsAsRead);

router.route('/:id/read')
  .put(markNotificationAsRead);

export default router;
