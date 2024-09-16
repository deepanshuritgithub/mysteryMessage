'use client';


import MessageCard from '@/components/MessageCard';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { Message } from '@/model/User';
import { AcceptMessageSchema } from '@/schemas/acceptMessageSchema';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { Loader2, RefreshCcw } from 'lucide-react';
import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
//so ja hm react hooks  or states wagera use krte hai to hmme client side hi bnana padta hai option nahi hai 

import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';


function UserDashboard() {

  const [messages, setMessages] = useState<Message[]>([])//btw ye honge hmare empty array as of now , but eventually eske andar jaise jaise mere pass get messages se sare messages fetch ho jayenge , eske andar push kr denge 

  //ab kya hai ki states bhi manage krne padengi to loading ki state to rhene hi wali hai 
  const [isLoading, setIsLoading] = useState(false); //ab ye to hua loading state jab mai messages fetch kr rha hu 

  //ho sakta hai mai state change kr rha hu button ki to usko bhi hm separately govern kr lete hai 
  const [isSwitchLoading, setIsSwitchLoading] = useState(false); //ab ye to hua loading state jab mai switch button click kr rha hu


  const { toast } = useToast();

  //ab kya hai ki jaise hi koi bhi user espe jata hai to vo message mai delete kra dunga , yha pe hm thda sa optimistic ui approach ko handle krte hai 
  //esme kya hota hai ki ui pe to upadate bhj do , backend pe jo hoga baad mai dekhenge or uske hisab se re update kr denge  , kyuki backend fail hone ke chances kam hai hmare 

                            //so jab bhi ye method run krega esko chiye hoga ek messageId jo ki hoga ek string format ka 
  const handleDeleteMessage = (messageId:string) => {

//esme hm kya krte hai wapis se value add krte hai pr filtering krake 
    setMessages(messages.filter((message) => message._id !== messageId));  //jo id match ho jati hai usko chd ke sab set rkho
    //ye to hogye hmari true condition, ki nahi hai, usko bhar rhene do  , or baaki sab ko add kr do 
  }

  //ab kya hai ki hmme session chahiye , kyuki user ke dashboard pe hai to session to lagega hi lagegaa  
  const {data: session } = useSession();

  const form = useForm({
    resolver: zodResolver(AcceptMessageSchema),
  })

  //ab kya hai ye jo form aa chuka hai na , ye form apne app mai bhut hi powerful hai , hmmne already dekh rkha hai , lekin es form se app bhut sari chize or extract kr sakte ho 

  //hmne kya hai ki es pure ke pure object ko hi actually mai form bol dia hai es lia hm direct useForm ko use kr rha hai , pr hm chahe to es form se register , handle submit , watch or bhut kuch nikal sakte ho

  //ye sab api hai ye given hai documantation mai  
  //ye jo register hai na ye bhi nikal lete hai taki jo values hai na hm vha se la paye
  const {register, watch, setValue } = form;

  //ab ye jo watch hai na esko apko actually mai kahi na kahi inject krna padta hai ki ki kis chiz ko watch krne wala hu 
  const acceptMessages = watch('acceptMessages'); //watch method hai , ye method kaha pe lagega jaha pe bhi mai accept messages use krungaa , ui ke andar krna padega



  //is acceptig messages or not 
  const fetchAcceptMessages = useCallback(async()=>{ //

    setIsSwitchLoading(true); //eksa mtlb hai ki ab hm message accept kr rha hai yha pe 

    try {

        const response = await axios.get<ApiResponse>('/api/accept-msessages');

        
        setValue('acceptMessages', response.data.isAcceptingMessages); //the setValue function is used to programmatically set or update the value of a form field. This is useful in scenarios where you need to update form data without direct user interaction or when the form value needs to be updated dynamically based on certain conditions.

      //setValue kya krta hai uski immediate value set kr deta hai ui ke liye 

    } catch (error) {
      
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description: axiosError.response?.data.message ??
        'failed to fetch message settings',
        //agr nahi mila to message de denge khud ka failed to something wala 
        variant: 'destructive',
      });

    } finally {
      
      setIsSwitchLoading(false); //eksa mtlb hai ki ab hm message accept nhi kr rha hai yha pe  , ab hmne button ko off kr diya hai ki hm accept nahi kr rha hai messages 
      
    }

  },[setValue , toast]);


  //fetch messages (getting messages )

  const fetchMessages = useCallback(
    //hm kya krenge simple sa, es method ko jo bhi use krega vo kya hai ki hmme ek variable bhjegaa refresh naam se jo ki hoga hmare pass mai type eska boolean , agr kuch nahi bhjta hai to by-default hm eski value false le lete hai  ki refresh nahi ho rha hai abhi kuch bhi 
    async(refresh: boolean = false) => {
      //es ke liye apko i think kuch khaas jrurat hai nahi hmme yaha pe but fir bhi app chahe to refresh ka use kr sakte hai    

      //refresh ke bhi optimization kaafi ho sakte hai , ho sakta hai already refresh ho rha ho tab mai fetch nahi krna chahun , kaafi trah ke optimization app laagaa sakte ho    

      setIsLoading(true);
      setIsSwitchLoading(false); //abhi esko bhi false kr dete hai , abhi hm kr rha hai kaam, jab hm req krenge tab hi fetch krna chiye sare messages 

      try {
          
        const response = await axios.get<ApiResponse>('/api/get-messages');

        setMessages(response.data.messages || []);

        if(refresh) {
          toast({ 
            title: 'Refreshed Messages',
            description: 'Showing latest messages',
          })
        } 
        
      } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          toast({
            title: 'Error',
            description: 
              axiosError.response?.data.message ?? 'failed to fetch messages',
            variant: 'destructive',
          })
      }
      finally {
        setIsLoading(false); //esko bhi false krna hai kyuki fetch ho chuka hai , jab sara kaam ho chuka hai to kyu hi load krate rhenaa
        setIsSwitchLoading(false);
      }

  },[ setIsLoading , setMessages, toast])

  

