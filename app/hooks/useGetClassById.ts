"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useGetClassById = (id: string) => {
  return useQuery({
    queryKey: ["class", id],
    queryFn: async () => {
      try {
        const res = await axios.get(`/api/class/${id}`);
        return res.data;
      } catch (error: any) {
        throw new Error(error?.response?.data?.message || "Failed to fetch class");
      }
    },
  });
};
