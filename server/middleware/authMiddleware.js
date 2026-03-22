import User from '../models/User.js';
import { getAuth } from "@clerk/express";

export const protect = async (req, res, next) => {
  try {
    const { userId } = getAuth(req);   // ✅ FIXED

    if (!userId) {
      return res.json({ success: false, message: 'Not authenticated' });
    }

    const user = await User.findById(userId);

    req.user = user;
    next();

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