//fetch Initial state from the server 
useEffect(() => {
  //ye jab nahi hai mtlb authenticated nahi hai bnda 
  if(!session || !session.user ) return //sirf simple return krne se ye aagr nahi chaleyega es method ko  , to app esko sidha hi hta do es liye hmne return laga dia hai , agr ese problem hai agr session  nahi hai or session ke andar user nahi hai , to sidha hi return kr dete hai ki ye method aage hm chaleyenge hi nahi 

  // eske bases pe kya krenge simple sa kuch nhi return kr dete hai dashboard as it is hi kuch nahi milega hmme 
  fetchMessages(); //sare message mujhe fetch kr do s
      
  fetchAcceptMessages(); //es se mujhe state pta lag jayegi ki message ki state kya hai , or variable mai store bhi ho jayegi

},[session, setValue, toast, fetchMessages, fetchAcceptMessages]) //in sab pe hm dependent hai, in mai bhi agr kuch bhi change aaye to hm wapis se run krengee 


//ki hmmne kya kiya ki user ki state to lele ki app message accept kr rha ho ya nahi kr rha ho , but usko change nahi kra hai vo function bnana padega 

//Handle Switch change 
const handleSwitchChange = async() => {
  try {

      const response = await axios.post<ApiResponse>('/api/accept-messages',{ //lekin uske sath kuch data bhi to bhjoge na
        acceptMessages: !acceptMessages, //ab hm watch nahi kr rha hai, so jab hm request kr rha hai ki message accept kr rha hai 
      });

      setValue('acceptMessages',!acceptMessages); //immediately set bhi kr do ki ab hm watch nahi kr rha hai , to hmari value actual mai ui ke andar change ho jayegi , usi samay ki ab hm accept nahi kr rha hai 

      toast({
        title: response.data.message,
        variant: 'default',
      })

  } catch (error) {

      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description: axiosError.response?.data.message ?? 'failed to update message settings',
        variant: 'destructive',
      })
  }
};

