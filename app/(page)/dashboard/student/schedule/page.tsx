"use client";

import * as React from "react";
import { ColumnDef, ColumnFiltersState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, SortingState, useReactTable, VisibilityState } from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal, Calendar, Clock, Users, Search, X, MapPin, GraduationCap, BookOpen } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

// Import hooks
import { useGetSchedules, useCreateSchedule, useUpdateSchedule, useDeleteSchedule } from "@/app/hooks/useSchedules";
import { useGetClasses } from "@/app/hooks/useClass";
import { useGetSubjects } from "@/app/hooks/useSubjects";
import { useGetTeachers } from "@/app/hooks/useTeachers";
import { useGetAcademicYears } from "@/app/hooks/useAcademicYear";
import Navbar from "@/components/navbar";
import { useGetSchedulesByIdClass } from "@/app/hooks/useScheduleByIdClass";
import { useClassByIdUser } from "@/app/hooks/useClassByIdUser";
import { useGetStudentById } from "@/app/hooks/useGetStudentById";
import { useUser } from "@clerk/clerk-react";
import { useGetUserByIdClerk } from "@/app/hooks/useUsersByIdClerk";

// Type definitions
export type ScheduleData = {
  id: string;
  classId: string;
  subjectId: string;
  teacherId: string;
  academicYearId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  room?: string;
  class?: {
    id: string;
    name: string;
  };
  subject?: {
    id: string;
    name: string;
    code: string;
  };
  teacher?: {
    id: string;
    name: string;
  };
  academicYear?: {
    id: string;
    year: string;
    semester: string;
  };
};

// Form schema
const scheduleSchema = z
  .object({
    classId: z.string().min(1, "Kelas wajib dipilih"),
    subjectId: z.string().min(1, "Mata pelajaran wajib dipilih"),
    teacherId: z.string().min(1, "Guru wajib dipilih"),
    academicYearId: z.string().min(1, "Tahun akademik wajib dipilih"),
    dayOfWeek: z.number().min(0).max(6, "Hari tidak valid"),
    startTime: z
      .string()
      .min(1, "Waktu mulai wajib diisi")
      .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Format waktu tidak valid (HH:MM)"),
    endTime: z
      .string()
      .min(1, "Waktu selesai wajib diisi")
      .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Format waktu tidak valid (HH:MM)"),
    room: z.string().optional(),
  })
  .refine(
    (data) => {
      const startTime = new Date(`2000-01-01T${data.startTime}:00`);
      const endTime = new Date(`2000-01-01T${data.endTime}:00`);
      return startTime < endTime;
    },
    {
      message: "Waktu selesai harus lebih besar dari waktu mulai",
      path: ["endTime"],
    }
  );

type ScheduleFormValues = z.infer<typeof scheduleSchema>;

// Days mapping
const DAYS_MAP = {
  0: "Minggu",
  1: "Senin",
  2: "Selasa",
  3: "Rabu",
  4: "Kamis",
  5: "Jumat",
  6: "Sabtu",
};

