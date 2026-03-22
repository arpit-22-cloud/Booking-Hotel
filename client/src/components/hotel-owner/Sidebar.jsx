import React from 'react'
import { NavLink } from 'react-router-dom'
import { assets } from '../../assets/assets.js'

const Sidebar = () => {
  const sidebarLinks = [
    { name: 'Dashboard', path: '/owner', icon: assets.dashboardIcon },
    { name: 'Add Room', path: '/owner/add-room', icon: assets.addIcon },
    { name: 'List Room', path: '/owner/list-room', icon: assets.listIcon },
  ]

  return (
    <div className="md:w-64 w-16 h-full border-r text-base border-gray-300 pt-4 transition-all duration-300 flex flex-col ">
      {sidebarLinks.map((item, index) => (
        <NavLink
          key={index}
          to={item.path}
          end={'/owner'}
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 md:px-8 ${
              isActive ? 'md:border-r-[6px] bg-vlue-600/10 border-blue-600  text-blue-600' : 'text-gray-700 border-white hover:bg-gray-100/90'
            }`
          }
        >
          <img src={item.icon} alt={item.name} className="min-w-5 min-h-5" />
          <p className="md:block hidden text-center">{item.name}</p>
        </NavLink>
      ))}
    </div>
  )
}

export default Sidebar