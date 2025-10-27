"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useGetAttendanceByIdSchedule = (id: string) => {
  return useQuery({
    queryKey: ["attendance", id],
    queryFn: async () => {
      try {
        const res = await axios.get(`/api/attendance/schedule/${id}`);
        return res.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("Error fetching attendance:", error.response?.data || error.message);
        } else {
          console.error("Unexpected error:", error);
        }
        throw new Error("Failed to fetch attendance");
      }
    },
  });
};
