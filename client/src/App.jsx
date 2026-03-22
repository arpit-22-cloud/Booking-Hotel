import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import AllRooms from './pages/All-rooms.jsx'
import RoomDetails from './pages/Room-details.jsx'
import MyBookings from './pages/My-booking.jsx'
import HotelReg from './components/Hotel-Reg.jsx'
import Layout from './pages/hotel-owner/Layout.jsx'
import Dashboard from './pages/hotel-owner/Dashboard.jsx'
import AddRoom from './pages/hotel-owner/Add-room.jsx'
import ListRoom from './pages/hotel-owner/List-room.jsx'
import Loader from './components/Loader.jsx'
import { Toaster } from 'react-hot-toast'
import { useAppContext } from './context/AppContext'

const App = () => {

  const location = useLocation()
  const { showHotelRegistration } = useAppContext()

  // Logic to determine if the current path belongs to the hotel owner dashboard [3, 4]
  const isOwnerPath = location.pathname.includes('owner')

  return (
    <div className='min-h-screen bg-white'>
      {/* Toast notification container for global alerts [5] */}
      <Toaster />
   {/* The Navbar is hidden when navigating within the owner's dashboard [3, 4] */}
      {!isOwnerPath && <Navbar />}
      {/* Conditionally render the Hotel Registration popup based on context state [6, 7] */}
      {showHotelRegistration && <HotelReg />}

   

      <div className="min-h-[70vh]">
        <Routes>
          {/* Publicly accessible routes  */}
          <Route path='/' element={<Home />} />
          <Route path='/rooms' element={<AllRooms />} />
          <Route path='/rooms/:id' element={<RoomDetails />} />
          <Route path='/my-bookings' element={<MyBookings />} />
          <Route path='/loader/:nextURL' element={<Loader />} />

          {/* Protected Hotel Owner Dashboard routes with nested layouts [14-17] */}
          <Route path='/owner' element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path='add-room' element={<AddRoom />} />
            <Route path='list-room' element={<ListRoom />} />
          </Route>
        </Routes>
      </div>

      {/* The Footer is displayed outside of Routes to appear on all pages [18] */}
      <Footer />
    </div>
  )
}

export default App
