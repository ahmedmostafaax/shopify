


import * as zod from 'zod'



export const schema = zod.object({
       
  username : zod.string().nonempty('Name is reguired').min(3, 'Name must be 3 Characters').max(20), 
  password : zod.string().nonempty('password is required')
  // .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,20}$/ , 'inVaild Password'),
  
})

