// model Subject {
//   id          String     @id @default(cuid())
//   code        String     @unique
//   name        String
//   description String?
//   majorId     String?
//   credits     Int        @default(2)
//   isActive    Boolean    @default(true)
//   schedules   Schedule[]
//   major       Major?     @relation(fields: [majorId], references: [id])

//   @@map("subjects")
// }

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const subjects = await prisma.subject.findMany({
      include: { major: true, schedules: true },
      orderBy: { name: "asc" },
    });
    return NextResponse.json(subjects);
  } catch (error) {
    console.error("Error fetching subjects:", error);
    return NextResponse.error();
  }
}

export async function POST(request: NextRequest) {
  try {
    const { code, name, description, majorId, credits } = await request.json();
    const subject = await prisma.subject.create({
      data: {
        code,
        name,
        description,
        majorId,
        credits,
      },
    });
    return NextResponse.json(subject);
  } catch (error) {
    console.error("Error creating subject:", error);
    return NextResponse.error();
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, code, name, description, majorId, credits } = await request.json();
    const subject = await prisma.subject.update({
      where: { id },
      data: {
        code,
        name,
        description,
        majorId,
        credits,
      },
    });
    return NextResponse.json(subject);
  } catch (error) {
    console.error("Error updating subject:", error);
    return NextResponse.error();
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    await prisma.subject.delete({
      where: { id },
    });
    return NextResponse.json({ message: "Subject deleted successfully" });
  } catch (error) {
    console.error("Error deleting subject:", error);
    return NextResponse.error();
  }
}
