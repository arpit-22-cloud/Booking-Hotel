import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
user: {type: String,          // ✅ MUST be String
    ref: 'user', required: true },
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  hotel: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true },
  checkInDate: { type: Date, required: true },
  checkOutDate: { type: Date, required: true },
  totalPrice: { type: Number, required: true },
  guests: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
  paymentMethod: { type: String, default: 'Pay At Hotel', required: true },
  isPaid: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('Booking', bookingSchema);