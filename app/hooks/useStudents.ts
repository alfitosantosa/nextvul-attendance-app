"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useGetStudents = () => {
  return useQuery({
    queryKey: ["students"],
    queryFn: async () => {
      try {
        const res = await axios.get("/api/students");
        return res.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("Error fetching students:", error.response?.data || error.message);
        } else {
          console.error("Unexpected error:", error);
        }
        throw new Error("Failed to fetch students");
      }
    },
  });
};

// export const useCreateStudent = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: async (data: any) => {
//       const res = await axios.post("/api/students", data);
//       return res.data;
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["users"] });
//     },
//     onError: (error: any) => {
//       console.error("Error creating student:", error);
//       throw new Error(error?.response?.data?.message || "Failed to create student");
//     },
//   });
// };
