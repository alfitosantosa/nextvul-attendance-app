import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export const useGetViolations = () => {
  return useQuery({
    queryKey: ["violations"],
    queryFn: async () => {
      try {
        const response = await axios.get("/api/violations");
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("Error fetching violations:", error.response?.data || error.message);
        } else {
          console.error("Unexpected error:", error);
        }
        throw new Error("Failed to fetch violations");
      }
    },
  });
};

export const useCreateViolation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await axios.post("/api/violations", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["violations"] });
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        console.error("Error creating violation:", error.response?.data || error.message);
      } else {
        console.error("Unexpected error:", error);
      }
      throw new Error("Failed to create violation");
    },
  });
};

export const useUpdateViolation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await axios.put("/api/violations", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["violations"] });
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        console.error("Error updating violation:", error.response?.data || error.message);
      } else {
        console.error("Unexpected error:", error);
      }
      throw new Error("Failed to update violation");
    },
  });
};

export const useDeleteViolation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await axios.delete("/api/violations", { data: { id } });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["violations"] });
    },
  });
};
