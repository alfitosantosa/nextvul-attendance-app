// model Major {
//   id          String    @id @default(cuid())
//   code        String    @unique
//   name        String
//   description String?
//   isActive    Boolean   @default(true)
//   classes     Class[]
//   students    Student[]
//   subjects    Subject[]

//   @@map("majors")
// }

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const majors = await prisma.major.findMany({
      include: {
        classes: true,
        students: true,
        subjects: true,
      },
    });
    return NextResponse.json(majors);
  } catch (error) {
    console.error("Error fetching majors:", error);
    return NextResponse.json({ error: "Failed to fetch majors" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { code, name, description, isActive } = await request.json();
    if (!code || !name) {
      return NextResponse.json({ error: "Code and name are required" }, { status: 400 });
    }

    const newMajor = await prisma.major.create({
      data: {
        code,
        name,
        description,
        isActive: isActive !== undefined ? isActive : true, // Default to true if not provided
      },
    });

    return NextResponse.json(newMajor, { status: 201 });
  } catch (error) {
    console.error("Error creating major:", error);
    return NextResponse.json({ error: "Failed to create major" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, code, name, description, isActive } = await request.json();
    if (!id || !code || !name) {
      return NextResponse.json({ error: "ID, code, and name are required" }, { status: 400 });
    }

    const updatedMajor = await prisma.major.update({
      where: { id },
      data: {
        code,
        name,
        description,
        isActive: isActive !== undefined ? isActive : true, // Default to true if not provided
      },
    });

    return NextResponse.json(updatedMajor, { status: 200 });
  } catch (error) {
    console.error("Error updating major:", error);
    return NextResponse.json({ error: "Failed to update major" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const deletedMajor = await prisma.major.delete({
      where: { id },
    });

    return NextResponse.json(deletedMajor, { status: 200 });
  } catch (error) {
    console.error("Error deleting major:", error);
    return NextResponse.json({ error: "Failed to delete major" }, { status: 500 });
  }
}
