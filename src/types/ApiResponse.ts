//so jab bhi hm response bhjengee to hmmare type ki guidelines ko follow krna chahiye response 
//esme actual response nahi hogaa , esme hogaa ki kis trah se hmara response dikhna chahiye 

import { Message } from "@/model/User";
//dekhiye maine model se message liya hai eske fyda kya hai , dekhiye kuch api response es trah se bhi honge jha pe user ne message bhja hai bs, to ye bhi to hoga na kai messages aayenge, ya ho sakta hai app es trah ke api response bhjo jha pe apne databse se bhut sare message collect kiye ho , usko app show krwana chahta hai, obvious se baat hai ye scenario bhi aayega user ko dashboard mai hmme dena hi hai , to hm kya krte hai usko bhi ese trah se optional bna ke rkh lete hai

//so jab bhi type define hote hai to most of the time interface hi hota hai vha pe , ye hai basic apna classic typescript one on one , esko bol dete hai api response 
export interface ApiResponse {
    //so ab response dikhega kese    
    success: boolean; 
    message: string;
    isAcceptingMessages?: boolean; 
    messages?: Array<Message>;//esko bol dete hai app array honge but normal array nhi honge, app honge ek special type ke array , jiske andar message hongee 
}