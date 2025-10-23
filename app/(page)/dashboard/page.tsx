"use client";

import React, { useState, useMemo } from "react";
import { useGetAttendance } from "../../hooks/useAttendance";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { CheckCircle, XCircle, Clock, AlertCircle, Users, Calendar, BookOpen, MapPin, Search, Filter, TrendingUp, AlertTriangle, User, UserCheck, BarChart3, PieChart as PieChartIcon } from "lucide-react";
import Navbar from "@/components/navbar";

// Status mapping
const STATUS_MAP = {
  present: { label: "Hadir", color: "bg-green-100 text-green-800", icon: CheckCircle, chartColor: "#10B981" },
  absent: { label: "Tidak Hadir", color: "bg-red-100 text-red-800", icon: XCircle, chartColor: "#EF4444" },
  late: { label: "Terlambat", color: "bg-yellow-100 text-yellow-800", icon: Clock, chartColor: "#F59E0B" },
  excused: { label: "Izin", color: "bg-blue-100 text-blue-800", icon: AlertCircle, chartColor: "#06B6D4" },
  sick: { label: "Sakit", color: "bg-purple-100 text-purple-800", icon: AlertCircle, chartColor: "#8B5CF6" },
};

export default function DashboardPage() {
  const { data: attendanceData = [], isLoading: attendanceIsLoading, isError: attendanceIsError } = useGetAttendance();

  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 7 days ago
    endDate: new Date().toISOString().split("T")[0], // today
  });
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedClass, setSelectedClass] = useState("all");
  const [searchStudent, setSearchStudent] = useState("");

  // Get unique classes from data
  const classes = useMemo(() => {
    const classSet = new Set<string>();
    attendanceData.forEach((record: { schedule: { room: string } }) => {
      if (record.schedule?.room) {
        classSet.add(record.schedule.room);
      }
    });
    return Array.from(classSet);
  }, [attendanceData]);

  // Filter data based on selected filters
  const filteredData = useMemo(() => {
    return attendanceData.filter((record: { date: string | number | Date; status: string; schedule: { room: string }; student: { name: string; nisn: string | string[] } }) => {
      const recordDate = new Date(record.date).toISOString().split("T")[0];
      const inDateRange = recordDate >= dateRange.startDate && recordDate <= dateRange.endDate;
      const matchesStatus = selectedStatus === "all" || record.status === selectedStatus;
      const matchesClass = selectedClass === "all" || record.schedule?.room === selectedClass;
      const matchesSearch = searchStudent === "" || record.student?.name.toLowerCase().includes(searchStudent.toLowerCase()) || record.student?.nisn?.includes(searchStudent);

      return inDateRange && matchesStatus && matchesClass && matchesSearch;
    });
  }, [attendanceData, dateRange, selectedStatus, selectedClass, searchStudent]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = filteredData.length;
    const present = filteredData.filter((r: { status: string }) => r.status === "present").length;
    const late = filteredData.filter((r: { status: string }) => r.status === "late").length;
    const absent = filteredData.filter((r: { status: string }) => r.status === "absent").length;
    const sick = filteredData.filter((r: { status: string }) => r.status === "sick").length;
    const excused = filteredData.filter((r: { status: string }) => r.status === "excused").length;

    return {
      total,
      present,
      late,
      absent,
      sick,
      excused,
      attendanceRate: total > 0 ? (((present + late) / total) * 100).toFixed(1) : 0,
    };
  }, [filteredData]);

  // Prepare data for pie chart
  const pieData = useMemo(() => {
    return Object.entries(STATUS_MAP)
      .map(([status, config]) => ({
        name: config.label,
        value: stats[status as keyof typeof stats],
        color: config.chartColor,
      }))
      .filter((item) => item.value > 0);
  }, [stats]);

  // Prepare data for line chart (daily trends)
  const lineData = useMemo(() => {
    interface DailyRecord {
      date: string;
      present: number;
      late: number;
      absent: number;
      sick: number;
      excused: number;
      total: number;
      [key: string]: string | number;
    }
    const dailyStats: Record<string, DailyRecord> = {};

    filteredData.forEach((record: { date: string | number | Date; status: string }) => {
      const date = new Date(record.date).toLocaleDateString("id-ID");
      if (!dailyStats[date]) {
        dailyStats[date] = { date, present: 0, late: 0, absent: 0, sick: 0, excused: 0, total: 0 };
      }
      dailyStats[date][record.status as keyof typeof STATUS_MAP] = (dailyStats[date][record.status as keyof typeof STATUS_MAP] as number) + 1;
      dailyStats[date].total++;
    });

    return Object.values(dailyStats).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [filteredData]);

  // Prepare data for bar chart (by class)
  const classData = useMemo(() => {
    interface ClassStats {
      [key: string]: {
        class: string;
        present: number;
        late: number;
        absent: number;
        sick: number;
        excused: number;
        [key: string]: string | number;
      };
    }
    const classStats: ClassStats = {};

    filteredData.forEach((record: { schedule: { room: string }; status: string | number }) => {
      const className = record.schedule?.room || "Unknown";
      if (!classStats[className]) {
        classStats[className] = { class: className, present: 0, late: 0, absent: 0, sick: 0, excused: 0 };
      }
      classStats[className][record.status as keyof typeof STATUS_MAP] = (classStats[className][record.status as keyof typeof STATUS_MAP] as number) + 1;
    });

    return Object.values(classStats);
  }, [filteredData]);

  if (attendanceIsError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <div className="max-w-7xl mx-auto">
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">Error loading attendance data. Please try refreshing the page.</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  if (attendanceIsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-32 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <Card className="shadow-lg border-0 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-3xl font-bold mb-2">Dashboard Kehadiran</CardTitle>
                  <CardDescription className="text-blue-100">Pantau kehadiran siswa secara real-time dan analisis tren kehadiran</CardDescription>
                </div>
                <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                  <UserCheck className="w-5 h-5" />
                  <span className="font-semibold">Tingkat Kehadiran: {stats.attendanceRate}%</span>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Filters */}
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filter Data
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    Tanggal Mulai
                  </label>
                  <Input type="date" value={dateRange.startDate} onChange={(e) => setDateRange((prev) => ({ ...prev, startDate: e.target.value }))} />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    Tanggal Akhir
                  </label>
                  <Input type="date" value={dateRange.endDate} onChange={(e) => setDateRange((prev) => ({ ...prev, endDate: e.target.value }))} />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Status</label>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Status</SelectItem>
                      {Object.entries(STATUS_MAP).map(([key, config]) => (
                        <SelectItem key={key} value={key}>
                          {config.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Kelas</label>
                  <Select value={selectedClass} onValueChange={setSelectedClass}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih kelas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Kelas</SelectItem>
                      {classes.map((className) => (
                        <SelectItem key={className} value={className}>
                          {className}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 flex items-center">
                    <Search className="w-4 h-4 mr-2" />
                    Cari Siswa
                  </label>
                  <Input type="text" placeholder="Nama atau NISN" value={searchStudent} onChange={(e) => setSearchStudent(e.target.value)} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Statistics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <Card className="shadow-md border-l-4 border-slate-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-slate-600">{stats.total}</div>
                    <div className="text-sm text-slate-500">Total Kehadiran</div>
                  </div>
                  <Users className="w-8 h-8 text-slate-400" />
                </div>
              </CardContent>
            </Card>

            {Object.entries(STATUS_MAP).map(([status, config]) => {
              const IconComponent = config.icon;
              return (
                <Card key={status} className={`shadow-md border-l-4 border-${config.chartColor.replace("#", "")}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold" style={{ color: config.chartColor }}>
                          {stats[status as keyof typeof stats]}
                        </div>
                        <div className="text-sm text-slate-500">{config.label}</div>
                      </div>
                      <IconComponent className="w-8 h-8" style={{ color: config.chartColor }} />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pie Chart */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChartIcon className="w-5 h-5 text-blue-600" />
                  Distribusi Status Kehadiran
                </CardTitle>
                <CardDescription>Persentase kehadiran berdasarkan status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" labelLine={false} label={(props) => `${props.name}: ${(Number(props.percent ?? 0) * 100).toFixed(1)}%`} outerRadius={80} fill="#8884d8" dataKey="value">
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Line Chart */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  Tren Kehadiran Harian
                </CardTitle>
                <CardDescription>Grafik perkembangan kehadiran per hari</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={lineData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="present" stroke="#10B981" strokeWidth={2} name="Hadir" />
                      <Line type="monotone" dataKey="late" stroke="#F59E0B" strokeWidth={2} name="Terlambat" />
                      <Line type="monotone" dataKey="absent" stroke="#EF4444" strokeWidth={2} name="Tidak Hadir" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bar Chart */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-600" />
                Kehadiran per Kelas
              </CardTitle>
              <CardDescription>Perbandingan tingkat kehadiran antar kelas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={classData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="class" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="present" fill="#10B981" name="Hadir" />
                    <Bar dataKey="late" fill="#F59E0B" name="Terlambat" />
                    <Bar dataKey="absent" fill="#EF4444" name="Tidak Hadir" />
                    <Bar dataKey="sick" fill="#8B5CF6" name="Sakit" />
                    <Bar dataKey="excused" fill="#06B6D4" name="Izin" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Recent Attendance Table */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-600" />
                Data Kehadiran Terbaru
              </CardTitle>
              <CardDescription>{filteredData.length} record kehadiran ditemukan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Siswa</TableHead>
                      <TableHead>NISN</TableHead>
                      <TableHead>Kelas</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Tanggal</TableHead>
                      <TableHead>Catatan</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.slice(0, 10).map(
                      (record: {
                        status: string | number;
                        id: React.Key | null | undefined;
                        student: {
                          name:
                            | string
                            | number
                            | bigint
                            | boolean
                            | React.ReactElement<unknown, string | React.JSXElementConstructor<any>>
                            | Iterable<React.ReactNode>
                            | React.ReactPortal
                            | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined>
                            | null
                            | undefined;
                          nisn: any;
                        };
                        schedule: { room: any };
                        date: string | number | Date;
                        notes: any;
                      }) => {
                        const statusConfig = STATUS_MAP[record.status as keyof typeof STATUS_MAP];
                        const StatusIcon = statusConfig.icon;

                        return (
                          <TableRow key={record.id}>
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-gray-400" />
                                {record.student?.name}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="text-xs">
                                {record.student?.nisn || "N/A"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-gray-400" />
                                {record.schedule?.room || "N/A"}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={statusConfig.color}>
                                <StatusIcon className="w-3 h-3 mr-1" />
                                {statusConfig.label}
                              </Badge>
                            </TableCell>
                            <TableCell>{new Date(record.date).toLocaleDateString("id-ID")}</TableCell>
                            <TableCell className="max-w-xs truncate">{record.notes || "-"}</TableCell>
                          </TableRow>
                        );
                      }
                    )}
                  </TableBody>
                </Table>
              </div>
              {filteredData.length > 10 && (
                <div className="mt-4 text-center">
                  <Button variant="outline">Lihat Semua Data ({filteredData.length} records)</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
