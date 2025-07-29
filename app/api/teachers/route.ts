// model Teacher {
//   id         String     @id @default(cuid())
//   userId     String     @unique
//   employeeId String     @unique
//   nik        String     @unique
//   birthPlace String
//   birthDate  DateTime
//   address    String
//   createdAt  DateTime   @default(now())
//   updatedAt  DateTime   @updatedAt
//   endDate    DateTime?
//   gender     String     @default("L")
//   position   String?
//   startDate  DateTime   @default(now())
//   status     String     @default("active")
//   name       String
//   avatarUrl  String?
//   schedules  Schedule[]
//   user       User       @relation(fields: [userId], references: [id], onDelete: Cascade)
//
//   @@map("teachers")
// }
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const teachers = await prisma.teacher.findMany({
      select: {
        id: true,
        userId: true,
        name: true,
        employeeId: true,
        nik: true,
        birthPlace: true,
        birthDate: true,
        createdAt: true,
        updatedAt: true,
        address: true,
        avatarUrl: true,
        endDate: true,

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
    return NextResponse.json(teachers);
  } catch (error) {
    console.error("Error fetching teachers:", error);
    return NextResponse.json({ error: "Failed to fetch teachers" }, { status: 500 });
  }
}
export async function POST(request: NextRequest) {
  try {
    const { userId, employeeId, name, nik, birthPlace, birthDate, address, avatarUrl } = await request.json();
    if (!userId || !employeeId || !name || !nik || !birthPlace || !birthDate || !address) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }
    const newTeacher = await prisma.teacher.create({
      data: {
        userId,
        employeeId,
        name,
        nik,
        avatarUrl,
        birthPlace,
        birthDate: new Date(birthDate),
        address,
      },
    });
    return NextResponse.json(newTeacher, { status: 201 });
  } catch (error) {
    console.error("Error creating teacher:", error);
    return NextResponse.json({ error: "Failed to create teacher" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, data } = await request.json();
    if (!id || !data) {
      return NextResponse.json({ error: "Teacher ID and data are required" }, { status: 400 });
    }

    const updatedTeacher = await prisma.teacher.update({
      where: { id },
      data,
    });

    return NextResponse.json(updatedTeacher, { status: 200 });
  } catch (error) {
    console.error("Error updating teacher:", error);
    return NextResponse.json({ error: "Failed to update teacher" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: "Teacher ID is required" }, { status: 400 });
    }

    await prisma.teacher.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Teacher deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting teacher:", error);
    return NextResponse.json({ error: "Failed to delete teacher" }, { status: 500 });
  }
}
