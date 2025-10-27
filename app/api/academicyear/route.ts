// model AcademicYear {
//   id             String          @id @default(cuid())
//   year           String          @unique
//   startDate      DateTime
//   endDate        DateTime
//   isActive       Boolean         @default(false)
//   createdAt      DateTime        @default(now())
//   updatedAt      DateTime        @updatedAt
//   calendarEvents CalendarEvent[]
//   classes        Class[]
//   schedules      Schedule[]
//   students       Student[]
//   violationTypes ViolationType[]

//   @@map("academic_years")
// }

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const academicYears = await prisma.academicYear.findMany({
      include: {
        classes: true,
        students: true,
        schedules: true,
        calendarEvents: true,
        // violationTypes: true,
      },
    });
    return NextResponse.json(academicYears);
  } catch (error) {
    console.error("Error fetching academic years:", error);
    return NextResponse.json({ error: "Failed to fetch academic years" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { year, startDate, endDate, isActive } = await request.json();
    if (!year || !startDate || !endDate) {
      return NextResponse.json({ error: "Year, startDate, and endDate are required" }, { status: 400 });
    }

    const newAcademicYear = await prisma.academicYear.create({
      data: {
        year,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        isActive: isActive !== undefined ? isActive : false, // Default to false if not provided
      },
    });

    return NextResponse.json(newAcademicYear, { status: 201 });
  } catch (error) {
    console.error("Error creating academic year:", error);
    return NextResponse.json({ error: "Failed to create academic year" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, year, startDate, endDate, isActive } = await request.json();
    if (!id || !year || !startDate || !endDate) {
      return NextResponse.json({ error: "ID, year, startDate, and endDate are required" }, { status: 400 });
    }

    const updatedAcademicYear = await prisma.academicYear.update({
      where: { id },
      data: {
        year,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        isActive: isActive !== undefined ? isActive : false, // Default to false if not provided
      },
    });

    return NextResponse.json(updatedAcademicYear);
  } catch (error) {
    console.error("Error updating academic year:", error);
    return NextResponse.json({ error: "Failed to update academic year" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const deletedAcademicYear = await prisma.academicYear.delete({
      where: { id },
    });

    return NextResponse.json(deletedAcademicYear);
  } catch (error) {
    console.error("Error deleting academic year:", error);
    return NextResponse.json({ error: "Failed to delete academic year" }, { status: 500 });
  }
}
