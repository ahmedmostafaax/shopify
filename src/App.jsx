import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import AuthLayout from './Layout/AuthLayout.jsx'
import MainLayout from './Layout/MainLayout.jsx'
import FeedPage from './Pages/FeedPage.jsx'
import Login from './Pages/Login.jsx'
import NotFound from './Pages/NotFound.jsx'
import PostDetails from './Pages/PostDetails.jsx'
import Profile from './Pages/Profile.jsx'
import Register from './Pages/Register.jsx'
import ProtectedRoute from './Layout/ProtectedRoute.jsx'
import AuthProtected from './Layout/AuthProtected.jsx'
import { StoreContextProvider } from './Context/CartContext.jsx'



const router = createBrowserRouter([
  {path:'', element:<MainLayout/> , children:[
    {index:true , element :  <FeedPage/>  },
    {path:'cart' , element : <ProtectedRoute> <Profile/> </ProtectedRoute>  },
    {path:'post/:id' , element :  <PostDetails/>  },
    {path:'*' , element : <ProtectedRoute> <NotFound/> </ProtectedRoute> },

  ]} ,

  {path:'', element:<AuthLayout/> , children:[
    {path:'register' , element: <AuthProtected> <Register/> </AuthProtected>  },
    {path:'login' , element: <AuthProtected> <Login/> </AuthProtected>  }

  ]},

])


export default function App() {

  return <>
  <StoreContextProvider>
  <RouterProvider router={router}/>
  </StoreContextProvider>
  
  </> 
  
}
