"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export const useGetSchedules = () => {
  return useQuery({
    queryKey: ["schedules"],
    queryFn: async () => {
      const response = await axios.get("/api/schedules");
      return response.data;
    },
  });
};

export const useCreateSchedule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      const response = await axios.post("/api/schedules", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
    },
  });
};

export const useUpdateSchedule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      const response = await axios.put(`/api/schedules/`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
    },
  });
};

export const useDeleteSchedule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const response = await axios.delete(`/api/schedules/`, { data: { id } });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedules"] });
    },
  });
};

export const useGetSchedulesByTeacher = (teacherId: string) => {
  return useQuery({
    queryKey: ["schedules", teacherId],
    queryFn: async () => {
      const response = await axios.get(`/api/schedules/teacher/${teacherId}`);
      return response.data;
    },
    enabled: !!teacherId, // Only run the query if teacherId is provided
  });
};

export const useGetSchedulesByStudent = (studentId: string) => {
  return useQuery({
    queryKey: ["schedules", studentId],
    queryFn: async () => {
      const response = await axios.get(`/api/schedules/student/${studentId}`);
      return response.data;
    },
    enabled: !!studentId, // Only run the query if studentId is provided
  });
};
