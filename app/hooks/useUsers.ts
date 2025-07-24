"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useGetUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      try {
        const res = await axios.get("/api/users");
        return res.data;
      } catch (error: any) {
        throw new Error(error?.response?.data?.message || "Failed to fetch data");
      }
    },
  });
};

// create users

export const useCreateUser = () => {
  return async (id: string) => {
    try {
      const res = await axios.post("/api/users", { id });
      return res.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || "Failed to create user");
    }
  };
};

// update users

export const useUpdateUser = () => {
  return async (id: string, data: any) => {
    try {
      const res = await axios.put(`/api/users/${id}`, data);
      return res.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || "Failed to update user");
    }
  };
};

// delete users
export const useDeleteUser = () => {
  return async (id: string) => {
    try {
      const res = await axios.delete(`/api/users/${id}`);
      return res.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || "Failed to delete user");
    }
  };
};
