"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useGetTeachers = () => {
  return useQuery({
    queryKey: ["teachers"],
    queryFn: async () => {
      try {
        const res = await axios.get("/api/teachers");
        return res.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("Error fetching teachers:", error.response?.data || error.message);
        } else {
          console.error("Unexpected error:", error);
        }
        throw new Error("Failed to fetch teachers");
      }
    },
  });
};

export const useCreateTeacher = () => {
  return async (data: any) => {
    try {
      const res = await axios.post("/api/teachers", data);
      return res.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error creating teacher:", error.response?.data || error.message);
      } else {
        console.error("Unexpected error:", error);
      }
      throw new Error("Failed to create teacher");
    }
  };
};

export const useUpdateTeacher = () => {
  return async (data: any) => {
    try {
      const res = await axios.put("/api/teachers", data);
      return res.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error updating teacher:", error.response?.data || error.message);
      } else {
        console.error("Unexpected error:", error);
      }
      throw new Error("Failed to update teacher");
    }
  };
};

export const useDeleteTeacher = () => {
  return async (id: string) => {
    try {
      const res = await axios.delete(`/api/teachers`, { data: { id } });
      return res.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error deleting teacher:", error.response?.data || error.message);
      } else {
        console.error("Unexpected error:", error);
      }
      throw new Error("Failed to delete teacher");
    }
  };
};
