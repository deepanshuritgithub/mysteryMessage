import NextAuth from "next-auth/next";

import { authOptions } from "./options";

//ab yaha pe kya hai ki hmme yha pe handler method bnana padta hai , eska naam handler hi hona chahiye , kyuki ye apko milegaa NextAuth or eske andar app dete ho sare ke sare options 
const handler = NextAuth(authOptions); //NextAuth ek method hai jo ki options leta hai 

//handler method hai , lekin abhi export ya use nhi hua hai , kahi pe bhi 
export { handler as GET, handler as POST }; //kyuki in files mai , app koi bhi method ka naam likh lijiye vo nahi chalta hai kyuki framwework hai  , in files ko  , jo jab route.ts ko likhte hai to ye sari verbs likhni padti hai  get post , ye sari verbs likhni padti hai , ye verbs se hi chalti hai files      


//ek imp thing which we forget , uss se phle testing krne lag gya the , ek imp chiz jo next js ya auth js ke andar hai vo hai middleware , so abhi tak hmmne middleware config nahi kra hai to actually mai auth ko pta hi nhi kha pe kya run krna hai , so middleware to run kre bagar hmme testing to krne hi nahi chahiye thi 
//middleware concept  
//middleware hota kya hai ki jane se phle milke jana , so kon se route pe apko intermediate kaam krwana hai to vha pe app middleware es trah se rkhte ho 