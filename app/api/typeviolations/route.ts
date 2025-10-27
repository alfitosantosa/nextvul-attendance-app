// model ViolationType {
//   id             String       @id @default(cuid())
//   name           String
//   description    String
//   points         Int
//   category       String
//   academicYearId String
//   academicYear   AcademicYear @relation(fields: [academicYearId], references: [id])
//   violations     Violation[]

//   @@map("violation_types")
// }

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const violationTypes = await prisma.violationType.findMany();
    return NextResponse.json(violationTypes);
  } catch (error) {
    console.error("Error fetching violation types:", error);
    return NextResponse.json({ error: "Failed to fetch violation types" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, description, points, category, academicYearId } = await request.json();

    const violationType = await prisma.violationType.create({
      data: {
        name,
        description,
        points,
        category,
        academicYearId,
      },
    });
    return NextResponse.json(violationType);
  } catch (error) {
    console.error("Error creating violation type:", error);
    return NextResponse.json({ error: "Failed to create violation type" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, name, description, points, category, academicYearId } = await request.json();

    const violationType = await prisma.violationType.update({
      where: { id },
      data: {
        name,
        description,
        points,
        category,
        academicYearId,
      },
    });
    return NextResponse.json(violationType);
  } catch (error) {
    console.error("Error updating violation type:", error);
    return NextResponse.json({ error: "Failed to update violation type" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();

    const violationType = await prisma.violationType.delete({
      where: { id },
    });
    return NextResponse.json(violationType);
  } catch (error) {
    console.error("Error deleting violation type:", error);
    return NextResponse.json({ error: "Failed to delete violation type" }, { status: 500 });
  }
}
