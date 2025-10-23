import { SignIn } from "@clerk/nextjs";

// import Logo from "@/public/logo-smkfajarsentosa.svg";

export default function Page() {
  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gray-100 flex-col">
        <div className="absolute opacity-10 bg-black ">{/* <img src={Logo.src} alt="logo" /> */}</div>
        <SignIn />
      </div>
    </>
  );
}
