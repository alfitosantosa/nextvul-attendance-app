import { Bell, GraduationCap, Menu, ChevronDown } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "./ui/dropdown-menu";
import React from "react";

const userRoles = ["Admin", "Teacher"]; // Example roles, replace with actual user roles

const navigationItems = [
  { href: "/dashboard/roles", label: "Roles" },
  { href: "/dashboard/clerk", label: "Clerk" }, // Example additional item
  { href: "/dashboard/academicyear", label: "Tahun Akademik" },
  { href: "/dashboard/majors", label: "Jurusan" },
  { href: "/dashboard/classes", label: "Kelas" },
  { href: "/dashboard/attendance", label: "Absensi" },
  { href: "/dashboard/violations", label: "Pelanggaran" },
  { href: "/dashboard/payments", label: "Pembayaran" },
  { href: "/dashboard/users", label: "Users" },
  { href: "/dashboard/subjects", label: "Mata Pelajaran" },
  { href: "/dashboard/typeviolations", label: "Jenis Pelanggaran" },
  { href: "/dashboard/violations", label: "Pelanggaran" },
  // { href: "/dashboard/teachers", label: "Guru" },
  // { href: "/dashboard/students", label: "Siswa" },
];

export default function Navbar() {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo and School Info */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <GraduationCap className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">SMK Fajar Sentosa</h1>
                <p className="text-sm text-gray-500">Sistem Informasi Sekolah</p>
              </div>
            </div>
          </div>

          {/* Right Side - Navigation Dropdown, Notifications, and User */}
          <div className="flex items-center space-x-4">
            {/* Navigation Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center space-x-2">
                  <Menu className="h-4 w-4" />
                  <span>Menu</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {navigationItems.map((item, index) => (
                  <DropdownMenuItem key={item.href} asChild>
                    <a href={item.href} className="w-full cursor-pointer hover:text-blue-600 transition-colors">
                      {item.label}
                    </a>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {/* Optional notification badge */}
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
            </Button>

            {/* User Section */}
            <div className="flex items-center space-x-2">
              <div className="text-sm text-right">
                <p className="font-medium text-gray-900">Admin User</p>
                <div className="flex space-x-1 justify-end">
                  {userRoles.map((role, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {role}
                    </Badge>
                  ))}
                </div>
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
