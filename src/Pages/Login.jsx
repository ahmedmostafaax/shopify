import { Button, Form, Input } from '@heroui/react'
import React, { useContext, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { sendLogin } from '../Services/AuthServices.js';
import { Link, useNavigate } from 'react-router-dom';
import { schema } from '../Schema/Loginschema.js';
import { useForm } from 'react-hook-form';
import { AuthContext } from '../Context/AuthContext.jsx';

export default function Login() {

  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState(null)

  const { setIsLoggedIn } = useContext(AuthContext)
  const navigate = useNavigate()

  const { handleSubmit, register, formState: { errors } } = useForm({
    defaultValues: {
      username: '', // ← غير من email إلى username
      password: '',
    },
    resolver: zodResolver(schema),
    mode: 'onBlur',
    reValidateMode: 'onBlur',
  })

  async function signIn(userData) { // ← غير الاسم من signUp إلى signIn
    setLoading(true)
    setApiError(null)

    console.log('Login attempt with:', userData);

    try {
      const response = await sendLogin(userData)
      console.log('API Response:', response);

      if (response?.token) {
        console.log('✅ Login successful! Token:', response.token);
        
        // تخزين التوكن
        localStorage.setItem("token", response.token);

        // تحديث حالة المصادقة
        setIsLoggedIn(true);

        // الانتقال للصفحة الرئيسية
        navigate("/");
        
      } else {
        console.log('❌ Login failed:', response);
        setApiError(response?.error || "Username or password is incorrect");
      }

    } catch (error) {
      console.error('Login error:', error);
      setApiError("Username or password is incorrect");
    }

    setLoading(false)
  }

  return (
    <div className='bg-white rounded-2xl shadow-2xl py-10 px-6 min-w-md'>
      <h1 className='text-2xl mb-4 text-center text-red-800'>Login Now</h1>

      {/* ← غير signUp إلى signIn */}
      <Form onSubmit={handleSubmit(signIn)} className="w-full flex flex-col gap-6 max-w-xs ">

        {/* ← غير name إلى username */}
        <Input 
          isInvalid={Boolean(errors.username)} 
          errorMessage={errors.username?.message} 
          variant='bordered' 
          className='min-w-sm' 
          {...register('username')} 
          label="Username" 
          type="text"
        />
       
        <Input
          isInvalid={Boolean(errors.password)}
          errorMessage={errors.password?.message}
          variant='bordered'
          className='min-w-sm'
          {...register('password')}
          label="Password"
          type="password"
        />

        <Button isLoading={loading} variant='bordered' className='min-w-sm' type="submit">
          Login Now
        </Button>

        <div className='flex justify-center items-center w-full'>
          Don't have an account?
          <Link className='text-red-800 ml-1' to={'/register'}>Register</Link>
        </div>

        {apiError && (
          <span className='text-center w-full text-red-600 bg-red-100 px-4 py-2 rounded shadow-sm mt-2'>
            {apiError}
          </span>
        )}

      </Form>
    </div>
  )
}