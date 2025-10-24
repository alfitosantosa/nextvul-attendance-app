"use client";

import { useGetScheduleByIdTeacher } from "@/app/hooks/useGetScheduleById";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarDays, Clock, MapPin, BookOpen, Users, GraduationCap, Eye, Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useGetAttendance } from "@/app/hooks/useAttendance";
import { useUser } from "@clerk/clerk-react";
import { useGetUserByIdClerk } from "@/app/hooks/useUsersByIdClerk";

export default function TeacherAttendancePage() {
  const today = new Date().getDay();
  const [selectedDay, setSelectedDay] = useState<string>(today.toString());

  const { user } = useUser();
  const { data: userData } = useGetUserByIdClerk(user?.id ?? "");

  const { data: scheduleData = [], isLoading: isLoadingSchedule, error: scheduleError } = useGetScheduleByIdTeacher(userData?.id ?? "");

  const getDayName = (dayOfWeek: number) => {
    const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    return days[dayOfWeek];
  };

  const getDayColor = (dayOfWeek: number) => {
    const colors = ["bg-red-100 text-red-800", "bg-blue-100 text-blue-800", "bg-green-100 text-green-800", "bg-yellow-100 text-yellow-800", "bg-purple-100 text-purple-800", "bg-indigo-100 text-indigo-800", "bg-pink-100 text-pink-800"];
    return colors[dayOfWeek];
  };

  const dayOptions = [
    { value: "all", label: "Semua Hari" },
    { value: "0", label: "Minggu" },
    { value: "1", label: "Senin" },
    { value: "2", label: "Selasa" },
    { value: "3", label: "Rabu" },
    { value: "4", label: "Kamis" },
    { value: "5", label: "Jumat" },
    { value: "6", label: "Sabtu" },
  ];

  const filteredScheduleData = selectedDay === "all" ? scheduleData : scheduleData.filter((schedule: any) => schedule.dayOfWeek.toString() === selectedDay);

  const isTodaySchedule = (dayOfWeek: number) => {
    const today = new Date().getDay();
    return dayOfWeek === today;
  };

  const { data: attendanceData = [] } = useGetAttendance();

  const isAttendanceSubmitted = (scheduleId: string) => {
    const today = new Date();
    const todayString = today.toISOString().split("T")[0]; // format: YYYY-MM-DD
    return attendanceData.some((attendance: any) => {
      // Map attendance.date to YYYY-MM-DD if it's a Date object or ISO string
      const attendanceDate = typeof attendance.date === "string" ? attendance.date.split("T")[0] : attendance.date instanceof Date ? attendance.date.toISOString().split("T")[0] : "";
      return attendanceDate === todayString && attendance.scheduleId === scheduleId;
    });
  };

  const isButtonDisabled = (schedule: any) => {
    return !isTodaySchedule(schedule.dayOfWeek) || isAttendanceSubmitted(schedule.id);
  };

  const getButtonText = (schedule: any) => {
    if (isAttendanceSubmitted(schedule.id)) {
      return "Sudah Diabsen";
    }
    if (!isTodaySchedule(schedule.dayOfWeek)) {
      return "Bukan Hari Ini";
    }
    return "Buat Absensi Hari Ini";
  };

  const ScheduleCardSkeleton = () => (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </CardContent>
      <CardFooter>
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-40 ml-2" />
      </CardFooter>
    </Card>
  );

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 ">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <GraduationCap className="h-8 w-8 text-primary" />
              <h1 className="text-4xl font-bold text-slate-900">Jadwal Mengajar</h1>
            </div>
            <p className="text-slate-600 text-lg">Kelola jadwal dan absensi kelas Anda dengan mudah</p>
          </div>

          {/* Filter Section */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5" />
                Filter Jadwal
              </CardTitle>
              <CardDescription>Pilih hari untuk melihat jadwal spesifik</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-slate-700 min-w-fit">Pilih Hari:</label>
                <Select value={selectedDay} onValueChange={setSelectedDay}>
                  <SelectTrigger className="w-64">
                    <SelectValue placeholder="Pilih hari" />
                  </SelectTrigger>
                  <SelectContent>
                    {dayOptions.map((day) => (
                      <SelectItem key={day.value} value={day.value}>
                        {day.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Content Section */}
          {isLoadingSchedule ? (
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <ScheduleCardSkeleton key={i} />
              ))}
            </div>
          ) : scheduleError ? (
            <Alert variant="destructive">
              <AlertDescription>Terjadi kesalahan saat memuat jadwal: {(scheduleError as Error).message}</AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-6">
              {filteredScheduleData.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <CalendarDays className="mx-auto h-12 w-12 text-slate-400 mb-4" />
                    <h3 className="text-lg font-medium text-slate-900 mb-2">Tidak ada jadwal</h3>
                    <p className="text-slate-600">Tidak ada jadwal untuk hari yang dipilih.</p>
                  </CardContent>
                </Card>
              ) : (
                <>
                  {/* Summary Badge */}
                  <div className="flex items-center gap-2 mb-4">
                    <Badge variant="secondary" className="px-3 py-1">
                      {filteredScheduleData.length} Jadwal Ditemukan
                    </Badge>
                  </div>

                  {/* Schedule Cards */}
                  {filteredScheduleData.map((schedule: any) => (
                    <Card key={schedule.id} className="hover:shadow-lg transition-shadow duration-200">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <CardTitle className="text-xl text-slate-900">{schedule.subject.name}</CardTitle>
                            <CardDescription className="text-base">Kode: {schedule.subject.code}</CardDescription>
                          </div>
                          <Badge className={`${getDayColor(schedule.dayOfWeek)} border-0`} variant="secondary">
                            {getDayName(schedule.dayOfWeek)}
                          </Badge>
                        </div>
                      </CardHeader>

                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div className="flex items-center gap-3">
                              <Users className="h-4 w-4 text-slate-500" />
                              <span className="text-slate-700">
                                <span className="font-medium">Kelas:</span> {schedule.class.name}
                              </span>
                            </div>

                            <div className="flex items-center gap-3">
                              <MapPin className="h-4 w-4 text-slate-500" />
                              <span className="text-slate-700">
                                <span className="font-medium">Ruangan:</span> {schedule.room}
                              </span>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div className="flex items-center gap-3">
                              <Clock className="h-4 w-4 text-slate-500" />
                              <span className="text-slate-700">
                                <span className="font-medium">Waktu:</span> {schedule.startTime} - {schedule.endTime}
                              </span>
                            </div>

                            <div className="flex items-center gap-3">
                              <BookOpen className="h-4 w-4 text-slate-500" />
                              <span className="text-slate-700">
                                <span className="font-medium">SKS:</span> {schedule.subject.credits}
                              </span>
                            </div>
                          </div>
                        </div>

                        <Separator className="my-4" />

                        <div className="text-sm text-slate-600">
                          <span className="font-medium">Tahun Akademik:</span> {schedule.academicYear.year}
                        </div>
                      </CardContent>

                      <CardFooter className="bg-slate-50/50 flex gap-3">
                        <Link href={`/dashboard/teacher/schedule/${schedule.id}`} passHref>
                          <Button variant="outline" className="flex items-center gap-2">
                            <Eye className="h-4 w-4" />
                            Lihat Absensi
                          </Button>
                        </Link>

                        <div className="flex items-center gap-2">
                          <Button
                            disabled={isButtonDisabled(schedule)}
                            className={`flex items-center gap-2 ${isButtonDisabled(schedule) ? "opacity-10 cursor-not-allowed bg-gray-300 text-gray-1000 hover:bg-gray-300" : ""}`}
                            onClick={() => {
                              if (!isButtonDisabled(schedule)) {
                                window.location.href = `/dashboard/teacher/attendance/${schedule.id}`;
                              }
                            }}
                          >
                            <Plus className="h-4 w-4" />
                            {getButtonText(schedule)}
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
