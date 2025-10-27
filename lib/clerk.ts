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
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error fetching Clerk users:", error.response?.data || error.message);
    } else {
      console.error("Unexpected error:", error);
    }
    throw new Error("Failed to fetch Clerk users");
  }
}
