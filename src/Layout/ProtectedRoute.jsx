import React, { useContext, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from '../Context/AuthContext.jsx'

export default function ProtectedRoute({children}) {

    const {isLoggedIn , setIsLoggedIn} = useContext(AuthContext)

    // const [ isLoggedIn , setIsLoggedIn] = useState(localStorage.getItem('token') != null )

    return isLoggedIn? children : <Navigate to={'/login'}/>



}
 