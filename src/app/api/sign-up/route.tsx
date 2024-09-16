//so ab aagye hm es file ke andar , so ab hmme jitna bhi alogorithm dekha tha vo implement krne ka time aa gaya hai
import dbConnect from "@/lib/dbConnect"; //database connection har ek route pe lagta hai kyuki next js jo hai vo route pe chalta hai 
import UserModel from "@/model/User";
//uske baad encrypt bhi to kroge , to hmmne to bcrypt js intall krna padegaa
import bcrypt from "bcryptjs";

import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

                    //function ka naam hmmesha is trah se likhte hai next js mai POST , app GET bhi likh sakte ho, hm kya kr rha hai yha pe post request accept kr rha hai
                    //yha pe hm esko bol dete hai req, or eska datatype bhi Request hoga
export async function POST(request: Request) { 
    //ab sabse phle kaam kya krna hai , sabse phle await lagake database connection kr lo yha pe, so jab kisi ne req kre tab hmmne database connection kra yha pe , baaki hmne optmization database ka kr rkha hai  
    await dbConnect(); //database connection 

    try {   
        //try catch mai hm kya krenge obvious se baar hai database wagera handler krne ki koshihsh kr rha hai ho sakta hai koi error aa jaye user ko register krte time wagera ye sab


        const {username , email, password} = await request.json();

        //sabse phle kya check kroge user ka email exist krta hai kya 
        
        const existingVerifiedUserByUsername = await UserModel.findOne({
            username, //find one ke 2 paramters hai ,ek to username se find krna hai , or username tabhi mujhe dena jab iske pass isVerifiedproperty true ho , so ye 2no end condition ki trah treat hogi or esko hm store kr lete hai ek variable mai 
            isVerified: true,
        })
        
        if(existingVerifiedUserByUsername){
            return Response.json(
                {
                    success: false, //success false honi chahiye kyuki user mil gya hai to apka registration nahi ho sakta hai 
                    message: 'Username is already taken',
                },
                { status: 200 } 
            );
        }

        const existingUserByEmail = await UserModel.findOne({email})
        let verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

            if(existingUserByEmail){
                if(existingUserByEmail.isVerified){
                    return Response.json(
                        {
                            success: false,
                            message: 'User already exists with this email',
                        },
                        { status: 400 } 
                    );
                }
                else{
                    //so ab ek case bnta hai existing user hai lekin verified nahi hai 

                        //agr nahi hai to wapis se hm fresh user save kr dete hai , kyuki password wagera sab change hue hai , or firse otp wagera chla jayega usko
                    
                    const rounds = 10;
                    const hashedPassword = await bcrypt.hash(password, rounds);
                    //so ab hm kya krte hai ki password ko overwrite kr dete hai sirf , kyuki hmare pass ye jo field aaya hai es position pe aaye hai exist to krta hai lekin ho sakta hai usko password yaad na ho , vo fresh password set kr rha ho , so uska password change kr dete hai hm 
                    //so ye jo existingUserByEmail hai eski jo property hai .password  eske andar hm kya krte hai uska andar hm kya krte hai new wala hashed password rakh dete hai 
                    existingUserByEmail.password = hashedPassword;
                    existingUserByEmail.verifyCode = verifyCode; //verify code wagera bhi change kr dete hai eskee , verify phle nahi kr paya to kya hua ab kr degaa
                    existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000); //3600000 means 1 hour in milliseconds, ajj ki jo date hai us se ek ghnte baad code expiiry ho jaegaa 

                    //so ye new Date se aa gye date , date object hai , lekin esko hme change krna hai thda sa , Date.now  krne se abhi ki date aa gye , lekin sudden thdi na expire krungaa , lekin eske 1 ghnte tak ka time rakh lete hai 
                    await existingUserByEmail.save();
                    
                }
            } else {
                   //agr existing user by email nahi mila hai mujhe database mai to eska mtlb hai user aaya hi phli baar hai , or agr aaya hi phli baar hai to usko to register krna padega na database mai
                
                //to sabse phle kya kro password encrypt kro 
                const hashedPassword = await bcrypt.hash(password, 10);//so ye krne se kya hua ki password encrypt ho jata hai 

                //jo hmmne dekha tha js ki series mai new keyword ke upar , ye jo data hai na, yaha pe apko object mil rha hai, object ke piche let const kuch bhi ho , object , memory ke andar ek refernce point hai jo ki pura area hai , uske andar jo values hai vo change hoti hai
                const expiryDate = new Date();
                //or date ke andar hi method hota hai setHours hm kr sakte hai , kya houw mujhe set krna hai , abhi ki jo date hai us se 1 ghnte ka de dete hai 
                    //abhi ki jo date hai or abhi ka jo time hai us se 1 ghnte baad tak ka de dete hai, expirey date se hm le lete hai getHours or iske  andar + 1 kr do 
                expiryDate.setHours(expiryDate.getHours() + 1);
                //so ab user ko save kr le database ke andar 
                    const newUser = new UserModel({
                        username, 
                        email, 
                        password:hashedPassword,
                        verifyCode,
                        verifyCodeExpiry: expiryDate,
                        isVerified: false,
                        isAcceptingMessages: true,
                        messages: [],
                    })

                    await newUser.save();
                    }


                //send Verification email 
                // so ab agr user Save ho gya hai to ek verification email bhi to bhjna padegaa  
                
                const emailResponse = await sendVerificationEmail(
                    email,
                    username,
                    verifyCode
                );
                //so jab hmne email response ko console log krwaya tab hmme milaa .success, directly jo kaafi kaam de deta hai apnaa 
                
                if (!emailResponse.success) {// so agr appke pass ye email response hai , eske andar .success nahi aata hai , to hm return kr dete hai ek json response 
                    return Response.json(
                    {
                        success: false,
                        message: emailResponse.message, //ye directly stringed message hai 
                    },
                    { status: 500 } 
                    );
                }  
                // so agr success mil gya hai to hmm ye ka ye response return kr dengee , bs es baar koi condition check nahi krne
                return Response.json(
                    {
                    success: true,
                    message: 'User registered successfully. Please verify your account.',
                    },
                    { status: 201 }
                );

    } catch (error) {

        console.error('Error registering user:' , error);// ye jo console log hai kyuki api ka kaam hai to ye hmme terminal pe dikhayi degaa
        return Response.json( //or ye jo response hai hmne frontend pe bhj diya hai
            {
                success: false,
                message: 'Error registering user',
            },
            //eske alawa hm yha pe status code bhi bhj sakte hai , status code yha pe alag se object bn ke hi jata hai 
            { status: 500 } //text mai hi jata hai 
        )
        
    }
}