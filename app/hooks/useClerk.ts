"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useGetClerk = () => {
  return useQuery({
    queryKey: ["clerk"],
    queryFn: async () => {
      try {
        const res = await axios.get("/api/clerk/users");
        return res.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("Error fetching clerk:", error.response?.data || error.message);
        } else {
          console.error("Unexpected error:", error);
        }
        throw new Error("Failed to fetch clerk");
      }
    },
  });
};
