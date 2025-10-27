// model Attendance {
//   id         String   @id @default(cuid())
//   studentId  String
//   scheduleId String
//   status     String
//   notes      String?
//   createdAt  DateTime @default(now())
//   date       DateTime
//   schedule   Schedule @relation(fields: [scheduleId], references: [id])
//   student    User     @relation("StudentAttendance", fields: [studentId], references: [id])

//   @@unique([studentId, scheduleId, date])
//   @@map("attendances")
// }

"use server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const attendances = await prisma.attendance.findMany({
      include: {
        student: true,
        schedule: {
          include: {
            class: true,
            subject: true,
            teacher: true,
            academicYear: true,
          },
        },
      },
      orderBy: { date: "desc" },
    });
    return NextResponse.json(attendances);
  } catch (error) {
    console.error("Error fetching attendances:", error);
    return NextResponse.json({ error: "Failed to fetch attendances" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const { studentId, scheduleId, status, notes, date } = await request.json();

  try {
    const attendance = await prisma.attendance.create({
      data: {
        studentId,
        scheduleId,
        status,
        notes,
        date,
      },
    });
    return NextResponse.json(attendance);
  } catch (error) {
    console.error("Error creating attendance:", error);
    return NextResponse.json({ error: "Failed to create attendance" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const { id, studentId, scheduleId, status, notes, date } = await request.json();

  try {
    const attendance = await prisma.attendance.update({
      where: { id },
      data: {
        studentId,
        scheduleId,
        status,
        notes,
        date,
      },
    });
    return NextResponse.json(attendance);
  } catch (error) {
    console.error("Error updating attendance:", error);
    return NextResponse.json({ error: "Failed to update attendance" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const { id } = await request.json();

  try {
    const attendance = await prisma.attendance.delete({
      where: { id },
    });
    return NextResponse.json(attendance);
  } catch (error) {
    console.error("Error deleting attendance:", error);
    return NextResponse.json({ error: "Failed to delete attendance" }, { status: 500 });
  }
}

//create attendance bulk
