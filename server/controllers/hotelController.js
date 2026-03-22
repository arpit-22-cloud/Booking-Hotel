import hotel from '../models/Hotel.js';
import User from '../models/User.js';

// API controller function to register a new hotel
export const registerHotel = async (req, res) => {
  try {
    // Extracting hotel details from the request body
    const { name, address, contact, city } = req.body;
    
    // The owner ID is retrieved from the authenticated user object attached by middleware
    const owner = req.user._id; 

    // Check if the user has already registered a hotel
    const existingHotel = await hotel.findOne({ owner });
    
    if (existingHotel) {
      return res.json({ success: false, message: 'Hotel already registered' });
    }

    // Create a new hotel entry in the database
    await hotel.create({
      name,
      address,
      contact,
      city,
      owner
    });

    // Update the user's role from 'user' to 'hotel owner'
    await User.findByIdAndUpdate(owner, { role: 'hotel owner' });

    res.json({ success: true, message: 'hotel registered successfully' });

  } catch (error) {
    // Return error message if any step fails
    res.json({ success: false, message: error.message });
  }
};