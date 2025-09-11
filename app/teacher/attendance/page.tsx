import Navbar from "@/components/navbar";

export default function Page() {
  //fetch schedule by id schedule and fetch class for request student list for attendance, and validation if done attendance today

  
  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <h1 className="text-3xl font-bold text-gray-900">Teacher Attendance Page</h1>
      </div>
      <div className="p-4">{/* Attendance content goes here */}</div>
    </>
  );
}

// "use client"

// import { useState, useEffect } from "react"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Smartphone, Clock, AlertTriangle, CheckCircle } from "lucide-react"
// import { Alert, AlertDescription } from "@/components/ui/alert"
// import { useAttendance } from "@/hooks/use-api"
// import { apiClient } from "@/lib/api-client"

// const currentSession = {
//   subject: "Matematika",
//   class: "XII RPL 1",
//   time: "07:30 - 09:00",
//   teacher: "Budi Santoso, S.Pd",
// }

// export default function AttendanceModule() {
//   const [students, setStudents] = useState([])
//   const [selectedFile, setSelectedFile] = useState(null)
//   const [attendanceData, setAttendanceData] = useState({})

//   const today = new Date().toISOString().split("T")[0]
//   const { data: attendances, loading, error, refetch } = useAttendance({ date: today })

//   const updateAttendance = (studentId: string, status: string) => {
//     setAttendanceData((prev) => ({
//       ...prev,
//       [studentId]: { ...prev[studentId], status },
//     }))
//   }

//   const saveAttendance = async () => {
//     try {
//       const attendanceArray = Object.entries(attendanceData).map(([studentId, data]) => ({
//         studentId,
//         scheduleId: "current-schedule-id", // This should come from current session
//         attendanceDate: new Date().toISOString(),
//         status: data.status,
//         notes: data.notes,
//         evidenceUrl: data.evidenceUrl,
//       }))

//       await apiClient.saveAttendance(attendanceArray)
//       await refetch()
//       alert("Absensi berhasil disimpan!")
//     } catch (error) {
//       alert("Error saving attendance: " + error.message)
//     }
//   }

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "hadir":
//         return "bg-green-500"
//       case "izin":
//         return "bg-yellow-500"
//       case "sakit":
//         return "bg-blue-500"
//       case "alfa":
//         return "bg-red-500"
//       default:
//         return "bg-gray-300"
//     }
//   }

//   // Mock student data - in real app, this would come from API
//   useEffect(() => {
//     setStudents([
//       { id: "1", name: "Ahmad Rizki", nisn: "1234567890", status: null },
//       { id: "2", name: "Siti Nurhaliza", nisn: "1234567891", status: "hadir" },
//       { id: "3", name: "Budi Setiawan", nisn: "1234567892", status: "izin" },
//       { id: "4", name: "Dewi Sartika", nisn: "1234567893", status: null },
//       { id: "5", name: "Eko Prasetyo", nisn: "1234567894", status: "alfa" },
//     ])
//   }, [])

//   return (
//     <div className="space-y-6">
//       {/* Mobile Attendance Interface */}
//       <Card>
//         <CardHeader>
//           <div className="flex items-center space-x-2">
//             <Smartphone className="h-5 w-5 text-blue-600" />
//             <div>
//               <CardTitle>Absensi Mobile - Sesi Aktif</CardTitle>
//               <CardDescription>Akses otomatis berdasarkan jadwal guru yang login</CardDescription>
//             </div>
//           </div>
//         </CardHeader>
//         <CardContent>
//           <div className="bg-blue-50 p-4 rounded-lg mb-4">
//             <div className="flex items-center justify-between">
//               <div>
//                 <h3 className="font-semibold">{currentSession.subject}</h3>
//                 <p className="text-sm text-gray-600">{currentSession.class}</p>
//               </div>
//               <div className="text-right">
//                 <div className="flex items-center space-x-1">
//                   <Clock className="h-4 w-4" />
//                   <span className="text-sm">{currentSession.time}</span>
//                 </div>
//                 <p className="text-xs text-gray-500">{currentSession.teacher}</p>
//               </div>
//             </div>
//           </div>

//           <div className="space-y-3">
//             {students.map((student) => (
//               <div key={student.id} className="flex items-center justify-between p-3 border rounded-lg">
//                 <div className="flex items-center space-x-3">
//                   <div
//                     className={`w-3 h-3 rounded-full ${getStatusColor(attendanceData[student.id]?.status || student.status)}`}
//                   ></div>
//                   <div>
//                     <p className="font-medium">{student.name}</p>
//                     <p className="text-xs text-gray-500">NISN: {student.nisn}</p>
//                   </div>
//                 </div>
//                 <div className="flex space-x-1">
//                   {["hadir", "izin", "sakit", "alfa"].map((status) => (
//                     <Button
//                       key={status}
//                       size="sm"
//                       variant={
//                         (attendanceData[student.id]?.status || student.status) === status ? "default" : "outline"
//                       }
//                       onClick={() => updateAttendance(student.id, status)}
//                       className="text-xs px-2 py-1"
//                     >
//                       {status.charAt(0).toUpperCase() + status.slice(1)}
//                     </Button>
//                   ))}
//                 </div>
//               </div>
//             ))}
//           </div>

