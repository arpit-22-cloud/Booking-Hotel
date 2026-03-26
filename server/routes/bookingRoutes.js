import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { createBooking, getUserBookings, getHotelDashboardData, stripePayment, checkAvailabilityAPI } from '../controllers/bookingController.js';

const bookingRouter = express.Router();

bookingRouter.post('/check-availability',checkAvailabilityAPI);
bookingRouter.post('/book', protect, createBooking);
bookingRouter.get('/user', protect, getUserBookings);
bookingRouter.get('/hotel', protect, getHotelDashboardData);
bookingRouter.post('/stripe-payment', protect, stripePayment);

export default bookingRouter;