import React from 'react'
import { assets, exclusiveOffers } from '../assets/assets.js'
import Title from './Title.jsx'

const ExclusiveOffers = () => {
  return (
    <div className="flex flex-col items-center px-6 md:px-16 lg:px-24 xl:px-32 pt-20 pb-30">
      {/* Header section with Title and "View all offers" button */}
      <div className="flex flex-col md:flex-row justify-between items-center w-full">
        <Title 
          align="left" 
          title="Exclusive Offers" 
          subtitle="Take advantage of our limited-time offers and special packages to enhance your stay and created unforgettable memories." 
        />
        <button className=" group flex items-center gap-2 cousor-pointer font-medium max-md:mt-12 ">
          View all offers 
          <img 
            src={assets.arrowIcon} 
            alt="arrow" 
            className="group-hover:translate-x-1 transition-all" 
          />
        </button>
      </div>

      {/* Grid layout for offer cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
        {exclusiveOffers.map((item) => (
          <div 
            key={item._id} 
            className="group relative items-start gap-1 pt-12 md:pt-18 px-4 rounded-xl  bg-cover bg-center bg-cover bg-no-repeat flex flex-col justify-between text-white"
            style={{ 
              backgroundImage: `url(${item.image})` 
            }}
          >
            {/* Discount Badge */}
            <p className="bg-white px-3 py-1 rounded-full text-xs text-gray-800 left-4 absolute top-4 font-medium">
              {item.priceOff}% OFF
            </p>

            {/* Offer Details */}
            <div>
              <p className="text-2xl font-medium font-playfair ">{item.title}</p>
              <p className="text-sm text-gray-200 mb-4">{item.description}</p>
              <p className="text-xs text-white/70 mt-3">Expires {item.expiryDate}</p>
              </div>
              <button className=" font-medium flex items-center gap-2 coursor-pointer mt-4 mb-5">
                View Offer 
                <img src={assets.arrowIcon} alt="add" className="invert group-hover:translate-x-1 transition-all" />
              </button>
            
          </div>
        ))}
      </div>
    </div>
  )
}

export default ExclusiveOffers;