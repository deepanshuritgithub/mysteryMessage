"use client";  

import { useToast } from '@/components/ui/use-toast';
import { verifySchema } from '@/schemas/verifySchema';
import { useParams, useRouter } from 'next/navigation';
import React from 'react';
import * as z from "zod";
//everything as z from zod
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types/ApiResponse';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

function VerifyAccount() {

  const router = useRouter();
  const { toast } = useToast();
  //ab phle mera jo challenge hai ki params se data lena hai 
  const params = useParams<{ username: string }>();  //ab agr hmme chahe to yha pe type inferring bhi kr sakta hai , yha pe aake khe do ki mujhe jo data chahiye vo username hi chahiye, jiska type hoga string 

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
  })

  //ab phli baat ye hai ki jab submit ho jayeega tab kese data leke aana hai uspe hmm baat krte hai
  
  const onSubmit = async(data: z.infer<typeof verifySchema>) => {
    try {

        const response = await axios.post<ApiResponse>(`/api/verify-code`, { //sirf itne se kaam nahi hoga apko data bhi send krana padegaa , konse 2 data send krne hai username or code , yahi 2 kaam hai
          username: params.username,
          code: data.code, //code kaha se milega , obviouse se baat hai form bnaonge react hook form use krke , ye jo code aayega apke pass data mai se aa jayega 
        });

        toast({
          title: 'Success',
          description: response.data.message,
        })

        router.replace(`/sign-in`); //so ab agr verify hogya hai to redirect kra dete hai kai trike se ap chahe to redirect bhi kra sakta hai or replace bhi kr sakta hai 

    } catch (error) {

        const axiosError = error as AxiosError<ApiResponse>;
        toast({
          title: 'Verification failed',
          description: 
            axiosError.response?.data.message ?? 'An Error occurred. please try again. ',
            variant: 'destructive',
        });
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100"> 
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className='text-center'>

          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Verify Your Account
          </h1>
          <p className="mb-4">Enter the verification code sent to your email</p>

        </div>

        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="code"
              control={form.control}
              render={({ field }) => (

                <FormItem>

                  <FormLabel>Verification Code</FormLabel>
                  <FormControl>
                  <Input {...field} />
                  </FormControl>
                  <FormMessage />

                </FormItem>
              )}
            />
            <Button type="submit">Verify</Button>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default VerifyAccount