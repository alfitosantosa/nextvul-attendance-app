// lib/clerk.ts
import axios from "axios";

const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY;

const clerk = axios.create({
  baseURL: "https://api.clerk.com/v1",
  headers: {
    Authorization: `Bearer ${CLERK_SECRET_KEY}`,
    "Content-Type": "application/json",
  },
});

export async function getAllClerkUsers() {
  try {
    const response = await clerk.get("/users");
    return response.data; // array of user objects
  } catch (error: any) {
    console.error("Error fetching Clerk users:", error?.response?.data || error.message);
    throw new Error("Failed to fetch Clerk users");
  }
}
