import React from 'react'
import logo from '../assets/Logo.png'

function Logo(width="100px") {
  return (
    <div className='flex items-center text-amber-50 font-["Codystar"] text-3xl '><img src={logo} width="75px" className='mt-2' alt="" /> Cashew AI</div>
  )
}

export default Logo