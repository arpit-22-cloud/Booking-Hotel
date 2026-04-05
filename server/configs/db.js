import mongoose from 'mongoose';

const connectDB = async () => {
  

  try {
    // Set mongoose options
    mongoose.set('bufferCommands', false);

    // Event listener for a successful connection
    mongoose.connection.on('connected', () => {
      console.log('database connected');
    });

    // Connect using the URI from environment variables
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    throw error;
  }
};

export default connectDB;