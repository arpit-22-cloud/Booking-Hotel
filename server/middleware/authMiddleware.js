import { getAuth } from "@clerk/express";
import User from "../models/User.js";


export const protect = async (req, res, next) => {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return res.json({ success: false, message: "Not authenticated" });
    }

    // ✅ VERY IMPORTANT FIX
    const user = await User.findOne({ _id: userId });

    if (!user) {
      return res.json({ success: false, message: "User not found in DB" });
    }

    req.user = user;

    console.log("REQ.USER:", req.user); // 👈 DEBUG

    next();
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};