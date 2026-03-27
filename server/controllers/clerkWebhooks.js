import User from "../models/User.js";
import { Webhook } from "svix";

const clerkWebHooks = async (req, res) => {
  try {
    console.log("Webhook hit");

    const Whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    };

    await Whook.verify(req.body, headers);

    const payload = JSON.parse(req.body.toString());
    const { data, type } = payload;

    console.log("TYPE:", type);

    // ✅ SAFE EMAIL
    const email =
      data.email_addresses?.[0]?.email_address || "noemail@example.com";

    // ✅ SAFE USERNAME (never empty)
    const generatedUsername =
      `${data.first_name || ""} ${data.last_name || ""}`.trim() ||
      data.username ||
      email.split("@")[0] ||
      "User";

    switch (type) {
      case "user.created": {
        const userData = {
          _id: data.id,
          email,
          username: generatedUsername,
          image: data.image_url,
        };

        await User.create(userData);
        console.log("User created:", userData);
        break;
      }

      case "user.updated": {
        const existingUser = await User.findById(data.id);

        await User.findByIdAndUpdate(data.id, {
          email,
          image: data.image_url,

          // ✅ only update username if Clerk sends name
          username:
            (data.first_name || data.last_name)
              ? `${data.first_name || ""} ${data.last_name || ""}`.trim()
              : existingUser?.username,
        });

        console.log("User updated");
        break;
      }

      case "user.deleted": {
        await User.findByIdAndDelete(data.id);
        console.log("User deleted");
        break;
      }
    }

    res.json({ success: true });
  } catch (error) {
    console.log("WEBHOOK ERROR:", error.message);
    res.json({ success: false, message: error.message });
  }
};

export default clerkWebHooks;