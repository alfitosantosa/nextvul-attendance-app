"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useGetAttendanceByIdStudent = (id: string) => {
  return useQuery({
    queryKey: ["attendance", id],
    queryFn: async () => {
      try {
        const res = await axios.get(`/api/attendance/student/${id}`);
        return res.data;
      } catch (error: any) {
        throw new Error(error?.response?.data?.message || "Failed to fetch attendance by student");
      }
    },
  });
};
