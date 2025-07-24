import { Bell, GraduationCap, User } from "lucide-react";
import { Button } from "./ui/button";
import { UserButton } from "@clerk/nextjs";

export default function Navbar() {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <GraduationCap className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">SMK Fajar Sentosa</h1>
                <p className="text-sm text-gray-500">Sistem Informasi Sekolah</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <div className="flex items-center space-x-2">
              {/* <UserButton /> */}
              <div className="text-sm">
                {/* <p className="font-medium">Admin User</p> */}
                <div className="flex space-x-1">
                  {/* {userRoles.map((role, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {role}
                    </Badge>
                  ))} */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
