'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import dayjs from 'dayjs';
import { Button } from "./ui/button";
import { X } from "lucide-react";
import { Message } from "@/model/User";
import { useToast } from "./ui/use-toast";
import axios ,{AxiosError} from "axios";
import { ApiResponse } from "@/types/ApiResponse";

type MessageCardProps = {

  message: Message; //ek message aayega jiska type hoga message which we got from models 
  onMessageDelete: (messageId: string) => void;
  //ye mere pass ek method aayega jo return kya krta hai mujhe uss se koi mtlb nahi to void likh dete hai , eske andar mere pass messageId milegi jo ki hogi string type ki 
}


          // jab bhi es card ko use kroge to kuch property ya data hai jo mujhe pass on krna padegaa , phli baat to message kya message hai, or ek method dena padega onMessageDelete , obvious se baat hai card alag alag jagah use hoga to vha pe koi delete pe click krega to vo message id wagera ya jo bhi onMessageDelete hai vha ka vo message mujhe pass kr dena to mera kaam ho jayegaa 
  function MessageCard({message , onMessageDelete}: MessageCardProps) {//ab yha pe mai isko define kr sakta hu or bol sakta hu ki apka jo datatype hai na mujhe pta hai , ki apka jo datatype hai na vo hai messageCardProps

  const { toast } = useToast();


  const handleDeleteConfirm = async () => {
    try {
                                      //Axios kya krega ye ek simple sa method hai ye ek request fire kregaa kha pe /api/delete-message pe 
        const response = await axios.delete<ApiResponse>(
          `/api/delete-message/${message._id}`
        ); //kese kya krne hai vo backend mai check kr lenge abhi app bs hmme message id pass on kr do 
        
        toast({
          title: response.data.message, // backend se send kr denge hm message
        });
        
        onMessageDelete(message._id);
        
    } catch (error) {

        const axiosError = error as AxiosError<ApiResponse>;
        toast({
          title: 'Error',
          description: axiosError.response?.data.message?? 'Failed to delete message',
          variant: 'destructive',
        })
        
    }
  }


  return (
    <Card>
    <CardHeader>
      <div className="flex justify-between items-center">
        
      <CardTitle>{message.content}</CardTitle>
      <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">
            <X className="w-5 h-5" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleDeleteConfirm}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
      </div>
      <div className="text-sm">
      {dayjs(message.createdAt).format('MMM D, YYYY h:mm A')}
      </div>

    </CardHeader>
    <CardContent></CardContent>
    
  </Card>
  
  )
}

export default MessageCard