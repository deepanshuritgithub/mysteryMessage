'use client';

import React, { useState } from 'react'
import axios , { AxiosError } from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import {  useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useCompletion } from 'ai/react'
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';

import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import * as z from "zod";
import { ApiResponse } from '@/types/ApiResponse';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { messageSchema } from '@/schemas/messageSchema';


const specialChar = '||';// It's used as a separator between different parts of the string that you want to split.


//the function parseStringMessages is used to split a long string into an array of smaller things based on special characters or sequence of characters.  
                          //ye return kregaa string type ka array which means sentence based which is separated by || these two symbol , that is used as a delimiter defined as a string containing two pipe characters..('||)

                        //completion ese bola gya hai... completion is a string that is passed as an argument to the parseStringMessage function
const parseStringMessages = (messageString: string): string[] => {
  // The function returns an array of strings (string[]), which is the result of splitting the input string.

  return messageString.split(specialChar);
};
//This function is useful when you have a string that contains multiple messages or pieces of information separated by a specific delimiter (||), and you want to convert it into an array of individual messages or items for easier processing.



const initialMessageString = "what's your favorite movie? || Do you have any pets? || what's your dream job?";


function SendMessage () {
  
  const params = useParams<{username: string}>();
  const username = params.username;  //username mil gya hame url mai se esko hm bhj denge 
  const {
    complete, //Function to execute text completion based on the provided prompt. 
    completion, //The current text completion., yahi vo message hai prompt ka esko hmme parseString mai dena hai , jis se ki vo alag alag kr paye pipe based 
    isLoading : isSuggestLoading, //Boolean flag indicating whether a fetch operation is currently in progress.
    error //the error thrown during the completion process, if any 
    
  } = useCompletion({ //it is a hook which is used to interact with an ai api for text completion or suggestions 
    // The hook is making a call to an API endpoint (/api/suggest-messages) and possibly initializing with some text (initialMessageString).
    
    
    api: '/api/suggest-messages',
    initialCompletion: initialMessageString, //An optional string for the initial completion result.  //shuru mai kesa rhegaa uske liya 

  });

  //so now we have to create a form to display which type of form we want to make like using the zod , message schema typa ka hai batana padta hai form mai...
  const form = useForm<z.infer<typeof messageSchema>>({
    resolver : zodResolver(messageSchema),
  });

  const messageContent = form.watch('content');

  const handleMessageClick = (message: string) => {
      form.setValue('content', message);
  };


  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async(data: z.infer<typeof messageSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post<ApiResponse>('/api/send-message',{
        ...data,
        username,

      });
      
      toast({
        title: response.data.message,
        description: 'the content is good to send, its interesting anonymous message',
        variant: 'default',

      });
      
      form.reset({...form.getValues(), content: ''}) 
      //form ke andar ki values le le es se , or content ko delete kr dia es se hmne 
      setIsLoading(false);
      
      
    } catch (error) {


        const axiosError = error as AxiosError<ApiResponse>;

        toast({
          title:'Error',
          description: axiosError.response?.data.message ?? 'Failed to sent message',
          variant: 'destructive',
        });
        
        setIsLoading(false);
    }
  };


  const fetchSuggestedMessages = () =>{
    try {

      complete('');
      //The complete function is used to trigger a completion request, typically to an AI model like GPT. It is responsible for sending an input (often a prompt or context string) to the backend, which then communicates with the AI model to generate a completion. The response is usually streamed or returned as a full text output.
      
    } catch (error) {
      console.log('Error fetching messages:' , error);
      //handle error appropriately
    }
  }

  return (
      <div className="container mx-auto my-8 p-6 bg-white rounded max-w-4xl">
          <h1 className="text-4xl font-bold mb-6 text-center">
          Public Profile Link
          </h1>
          

          <Form {...form}>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

          <FormField
            name="content"
            control={form.control}
            render={({ field }) => (

                <FormItem>
                  <FormLabel>
                  Send Anonymous Message to @{username}
                  </FormLabel>

                  <FormControl>

                      <Textarea
                        placeholder="Write your anonymous message here"
                        className="resize-none"
                        {...field}
                      />
                      
                  </FormControl>

                  <FormMessage />
                </FormItem>

            )}
          />
              <div className='flex justify-center'>

                {
                  isLoading? (
                  <Button disabled>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Please wait...
                  </Button>

                  ) : (
                    //so jab load ho gya hai tab ka case hai , mtlb sirf ab bhjna hai 
                    <Button
                    type='submit'
                              //same case upar wala hi ki  jaise hi hai ki agr likh rha hai 
                              //agr isLoading hai tab disabled kr do , or jab content ko koi watch nahi kr rha hai tab app esko disabled kr do , or jab koi message content nahi hai tab bhi disabled kr do  
                              //jab load nahi ho ra mtlb message aa chuka hai tab hm send kra denge yahi krna hai hmme 
                    disabled={isLoading || !messageContent}
                    //so agr load ho rha hai tab disable kr do  , or message content nahi hai 
                    >
                        Send It
                    
                    </Button>
                  )
                }

              </div>
            
          </form>
          </Form>
                

              <div className='space-y-4 my-8'>

                <div className='space-y-2'>

                  <Button 
                  className='my-4'
                  onClick={fetchSuggestedMessages}
                  disabled={isSuggestLoading}
                  //ye disabled hona chiye jab load ho rha ho 
                  >
                    Suggest Messages
                  </Button>
                  <p>Click on any message below to select it.</p>
                </div>

                <Card>
                  <CardHeader>
                    <h3 className="text-xl font-semibold">
                      Messages
                    </h3>
                  </CardHeader>

                  <CardContent className="flex flex-col space-y-4">

                    {
                      error ? (
                        <p className='text-red-500'>
                          {error.message}
                        </p>
                      ) : (
                        //agr error nahi hoga to kya dikhayengee to hm message dikhayenge , jo ki hmme search completion hoke milenge 
                        //so jo string complete hoke aayi hai alag alag hoke unpe map laga rha hai , completion we can understand as jo string alag alag ho chuki hai us string ki baat ho rhi hai...


                        // The completion is a string, and it's being passed as an argument to the parseStringMessages function.
                  // Inside parseStringMessages, the string will be split into an array of smaller strings based on a special delimiter (like ||, as defined earlier).
                        parseStringMessages(completion).map((message, index) => (
                              
                          <Button 
                            key={index}
                            variant="outline"
                            className='mb-2'
                            onClick={() => handleMessageClick(message)}
                          >
                            {message}
                          </Button>

                        ))
                        
                      )}
                    
                  </CardContent>
              </Card>

              </div>
                  
              <Separator className='my-6' />

              <div className='text-center'>
                <div className='mb-4'>
                  Get Your Message Board
                </div>

                <Link href={'/sign-up'}>
                    <Button>Create Your Account</Button>
                </Link>

              </div>

              
      </div>
  )
}

export default SendMessage;                 