"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useGetStudentById = (id: string) => {
  return useQuery({
    queryKey: ["students", id],
    queryFn: async () => {
      try {
        const res = await axios.get(`/api/students/${id}`);
        return res.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("Error fetching student:", error.response?.data || error.message);
        } else {
          console.error("Unexpected error:", error);
        }
        throw new Error("Failed to fetch student");
      }
    },
  });
};
