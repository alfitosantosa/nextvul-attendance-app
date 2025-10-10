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

    const students = await prisma.user.findMany({
      where: {
        id: {
          in: ids,
        },
      },
      include: {
        class: {
          select: {
            id: true,
            name: true,
          },
        },
        major: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    const formattedStudents = students.map((student: any) => ({
      id: student.id,
      name: student.name,
      nisn: student.nisn,
      avatarUrl: student.user?.avatarUrl,
      status: student.status,
      class: student.class,
      major: student.major,
    }));
    return NextResponse.json(formattedStudents);
  } catch (error) {
    console.error("Error fetching students:", error);
    return NextResponse.json({ error: "Failed to fetch students" }, { status: 500 });
  }
}
