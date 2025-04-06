import React from 'react'
import logo from '../assets/Logo.png'

function Logo({width="100px"}) {
  return (
    <div className='flex items-center gap-1 text-amber-50 font-["Codystar"] [font-size:clamp(1.2rem,3vw,2rem)] whitespace-nowrap'>
      <img src={logo} style={{width: width}} className='mt-2 min-w-[40px] w-[75px] md:w-[75px]' alt="Logo" />
      Cashew AI
    </div>
  )
}

export default Logo