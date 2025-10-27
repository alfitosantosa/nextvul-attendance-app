"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useGetSchedulesByIdClass = (classId: string) => {
  return useQuery({
    queryKey: ["schedules", classId],
    queryFn: async () => {
      const response = await axios.get(`/api/schedules/class/${classId}`);
      return response.data;
    },
  });
};
