'use client'; //navbar mai sasbe jruri kaam ya hai ki esko client component ke andar convert krengee , kyuki thde se changes hooks wagera use krenge 

//client component bn gya hai , eska mtlb ye hai ki ye server pe render hoke nahi aayega , ye js ship hogi user ke browser pe, vha pe hm esko pura ka pura use kren     gee...

import React from 'react'
import Link from 'next/link';
    //ab ek jo important chiz jo mujhe chiye hoti hai , ye jo useSession hai na ye next auth se apko mil jata hai , react ke andar se , yahi vo session hai jo hmmne bhut manipulate kiya thaa backend ke andar jwt session , yahi actually mai method hai, kyuki jdatar hmare frontend mai ye session hi include hota hai  , ab ek interesting chiz apko yha pe session hi nahi , apko yha pe or bhi chize milti hai mujhe chiye signOut , bs esko hmme use krna hai 
import { useSession, signOut } from 'next-auth/react';
import { User } from 'next-auth';//app chaho to user bhi le sakta ho , user sidha hi next auth se milta hai 
import { Button } from './ui/button';

function Navbar() {
    //ab ek jo sabse intersting baat hai jo apko hmeshaa yaad rkhni hai , ki jha pe bhi apko ye use keyword dikhe mtlb ye hai ki yha se direct data nahi liya ja sakta , yha se data lene ke liye kyuki ye ek hook hai, hook methods hi toh hote hai  , uss hook se data lena padegaa , jaise router se lete hai useRouter bnate hai router likhte hai , vhi same process yaha pe hone wala hai 
    
    ////es data se sirf hmme milta hai ki session active hai ya nahi hai 
    //sabse phle to hm data nikalte hai session se 
    const { data: session } = useSession(); 
        //ab es session ke andar jitna bhi data hai vo app le sakta ho , agr apko chahiye ki typescript or include krna hai , to app yha pe type as a session bhi de sakta ho, ki session type ka hai 
        
        //ab agr apko yaad ho to hmne session ke andar user inject kr diya tha vo user le lete hai 
    const user : User = session?.user as User;//so yha pe hmme insertion hi krna padegaa, ab jaise hi insertion krte hai to ye sure hogya ki ye User type ka hi hai 

        //ye wala jo user hai capital U hai eske andar session ke sara ka sara data hota hai 
        
        //hm sabse phle kya krte hai user lete hai or eksa type kya hogaa User , ab hmme 100% pta hai ki next auth hai 
  return (
    <nav className="p-4 md:p-6 shadow-md bg-gray-900 text-white">
       <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        
            <a href="#" className="text-xl font-bold mb-4 md:mb-0">
            Mystery Message Feedback
            </a>

            { session? ( //agr session hoga tabhi authenticated hai mtlb user hai , so agr user hai to username print kra lete hai 
            
            <>   
                <span className='mr-4'>
                    Welcome, {user?.username || user?.email}
                </span>

                <Button 
                    onClick={() => signOut()} 
                    className='w-full md:w-auto bg-slate-100 text-black' variant='outline'
                >
                    Logout                    
                </Button>
            </>
            ) : (
                <Link href="/sign-in">

                    <Button 
                    className='w-full md:w-auto bg-slate-100 text-black' 
                    variant={'outline'}
                    >
                        Login
                    </Button>

                </Link>
            ) }

            
      </div>
    </nav>
    )
}

export default Navbar;