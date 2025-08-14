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
      } catch (error: any) {
        throw new Error(error?.response?.data?.message || "Failed to fetch data");
      }
    },
  });
};
