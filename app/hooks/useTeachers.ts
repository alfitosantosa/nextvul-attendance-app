"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useGetTeachers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      try {
        const res = await axios.get("/api/teachers");
        return res.data.data;
      } catch (error: any) {
        throw new Error(error?.response?.data?.message || "Failed to fetch data");
      }
    },
  });
};
