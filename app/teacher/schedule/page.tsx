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

export default function TeacherAttendancePage() {
  const [selectedDay, setSelectedDay] = useState<string>("all");

  const { data: scheduleData = [], isLoading: isLoadingSchedule, error: scheduleError } = useGetScheduleByIdTeacher("cmeh3pgni000ggqr6dnurzoaf");

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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="container mx-auto px-4 py-8">
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
                        <Button variant="outline" className="flex items-center gap-2">
                          <Eye className="h-4 w-4" />
                          Lihat Absensi
                        </Button>
                        <Link href={`/teacher/attendance/${schedule.id}`} passHref>
                          <Button className="flex items-center gap-2">
                            <Plus className="h-4 w-4" />
                            Buat Absensi Hari Ini
                          </Button>
                        </Link>
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
