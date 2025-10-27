"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useRolesByIdUser = (id: string) => {
  return useQuery({
    queryKey: ["class", id],
    queryFn: async () => {
      try {
        const res = await axios.get(`/api/roles/user/id/${id}`);
        return res.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("Error fetching class:", error.response?.data || error.message);
        } else {
          console.error("Unexpected error:", error);
        }
        throw new Error("Failed to fetch class");
      }
    },
  });
};
