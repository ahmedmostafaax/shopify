import React, { useContext } from 'react'
import { Navbar as HeroNavbar, NavbarBrand, NavbarContent, NavbarItem } from "@heroui/react";
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext.jsx';
import Search from './Search.jsx';
import { storeContext } from '../Context/CartContext.jsx';


export default function Navbar() {
  let { isLoggedIn, setIsLoggedIn } = useContext(AuthContext)
  const Navigate = useNavigate()

  function logOut() {
    setIsLoggedIn(null)
    localStorage.removeItem('token')
    Navigate('/login')
  }

  const goToCart = () => {
    Navigate('/cart')
  }

      let{counter}= useContext(storeContext)

return (
    <HeroNavbar shouldHideOnScroll>
      <NavbarBrand onClick={() => Navigate('/')} className="cursor-pointer">
        <p className="font-bold text-inherit text-red-800 cursor-pointer">GODZ</p>
      </NavbarBrand>

      <NavbarContent className="hidden sm:flex flex-grow justify-center">
        <Search />
      </NavbarContent>

      <NavbarContent justify="end">
        {/* أيقونة السلة مع العداد */}
        <NavbarItem className="relative">
          <button
            onClick={goToCart}
            className="p-2 text-red-800 hover:text-red-900 transition-colors cursor-pointer relative"
            aria-label="Shopping Cart"
            title="Cart"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              strokeWidth={1.5} 
              stroke="currentColor" 
              className="size-6"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" 
              />
            </svg>
            
            {/* العداد فوق السلة */}
            {counter > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center min-w-[20px]">
                {counter > 99 ? '99+' : counter}
              </span>
            )}
          </button>
        </NavbarItem>

        {/* زر تسجيل الدخول/الخروج */}
        {isLoggedIn ? (
          <NavbarItem 
            onClick={logOut} 
            className='font-bold text-red-800 cursor-pointer hover:text-red-900 transition-colors'
          >
            LogOut
          </NavbarItem>
        ) : (
          <>
            <NavbarItem>
              <NavLink 
                className={({ isActive }) => 
                  `font-bold cursor-pointer transition-colors ${isActive ? 'text-red-900' : 'text-red-800 hover:text-red-900'}`
                } 
                to={'/Login'}
              >
                Sign In
              </NavLink>
            </NavbarItem>
            <NavbarItem>
              <NavLink 
                className={({ isActive }) => 
                  `font-bold cursor-pointer transition-colors ${isActive ? 'text-red-900' : 'text-red-800 hover:text-red-900'}`
                } 
                to={'/register'}
              >
                Sign Up
              </NavLink>
            </NavbarItem>
          </>
        )}
      </NavbarContent>
    </HeroNavbar>
  )
}