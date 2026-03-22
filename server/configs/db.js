import mongoose from 'mongoose';

const connectDB = async () => {
  

  try {
    // Event listener for a successful connection
  mongoose.connection.on('connected', () => {
    console.log("database connected");
  });
    // Connects using the URI from environment variables and defines the database name
    await mongoose.connect(`${process.env.MONGODB_URI}/hotel-booking`);
  } catch (error) {
    console.log(error.message);
  }
};

export default connectDB;