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

  //ab kya chiyega ab hmme chiyega ek hook , kyuki username ko bhi bhjna padega kahi na kahi or username wapis bhi aayega 
  const debounced = useDebounceCallback(setUsername, 500);//usedebouncevalue krne se value immediately set nahi hogi , jab apne time diya na uss time ke baad set hogi , 300 milliseconds baad check kr lenge hm 
  //immmediately username ke andar jo value set kr rha hai directly field se set nahi krenge hm , thda sa debouncing use krke vha pe set krengee , hmme jab bhi check krna hogaa debounced ke andar jo value aayegi uss hisab se hm check krengee , immedately jo state ke andar change ho rha hai uss hisab se nahi krte , hm debounce ke hisab se krte hai , thik hai username apne enter kiya vo change ho gyaa , but mai jo request fire krunga backend pe , vo debounced way mai krungaa , es variable ke through debounced username ke through 

  //so agr username se krunga to kya hoga , hoga kuch nahi jaise hi key press krunga firse ek req  then fir req jatii jayegi , thda server load ho sakta hai 



  const router = useRouter();
  const { toast } = useToast()

  //dekhiye kis trah se hm yha pe zod ka implementation krte hai , ye exactly same hai , ek baar smjh aa gya to har jagah ese hi use krna hai 

  //zod implementation
  //sbase phle to hmme chiye hota hai ek form , es form variable ka naam kuch bhi ho sakta hai , alag alag jagah pe es variable ka naam alag alag dikhegaa 
  //kuch log register bhi bolte hai , hmmene react mai bhi dekha tha 
                    //yeh jo z aaya hai na , eske pass ke or option hota hai ki ye infer kra sakta hai ki kis type ki value mere pass aayegi, usko bhi app chaho to infer kra ke app bol sakta ho , ki mere pass jo value aayegi uska jo type of hai vo hai sign up schema

                    //to ye 100 percent surety ho jatti hai ki es form se jo resolver value degaa , vo es schema ko follow krne chahiyee 
  const form = useForm<z.infer<typeof signUpSchema>>({ //ab es useForm ka kaam ye hai ki eske andar app resolvers add kr sakta ho , jaise for example mai yha aata hu 

    
    resolver: zodResolver(signUpSchema), //resolver apko konsa use krna hai YE HMARe upar hai , mujhe abhi zod resolver use krna hai , zod resolver apne app mai kaam nhai krta hai usko chiye hota hai ek schemaa , hmara pass schema available hai signupschema
    //ek or step hota hai form ka , ki form ki default state kese rhegii , kai baar ho sakta hai app form ke andar kuch values by default insert kra ke rkhna chahta ho , yha ho sakta hai usko empty rkhna chahte ho , ho sakta hai jab request aayi ho , ap us form ko clean up krna chahta hu 
    defaultValues: {
      //default values mai kya kya control krna hai ye apke upar hai 
      username: '', 
      email: '',  
      password: '',
      //agr apke pass or bhi bada form hai app yha pe aaiyee , or default values add kr dijiye, schema agr apko or bhi krna hai to or bhi schemas add kr sakte ho 
    },
  })

  //ab aate hai hmare ek hook pe or ye use effect hook hm es lia likh rha hai ki mai chahta hu jaise hi username value field change ho , user uske andar type kre , debouncuing krenge , pr lekin uske baad backend pe ek req to jaani chaiye , jo mujhe btaye username available hai ya nahi hai ,, eske intejam bhi kr rkha hai check username unique naam ka route bnaya tha , kuch nhi krta hai bs ek get method hai databse mai connect hota hai kr or apke search params mai APKO username mil jaata hai  , OR YE PTA KRKE BATATA HAU APKE PASS vo username available hai ya nahi hai , bs itna sa kaam hai iska , so esko utilize krna chahta hu mai kab utilize krungaa 

  //so jab page load hoga tabhi utilize kr lenge ek baar to , ek jaise hi mere username ki value change hoti hai , lekin baat ye hai ki har baar username ki value nahi, debounce username ki value change honi chahiye 

  //yha pe kya hai ki flow smjhna bhut jruri hai , actually mai debouncing to use ho rhi hai , debouncing bjaye use hone ke ki jab method fire kr rha ho  vha use ho , uski jagh jab hm apni state mai value set kr rha hai , ab vha pe debouncing use ho rhi hai , debouncing ka kull milake kaam yahi hai , ki koi bhi chiz jab ho rhi ho usme delay add kr doo 

  useEffect(()=> {
      
      //to checek toast is working or not 
      // toast({
      // title: "Test Toast",
      // description: "This is a test toast message",
      // });


      //ab chiye ki username check kese krna hai , username check kese krenge vo bhi dekhna padegaa , itna jyada kuch complex kaam nahi hai username check krna 
      const checkUsernameUnique = async () => {
        //lekin ab kya hai ki mere value hi late set ho rhi hai , to debounced username ki jrurat hi nhi hai , hm directly hi username use kr sakta hai , kyuki esme value, aayegi hi late..
        if(username) {
          setIsCheckingUsername(true);
          setUsernameMessage('');//reset message  

              try {
                    const response = await axios.get<ApiResponse>(
                      `/api/check-username-unique?username=${username}`
                      // /api kyu , kyuki user url jo hai na next js na automatically prepend kr deta hai apki request , jha bhi apko req bhjni hai app sidha hi / se bhjta hai , domain name apka already added hai , port hai to port bhi added hai , agr app deploy krte hai to vha pe bhi added hai 
                      //query params kese likhte hai sidha hi ? laga dete hai  or bol dete hai jo bhi apne value rakhi ho , uske andar hm ye variable inject kr dete hai debounc username walaa
                    );
                    //agr hmare pass message aa hi jata hai to sidha use kr lo setUsernameMessage to set the message eske andar hmme add krna hai ki response kr andar hmare pass mai data aata hai , or uske baad uss data mai se jitna bhi message apne backend se bhja hai vo app extract kra sakta ho 
                    setUsernameMessage(response.data.message);
                
              } catch (error) { 
                                  //ye error aayenge kha se , ye jo apke pass error hai na esko app as a axios error ki trah cast kr do
                    const axiosError = error as AxiosError<ApiResponse>;
                    //abb ap chaho to axios ki error ko bhi handle kr sakte ho,
                    setUsernameMessage(
                      axiosError.response?.data.message ?? 'Error checking username'

                      //agr ye nahi aaye to hm kya krte hai , hm yha pe option lagake apna hi message de dete hai 
                    );

              }
              finally {
                    setIsCheckingUsername(false);//agr apko ye finally nahi krna hai to app es line ko dono mai likh sakte ho try mai bhi , or catch mai bhi , otherwise app finally bhi use kr sakte ho or bta sakte ho ki ye to aob run hoga hi hogaa , ki user ab check nahi ho rha hai 
              }
              
            }
      }
      checkUsernameUnique();

  }, [username]);

  //hmne zod ko pura resolve kr liya hai 
  //hmne req krna sikh liya hai database mai , get request , ese trrah se post bhi hogaa  , ab hm sikh lete hai hmmara submit method kese kaam kregaa ,
  // submit method ka mamlla pata hai kya hai ki kai logo ko confusion hota hai , kai logo ko lagta hai ki ye jo react hook form use krte hai , to vha pe apko ek submit handler bhi milta hai or ese ko use krna hota hai m kyki default hm yha pe data nahi de sakte , submit handler ke through hote hue hmmare pass ye aata hai, submit handler automatically kuch magic nahi krta hai , es se apko bs data nikalna hota hai 


  //actually mai ab dekhte hai ki jab app form submit kroge to , tab kesa kaam hogaa 
    ///on submit ke andar kya hai ki apko data milta hai , app chaho to zod se bhi verify wagara kra sakta ho ,
    // ye data hai kaha se  , ya data apko milta hai handle submit ke through , jha pe jo sari default values hai vo mil jaati hai 
                          //ye jo data hai na esko app chaho to wapis se infer kra sakte ho Zod se 
                          //datatype konsa lenge zod se lenge , zod ke pass hai ek infer , or kis type ka infernce krana chahta hai , typeof jo hai hhmare data ka vo hai signupschema 
  const onSubmit = async (data: z.infer<typeof signUpSchema>) =>  {
    setIsSubmitting(true);

    try {
      
      const response = await axios.post<ApiResponse>(
        '/api/sign-up', data
      );
      //thik hai ab agr sab kaam ho rha hai to hm ek toast message user ko dikha dete hai ki kis trah se apko sara kaam krna hai , ab hm yha pe toast use kr sakte hai 
      toast({
        title: 'Success', //ye success hmme optionally check krna chiye tha ki data ke andar actually mai success aaya hai ya nahi 
        description: response.data.message,
      });
      //toast message ke aane ke baad fir mai router use krke , router.replace kr dungaa , app chaho to redirect bhi use kr sakte ho , but mai replace use kr leta hu 
      router.replace(`/verify/${username}`);
      //ye es kiye kr rha hai kyuki user ko maine mail kr diia hai , user chala jayegaa , uska baad verify code mai hm jayenge to /verify/username mai ek page bana lungaa . vha se mai verify code ki request krungaa, uske andar fyda mere pass ye hai ki, ye jo username hai na , ye bhi merko mil jayegaa or code bhi mil jayegaa , to vo jo page hai na jo hm bnayenge usi ke andar mai extract kr lungaa username url se , or code vo enter kregaa hi , to dono ko mai ek sath bhj dungaa , ye hmari thdi se strategy hai 

      setIsSubmitting(false);

    } catch (error) {

      console.error('Error during sign-up of user:', error);

      const axiosError = error as AxiosError<ApiResponse>;

       // Default error message
      let errorMessage = axiosError.response?.data.message;
      ('There was a problem with your sign-up. Please try again.');

      toast({
        title: 'Sign Up Failed',
        description: errorMessage,
        variant: 'destructive',
      }) 

      setIsSubmitting(false);
    }

  }


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
