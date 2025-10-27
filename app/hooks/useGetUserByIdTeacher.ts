"use client";

// app/api/users/teacher/[id]

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useGetUserByIdTeacher = (id: string) => {
  return useQuery({
    queryKey: ["users", id],
    queryFn: async () => {
      try {
        const res = await axios.get(`/api/users/id/${id}`);
        return res.data;
      } catch (error: any) {
        throw new Error(error?.response?.data?.message || "Failed to fetch user");
      }
    },
    enabled: !!id, // Only run query if id exists
  });
};
