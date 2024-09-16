"use client"; // Add this line at the very top

import { zodResolver } from "@hookform/resolvers/zod"
import React  from "react";
import { useForm } from "react-hook-form"

import * as z  from "zod"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import Link from "next/link";
import { Input } from '@/components/ui/input';
import { useRouter } from "next/navigation"; //USERS Ko idhar udhar bhhjne ke liyee 
import { useToast } from '@/components/ui/use-toast';
import { signInSchema } from "@/schemas/signInpSchema";
import { signIn } from "next-auth/react";



export default function SignInForm() {

  const router = useRouter();
  const { toast } = useToast()

  
  const form = useForm<z.infer<typeof signInSchema>>({ 

    resolver: zodResolver(signInSchema),
    defaultValues: {
      //default values mai kya kya control krna hai ye apke upar hai 
      identifier: '',
      password: '',
    },
  })

  //signin kya hai ki hm pura ka pura next auth se use kr rha hai ,fir toh kuch krna hi nahi hai, jab next auth aa gya to eske baad to in sab ki to kuch jrurat hi nahi hai 

  const onSubmit = async (data: z.infer<typeof signInSchema>) =>  {
    ////ab yha pe hm use krna wala hai next auth ko , ek sign up hmne dekha ki manual process kese hota hai , ek manual process ke through dekh lijiye 
    //hmmme axios wagera krne ki kuch jrurat nahi hai hm sidha hi axios use kr sakte hai  

                          //esko sabse phle chahiye konsa provider use kr rha ho , hm credentials provider use kr rha hai , 
                          //credentials hai to hmme data bhi send krna padega 
    const result = await signIn('credentials', {
      //2-3 paramters apko send krne hi hota hai yha pe , phle to identifiers hai vo send krne hote hai , identifier mai email hai , password bhi ho sakta hai 
      redirect: false, //uske alwa hhm yha pe redirect ka bhi false de deta hai ki app mt krao redirect , hmm kra lengee 
      identifier: data.identifier,
      password: data.password,
    });

    //ab result mai hmare pass error bhi aa sakte hai , or sab kuch apke pass thik bhi ho sakta hai , sabse easy trike hota hai ki es result ke andar hi app check kr lo ki ki eske andar optionally kahi error to nahi hai 

    if(result?.error) {
      //ye kaam optional hai, hm yaha pe further ek or check laga sakte hai , or check kr sakta ho ki ye jo result hai , eske andar jo error hai ki ye CredentialsSignin ka to nahi hai  
        if(result.error === 'CredentialsSignin') {
        
            toast({
              title: 'Login Failed',
              description: 'Incorrect username or password',
              variant: 'destructive',
            });

        } else { //agr in case maine ye error shi se detect nahi kraa, to hm kya kr sakta hai kyyki hmme nahi pta hai credentials hai ya credential hai , i capital ha ya nahi hai, to else case mai yaha pe  
          
            toast({
              title: 'Error',
              description: result.error,
              variant: 'destructive',
            });
        }
    }
    //agr kya hai ki eske andar agr apko url milta hai to mtlb sign in response hai , app chaho to esko bhi jake dekh sakte ho 
    if(result?.url) {
      //agr result ke andar url aara hai to customized hm hmari traf se redirect krengee kyuki directly jo sign in jo hmare pass hai , next auth jo redirect krta hai , vo redirection thdi se alag hai, to uske through mai redirection nahi krna chahtaa , 
      //mai router se hi sidha replace kr dungaa or sidha usko leke jate hai dashboard pe , agr sign in ho gya hai to usko dashboard pe le jaate hai 
      router.replace('/dashboard');
    }
};


  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
    <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
      <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join True Feedback
          </h1>
          <p className="mb-4">Sign in to start your anonymous adventure</p>
      </div>

    {/* //so hmmne jo form bnaya hai uske andar agr apko yaad ho to , hmne jo useform krke saare objects collect kre hai to uska naam form hi rkha hai , agr apne register kra hai to ...register , kyuki destuructured chahiye  */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            name="identifier" 
            control={form.control}
            render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email/Username</FormLabel>
                      <FormControl>
                        <Input placeholder="email/username" {...field}/>
                      </FormControl>
                      <FormMessage />
                  </FormItem>
            )}
          />


          <FormField
            name="password"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="password" {...field} name="password" />
                  </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className='w-full'>SignIn</Button> 
        </form>
      </Form>
      
      <div className="text-center mt-4">
        <p>
          Not a member yet?{' '}
          <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  </div>
  );
}
