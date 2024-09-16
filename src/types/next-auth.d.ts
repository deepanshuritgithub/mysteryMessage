//yha pe kya hai ki hm kuch new datatypes define kr sakte hai , define to kya krenge existing one ko modify krengee 

import "next-auth";
import { DefaultSession } from "next-auth";

//ab mai kisi bhi eske jo declared module hai, kind of redefine kr sakta hu , ya modify kr sakta hu , kese krte hai ye specially ek declare file hoti hai , eske andar declare krte hai module ko , konsa modula next auth , that's why we have imported , ab eske andar mai continiously aake or kuch bhi import kr lungaa 

//hmne dekha tha hm typesecript mai aake directly interface likh dete hai , agr app es trah se package import krna chahta ho , ki package mera aware ho jaye new datatype se , to directly interface nahi kr sakta mai 
declare module "next-auth" {

    //uske baad uske andar jitne module likhe hua hai uske interface se mai ched chad kr rha hu , jda se nahi krunga pr ek se to krungaa 
        interface Session { //session ke andar user object bhi aa sakta hai or user id bhi aa sakta hai , to wapis se hmme yha pe interface ko change krna padegaa  

            //eske andar hmme pta hai user naam ka object aayegaa, 
            user: {
            _id?: string;
            isVerified?: boolean;
            isAcceptingMessages?: boolean;
            username?: string;
            } & DefaultSession["user"]; //thik hai ye sab to aayega hi aayega and ek or word yha likhengee  ki apka jo default session jo hogaa na uske andar bhi mujhe key chahiye jo ki hogii username ki
            
            //basically mai kya khe ra hu ki jab bhi apka default session hoga uske andar ek key aayegi hi aaeygi user naam ki , ab us key ke andar values aati hai ya nahi aati vo discuss kr lenge baad mai , ho sakta hai nahi aayegi kyuki sab optional rkha hua hai but mujhe key to chahiye kyuki ye key bhi agr nahi hogi na to mai kuch bhi vha pe query krunga enquiry krungaa session se , to vo mujhe direct hi error throw kr degaa, to es lia maine kha hai ki default session ke andr key hogi hmare pass jo ki user hoga 
        }

        interface User { //so ab esko mai new user ke baare mai btaungaa, ki apka jo user tha na uska interface kuch hogaa , but isko mai wapise  se declare kr rha hu , kuch new fields dall rha hu
            _id?: string; //eska datatype string rhega , or ye optional field rhegaa sare ke saare , 
            isVerified?: boolean;
            isAcceptingMessages?: boolean;
            username?: string;
        }
}

//same ka same hme jwt ke liye bhi bnana chiye thaa , same interface decalre krna chahiye thaa, declare module,, hm chahta hai to hm eska andar hi kr sakta hai next-auth ke andar 
//  hm isko alag se bhi kr sakta hai  , ek or trika hai ye just for sake

    declare module "next-auth/jwt" { // app yha pe directly bol sakte the mujhe chahiye thaa next-auth/ or mai modif krna chahta hu, sidha jwt ko , esa nahi ke har baar apko pura ka pura likhna pade iss trah se   
    interface JWT { 
        _id?: string;
        isVerified?: boolean;
        isAcceptingMessages?: boolean;
        username?: string;
    }
}
