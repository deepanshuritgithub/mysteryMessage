import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET(request: Request)
{
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;
    //ab ye jo user hmare pass aa rha hai , agr apko yadd ho to hmne esko string mai convert kr diya tha , ye apne app mai bhut hi classic mistake hai , kyuki jab app es trah se values ko find kr rha ho , users ko find krte time , ya kuch ese krte time , kai baar issues aa jate hai , ya issue jo hai normally findById wagera ye sab internally hande kr lete hai , lekin jab app aggregation pipeline lagate ho , ye string wala jo issue hai kai baar issue kr sakta hai 

    if(!session || !user) {
        return Response.json(
            {
                success: false,
                message: "Not authenticated"
            },
            { status: 401 }
        );
    }

    //to obvious se baat hai hm ese pure ko convert krna chahenge ,     
    const userId = new mongoose.Types.ObjectId(user._id);//agr app es ObjectId ke andar app user._id pass kr doge to ye agr string mai bhi hogaa, to apke pass jo convert hoke jo jayega userId mai yaha pe , vo hogaa mongoose ka objectId
    //by the way app findById and findById and update vha pe chal jata hai mamlaa , lekin jab es trah se aggragation likhte hai tab issue aata hai 

    try {
        //ab kya hai user hm yha pe le rha hai , actually mai mujhe jo chahiye sara ka sara chiye ki jo messages hai , vo messages mere pass aa jayee , to un messages ko dekhte hai kese un messages ko la sakte hai , acha yha pe ab baat aati hai hmari aggregation pipelines ki , ab kya hai ki mai yha pe kai users bnana wwla ho 
        const user = await UserModel.aggregate([ 
            //usermodel ke pass hi apko aggreate method hota hai , or eske andar app arrays bnate ho , apki har ek pipeline kuch es trah se likhi jati hai 

            //in 1st pipeline mai mujhe kya krna hai sabse phle to match krane hai , kyuki bhut sara users ho sakte hai , uss users mai se mujhe , ek aesa user lake do jiski id match kree  , so hmmesaa ye trah ki pipeline app likhogee 
            { $match: {_id: userId} }, //ab kya hai ki ab appke pass es traah ka user aa gya hai 
            //ab next step kya krna haii , ab apke jo arrays hai unko unwind krna hai 

            //so jaise hi app ye pipeline lagate hai unwind ki , specially array ke liye lagte hai ye pipeline , ye apko arrays ko open krke de dega , , so ab apke pass arrays nahi hai , multiple objects hai ,or sabke andar id 1 hai 
            { $unwind: '$messages' },
            //so jab app mongodb ka internal paramter use krte hai , to app kya kr sakte ho sidhe hi strings ke andar $messages likh sakte ho  , yahi mere pass hai as it is maine laga diya 
            //ye krne se kya hoga ki mai ese sort bhi kr paungaa 

            //so ab mere pass multiple document hai , so ab mai sorting wagera sab kuch kr sakta hu
            { $sort: { 'messages.createdAt': -1 } }, //eske baad yha pe app isko -1 de sakte hai ki app ascending krna hai ya latest jo aaya hai uss se krna hai jaise bhi thik lage 
            //thik hai sorting to kr de , lekin abhi bhi kya hai mere jo documents hai na abhi bhi bikhre hua hai , ab inki mai grouping krna chahta hu taki inko mai group krke ek sath rkh loo 
            //then finally group krke mai bhj dunga user ke andar 
            
            { $group: {
                _id: '$_id', //ek to mai chahta hu parameter grouping krte time _id rkhanaa, or jo field hai hmara vo bhi rkhna hai $_id 
                messages: { $push: '$messages' }
                 //or messages ke andar hmme kya krna hai jo bhi messages hai as it is push krna hai ye jo field hai 
            } },

        ]).exec();

        //ab suppose user hai hi nhi , or kuch mila hi nahi hai aggregation pipeline se , ya fir apme jo user hai , uski jo length hai vo agr maan lijiye 0 hai ,to bhi apko kuch nahi mila hai  

        if(!user || user.length === 0){
            return Response.json(
                {
                    success: false,
                    message: 'User not found'
                },
                { status: 404 }
            );
        }

        return Response.json(
            {
                success: true,
                //so ye jo apko aggregation pipeline se return type milta hai , vo milta hai array , kai trike hai merko first jo object mil rha hai usme se messages nikal ke dedo 
                // user[0] menas phla object or uske andar jo message hai vo 
                messages: user[0].messages
            },
            { status: 200 }
        );
        
    } catch (error) {
        console.error('An unexpected error occurred:', error);
        return Response.json(
            { 
                message: 'Internal server error',
                success: false
            },
            { status: 500}
        );
    }


}