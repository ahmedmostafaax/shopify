import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../Components/Navbar.jsx'
import Footer from '../Components/Footer.jsx'



export default function AuthLayout() {
  return <>

  <Navbar/>
  <div className='min-h-screen flex justify-center bg-gray-100 items-center'>


  <Outlet/>
  </div>

  <Footer/>
  
  
  </>
}
