import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import { Message } from "@/model/User";

export async function POST(request: Request) {
    await dbConnect();
    //ab achi baat ye hai ki messsage koi bhi bhj skta hai, message bhjte time na mujhe ye jruri nahi hai ki app logged in ho ya nahi ho , application es tarah se desinged hai , mystery message hai koi bhi feedback de sakta hai true feedback 

    ///hmme kya krna hai sabse phle to values lene hai , 
    const { username , content } = await request.json();

    try {
        const user =await UserModel.findOne({username});

        if(!user) {
            return Response.json(
            {
                success: false, 
                message: 'User not found'
            }, 
            {status: 404}
            );
        }

        //agr mil gya hai , to phle check krna padegaa , user message accept bhi kr rha hai kyaa 
        if(!user.isAcceptingMessages) {
            return Response.json(
                { message: 'User is not accepting messages', success: false },
                { status: 403 } // 403 Forbidden status
            );
        }

        //So ab agr yaha pe phuch gya hai to , user hai bhi or accept bhi kr rha hai message 
        //agr message accept kr raha hai to bhj denge message 
        const newMessage = { content , createdAt: new Date() };
        user.messages.push(newMessage as Message);
        await user.save();

        return Response.json(
            { 
                success: true,
                message: 'Message sent successfully',  
            },
            { status: 201 } // 201 Created status
        );

    } catch (error) {

        console.error('Error adding message: ', error);
        return Response.json(
            {
                success: false,
                message: 'Internal server error'
            },
            { status: 500 } 
        )
    }
} 