// Create/Edit Dialog Component
function ScheduleFormDialog({ open, onOpenChange, editData, onSuccess }: { open: boolean; onOpenChange: (open: boolean) => void; editData?: ScheduleData | null; onSuccess: () => void }) {
  const createSchedule = useCreateSchedule();
  const updateSchedule = useUpdateSchedule();
  const { data: classes = [] } = useGetClasses();
  const { data: subjects = [] } = useGetSubjects();
  const { data: teachers = [] } = useGetTeachers();

  const { data: academicYears = [] } = useGetAcademicYears();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<ScheduleFormValues>({
    resolver: zodResolver(scheduleSchema as any),
    defaultValues: {
      dayOfWeek: 1,
      startTime: "08:00",
      endTime: "09:30",
    },
  });

  const selectedClassId = watch("classId");
  const selectedSubjectId = watch("subjectId");
  const selectedTeacherId = watch("teacherId");
  const selectedAcademicYearId = watch("academicYearId");
  const selectedDayOfWeek = watch("dayOfWeek");

  React.useEffect(() => {
    if (editData) {
      setValue("classId", editData.classId);
      setValue("subjectId", editData.subjectId);
      setValue("teacherId", editData.teacherId);
      setValue("academicYearId", editData.academicYearId);
      setValue("dayOfWeek", editData.dayOfWeek);
      setValue("startTime", editData.startTime);
      setValue("endTime", editData.endTime);
      setValue("room", editData.room || "");
    } else {
      reset({
        dayOfWeek: 1,
        startTime: "08:00",
        endTime: "09:30",
      });
    }
  }, [editData, setValue, reset]);

  const onSubmit = async (data: ScheduleFormValues) => {
    try {
      const submitData = {
        ...data,
        room: data.room || null,
      };

      if (editData) {
        await updateSchedule.mutateAsync({ id: editData.id, ...submitData } as any);
        toast.success("Jadwal berhasil diperbarui!");
      } else {
        await createSchedule.mutateAsync(submitData as any);
        toast.success("Jadwal berhasil dibuat!");
      }
      reset();
      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || "Terjadi kesalahan");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editData ? "Edit Jadwal" : "Tambah Jadwal Baru"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Kelas</Label>
              <Select value={selectedClassId || ""} onValueChange={(value) => setValue("classId", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Kelas" />
                </SelectTrigger>
                <SelectContent>
                  {classes?.map((cls: any) => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.classId && <p className="text-sm text-red-500">{errors.classId.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>Mata Pelajaran</Label>
              <Select value={selectedSubjectId || ""} onValueChange={(value) => setValue("subjectId", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Mata Pelajaran" />
                </SelectTrigger>
                <SelectContent>
                  {subjects?.map((subject: any) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.code} - {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.subjectId && <p className="text-sm text-red-500">{errors.subjectId.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Guru</Label>
              <Select value={selectedTeacherId || ""} onValueChange={(value) => setValue("teacherId", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Guru" />
                </SelectTrigger>
                <SelectContent>
                  {teachers?.map((teacher: any) => (
                    <SelectItem key={teacher.id} value={teacher.id}>
                      {teacher.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.teacherId && <p className="text-sm text-red-500">{errors.teacherId.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>Tahun Akademik</Label>
              <Select value={selectedAcademicYearId || ""} onValueChange={(value) => setValue("academicYearId", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Tahun Akademik" />
                </SelectTrigger>
                <SelectContent>
                  {academicYears?.map((year: any) => (
                    <SelectItem key={year.id} value={year.id}>
                      {year.year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.academicYearId && <p className="text-sm text-red-500">{errors.academicYearId.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Hari</Label>
              <Select value={selectedDayOfWeek?.toString() || ""} onValueChange={(value) => setValue("dayOfWeek", parseInt(value))}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Hari" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(DAYS_MAP).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.dayOfWeek && <p className="text-sm text-red-500">{errors.dayOfWeek.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="startTime">Waktu Mulai</Label>
              <Input id="startTime" type="time" {...register("startTime")} />
              {errors.startTime && <p className="text-sm text-red-500">{errors.startTime.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime">Waktu Selesai</Label>
              <Input id="endTime" type="time" {...register("endTime")} />
              {errors.endTime && <p className="text-sm text-red-500">{errors.endTime.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="room">Ruangan (Opsional)</Label>
            <Input id="room" placeholder="Contoh: Lab Komputer, Kelas 12A" {...register("room")} />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button type="submit" disabled={createSchedule.isPending || updateSchedule.isPending}>
              {createSchedule.isPending || updateSchedule.isPending ? "Menyimpan..." : editData ? "Perbarui" : "Simpan"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Delete Confirmation Dialog
function DeleteScheduleDialog({ open, onOpenChange, scheduleData, onSuccess }: { open: boolean; onOpenChange: (open: boolean) => void; scheduleData: ScheduleData | null; onSuccess: () => void }) {
  const deleteSchedule = useDeleteSchedule();

  const handleDelete = async () => {
    if (!scheduleData) return;

    try {
      await deleteSchedule.mutateAsync(scheduleData.id as any);
      toast.success("Jadwal berhasil dihapus!");
      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || "Gagal menghapus jadwal");
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus Jadwal</AlertDialogTitle>
          <AlertDialogDescription>
            Apakah Anda yakin ingin menghapus jadwal "{scheduleData?.subject?.name}" untuk kelas "{scheduleData?.class?.name}" pada hari {scheduleData ? DAYS_MAP[scheduleData.dayOfWeek as keyof typeof DAYS_MAP] : ""}? Tindakan ini tidak
            dapat dibatalkan.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={deleteSchedule.isPending} className="bg-red-600 hover:bg-red-700">
            {deleteSchedule.isPending ? "Menghapus..." : "Hapus"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// Main DataTable Component
export default function ScheduleDataTable() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = React.useState(false);
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [selectedSchedule, setSelectedSchedule] = React.useState<ScheduleData | null>(null);

  // Filter states
  const [classFilter, setClassFilter] = React.useState<string>("all");
  const [dayFilter, setDayFilter] = React.useState<string>("all");
  const [globalFilter, setGlobalFilter] = React.useState<string>("");

  //use get class by id user for get class id
  // Get class data for the current user (replace with actual user id or get from auth/session)

  const { user } = useUser();
  const { data: userData } = useGetUserByIdClerk(user?.id ?? "");

  const studentId = userData?.id;

  const { data: classData, isLoading } = useClassByIdUser(studentId);

  const { data: studentData } = useGetStudentById(studentId);

  // Get the class id from classData
  const classId = classData?.id;

  // Fetch schedules by class id if available
  const { data: schedules = [], refetch } = useGetSchedulesByIdClass(classId ?? "");
  const { data: classes = [] } = useGetClasses();

  const handleSuccess = () => {
    refetch();
  };

  // Custom global filter function
  const globalFilterFn = React.useCallback((row: any, columnId: string, filterValue: string) => {
    if (!filterValue) return true;

    const searchValue = filterValue.toLowerCase();
    const schedule = row.original;

    // Search in multiple fields
    const searchableText = [schedule.class?.name, schedule.subject?.name, schedule.subject?.code, schedule.teacher?.name, schedule.room, DAYS_MAP[schedule.dayOfWeek as keyof typeof DAYS_MAP], schedule.startTime, schedule.endTime]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return searchableText.includes(searchValue);
  }, []);

  const columns: ColumnDef<ScheduleData>[] = [
    {
      id: "select",
      header: ({ table }) => <Checkbox checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")} onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)} aria-label="Select all" />,
      cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />,
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: "dayOfWeek",
      accessorFn: (row) => DAYS_MAP[row.dayOfWeek as keyof typeof DAYS_MAP],
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            <Calendar className="mr-2 h-4 w-4" />
            Hari
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => <Badge variant="outline">{DAYS_MAP[row.original.dayOfWeek as keyof typeof DAYS_MAP]}</Badge>,
      filterFn: (row, id, value) => {
        if (value === "all") return true;
        return row.original.dayOfWeek.toString() === value;
      },
    },
    {
      id: "time",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            <Clock className="mr-2 h-4 w-4" />
            Waktu
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="font-mono">
          {row.original.startTime} - {row.original.endTime}
        </div>
      ),
      sortingFn: (rowA, rowB) => {
        const timeA = rowA.original.startTime;
        const timeB = rowB.original.startTime;
        return timeA.localeCompare(timeB);
      },
    },
    {
      id: "class",
      accessorFn: (row) => row.class?.name || "",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            <Users className="mr-2 h-4 w-4" />
            Kelas
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => <Badge variant="secondary">{row.original.class?.name}</Badge>,
      filterFn: (row, id, value) => {
        if (value === "all") return true;
        return row.original.classId === value;
      },
    },
    {
      id: "subject",
      accessorFn: (row) => row.subject?.name || "",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            <BookOpen className="mr-2 h-4 w-4" />
            Mata Pelajaran
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.original.subject?.name}</div>
          <div className="text-sm text-muted-foreground">{row.original.subject?.code}</div>
        </div>
      ),
    },
    {
      id: "teacher",
      accessorFn: (row) => row.teacher?.name || "",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            <GraduationCap className="mr-2 h-4 w-4" />
            Guru
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => <div className="font-medium">{row.original.teacher?.name}</div>,
    },
    {
      accessorKey: "room",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            <MapPin className="mr-2 h-4 w-4" />
            Ruangan
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => <div>{row.getValue("room") || "-"}</div>,
    },
    {
      id: "academicYear",
      accessorFn: (row) => `${row.academicYear?.year} - ${row.academicYear?.semester}` || "",
      header: "Tahun Akademik",
      cell: ({ row }) => <div className="text-sm">{row.original.academicYear?.year}</div>,
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const scheduleData = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Aksi</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(scheduleData.id)}>Copy ID Jadwal</DropdownMenuItem>
              <DropdownMenuSeparator />
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: schedules,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    globalFilterFn: globalFilterFn,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
  });

  // Apply class filter
  React.useEffect(() => {
    if (classFilter !== "all") {
      table.getColumn("class")?.setFilterValue(classFilter);
    } else {
      table.getColumn("class")?.setFilterValue(undefined);
    }
  }, [classFilter, table]);

  // Apply day filter
  React.useEffect(() => {
    if (dayFilter !== "all") {
      table.getColumn("dayOfWeek")?.setFilterValue(dayFilter);
    } else {
      table.getColumn("dayOfWeek")?.setFilterValue(undefined);
    }
  }, [dayFilter, table]);

  if (isLoading) {
    return (
      <div className="w-full">
        <div className="flex items-center justify-center h-32">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-sm text-muted-foreground">Memuat data jadwal...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="mx-auto my-8 p-6 max-w-7xl">
        <div className="font-bold text-3xl mb-6">Jadwal Pelajaran</div>
        {/* student data  */}

        {studentData && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-3">
              <Users className="h-6 w-6 text-blue-600" />
              <div>
                <h2 className="text-xl font-semibold text-blue-900">{studentData.name}</h2>
                {studentData.email && <p className="text-sm text-blue-700">{studentData.email}</p>}
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between py-4">
          <div className="flex items-center space-x-2 flex-wrap gap-y-2">
            {/* Global Search */}
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Cari kelas, mata pelajaran, atau guru..." value={globalFilter ?? ""} onChange={(event) => setGlobalFilter(event.target.value)} className="max-w-sm pl-8" disabled={isLoading} />
            </div>

            {/* Day Filter */}
            <Select value={dayFilter} onValueChange={setDayFilter}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Hari" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Hari</SelectItem>
                {Object.entries(DAYS_MAP).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Clear Filters */}
            {(globalFilter || classFilter !== "all" || dayFilter !== "all") && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setGlobalFilter("");
                  setClassFilter("all");
                  setDayFilter("all");
                  table.resetColumnFilters();
                }}
              >
                <X className="mr-2 h-4 w-4" />
                Reset Filter
              </Button>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  Kolom <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    const getColumnLabel = (columnId: string) => {
                      switch (columnId) {
                        case "dayOfWeek":
                          return "Hari";
                        case "time":
                          return "Waktu";
                        case "class":
                          return "Kelas";
                        case "subject":
                          return "Mata Pelajaran";
                        case "teacher":
                          return "Guru";
                        case "room":
                          return "Ruangan";
                        case "academicYear":
                          return "Tahun Akademik";
                        default:
                          return columnId;
                      }
                    };

                    return (
                      <DropdownMenuCheckboxItem key={column.id} className="capitalize" checked={column.getIsVisible()} onCheckedChange={(value) => column.toggleVisibility(!!value)}>
                        {getColumnLabel(column.id)}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Active Filters Display */}
        {(globalFilter || classFilter !== "all" || dayFilter !== "all") && (
          <div className="flex items-center space-x-2 py-2">
            <span className="text-sm text-muted-foreground">Filter aktif:</span>
            {globalFilter && (
              <Badge variant="secondary" className="gap-1">
                Pencarian: {globalFilter}
                <X className="h-3 w-3 cursor-pointer" onClick={() => setGlobalFilter("")} />
              </Badge>
            )}
            {classFilter !== "all" && (
              <Badge variant="secondary" className="gap-1">
                Kelas: {classes?.find((c: any) => c.id === classFilter)?.name}
                <X className="h-3 w-3 cursor-pointer" onClick={() => setClassFilter("all")} />
              </Badge>
            )}
            {dayFilter !== "all" && (
              <Badge variant="secondary" className="gap-1">
                Hari: {DAYS_MAP[parseInt(dayFilter) as keyof typeof DAYS_MAP]}
                <X className="h-3 w-3 cursor-pointer" onClick={() => setDayFilter("all")} />
              </Badge>
            )}
          </div>
        )}

        <div className="rounded-md border w-full overflow-hidden">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return <TableHead key={header.id}>{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}</TableHead>;
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <Calendar className="h-8 w-8 text-muted-foreground" />
                      <p className="text-muted-foreground">{globalFilter || classFilter !== "all" || dayFilter !== "all" ? "Tidak ada jadwal yang sesuai dengan filter." : "Tidak ada jadwal yang ditemukan."}</p>
                      {(globalFilter || classFilter !== "all" || dayFilter !== "all") && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setGlobalFilter("");
                            setClassFilter("all");
                            setDayFilter("all");
                            table.resetColumnFilters();
                          }}
                        >
                          Reset Filter
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} dari {table.getFilteredRowModel().rows.length} baris dipilih.
            {table.getFilteredRowModel().rows.length !== schedules.length && <span className="ml-2">(difilter dari {schedules.length} total)</span>}
          </div>
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">
              Halaman {table.getState().pagination.pageIndex + 1} dari {table.getPageCount()}
            </p>
            <div className="space-x-2">
              <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                Sebelumnya
              </Button>
              <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                Selanjutnya
              </Button>
            </div>
          </div>
        </div>

        {/* Summary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-card rounded-lg border p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-blue-500" />
              <h3 className="font-semibold">Total Jadwal</h3>
            </div>
            <p className="text-2xl font-bold mt-2">{schedules.length}</p>
            {table.getFilteredRowModel().rows.length !== schedules.length && <p className="text-sm text-muted-foreground">({table.getFilteredRowModel().rows.length} terfilter)</p>}
          </div>

          <div className="bg-card rounded-lg border p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-green-500" />
              <h3 className="font-semibold">Kelas Aktif</h3>
            </div>
            <p className="text-2xl font-bold mt-2">{new Set(table.getFilteredRowModel().rows.map((row) => row.original.classId)).size}</p>
          </div>

          <div className="bg-card rounded-lg border p-4">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5 text-purple-500" />
              <h3 className="font-semibold">Mata Pelajaran</h3>
            </div>
            <p className="text-2xl font-bold mt-2">{new Set(table.getFilteredRowModel().rows.map((row) => row.original.subjectId)).size}</p>
          </div>

          <div className="bg-card rounded-lg border p-4">
            <div className="flex items-center space-x-2">
              <GraduationCap className="h-5 w-5 text-orange-500" />
              <h3 className="font-semibold">Guru Mengajar</h3>
            </div>
            <p className="text-2xl font-bold mt-2">{new Set(table.getFilteredRowModel().rows.map((row) => row.original.teacherId)).size}</p>
          </div>
        </div>

        {/* Dialogs */}
        <ScheduleFormDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} onSuccess={handleSuccess} />

        <ScheduleFormDialog open={editDialogOpen} onOpenChange={setEditDialogOpen} editData={selectedSchedule} onSuccess={handleSuccess} />

        <DeleteScheduleDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen} scheduleData={selectedSchedule} onSuccess={handleSuccess} />
      </div>
    </>
  );
}
