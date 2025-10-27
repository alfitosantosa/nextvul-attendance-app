// model CalendarEvent {
//   id             String       @id @default(cuid())
//   title          String
//   description    String?
//   eventDate      DateTime
//   eventType      String
//   isPublished    Boolean      @default(false)
//   academicYearId String
//   createdAt      DateTime     @default(now())
//   updatedAt      DateTime     @updatedAt
//   academicYear   AcademicYear @relation(fields: [academicYearId], references: [id])

//   @@map("calendar_events")
// }

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const specialSchedules = await prisma.calendarEvent.findMany();
    return NextResponse.json(specialSchedules);
  } catch (error) {
    console.error("Error fetching special schedules:", error);
    return NextResponse.error();
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, description, eventDate, eventType, academicYearId, isPublished } = await request.json();
    const specialSchedule = await prisma.calendarEvent.create({
      data: { title, description, eventDate, eventType, academicYearId, isPublished },
    });
    return NextResponse.json(specialSchedule);
  } catch (error) {
    console.error("Error creating special schedule:", error);
    return NextResponse.error();
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, title, description, eventDate, eventType, academicYearId, isPublished } = await request.json();
    const specialSchedule = await prisma.calendarEvent.update({
      where: { id },
      data: { title, description, eventDate, eventType, academicYearId, isPublished },
    });
    return NextResponse.json(specialSchedule);
  } catch (error) {
    console.error("Error updating special schedule:", error);
    return NextResponse.error();
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    const specialSchedule = await prisma.calendarEvent.delete({ where: { id } });
    return NextResponse.json(specialSchedule);
  } catch (error) {
    console.error("Error deleting special schedule:", error);
    return NextResponse.error();
  }
}