//ek chhoti se chiz jo hmme dhyan rkhni hai ek conditional check krke , double return hmme krna hai 
  if(!session || !session.user) { //so agr apke pass session nahi hai , or session ke andar user nahi hai , mtlb user user-dashboard usko dikhega nahi , agr nahi dikhegaa to hm kya krenge kuch nahi dikhayenge , agr nahi hai to hm user ko aage proceed hi nahi krana chahte hai 
    return <div>Please login...</div>; //jo user nahi hoga login usko ye message mil jayega or jo nahi hogaa vo es condition mai kabhi jayega hi nahi vo sidha hi hmme else condition ke andar hi milega hmmeshaa mtlb vo authenticated hoga to usse jo return hona chiye vahi sab milegaa 
  }

  //so ab kya hai ki 2 part hmme hai , so actually mai hmme sabse phle to host url , ya fir base url construct krna padegaa ki actually mai user hai kha pe local host pe hai vercel pe koi naam pe deploy hai , custom domain pe hai to vo hmme find krna padegaa 
  //so 2sri chiz kya hai ki hmme ek url build krna padegaa 

  // profileUrl  
  // copyToClipboard
  const {username} = session?.user as User; //ye user hmme next auth se milta hai jiske pass user ka data hota hai or es session ka bhi 
  
  //so ab kya hai ki ye kyuki ek client component hai , so obvious se baat hai mere pass window object ka access hai yaha pe 
  //so yha pe variable construct kr lete hai and mujhe pata hai mere pass window object ka access hai mere pass yha pe 
  const baseUrl = `${window.location.protocol}//${window.location.  host}`   //so http hai ya https hai vo aa jayega mere pass and then // ab mujhe host chahaiye , so ab es se host se kya fyda hoga ki mere pass jo bhi uska host hai vo host value bhi aa gye hai 
  
  const profileUrl = `${baseUrl}/u/${username}`;
  
  const copyToClipboard = () => {
     ///so naviagtor ka access to apke pass hai hi kyuki app frontend ke anadr ho ,app client component ke andar ho , server component mai nahi milta hai 
    navigator.clipboard.writeText(profileUrl);
    
    toast({
      title: 'URL Copied!',
      description: 'Profile URL has been copied to your clipboard',
    })
  }


  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
        <div className="flex items-center">
          <input 
          //SO HMMNE YHA PE BASIC Input liya hai esko react hook form se govern krne ke as such kuch reason nahi hai esme hmesha hi hard coded value hogi , to hmmara form kuch bhi esme nahi kr rha hai 
            type="text"
            value={profileUrl}
            disabled 
            className="input input-bordered w-full p-2 mr-2"

            //the disabled property in an Input element diSables the input field 

            //User cannot interact with it: The field becomes uneditable, so users can't type, click, or modify its value.

            //Visually distinct: The input field usually appears "grayed out" to indicate that it's disabled and cannot be modified.

            //Form submission: The value of a disabled input field is not sent when a form is submitted.
          />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>



      <div className="mb-4">

          <Switch
          //hmmne jo switch liya hai uske andar hmmne ...register use kra , phle hmmne direct hi form use kr liya tha usske sath jo data jara tha as it is field mai hi rkh liya tha , pr kyuki yha pe ek hi data hai,a ye jo accept message hai ye merko uska naam dena tha 
            {...register('acceptMessages')} //register apne app mai object hai or uske andar value add kr do acceptMessages , or ese acceptMessages ko hm sab jagah ghuma rhe the abhi tak 
            checked={acceptMessages}
            onCheckedChange={handleSwitchChange}
            disabled={isSwitchLoading}
          />
          <span className="ml-2">
            Accept Messages: {acceptMessages ? 'On' : 'Off'}
          </span>

      </div>
      {/* to get the line we used Separator  */}
      <Separator />


      <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>

      
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message, index) => (

            <MessageCard
              key={message._id}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div>
    </div>
  );
}

export default UserDashboard;