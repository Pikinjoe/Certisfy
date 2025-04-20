import { useState, useEffect } from 'react'
import { FaShoppingCart } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext'

const Navlink = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    if (user) {
      fetch(`http://localhost:8000/api/carts?userId=${user.id}`).then((res) => res.json()).then((data) => {
        setCartCount(data.length)
      }).catch((error) => {
        console.error('Error fetching cart:', error)
        setCartCount(0)
      })
    }
  }, [user])

  useEffect(() => {
    if (user) {
      setTitle(user && user.username ? `Welcome, ${user.username}!` : 'Welcome!')
      const timer = setTimeout(() => {
        setTitle('Certisfy')
      }, 5000)

      return () => clearTimeout(timer)
    } else {
      setTitle('Certisfy')
    }
  }, [user])

  return (
    <div className='bg-primary sticky top-0 w-full z-50'>
        <div className='flex mx-4 justify-between items-center p-4 sm:w-4/6 sm:mx-auto'>
            <FaUser className='size-6 text-white cursor-pointer' onClick={() => navigate('/profile')} />
           <NavLink to='/dashboard' >
             <h2 className='text-white font-semibold'>{title}</h2>
           </NavLink>
            <div className='flex relative cursor-pointer' onClick={() => navigate('/cart')}>
                <FaShoppingCart className='size-6 text-white' />
                {cartCount > 0 && (
                <span className='absolute text-white -right-1 -top-4'>{cartCount}</span>
                )}
            </div>
        </div>
       
       
    </div>
  )
}

export default Navlink
