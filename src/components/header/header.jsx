import React, { useEffect ,useState} from 'react'
import {Container,Logo,LogoutBtn} from '../index'
import {Link} from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import authservice from '../../appwrite/auth'

function Header() {
  const authStatus = useSelector((state) => state.auth.status)
  const [userData, setUserData] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await authservice.getCurrentUser();
        setUserData(user)
        console.log("fetched user data",user)
      } catch (error) {
        console.error("Error fetching user data:", error)
      }
    }
      if(authStatus){
        fetchUserData()
      }
    },[authStatus])


const navItems = [
  {name: 'Home', path: '/',active:true},
  {name: 'Login', path: '/login',active:!authStatus},
  {name: 'Signup', path: '/signup',active:!authStatus},
  {name: 'History', path: '/history',active:authStatus},
  {name: 'Share', path: '/share',active:authStatus}
]

   return (
   <header className='shadow bg-zinc-900'>
    <Container>
      <nav className=' flex items-center'>
        <div className=' mr-4'>
          <Link to='/'>
          <Logo width="70px" />
          </Link>
        </div>

        {authStatus && userData && (
            <div className=' ml-8 inline-block px-6 py-2 duration-200 text-[#48726b] text-lg font-mono  '>
              <p>Hello, {userData.name}</p>
            </div>
          )}

        <ul className='flex ml-auto'>
          {navItems.map((item) => (
            item.active && (
              <li key={item.name} >
                <button className='inline-block px-6 py-2 duration-200 text-neutral-400 text-lg font-mono hover:text-neutral-300 cursor-pointer' onClick={() => navigate(item.path)}>{item.name}</button>
              </li>
            )
          ))}
            { authStatus && (
              <li><LogoutBtn/></li>
             )}
        </ul>
      </nav>
    </Container>
   </header>
  )
}

export default Header