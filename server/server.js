import express from 'express'
import mongoose from "mongoose";
import 'dotenv/config'
import cors from 'cors'
import connectDB from './configs/db.js'
import connectCloudinary from './configs/cloudinary.js'
import { clerkMiddleware } from '@clerk/express'

import userRouter from './routes/userRoutes.js'
import hotelRouter from './routes/hotelRoutes.js'
import roomRouter from './routes/roomRoutes.js'
import bookingRouter from './routes/bookingRoutes.js'
import stripeWebhooks from './controllers/stripeWebhooks.js'
import clerkRoutes from './routes/clerkRoutes.js'

const app = express()
const port = process.env.PORT || 3000

// Enable CORS
app.use(cors())

// ✅ Stripe webhook BEFORE express.json()
app.post('/api/stripe', express.raw({ type: 'application/json' }), stripeWebhooks)

// Clerk middleware
app.use(clerkMiddleware())

// Routes
app.use('/api/clerk', clerkRoutes)

// Body parser
app.use(express.json())

// Test route
app.get('/', (req, res) => res.send('API is working'))

// API Routes
app.use('/api/user', userRouter)
app.use('/api/hotels', hotelRouter)
app.use('/api/rooms', roomRouter)
app.use('/api/bookings', bookingRouter)


const startServer = async () => {
  try {
    console.log("Connecting DB...");

    await connectDB();

    console.log("DB State:", mongoose.connection.readyState); // 👈 DEBUG

    await connectCloudinary();

    app.listen(port, () => {
      console.log(`Server running on port ${port} 🚀`);
    });

  } catch (error) {
    console.log("Startup error:", error);
  }
};

startServer();