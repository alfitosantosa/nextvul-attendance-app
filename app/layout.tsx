import { type Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { ReactQueryProvider } from "./client/providers";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "SMK Fajar Sentosa",
  description: "Sistem Informasi Sekolah",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // <ClerkProvider>
    //   <html lang="en">
    //     <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
    //       {/* <header>
    //         <SignedOut>
    //           <SignInButton />
    //           <SignUpButton />
    //         </SignedOut>
    //         <Toaster />
    //         <SignedIn>
    //           <UserButton />
    //         </SignedIn>
    //       </header> */}
    //       <ReactQueryProvider>{children}</ReactQueryProvider>
    //     </body>
    //   </html>
    // </ClerkProvider>

    <ClerkProvider>
      <html lang="en">
        <body className={`antialiased`}>
          <Toaster />
          <ReactQueryProvider>{children}</ReactQueryProvider>
          {/* {children} */}
        </body>
      </html>
    </ClerkProvider>

    // <html lang="en">
    //   <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
    //     <ReactQueryProvider>{children}</ReactQueryProvider>
    //     <Toaster />
    //   </body>
    // </html>
  );
}
