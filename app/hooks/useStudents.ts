"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useGetStudents = () => {
  return useQuery({
    queryKey: ["students"],
    queryFn: async () => {
      try {
        const res = await axios.get("/api/students");
        return res.data.data;
      } catch (error: any) {
        throw new Error(error?.response?.data?.message || "Failed to fetch data");
      }
    },
  });
};
