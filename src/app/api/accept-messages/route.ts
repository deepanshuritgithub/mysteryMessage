//2-3 chize app yha pe sabe new dekhoge , app sabse phle to dekhoge yaha pe ek method hota hai , getServerSession, jo ki next auth deta hai, bada hi basic sa kaam hai , jo bhi session hai apko backend se hi mil jattaa hai , ab es session ke through app session ke andar se user hm extract kr payenge , kyuki user already inject kr diya tha , uss se uski id nikal payenge , jo bhi info chiye hm database se query krke nikal lenge 
//ab ye jo session hai apne app nahi chl jatta hai , esko chahiye auth options , kyuki vo jo credentials provider hai vo bhi to chahiye esko 

import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
//hmme jo session jo milega uske andar bhi ek user hota hai , usko bhi dekh lenge , kr lete hai import , app ek user import kr sakte ho 
import { User } from "next-auth";//ye wala user nahi hai jo hmmne session ke andar inject kra hai , fir bhi ye apke pass mai useful rhegaa 



//dekiye sabse phle to mai accept message ke andar post request bnana chahungaa , get request bhi mujhe bnani padegi 
//phle post req bnate hai , ki jo currentlly loggedin user hai , vo jaise hi toggle pr click kre , vo flip kr paye ki mai off kr sakta hu ya on kr skta hu accepting messages ko 
export async function POST(request: Request) {
    await dbConnect();

    //ab mera sabse phle kaam kya hai ki mujhe currently logged in user chahiye , vo mujhe milegaa getServerSession se , pr isko na authOptions lagte hai, bina eske pta nahi hai kese kaam krna hai 
    const session = await getServerSession(authOptions);
    

    const user: User = session?.user as User; //ab ye jo user hai eske andar apke pass actually mai data hai 
    if(!session || !session.user) {//agr ye nahi hua mtlb user logged in nahi hai 
        return Response.json(
            {
                success: false,
                message: 'Not authenticated'
            },
            { status: 401 }
        )
    }
    //ab important baat ye hai mujhe chahiye id , database ke andar jo request jo krungaa , find by id yhi krne wala hu , to easily mai yha se value nikal sakta hu 
    const userId = user._id;
    //ab hmmne dekhna hai jo samne wala hai jisne frontend bnaya hai , vo mujhee request bhi to bhjega ki accept krna hai message , ki jo true or false flag hai vo bhi mujhe bhjegaa , to yha pe hm simply await 
    const {acceptMessages} = await request.json();

    try {
        //update the user's message acceptance status 
        const updatedUser = await UserModel.findByIdAndUpdate(
            //1st paramter ye accept kr lega id 
            //2nd paramter ye accept kr legaa, ki kya kya apko update krna hai vo app bhj do  
            //3rd eske andar denge options , ki jo bhi new updated value hai mujhe mil jaye  
            userId, 
            {isAcceptingMessage: acceptMessages},
            {new: true} //to get the new updated value 
        ) //es se hota ye hai ki jo return apko milega vo updated value milegi  

        //ab iske baad aap check kr lijiye ki apko user mila bhi hai ya nahi 
        if(!updatedUser) {
            return Response.json(
                {
                    success: false,
                    message: 'failed to update user status to accept messages'
                },
                { status: 401 }
            )
        }

        //agr update user mil jaata hai to response success bhj dijiye 
          // Successfully updated message acceptance status
        return Response.json(
            {
                success: true,
                message: 'Message acceptance status updated successfully',
                updatedUser
            },
            { status: 200 }
        )


    } catch (error) {
        console.error('failed to update user status to accept messages :', error);
        return Response.json(
            {
                success: false,
                message: 'failed to update user status to accept messages '
            },
            { status: 500 }
        )
    }
    
}


//esme hm database se query krke status bhj dete hai
export async function GET(request: Request) {
    await dbConnect();

    //Get the User session 
    const session = await  getServerSession(authOptions);
    const user: User = session?.user as User;

    if(!session || !user) {
        return Response.json(
            {
                success: false,
                message: 'Not authenticated'
            },
            { status: 401 }
        )
    }
    const userId = user._id;

    try {
        //so ab agr userId aa gya hai to find kr lete hai us user koo , database se 
        //Retrieve the user from the database using the ID
        const foundUser = await UserModel.findById(userId);
        if(!foundUser) {
            return Response.json(
                {
                    success: false,
                    message: 'User not found'
                },
                { status: 404 }
            );
        }
        
        //agr mil jaata hai tb kya krna hai 
        return Response.json(
            {
                success: true,
                isAcceptingMessages: foundUser.isAcceptingMessages
            },
            { status: 200 }
        )
        
    } catch (error) {
        console.error('Error retrieving message acceptance status:', error);
        return Response.json(
            { 
                success: false, 
                message: 'Error retrieving message acceptance status' 
            },
            { status: 500 }
        );
    }
    
}

