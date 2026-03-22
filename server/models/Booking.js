import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  user: { type: String, ref: 'user', required: true },
  room: { type: String, ref: 'room', required: true },
  hotel: { type:String, ref: 'hotel', required: true },
  checkinDate: { type: Date, required: true },
  checkoutDate: { type: Date, required: true },
  totalPrice: { type: Number, required: true },
  guests: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
  paymentMethod: { type: String, default: 'pay at hotel', required: true },
  isPaid: { type: Boolean, default: false }
}, { timestamps: true });

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;