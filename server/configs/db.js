import mongoose from 'mongoose';

const connectDB = async () => {
  

  try {
    // Set mongoose options
    mongoose.set('bufferCommands', false);

    // Event listener for a successful connection
  mongoose.connection.on('connected', () => {
    console.log("database connected");
  });
    // Connects using the URI from environment variables and defines the database name
    await mongoose.connect(`${process.env.MONGODB_URI}`, {
      serverSelectionTimeoutMS: 10000, // Keep trying to send operations for 10 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    });
  } catch (error) {
    console.log(error.message);
  }
};

export default connectDB;