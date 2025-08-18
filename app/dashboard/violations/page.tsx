"use client";

import * as React from "react";
import { ColumnDef, ColumnFiltersState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, SortingState, useReactTable, VisibilityState } from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal, Plus, Pencil, Trash2, Calendar, User, AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

// Import hooks
import { useGetViolations, useCreateViolation, useUpdateViolation, useDeleteViolation } from "@/app/hooks/useViolations";
import { useGetTypeViolations } from "@/app/hooks/useTypeViolations";
import { useGetClasses } from "@/app/hooks/useClass";
import Navbar from "@/components/navbar";
import { useGetUsers } from "@/app/hooks/useUsers";

// Type definitions
export type ViolationData = {
  id: string;
  studentId: string;
  violationTypeId: string;
  classId: string;
  description?: string;
  status: string;
  reportedBy: string;
  createdAt: string;
  date: string;
  resolutionDate?: string;
  resolutionNotes?: string;
  student?: {
    id: string;
    name: string;
    email: string;
  };
  violationType?: {
    id: string;
    name: string;
    points: number;
    category: string;
  };
  class?: {
    id: string;
    name: string;
    grade: number;
  };
};

// Form schema
const violationSchema = z.object({
  studentId: z.string().min(1, "Siswa wajib dipilih"),
  violationTypeId: z.string().min(1, "Jenis pelanggaran wajib dipilih"),
  classId: z.string().min(1, "Kelas wajib dipilih"),
  description: z.string().optional(),
  status: z.string().min(1, "Status wajib dipilih"),
  reportedBy: z.string().min(1, "Pelapor wajib diisi"),
  date: z.string().min(1, "Tanggal kejadian wajib diisi"),
  resolutionDate: z.string().optional(),
  resolutionNotes: z.string().optional(),
});

type ViolationFormValues = z.infer<typeof violationSchema>;

// Predefined status options
const violationStatuses = [
  { value: "active", label: "Aktif" },
  { value: "resolved", label: "Selesai" },
  { value: "pending", label: "Pending" },
  { value: "dismissed", label: "Dibatalkan" },
];

// Mock students data - Replace with actual API call

const { data: users } = useGetUsers();

const mockStudents = [
  { id: "student1", name: "Ahmad Rizki", email: "ahmad@example.com" },
  { id: "student2", name: "Siti Nurhaliza", email: "siti@example.com" },
  { id: "student3", name: "Budi Santoso", email: "budi@example.com" },
];

