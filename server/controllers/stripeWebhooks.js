import stripe from 'stripe';
import booking from '../models/Booking.js';

const stripeWebhooks = async (req, res) => {
  try {
    const stripeInstance = new stripe(process.env.stripe_secret_key);
    const sig = req.headers['stripe-signature'];
    let event;

    // Construct the event to verify it came from Stripe
    event = stripeInstance.webhooks.constructEvent(
      req.body, 
      sig, 
      process.env.stripe_bhook_secret
    );

    // Handle the successful payment event
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      
      // Retrieve the session to get the bookingId from metadata
      const sessions = await stripeInstance.checkout.sessions.list({
        payment_intent: paymentIntent.id,
      });

      const session = sessions.data;
      const { bookingId } = session.metadata;

      // Update the booking status in the database
      await booking.findByIdAndUpdate(bookingId, { 
        isPaid: true, 
        paymentMethod: 'stripe' 
      });
    }

    res.json({ received: true });
  } catch (error) {
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
};

export default stripeWebhooks;