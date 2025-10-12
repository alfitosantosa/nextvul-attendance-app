// ===== 1. TANSTACK QUERY HOOKS =====
// hooks/useParentDashboard.ts

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// Types
export interface StudentData {
  id: string;
  name: string;
  nisn: string;
  avatarUrl?: string;
  status: string;
  class: {
    id: string;
    name: string;
  };
  major: {
    id: string;
    name: string;
  };
}

export interface AttendanceStats {
  thisMonth: {
    present: number;
    absent: number;
    late: number;
    excused: number;
    total: number;
  };
  recentAttendance: Array<{
    id: string;
    date: string;
    status: string;
    schedule: {
      subject: {
        name: string;
      };
    };
  }>;
}

export interface ViolationData {
  id: string;
  date: string;
  status: string;
  violationType: {
    name: string;
    category: string;
    points: number;
    description: string;
  };
  description?: string;
}

export interface PaymentData {
  id: string;
  amount: number;
  dueDate: string;
  paymentDate?: string;
  status: string;
  receiptNumber?: string;
  paymentType: {
    name: string;
  };
}

export interface PaymentSummary {
  totalPaid: number;
  totalDue: number;
  nextDueDate?: string;
}

// Get students by IDs (for parent's children)
export const useGetStudentsByIds = (studentIds: string[]) => {
  return useQuery({
    queryKey: ["students", studentIds],
    queryFn: async () => {
      if (!studentIds || studentIds.length === 0) {
        return [];
      }

      const response = await axios.get(`/api/students/by-ids`, {
        params: { ids: studentIds.join(",") },
      });
      return response.data as StudentData[];
    },
    enabled: !!studentIds && studentIds.length > 0,
  });
};

// Get attendance data for a student
export const useGetStudentAttendance = (studentId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["attendance", "student", studentId],
    queryFn: async () => {
      const response = await axios.get(`/api/attendance/student/${studentId}`);
      return response.data as AttendanceStats;
    },
    enabled: !!studentId && enabled,
  });
};

// Get violations for a student
export const useGetStudentViolations = (studentId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["violations", "student", studentId],
    queryFn: async () => {
      const response = await axios.get(`/api/violations/student/${studentId}`);
      return response.data as ViolationData[];
    },
    enabled: !!studentId && enabled,
  });
};

// Get payments for a student
export const useGetStudentPayments = (studentId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["payments", "student", studentId],
    queryFn: async () => {
      const response = await axios.get(`/api/payments/student/${studentId}`);
      return response.data as {
        summary: PaymentSummary;
        history: PaymentData[];
      };
    },
    enabled: !!studentId && enabled,
  });
};
