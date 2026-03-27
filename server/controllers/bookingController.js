import Booking from "../models/Booking.js";

import Hotel from "../models/Hotel.js";
import transporter from "../configs/nodeMailer.js";
import Stripe from "stripe";
import Room from "../models/Room.js";

// function check availability
export const checkAvailability = async ({
  checkInDate,
  checkOutDate,
  room,
}) => {
  try {
    const bookings = await Booking.find({
      room,
      checkInDate: { $lte:new  Date(checkOutDate) },
      checkOutDate: { $gte: new Date(checkInDate) },
    });
    const isAvailable = bookings.length === 0;
    return isAvailable;
  } catch (error) {
    console.error(error.message);
  }
};

// api to checkavailabilty for room
export const checkAvailabilityAPI = async (req, res) => {
  try {
    const { room, checkInDate, checkOutDate } = req.body;
    const isAvailable = await checkAvailability({
      checkInDate,
      checkOutDate,
      room,
    });

    return res.json({ success: true, isAvailable });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const createBooking = async (req, res) => {
  try {
    const { room, checkInDate, checkOutDate, guests } = req.body;
    const user = req.user._id;

    // Before booking check checkAvailability
    const isAvailable = await checkAvailability({
      checkInDate,
      checkOutDate,
      room,
    });

    if (!isAvailable) {
      return res.json({ success: false, message: "Room is not availabel" });
    }
    // get totalprice from Room
    const roomData = await Room.findById(room).populate("hotel");
    let totalPrice = roomData.pricePerNight;

    // Calculate totalprice  based on nights
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const timeDiff = checkOut.getTime() - checkIn.getTime();
    const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));
    totalPrice*=nights;




    const booking = await Booking.create({
      user,
      room,
      hotel: roomData.hotel._id,
      checkInDate,
      checkOutDate,
      guests: +guests,
      totalPrice,
      paymentMethod: "Pay At Hotel",
    });

    // Send Confirmation Email with error handling
    try {
      if (req.user?.email) {
        const mailOptions = {
          from: `"Heavenly Hotels - ${roomData.hotel.name}" <${process.env.SENDER_EMAIL}>`,
          to: req.user.email,
          subject: `✨ Booking Confirmation - ${roomData.hotel.name}`,
          replyTo: process.env.SENDER_EMAIL,
          html: `
          <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px; border-radius: 8px;">
            <h2 style="color: #333;">✨ Your Booking Confirmation</h2>
            <p style="color: #666;">Dear <strong>${req.user.username || req.user.email || 'Guest'}</strong>,</p>
            <p style="color: #666;">Thank you for booking with us! Here are your reservation details:</p>
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <tr style="background-color: #f0f0f0;">
                <td style="padding: 10px; border: 1px solid #ddd;"><strong>Booking ID</strong></td>
                <td style="padding: 10px; border: 1px solid #ddd;">${booking._id}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #ddd;"><strong>Hotel</strong></td>
                <td style="padding: 10px; border: 1px solid #ddd;">${roomData.hotel.name}</td>
              </tr>
              <tr style="background-color: #f0f0f0;">
                <td style="padding: 10px; border: 1px solid #ddd;"><strong>Location</strong></td>
                <td style="padding: 10px; border: 1px solid #ddd;">${roomData.hotel.address}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #ddd;"><strong>Check-In</strong></td>
                <td style="padding: 10px; border: 1px solid #ddd;">${booking.checkInDate.toDateString()}</td>
              </tr>
              <tr style="background-color: #f0f0f0;">
                <td style="padding: 10px; border: 1px solid #ddd;"><strong>Check-Out</strong></td>
                <td style="padding: 10px; border: 1px solid #ddd;">${booking.checkOutDate.toDateString()}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #ddd;"><strong>Total Amount</strong></td>
                <td style="padding: 10px; border: 1px solid #ddd; color: #27ae60; font-weight: bold;">${process.env.currency || '$'} ${booking.totalPrice}</td>
              </tr>
            </table>
            <p style="color: #666; background-color: #e8f5e9; padding: 15px; border-radius: 5px; border-left: 4px solid #27ae60;">
              ✅ <strong>Status:</strong> Your booking is confirmed! We look forward to welcoming you.
            </p>
            <p style="color: #999; font-size: 12px; margin-top: 20px;">
              If you need to make any changes, please reply to this email or contact us.
            </p>
          </div>
          `,
          headers: {
            'X-Priority': '3',
            'X-Mailer': 'Heavenly Hotels Booking System',
          }
        };
        const result = await transporter.sendMail(mailOptions);
        console.log(`✅ Confirmation email sent to ${req.user.email} for booking ${booking._id}`);
      } else {
        console.warn("⚠️ User email not found, email not sent for booking:", booking._id);
      }
    } catch (emailError) {
      console.error("❌ Error sending confirmation email:", emailError.message);
      // Don't fail the booking if email fails
    }

    res.json({ success: true, message: "Booking created successfully", bookingId: booking._id });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const stripePayment = async (req, res) => {
  try {
    const { bookingId } = req.body;
    const booking = await Booking.findById(bookingId);
    const roomData=await Room.findById(booking.room).populate('hotel');
    const totalPrice=booking.totalPrice;
    const origin = req.headers.origin;

    const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

    
     const line_items= [
        {
          price_data: {
            currency: "usd",
            product_data: { name: roomData.hotel.name,
             },
           unit_amount:totalPrice * 100,
          },
          quantity: 1,
        },
      ]
      const session = await stripeInstance.checkout.sessions.create({
        line_items,
        mode: "payment",
        success_url: `${origin}/my-bookings?stripeStatus=success&bookingId=${bookingId}`,
        cancel_url: `${origin}/my-bookings?stripeStatus=cancelled&bookingId=${bookingId}`,
        metadata: { bookingId },
      });

    res.json({ success: true, url: session.url });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
}

export const confirmBookingPayment = async (req, res) => {
  try {
    const { bookingId } = req.body;
    if (!bookingId) {
      return res.status(400).json({ success: false, message: "bookingId is required" });
    }

    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      {
        isPaid: true,
        paymentMethod: "stripe",
        status: "confirmed",
      },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    res.json({ success: true, message: "Payment confirmed", booking });
  } catch (error) {
    console.error("Confirm booking payment error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking
      .find({ user: req.user._id })
      .populate("room hotel")
      .sort({ createdAt: -1 });
     
    res.json({ success: true, bookings });
  } catch (error) {
    res.json({ success: false, message: "Failed to fetch bookings" });
  }
};

export const getHotelDashboardData = async (req, res) => {
  try {
   const ownerHotel = await Hotel.findOne({ owner: req.user._id });
    if (!ownerHotel) {
  return res.json({
    success: true,
    dashboardData: {
      bookings: [],
      totalBookings: 0,
      totalRevenue: 0,
    },
  });
}
    const bookings = await Booking
      .find({ hotel: ownerHotel._id })
      .populate("room hotel user")
      .sort({ createdAt: -1 });
     
    const totalBookings = bookings.length;
  
    const totalRevenue = bookings.reduce(
  (acc, booking) => acc + booking.totalPrice,
  0
);

    res.json({
      success: true,
      dashboardData: {
        totalBookings,
        totalRevenue,
        bookings,
      },
    });
  } catch (error) {
    res.json({ success: false, message:"Failed to fetch bookings" });
  }
};
