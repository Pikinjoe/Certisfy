import { NavLink } from 'react-router-dom'
import MarketStall from '../assets/MarketStall.png'

const Home = () => {
  return (
    <div className='h-screen relative bg-green-50'>
      <div className='h-[60%] w-full mb-4 sm:h-screen'> 
        <img src={MarketStall} alt="A happy shopper" className='h-full w-full object-cover object-center rounded-b-[50%] sm:rounded-b-none ' />
      </div>
      
        <div className='text-center sm:absolute sm:top-[40%] sm:left-[30%] text-primary-text sm:text-black'>
            <h2 className='font-bold text-xl md:text-3xl '>Relax and Shop</h2>
            <p className='my-4 text-lg font-semibold mx-5'>Shop online and get groceries delivered from shop to your home in a giffy</p>
        </div>

        <div className='flex justify-center items-center gap-4 mt-10 sm:absolute sm:right-0 sm:top-0 sm:w-48 '>
            <NavLink to="/signup" className='w-2/5'>
                <button className='bg-secondary rounded-2xl py-3 w-full font-semibold text-primary-text cursor-pointer'> Sign Up</button>
            </NavLink>
            <NavLink to="/login" className='w-2/5'>
                <button className='bg-primary rounded-2xl py-3 w-full font-semibold text-white cursor-pointer'> Login</button>
            </NavLink>
        </div>
    </div>
  )
}

export default Home
