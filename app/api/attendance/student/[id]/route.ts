import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

//use params for get id

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const attendance = await prisma.attendance.findMany({
      where: { studentId: id },
      include: {
        schedule: {
          include: {
            class: true,
            subject: true,
            teacher: true,
            academicYear: true,
          },
        },
      },
      orderBy: { date: "desc" },
    });
    return NextResponse.json(attendance);
  } catch (error) {
    console.error("Error fetching attendance by student:", error);
    return NextResponse.error();
  }
}
