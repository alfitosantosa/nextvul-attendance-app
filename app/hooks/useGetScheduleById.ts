"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useGetScheduleById = (id: string) => {
  return useQuery({
    queryKey: ["schedules", id],
    queryFn: async () => {
      try {
        const res = await axios.get(`/api/schedules/${id}`);
        return res.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("Error fetching schedule:", error.response?.data || error.message);
        } else {
          console.error("Unexpected error:", error);
        }
        throw new Error("Failed to fetch schedule");
      }
    },
  });
};

export const useGetScheduleByIdTeacher = (id: string) => {
  return useQuery({
    queryKey: ["schedules", id],
    queryFn: async () => {
      try {
        const res = await axios.get(`/api/schedules/teacher/${id}`);
        return res.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("Error fetching schedule:", error.response?.data || error.message);
        } else {
          console.error("Unexpected error:", error);
        }
        throw new Error("Failed to fetch schedule");
      }
    },
  });
};
