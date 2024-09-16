import { z } from "zod";

export const usernameValidation = z
.string() //jaise mujhe check krna hai ki ye string hai kyaa , uske badd check ki uski minumum value kya hai 
.min(2,'username must be at least 2 characters')
.max(20, 'username must be no more than 20 characters')
.regex(/^[a-zA-Z0-9_]+$/, 'username must not contiain special characters')

//uske baad jo bhi schema apko bnana hai , to kya ki app z ke sath object bnata ho, ye ek method hai jiske andar app object es trah se likhte ho 
export const signUpSchema = z.object({ //yha pe hmne object es liye bnaya kyuki mujhe esme 3-4 chize check krne thi , agr ek hi check krna hota to upar jaise kiya hai direct hi kr lete 
    //so agr username apko validate krna hai to app likhte ho z.string() , eske andar bhut sare methods hai es library ke andar apne app mai , ki apko kuch bhi check krna hai to app es trah se kr sakte ho , essa nahi hai ki mai yha pe sirf string hi check kr sakta hu , string further add on bhi ki ja sakti hai .minimum kitna chahiye or max kitna ,koi agr reqex bhi lagake check krna hai kya 
username: usernameValidation,
                //jaise ki apne dekha hmme mongoose ke andar email ka regex wagera lagana pada yaha ye sara kaam khud hi kr leta hai , email ke sath app eske andar ek object bhi open kr sakte ho , jiske andar app message de sakte ho, agr ye nahi nikla to kesa message de dena hai  
email: z.string().email({message: 'Invalid email address' }),
password: z
.string()
.min(6, { message: 'Password must be at least 6 characters' }), 
//object ke andar esme message aata hai kya message dena chahta ho agr ye nahi nikla to , or we can say error message 
})