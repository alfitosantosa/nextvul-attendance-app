// app/page.tsx
"use client";

import Navbar from "@/components/navbar";
import { useGetUserByIdClerk } from "./hooks/useUsersByIdClerk";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { User, Mail, Calendar, MapPin, Phone, GraduationCap, Building2, Shield, Clock, UserCheck, Briefcase, Star, Award, CheckCircle, AlertCircle, UserX, MessageSquare, CheckCircle2, UserCog, ExternalLink } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@clerk/clerk-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

const NoUserDataComponent = ({ clerkUser }: { clerkUser: any }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-20">
        <div className="max-w-4xl mx-auto">
          {/* Main Alert Card */}
          <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm overflow-hidden">
            {/* Header with gradient */}
            <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 p-6 lg:p-8">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-20 h-20 lg:w-24 lg:h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
                  <UserX className="w-10 h-10 lg:w-12 lg:h-12 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl lg:text-4xl font-bold text-white mb-2">Akun Belum Terhubung</h1>
                  <p className="text-white/90 text-base lg:text-lg">Akun Clerk Anda belum terhubung dengan sistem sekolah</p>
                </div>
              </div>
            </div>

            <CardContent className="p-6 lg:p-8 space-y-6">
              {/* User Info from Clerk */}
              {clerkUser && (
                <Alert className="border-blue-200 bg-blue-50/50">
                  <Shield className="h-5 w-5 text-blue-600" />
                  <AlertTitle className="text-blue-900 font-semibold">Informasi Akun Clerk</AlertTitle>
                  <AlertDescription className="text-blue-800 mt-2 space-y-1">
                    <p>
                      <strong>Nama:</strong> {clerkUser.fullName || clerkUser.firstName}
                    </p>
                    <p>
                      <strong>Email:</strong> {clerkUser.primaryEmailAddress?.emailAddress}
                    </p>
                    <p>
                      <strong>Clerk ID:</strong> <code className="bg-blue-100 px-2 py-1 rounded text-xs">{clerkUser.id}</code>
                    </p>
                  </AlertDescription>
                </Alert>
              )}

              {/* What's Happening */}
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <AlertCircle className="w-6 h-6 text-orange-600" />
                  Apa yang Terjadi?
                </h2>
                <div className="bg-gray-50 rounded-xl p-5 space-y-3">
                  <p className="text-gray-700 leading-relaxed">
                    Anda telah berhasil login menggunakan akun Clerk, namun akun Anda
                    <strong className="text-orange-600"> belum terdaftar </strong>
                    dalam sistem database sekolah kami.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    Untuk dapat mengakses fitur-fitur sistem seperti absensi, jadwal, dan data akademik, akun Clerk Anda perlu
                    <strong className="text-blue-600"> dihubungkan dengan data user </strong>
                    di sistem oleh administrator.
                  </p>
                </div>
              </div>

              {/* Steps to Resolve */}
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                  Langkah Selanjutnya
                </h2>
                <div className="space-y-3">
                  {[
                    {
                      number: "1",
                      title: "Hubungi Administrator",
                      description: "Kirimkan permintaan ke admin untuk menghubungkan akun Clerk Anda",
                      color: "from-blue-500 to-cyan-500",
                    },
                    {
                      number: "2",
                      title: "Berikan Informasi",
                      description: "Sampaikan Clerk ID dan email Anda kepada administrator",
                      color: "from-purple-500 to-pink-500",
                    },
                    {
                      number: "3",
                      title: "Tunggu Konfirmasi",
                      description: "Admin akan menghubungkan akun Anda dengan data di sistem",
                      color: "from-green-500 to-emerald-500",
                    },
                  ].map((step) => (
                    <div key={step.number} className="flex gap-4 p-4 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 hover:shadow-md transition-all duration-300">
                      <div className={`flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center text-white font-bold shadow-lg`}>{step.number}</div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{step.title}</h3>
                        <p className="text-sm text-gray-600">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <MessageSquare className="w-6 h-6 text-blue-600" />
                  Hubungi Administrator
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Email Card */}
                  <Card className="border-2 border-blue-100 hover:border-blue-300 transition-all duration-300 hover:shadow-lg">
                    <CardContent className="p-5">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-blue-100 rounded-lg">
                          <Mail className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                          <p className="text-sm text-gray-600 mb-3">Kirim email ke administrator</p>
                          <Button variant="outline" size="sm" className="w-full border-blue-300 text-blue-600 hover:bg-blue-50" onClick={() => (window.location.href = "mailto:admin@school.com")}>
                            <Mail className="w-4 h-4 mr-2" />
                            admin@school.com
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Phone Card */}
                  <Card className="border-2 border-green-100 hover:border-green-300 transition-all duration-300 hover:shadow-lg">
                    <CardContent className="p-5">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-green-100 rounded-lg">
                          <Phone className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">Telepon</h3>
                          <p className="text-sm text-gray-600 mb-3">Hubungi via telepon</p>
                          <Button variant="outline" size="sm" className="w-full border-green-300 text-green-600 hover:bg-green-50" onClick={() => (window.location.href = "tel:+6281234567890")}>
                            <Phone className="w-4 h-4 mr-2" />
                            +62 812-3456-7890
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Admin Portal Link */}
              {/* <Alert className="border-purple-200 bg-purple-50/50">
                <UserCog className="h-5 w-5 text-purple-600" />
                <AlertTitle className="text-purple-900 font-semibold">Untuk Administrator</AlertTitle>
                <AlertDescription className="text-purple-800 mt-2">
                  <p className="mb-3">Jika Anda adalah administrator, silakan hubungkan akun Clerk ini dengan user di dashboard.</p>
                  <Button variant="outline" size="sm" className="border-purple-300 text-purple-600 hover:bg-purple-100" onClick={() => (window.location.href = "/dashboard/users")}>
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Buka Dashboard Users
                  </Button>
                </AlertDescription>
              </Alert> */}

              {/* Status Badge */}
              <div className="flex items-center justify-center pt-4">
                <Badge variant="secondary" className="px-4 py-2 text-sm bg-orange-100 text-orange-800 border border-orange-200">
                  <Clock className="w-4 h-4 mr-2" />
                  Status: Menunggu Aktivasi
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Additional Help Card */}
          <Card className="mt-6 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-blue-600" />
                Butuh Bantuan Lebih Lanjut?
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Jika Anda mengalami kesulitan atau memiliki pertanyaan, silakan hubungi bagian IT Support sekolah atau datang langsung ke ruang admin. Bawa informasi akun Clerk Anda untuk mempercepat proses aktivasi.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Loading Component
const UserProfileSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
    <Navbar />
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Skeleton */}
        <Card className="overflow-hidden shadow-2xl border-0 backdrop-blur-sm bg-white/90">
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 h-40 lg:h-48 relative">
            <div className="absolute inset-0 bg-black/10"></div>
          </div>
          <CardContent className="pt-0 px-6 lg:px-8">
            <div className="flex flex-col xl:flex-row items-center xl:items-end gap-6 xl:gap-8 -mt-20 lg:-mt-24">
              <Skeleton className="w-32 h-32 lg:w-40 lg:h-40 rounded-full border-4 border-white shadow-2xl" />
              <div className="text-center xl:text-left space-y-4 flex-1">
                <div className="space-y-3">
                  <Skeleton className="h-12 lg:h-16 w-72 lg:w-96 mx-auto xl:mx-0" />
                  <Skeleton className="h-6 lg:h-8 w-56 lg:w-72 mx-auto xl:mx-0" />
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center xl:justify-start gap-3">
                  <Skeleton className="h-9 w-28" />
                  <Skeleton className="h-9 w-36" />
                  <Skeleton className="h-9 w-32" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content Skeletons */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {[1, 2].map((card) => (
            <Card key={card} className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-6 h-6" />
                  <Skeleton className="h-7 w-52" />
                </div>
                <Skeleton className="h-5 w-72" />
              </CardHeader>
              <CardContent className="space-y-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-gray-50/80">
                    <Skeleton className="w-5 h-5" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-5 w-48" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* System Information Skeleton */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <Skeleton className="w-6 h-6" />
              <Skeleton className="h-7 w-52" />
            </div>
            <Skeleton className="h-5 w-72" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-gray-50/80">
                  <Skeleton className="w-5 h-5" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-5 w-36" />
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
  <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-rose-50">
    <Navbar />
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="max-w-lg mx-auto">
        <Card className="border-red-200 shadow-2xl bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center pb-8">
            <div className="w-20 h-20 mx-auto bg-gradient-to-r from-red-400 to-pink-500 rounded-full flex items-center justify-center mb-6 shadow-lg">
              <UserCheck className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-2xl text-red-900 mb-2">Error Loading Profile</CardTitle>
            <CardDescription className="text-red-700 text-lg">{error?.message || "Failed to load user data"}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  </div>
);

// Info Item Component
const InfoItem = ({
  icon: Icon,
  label,
  value,
  bgColor = "bg-gray-50",
  iconColor = "text-gray-600",
  textColor = "text-gray-800",
  labelColor = "text-gray-500",
}: {
  icon: any;
  label: string;
  value: string;
  bgColor?: string;
  iconColor?: string;
  textColor?: string;
  labelColor?: string;
}) => (
  <div className={`flex items-center gap-4 p-4 lg:p-5 rounded-xl ${bgColor} hover:shadow-md transition-all duration-300 hover:scale-[1.02]`}>
    <div className="flex-shrink-0">
      <Icon className={`w-5 h-5 lg:w-6 lg:h-6 ${iconColor}`} />
    </div>
    <div className="flex-1 min-w-0">
      <p className={`text-sm font-medium ${labelColor} mb-1`}>{label}</p>
      <p className={`font-semibold ${textColor} break-words text-sm lg:text-base`}>{value}</p>
    </div>
  </div>
);

// Main Component
export default function Home() {
  const { user: clerkUser } = useUser();
  const { data: user, isLoading: userLoading } = useGetUserByIdClerk(clerkUser?.id ?? "");

  if (userLoading) return <UserProfileSkeleton />;

  // Add this check
  if (!user || !user.id) {
    return <NoUserDataComponent clerkUser={clerkUser} />;
  }

  if (user?.error) return <ErrorComponent error={user?.error} />;

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header Card */}
          <Card className="overflow-hidden shadow-2xl border-0 backdrop-blur-sm bg-white/90 hover:shadow-3xl transition-all duration-500">
            {/* Enhanced Background Header */}
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 h-40 lg:h-48 relative overflow-hidden block md:hidden">{/* Decorative elements */}</div>
            <div className=" h-20 lg:h-24 relative overflow-hidden block hidden md:block">{/* Decorative elements */}</div>

            {/* Enhanced Profile Content */}
            <CardContent className="pt-0 px-6 lg:px-8 pb-8">
              <div className="flex flex-col xl:flex-row items-center xl:items-end gap-6 xl:gap-8 -mt-20 lg:-mt-24">
                {/* Enhanced Avatar */}
                <div className="relative group">
                  <Avatar className="w-32 h-32 lg:w-40 lg:h-40 border-4 lg:border-6 border-white shadow-2xl ring-4 ring-blue-100 transition-all duration-300 group-hover:ring-blue-200  group-hover:shadow-3xl">
                    <AvatarImage src={user?.avatarUrl} alt={user?.name} className="object-cover" />
                    <Card className="absolute bottom-0 right-0">
                      <AvatarFallback className="text-2xl lg:text-3xl bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold">{getInitials(user?.name || "User")}</AvatarFallback>
                    </Card>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-2 w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-green-400 to-emerald-500 border-4 border-white rounded-full flex items-center justify-center shadow-lg">
                    <CheckCircle className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                  </div>
                </div>

                {/* Enhanced User Info */}
                <div className="text-center xl:text-left flex-1 space-y-4 w-full">
                  <div className="space-y-3">
                    <div className="flex flex-col xl:flex-row xl:items-center gap-3 xl:gap-4">
                      <h1 className="relative text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black">{user?.name}</h1>
                      {/* {user?.status && (
                        <div className="flex  items-center justify-center xl:justify-start">
                          <Badge variant={getStatusVariant(user?.status)} className="px-4 py-3.5 text-sm font-semibold shadow-lg  transition-all rounded-4xl duration-300 ">
                            <div className="w-2 h-2 rounded-full bg-current mr-2 "></div>
                            {user?.status?.charAt(0).toUpperCase() + user?.status?.slice(1)}
                          </Badge>
                        </div>
                      )} */}
                    </div>
                    <p className="text-xl sm:text-2xl lg:text-3xl text-gray-600 font-semibold">{user?.position || ""}</p>
                  </div>

                  {/* Enhanced Meta Info */}
                  <div className="flex flex-col sm:flex-row items-center justify-center xl:justify-start gap-4 text-sm lg:text-base">
                    {user?.role?.name && (
                      <div className="flex items-center gap-3 bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 rounded-full border border-blue-100 shadow-sm hover:shadow-md transition-all duration-300">
                        <Shield className="w-5 h-5 text-blue-600" />
                        <span className="font-semibold text-blue-800">{user.role.name}</span>
                      </div>
                    )}
                    {user?.employeeId && (
                      <div className="flex items-center gap-3 bg-gradient-to-r from-purple-50 to-pink-50 px-4 py-3 rounded-full border border-purple-100 shadow-sm hover:shadow-md transition-all duration-300">
                        <Briefcase className="w-5 h-5 text-purple-600" />
                        <span className="font-semibold text-purple-800">ID: {user.employeeId}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-3 bg-gradient-to-r from-green-50 to-emerald-50 px-4 py-3 rounded-full border border-green-100 shadow-sm hover:shadow-md transition-all duration-300">
                      <Calendar className="w-5 h-5 text-green-600" />
                      <span className="font-semibold text-green-800">Since {formatDate(user?.startDate)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* Enhanced Personal Information */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-500 hover:bg-white/90">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-3 text-xl lg:text-2xl">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg">
                    <User className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
                  </div>
                  <span className="bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent font-bold">Personal Information</span>
                </CardTitle>
                <CardDescription className="text-base lg:text-lg text-gray-600">Basic personal details and contact information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <InfoItem icon={Mail} label="Email Address" value={user?.email || "Not provided"} bgColor="bg-gradient-to-r from-blue-50 to-cyan-50" iconColor="text-blue-600" textColor="text-blue-800" labelColor="text-blue-600" />

                <InfoItem
                  icon={User}
                  label="Gender"
                  value={user?.gender === "L" ? "Laki-laki" : user?.gender === "P" ? "Perempuan" : "Not specified"}
                  bgColor="bg-gradient-to-r from-purple-50 to-pink-50"
                  iconColor="text-purple-600"
                  textColor="text-purple-800"
                  labelColor="text-purple-600"
                />

                <InfoItem icon={MapPin} label="Address" value={user?.address || "Not provided"} bgColor="bg-gradient-to-r from-green-50 to-emerald-50" iconColor="text-green-600" textColor="text-green-800" labelColor="text-green-600" />

                <InfoItem
                  icon={Phone}
                  label="Parent Phone"
                  value={user?.parentPhone || "Not provided"}
                  bgColor="bg-gradient-to-r from-orange-50 to-yellow-50"
                  iconColor="text-orange-600"
                  textColor="text-orange-800"
                  labelColor="text-orange-600"
                />

                <Separator className="my-6" />

                <InfoItem icon={Calendar} label="Birth Date" value={formatDate(user?.birthDate)} bgColor="bg-gradient-to-r from-indigo-50 to-blue-50" iconColor="text-indigo-600" textColor="text-indigo-800" labelColor="text-indigo-600" />

                <InfoItem icon={MapPin} label="Birth Place" value={user?.birthPlace || "Not provided"} bgColor="bg-gradient-to-r from-teal-50 to-cyan-50" iconColor="text-teal-600" textColor="text-teal-800" labelColor="text-teal-600" />
              </CardContent>
            </Card>

            {/* Enhanced Professional Information */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-500 hover:bg-white/90">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-3 text-xl lg:text-2xl">
                  <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-lg">
                    <Building2 className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
                  </div>
                  <span className="bg-gradient-to-r from-green-700 to-emerald-500 bg-clip-text text-transparent font-bold">Professional Information</span>
                </CardTitle>
                <CardDescription className="text-base lg:text-lg text-gray-600">Work-related details and academic information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <InfoItem
                  icon={Briefcase}
                  label="Position"
                  value={user?.position || "Not specified"}
                  bgColor="bg-gradient-to-r from-green-50 to-emerald-50"
                  iconColor="text-green-600"
                  textColor="text-green-800"
                  labelColor="text-green-600"
                />

                <InfoItem icon={Shield} label="Role" value={user?.role?.name || "Not specified"} bgColor="bg-gradient-to-r from-blue-50 to-indigo-50" iconColor="text-blue-600" textColor="text-blue-800" labelColor="text-blue-600" />

                <InfoItem icon={Calendar} label="Start Date" value={formatDate(user?.startDate)} bgColor="bg-gradient-to-r from-purple-50 to-pink-50" iconColor="text-purple-600" textColor="text-purple-800" labelColor="text-purple-600" />

                {user?.endDate && <InfoItem icon={Calendar} label="End Date" value={formatDate(user?.endDate)} bgColor="bg-gradient-to-r from-red-50 to-pink-50" iconColor="text-red-600" textColor="text-red-800" labelColor="text-red-600" />}

                <Separator className="my-6" />

                <InfoItem
                  icon={GraduationCap}
                  label="Academic Information"
                  value={user?.class?.name ? `Class: ${user.class.name}` : "No class assigned"}
                  bgColor="bg-gradient-to-r from-amber-50 to-orange-50"
                  iconColor="text-amber-600"
                  textColor="text-amber-800"
                  labelColor="text-amber-600"
                />

                {user?.major?.name && <InfoItem icon={Award} label="Major" value={user.major.name} bgColor="bg-gradient-to-r from-cyan-50 to-teal-50" iconColor="text-cyan-600" textColor="text-cyan-800" labelColor="text-cyan-600" />}
              </CardContent>
            </Card>
          </div>

          {/* Enhanced System Information */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-500 hover:bg-white/90">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-3 text-xl lg:text-2xl">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl shadow-lg">
                  <Clock className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
                </div>
                <span className="bg-gradient-to-r from-purple-700 to-pink-500 bg-clip-text text-transparent font-bold">System Information</span>
              </CardTitle>
              <CardDescription className="text-base lg:text-lg text-gray-600">Account creation and last update information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <InfoItem icon={Calendar} label="Created At" value={formatDate(user?.createdAt)} bgColor="bg-gradient-to-r from-purple-50 to-pink-50" iconColor="text-purple-600" textColor="text-purple-800" labelColor="text-purple-600" />

                <InfoItem icon={Clock} label="Last Updated" value={formatDate(user?.updatedAt)} bgColor="bg-gradient-to-r from-indigo-50 to-purple-50" iconColor="text-indigo-600" textColor="text-indigo-800" labelColor="text-indigo-600" />

                <InfoItem icon={User} label="User ID" value={user?.id} bgColor="bg-gradient-to-r from-gray-50 to-slate-50" iconColor="text-gray-600" textColor="text-gray-800" labelColor="text-gray-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
