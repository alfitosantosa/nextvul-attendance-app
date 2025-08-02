"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export const useGetMajors = () => {
  return useQuery({
    queryKey: ["majors"],
    queryFn: async () => {
      try {
        const res = await axios.get("/api/major");
        return res.data;
      } catch (error: any) {
        throw new Error(error?.response?.data?.message || "Failed to fetch majors");
      }
    },
  });
};

export const useCreateMajor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await axios.post("/api/major", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["majors"] });
    },
    onError: (error: any) => {
      console.error("Error creating major:", error);
      throw new Error(error?.response?.data?.message || "Failed to create major");
    },
  });
};

export const useUpdateMajor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await axios.put("/api/major", data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["majors"] });
    },
    onError: (error: any) => {
      console.error("Error updating major:", error);
      throw new Error(error?.response?.data?.message || "Failed to update major");
    },
  });
};

export const useDeleteMajor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await axios.delete(`/api/major/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["majors"] });
    },
    onError: (error: any) => {
      console.error("Error deleting major:", error);
      throw new Error(error?.response?.data?.message || "Failed to delete major");
    },
  });
};

