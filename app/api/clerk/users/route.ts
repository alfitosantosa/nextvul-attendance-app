// app/api/clerk-users/route.ts
import { NextResponse } from "next/server";
import { getAllClerkUsers } from "@/lib/clerk";

export async function GET() {
  try {
    const users = await getAllClerkUsers();
    return NextResponse.json(users);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
