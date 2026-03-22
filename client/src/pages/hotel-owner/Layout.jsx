import React, { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../../components/hotel-owner/Navbar.jsx'
import Sidebar from '../../components/hotel-owner/Sidebar.jsx'
import { useAppContext } from '../../context/AppContext.jsx'

const Layout = () => {
  const { isOwner, navigate } = useAppContext()

  useEffect(() => {
    if (!isOwner) navigate('/')
  }, [isOwner, navigate])
// 
  return isOwner &&  (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex h-full">
        <Sidebar />
        <div className="flex-1 p-4 pt-10 md:px-10 h-full">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default Layout