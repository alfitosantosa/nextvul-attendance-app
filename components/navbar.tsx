"use client";

import { Bell, GraduationCap, Menu, ChevronDown, Check } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useRouter, usePathname } from "next/navigation";
import React from "react";
import { SignedIn, SignInButton, SignedOut, SignUpButton, UserButton } from "@clerk/nextjs";
import { useUser } from "@clerk/clerk-react";

import Logo from "@/public/logo-smkfajarsentosa.svg";
import { useRolesByIdUser } from "@/app/hooks/useRolesByIdUser";
import { useGetUserByIdClerk } from "@/app/hooks/useUsersByIdClerk";
import { User } from "@clerk/nextjs/server";

// Example roles, replace with actual user roles

const navigationItems = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/roles", label: "Roles" },
  { href: "/dashboard/clerk", label: "Clerk" },
  { href: "/dashboard/users", label: "Users" },
  { href: "/dashboard/academicyear", label: "Tahun Akademik" },
  { href: "/dashboard/majors", label: "Jurusan" },
  { href: "/dashboard/classes", label: "Kelas" },
  { href: "/dashboard/subjects", label: "Mata Pelajaran" },
  { href: "/dashboard/schedules", label: "Jadwal Pelajaran" },
  { href: "/dashboard/attendance", label: "Absensi" },
  { href: "/dashboard/typeviolations", label: "Jenis Pelanggaran" },
  { href: "/dashboard/violations", label: "Pelanggaran" },
  { href: "/dashboard/payments", label: "Pembayaran" },
  { href: "/teacher/schedule", label: "Schedule for Teacher" },
  { href: "/dashboard/specialschedule", label: "Special Schedule" },
  { href: "/student/attendance/cmftrvnq5000lgq1tauteunhn", label: "Attendance for Student" },
  { href: "/student/schedule/cmftrvnq5000lgq1tauteunhn", label: "Schedule for Student" },
  { href: "/dashboard/calender", label: "Calendar for user" },
  { href: "/dashboard/violations/student", label: "Pelanggaran for Siswa" },
  { href: "/dashboard/violations/teacher", label: "Pelanggaran for teacher" },
  { href: "/dashboard/parent", label: "Parent Page" },
];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  // Handler untuk navigasi saat menu dipilih
  const handleNavigate = (value: string) => {
    router.push(value);

    //get users role
  };

  const { user } = useUser();

  const { data: userData } = useGetUserByIdClerk(user?.id ?? "");
  const userRoles = userData?.role?.name;

  console.log(userData);

  console.log(userData?.role?.permissions);

  //   [
  //     "dashboard_admin",
  //     "attendance_for_teacher",
  //     "attendance_for_student",
  //     "violation_for_student",
  //     "dashboard_parent",
  //     "dashboard_attendance",
  //     "attendance_for_Student",
  //     "violation_for_teacher",
  //     "payment_for_student"
  // ]

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo and School Info */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <img src={Logo.src} alt="Logo SMK Fajar Sentosa" className="h- w-10" />
              <div className="hidden md:block">
                <h1 className="text-xl font-bold text-gray-900">SMK Fajar Sentosa</h1>
                <p className="text-sm text-gray-500">Sistem Informasi Sekolah</p>
              </div>
            </div>
          </div>

          {/* Right Side - Navigation Dropdown, Notifications, and User */}
          <div className="flex items-center space-x-4">
            {/* Navigation Menu Select */}
            <Select onValueChange={handleNavigate} value={pathname}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Pilih Menu" />
              </SelectTrigger>
              <SelectContent>
                {navigationItems.map((item) => (
                  <SelectItem key={item.href} value={item.href}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {/* Optional notification badge */}
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
            </Button>

            {/* User Section */}
            <div className="flex items-center space-x-2">
              <div className="text-sm text-right">
                {/* <p className="font-medium text-gray-900">Admin User</p> */}

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
              {/* Placeholder for UserButton when available */}
              {/* <UserButton /> */}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

// ===== ALTERNATIVE VERSION: With Grouped Menu =====
// Jika ingin menu dikelompokkan berdasarkan kategori

export function NavbarWithGroupedMenu() {
  const router = useRouter();
  const pathname = usePathname();

  const groupedNavigationItems = [
    {
      group: "Dashboard",
      items: [
        { href: "/", label: "Home" },
        { href: "/dashboard", label: "Dashboard" },
      ],
    },
    {
      group: "User Management",
      items: [
        { href: "/dashboard/roles", label: "Roles" },
        { href: "/dashboard/clerk", label: "Clerk" },
        { href: "/dashboard/users", label: "Users" },
      ],
    },
    {
      group: "Akademik",
      items: [
        { href: "/dashboard/academicyear", label: "Tahun Akademik" },
        { href: "/dashboard/majors", label: "Jurusan" },
        { href: "/dashboard/classes", label: "Kelas" },
        { href: "/dashboard/subjects", label: "Mata Pelajaran" },
        { href: "/dashboard/schedules", label: "Jadwal Pelajaran" },
      ],
    },
    {
      group: "Siswa",
      items: [
        { href: "/dashboard/attendance", label: "Absensi" },
        { href: "/dashboard/typeviolations", label: "Jenis Pelanggaran" },
        { href: "/dashboard/violations", label: "Pelanggaran" },
        { href: "/dashboard/payments", label: "Pembayaran" },
      ],
    },
    {
      group: "Teacher",
      items: [
        { href: "/teacher/schedule", label: "Schedule for Teacher" },
        { href: "/dashboard/specialschedule", label: "Special Schedule" },
      ],
    },
    {
      group: "Student View",
      items: [
        { href: "/student/attendance/cmftrvnq5000lgq1tauteunhn", label: "Attendance" },
        { href: "/student/schedule/cmftrvnq5000lgq1tauteunhn", label: "Schedule" },
      ],
    },
  ];

  const handleNavigate = (value: string) => {
    router.push(value);
  };

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
            <Select onValueChange={handleNavigate} value={pathname}>
              <SelectTrigger className="w-[250px]">
                <SelectValue placeholder="Pilih Menu" />
              </SelectTrigger>
              <SelectContent className="max-h-[400px]">
                {groupedNavigationItems.map((group) => (
                  <React.Fragment key={group.group}>
                    <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">{group.group}</div>
                    {group.items.map((item) => (
                      <SelectItem key={item.href} value={item.href}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </React.Fragment>
                ))}
              </SelectContent>
            </Select>

            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
            </Button>

            <div className="flex items-center space-x-2">
              <div className="text-sm text-right">
                <p className="font-medium text-gray-900">Admin User</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
