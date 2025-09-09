// app/page.tsx
"use client";

import Navbar from "@/components/navbar";
import { useGetUserById } from "./hooks/useUsersById";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { User, Mail, Calendar, MapPin, Phone, GraduationCap, Building2, Shield, Clock, UserCheck, Briefcase } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

// Loading Component
const UserProfileSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <Navbar />
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Skeleton */}
        <Card className="overflow-hidden shadow-xl border-0">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-32"></div>
          <CardContent className="pt-0">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-6 -mt-16 md:-mt-12">
              <Skeleton className="w-28 h-28 rounded-full border-4 border-white shadow-2xl" />
              <div className="text-center md:text-left space-y-3 flex-1">
                <div className="space-y-2">
                  <Skeleton className="h-10 w-64 mx-auto md:mx-0" />
                  <Skeleton className="h-6 w-48 mx-auto md:mx-0" />
                </div>
                <div className="flex flex-col md:flex-row items-center gap-4">
                  <Skeleton className="h-8 w-32" />
                  <Skeleton className="h-8 w-40" />
                  <Skeleton className="h-8 w-36" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content Skeletons */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="shadow-md">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Skeleton className="w-5 h-5" />
                <Skeleton className="h-6 w-48" />
              </div>
              <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                  <Skeleton className="w-5 h-5" />
                  <div className="flex-1 space-y-1">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-4 w-full max-w-48" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Skeleton className="w-5 h-5" />
                <Skeleton className="h-6 w-48" />
              </div>
              <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                  <Skeleton className="w-5 h-5" />
                  <div className="flex-1 space-y-1">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-4 w-full max-w-48" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* System Information Skeleton */}
        <Card className="shadow-md">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Skeleton className="w-5 h-5" />
              <Skeleton className="h-6 w-48" />
            </div>
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                  <Skeleton className="w-5 h-5" />
                  <div className="flex-1 space-y-1">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
);

// Error Component
const ErrorComponent = ({ error }: { error: any }) => (
  <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100">
    <Navbar />
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <Card className="border-red-200 shadow-lg">
          <CardHeader className="text-center">
            <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
              <UserCheck className="w-8 h-8 text-red-600" />
            </div>
            <CardTitle className="text-red-900">Error Loading Profile</CardTitle>
            <CardDescription className="text-red-700">{error?.message || "Failed to load user data"}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  </div>
);

