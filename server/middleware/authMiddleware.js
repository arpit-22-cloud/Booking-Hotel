import { getAuth, clerkClient } from "@clerk/express";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    // Get authenticated user info from Clerk
    const { userId, sessionId } = getAuth(req);

    if (!userId) {
      return res.json({ success: false, message: "Not authenticated" });
    }

    // Fetch full user data from Clerk (includes email)
    const clerkUser = await clerkClient.users.getUser(userId);
    const email = clerkUser.emailAddresses[0]?.emailAddress || clerkUser.primaryEmailAddress?.emailAddress;
    const firstName = clerkUser.firstName || "NoName";
    const profileImageUrl = clerkUser.profileImageUrl || "";

    if (!email) {
      return res.json({ success: false, message: "User email not found in Clerk" });
    }

    // Try to find user in MongoDB
    let user = await User.findOne({ _id: userId });

    // If user doesn't exist, create it automatically
    if (!user) {
      user = await User.create({
        _id: userId,                  // Clerk userId as MongoDB _id
        username: firstName,
        email: email,
        image: profileImageUrl,
        role: "user",
        recentSearchedCities: []
      });

      console.log("✅ New MongoDB user created for Clerk login:", user._id, "Email:", email);
    } else {
      let modified = false;

      if (!user.email || user.email === "NoEmail") {
        user.email = email;
        modified = true;
      }
      if (!user.username || user.username === "NoName") {
        user.username = firstName || email.split('@')[0];
        modified = true;
      }
      if (!user.image && profileImageUrl) {
        user.image = profileImageUrl;
        modified = true;
      }

      if (modified) {
        await user.save();
        console.log("✅ Updated user profile:", user._id, "Email:", user.email, "Username:", user.username);
      }
    }

    // Attach user to request
    req.user = user;

    // Debug
    console.log("REQ.USER:", req.user._id, "EMAIL:", req.user.email);

    next();
  } catch (error) {
    console.error("Protect middleware error:", error);
    res.json({ success: false, message: error.message });
  }
};