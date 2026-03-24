import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppContext } from "../context/AppContext.jsx";
import toast from "react-hot-toast";
import StarRating from "../components/Star-rating.jsx";
import {
  assets,
  facilityIcons,
  roomCommonData,
 
} from "../assets/assets.js";

const RoomDetails = () => {
  const { id } = useParams();
  const { rooms, axios, getToken, navigate } = useAppContext();
  const [room, setRoom] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [guests, setguests] = useState(1);
  const [isAvailable, setIsAvailable] = useState(false);

  useEffect(() => {
    const room = rooms.find((room) => room._id === id);
    room && setRoom(room);
    room && setMainImage(room.images[0]);
  }, [rooms]);

 const onCheckAvailability = async () => {
  try {
    if (checkInDate >= checkOutDate) {
      toast.error('Check-In Date should be less than check-out Date');
      return;
    }

    const token = await getToken(); // ✅ ADD THIS

    const { data } = await axios.post(
      "/api/bookings/check-availability",
      {
        room: id,
        checkInDate,
        checkOutDate,
      },
      {
        headers: { Authorization: `Bearer ${token}` }, // ✅ ADD THIS
      }
    );

    if (data.success) {
      if (data.isAvailable) {
        setIsAvailable(true);
        toast.success("Room is available!");
      } else {
        setIsAvailable(false);
        toast.error("Room is not available.");
      }
    } else {
      toast.error(data.message);
    }
  } catch (err) {
    toast.error(err.message);
  }
};

  const onSubmitHandler = async (e) => {
    
    e.preventDefault();

    if (!checkInDate || !checkOutDate) {
    toast.error("Please select check-in and check-out dates");
    return;
  }
    try {
      
      if(!isAvailable){
        return onCheckAvailability();
      }else{
 const token = await getToken();
      const { data } = await axios.post(
        "/api/bookings/book",
        { room: id,checkInDate,checkOutDate,guests,paymentMethod:"Pay At Hotel"},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      
     
      if (data.success) {
        toast.success(data.message);
        setTimeout(()=>{

       
        navigate("/my-bookings");
        window.scrollTo(0,0) },1000)
      }else{
        toast.error(data.message);
      }
    }
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    room && (
      <div className="py-28 md:py-35 px-4 md:px-16 lg:px-24 xl:px-32">
        {/* room detail  */}
        <div className="flex flex-col md:flex-row items-start md:items-start gap-2">
          <h1 className="text-3xl font-playfair md:text-4xl">
            {room.hotel.name}{" "}
            <span className="text-sm font-inter ">({room.roomType})</span>
          </h1>
          <p className="text-xs font-inter py-1.5 px-3 text-white bg-orange-500 rounded-full">
            20% OFF
          </p>
        </div>
        {/* room rating  */}
        <div className="flex items-center gap-1 mt-2">
          <StarRating />
          <p className="ml-2">200+ reviews</p>
        </div>
        {/* room address  */}
        <div className="flex items-center gap-1 text-gray-500 mt-2">
          <img src={assets.locationIcon} alt="location icon" />
          <span>{room.hotel.address}</span>
        </div>

        {/* room images  */}
        <div className="flex flex-col lg:flex-row mt-6 gap-6">
          <div className="lg:w-1/2 w-full">
            <img
              src={mainImage}
              className="w-full  object-cover rounded-xl "
              alt=""
            />
          </div>
          <div className="grid grid-cols-2 gap-4 lg:w-1/2 w-full">
            {room?.images.length > 1 &&
              room.images.map((image, index) => (
                <img
                  key={index}
                  onClick={() => setMainImage(image)}
                  src={image}
                  className={` w-full object-cover rounded-xl shadow-md cursor-pointer ${mainImage === image && "outline-3 outline-orange-500"}`}
                  alt="Room image"
                />
              ))}
          </div>
        </div>

        {/* room highlight  */}
        <div className="flex flex-col md:flex-row md:justify-between mt-10">
          <div className="flex flex-col">
            <h1 className="text-3xl md:text-4xl font-playfair">
              Experience Luxury Like Never Before
            </h1>
            <div className="flex flex-wrap items-center mt-3 mb-6 gap-4">
              {room.amenities.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100"
                >
                  <img
                   src={facilityIcons[item]}
                    alt={item}
                    className="w-5 h-5"
                  />
                  <p className="text-xs">{item}</p>
                </div>
              ))}
            </div>
          </div>
          {/* room price  */}
          <p className="text-2xl font-medium">${room.pricePerNight}/Night</p>
        </div>
        {/* checkIn checkOut form  */}
        <form onSubmit={onSubmitHandler} className="flex flex-col md:flex-row items-start md:items-center justify-between bg-white shadow-[0px_0px_20px_rgba(0,0,0,0.15)] p-6 rounded-xl mx-auto mt-16 max-w-6xl">
          <div className="flex flex-col flex-wrap md:flex-row items-start md:items-center gap-4 md:gap-10 text-gray-500">
            <div className="flex flex-col">
              <label htmlFor="checkInDate" className="font-medium">
                Check-In
              </label>
              <input onChange={(e)=>setCheckInDate(e.target.value)} min={new Date().toISOString().split('T')[0]} 
                type="date"
                id="checkInDate"
                placeholder="Check-In"
                className="w-full rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none"
                required
              />
            </div>
            <div className="w-px h-15 bg-gray-300/70 max-md:hidden"></div>
            <div className="flex flex-col">
              <label htmlFor="checkOutDate" className="font-medium">
                Check-Out
              </label>
              <input onChange={(e)=>setCheckOutDate(e.target.value)} min={checkInDate} disabled={!checkInDate}
                type="date"
                id="checkOutDate"
                placeholder="Check-Out"
                className="w-full rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none"
                required
              />
            </div>

            <div className="w-px h-15 bg-gray-300/70 max-md:hidden"></div>

            <div className="flex flex-col">
              <label htmlFor="guests" className="font-medium">
                Guests
              </label>
              <input onChange={(e)=>setguests(e.target.value)} value={guests}
                type="number"
                id="guests"
                placeholder="1"
                className="max-w-20 rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none"
                required
              />
            </div>
          </div>

          <button type="submit" className="bg-primary hover:bg-primary-dull active:scale-95 transition-all text-white rounded-md max-md:w-full max-md:mt-6 md:px-25 py-3 md:py-4 text-base cursor-pointer">
            {isAvailable ? "Book Now " : "Check Availability"}
          </button>
        </form>

        {/* common specification  */}
        <div className="mt-25 space-y-4">
          {roomCommonData.map((spec, index) => (
            <div key={index} className="flex items-start gap-2">
              <img
                src={spec.icon}
                alt={`${spec.title}-icon`}
                className="w-6.5"
              />
              <div>
                <p className="text-base">{spec.title}</p>
                <p className="text-gray-500">{spec.description}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="max-w-3xl border-y border-gray-300 my-15 py-10 text-gray-500">
          <p>
            Guests will be allocated on the ground floor according to
            availability. You get comfortable Two bedroom apartment has a true
            city feeling. The price quoted is for two guest, at the guest slot
            please mark the number of guest to get the exact price for group.
            The Guests will be allocated ground floor according to
            availability.You get the comfortable two bedroom apartement that
            haas true city feeling.
          </p>
        </div>

        {/* Hosted by  */}

        <div className="flex flex-col items-start gap-4">
          {/* <div className="flex gap-4"> */}
            {/* <img
              src={room.hotel.owner.image}
              alt="host"
              className="h-14 w-14 md:h-18 md:w-18 rounded-full"
            /> */}
          
          <div>
            <p className="text-lg md:text-xl">Hosted By {room.hotel.name}</p>
            <div className="flex items-center mt-1">
              <StarRating />
              <p className="ml-2">200+ reviews</p>
            </div>
          </div>
        {/* </div> */}
        <button className="px-6 py-2.5 mt-4 rounded text-white bg-primary hover:bg-primary-dull transition-all cursor-pointer">Contact Now</button>
        </div>
      </div>
    )
  );
};

export default RoomDetails;
