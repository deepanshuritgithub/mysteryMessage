//next auth ka jo pura ka pura mamala hai na options pe hi dependent hai thda sa 
//so ye hmmne jitna bhi dekha na creadential provider , github provider ye sab ese file mai hi aata hai , ye hmmne sagtgregate kr rkha hai , production mai ese trah se kiya jata hai, hmm chahte to ek hi file mai likh sakte the, pr not recommended .

import { NextAuthOptions } from "next-auth";
import  CredentialsProvider  from "next-auth/providers/credentials";
import bcrypt from "bcryptjs"; //lekin mujhe kuch or bhi chiyega kyuki mai user ko sign in krwana jaungaa , to mai uska password bhi check krungaa, to bcrypt lagega mujhe
import dbConnect from "@/lib/dbConnect"; //ye db Connect bhi to krna padegaa kyuki database mai hi to jake dekhunga ki db connect hai ya nahi hai 
import UserModel from "@/model/User";


//so ab kyuki options maine separate file mai rkhe hai to mai es options ko export bhi krna chahungaa , kyuki name to route mai hi kaam mai lena hai mujhee usko 
            //eska naam hm lete hai auth options , jiska type hogaa NextAuthOptions
export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({ //so jab app ye dete hai to ye ek method hai, ye  kai objects apko access deta hai , sabse phle to apko yha pe id dene padegi
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text"},
                password: { label: "Password", type: "password" }
            },
            //2sra ye kya khete hai ki agr app ye use kr rha ho to apko ye method use krna hi padegaa async authorize , kyuki ab nextauth ko nahi pta hai ki authorize kese kiya jaye , so ab apko custom method design krna hi padegaa ki ye pure chiz ko authorize kr payee 
            async authorize(credentials: any): Promise<any>  { //ab ye jo authorize hai na ye ek parameter accept krta hai credentials except krta hai ,, inka type abhi hm any de dete hai, or apko jo return mai milta hai Promise , Promise ke andar bhi mujhe pta nahi eska datatype , mai abhi gya bhi nahi uska andar , so hm any likh dete hai  , pr Promise milega ye pkkaa hai 

                //so ab ye jo crdentials aaya hai , ess se mai chize nikal sakta hu ,  es se na app identifier app accept kr sakte ho , credential.identifier. jo bhi apne bola tha email bola tha , password jo bi ho mill jayega, jo bhi mil jayega as it is 
                

                //so auuthorize krte time esa to nahi mai direct hi authorize kr skta hu merko databse se puchne padega kya mamla hai
                await dbConnect();

                try {
                    const user = await UserModel.findOne({
                        //so ab find kis base pe krna hai , so koi ab username se find kre , koi email se find kre , so agr email se find krna hai to mai credentials.identifier.email de dungaa 
                        //lekin hho sakta hai app esko future proof bnana chahe to yha pe $or or condition , ya to hm username se bna lenge application mai , ya email se , to bar baar yha na ana pade 
                        //to yha hmmne or likh diya hai , to mongoose ka operator hme yha mil jata hai easily , array le lijiye , ye saare arrays ke through , go through kr legaa, unme se jo bhi esko milega usko find ye kr legaa 
                        $or:[
                            {email: credentials.identifier}, //first value //vese to yha pe .email bhi likhna chiye tha, but apko pta hai es6 hai aaj kal , to koi se badi baat nahi hai , hmm esko avoid kr sakte hai 
                            {username: credentials.identifier} //2nd value , or bhi jitni valus hai es trah se de dijiyegaa
                        ]
                    })
                    if(!user) {
                        throw new Error('No user found with this email');
                    }
                    //so agr user verified nahi hai , yhi mera credentials custom hai yha pe es lia mai login with google wagera nahi de rha es application mai vo to app kr hi loge  
                    //SO AGR user ke andr jo field hai is Verified nahi hai , to error throw kr denge 
                    if(!user.isVerified){
                        throw new Error('Please verify your account before login. ');
                    }   
                    //so ab agr user mil hi gya hai to password hi check kr lete hai 
                    const isPasswordCorrect = await bcrypt.compare(
                        credentials.password,
                        user.password 
                        //kya credentials ka jo password hai or jo user ka password hai , vo agr parapar hai to kuch krenge aage, compare kr rha hai basically hm yha pe  
                    );
                    if(isPasswordCorrect) {
                        return user;
                    } else {
                        throw new Error('Incorrect password');
                    }

                } catch (err: any) {
                    throw new Error(err);
                }   

            }
        })
    ],


    callbacks:{
        async jwt({ token, user }) {
             //token mai actually mai jada intersting chize nahi hoti hai bs token ka id hota hai , mai kya chahta hu ki is token ko mai or powerful bna do taki es token se mai jo value chahu nikal saku , haalaki payload ka size badd jayegaa, kuch log yha pe optmization ke regarding thda sa, problem mai aa jaye , token short hi hna chaiye , ppr token short rkhneg to baar baar database ko ease marni padegi , to hm kya krte hai , hm kuch is trahs se strategy bnate hai , ki es token ke andar maximum se maximum , data mai eske andar ghusa do , or uske baad ye sara data maine dall diya hai to, session ke andar bhi mai ye data daal do , to mere pass chahe token ka access ho ya session ka access ho , jab chahe mai values nikal paungaa
            if(user){
                token._id= user._id?.toString();//convert object id to string 
                //lekin abhi bhi hmari problem puri trah se solve nahi hui hai , kyuki agr mai eske pass or field leke jaunga to ye pkka mujhe yhi dikkat krne wala hai
                token.isVerified = user.isVerified;
                token.isAcceptingMessages = user.isAcceptingMessages;
                token.username = user.username;
                

            }

        return token
        },

        //appp chahe to sari ki sari values na joo token mai de hai vo app session mai bhi de saktaa hai , actully mai jo next auth hai na vo session based strategy pe chalta hai  
        
        async session({ session, token }) {//so yha pe hmme user to bilkul bhi nahi chiye kyuki jo next auth ka jo user hai bada hi basic sa hai , uska kuch nahi kr sakte hai hm , hmne custom model design kr rkha hai , yhi problem hai
            
            if(token){
                session.user._id = token._id;
                session.user.isVerified = token.isVerified;
                session.user.isAcceptingMessages = token.isAcceptingMessages;
                session.user.username = token.username;
            }
        return session
        },
    },

    pages: {
        //suppose mujhe sign ka page overwrite krna hai , sign up ka nahi krna mujhe vo to vese bhi mai ek custom page design krungaa , uska jo api ha yha pe access ho jayega sign-up pe , to vo jo values hai mai yha pe fetch krke yha pe bhj dungaa 
        signIn: "/sign-in", 

        //so agr ap chahte hai mujhe handle hi nahi krna kuch bhi , to app es tarah se basic sign up page bhi ese trah se de sakte ho , to next apne app handle kr leta hai , sign in , sign up sab yahi handle kr legaa , ek hi route pe sab kuch handle kr lega vo 
    },
    //ab achi baat kya hai ki , hmne directly pages use kra hai , to hm sirf route nahi define kr rha hai , kyuki ab hmmne control kisko de diya hai next auth ko , to jaise apne kha sign in :/ url to sign in ka control pura yha pe chla gaya , or apko page design bhi nahi krna padega , or ab apko page design bhi nahi krna padegaa , next auth hi kr legaa  

    //sirf itna hi nahi hai apke pass or bhi chize hai app jis trah ki strategy wagera lagana chaho , jaise mai chahta hu ki mai , session apko chiye kesa , to session ke andar app define krte ho apko strategy konsi chiye 
    session: {
        strategy:"jwt", //ab strategy apko konsi chiye , app database ki strategy bhi laga sakte ho , ki mere database mai hi key store hai , ki us key ke bases pe hi mai sabko login de rha hu , ya mai jwt laga sakta hu , bearer strategy hoti hai jiske pass bhi token hai vhi login hai 
    },
//ek imp chiz jo nahi bhullni hai , ki ye sab to hmmne de hi diya hai, ab iske baad mai ye sara kaam ek chiz mai bhut jyda dependent hai jo ki hai secret 
secret: process.env.NEXTAUTH_SECRET,

};