// Create/Edit Dialog Component
function ViolationFormDialog({ open, onOpenChange, editData, onSuccess }: { open: boolean; onOpenChange: (open: boolean) => void; editData?: ViolationData | null; onSuccess: () => void }) {
  const createViolation = useCreateViolation();
  const updateViolation = useUpdateViolation();
  const { data: violationTypes } = useGetTypeViolations();
  const { data: classes } = useGetClasses();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<ViolationFormValues>({
    resolver: zodResolver(violationSchema),
    defaultValues: {
      status: "active",
      date: new Date().toISOString().split("T")[0],
    },
  });

  const selectedStudentId = watch("studentId");
  const selectedViolationTypeId = watch("violationTypeId");
  const selectedClassId = watch("classId");
  const selectedStatus = watch("status");

  React.useEffect(() => {
    if (editData) {
      setValue("studentId", editData.studentId);
      setValue("violationTypeId", editData.violationTypeId);
      setValue("classId", editData.classId);
      setValue("description", editData.description || "");
      setValue("status", editData.status);
      setValue("reportedBy", editData.reportedBy);
      setValue("date", editData.date.split("T")[0]);
      setValue("resolutionDate", editData.resolutionDate ? editData.resolutionDate.split("T")[0] : "");
      setValue("resolutionNotes", editData.resolutionNotes || "");
    } else {
      reset({
        status: "active",
        date: new Date().toISOString().split("T")[0],
      });
    }
  }, [editData, setValue, reset]);

  const onSubmit = async (data: ViolationFormValues) => {
    try {
      const formattedData = {
        ...data,
        date: new Date(data.date).toISOString(),
        resolutionDate: data.resolutionDate ? new Date(data.resolutionDate).toISOString() : null,
      };

      if (editData) {
        await updateViolation.mutateAsync({ id: editData.id, ...formattedData });
        toast.success("Pelanggaran berhasil diperbarui!");
      } else {
        await createViolation.mutateAsync(formattedData);
        toast.success("Pelanggaran berhasil dibuat!");
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
          <DialogTitle>{editData ? "Edit Pelanggaran" : "Tambah Pelanggaran Baru"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Siswa</Label>
              <Select value={selectedStudentId} onValueChange={(value) => setValue("studentId", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Siswa" />
                </SelectTrigger>
                <SelectContent>
                  {mockStudents.map((student) => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.studentId && <p className="text-sm text-red-500">{errors.studentId.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>Kelas</Label>
              <Select value={selectedClassId} onValueChange={(value) => setValue("classId", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Kelas" />
                </SelectTrigger>
                <SelectContent>
                  {classes?.map((classItem: any) => (
                    <SelectItem key={classItem.id} value={classItem.id}>
                      {classItem.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.classId && <p className="text-sm text-red-500">{errors.classId.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Jenis Pelanggaran</Label>
            <Select value={selectedViolationTypeId} onValueChange={(value) => setValue("violationTypeId", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih Jenis Pelanggaran" />
              </SelectTrigger>
              <SelectContent>
                {violationTypes?.map((violation: any) => (
                  <SelectItem key={violation.id} value={violation.id}>
                    {violation.name} ({violation.points} poin)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.violationTypeId && <p className="text-sm text-red-500">{errors.violationTypeId.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi Tambahan</Label>
            <Textarea id="description" placeholder="Deskripsi detail kejadian..." rows={3} {...register("description")} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="reportedBy">Dilaporkan Oleh</Label>
              <Input id="reportedBy" placeholder="Nama guru/staff" {...register("reportedBy")} />
              {errors.reportedBy && <p className="text-sm text-red-500">{errors.reportedBy.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Tanggal Kejadian</Label>
              <Input id="date" type="date" {...register("date")} />
              {errors.date && <p className="text-sm text-red-500">{errors.date.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={selectedStatus} onValueChange={(value) => setValue("status", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih Status" />
              </SelectTrigger>
              <SelectContent>
                {violationStatuses.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.status && <p className="text-sm text-red-500">{errors.status.message}</p>}
          </div>

          {(selectedStatus === "resolved" || editData?.status === "resolved") && (
            <>
              <div className="space-y-2">
                <Label htmlFor="resolutionDate">Tanggal Penyelesaian</Label>
                <Input id="resolutionDate" type="date" {...register("resolutionDate")} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="resolutionNotes">Catatan Penyelesaian</Label>
                <Textarea id="resolutionNotes" placeholder="Catatan tentang penyelesaian..." rows={3} {...register("resolutionNotes")} />
              </div>
            </>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button type="submit" disabled={createViolation.isPending || updateViolation.isPending}>
              {createViolation.isPending || updateViolation.isPending ? "Menyimpan..." : editData ? "Perbarui" : "Simpan"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Delete Confirmation Dialog
function DeleteViolationDialog({ open, onOpenChange, violationData, onSuccess }: { open: boolean; onOpenChange: (open: boolean) => void; violationData: ViolationData | null; onSuccess: () => void }) {
  const deleteViolation = useDeleteViolation();

  const handleDelete = async () => {
    if (!violationData) return;

    try {
      await deleteViolation.mutateAsync(violationData.id);
      toast.success("Pelanggaran berhasil dihapus!");
      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || "Gagal menghapus pelanggaran");
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus Pelanggaran</AlertDialogTitle>
          <AlertDialogDescription>Apakah Anda yakin ingin menghapus pelanggaran ini? Tindakan ini tidak dapat dibatalkan.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={deleteViolation.isPending} className="bg-red-600 hover:bg-red-700">
            {deleteViolation.isPending ? "Menghapus..." : "Hapus"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// Main DataTable Component
export default function ViolationDataTable() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = React.useState(false);
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [selectedViolation, setSelectedViolation] = React.useState<ViolationData | null>(null);

  const { data: violations = [], isLoading, refetch } = useGetViolations();

  const handleSuccess = () => {
    refetch();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-red-600";
      case "resolved":
        return "bg-green-600";
      case "pending":
        return "bg-yellow-600";
      case "dismissed":
        return "bg-gray-600";
      default:
        return "bg-gray-600";
    }
  };

  const getStatusLabel = (status: string) => {
    const found = violationStatuses.find((s) => s.value === status);
    return found ? found.label : status;
  };

  const columns: ColumnDef<ViolationData>[] = [
    {
      id: "select",
      header: ({ table }) => <Checkbox checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")} onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)} aria-label="Select all" />,
      cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "student",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            <User className="mr-2 h-4 w-4" />
            Siswa
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const student = row.getValue("student") as ViolationData["student"];
        return <div className="font-medium">{student?.name || "Unknown Student"}</div>;
      },
    },
    {
      accessorKey: "class",
      header: "Kelas",
      cell: ({ row }) => {
        const classData = row.getValue("class") as ViolationData["class"];
        return <div>{classData?.name || "Unknown Class"}</div>;
      },
    },
    {
      accessorKey: "violationType",
      header: "Jenis Pelanggaran",
      cell: ({ row }) => {
        const violationType = row.getValue("violationType") as ViolationData["violationType"];
        return (
          <div className="max-w-xs">
            <div className="font-medium">{violationType?.name || "Unknown Violation"}</div>
            {violationType?.points && (
              <Badge variant="secondary" className="mt-1">
                {violationType.points} poin
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "date",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            <Calendar className="mr-2 h-4 w-4" />
            Tanggal
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => <div>{formatDate(row.getValue("date"))}</div>,
    },
    {
      accessorKey: "status",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Status
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return <Badge className={`text-white ${getStatusBadgeColor(status)}`}>{getStatusLabel(status)}</Badge>;
      },
    },
    {
      accessorKey: "reportedBy",
      header: "Dilaporkan Oleh",
      cell: ({ row }) => <div>{row.getValue("reportedBy")}</div>,
    },
    {
      accessorKey: "description",
      header: "Deskripsi",
      cell: ({ row }) => {
        const description = row.getValue("description") as string;
        return (
          <div className="max-w-xs truncate" title={description}>
            {description || "-"}
          </div>
        );
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const violationData = row.original;

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
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(violationData.id)}>Copy ID Pelanggaran</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  setSelectedViolation(violationData);
                  setEditDialogOpen(true);
                }}
              >
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setSelectedViolation(violationData);
                  setDeleteDialogOpen(true);
                }}
                className="text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Hapus
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: violations,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  if (isLoading) {
    return (
      <div className="w-full">
        <div className="flex items-center justify-center h-32">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-sm text-muted-foreground">Memuat data pelanggaran...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="mx-auto my-8 p-6 max-w-7xl">
        <div className="font-bold text-3xl">Data Pelanggaran</div>
        <div className="mx-auto">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-2">
              <Input placeholder="Cari siswa..." value={(table.getColumn("student")?.getFilterValue() as string) ?? ""} onChange={(event) => table.getColumn("student")?.setFilterValue(event.target.value)} className="max-w-sm" />
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
                      return (
                        <DropdownMenuCheckboxItem key={column.id} className="capitalize" checked={column.getIsVisible()} onCheckedChange={(value) => column.toggleVisibility(!!value)}>
                          {column.id === "student"
                            ? "Siswa"
                            : column.id === "class"
                            ? "Kelas"
                            : column.id === "violationType"
                            ? "Jenis Pelanggaran"
                            : column.id === "date"
                            ? "Tanggal"
                            : column.id === "status"
                            ? "Status"
                            : column.id === "reportedBy"
                            ? "Dilaporkan Oleh"
                            : column.id === "description"
                            ? "Deskripsi"
                            : column.id}
                        </DropdownMenuCheckboxItem>
                      );
                    })}
                </DropdownMenuContent>
              </DropdownMenu>

              <Button onClick={() => setCreateDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Tambah Pelanggaran
              </Button>
            </div>
          </div>

          <div className="rounded-md border w-max-7xl">
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
                      Tidak ada data pelanggaran.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-end space-x-2 py-4">
            <div className="flex-1 text-sm text-muted-foreground">
              {table.getFilteredSelectedRowModel().rows.length} dari {table.getFilteredRowModel().rows.length} baris dipilih.
            </div>
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

        {/* Dialogs */}
        <ViolationFormDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} onSuccess={handleSuccess} />

        <ViolationFormDialog open={editDialogOpen} onOpenChange={setEditDialogOpen} editData={selectedViolation} onSuccess={handleSuccess} />

        <DeleteViolationDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen} violationData={selectedViolation} onSuccess={handleSuccess} />
      </div>
    </>
  );
}
