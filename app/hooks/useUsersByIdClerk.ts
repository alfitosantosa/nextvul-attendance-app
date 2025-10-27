"use client";

// app/api/users/route.ts

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useGetUserByIdClerk = (id: string) => {
  return useQuery({
    queryKey: ["users", id],
    queryFn: async () => {
      try {
        const res = await axios.get(`/api/users/clerk/id/${id}`);
        return res.data;
      } catch (error: any) {
        throw new Error(error?.response?.data?.message || "Failed to fetch user");
      }
    },
  });
};
