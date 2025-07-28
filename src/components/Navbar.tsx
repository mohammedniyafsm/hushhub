import { bricolage_grotesque } from '@/lib/font'
import React from 'react'

function Navbar() {
  return (
    <div className="flex px-8 py-6">
      <div className="">
        <h1 className={`text-3xl font-bold ${bricolage_grotesque}`}>HushHub</h1>
      </div>

    </div>
  )
}

export default Navbar
