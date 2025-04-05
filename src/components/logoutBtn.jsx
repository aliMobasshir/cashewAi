import React from 'react'
import { useDispatch } from 'react-redux'
import authservice from '../appwrite/auth'
import { logout } from '../store/authslice'

function LogoutBtn() {
    const dispatch = useDispatch()
    const logoutHandler = () => {
    authservice.logout().then(() => {
        dispatch(logout())
    })}
  return(
   <button className='inline-block px-6 py-2 duration-200 text-neutral-400 text-lg font-mono hover:text-neutral-300 cursor-pointer'
   onClick={logoutHandler}>Logout</button>
  )
}

export default LogoutBtn