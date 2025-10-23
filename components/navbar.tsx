"use client";

import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useRouter, usePathname } from "next/navigation";
import React from "react";
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
  "/dashboard/violations/student": "Pelanggaran for Siswa",
  "/dashboard/violations/teacher": "Pelanggaran for teacher",
  "/dashboard/parent": "Parent Page",
  "/dashboard/specialschedule": "Special Schedule",
  "/dashboard/teacher/schedule": "Schedule for Teacher",
  "/dashboard/student/attendance": "Attendance for Student",
  "/dashboard/student/schedule": "Schedule for Student",
  "/dashboard/calender": "Calendar for user",
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

            <Button variant="ghost" size="icon" className="relative"></Button>

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
                      <Badge variant="default" className="text-sm">
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

export function NavbarWithGroupedMenu() {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useUser();

  const { data: userData } = useGetUserByIdClerk(user?.id ?? "");
  const userRoles = userData?.role?.name;

  const handleNavigate = (value: string) => {
    router.push(value);
  };

  const permissionGroups: Record<string, string> = {
    "/": "Dashboard",
    "/dashboard": "Dashboard",
    "/dashboard/roles": "Roles Management",
    "/dashboard/clerk": "Clerk Management",
    "/dashboard/users": "User Management",
    "/dashboard/academicyear": "Akademik",
    "/dashboard/majors": "Major Management",
    "/dashboard/classes": "Class Management",
    "/dashboard/subjects": "Subject Management",
    "/dashboard/schedules": "Schedule Management",
    "/dashboard/attendance": "Attendance Management",
    "/dashboard/typeviolations": "Type Violation Management",
    "/dashboard/violations": "Violation Management",
    "/dashboard/payments": "Payment Management",
    "/teacher/schedule": "Teacher",
    "/dashboard/specialschedule": "Teacher",
    "/student/attendance/cmftrvnq5000lgq1tauteunhn": "Student View",
    "/student/schedule/cmftrvnq5000lgq1tauteunhn": "Student View",
    "/dashboard/calender": "Dashboard",
    "/dashboard/violations/student": "Siswa",
    "/dashboard/violations/teacher": "Teacher",
    "/dashboard/parent": "Dashboard",
  };

  const groupedNavigationItems = (userData?.role?.permissions || []).reduce((acc: any[], permission: string) => {
    const group = permissionGroups[permission] || "Other";
    const label = permissionLabels[permission] || permission;

    const existingGroup = acc.find((g) => g.group === group);
    if (existingGroup) {
      existingGroup.items.push({ href: permission, label });
    } else {
      acc.push({ group, items: [{ href: permission, label }] });
    }
    return acc;
  }, []);

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
              <SelectTrigger className="w-[250px]">
                <SelectValue placeholder="Pilih Menu" />
              </SelectTrigger>
              <SelectContent className="max-h-[400px]">
                {groupedNavigationItems.map((group: any) => (
                  <React.Fragment key={group.group}>
                    <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">{group.group}</div>
                    {group.items.map((item: any) => (
                      <SelectItem key={item.href} value={item.href}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </React.Fragment>
                ))}
              </SelectContent>
            </Select>

            <Button variant="ghost" size="icon" className="relative"></Button>

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
                      <Badge variant="default" className="text-sm">
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