// Main Component
export default function Home() {
  const clerkUserId = "user_30GFph3K4RPkgsMUnhqdnIDOrNQ";
  const { data: user, isLoading, error } = useGetUserById(clerkUserId);

  if (isLoading) return <UserProfileSkeleton />;
  if (error) return <ErrorComponent error={error} />;

  console.log("Fetched user:", user);

  // Helper function to format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not specified";
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Helper function to get initials
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Status badge variant
  const getStatusVariant = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "default";
      case "inactive":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header Card */}
          <Card className="overflow-hidden shadow-xl border-0">
            <div
              className="bg-gradient-to-r -mt-10 from-blue-600 to-purple-600 h-32
             md:h-48"
            ></div>
            {/* Background Header */}

            {/* Profile Content */}
            <CardContent className="pt-0 px-4 md:px-6">
              <div className="flex flex-col md:flex-row items-center md:items-end gap-4 md:gap-6 -mt-20 md:-mt-12">
                {/* Avatar */}
                <div className="relative">
                  <Avatar className="w-32 h-32 md:w-28 md:h-28 border-4 border-white shadow-2xl ring-2 ring-blue-100">
                    <AvatarImage src={user?.avatarUrl} alt={user?.name} className="object-cover" />
                    <AvatarFallback className="text-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">{getInitials(user?.name || "User")}</AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 border-4 border-white rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                </div>

                {/* User Info */}
                <div className="text-center md:text-left flex-1 space-y-3 w-full">
                  <div className="space-y-2">
                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3">
                      <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">{user?.name}</h1>
                      {user?.status && (
                        <Badge variant={getStatusVariant(user?.status)} className="w-fit mx-auto md:mx-0 px-3 py-1 font-medium shadow-sm">
                          <div className="w-2 h-2 rounded-full bg-current mr-2"></div>
                          {user?.status?.charAt(0).toUpperCase() + user?.status?.slice(1)}
                        </Badge>
                      )}
                    </div>
                    <p className="text-lg md:text-xl text-gray-600 font-medium">{user?.position || "Position not specified"}</p>
                  </div>

                  {/* Meta Info */}
                  <div className="flex flex-col md:flex-row items-center gap-3 md:gap-4 text-sm text-gray-500">
                    {user?.role?.name && (
                      <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-full">
                        <Shield className="w-4 h-4 text-blue-600" />
                        <span className="font-medium">{user.role.name}</span>
                      </div>
                    )}
                    {user?.employeeId && (
                      <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-full">
                        <Briefcase className="w-4 h-4 text-purple-600" />
                        <span className="font-medium">ID: {user.employeeId}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-full">
                      <Calendar className="w-4 h-4 text-green-600" />
                      <span className="font-medium">Since {formatDate(user?.startDate)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Personal Information */}
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  Personal Information
                </CardTitle>
                <CardDescription>Basic personal details and contact information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                  <Mail className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{user?.email || "Not provided"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                  <User className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-500">Gender</p>
                    <p className="font-medium">{user?.gender === "L" ? "Laki-laki" : user?.gender === "P" ? "Perempuan" : "Not specified"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                  <MapPin className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="font-medium">{user?.address || "Not provided"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                  <Phone className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-500">Parent Phone</p>
                    <p className="font-medium">{user?.parentPhone || "Not provided"}</p>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                  <Calendar className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-500">Birth Date</p>
                    <p className="font-medium">{formatDate(user?.birthDate)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                  <MapPin className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-500">Birth Place</p>
                    <p className="font-medium">{user?.birthPlace || "Not provided"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Professional Information */}
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-green-600" />
                  Professional Information
                </CardTitle>
                <CardDescription>Work-related details and academic information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50">
                  <Briefcase className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm text-green-600">Position</p>
                    <p className="font-medium text-green-800">{user?.position || "Not specified"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50">
                  <Shield className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm text-green-600">Role</p>
                    <p className="font-medium text-green-800">{user?.role?.name || "Not specified"}</p>
                    {user?.role?.description && <p className="text-sm text-green-600">{user.role.description}</p>}
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50">
                  <Calendar className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm text-green-600">Start Date</p>
                    <p className="font-medium text-green-800">{formatDate(user?.startDate)}</p>
                  </div>
                </div>

                {user?.endDate && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50">
                    <Calendar className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-sm text-green-600">End Date</p>
                      <p className="font-medium text-green-800">{formatDate(user?.endDate)}</p>
                    </div>
                  </div>
                )}

                <Separator className="my-4" />

                <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50">
                  <GraduationCap className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-blue-600">Academic Information</p>
                    <p className="font-medium text-blue-800">{user?.class ? `Class: ${user.class}` : "No class assigned"}</p>
                    {user?.major && <p className="text-sm text-blue-600">Major: {user.major}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* System Information */}
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-purple-600" />
                System Information
              </CardTitle>
              <CardDescription>Account creation and last update information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-purple-50">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="text-sm text-purple-600">Created At</p>
                    <p className="font-medium text-purple-800">{formatDate(user?.createdAt)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-purple-50">
                  <Clock className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="text-sm text-purple-600">Last Updated</p>
                    <p className="font-medium text-purple-800">{formatDate(user?.updatedAt)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-purple-50">
                  <User className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="text-sm text-purple-600">User ID</p>
                    <p className="font-medium text-purple-800 text-xs break-all">{user?.id}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
