import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export const useGetTypeViolations = () => {
  return useQuery({
    queryKey: ["typeViolations"],
    queryFn: async () => {
      try {
        const response = await axios.get("/api/typeviolations");
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("Error fetching violation types:", error.response?.data || error.message);
        } else {
          console.error("Unexpected error:", error);
        }
        throw new Error("Failed to fetch violation types");
      }
    },
  });
};

export const useCreateTypeViolation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await axios.post("/api/typeviolations", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["typeViolations"] });
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        console.error("Error creating violation type:", error.response?.data || error.message);
      } else {
        console.error("Unexpected error:", error);
      }
      throw new Error("Failed to create violation type");
    },
  });
};

export const useUpdateTypeViolation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await axios.put("/api/typeviolations", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["typeViolations"] });
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        console.error("Error updating violation type:", error.response?.data || error.message);
      } else {
        console.error("Unexpected error:", error);
      }
      throw new Error("Failed to update violation type");
    },
  });
};

export const useDeleteTypeViolation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await axios.delete("/api/typeviolations", { data: { id } });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["typeViolations"] });
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        console.error("Error deleting violation type:", error.response?.data || error.message);
      } else {
        console.error("Unexpected error:", error);
      }
      throw new Error("Failed to delete violation type");
    },
  });
};
