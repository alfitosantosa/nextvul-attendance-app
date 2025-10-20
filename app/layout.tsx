import { type Metadata } from "next";
import { ClerkProvider, SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ReactQueryProvider } from "./client/providers";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
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
