import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div className="flex items-center justify-between gap-4 py-6 mt-20 border-t border-gray-500/40">

      {/* Logo */}
      <div className="flex items-center gap-2">
        <img 
          src={assets.logo} 
          alt="logo" 
          width={150}
          className="dark:invert"
        />
      </div>

      {/* Copyright */}
      <p className="flex-1 border-l border-gray-400 pl-4 text-sm 
         text-gray-700 dark:text-gray-300 max-sm:hidden">
        © Copyright ©Saurabh | All rights reserved
      </p>

      {/* Social Icons */}
      <div className="flex gap-3">
        <img 
          className="w-[32px] cursor-pointer hover:scale-110 transition dark:invert" 
          src={assets.facebook_icon} 
          alt="facebook"
        />
        <img 
          className="w-[32px] cursor-pointer hover:scale-110 transition dark:invert" 
          src={assets.twitter_icon} 
          alt="twitter"
        />
        <img 
          className="w-[32px] cursor-pointer hover:scale-110 transition dark:invert" 
          src={assets.instagram_icon} 
          alt="instagram"
        />
      </div>

    </div>
  )
}

export default Footer
