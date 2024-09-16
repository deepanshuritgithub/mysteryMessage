"use client"; // Add this line at the very top

import { zodResolver } from "@hookform/resolvers/zod"
import React, { useState , useEffect} from "react";
import { useForm } from "react-hook-form"
import { useDebounceCallback } from 'usehooks-ts';

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
import axios, {AxiosError} from "axios";
import { Loader2 } from 'lucide-react';
import { useRouter } from "next/navigation"; //USERS Ko idhar udhar bhhjne ke liyee 
import { useToast } from '@/components/ui/use-toast';
import { signUpSchema } from "@/schemas/signUpSchema";
import { ApiResponse } from "@/types/ApiResponse";



export default function SignUp() {

  const [username , setUsername ]= useState('');
  //uske alwa agr username hai apke pass available , ya nahi hai uska ek message to aayegaa, jaise hm request bhjenge , backend oe to kuch ka kuch to aayega msg  , to hm esko ya boll dete hai Username msg 
  const [ usernameMessage , setUsernameMessage ] = useState('');

  //uske alwa kya hai ki hmme loader field bhi chiyegaa , kyuki kai baar jab m req bhjdenge ke backend pe, so ek loading state bhi chiyega , so us state ko manage krne ke liye ek or hmme yha pe lagegaa 
  const [isCheckingUsername, setIsCheckingUsername ] = useState(false);
  //form ssubmit bhi ho rha hai , form submit bhi hoga kahi na kahi , vo state bhi hmme measure krke rkhni padegi , ki form submit hora hai ,ya kuch ho rha hai processing , to uss form submit KI STATE hme chiyegi 
  const [isSubmitting , setIsSubmitting] = useState(false);

  const debounced = useDebounceCallback(setUsername, 500);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (username) {
        setIsCheckingUsername(true);
        setUsernameMessage('');

        try {
          const response = await axios.get<ApiResponse>(
            `/api/check-username-unique?username=${username}`
          );
          setUsernameMessage(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(
            axiosError.response?.data.message ?? 'Error checking username'
          );
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };
    checkUsernameUnique();
  }, [username]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);

    try {
      const response = await axios.post<ApiResponse>('/api/sign-up', data);
      toast({
        title: 'Success',
        description: response.data.message,
      });
      router.replace(`/verify/${username}`);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Sign Up Failed',
        description: axiosError.response?.data.message || 'Sign up failed',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };



  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
    <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
      <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join True Feedback
          </h1>
          <p className="mb-4">Sign up to start your anonymous adventure</p>
      </div>

    {/* //so hmmne jo form bnaya hai uske andar agr apko yaad ho to , hmne jo useform krke saare objects collect kre hai to uska naam form hi rkha hai , agr apne register kra hai to ...register , kyuki destuructured chahiye  */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            name="username" //name apke pass jo bhi field apne zod ke upar likhe hai , vo hi saare field likhne hote hai , username , password , uske baad apke pass aata hai ek form item 
            control={form.control}

              //or es callback ke andar hm sare ke sare field likhte hai , ye jo field hai na yahi collect kr rha hai actually mai apka data or yhi further transfer kr deta hai bts mai 
            render={({ field }) => (
              //uske baad apke paas aata hai form item , ye jo form item hai yahi hai pura ka pura item , eska andar apko kya hota hai ye render krna hota hai form item , so ye jab render krte ho eske andr apko milta hai callback 
                  <FormItem>

                    <FormLabel>Username</FormLabel>
                    <FormControl>

                    <Input
                    placeholder="username"
                    {...field}
                    // thik hai hmmne field to de diya , lekin es field ke andar value nahi gye hai actually mai , to ye value kese insert krte hai ye thda sa missing hai , kyuki har koi field ke andar alag alag trike se value insert kregaa , so hm bhi yha pe krke dekh lete hai  
                    //hmme pta hai onChange method hota hai classic js ka , eske andar hmare pass mai event aata hai , or es event ke through hm es value ko add kr denge yha pe bada hi basic trike se 
                    //sabse phle to boliye field hai  , eske andar hi onChange event apke pass hai , es onChange event ko hi pura ka pura event apne yha pe de diyaa 
                    // baat yaha khtm ho jati lekin problem kya hai ki ye jo username field hai na esko mai ek or jagah manage kr rha hu , personally mere liye , kyuki maine extra functionality dali hai vese to nahi thi jrurat , but yaha pe ye jo username hai na state wala esko bhi mai control kr rha hu , to es wjah se merko ye likhna pada  
                    //although actually mai jo hm react hook form use krte hai uska main mudda hi yahi hota hai , ki manually ek ek chiz maintain na krne pade , but hmmara use case alag hai es lia hm esko use kr rha hai 
                    
                    onChange={(e) => {
                        field.onChange(e);
                        debounced(e.target.value);
                      }}
                      />
                    </FormControl>

                    {/* //agr username check ho rha hai , to hm kya krte hai ek loader ko spin kra lete hai jo ki pura ka pura animate vha pe dikhta rhegaa  */}
                    {isCheckingUsername && <Loader2 className="animate-spin" />}

                    {!isCheckingUsername && usernameMessage && (
                      //ab text ka jo color hoga vo kis trah se likhenge , ya hm red lenge ya green color lenge , ab ye purely depend krega ki hmara user message kya hai , agr username message unique hai to hm text ka color green dikhayenge otherwise hm usko red dikhayenge 
                        <p
                          className={`text-sm ${
                            usernameMessage === 'Username is unique'
                              ? 'text-green-500'
                              : 'text-red-500'
                          }`}
                        >
                          test {usernameMessage}
                        </p>

                    )}
                    
                    <FormMessage />

                  </FormItem>

            )}
          />



          <FormField
            name="email"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                  {/* <FormControl> */}

                <Input placeholder="email" {...field} name="email" />
                <p className='text-muted text-gray-400 text-sm'>We will send you a verification code</p>

                  {/* </FormControl> */}
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
                <Input placeholder="password" type="password" {...field} name="password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button type="submit" className='w-full' disabled={isSubmitting}>

            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              'Sign Up'
            )}
            
          </Button> 
          
        </form>
      
      </Form>
      
      <div className="text-center mt-4">
        <p>
          Already a member?{' '}
          <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  </div>
  )
}
