// model Student {
//   id             String       @id @default(cuid())
//   userId         String       @unique
//   nisn           String       @unique
//   birthPlace     String
//   birthDate      DateTime
//   nik            String       @unique
//   address        String
//   classId        String
//   academicYearId String
//   createdAt      DateTime     @default(now())
//   updatedAt      DateTime     @updatedAt
//   enrollmentDate DateTime     @default(now())
//   gender         String
//   graduationDate DateTime?
//   majorId        String
//   parentPhone    String?
//   status         String       @default("active")
//   attendances    Attendance[]
//   parents        Parent[]
//   payments       Payment[]
//   academicYear   AcademicYear @relation(fields: [academicYearId], references: [id])
//   class          Class        @relation(fields: [classId], references: [id])
//   major          Major        @relation(fields: [majorId], references: [id])
//   user           User         @relation(fields: [userId], references: [id], onDelete: Cascade)
//   violations     Violation[]

//   @@map("students")
// }

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const students = await prisma.student.findMany({
      select: {
        id: true,
        userId: true,
        nisn: true,
        name: true,
        birthPlace: true,
        birthDate: true,
        nik: true,
        address: true,
        classId: true,
        academicYearId: true,
        enrollmentDate: true,
        gender: true,
        graduationDate: true,
        majorId: true,
        parentPhone: true,
        user: {
          select: {
            id: true,
            parent: {
              select: {
                id: true,
              },
            },
            student: {
              select: {
                id: true,
              },
            },
            teacher: {
              select: {
                id: true,
              },
            },
            roles: {
              select: {
                role: true,
              },
            },
          },
        },
      },
    });
    return NextResponse.json(students);
  } catch (error) {
    console.error("Error fetching students:", error);
    return NextResponse.json({ error: "Failed to fetch students" }, { status: 500 });
  }
}
export async function POST(request: NextRequest) {
  try {
    const { userId, nisn, name, avatarUrl, birthPlace, birthDate, nik, address, classId, academicYearId, enrollmentDate, gender, graduationDate, majorId, parentPhone } = await request.json();
    if (!userId || !nisn || !birthPlace || !birthDate || !nik || !address || !classId || !academicYearId || !enrollmentDate || !gender || !graduationDate || !majorId || !parentPhone) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const newStudent = await prisma.student.create({
      data: {
        userId,
        nisn,
        name,
        avatarUrl,
        birthPlace,
        birthDate,
        nik,
        address,
        classId,
        academicYearId,
        enrollmentDate,
        gender,
        graduationDate,
        majorId,
        parentPhone,
      },
    });

    return NextResponse.json(newStudent, { status: 201 });
  } catch (error) {
    console.error("Error creating student:", error);
    return NextResponse.json({ error: "Failed to create student" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, data } = await request.json();
    if (!id || !data) {
      return NextResponse.json({ error: "Student ID and data are required" }, { status: 400 });
    }

    const updatedStudent = await prisma.student.update({
      where: { id },
      data,
    });

    return NextResponse.json(updatedStudent, { status: 200 });
  } catch (error) {
    console.error("Error updating student:", error);
    return NextResponse.json({ error: "Failed to update student" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: "Student ID is required" }, { status: 400 });
    }

    await prisma.student.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Student deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting student:", error);
    return NextResponse.json({ error: "Failed to delete student" }, { status: 500 });
  }
}
