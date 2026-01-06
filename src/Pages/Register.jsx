import { Button, Form, Input, Select, SelectItem } from '@heroui/react'
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod'
import { sendRegister } from '../Services/AuthServices.js';
import { Link, useNavigate } from 'react-router-dom';
import { schema } from '../Schema/RegisterSchema.js';
 

export default function Register() {

  const [loading , setLoading ] = useState(false)
  const [apiError , setApiError ] = useState(null)


  const {handleSubmit , register ,control, formState:{errors}} = useForm({
    defaultValues: {
    name:'',
    email:'',
    password:''
},
    resolver:zodResolver(schema),
    mode:'onBlur',
    reValidateMode:'onBlur',


  })


  const navigate = useNavigate()

  async function signUp (userData){
    setLoading(true)
    const response = await sendRegister(userData)
    if(response?.id){
      navigate('/login')
    }else{
      setApiError(response.error)
    } 
    setLoading(false) 
  }


 
  return <>
    <div className='bg-white rounded-2xl shadow-2xl py-10 px-6 min-w-md' >
      <h1 className='text-2xl mb-4 text-center text-red-800'>Register Now</h1>
      
      <Form onSubmit={handleSubmit(signUp)} className="w-full flex-col gap-6 max-w-xs ">
          <Input isInvalid={Boolean(errors.name)} errorMessage={errors.name?.message} variant='bordered' className=' min-w-sm' {...register('name')} label=" user name" type="text" />
          <Input isInvalid={Boolean(errors.email)} errorMessage={errors.email?.message} variant='bordered' className=' min-w-sm' {...register('email')} label="Email" type="email" />
          <Input isInvalid={Boolean(errors.password)} errorMessage={errors.password?.message} variant='bordered' className=' min-w-sm' {...register('password')} label="password" type="password" />

          <Button isLoading={loading} variant='bordered' className='min-w-sm' type="submit" >Register</Button>
           <div className='flex justify-center items-center w-full'>
                     have an account?
                    <Link className='text-red-800 ml-1' to={'/login'}>Login</Link>
                  </div>
           {apiError && <span className='text-center text-red-500 '>{apiError}</span>}
          {/* <Button variant='bordered' className='min-w-sm' type="submit" >Login</Button> */}
    </Form>
    
    </div>
  </>
}
   