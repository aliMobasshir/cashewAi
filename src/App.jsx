import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import authservice from './appwrite/auth'
import { login, logout } from './store/authslice'
import { Header } from './components'
import { Outlet } from 'react-router-dom'


function App() {
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()

  useEffect(() => {
    authservice.getCurrentUser()
      .then((userData) => {
        if (userData) {
          dispatch(login(userData))
        } else {
          dispatch(logout())
        }
      })
      .finally(() => setLoading(false))
  }
    , [])

  return !loading ? (
    <div className='min-h-screen flex flex-wrap content-between bg-zinc-900'>
      <div className='w-full block'>
        <Header />
       <Outlet />
      </div>
    </div>) : null
}

export default App
