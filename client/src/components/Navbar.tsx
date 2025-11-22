import { bricolage_grotesque } from '@/lib/font'
import React from 'react'

function Navbar() {
  return (
    <div className="flex px-4 sm:px-8 py-6">
      <div className="">
        <h1 className={` text-lg sm:text-xl md:text-xl font-bold ${bricolage_grotesque}`}>HushHub</h1>
      </div>

    </div>
  )
}

export default Navbar
