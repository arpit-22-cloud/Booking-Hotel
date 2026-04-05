import mongoose from 'mongoose'

const connectDB = async () => {
  try {
    console.log("Connecting to MongoDB... ⏳")

    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    })

    console.log("MongoDB Connected ✅")

  } catch (error) {
    console.error("❌ MongoDB Connection Error:")
    console.error(error.message)
    process.exit(1)
  }
}

export default connectDB