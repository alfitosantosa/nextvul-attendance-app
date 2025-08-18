"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, GraduationCap, ClipboardCheck, AlertTriangle, BookOpen, Bell, User } from "lucide-react";

import ReportsModule from "@/components/reports-module";
import Navbar from "@/components/navbar";

// import { useDashboardStats } from "@/app/hooks/use-api";

// Mock data for demonstration - will be replaced with real user data
const userRoles = ["Kepala Sekolah", "Waka Kurikulum"];

const recentActivities = [
  { type: "Absensi", message: "Absensi kelas XII RPL 1 telah diinput", time: "10 menit lalu" },
  { type: "Pelanggaran", message: "Pelanggaran baru: Terlambat masuk kelas", time: "25 menit lalu" },
  { type: "Pembayaran", message: "Pembayaran SPP bulan ini: 89% terbayar", time: "1 jam lalu" },
  { type: "Jadwal", message: "Jadwal mata pelajaran minggu depan telah dipublish", time: "2 jam lalu" },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  // const { data: stats, loading: statsLoading, error: statsError } = useDashboardStats();

  const dashboardStats = [
    { title: "Total Siswa", value: 21321, icon: Users, color: "text-blue-600" },
    {
      title: "Total Guru",
      value: "2131",
      icon: GraduationCap,
      color: "text-green-600",
    },
    {
      title: "Kehadiran Hari Ini",
      value: "0%",
      icon: ClipboardCheck,
      color: "text-purple-600",
    },
    {
      title: "Pelanggaran Aktif",
      value: "0",
      icon: AlertTriangle,
      color: "text-red-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Navbar />
   

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="flex w-full">
            <TabsTrigger value="overview">Dashboard</TabsTrigger>
            <TabsTrigger value="calendar">Kalender</TabsTrigger>
            <TabsTrigger value="schedule">Jadwal</TabsTrigger>
            <TabsTrigger value="students">Data Siswa</TabsTrigger>
            <TabsTrigger value="teachers">Data Guru</TabsTrigger>
            <TabsTrigger value="attendance">Absensi</TabsTrigger>
            <TabsTrigger value="violations">Pelanggaran</TabsTrigger>
            <TabsTrigger value="reports">Laporan</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {dashboardStats.map((stat, index) => (
                <Card key={index}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activities */}
              <Card>
                <CardHeader>
                  <CardTitle>Aktivitas Terbaru</CardTitle>
                  <CardDescription>Update terbaru dari sistem</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.message}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Aksi Cepat</CardTitle>
                  <CardDescription>Fungsi yang sering digunakan</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2 bg-transparent" onClick={() => setActiveTab("attendance")}>
                    <ClipboardCheck className="h-6 w-6" />
                    <span className="text-sm">Input Absensi</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2 bg-transparent" onClick={() => setActiveTab("violations")}>
                    <AlertTriangle className="h-6 w-6" />
                    <span className="text-sm">Catat Pelanggaran</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2 bg-transparent" onClick={() => setActiveTab("students")}>
                    <Users className="h-6 w-6" />
                    <span className="text-sm">Tambah Siswa</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2 bg-transparent" onClick={() => setActiveTab("schedule")}>
                    <BookOpen className="h-6 w-6" />
                    <span className="text-sm">Atur Jadwal</span>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="calendar"></TabsContent>

          <TabsContent value="schedule">
            <Card>
              <CardHeader>
                <CardTitle>Jadwal Mata Pelajaran</CardTitle>
                <CardDescription>Pengaturan jadwal pelajaran harian dan mingguan</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-gray-500">
                  <BookOpen className="h-12 w-12 mx-auto mb-4" />
                  <p>Modul Jadwal Mata Pelajaran</p>
                  <p className="text-sm">Fitur ini akan menampilkan dan mengatur jadwal pelajaran</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="students"></TabsContent>

          <TabsContent value="teachers">
            <Card>
              <CardHeader>
                <CardTitle>Data Guru</CardTitle>
                <CardDescription>Manajemen data guru dan staff pengajar</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-gray-500">
                  <GraduationCap className="h-12 w-12 mx-auto mb-4" />
                  <p>Modul Data Guru</p>
                  <p className="text-sm">Fitur ini akan menampilkan database guru dan staff</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="attendance"></TabsContent>

          <TabsContent value="violations">
            <Card>
              <CardHeader>
                <CardTitle>Riwayat Pelanggaran</CardTitle>
                <CardDescription>Pencatatan dan monitoring pelanggaran siswa</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-gray-500">
                  <AlertTriangle className="h-12 w-12 mx-auto mb-4" />
                  <p>Modul Pelanggaran Siswa</p>
                  <p className="text-sm">Fitur ini akan menampilkan riwayat pelanggaran dan penanganan</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="reports">
            <ReportsModule />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
