// app/api/students/by-ids/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const idsParam = searchParams.get("ids");

    if (!idsParam) {
      return NextResponse.json({ error: "IDs required" }, { status: 400 });
    }

    const ids = idsParam.split(",");

    const students = await prisma.attendance.findMany({
      where: {
        studentId: {
          in: ids,
        },
      },
      include: {
        student: true,
        schedule: {
          include: {
            class: true,
            subject: true,
            teacher: true,
            academicYear: true,
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
