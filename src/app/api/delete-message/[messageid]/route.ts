import UserModel from '@/model/User';
import { getServerSession } from 'next-auth/next';
import dbConnect from '@/lib/dbConnect';
import { User } from 'next-auth';
import { Message } from '@/model/User';
import { NextRequest } from 'next/server';
import { authOptions } from '../../auth/[...nextauth]/options';



//sabse phle problem to ye , ye jo hmmne eska frontend likha hai vha pe hm delete message ke andar ye parameters bhi accept kr rha hai , kyuki jisko bolte hai dynamic parameters , ye aara hai to hmme es file ko delete message ke andar agr hmme message ID expect krne hai to message id ko ussi trah se likhna padegaa , so jab bhi hmme dynamaic parameters expect krne ho to hmm new folder bnake squarebrackets ke andar jo paramter expect kr rha hai hm , ye apke upar hai capital i likhna hai [] esme ,mai sab lower mai prefer krta hu , ab es se fyda kya hoga ki ye route.ts hai ye dynamic message id ko capture kr payega 

export async function DELETE(
    request: Request,
    //request ke sath apko or kuch bhi milegaa , kyuki ab apko params bhi chiyenge 
    //params jo honge hmare unka jo type jo hogaa 
                  //params ke andar apko milega message id jo ki hoga type ek string...
    { params }: { params: { messageid: string } }

    //so phle to mai khe ra hu apko params mil jayenge , params ke andar kya hoga ki apko paramters milenge jo apko message id degaa jo ki string type ka hogaa 
  ) {

      //find messageId
      const messageId = params.messageid; //so ab apke pass messageId aa chuki hai jo apne bhji thi message card ke andar se frontend se 

      await dbConnect();
      const session = await getServerSession(authOptions);
      const user: User = session?.user as User;
      
      if (!session || !user) {

        return Response.json(
          { success: false, message: 'Not authenticated' },
          { status: 401 }
        );
        
      }

  try {
                  //update kyu , kyuki arrays mai se ek hi value update krne hai , baaki sab as it is rkhna hai 
        const updateResult = await UserModel.updateOne({ //phla parameter jo update one ke andar jata hai ki kis bases pe mai match kru, match kriye chize _id ke bases pe , or ye id khaa milegi apko user ke andar , 
          _id: user._id 
        }, 
        //thik hai user dhund liyaa , so ab hmme ptaa hai hmme ek array particulary delete krna hai 
      {
  //pull operator in mongo db removes from an existing array all instances of a value or value that match a specified condition.
  //ab apko pta lag gya hoga alag alag documents hai , mujhe sirf id match krne hai or es pull operator ko dene hai , or ye pull operator uss message ko apne app remove kr dega uss array mai se that's it yahi kaam hai 

        $pull: { //ye use krenge 
          //condition de denge braces ke andar 
          messages: {
            _id: messageId     //or hmme pta hai har ek documents ka _id milta hai mongo db ke andar default hai hi hai , vo jo _id hai vo apko match krna hai messageId se 
          },
          
        }
      }
      );

      if(updateResult.modifiedCount === 0) { // 0 hai mtlb kkuch modified hua nahi 
        return Response.json(
          {
            success: false,
            message: 'Message not found or already deleted',

          },
          { status: 404 }

        )
      }

      return Response.json(
        { message: 'Message deleted', success: true },
        { status: 200 }
      );

  
  } catch (error) {
    
    console.log('Error deleting message: ', error);
    return Response.json(
      {
        success: false,
        message: 'Error deleting message'
      },
      { status: 500 }
    );
    
  }
}