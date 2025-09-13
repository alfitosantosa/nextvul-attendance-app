//create attendance bulk

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

export async function POST(request: NextRequest) {
  const { attendances } = await request.json();

  try {
    const createdAttendances = await prisma.attendance.createMany({
      data: attendances,
    });
    return NextResponse.json(createdAttendances);
  } catch (error) {
    console.error("Error creating bulk attendance:", error);
    return NextResponse.json({ error: "Failed to create bulk attendance" }, { status: 500 });
  }
}

// put many attendance

export async function PUT(request: NextRequest) {
  const { attendances } = await request.json();

  try {
    const updatePromises = attendances.map((attendance: any) =>
      prisma.attendance.update({
        where: {
          id: attendance.id,
        },
        data: attendance,
      })
    );
    const updatedAttendances = await Promise.all(updatePromises);
    return NextResponse.json(updatedAttendances);
  } catch (error) {
    console.error("Error updating bulk attendance:", error);
    return NextResponse.json({ error: "Failed to update bulk attendance" }, { status: 500 });
  }
}
