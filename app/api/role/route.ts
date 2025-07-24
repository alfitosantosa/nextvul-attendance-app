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
