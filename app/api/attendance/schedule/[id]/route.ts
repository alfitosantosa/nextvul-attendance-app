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

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const attendances = await prisma.attendance.findMany({
      where: { scheduleId: id },
      include: {
        student: true,
        schedule: true,
      },
      orderBy: { date: "desc" },
    });
    return NextResponse.json(attendances);
  } catch (error) {
    console.error("Error fetching attendances:", error);
    return NextResponse.json({ error: "Failed to fetch attendances" }, { status: 500 });
  }
}
