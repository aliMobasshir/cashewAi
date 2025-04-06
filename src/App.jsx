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

    // Viewport height fix
    const setVh = () => {
      const vh = window.innerHeight * 0.01
      document.documentElement.style.setProperty('--vh', `${vh}px`)
    }

    setVh()
    window.addEventListener('resize', setVh)
    window.addEventListener('orientationchange', setVh)

    return () => {
      window.removeEventListener('resize', setVh)
      window.removeEventListener('orientationchange', setVh)
    }
  }, [])

  return !loading ? (
    <div className='min-h-[calc(var(--vh)_*_100)] flex flex-wrap content-between bg-zinc-900'>
      <div className='w-full block'>
        <Header />
        <Outlet />
      </div>
    </div>
  ) : null
}

export default App
