import express from 'express';
import {
  createBooking,
  getMyBookings,
  getBookingDetails,
  cancelBooking,
  getHostAnalytics,
  resetHostBookings,
  getGuestAnalytics,
} from '../controllers/bookingController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(protect); // All booking routes require authentication

router.route('/')
  .post(createBooking);

router.route('/my')
  .get(getMyBookings);

router.route('/guest/analytics')
  .get(getGuestAnalytics);

router.route('/host/analytics')
  .get(getHostAnalytics);

router.route('/host/reset-bookings')
  .post(resetHostBookings);

router.route('/:id')
  .get(getBookingDetails);

router.route('/:id/cancel')
  .put(cancelBooking);

export default router;
