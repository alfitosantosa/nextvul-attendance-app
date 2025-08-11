"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useGetTeachers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      try {
        const res = await axios.get("/api/teachers");
        return res.data.data;
      } catch (error: any) {
        throw new Error(error?.response?.data?.message || "Failed to fetch data");
      }
    },
  });
};

export const useCreateTeacher = () => {
  return async (data: any) => {
    try {
      const res = await axios.post("/api/teachers", data);
      return res.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || "Failed to create teacher");
    }
  };
};

export const useUpdateTeacher = () => {
  return async (data: any) => {
    try {
      const res = await axios.put("/api/teachers", data);
      return res.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || "Failed to update teacher");
    }
  };
};

export const useDeleteTeacher = () => {
  return async (id: string) => {
    try {
      const res = await axios.delete(`/api/teachers/`, { data: { id } });
      return res.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || "Failed to delete teacher");
    }
  };
};

export const useGetTeacherById = (id: string) => {
  return useQuery({
    queryKey: ["teachers", id],
    queryFn: async () => {
      try {
        const res = await axios.get(`/api/teachers/${id}`);
        return res.data;
      } catch (error: any) {
        throw new Error(error?.response?.data?.message || "Failed to fetch teacher");
      }
    },
  });
};

export const useGetTeacherClasses = (teacherId: string) => {
  return useQuery({
    queryKey: ["teachers", teacherId, "classes"],
    queryFn: async () => {
      try {
        const res = await axios.get(`/api/teachers/${teacherId}/classes`);
        return res.data;
      } catch (error: any) {
        throw new Error(error?.response?.data?.message || "Failed to fetch teacher classes");
      }
    },
  });
};

export const useGetTeacherSubjects = (teacherId: string) => {
  return useQuery({
    queryKey: ["teachers", teacherId, "subjects"],
    queryFn: async () => {
      try {
        const res = await axios.get(`/api/teachers/${teacherId}/subjects`);
        return res.data;
      } catch (error: any) {
        throw new Error(error?.response?.data?.message || "Failed to fetch teacher subjects");
      }
    },
  });
};

export const useGetTeacherStudents = (teacherId: string) => {
  return useQuery({
    queryKey: ["teachers", teacherId, "students"],
    queryFn: async () => {
      try {
        const res = await axios.get(`/api/teachers/${teacherId}/students`);
        return res.data;
      } catch (error: any) {
        throw new Error(error?.response?.data?.message || "Failed to fetch teacher students");
      }
    },
  });
};


export const useGetTeacherAttendance = (teacherId: string) => {
  return useQuery({
    queryKey: ["teachers", teacherId, "attendance"],
    queryFn: async () => {
      try {
        const res = await axios.get(`/api/teachers/${teacherId}/attendance`);
        return res.data;
      } catch (error: any) {
        throw new Error(error?.response?.data?.message || "Failed to fetch teacher attendance");
      }
    },
  });
};


export const useGetTeacherSchedule = (teacherId: string) => {
  return useQuery({
    queryKey: ["teachers", teacherId, "schedule"],
    queryFn: async () => {
      try {
        const res = await axios.get(`/api/teachers/${teacherId}/schedule`);
        return res.data;
      } catch (error: any) {
        throw new Error(error?.response?.data?.message || "Failed to fetch teacher schedule");
      }
    },
  });
};


