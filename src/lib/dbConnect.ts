import mongoose from "mongoose";

//mongoose to app le aaye , lekin jab db se connection apke pass aata hai to hm yha pe bhi thda sa ts inject krna chahenge ki mujhe pta chale , db connection ke baad jo object mujhe aara hai, usme se mujhe kya value chahiye , uska datatype kya hai , app chahe to skip kr skte ha pr mai yha pe dena chahungaa  

    //so esko hm bol lete hai ki ye hmara connection object hai , 
type ConnectionObject = {
    //eska type kya hogaa , bada hi basic type hota hai isConnected, es particular value se mera kaam rhegaa , ye value optional hoti hai esa nahi ki har baar hi return hogi ,, in case agr return hogi to , uska type hogaa number 
    isConnected?: number;
};

const connection : ConnectionObject ={};//initially mai empty esko es liye rkh paya hu , kyuki maine yha pe bola hai ki eska data type optional hai , aagr mai normal rkhta to obvious se baat hai error aati that's why we have kept optional 


//so ab hmme krna hai database connection
                            //SO JAB APKa database connection ho jaeegaa to apko return mai milega kuch  , so jo connection method execute hoga to return mai milegaa kuch , uss return ka bhi hmme intejam kr rkha hai pura ki hmmara pass jo value return hogi database se vo ek promise hogaa , uss promise ke andar kya value aati hai mujhe uss se kuch khaas mtlb nahi hai , mai uske andar void likh deta hu ,

                            //ek chiz ka dhyan rkhiye ga ye jo void hai na eske sath baaggage mat leke aayegaa , kyuki khene ka mtlb ye hai void jo app c++ mai padta ho uska meaning alag hai or jo app ts mai padta ho uska mtlb aalag hai, yha pr ts mai mtlb hai ki mujhe parwah nahi hai ki kis trrahh ka data return aara hai es lia void likh deta hu 
async function dbConnect():Promise<void> {
    //ab next js hai, ho sakta hai esme req just raised hui ho , database connection ho hamara pass mai , to sabse phle aapp jake database connection check kr lo 
    if(connection.isConnected) {
        console.log('Already connected to the database');
        return;
    }//so ye hmara first check ho gya jo ki hmara safety check man lo , optimization check maan lo , so database connection tha try catch lagane ki jrurat nahi padii , 
    
//in case agr nahi thaa to try catch lgaate hai, to dekhte hai database kis trah se connect hogaa s
    try {
        //Attempt to connect to the database
        const db = await mongoose.connect(process.env.MONGODB_URI ||'' ,{}) 
        //so ab agr db ka connection aa gya hai to kya krna hai , to actually mai kya hai ki conection se mujhe kuch variable or kuch data nikalna hai , , so ab hm kya krte hai db se connection lete hai , connection apne app mai ek array apke pass aata hai uski hm yha pe first value ko hi extract krte hai , or vha pe hmme milti hai readyState , ki database connection fully ready hai ya nahi hai 
        connection.isConnected = db.connections[0].readyState;
        //ye ready state hai, ye bs dhyan mai rkhne ke liye , upar jo hmmne diya the vo number diya tha, ese ko hm return krne wala the , ready state apne app mai number hota hai , bs ese ko extract hmme krna thaa  , agr nahi krte ho to hi koi dikkat wali baat nahi hai , app usko ek variable true or false flag dall ke bhi kr sakte ho  

        console.log('Database connected successfully'); //so yha to dekhiye sara kaam ho chuka hai , connection hmara successful ho gya hai , uss case mai kya hai jab connection successful nahi ho rha hai , tab yha pe sabse imp jo hai dhyan rkhne wali baat ye hai ki app process ko gracefully exit kroo 

    } catch (error) {
        console.log('Database connection failed:', error)
        
        // Graceful exit in case of a connection error
        process.exit(1);//process hai esko app exit kr do, database connect hi nhi hua hai to hmari baaki application kaam krne wali nahi hai to hm gracefully esko exit kr de  

    }
}

export default dbConnect;

