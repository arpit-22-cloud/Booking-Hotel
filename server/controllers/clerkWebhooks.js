import User from "../models/User.js";
import { Webhook } from "svix";

// Controller to handle Clerk Webhooks [1]
const clerkWebHooks = async (req, res) => {
  try {
    
    // Create Svix instance with Clerk Webhook Secret from environment variables [6]
    const Whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    };
    // Verify the headers to ensure the request is from Clerk
    await Whook.verify(req.body, headers);

    // Extracting data and event type from the request body
    const { data, type } = JSON.parse(req.body);

    

    // Switch case to handle different Clerk events
    switch (type) {
      case "user.created": {
        // Construct user data object for creation
    const userData = {
      _id: data.id,
      email: data.email_addresses[0].email_address,
username: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
      image: data.image_url,
    };
        await User.create(userData);

        break;
      }

      case "user.updated": {
        // Construct user data object for updates
        
    const userData = {
      _id: data.id,
      email: data.email_addresses[0].email_address,
      username: data.first_name + " " + data.last_name,
      image: data.image_url,
    };

        await User.findByIdAndUpdate(data.id, userData);

        break;
      }

      case "user.deleted": {
        // Delete the user from the database
        await User.findByIdAndDelete(data.id);

        break;
      }

      default:
        break;
    }
    res.json({ success: true, message: "Webhook Recieved" });
  } catch (error) {
    // Log and return error if verification or database operation fails
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

export default clerkWebHooks;
