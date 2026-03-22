import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext.jsx";
import Title from "../components/Title.jsx";
import { assets } from "../assets/assets.js";
import toast from "react-hot-toast";

const MyBookings = () => {
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

  // const handlePayment = async (bookingId) => {
  //   try {
  //     const token = await getToken()
  //     const { data } = await axios.post('/api/bookings/stripe-payment', { bookingId }, { headers: { Authorization: `Bearer ${token}` } })
  //     if (data.success) window.location.href = data.url
  //   } catch (err) { console.log(err.message) }
  // }

  useEffect(() => { if (user) fetchBookings() }, [user])

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
                src={booking.room.images[0]}
                alt="hotel-img"
                className="min-md:w-44 rounded shadow object-cover"
              />
              <div className="flex flex-col gap-1.5 max-md:mt-3 min-md:ml-4">
                <p className="font-playfair text-2xl">
                  {booking.hotel.name}
                  <span className="font-inter text-sm"> ({booking.room.roomType})</span>
                </p>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <img src={assets.locationIcon} alt="loc-icon" />
                  <span>{booking.hotel.address}</span>
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
            <button className="px-4 py-1.5 mt-4 text-xs border border-gray-400 rounded-full hover:bg-gray-50 transition-all cursor-pointer">
              Pay Now
            </button>
          )}

         </div>
         
          </div>
        ))}
      </div>
      {/* <div className="space-y-6">
        {bookings.map((booking, idx) => (
          <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center border rounded-xl p-6 bg-white">
            <div className="flex gap-4">
              <img src={booking.room.images} className="h-20 w-28 rounded-lg object-cover" alt="" />
              <div>
                <p className="font-bold text-lg">{booking.hotel.name}</p>
                <p className="text-sm text-gray-500">{booking.room.roomType}</p>
              </div>
            </div>
            <div className="text-sm space-y-1">
              <p><span className="text-gray-400">In:</span> {new Date(booking.checkin).toDateString()}</p>
              <p><span className="text-gray-400">Out:</span> {new Date(booking.checkout).toDateString()}</p>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${booking.isPaid ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <p className={booking.isPaid ? 'text-green-600' : 'text-red-600'}>{booking.isPaid ? 'Paid' : 'Unpaid'}</p>
              </div>
              {!booking.isPaid && <button onClick={() => handlePayment(booking.id)} className="bg-primary text-white px-6 py-2 rounded-lg text-sm">Pay Now</button>}
            </div>
          </div>
        ))}
      </div> */}
    </div>
  );
};

export default MyBookings;
