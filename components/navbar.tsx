"use client";

import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useRouter, usePathname } from "next/navigation";
import { SignedIn, SignInButton, SignedOut, SignUpButton, UserButton } from "@clerk/nextjs";
import { useUser } from "@clerk/clerk-react";
import Logo from "@/public/logo-smkfajarsentosa.svg";
import { useGetUserByIdClerk } from "@/app/hooks/useUsersByIdClerk";

const permissionLabels: Record<string, string> = {
  "/": "Home",
  "/dashboard": "Dashboard ",
  "/dashboard/roles": "Roles Management",
  "/dashboard/clerk": "Clerk Management",
  "/dashboard/users": "Users Management",
  "/dashboard/academicyear": "Academic Year Management",
  "/dashboard/majors": "Major Management",
  "/dashboard/classes": "Class Management",
  "/dashboard/subjects": "Subject Management",
  "/dashboard/schedules": "Schedule Management",
  "/dashboard/attendance": "Attendance Management",
  "/dashboard/typeviolations": "Jenis Pelanggaran Management",
  "/dashboard/violations": "Pelanggaran Management",
  "/dashboard/payments": "Pembayaran",
  "/dashboard/specialschedule": "Special Schedule",
  "/dashboard/calender": "Calendar for user",
  "/dashboard/calender/teacher": "Calendar for Teacher",
  "/dashboard/calender/student": "Calendar for Student",
  "/dashboard/parent": "Parent Page",
  "/dashboard/violations/student": "Pelanggaran for Siswa",
  "/dashboard/violations/teacher": "Pelanggaran for teacher",
  "/dashboard/teacher/schedule": "Schedule for Teacher",
  "/dashboard/student/attendance": "Attendance for Student",
  "/dashboard/student/schedule": "Schedule for Student",
};

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  //get userdata from clerk
  const { user } = useUser();
  const { data: userData } = useGetUserByIdClerk(user?.id ?? "");
  const userRoles = userData?.role?.name;

  const handleNavigate = (value: string) => {
    router.push(value);
  };

  const navigationItems = (userData?.role?.permissions || []).map((permission: string) => ({
    href: permission,
    label: permissionLabels[permission] || permission,
  }));

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <img src={Logo.src} alt="Logo SMK Fajar Sentosa" className="h- w-10" />
              <div className="hidden md:block">
                <h1 className="text-xl font-bold text-gray-900">SMK Fajar Sentosa</h1>
                <p className="text-sm text-gray-500">Sistem Informasi Sekolah</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Select onValueChange={handleNavigate} value={pathname}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Pilih Menu" />
              </SelectTrigger>
              <SelectContent>
                {navigationItems.map((item: { href: string; label: string }) => (
                  <SelectItem key={item.href} value={item.href}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex items-center space-x-2">
              <div className="text-sm text-right">
                <header className="flex justify-end items-center p-4 gap-4 h-16">
                  <SignedOut>
                    <SignInButton />
                    <SignUpButton>
                      <Button>Sign Up</Button>
                    </SignUpButton>
                  </SignedOut>
                  <SignedIn>
                    <div className="space-x-1 justify-end hidden md:block">
                      <Badge variant="secondary" className="text-lg">
                        {userRoles}
                      </Badge>
                    </div>
                    <UserButton />
                  </SignedIn>
                </header>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
