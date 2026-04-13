import express from 'express'
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

const startServer = async () => {
  try {
    // ✅ WAIT for DB
    await connectDB()

    // Cloudinary connect (no need await usually)
    connectCloudinary()

    app.use(cors())

    // Stripe webhook (before json)
    app.post('/api/stripe', express.raw({ type: 'application/json' }), stripeWebhooks)

    app.use(clerkMiddleware())
    app.use('/api/clerk', clerkRoutes)

    app.use(express.json())

    app.get('/', (req, res) => res.send('API is working'))

    app.use('/api/user', userRouter)
    app.use('/api/hotels', hotelRouter)
    app.use('/api/rooms', roomRouter)
    app.use('/api/bookings', bookingRouter)

    // ✅ Start server AFTER everything is ready
    app.listen(port, () => {
      console.log(`Server running on port ${port} 🚀`)
    })

  } catch (error) {
    console.error("Server failed to start ❌", error)
  }
}

startServer()