"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export const useGetSpecialSchedules = () => {
  return useQuery({
    queryKey: ["specialSchedules"],
    queryFn: async () => {
      const response = await axios.get("/api/specialschedule");
      return response.data;
    },
  });
};

export const useCreateSpecialSchedule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      const response = await axios.post("/api/specialschedule", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["specialSchedules"] });
    },
  });
};

export const useUpdateSpecialSchedule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      const response = await axios.put("/api/specialschedule", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["specialSchedules"] });
    },
  });
};

export const useDeleteSpecialSchedule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const response = await axios.delete("/api/specialschedule", { data: { id } });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["specialSchedules"] });
    },
  });
};
