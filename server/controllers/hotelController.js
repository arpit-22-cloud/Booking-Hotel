import Hotel from '../models/Hotel.js';
import User from '../models/User.js';

export const registerHotel = async (req, res) => {
  try {
    const { name, address, contact, city } = req.body;
    const owner = req.user._id; // ✅ Always exists now

    // Check if user already has a hotel
    const hotel = await Hotel.findOne({ owner });
    if (hotel) return res.json({ success: false, message: 'Hotel already registered' });

    await Hotel.create({ name, address, contact, city, owner });

    // Update user role
    await User.findByIdAndUpdate(owner, { role: 'hotel owner' });

    res.json({ success: true, message: 'Hotel registered successfully' });
  } catch (error) {
    console.error("RegisterHotel error:", error);
    res.json({ success: false, message: error.message });
  }
};