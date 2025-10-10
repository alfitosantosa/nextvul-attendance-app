import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { User, Calendar, CheckCircle, XCircle, AlertCircle, Clock, DollarSign, TrendingUp, TrendingDown, AlertTriangle, BookOpen, GraduationCap, MapPin, Phone, Mail, CreditCard, FileText, Award } from "lucide-react";
import { useState } from "react";

// Mock data untuk demo
const mockParentData = {
  id: "cmgdv9wgx0001gqkl9qavavir",
  name: "Imam Santosa",
  email: "ImamSantosa@gmail.com",
  phone: "08123456789",
  address: "Jakarta Timur Kec.cipayung kel.setu Jl. Rukun No.54 RW002 RT005 13880",
  relation: "Father",
  studentIds: ["cmftrvnq5000lgq1tauteunhn", "student2id"],
};

const mockStudents = [
  {
    id: "cmftrvnq5000lgq1tauteunhn",
    name: "Ahmad Fauzi",
    nisn: "1234567890",
    class: "XII RPL 1",
    major: "Rekayasa Perangkat Lunak",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmad",
    status: "active",
  },
  {
    id: "student2id",
    name: "Siti Nurhaliza",
    nisn: "1234567891",
    class: "X TKJ 1",
    major: "Teknik Komputer dan Jaringan",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Siti",
    status: "active",
  },
];

const mockAttendance = {
  thisMonth: {
    present: 18,
    absent: 2,
    late: 1,
    excused: 1,
    total: 22,
  },
  recentAttendance: [
    { date: "2025-01-15", status: "present", subject: "Matematika" },
    { date: "2025-01-14", status: "present", subject: "Bahasa Indonesia" },
    { date: "2025-01-13", status: "late", subject: "Pemrograman" },
    { date: "2025-01-12", status: "present", subject: "Bahasa Inggris" },
    { date: "2025-01-11", status: "absent", subject: "Fisika" },
  ],
};

const mockViolations = [
  {
    id: "1",
    date: "2025-01-10",
    type: "Terlambat",
    category: "ringan",
    points: 5,
    description: "Datang terlambat 15 menit",
    status: "active",
  },
  {
    id: "2",
    date: "2025-01-05",
    type: "Tidak Mengerjakan PR",
    category: "sedang",
    points: 10,
    description: "Tidak mengerjakan PR Matematika",
    status: "resolved",
  },
];

const mockPayments = {
  summary: {
    totalPaid: 2500000,
    totalDue: 500000,
    nextDueDate: "2025-02-01",
  },
  history: [
    {
      id: "1",
      type: "SPP",
      amount: 500000,
      dueDate: "2025-01-01",
      paymentDate: "2024-12-28",
      status: "paid",
      receiptNumber: "RCP-2024-001",
    },
    {
      id: "2",
      type: "SPP",
      amount: 500000,
      dueDate: "2025-02-01",
      paymentDate: null,
      status: "pending",
      receiptNumber: null,
    },
  ],
};

