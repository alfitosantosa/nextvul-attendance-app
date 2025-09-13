"use client";

import React, { useState, useEffect } from "react";
import { useGetClassById } from "@/app/hooks/useGetClassById";
import { useGetScheduleById } from "@/app/hooks/useGetScheduleById";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Smartphone, Clock, AlertTriangle, CheckCircle, User, BookOpen, Users } from "lucide-react";
import { useParams } from "next/navigation";
import { useCreateAttendanceBulk } from "@/app/hooks/useBulkAttendance";

interface Student {
  id: string;
  name: string;
  nisn?: string;
}

interface Subject {
  name: string;
}

interface Schedule {
  id: string;
  subject: Subject;
  startTime: string;
  endTime: string;
  classId: string;
}

interface ClassData {
  name: string;
  description: string;
  students: Student[];
}

export default function AttendanceModule() {
  const params = useParams();
  const [attendanceData, setAttendanceData] = useState<Record<string, { status: string; notes?: string; evidenceUrl?: string }>>({});

  // Fetch schedule by id
  const { data: scheduleDataById = [], isLoading: isLoadingSchedule, isError: isErrorSchedule } = useGetScheduleById(params.id as string);

  // Get class ID from the first schedule item
  const classId = scheduleDataById.length > 0 ? scheduleDataById[0]?.classId : null;

  // Fetch class by id from schedule
  const { data: classData, isLoading: isLoadingClass, isError: isErrorClass } = useGetClassById(classId as string);

  const currentSession = scheduleDataById[0]
    ? {
        subject: scheduleDataById[0].subject.name,
        class: classData?.name || "Loading...",
        time: `${scheduleDataById[0].startTime} - ${scheduleDataById[0].endTime}`,
        teacher: "Teacher: " + (scheduleDataById[0].teacher.name || "Loading..."),
      }
    : null;

  const updateAttendance = (studentId: string, status: string) => {
    setAttendanceData((prev) => ({
      ...prev,
      [studentId]: { ...prev[studentId], status },
    }));
  };

  const saveAttendance = async () => {
    try {
      const attendanceArray = Object.entries(attendanceData).map(([studentId, data]) => ({
        studentId,
        scheduleId: scheduleDataById[0]?.id,
        attendanceDate: new Date().toISOString(),
        status: data.status,
        notes: data.notes,
        evidenceUrl: data.evidenceUrl,
      }));

      // [
      //   model Attendance {
      //     id         String   @id @default(cuid())
      //     studentId  String
      //     scheduleId String
      //     status     String
      //     notes      String?
      //     createdAt  DateTime @default(now())
      //     date       DateTime
      //     schedule   Schedule @relation(fields: [scheduleId], references: [id])
      //     student    User     @relation("StudentAttendance", fields: [studentId], references: [id])
      //     @@unique([studentId, scheduleId, date])
      //     @@map("attendances")
      //   }
      // ];

      useCreateAttendanceBulk().mutate(attendanceArray);

      // Replace with your actual API call
      console.log("Saving attendance:", attendanceArray);
      // await apiClient.saveAttendance(attendanceArray);
      alert("Absensi berhasil disimpan!");
    } catch (error) {
      alert("Error saving attendance: " + (error instanceof Error ? error.message : String(error)));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "hadir":
        return "bg-green-500";
      case "izin":
        return "bg-yellow-500";
      case "sakit":
        return "bg-blue-500";
      case "alfa":
        return "bg-red-500";
      default:
        return "bg-gray-300";
    }
  };

  // Get attendance statistics
  const getAttendanceStats = () => {
    const students = classData?.students || [];
    const hadir = students.filter((s: { id: string | number }) => attendanceData[s.id]?.status === "hadir").length;
    const izin = students.filter((s: { id: string | number }) => attendanceData[s.id]?.status === "izin").length;
    const sakit = students.filter((s: { id: string | number }) => attendanceData[s.id]?.status === "sakit").length;
    const alfa = students.filter((s: { id: string | number }) => attendanceData[s.id]?.status === "alfa").length;

    return { hadir, izin, sakit, alfa };
  };

  const stats = getAttendanceStats();

  if (isErrorSchedule || isErrorClass) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto p-6">
          <Alert className="max-w-2xl">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>Error loading data. Please try refreshing the page or contact support.</AlertDescription>
          </Alert>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-6 space-y-6">
        {/* Mobile Attendance Interface */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Smartphone className="h-5 w-5 text-blue-600" />
              <div>
                <CardTitle>Absensi Mobile - Sesi Aktif</CardTitle>
                <CardDescription>Akses otomatis berdasarkan jadwal guru yang login</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoadingSchedule || isLoadingClass ? (
              <div className="bg-gray-50 p-4 rounded-lg mb-4 animate-pulse">
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-3 bg-gray-300 rounded w-1/2"></div>
              </div>
            ) : currentSession ? (
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      {currentSession.subject}
                    </h3>
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      {currentSession.class}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1">
                      <span className="text-sm">
                        <Badge>
                          <Clock className="text-white h-4 w-4" />
                          {currentSession.time}
                        </Badge>
                      </span>
                    </div>
                    <p className="text-xs text-gray-500"> {currentSession.teacher}</p>
                  </div>
                </div>
              </div>
            ) : null}

            <div className="space-y-3">
              {isLoadingClass
                ? Array.from({ length: 5 }).map((_, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg animate-pulse">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                        <div>
                          <div className="h-4 bg-gray-300 rounded w-32 mb-1"></div>
                          <div className="h-3 bg-gray-300 rounded w-24"></div>
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        {Array.from({ length: 4 }).map((_, i) => (
                          <div key={i} className="h-8 w-12 bg-gray-300 rounded"></div>
                        ))}
                      </div>
                    </div>
                  ))
                : classData?.students.map((student: Student) => (
                    <div key={student.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(attendanceData[student.id]?.status)}`}></div>
                        <div>
                          <p className="font-medium flex items-center gap-2">
                            <User className="h-4 w-4 text-gray-400" />
                            {student.name}
                          </p>
                          {student.nisn && (
                            <p className="text-xs text-gray-500">
                              <Badge variant="outline" className="px-1 py-0.5">
                                NISN: {student.nisn}
                              </Badge>
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        {["hadir", "izin", "sakit", "alfa"].map((status) => (
                          <Button key={status} size="sm" variant={attendanceData[student.id]?.status === status ? "default" : "outline"} onClick={() => updateAttendance(student.id, status)} className="text-xs px-2 py-1">
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </Button>
                        ))}
                      </div>
                    </div>
                  ))}
            </div>

            <div className="mt-4 flex justify-between items-center">
              <Button onClick={saveAttendance} disabled={isLoadingClass}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Simpan Absensi
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Today's Attendance Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Ringkasan Absensi Hari Ini</CardTitle>
            <CardDescription>{isLoadingClass ? "Loading..." : `${classData?.students.length || 0} siswa dalam kelas ini`}</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingClass ? (
              <div className="text-center py-8">Loading attendance data...</div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{stats.hadir}</div>
                  <div className="text-sm text-gray-600">Hadir</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">{stats.izin}</div>
                  <div className="text-sm text-gray-600">Izin</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{stats.sakit}</div>
                  <div className="text-sm text-gray-600">Sakit</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{stats.alfa}</div>
                  <div className="text-sm text-gray-600">Alfa</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Attendance Rules */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Aturan Absensi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium">1 Sesi = 2 Jam Pelajaran</p>
                  <p className="text-xs text-gray-500">Absen sekali per sesi</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium">Mata Pelajaran Gandeng</p>
                  <p className="text-xs text-gray-500">Status mengikuti sesi sebelumnya</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium">Koreksi Absensi</p>
                  <p className="text-xs text-gray-500">1x kesempatan di hari yang sama</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notifikasi Otomatis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium">Alfa {">"} 2 Sesi</p>
                  <p className="text-xs text-gray-500">Notifikasi ke wali murid</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-red-600 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium">Alfa {">"} 3 Hari</p>
                  <p className="text-xs text-gray-500">Notifikasi ke Waka Kesiswaan</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
