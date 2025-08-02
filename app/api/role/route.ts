"use server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// model Role {
//   id          String     @id @default(cuid())
//   name        String     @unique
//   description String
//   permissions String[]
//   users       UserRole[]

//   @@map("roles")
// }

export async function GET(request: NextRequest) {
  try {
    const roles = await prisma.role.findMany();
    return NextResponse.json(roles);
  } catch (error) {
    console.error("Error fetching roles:", error);
    return NextResponse.json({ error: "Failed to fetch roles" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, description, permissions } = await request.json();
    if (!name || !description || !permissions) {
      return NextResponse.json({ error: "Name, description, and permissions are required" }, { status: 400 });
    }

    const newRole = await prisma.role.create({
      data: {
        name,
        description,
        permissions,
      },
    });

    return NextResponse.json(newRole, { status: 201 });
  } catch (error) {
    console.error("Error creating role:", error);
    return NextResponse.json({ error: "Failed to create role" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, name, description, permissions } = await request.json();
    if (!id || !name || !description || !permissions) {
      return NextResponse.json({ error: "ID, name, description, and permissions are required" }, { status: 400 });
    }

    const updatedRole = await prisma.role.update({
      where: { id },
      data: {
        name,
        description,
        permissions,
      },
    });

    return NextResponse.json(updatedRole);
  } catch (error) {
    console.error("Error updating role:", error);
    return NextResponse.json({ error: "Failed to update role" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    await prisma.role.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Role deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting role:", error);
    return NextResponse.json({ error: "Failed to delete role" }, { status: 500 });
  }
}
  