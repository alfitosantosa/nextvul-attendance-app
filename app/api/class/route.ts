// model Class {
//   id             String       @id @default(cuid())
//   name           String
//   grade          Int
//   majorId        String
//   academicYearId String
//   capacity       Int          @default(36)
//   academicYear   AcademicYear @relation(fields: [academicYearId], references: [id])
//   major          Major        @relation(fields: [majorId], references: [id])
//   schedules      Schedule[]
//   students       Student[]
//   violations     Violation[]

//   @@unique([name, academicYearId])
//   @@map("classes")
// }

"use server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const classes = await prisma.class.findMany({
      include: {
        academicYear: true,
        major: true,
        students: true,
        schedules: true,
        violations: true,

        _count: { select: { students: true, schedules: true, violations: true } },
      },
      orderBy: { name: "asc" },
    });
    return NextResponse.json(classes);
  } catch (error) {
    console.error("Error fetching classes:", error);
    return NextResponse.json({ error: "Failed to fetch classes" }, { status: 500 });
  }
}
export async function POST(request: NextRequest) {
  try {
    const { name, grade, majorId, academicYearId, capacity } = await request.json();
    if (!name || !grade || !majorId || !academicYearId) {
      return NextResponse.json({ error: "Name, grade, majorId, and academicYearId are required" }, { status: 400 });
    }

    const newClass = await prisma.class.create({
      data: {
        name,
        grade,
        majorId,
        academicYearId,
        capacity: capacity || 36, // Default capacity if not provided
      },
      include: {
        academicYear: true,
        major: true,
      },
    });

    return NextResponse.json(newClass, { status: 201 });
  } catch (error) {
    console.error("Error creating class:", error);
    return NextResponse.json({ error: "Failed to create class" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, name, grade, majorId, academicYearId, capacity } = await request.json();
    if (!id || !name || !grade || !majorId || !academicYearId) {
      return NextResponse.json({ error: "ID, name, grade, majorId, and academicYearId are required" }, { status: 400 });
    }

    const updatedClass = await prisma.class.update({
      where: { id },
      data: {
        name,
        grade,
        majorId,
        academicYearId,
        capacity: capacity || 36, // Default capacity if not provided
      },
      include: {
        academicYear: true,
        major: true,
      },
    });

    return NextResponse.json(updatedClass);
  } catch (error) {
    console.error("Error updating class:", error);
    return NextResponse.json({ error: "Failed to update class" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const deletedClass = await prisma.class.delete({
      where: { id },
    });

    return NextResponse.json(deletedClass, { status: 200 });
  } catch (error) {
    console.error("Error deleting class:", error);
    return NextResponse.json({ error: "Failed to delete class" }, { status: 500 });
  }
}
// app/api/class/route.ts