const ParentDashboard = () => {
  const [selectedStudent, setSelectedStudent] = useState(mockStudents[0]);

  // Status badge helpers
  const getStatusBadge = (status: string) => {
    const variants = {
      present: { variant: "default" as const, icon: CheckCircle, label: "Hadir", color: "text-green-600" },
      absent: { variant: "destructive" as const, icon: XCircle, label: "Tidak Hadir", color: "text-red-600" },
      late: { variant: "secondary" as const, icon: Clock, label: "Terlambat", color: "text-yellow-600" },
      excused: { variant: "outline" as const, icon: FileText, label: "Izin", color: "text-blue-600" },
    };

    const config = variants[status as keyof typeof variants] || variants.absent;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const getViolationBadge = (category: string) => {
    const variants = {
      ringan: { variant: "secondary" as const, color: "text-yellow-600" },
      sedang: { variant: "default" as const, color: "text-orange-600" },
      berat: { variant: "destructive" as const, color: "text-red-600" },
    };

    return variants[category as keyof typeof variants] || variants.ringan;
  };

  const getPaymentBadge = (status: string) => {
    const variants = {
      paid: { variant: "default" as const, label: "Lunas", icon: CheckCircle },
      pending: { variant: "secondary" as const, label: "Belum Bayar", icon: Clock },
      overdue: { variant: "destructive" as const, label: "Terlambat", icon: AlertCircle },
    };

    const config = variants[status as keyof typeof variants] || variants.pending;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  // Calculate attendance percentage
  const attendancePercentage = (mockAttendance.thisMonth.present / mockAttendance.thisMonth.total) * 100;

  // Calculate total violation points
  const totalViolationPoints = mockViolations.filter((v) => v.status === "active").reduce((sum, v) => sum + v.points, 0);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header Section */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Dashboard Orang Tua</h1>
          <p className="text-muted-foreground">Pantau perkembangan anak Anda di sekolah</p>
        </div>

        {/* Parent Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Informasi Orang Tua
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{mockParentData.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{mockParentData.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Hubungan: {mockParentData.relation}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Student Selector */}
        <Card>
          <CardHeader>
            <CardTitle>Pilih Anak</CardTitle>
            <CardDescription>Pilih anak yang ingin Anda pantau</CardDescription>
          </CardHeader>
          <CardContent>
            <Select
              value={selectedStudent.id}
              onValueChange={(value) => {
                const student = mockStudents.find((s) => s.id === value);
                if (student) setSelectedStudent(student);
              }}
            >
              <SelectTrigger className="w-full md:w-[400px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {mockStudents.map((student) => (
                  <SelectItem key={student.id} value={student.id}>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={student.avatarUrl} />
                        <AvatarFallback>{student.name[0]}</AvatarFallback>
                      </Avatar>
                      <span>
                        {student.name} - {student.class}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Student Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>Profil Siswa</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={selectedStudent.avatarUrl} />
                <AvatarFallback className="text-2xl">
                  {selectedStudent.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-3 flex-1">
                <div>
                  <h3 className="text-2xl font-bold">{selectedStudent.name}</h3>
                  <p className="text-muted-foreground">NISN: {selectedStudent.nisn}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Kelas: {selectedStudent.class}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Jurusan: {selectedStudent.major}</span>
                  </div>
                </div>
                <Badge variant="default">{selectedStudent.status === "active" ? "Aktif" : "Tidak Aktif"}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Attendance Summary */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Kehadiran Bulan Ini
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-3xl font-bold">{attendancePercentage.toFixed(1)}%</div>
                <Progress value={attendancePercentage} className="h-2" />
                <div className="grid grid-cols-2 gap-2 text-xs mt-4">
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <span>Hadir: {mockAttendance.thisMonth.present}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-red-500" />
                    <span>Alpa: {mockAttendance.thisMonth.absent}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-yellow-500" />
                    <span>Terlambat: {mockAttendance.thisMonth.late}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-blue-500" />
                    <span>Izin: {mockAttendance.thisMonth.excused}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Violations Summary */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                Pelanggaran Aktif
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <div className="text-3xl font-bold">{totalViolationPoints}</div>
                  <span className="text-sm text-muted-foreground">poin</span>
                </div>
                <div className="text-sm text-muted-foreground">{mockViolations.filter((v) => v.status === "active").length} pelanggaran aktif</div>
                {totalViolationPoints > 50 ? (
                  <Badge variant="destructive" className="mt-2">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Perlu Perhatian
                  </Badge>
                ) : totalViolationPoints > 20 ? (
                  <Badge variant="secondary" className="mt-2">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Hati-hati
                  </Badge>
                ) : (
                  <Badge variant="default" className="mt-2">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Baik
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Payment Summary */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-blue-600" />
                Status Pembayaran
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <div className="text-3xl font-bold">Rp {(mockPayments.summary.totalDue / 1000).toFixed(0)}K</div>
                </div>
                <div className="text-sm text-muted-foreground">Tagihan tertunda</div>
                {mockPayments.summary.totalDue > 0 ? (
                  <Badge variant="secondary" className="mt-2">
                    <Clock className="h-3 w-3 mr-1" />
                    Jatuh tempo: {new Date(mockPayments.summary.nextDueDate).toLocaleDateString("id-ID")}
                  </Badge>
                ) : (
                  <Badge variant="default" className="mt-2">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Lunas
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Tabs */}
        <Tabs defaultValue="attendance" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="attendance">
              <Calendar className="h-4 w-4 mr-2" />
              Absensi
            </TabsTrigger>
            <TabsTrigger value="violations">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Pelanggaran
            </TabsTrigger>
            <TabsTrigger value="payments">
              <DollarSign className="h-4 w-4 mr-2" />
              Pembayaran
            </TabsTrigger>
          </TabsList>

          {/* Attendance Tab */}
          <TabsContent value="attendance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Riwayat Kehadiran Terkini</CardTitle>
                <CardDescription>5 kehadiran terakhir dari {selectedStudent.name}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockAttendance.recentAttendance.map((attendance, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold">{new Date(attendance.date).getDate()}</div>
                          <div className="text-xs text-muted-foreground">{new Date(attendance.date).toLocaleDateString("id-ID", { month: "short" })}</div>
                        </div>
                        <Separator orientation="vertical" className="h-12" />
                        <div>
                          <div className="font-medium">{attendance.subject}</div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(attendance.date).toLocaleDateString("id-ID", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </div>
                        </div>
                      </div>
                      <div>{getStatusBadge(attendance.status)}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Violations Tab */}
          <TabsContent value="violations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Daftar Pelanggaran</CardTitle>
                <CardDescription>Catatan pelanggaran dari {selectedStudent.name}</CardDescription>
              </CardHeader>
              <CardContent>
                {mockViolations.length === 0 ? (
                  <div className="text-center py-12">
                    <Award className="h-12 w-12 mx-auto text-green-600 mb-4" />
                    <h3 className="font-semibold text-lg">Tidak Ada Pelanggaran</h3>
                    <p className="text-muted-foreground">{selectedStudent.name} belum memiliki catatan pelanggaran</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {mockViolations.map((violation) => (
                      <div key={violation.id} className="flex items-start justify-between p-4 border rounded-lg">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{violation.type}</h4>
                            <Badge variant={getViolationBadge(violation.category).variant} className="capitalize">
                              {violation.category}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{violation.description}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(violation.date).toLocaleDateString("id-ID")}
                            </span>
                            <span className="flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              {violation.points} poin
                            </span>
                          </div>
                        </div>
                        <div>
                          <Badge variant={violation.status === "resolved" ? "default" : "secondary"}>{violation.status === "resolved" ? "Selesai" : "Aktif"}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Riwayat Pembayaran</CardTitle>
                <CardDescription>Status pembayaran SPP dan biaya lainnya</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockPayments.history.map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{payment.type}</h4>
                        </div>
                        <div className="text-2xl font-bold">Rp {payment.amount.toLocaleString("id-ID")}</div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>Jatuh tempo: {new Date(payment.dueDate).toLocaleDateString("id-ID")}</span>
                          {payment.paymentDate && <span>Dibayar: {new Date(payment.paymentDate).toLocaleDateString("id-ID")}</span>}
                        </div>
                        {payment.receiptNumber && <div className="text-xs text-muted-foreground">No. Kwitansi: {payment.receiptNumber}</div>}
                      </div>
                      <div>{getPaymentBadge(payment.status)}</div>
                    </div>
                  ))}
                </div>

                <Separator className="my-6" />

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Total Dibayar:</span>
                    <span className="font-semibold">Rp {mockPayments.summary.totalPaid.toLocaleString("id-ID")}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Total Tertunda:</span>
                    <span className="font-semibold text-orange-600">Rp {mockPayments.summary.totalDue.toLocaleString("id-ID")}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ParentDashboard;
