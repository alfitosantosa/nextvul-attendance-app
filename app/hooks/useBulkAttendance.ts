import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export const useCreateAttendanceBulk = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await axios.post("/api/attendance/bulk", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
    },
  });
};

export const useUpdateAttendanceBulk = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await axios.put(`/api/attendance/bulk`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
    },
  });
};

// export const useDeleteAttendanceBulk = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: async (data: any) => {
//       const response = await axios.delete(`/api/attendance/bulk`, data);
//       return response.data;
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["attendance"] });
//     },
//   });
// };

// [
//   model Attendance {
//     id         String   @id @default(cuid())
//     studentId  String
//     scheduleId String
//     status     String
//     notes      String?
//     createdAt  DateTime @default(now())
//     date       DateTime
//     schedule   Schedule @relation(fields: [scheduleId], references: [id])
//     student    User     @relation("StudentAttendance", fields: [studentId], references: [id])
//     @@unique([studentId, scheduleId, date])
//     @@map("attendances")
//   }
// ];
