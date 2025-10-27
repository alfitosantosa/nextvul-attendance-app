"use client";

// app/api/violations/student/[id]/route.ts

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useGetViolationsByIdStudent = (id: string) => {
  return useQuery({
    queryKey: ["violations", id],
    queryFn: async () => {
      try {
        const res = await axios.get(`/api/violations/student/${id}`);
        return res.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("Error fetching violations:", error.response?.data || error.message);
        } else {
          console.error("Unexpected error:", error);
        }
        throw new Error("Failed to fetch violations");
      }
    },
  });
};
