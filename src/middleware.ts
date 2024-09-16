

//ab kya hai ki 2-3 portion hote hai middleware ke ki kis trah se kaam krna hai, dekhiye phla to hai Next response , so agr apko req ke andar bhi kuch krna hai to app usko bhi le lijiye 

import { NextResponse , NextRequest} from 'next/server'
import { getToken } from "next-auth/jwt" //so kya hai es methopd ko use krke token hmne le liya hai
export { default } from 'next-auth/middleware'; //default mtlb sabhi jagh hm middleware hm ek trah se chla rha hai 
// import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  //yhi vo method hai jo sara kaam krta hai 
  //so ab mujhe 2 chize chahiye , ek to chiye token or ek url , konse url pe app abhi ho us bases pe mai apko redirect krungaa 
  const token = await getToken({req: request})//further eskoo parameter chahiye , to app yha pe req de dijiye or eska type bhi deine kr dijiye , ki eska type hai req 
  const url = request.nextUrl; //so konse current url pe hai , ye bhi jan na padegaa , vo url jan na to bhut hi aassan hai 

  //so ab hmme chhiye redirection ki strategy, so hme check krna padega , agr token hai to kha kha ja sakta hai , so agr token nahi hai to kha kha pe ja sakta ho , token hai mtlb authenticated hai bnda s

  //redirect to dashboard if the user is already authenticated 
  // and trying ti access sign-in , sign up , or home-page

      if (
        token && //so agr token hai to app kha kha jana chah rha ho , to mai apke url ke paramters yha define kr deta hu 
        (url.pathname.startsWith('/sign-in') || //so agr token hai apke pass mai or app sign mai ja rhe ho to kyu hi ja rha ho , so agr token hai to sidha dashboard pe jao , app to already verified ho hi 
          url.pathname.startsWith('/sign-up') ||
          url.pathname.startsWith('/verify') ||
          url.pathname === '/') //hm ese bhi likh sakta hai 
        ) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }

      if(!token &&
        url.pathname.startsWith('/dashboard')
      ){
        return NextResponse.redirect(new URL('/sign-in', request.url));
      }
      return NextResponse.next();
}



//so ab kya hai ki ab apko chiyegaa jwt se 2-4 chize , ek sabse imp chiz yaad rkhiyega config 

// //config file vo hoti haii, kha khaa pe app chahte hi middleware run kre , so vo sare ka sare files or path likhte ho yha pe ,  

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/sign-in',
    '/sign-up', 
    '/', 
    '/dashboard/:path*',// so dashboard ke andar jitne bhi path honge , un sab pe app kr sakta ho es trah se 
    '/verify/:path*',//so es trah se verify ke liye bhi 
    ],  //so mera phle jo path hai jha mai chahta hu mera middleware run kre , eske wjah se file chl nahi rhi thi 
} 


