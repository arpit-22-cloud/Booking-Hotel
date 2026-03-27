import express from 'express'
import 'dotenv/config' 
import cors from 'cors' 
import connectDB from './configs/db.js' 
import connectCloudinary from './configs/cloudinary.js' 
import { clerkMiddleware } from '@clerk/express' 
// import clerkWebHooks from './controllers/clerkWebhooks.js' 
import userRouter from './routes/userRoutes.js' 
import hotelRouter from './routes/hotelRoutes.js' 
import roomRouter from './routes/roomRoutes.js' 
import bookingRouter from './routes/bookingRoutes.js' 
import stripeWebhooks from './controllers/stripeWebhooks.js' 
import clerkRoutes from './routes/clerkRoutes.js';

const app = express()
const port = process.env.PORT || 3000

// Connect to database and cloud services 
connectDB()
connectCloudinary()

// Enable CORS
app.use(cors())

// IMPORTANT: Stripe Webhook must be defined before express.json() 
// because it requires a raw request body 
app.post('/api/stripe', express.raw({ type: 'application/json' }), stripeWebhooks)



app.use(clerkMiddleware())

app.use('/api/clerk', clerkRoutes)

app.use(express.json());

// API Routes
app.get('/', (req, res) => res.send('API is working')) 
// app.use('/api/clerk', clerkWebHooks) 

app.use('/api/user', userRouter) 
app.use('/api/hotels', hotelRouter) 
app.use('/api/rooms', roomRouter) 
app.use('/api/bookings', bookingRouter) 

// Start the server 
app.listen(port, () => {
    console.log(`server running on port ${port}`) 
})