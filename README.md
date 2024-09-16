//so jab user sign up kregaa to mai kya kya expect krta hu ki vo mujhe kya kya bhejegaa , uska validation bhi to hai , manta hu mongoose ke andar validation hai , mongoose mai to pure user ka validation hai , Sirf Sign up ke duran kya chize shi se aare hai , validate hoke aari hai , username manga to username hi dera hai , or kuch to nahi de rha hai 123 to nahi likh diya hai , special symbol to nahi daal diya hai , ye sara verification use krne ke liye hm ek library use krenge zod

//sabse phle user signup krega , uske baad user verify kregaa 
so verifySchema , verify kya chiz krega, usko jo code bhjenge uska bhi to schema hogaa  6 digit ka aaye , 8 digit ka aaye to , har jagah validatiion check rhega to thda sa control mai rhegaa, vrna ho sakta hai db mai 8 digit ka chla jaye, User ko 6 digit ka chla jaye, to match nahi krega so un sab chizo ko avoid krne ke liye


type nul > signUpSchema.ts 
        verifySchema.ts 
         signInpSchema.ts 
         acceptionMessageSchema.ts
         messageSchema.ts  //message ka apne app mai schema to hona chahiye , vo to hmare pass mongoose mai bhi hai , lekin yaha wala dekhne pe validation smjh aayega ki ye structure ke liye nahi hai database ke liye ye hmare validation ke liye hai 



zod library 
zod kya krta hai , zod tyescript first schema validation  , so jo hm schema schema likh rha the yhi se aara thaa , baat ye hai ki ye sirf schema validation hai , suppose jaise apko email valid krna hai to mongoose tak jane ki jrurat hi kha hai, mai phle hi appko sab kuch check kr dungaa , to jo hm manual validation kai jagah likh rha the empty na ho string to vo sara validation ek hi jagah sara ho jata hai       



databse connection 
dekhiye database connection bada hi easy or straight forward hota hai , jab app pure backend application bna rha hai , 
next.js comparatively differnet framework hai ,
next js kya hai ki edge time framework hai ,  mtlb ye jo pura resource hai application hai all time continue nahi chlti hai , jaise jaise user ki request aati hai tab chize execute hoti hai , specially next js ke andar app jitne bhi function wagera likhte ho ye on time hi run hote hai but ja hm pure dedicated backend bnate hai to to agr ek baar chize connect ho gye hai to continue chalti hi rheti hai , remember all time running nahi rheti hai chize next ke andar jaise jaise demand unki run hoti hai tab hoti hai 

resend email


algorithm :

code should effectively handles both scenarios of registering a new user and updating an existing but unverified user account with a new password and verification code 

  IF existingUserByEmail EXISTS THEN 
        IF existingUserByEmail.isVerified THEN
                success = false,
        ELSE 
                //Save the updated user 
        END IF
  ELSE 
        //Create a new user with the provided details  
        //Save the new user
  END IF        