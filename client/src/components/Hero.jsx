import React, { useState } from 'react'
import { assets } from '../assets/assets.js'
import { useAppContext } from '../context/AppContext'

const Hero = () => {
  // State to manage the user's city input
  const [destination, setDestination] = useState('')
  
  // Destructuring necessary functions and data from the global AppContext
  const { navigate, axios, cities,getToken, setSearchedCities } = useAppContext()

  // Function to handle the search form submission
  const onSearch = async (e) => {
    e.preventDefault()
    
    // Redirect the user to the rooms page with the destination as a query parameter
    navigate(`/rooms?destination=${destination}`)

    // Logic to save the recent search to the database and global state
    try {
      const token = await getToken()
      await axios.post('/api/user/store-recent-search', { recentSearchCity: destination }, {
        headers: { Authorization: `Bearer ${token}` }
      })

      // Update local context to show recommended hotels immediately upon return to Home
      setSearchedCities(prevSearchCities => {
        const updatedSearchCities = [...prevSearchCities, destination]
        if (updatedSearchCities.length > 3){
           updatedSearchCities.shift() // Limit search history to 3 cities
        }
        return updatedSearchCities
      })
    } catch (error) {
      console.log(error.message)
    }
  }

  return (
    <div className=" flex flex-col items-start justify-center text-white px-6 md:px-16 lg:px-24 xl:px-32 bg-[url('/src/assets/heroImage.png')] bg-no-repeat bg-cover bg-center h-screen">
      {/* Small Badge Text */}
      <p className="bg-[#49B9FF] px-3.5 py-1 rounded-full mt-20">
        The Ultimate Hotel Experience
      </p>

      {/* Main Heading */}
      <h1 className=" font-playfair text-2xl md:text-5xl md:text-5xl md:text-[56px] md:leading-[56px] font-bold md:font-extrabold max-w-xl mt-4 mb-6 ">
        Discover Your Perfect Gateway Destination
      </h1>

      {/* Description Text */}
      <p className="text-sm md:text-base mt-2 max-w-130">
        Unparalleled luxury and comfort await at the world's most exclusive hotels and resorts Start your journey today.
      </p>

      {/* Booking/Search Form */}
     <form onSubmit={onSearch} className='bg-white text-gray-500 rounded-lg px-6 py-4 mt-8 flex flex-col md:flex-row max-md:items-start gap-4 max-md:mx-auto'>

            <div>
                <div className='flex items-center gap-2'>
                   <img src={assets.calenderIcon} alt="" className='h-4' />
                    <label htmlFor="destinationInput">Destination</label>
                </div>
                <input onChange={e=>setDestination(e.target.value)} value={destination} list='destinations' id="destinationInput" type="text" className=" rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none" placeholder="Type here" required />
                <datalist id='destinations'>
                  {cities.map((city,index)=>(
                    <option value= {city} key={index}/>
                  ))}
                </datalist>
            </div>

            <div>
                <div className='flex items-center gap-2'>
                   <img src={assets.calenderIcon} alt="" className='h-4' />
                    <label htmlFor="checkIn">Check in</label>
                </div>
                <input id="checkIn" type="date" className=" rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none" />
            </div>

            <div>
                <div className='flex items-center gap-2'>
                    <img src={assets.calenderIcon} alt="" className='h-4' />
                    <label htmlFor="checkOut">Check out</label>
                </div>
                <input id="checkOut" type="date" className=" rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none" />
            </div>

            <div className='flex md:flex-col max-md:gap-2 max-md:items-center'>
                <label htmlFor="guests">Guests</label>
                <input min={1} max={4} id="guests" type="number" className=" rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none  max-w-16" placeholder="0" />
            </div>

            <button className='flex items-center justify-center gap-1 rounded-md bg-black py-3 px-4 text-white my-auto cursor-pointer max-md:w-full max-md:py-1' >
                <img src={assets.searchIcon} alt="SearcIcon" className='h-7' />
                <span>Search</span>
            </button>
        </form>
    </div>
  )
}

export default Hero