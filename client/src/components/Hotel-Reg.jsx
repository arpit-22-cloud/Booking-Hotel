import React, { useState } from "react";
import { assets, cities } from "../assets/assets.js";
import { useAppContext } from "../context/AppContext.jsx";
import toast from "react-hot-toast";

const HotelReg = () => {
  const { setShowHotelRegistration, axios, getToken, setIsOwner } = useAppContext()
  // 
  const [name ,setName]=useState("")
  const [address ,setAddress]=useState("")
  const [contact ,setContact]=useState("")
  const [city ,setCity]=useState("")

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    console.log('form submited')

    try {
      
        // console.log(" submitted")
      const token = await getToken()
      //  console.log("TOKEN:", token)
      const { data } = await axios.post('/api/hotels/', {name,contact,address,city}, {
        headers: { Authorization: `Bearer ${ token}` }
      })
      console.log("response :" ,data)
      // console.log("DATA:", data)
      if (data.success) {
        toast.success(data.message)
        setIsOwner(true)
        setShowHotelRegistration(false)
      }else{
toast.error
(data.message)      }
    } catch (err) { toast.error(err.message) }
  }

  return (
    <div onClick={()=>setShowHotelRegistration(false)} className="fixed top-0 bg-black/70 z-100 bottom-0 flex items-center justify-center p-4 left-0 right-0">
      <form
        
        onSubmit={onSubmitHandler}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-xl flex max-w-4xl max-md:mx-2 "
      >
        <img
          src={assets.regImage}
          className="w-1/2 rounded-xl hidden md:block"
          alt=""
        />
        <div className="relative flex flex-col items-center md:w-1/2 p-8 md:p-10">
          <img
            onClick={() => setShowHotelRegistration(false)}
            src={assets.closeIcon}
            className="absolute top-4 right-4 h-4 w-4 cursor-pointer"
            alt="close"
          />
          <p className="text-2xl font-semibold mt-6">Register Your Hotel</p>
          {/* <div className="space-y-4"> */}
          <div className="w-full mt-4">
            <label htmlFor="name" className="text-gray-500 font-medium">
              Hotel Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Type Here"
              required
              onChange={(e) =>
                setName(e.target.value )

              } value={name}
              className="w-full border border-gray-200 rounded  px-3 py-2.5 mt-1 outline-indigo-500 font-light"
            />
          </div>
          {/* Phone  */}
          <div className="w-full mt-4">
            <label htmlFor="contact" className="text-gray-500 font-medium">
              {" "}
              Phone
            </label>
            <input
              id="contact"
              type="text"
              placeholder="Type Here"
              required
              onChange={(e) =>
                setContact(e.target.value )

              } value={contact}
              className="w-full border border-gray-200 rounded  px-3 py-2.5 mt-1 outline-indigo-500 font-light"
            />
          </div>
          {/* Address  */}
          <div className="w-full mt-4">
            <label htmlFor="address" className="text-gray-500 font-medium">
              {" "}
              Address
            </label>
            <input
              id="address"
              type="text"
              placeholder="Type Here"
              required
               onChange={(e) =>
                setAddress(e.target.value )

              } value={address}
              className="w-full border border-gray-200 rounded  px-3 py-2.5 mt-1 outline-indigo-500 font-light"
            />
          </div>
          {/* Select city drop down  */}
          <div className="w-full mt-4 max-w-60 mr-auto">
            <label htmlFor="city" className="font-medium text-gray-500">
              City
            </label>
            <select  onChange={(e) =>
                setCity(e.target.value )

              } value={city}
              id="city"
              className="border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light "
              required
            >
              <option value="">Select City</option>
              {cities.map((city) => (
                <option value={city} key={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
          <button type="submit"  className="bg-indigo-500 hover:bg-indigo-600 transition-all text-white mr-auto px-6 py-2 rounded cursor-pointer mt-6">Register</button>

        
        </div>
      </form>
    </div>
  );
};

export default HotelReg;
