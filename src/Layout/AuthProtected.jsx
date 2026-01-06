import React, { useContext, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from '../Context/AuthContext.jsx'

export default function AuthProtected({children}) {

    let {isLoggedIn , setIsLoggedIn} = useContext(AuthContext)

    // const [ isLogged , setIsLogged] = useState(localStorage.getItem('token') != null )

    return !isLoggedIn? children : <Navigate to={'/login'}/>



}
 