import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }
    const users = await prisma.user.findFirst({
      where: { id },
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
    });
    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}
