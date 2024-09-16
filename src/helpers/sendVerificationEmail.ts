import { resend } from "@/lib/resend";       
import VerificationEmail from "../../emails/VerificationEmail";
//uske alawa hm api ka response kuch bhjne wala hai , to hm api ke response ko bhi standardized kr de , to agr api ke response ko bhi standardized kr dia to kaafi shi kaam ho jaeagaa 
import { ApiResponse } from "@/types/ApiResponse";


//ab next kaam kya hai ki hmme email verification send krna hai

    //email hmmesha async hote hai, emails time lete hai , smtp server hota hai , bhut time lagta hai 
export async function sendVerificationEmail(
    //eske andar app data bhi to loge na , ese thdi na direct hi email bhj dogee, mail ke andar apko ek to chiyega email , jo bhi es method ko use kregaa vo ek to bhjega email
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse> {  //ab ye jo method hai hmara return kya kregaa , vese yha koi khaas need nahi hai , but hm krengee, hmara jo return type hogaa promise , aesa vesa nahi , hmare ko define hai chize Api response 
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev' , // so jab app free account se krta hai , kab app set nahi krte hai apna domain , to apko ese trah se milta hai 
            to: email , //maine already parameter mai expect kr rkha hai email mai usi ko bhjungaa 
            subject: 'Mystery Message | Verification Code', 
            react: VerificationEmail({ username, otp: verifyCode }), // ye expect krta hai ki app ese username or otp esko bhjogee as a prop 
                        //yha pe actually mai bol rha hai ki apko component likhna hai pura ka pura , ya kha se aayega , ye hmne jo email ke andar bnaya hai verification email vha se 
        });
        return { //or kya hai ki hm return kr denge response 
            success: true,
            message: 'Verification email sent successfully.',
        }
    } catch (emailError) {

        console.error('Error sending verification email:', emailError); //JO BHI HO  skta hai smtp kaam nahi kr rhaa, ya kuch bhi nahi ho rha to kuch na  kucch issue to ho hi rha hogaa 
        //ab es case mai kya hogaa ki hm yha pe aake sirf return nahi kr sakta , kyuki ye promise jo hai na kabhi shanti se nahi baithne wala hai , to kya krna padega ki ek return dena hi padega mujhe taki usko shanti mile , return deta hu mai or uska andar ek object return kr deta hu 
        return { 
            success: false, 
            message: 'Failed to send verification email.' 
        };
    }
}