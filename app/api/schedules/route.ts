// model Schedule {
//   id             String       @id @default(cuid())
//   classId        String
//   subjectId      String
//   teacherId      String
//   academicYearId String
//   dayOfWeek      Int
//   startTime      String
//   endTime        String
//   room           String?
//   attendances    Attendance[]
//   academicYear   AcademicYear @relation(fields: [academicYearId], references: [id])
//   class          Class        @relation(fields: [classId], references: [id])
//   subject        Subject      @relation(fields: [subjectId], references: [id])
//   teacher        User         @relation("TeacherSchedule", fields: [teacherId], references: [id])

//   @@unique([classId, subjectId, teacherId, dayOfWeek, startTime])
//   @@map("schedules")
// }

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const schedules = await prisma.schedule.findMany();
    return NextResponse.json(schedules);
  } catch (error) {
    console.error("Error fetching schedules:", error);
    return NextResponse.error();
  }
}

export async function POST(request: NextRequest) {
  try {
    const { classId, subjectId, teacherId, academicYearId, dayOfWeek, startTime, endTime, room } = await request.json();
    const schedule = await prisma.schedule.create({
      data: {
        classId,
        subjectId,
        teacherId,
        academicYearId,
        dayOfWeek,
        startTime,
        endTime,
        room,
      },
    });
    return NextResponse.json(schedule);
  } catch (error) {
    console.error("Error creating schedule:", error);
    return NextResponse.error();
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, classId, subjectId, teacherId, academicYearId, dayOfWeek, startTime, endTime, room } = await request.json();
    const schedule = await prisma.schedule.update({
      where: { id },
      data: {
        classId,
        subjectId,
        teacherId,
        academicYearId,
        dayOfWeek,
        startTime,
        endTime,
        room,
      },
    });
    return NextResponse.json(schedule);
  } catch (error) {
    console.error("Error updating schedule:", error);
    return NextResponse.error();
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    await prisma.schedule.delete({
      where: { id },
    });
    return NextResponse.json({ message: "Schedule deleted successfully" });
  } catch (error) {
    console.error("Error deleting schedule:", error);
    return NextResponse.error();
  }
}
