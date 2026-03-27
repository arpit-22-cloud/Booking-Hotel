import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAppContext } from "../context/AppContext.jsx";
import Title from "../components/Title.jsx";
import { assets } from "../assets/assets.js";
import toast from "react-hot-toast";

const MyBookings = () => {
  const location = useLocation();
  const { axios, getToken, user } = useAppContext();
  const [bookings, setBookings] = useState([]);

  const fetchBookings = async () => {
    try {
      const token = await getToken()
      const { data } = await axios.get('/api/bookings/user', { headers: { Authorization: `Bearer ${token}` } })
      if (data.success){
         setBookings(data.bookings)
    }
  else{
    toast.error(data.message)
  } 
}catch (error) { 
    toast.error(error.message)

   }
  
}

  const handlePayment = async (bookingId) => {
    try {
      const token = await getToken()
      const { data } = await axios.post('/api/bookings/stripe-payment', { bookingId }, { headers: { Authorization: `Bearer ${token}` } })
      if (data.success) {
        // optimistic local update for UX before redirect
        setBookings((prev) =>
          prev.map((booking) =>
            booking._id === bookingId
              ? { ...booking, isPaid: true, paymentMethod: 'stripe' }
              : booking
          )
        );

        window.location.href = data.url;
      } else {
        toast.error(data.message);
      }
   }catch (error) { toast.error(error.message) 

   }
  }

  useEffect(() => {
    if (!user) return;

    const stripeParams = new URLSearchParams(location.search);
    const stripeStatus = stripeParams.get("stripeStatus");
    const paymentBookingId = stripeParams.get("bookingId");

    const applyStripeResult = async () => {
      if (stripeStatus === "success" && paymentBookingId) {
        try {
          const token = await getToken();
          const { data } = await axios.post(
            "/api/bookings/confirm-payment",
            { bookingId: paymentBookingId },
            { headers: { Authorization: `Bearer ${token}` } }
          );

          if (data.success) {
            toast.success("Payment confirmed, updating booking status");
            setBookings((prev) =>
              prev.map((booking) =>
                booking._id === paymentBookingId
                  ? { ...booking, isPaid: true, paymentMethod: "stripe" }
                  : booking
              )
            );
          } else {
            toast.error(data.message);
          }
        } catch (error) {
          toast.error(error.response?.data?.message || error.message);
        } finally {
          // remove query from URL to avoid loops
          window.history.replaceState(null, "", "/my-bookings");
        }
      }

      await fetchBookings();
    };

    applyStripeResult();
  }, [user, location.search]);

  return (
    <div className="py-28 md:pb-35 md:pt-32 px-4 md:px-16 lg:px-24 xl:px-32">
      <Title
        title="My Bookings"
        align="left"
        subtitle="Easliy manage your past, current, and upcoming hotel reservation in one place. Plan your trip seamlessly with just a few click"
      />
      <div className="max-w-6xl mt-8 w-full text-gray-800">
        <div className="hidden md:grid md:grid-cols-[3fr_2fr_1fr] w-full border-gray-300 gap-4 border-b font-medium py-3 text-base">
          <div className="w-1/3">Hotels</div>
          <div className="w-1/3">Date & Timings</div>
          <div className="w-1/3">Payment</div>
        </div>

        {bookings.map((booking) => (
          <div
            key={booking._id}
            className="grid grid-cols-1 md:grid-cols-[3fr_2fr_1fr] w-full border-b border-gray-300 py-6 first:border-t"
          >
            {/* hotel da=etail  */}
            <div className="flex flex-col md:flex-row">
              <img
                src={booking.room?.images?.[0] || "/fallback.jpg"}
                alt="hotel-img"
                className="min-md:w-44 rounded shadow object-cover"
              />
              <div className="flex flex-col gap-1.5 max-md:mt-3 min-md:ml-4">
                <p className="font-playfair text-2xl">
                  {booking.hotel?.name}
                  <span className="font-inter text-sm"> ({booking.room.roomType||"N/A"})</span>
                </p>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <img src={assets.locationIcon} alt="loc-icon" />
                  <span>{booking.hotel.address||"N/A"}</span>
                </div>

                 <div className="flex items-center gap-1 text-sm text-gray-500">
                  <img src={assets.guestsIcon} alt="loc-icon" />
                  <span>Guests: {booking.guests}</span>
                </div>
                <p className="text-base">Total: ${booking.totalPrice}</p>
              </div>
            </div>
            {/* Date & Timing  */}
            <div className="flex flex-row md:items-center md:gap-12 mt-3 gap-8">
              <div>
                <p>Check-In:</p>
                <p className="text-gray-500 text-sm">
                  {new Date (booking.checkInDate).toDateString()}
                </p>
              </div>
              <div>
                <p>Check-Out:</p>
                <p className="text-gray-500 text-sm">
                  {new Date (booking.checkOutDate).toDateString()}
                </p>
              </div>
            </div>
         
         {/* Payment Status  */}
         <div className="flex flex-col items-start justify-center pt-3">
          <div className="flex items-center gap-2">
            <div className={`h-2 w-2 rounded-full ${booking.isPaid ? "bg-green-500": "bg-red-500"}`}></div>
            <p className={`text-sm ${booking.isPaid ?"text-green-500":"text-red-500"}`}>
              {booking.isPaid ?"Paid" :"UnPaid"}
            </p>
          </div>
          {!booking.isPaid && (
            <button onClick={()=>handlePayment(booking._id)} className="px-4 py-1.5 mt-4 text-xs border border-gray-400 rounded-full hover:bg-gray-50 transition-all cursor-pointer">
              Pay Now
            </button>
          )}

         </div>
         
          </div>
        ))}
      </div>
      
    </div>
  );
};

export default MyBookings;
