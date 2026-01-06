
import * as zod from 'zod'



export const schema = zod.object({
  name : zod.string().nonempty('Name is reguired')
         .min(3, 'Name must be 3 Characters').max(20),
       
  email : zod.string().nonempty('Email is reguired').regex(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/ , 'inValid Email Address') ,      
  password : zod.string().nonempty('password is required')
  .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,20}$/ , 'inVaild Password'),  

})

