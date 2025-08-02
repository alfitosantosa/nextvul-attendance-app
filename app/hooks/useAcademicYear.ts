"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export const useGetAcademicYears = () => {
  return useQuery({
    queryKey: ["academicYears"],
    queryFn: async () => {
      try {
        const res = await axios.get("/api/academicyear");
        return res.data;
      } catch (error: any) {
        throw new Error(error?.response?.data?.message || "Failed to fetch academic years");
      }
    },
  });
};

export const useCreateAcademicYear = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await axios.post("/api/academic-year", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["academicYears"] });
    },
    onError: (error: any) => {
      console.error("Error creating academic year:", error);
      throw new Error(error?.response?.data?.message || "Failed to create academic year");
    },
  });
};

export const useUpdateAcademicYear = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await axios.put("/api/academic-year", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["academicYears"] });
    },
    onError: (error: any) => {
      console.error("Error updating academic year:", error);
      throw new Error(error?.response?.data?.message || "Failed to update academic year");
    },
  });
};

export const useDeleteAcademicYear = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await axios.delete(`/api/academic-year/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["academicYears"] });
    },
    onError: (error: any) => {
      console.error("Error deleting academic year:", error);
      throw new Error(error?.response?.data?.message || "Failed to delete academic year");
    },
  });
};
