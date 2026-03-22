import React from "react";
import { assets } from "../assets/assets.js";
import { Link } from "react-router-dom";

const HotelCard = ({ room, index }) => {
  return (
    <Link
      to={"/rooms/" + room._id}
      onClick={() => scrollTo(0, 0)}
      key={room._id}
      className="relative max-w-70 w-full rounded-xl overflow-hidden bg-white text-gray-500/90 shadow-[0px_4px_4px_rgba(0,0,0,0.05)"
    >
      <img src={room.images[0]} alt="hotel" />
      {index % 2 === 0 && (
        <p className="absolute top-3 left-3 bg-white text-gray-800 text-black text-xs px-3 py-1 rounded-full font-medium">
          Best Seller
        </p>
      )}

      <div className="pt-5 p-4">
        <div className="flex justify-between items-center ">
          <p className="font-playfair text-xl font-medium text-gray-800">
            {room.hotel.name}
          </p>
          <div className="flex items-center gap-1 ">
            <img src={assets.starIconFilled} alt="star" />
            4.5
          </div>
        </div>
        <div className="flex items-center gap-1 text-sm">
          <img src={assets.locationIcon} alt="loc" />
          <span>{room.hotel.address}</span>
        </div>
        <div className="flex items-center justify-between mt-4">
          <p>
            <span className="text-xl text-gray-800">${room.pricePerNight}</span>
            / night
          </p>
          <button className="border-gray-300  hover:bg-gray-50  px-4 py-2 rounded text-sm font-medium border  cursor-pointer transition-all">
            Book Now
          </button>
        </div>
      </div>
    </Link>
  );
};

export default HotelCard;
