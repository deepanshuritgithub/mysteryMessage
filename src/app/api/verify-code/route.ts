import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

// verify code ka jo pura method hai totally hmare upar hai , ki app get se request check krna chahta ho ya post se , 2no se hi kr sakte hai , ese koi dikkat wali baat nahi hai 
export async function POST (request: Request){
    await dbConnect();

    try {

        const {username, code} = await request.json();//json se kya kya data chiye , app json se data mujhe bhj doge 

        //vese app chahe to dono ko hi body mai bhj do to jyada acha hogaa , frontend se apko discuss krna padegaa, ho sakta hai frontend ek chiz parameter se bhj rha ho , url se ek chiz ese bhj rha ho, hm dono se nikal sakta hai koi dikkat wali baat nahi hai  

        //vese ek chiz kya hai ki jab url se chize aati hai , to itni aasani se apko milti nahi hai , vese kya hai ki url se jab chize aati ho to usko kya hai ki decode kr lena chahiye , to yha pe hm vhi same kaam krenge , hm yha pe decode kr lete hai usko 
        const decodedUsername = decodeURIComponent(username) //kai baar kya hai ki url ke through chize aarahi hai , mai prefer krta hu es method se pass kr lenaa jaise space hota hai usko automatically url %20 bna deta hai , to apko jo actual version chize app yha se nikal sakte ho 

        const user = await UserModel.findOne({ 
            username: decodedUsername
        }); //so es se user mil gya hmme 

        if(!user) {
            return Response.json(
                { 
                    success: false,
                    message: "User not found"
                },
                { status : 404 }
            );
        }

        //agr mil jata hai to check kro code correct hai , or code expired to nahi hai  , tab to user ko verify kra denge otherwise verify code has expired de denge 
        const isCodeValid = user.verifyCode === code; 
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();  //mtlb abhi time hai 

        if(isCodeValid && isCodeNotExpired){
            //update the user's verification status 
            user.isVerified = true;
            await user.save();

            return Response.json(
                {
                    success: true,
                    message: "Account verified successfully"
                },
                { status: 200 }
            )
        }
        else if(!isCodeNotExpired){
            //code has expired 
            return Response.json(
                {
                    success: false,
                    message: "Verification code has expired. Please sign up again to get a new code.",
                },
                { status: 400 }
            );
        } else {
            //code is incorrect 
            return Response.json(
                {
                    success: false,
                    message: "Incorrect verification code"
                },
                { status: 400 }
            )
        }
        
    } catch (error) {
        console.error("Error verifying user:", error);
        return Response.json(
            {
                success: false,
                message: "Error verifying user",
            },
            { status: 500 }
        )
    }
}