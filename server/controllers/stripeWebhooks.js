import Stripe from "stripe";
import Booking from "../models/Booking.js";

const stripeWebhooks = async (req, res) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.log("Webhook Error:", error.message);
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  // ✅ HANDLE CORRECT EVENT
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    const bookingId = session.metadata.bookingId;

    await Booking.findByIdAndUpdate(bookingId, {
      isPaid: true,
      paymentMethod: "stripe",
      status: "confirmed"
    });

    console.log("✅ Payment success, booking updated");
  } else {
    console.log("Unhandled event:", event.type);
  }

  res.json({ received: true });
};

export default stripeWebhooks;