"use client";

import { useGetScheduleById } from "@/app/hooks/useGetScheduleById";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import { useState } from "react";

export default function teacherAttendancePage() {
  const [selectedDay, setSelectedDay] = useState<string>("all");

  const { data: scheduleData = [], isLoading: isLoadingSchedule, error: scheduleError } = useGetScheduleById("cmeh3pgni000ggqr6dnurzoaf");

  const getDayName = (dayOfWeek: number) => {
    const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    return days[dayOfWeek];
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

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Your Schedule</h1>

            {/* Day Filter Dropdown */}
            <div className="mb-6">
              <label className="block text-sm font-mediummb-2">Filter berdasarkan hari:</label>
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

            {isLoadingSchedule ? (
              <p>Loading schedule...</p>
            ) : scheduleError ? (
              <p className="text-red-500">Error loading schedule: {(scheduleError as Error).message}</p>
            ) : (
              <div className="space-y-4">
                {filteredScheduleData.length === 0 ? (
                  <p className="text-gray-500">Tidak ada jadwal untuk hari yang dipilih.</p>
                ) : (
                  filteredScheduleData.map((schedule: any) => (
                    <div key={schedule.id} className="bg-white shadow rounded-lg p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800 mb-2">{schedule.subject.name}</h3>
                          <p className="text-gray-600">Kode: {schedule.subject.code}</p>
                          <p className="text-gray-600">Kelas: {schedule.class.name}</p>
                          <p className="text-gray-600">Ruangan: {schedule.room}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Hari: {getDayName(schedule.dayOfWeek)}</p>
                          <p className="text-gray-600">
                            Waktu: {schedule.startTime} - {schedule.endTime}
                          </p>
                          <p className="text-gray-600">SKS: {schedule.subject.credits}</p>
                          <p className="text-gray-600">Tahun Akademik: {schedule.academicYear.year}</p>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t">
                        <Button className="">Lihat Absensi</Button>
                        <Link href={`/teacher/attendance/${schedule.id}`} passHref>
                          <Button className="ml-2">Buat Absensi Hari ini</Button>
                        </Link>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
