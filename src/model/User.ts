import mongoose,{Schema, Document} from "mongoose"; //so ab mongosoose to lagega hi , pr ab hm ts ke andar hai to schema le lete hai , monggosse.Schema likhne se aacha haaii ek hi baar mai schema ko import kr lete hai or ek document bhi chiye 
//document es liye lagega kyuki hm type safety bhi esme introduce kr rha hai , or ts ko use kr rha hai , agr sirf js use kr rha hai to as such likhne ki jrurat nahi hai 

//so jabb bhi hm ts use krte hai to hm yha pe data ka type define krte hai , type define krne ke liye interface ek bhut hi common data type hai , hota kuch bhi nahi hai bs hm uske andar ek general definition likhte hai ki , message aayegaa to vo string format mai hogaa , boolean ya number format hogaa basically kuch ese trah se 

export interface Message extends Document{ //interface hmare pass hote hai , or esko ek naam dena hota hai , ki ye message ka schema hai  
    _id: string; // Ensure this is a string
    content: string;  
    createdAt:Date  //so ye jo format hai merko ts ke through milte hai 
}


//vese to itna kaam ho jayega lekin ye sab actually mai part kya hai , ye sara jo schema hai jayega to database mai , mongoose ka hi part hai , mongoose ke document hi bnenge es se , to yha pe app ek syntax use kr sakte ho extends ka , ye na actually mai document hogaa , es liye hmmne yha pe document ko import kra hai 

            //so jab hmme updar custom data type bna liya hai , to yaha pe hm bolengee message jo schemaa jo hai na vo ek schema follow kregaa 
            //so hm kya kr sakte hai , hm yha pe : colon lagake uska data type , string hota to mai direct string likh deta , ab kyuki eska type string nahi hai eska type schema hai , so ab schema mai bhi konsa schemaa ,or yha pe hm diamong brackets ke andar Message ka schema dete hai , jo message maine updar define kra to , ye sirf type safety de rha hai or kuch nahi kr rha hai , to kabhi yhe schema kahi or use ho to uske andar ye syntax esa hi follow ho 
const MessageSchema: Schema<Message> = new Schema({
    content:{
        type:String, //mongoose ke andar string jo hai capital maii likhi jati hai, or ts ki smaller mai likhi jati hai 
        required:true
    },
    createdAt: {
        type: Date,
        required:true,
        default: Date.now
    }
});


//so ab hmme ese trah se user bhi define krna hai 
export  interface User extends Document {
    username: string;
    email: string;
    password: string;
    verifyCode: string; //user ko verify bhi to kroge vo code bhi to database mai store rkhna padegaa, tabhi to matching hogi uskii , vo bhi string format mai hi save krwa ke rkhengee 
    verifyCodeExpiry: Date;
    isVerified: boolean; //for check to user is verified or not , so uss se hmme thde se check mil jayenge 
    isAcceptingMessages : boolean;//user accept kr rha hai message , nahi kr rha hai vo bhi rkhna padegaa , ye obvious hai boolean hogaa true or false mai btayegaa 
    messages: Message[]; //ye normal array nahi hai ye ek special type ka array hai , jo ki hogaa message ka , to User ke andar hi hm sare ke sare message type ke document as a array feed kr dengee 

}

const UserSchema: Schema<User> = new Schema({
    username: {
        type: String,
        required: [true, "Username is required"], //required to true hai hi pr hm esko thda sa convert kr dete hai custom messages mai bhi 
        trim: true, //jaise user ke thde se spaces wagera de diyo ho to hm usko trim kr dete hai   
        unique: true,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        //ab kya hai ki app ek valid email ko bhi test kr sakte ho , ye ek trika hai kis trah se usually kiya jata hai , ek yha pe match operator bhi aata hai mongoose ke andar , or eske andar app same hi array provide kr sakte ho , eske andar 1st value jo hogi apki regex , or fir yaha pe app error bhi de sakte ho 
        match: [/.+\@.+\..+/, 'Please use a valid email address'],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    verifyCode: {
        type: String,
        required: [true, "VerifyCode is required"],
    },
    verifyCodeExpiry: {
        type: Date,
        required: [true, "Verify Code Expiry is required"],
    },
    isVerified: {
        type: Boolean,
        default: false, //by default koi bhi verified nahi hogaa
    },
    isAcceptingMessages : {
        type: Boolean,
        default: true, //user ko accept krne do message 
    },
                //messages ka type thda sa interesting hai , messages jo hai uska apne app mai document hai messages , or uska array hai , usko denote krne ka sabse jo easy trika hai , app sidhe hi array likh dijiye  or kis chiz ka array hai vo [String] , so agr string ka hota to mai es trah se string yha pe likh detaa , pr kya hai ki hmare pass custom datatype hai to yha pe message schema likh dijiye 
    messages: [MessageSchema]
})

//so ab baat aati hai ki esko export kese kiyaa jayee 
//next js ke andar kya hai ki jadatar edge time pe chize run ho rhi hai ,
//next js edge pe run krta hai 
// next js ko nahi pta hai ki ye first time pe application mere bootup ho rhi hai , ya fir es se phle bhi ho chuki hai , ye thda sa issue aata hai , esliye next js ke andar jo hm data ko export krte hai vo thda sa diff hota hai 

// to hmara jo user model hm export krenge vo 2 trah se check krte hai ki ho sakta hai phle se bna va ho , or ||  lagake uss case ko bhi krte hai , agr nahi bna hua to mongoose ke through mongo db mai db bna do fir mujhe return kr do , 2no cases hmme check krne hote hai 
const UserModel = 
    //so ye wala part hai jab hm expect kr rha hai , database ke andar already models hai , first time nahi create ho rha hai, bas jo bhi created hai vhi existing mujhe mil rha hai , ,so hmara jo return datatype aana wala hai , vo mongoose ke jo model hai uss type ka aayegaa , koi generic model nahi hai koi sa bhi model dedo , uska jo type hai User hona chahiye , ye mai yha pe likh rha hu  
    (mongoose.models.User as mongoose.Model<User>) || 
    mongoose.model<User>("User", UserSchema); //yha pe jo type script ka injection aata hai na vo sirf itna sa aata hai , ye jo model hai na eska bhi datatype mai btana chahungaa , ye jo model hai User hai, lekin mai yha pe schema provide krna chahungaa to usko kuch is trah se likh ke app User schema provide kr dete ho  <User>

export default UserModel;