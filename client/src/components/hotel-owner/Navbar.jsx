import React from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../../assets/assets.js'
import { UserButton } from '@clerk/react'

const Navbar = () => {
  return (
    <div className="flex items-center justify-between px-4 md:px-8 py-3 border-b border-gray-300 bg-white transition-all duration-300">
      {/* Logo linking back to the homepage */}
      <Link to="/" onClick={() => window.scrollTo(0, 0)}>
        <img 
          src={assets.logo} 
          className="h-9 opacity-80 invert" 
          alt="logo" 
        />
      </Link>

      {/* Clerk User Button for account management */}
      <UserButton />
    </div>
  )
}

export default Navbar