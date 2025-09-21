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
      } catch (error: any) {
        throw new Error(error?.response?.data?.message || "Failed to fetch student");
      }
    },
  });
};
