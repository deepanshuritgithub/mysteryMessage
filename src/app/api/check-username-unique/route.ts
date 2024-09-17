import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {z} from "zod";//so kya hai ki jab bhi hm zod lenge to hmme schema chahiyega kahi na kahi 
import { usernameValidation } from "@/schemas/signUpSchema";

//so ye schema aa gya hai , ab hm kya krte hai kis trah se pura kaam hota hai , kyuki ab validation ke liye apke pass username validation hai to es se hm actually mai query schema bnata hai 
//query schema kya hota hai ki jab bhi apko kuch check krna ho ye wala object , ya ye wala variable , check krna hai uska ek syntax hota hai , uss syntax ko hm check krate hai 
const UsernameQuerySchema = z.object({
    //es object ke andar hm bol dete hai jitne bhi parameter aayenge vese to ek hi aayega abhi mere pass ki username hoga ,ab vo jo username hai vo full fill krna chiye paramter usernameValidation ko  
    username : usernameValidation
});

//so ab mujhe kya krna hai , simple se mujhe ek get method likhna hai jiske through agr mujhe koi bhi username bhjee to mai usko check krke bta saku ki apka ye valid hai ya nahi hai username , ya exist krta hai ya nahi krta hai 
export async function GET(request: Request) { //app ke pass hogi request jo ki hogi type Request 
    //Todo  use this in all other routes 

    // if(request.method !== 'GET') {
    //     return Response.json(
    //         {
    //             success: false,
    //             message: 'Method not allowed, only get Method is allowed',
    //         },
    //         { status: 405 }
    //     );
    // } //so kya hai ki ja pages router hota tha tab ye recommendation diya hai pr ab next vke version change hone ke karan usme esa nahi kr sakte hai 

    await dbConnect();


    // localhost:3000/api/cuu?username=deepanshu?phone=android

    try {
        //ab baat ye hai ki ye jo username hai esko check kese krogee , username check krenge hm url se , koi bhi jab username check krega to mujhe query bhj degaa url ke andar hi , get request se aayegaa , query question mark lag ke aati hai , so query parameter mujhe extract krna hai 

        const {searchParams} = new URL(request.url); //es se hmare pass url aa jata hai pura ke pura
        //ab kya krna hai apki ki es search params mai se apni query nikalni hai , kyuki ho sakta hai esme ? likh likh ke bhut sara parmeters aaye ho , ya kisi ne use kre ho , mujhe mera query parameter chahiye 
        
        const queryParam = {
            username: searchParams.get('username'),//eske andar us method ka naam likh do 
        }; 



    // Check if username is missing in query parameters
    if (!queryParam.username) {
        return Response.json(
          {
            success: false,
            message: "Username query parameter is required",
          },
          { status: 400 } // Bad request
        );
      }
        
        // console.log('Received query parameters:', queryParam);
        //thik hai ab query params to apke pass hai lekin esko validate kese kiya jaye username se , username query schema wala  
        //validate with zod 
        const result = UsernameQuerySchema.safeParse(queryParam);
        //so ab safe parse se kya hoga agr parsing safe hui, schema follow hua to apko value mil jayegi otherwise nahi milegi 
        console.log('Validation result:', result);

        // console.log(result);     //TODO: remove

        if(!result.success)
        {
            //to username ko apko response mai bhj deta hai ki username ke andar errors aaye formatting thik nahi thi , kyuki maine to bola tha app sirf number or letters use kr sakta ho , pr ho sakta hai apne special characters wagera kuch na kuch use kia ho 
            const usernameErrors = result.error.format().username?._errors || [];
            //.format se app inko format bhi kr sakta ho, format ke baad app sara username ke errors bhi nikal skte ho , lekin agr es se nikaloge to or bhi jo zod ke ande jo errors hai vo bhi apke pass aa jaye , yha pe . krke , mujhe yha pe sirf username ke errors chahiye to uss error ko lete hai , optionally eske andar ho sakta hai apke pass errors ho , 

            //ye jo format hai na result.error format , eske andar sara hi errors hote hai agr apke username ke hai , sign up ke hai , jitne bhi hai eske andar push hote hi jata hai , usme sa mujhe sirf ye nikalni hai ye nikal le 


            return Response.json(
                {
                    success: false,
                    message: usernameErrors?.length > 0 ? usernameErrors.join(', ') : 'Invalid query parameters'
                },
                { status: 400 } //bad request
            )
        }
        
        //ab suppose kriye hmara jo mamla hai thik jara hai , to hmme kis trah se data milegaa 
        const { username } = result.data;
        //ye jo username hai ye confirmed paraters or schema ko follow krta hai , ab jo same process jo aajj tak follow krte aaye hai vhi ki database se query kro , database se leke aao , result hai ya nahi hai vo sab pta hi hai 

        const existingVerifiedUser = await UserModel.findOne({
            username,
            isVerified: true,
            //agr apke pass 2no chize hai to ye and condn pe chalta hai , , agr ye 2no chize hai to esko await kra lete hai 
        })

        if(existingVerifiedUser) {
            return Response.json(
                {
                    success: false,
                    message: 'Username is already taken',
                },
                { status: 400 }
            );
        }
        //agr kisi ne nahi liya hai to yahi response return krna hai 
        return Response.json(
            {
                success: true,
                message: 'Username is unique'
            },
            { status: 200}
        )


    } catch (error) {
        console.error('Error checking username:', error);
        return Response.json(
            {
            success: false,
            message: 'Error checking username',
            },
            { status: 500 }
        );
    }
}