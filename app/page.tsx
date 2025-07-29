import Navbar from "@/components/navbar";
import { Card } from "@/components/ui/card";
import { auth, currentUser } from "@clerk/nextjs/server";

export default async function Home() {
  // const { userId } = await auth();
  // if (!userId) {
  //   return <div>Sign in to view this page</div>;
  // }
  // const user = await currentUser();

  return (
    <>
      <Navbar />
      <Card className="max-w-7xl mx-auto my-8 p-6 ">
        <h1 className="text-2xl font-bold mb-4">Welcome to the Attendance App</h1>
        {/* <p className="text-gray-700">You are signed in as {user?.fullName}</p> */}
      </Card>
      <div className="grid items-center min-h-screen justify-center">{/* <div className="text-3xl font-bold ">Welcome {user?.fullName} to the Attendance App</div> */}</div>
    </>
  );
}
