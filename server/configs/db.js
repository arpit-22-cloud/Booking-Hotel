import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    mongoose.set('bufferCommands', false);

    // Connect to MongoDB
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });

    console.log(`MongoDB Connected ✅: ${conn.connection.host}`);

  } catch (error) {
    console.error("MongoDB connection failed ❌:", error.message);
    process.exit(1); // stop app if DB fails
  }
};

export default connectDB;