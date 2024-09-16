'use client';
//ab ye jo provider hai actually mai client component hota hai to sabse phle to use client

import { SessionProvider } from 'next-auth/react';

export default function AuthProvider({
  children, //ab ye jo children hai thda sa issue dega kyuki isko type nahi pata hai 
}: {//mai yha pe isko bol deta hu ki hmara pass jo datatype aana wala hai jo ki children ka aayega vo ek React ki node hai  
  children: React.ReactNode;  
}) {
  return (
    <SessionProvider>
      {children} 
      {/* //yha pe bs children likh denge component ki bajaye or kuch bhi nahi krna */}
    </SessionProvider>
  );
}



