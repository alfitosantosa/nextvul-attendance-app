"use client";

import * as React from "react";
import { ColumnDef, ColumnFiltersState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, SortingState, useReactTable, VisibilityState } from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal, Plus, Pencil, Trash2, Eye } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

// Import hooks
import { useGetAcademicYears, useCreateAcademicYear, useUpdateAcademicYear, useDeleteAcademicYear } from "@/app/hooks/useAcademicYear";
import Navbar from "@/components/navbar";

// Type definitions
export type AcademicYearData = {
  id: string;
  year: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  classes?: any[];
  students?: any[];
  schedules?: any[];
  calendarEvents?: any[];
};

// Form schema
const academicYearSchema = z
  .object({
    year: z.string().min(1, "Tahun ajaran wajib diisi"),
    startDate: z.string().min(1, "Tanggal mulai wajib diisi"),
    endDate: z.string().min(1, "Tanggal selesai wajib diisi"),
    isActive: z.boolean().default(false),
  })
  .refine(
    (data) => {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      return start < end;
    },
    {
      message: "Tanggal selesai harus setelah tanggal mulai",
      path: ["endDate"],
    }
  );

type AcademicYearFormValues = z.infer<typeof academicYearSchema>;

// Create/Edit Dialog Component
function AcademicYearFormDialog({ open, onOpenChange, editData, onSuccess }: { open: boolean; onOpenChange: (open: boolean) => void; editData?: AcademicYearData | null; onSuccess: () => void }) {
  const createAcademicYear = useCreateAcademicYear();
  const updateAcademicYear = useUpdateAcademicYear();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<AcademicYearFormValues>({
    resolver: zodResolver(academicYearSchema as any),
    defaultValues: {
      isActive: false,
    },
  });

  const isActiveValue = watch("isActive");

  React.useEffect(() => {
    if (editData) {
      setValue("year", editData.year);
      setValue("startDate", editData.startDate.split("T")[0]); // Format for date input
      setValue("endDate", editData.endDate.split("T")[0]); // Format for date input
      setValue("isActive", editData.isActive);
    } else {
      reset({
        isActive: false,
      });
    }
  }, [editData, setValue, reset]);

  const onSubmit = async (data: AcademicYearFormValues) => {
    try {
      if (editData) {
        await updateAcademicYear.mutateAsync({ id: editData.id, ...data });
        toast.success("Tahun ajaran berhasil diperbarui!");
      } else {
        await createAcademicYear.mutateAsync(data);
        toast.success("Tahun ajaran berhasil dibuat!");
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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{editData ? "Edit Tahun Ajaran" : "Tambah Tahun Ajaran Baru"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="year">Tahun Ajaran</Label>
            <Input id="year" placeholder="Contoh: 2024/2025" {...register("year")} />
            {errors.year && <p className="text-sm text-red-500">{errors.year.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="startDate">Tanggal Mulai</Label>
            <Input id="startDate" type="date" {...register("startDate")} />
            {errors.startDate && <p className="text-sm text-red-500">{errors.startDate.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="endDate">Tanggal Selesai</Label>
            <Input id="endDate" type="date" {...register("endDate")} />
            {errors.endDate && <p className="text-sm text-red-500">{errors.endDate.message}</p>}
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="isActive" checked={isActiveValue} onCheckedChange={(checked) => setValue("isActive", checked)} />
            <Label htmlFor="isActive">Aktif</Label>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button type="submit" disabled={createAcademicYear.isPending || updateAcademicYear.isPending}>
              {createAcademicYear.isPending || updateAcademicYear.isPending ? "Menyimpan..." : editData ? "Perbarui" : "Simpan"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Delete Confirmation Dialog
function DeleteAcademicYearDialog({ open, onOpenChange, academicYearData, onSuccess }: { open: boolean; onOpenChange: (open: boolean) => void; academicYearData: AcademicYearData | null; onSuccess: () => void }) {
  const deleteAcademicYear = useDeleteAcademicYear();

  const handleDelete = async () => {
    if (!academicYearData) return;

    try {
      await deleteAcademicYear.mutateAsync(academicYearData.id);
      toast.success("Tahun ajaran berhasil dihapus!");

      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || "Gagal menghapus tahun ajaran");
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus Tahun Ajaran</AlertDialogTitle>
          <AlertDialogDescription>
            Apakah Anda yakin ingin menghapus tahun ajaran <strong>{academicYearData?.year}</strong>? Tindakan ini tidak dapat dibatalkan dan akan mempengaruhi semua data terkait.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={deleteAcademicYear.isPending} className="bg-red-600 hover:bg-red-700">
            {deleteAcademicYear.isPending ? "Menghapus..." : "Hapus"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// Main DataTable Component
export default function AcademicYearDataTable() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = React.useState(false);
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [selectedAcademicYear, setSelectedAcademicYear] = React.useState<AcademicYearData | null>(null);

  const { data: academicYears = [], isLoading, refetch } = useGetAcademicYears();

  const handleSuccess = () => {
    refetch();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const columns: ColumnDef<AcademicYearData>[] = [
    {
      id: "select",
      header: ({ table }) => <Checkbox checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")} onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)} aria-label="Select all" />,
      cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "year",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Tahun Ajaran
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => <div className="font-medium">{row.getValue("year")}</div>,
    },
    {
      accessorKey: "startDate",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Tanggal Mulai
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => <div>{formatDate(row.getValue("startDate"))}</div>,
    },
    {
      accessorKey: "endDate",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Tanggal Selesai
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => <div>{formatDate(row.getValue("endDate"))}</div>,
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => {
        const isActive = row.getValue("isActive") as boolean;
        return (
          <Badge variant={isActive ? "default" : "secondary"} className={isActive ? "bg-green-600" : ""}>
            {isActive ? "Aktif" : "Tidak Aktif"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "classes",
      header: "Jumlah Kelas",
      cell: ({ row }) => {
        const classes = row.original.classes || [];
        return <div className="text-center font-medium">{classes.length}</div>;
      },
    },
    {
      accessorKey: "students",
      header: "Jumlah Siswa",
      cell: ({ row }) => {
        const students = row.original.students || [];
        return <div className="text-center font-medium">{students.length}</div>;
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const academicYearData = row.original;

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
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(academicYearData.id)}>Copy ID Tahun Ajaran</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  setSelectedAcademicYear(academicYearData);
                  setEditDialogOpen(true);
                }}
              >
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setSelectedAcademicYear(academicYearData);
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
    data: academicYears,
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
            <p className="mt-2 text-sm text-muted-foreground">Memuat data tahun ajaran...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="mx-auto my-8 p-6 max-w-7xl">
        <div className="font-bold text-3xl">Tahun Ajaran</div>
        <div className="mx-auto">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-2">
              <Input placeholder="Cari tahun ajaran..." value={(table.getColumn("year")?.getFilterValue() as string) ?? ""} onChange={(event) => table.getColumn("year")?.setFilterValue(event.target.value)} className="max-w-sm" />
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
                          {column.id === "year"
                            ? "Tahun Ajaran"
                            : column.id === "startDate"
                            ? "Tanggal Mulai"
                            : column.id === "endDate"
                            ? "Tanggal Selesai"
                            : column.id === "isActive"
                            ? "Status"
                            : column.id === "classes"
                            ? "Jumlah Kelas"
                            : column.id === "students"
                            ? "Jumlah Siswa"
                            : column.id}
                        </DropdownMenuCheckboxItem>
                      );
                    })}
                </DropdownMenuContent>
              </DropdownMenu>

              <Button onClick={() => setCreateDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Tambah Tahun Ajaran
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
                      Tidak ada data tahun ajaran.
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
        <AcademicYearFormDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} onSuccess={handleSuccess} />

        <AcademicYearFormDialog open={editDialogOpen} onOpenChange={setEditDialogOpen} editData={selectedAcademicYear} onSuccess={handleSuccess} />

        <DeleteAcademicYearDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen} academicYearData={selectedAcademicYear} onSuccess={handleSuccess} />
      </div>
    </>
  );
}