//           {selectedFile && (
//             <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
//               <p className="text-sm font-medium">Bukti Izin/Sakit</p>
//               <p className="text-xs text-gray-600">File: {selectedFile}</p>
//             </div>
//           )}

//           <div className="mt-4 flex justify-between">
//             <input
//               type="file"
//               accept="image/*"
//               onChange={(e) => setSelectedFile(e.target.files?.[0]?.name)}
//               className="text-sm"
//             />
//             <Button onClick={saveAttendance}>
//               <CheckCircle className="h-4 w-4 mr-2" />
//               Simpan Absensi
//             </Button>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Today's Attendance Summary */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Ringkasan Absensi Hari Ini</CardTitle>
//           <CardDescription>
//             {loading ? "Loading..." : error ? "Error loading data" : `${attendances?.length || 0} record absensi`}
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           {loading ? (
//             <div className="text-center py-8">Loading attendance data...</div>
//           ) : error ? (
//             <div className="text-center py-8 text-red-500">Error: {error}</div>
//           ) : (
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//               <div className="text-center p-4 bg-green-50 rounded-lg">
//                 <div className="text-2xl font-bold text-green-600">
//                   {attendances?.filter((a) => a.status === "hadir").length || 0}
//                 </div>
//                 <div className="text-sm text-gray-600">Hadir</div>
//               </div>
//               <div className="text-center p-4 bg-yellow-50 rounded-lg">
//                 <div className="text-2xl font-bold text-yellow-600">
//                   {attendances?.filter((a) => a.status === "izin").length || 0}
//                 </div>
//                 <div className="text-sm text-gray-600">Izin</div>
//               </div>
//               <div className="text-center p-4 bg-blue-50 rounded-lg">
//                 <div className="text-2xl font-bold text-blue-600">
//                   {attendances?.filter((a) => a.status === "sakit").length || 0}
//                 </div>
//                 <div className="text-sm text-gray-600">Sakit</div>
//               </div>
//               <div className="text-center p-4 bg-red-50 rounded-lg">
//                 <div className="text-2xl font-bold text-red-600">
//                   {attendances?.filter((a) => a.status === "alfa").length || 0}
//                 </div>
//                 <div className="text-sm text-gray-600">Alfa</div>
//               </div>
//             </div>
//           )}
//         </CardContent>
//       </Card>

//       {/* Attendance Alerts */}
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center space-x-2">
//             <AlertTriangle className="h-5 w-5 text-red-500" />
//             <span>Peringatan Absensi</span>
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-3">
//             <Alert className="border-yellow-200">
//               <AlertTriangle className="h-4 w-4" />
//               <AlertDescription>
//                 <div className="flex justify-between items-center">
//                   <div>
//                     <p className="font-medium">Eko Prasetyo - XII RPL 1</p>
//                     <p className="text-sm">Alfa 2 sesi - Notifikasi ke wali murid terkirim</p>
//                   </div>
//                   <Badge variant="secondary">Info</Badge>
//                 </div>
//               </AlertDescription>
//             </Alert>
//             <Alert className="border-red-200">
//               <AlertTriangle className="h-4 w-4" />
//               <AlertDescription>
//                 <div className="flex justify-between items-center">
//                   <div>
//                     <p className="font-medium">Rina Sari - XI TKJ 2</p>
//                     <p className="text-sm">Alfa 4 hari - Perlu penanganan Waka Kesiswaan</p>
//                   </div>
//                   <Badge variant="destructive">Urgent</Badge>
//                 </div>
//               </AlertDescription>
//             </Alert>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Attendance Rules */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <Card>
//           <CardHeader>
//             <CardTitle>Aturan Absensi</CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-3">
//             <div className="flex items-start space-x-2">
//               <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
//               <div>
//                 <p className="text-sm font-medium">1 Sesi = 2 Jam Pelajaran</p>
//                 <p className="text-xs text-gray-500">Absen sekali per sesi</p>
//               </div>
//             </div>
//             <div className="flex items-start space-x-2">
//               <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
//               <div>
//                 <p className="text-sm font-medium">Mata Pelajaran Gandeng</p>
//                 <p className="text-xs text-gray-500">Status mengikuti sesi sebelumnya</p>
//               </div>
//             </div>
//             <div className="flex items-start space-x-2">
//               <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
//               <div>
//                 <p className="text-sm font-medium">Koreksi Absensi</p>
//                 <p className="text-xs text-gray-500">1x kesempatan di hari yang sama</p>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle>Notifikasi Otomatis</CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-3">
//             <div className="flex items-start space-x-2">
//               <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
//               <div>
//                 <p className="text-sm font-medium">Alfa {">"} 2 Sesi</p>
//                 <p className="text-xs text-gray-500">Notifikasi ke wali murid</p>
//               </div>
//             </div>
//             <div className="flex items-start space-x-2">
//               <div className="w-2 h-2 bg-red-600 rounded-full mt-2"></div>
//               <div>
//                 <p className="text-sm font-medium">Alfa {">"} 3 Hari</p>
//                 <p className="text-xs text-gray-500">Notifikasi ke Waka Kesiswaan</p>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   )
// }
