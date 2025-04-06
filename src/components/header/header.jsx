import React, { useEffect, useState } from 'react'
import { Container, Logo, LogoutBtn, HistoryIcon, HomeIcon } from '../index'
import { Link ,NavLink} from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import authservice from '../../appwrite/auth'

function Header() {
  const authStatus = useSelector((state) => state.auth.status)
  const [userData, setUserData] = useState(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await authservice.getCurrentUser();
        setUserData(user)
        console.log("fetched user data", user)
      } catch (error) {
        console.error("Error fetching user data:", error)
      }
    }
    if (authStatus) {
      fetchUserData()
    }
  }, [authStatus])

  const navItems = [
    { name: 'Home', path: '/', active: true },
    { name: 'History', path: '/history', active: true },
    { name: 'Login', path: '/login', active: !authStatus },
    { name: 'Signup', path: '/signup', active: !authStatus },
  ]

  const navigateAndCloseMenu = (path) => {
    navigate(path)
    setIsMenuOpen(false)
  }

  return (
    <header className='shadow bg-zinc-900'>
      <Container>
        <nav className='flex items-center justify-between py-3 md:py-4 relative'>
          <div className='flex items-center'>
            <Link to='/' className='mr-2 md:mr-4'>
              <Logo width="70px" />
            </Link>
            
            {/* Hide greeting on small screens */}
            <div className='hidden sm:block ml-2 md:ml-8 px-2 md:px-6 py-1 md:py-2 duration-200 text-[#48726b] text-sm md:text-base lg:text-lg font-mono'>
              <p>
                Hello, {authStatus && userData ? userData.name : "Guest"}
              </p>
            </div>
          </div>

           {/* Mobile menu button  */}
          <div className='md:hidden'>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className='p-2 text-neutral-400 hover:text-neutral-300'
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>

          {/* Desktop navigation */}
          <ul className='hidden md:flex md:flex-row md:ml-auto'>
            {navItems.map((item) => (
              item.active && (
                <li key={item.name} className='my-0'>
                  <NavLink
  to={item.path}
  className={({ isActive }) =>
    `inline-block px-4 lg:px-6 py-2 duration-200 text-lg font-mono cursor-pointer ${
      isActive ? 'text-[#48726b]' : 'text-neutral-400 hover:text-neutral-300'
    }`
  }
>
  {item.name === 'History' ? (
    <HistoryIcon />
  ) : item.name === 'Home' ? (
    <HomeIcon />
  ) : (
    item.name
  )}
</NavLink>

                </li>
              )
            ))}
            {authStatus && (
              <li><LogoutBtn /></li>
            )}
          </ul>
          
          {/* Mobile dropdown menu */}
          {isMenuOpen && (
            <div className='absolute top-full right-0 mt-1 bg-zinc-950 rounded-md shadow-lg z-10 min-w-48 w-64 overflow-hidden md:hidden border border-zinc-800'>
              {/* Show greeting at top of mobile menu when hidden in header */}
              <div className='sm:hidden px-4 py-3 border-b border-zinc-800 text-[#48726b] font-mono'>
                Hello, {authStatus && userData ? userData.name : "Guest"}
              </div>
              <ul className='py-2'>
                {navItems.map((item) => (
                  item.active && (
                    <li key={item.name}>
                      <button 
                        className='w-full text-left px-4 py-3 duration-200 text-neutral-300 text-base font-mono hover:text-white hover:bg-zinc-800 flex items-center'
                        onClick={() => navigateAndCloseMenu(item.path)}
                      >
                        {item.name === 'History' ? (
                          <><HistoryIcon /><span className='ml-3'>History</span></>
                        ) : item.name === 'Home' ? (
                          <><HomeIcon /><span className='ml-3'>Home</span></>
                        ) : (
                          item.name
                        )}
                      </button>
                    </li>
                  )
                ))}
                {authStatus && (
                  <li className='border-t border-zinc-800 mt-1 pt-1'>
                    <div className='px-4 py-2'><LogoutBtn /></div>
                  </li>
                )}
              </ul>
            </div>
          )}
        </nav>
      </Container>
    </header>
  )
}

export default Header