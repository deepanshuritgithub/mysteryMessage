import Navbar from "@/components/Navbar";

export default function RootLayout({children}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      {children}
    </div>
  );
}

//es layout ke andar hmme authProviders wagera ki jrurat nahi hai , bhar wala mai hi sab kuch aa gya to hmara auth provider usii mai wrap ho gyaa , navbar ko hi sirf hmm internal mai move kr dete hai to jada thik rheta hai 