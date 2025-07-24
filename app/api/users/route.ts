import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// model User {
//   id            String     @id @default(cuid())
//   parent        Parent?
//   student       Student?
//   teacher       Teacher?
//   roles         UserRole[]

//   @@map("users")
// }

export async function GET(request: NextRequest) {
  try {
    const users = await prisma.user.findMany({
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

export async function POST(request: NextRequest) {
  try {
    // get id from clerk
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const newUser = await prisma.user.create({
      data: {
        id: id,
      },
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, data } = await request.json();
    if (!id || !data) {
      return NextResponse.json({ error: "User ID and data are required" }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data,
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
