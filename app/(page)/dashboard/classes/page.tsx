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
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

// Import hooks
import { useGetClasses, useCreateClass, useUpdateClass, useDeleteClass } from "@/app/hooks/useClass";
import { useGetMajors } from "@/app/hooks/useMajors";
import { useGetAcademicYears } from "@/app/hooks/useAcademicYear";
import Navbar from "@/components/navbar";

// Type definitions
export type ClassData = {
  id: string;
  name: string;
  grade: number;
  majorId: string;
  academicYearId: string;
  capacity: number;
  academicYear: {
    id: string;
    year: string;
  };
  major: {
    id: string;
    name: string;
  };
  _count?: {
    students: number;
  };
};

// Form schema
const classSchema = z.object({
  name: z.string().min(1, "Nama kelas wajib diisi"),
  grade: z.number().min(1, "Tingkat kelas minimal 1").max(12, "Tingkat kelas maksimal 12"),
  majorId: z.string().min(1, "Jurusan wajib dipilih"),
  academicYearId: z.string().min(1, "Tahun ajaran wajib dipilih"),
  capacity: z.number().min(1, "Kapasitas minimal 1").max(50, "Kapasitas maksimal 50"),
});

type ClassFormValues = z.infer<typeof classSchema>;

// Create/Edit Dialog Component
function ClassFormDialog({ open, onOpenChange, editData, onSuccess }: { open: boolean; onOpenChange: (open: boolean) => void; editData?: ClassData | null; onSuccess: () => void }) {
  const createClass = useCreateClass();
  const updateClass = useUpdateClass();
  const { data: majors } = useGetMajors();
  const { data: academicYears } = useGetAcademicYears();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<ClassFormValues>({
    resolver: zodResolver(classSchema),
    defaultValues: {
      capacity: 36,
    },
  });

  const selectedMajorId = watch("majorId");
  const selectedAcademicYearId = watch("academicYearId");

  React.useEffect(() => {
    if (editData) {
      setValue("name", editData.name);
      setValue("grade", editData.grade);
      setValue("majorId", editData.majorId);
      setValue("academicYearId", editData.academicYearId);
      setValue("capacity", editData.capacity);
    } else {
      reset({
        capacity: 36,
      });
    }
  }, [editData, setValue, reset]);

  const onSubmit = async (data: ClassFormValues) => {
    try {
      if (editData) {
        await updateClass.mutateAsync({ id: editData.id, ...data });
        toast.success("Kelas berhasil diperbarui!");
      } else {
        await createClass.mutateAsync(data);
        toast.success("Kelas berhasil dibuat!");
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
          <DialogTitle>{editData ? "Edit Kelas" : "Tambah Kelas Baru"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nama Kelas</Label>
            <Input id="name" placeholder="Contoh: X IPA 1" {...register("name")} />
            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="grade">Tingkat</Label>
            <Input id="grade" type="number" placeholder="10, 11, 12" {...register("grade", { valueAsNumber: true })} />
            {errors.grade && <p className="text-sm text-red-500">{errors.grade.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>Jurusan</Label>
            <Select value={selectedMajorId} onValueChange={(value) => setValue("majorId", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih Jurusan" />
              </SelectTrigger>
              <SelectContent>
                {majors?.map((major: any) => (
                  <SelectItem key={major.id} value={major.id}>
                    {major.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.majorId && <p className="text-sm text-red-500">{errors.majorId.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>Tahun Ajaran</Label>
            <Select value={selectedAcademicYearId} onValueChange={(value) => setValue("academicYearId", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih Tahun Ajaran" />
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

          <div className="space-y-2">
            <Label htmlFor="capacity">Kapasitas</Label>
            <Input id="capacity" type="number" placeholder="36" {...register("capacity", { valueAsNumber: true })} />
            {errors.capacity && <p className="text-sm text-red-500">{errors.capacity.message}</p>}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button type="submit" disabled={createClass.isPending || updateClass.isPending}>
              {createClass.isPending || updateClass.isPending ? "Menyimpan..." : editData ? "Perbarui" : "Simpan"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Delete Confirmation Dialog
function DeleteClassDialog({ open, onOpenChange, classData, onSuccess }: { open: boolean; onOpenChange: (open: boolean) => void; classData: ClassData | null; onSuccess: () => void }) {
  const deleteClass = useDeleteClass();

  const handleDelete = async () => {
    if (!classData) return;

    try {
      await deleteClass.mutateAsync(classData.id);
      toast.success("Kelas berhasil dihapus!");
      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || "Gagal menghapus kelas");
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus Kelas</AlertDialogTitle>
          <AlertDialogDescription>
            Apakah Anda yakin ingin menghapus kelas <strong>{classData?.name}</strong>? Tindakan ini tidak dapat dibatalkan.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={deleteClass.isPending} className="bg-red-600 hover:bg-red-700">
            {deleteClass.isPending ? "Menghapus..." : "Hapus"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// Main DataTable Component
export default function ClassDataTable() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = React.useState(false);
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [selectedClass, setSelectedClass] = React.useState<ClassData | null>(null);

  const { data: classes = [], isLoading, refetch } = useGetClasses();

  const handleSuccess = () => {
    refetch();
  };

  const columns: ColumnDef<ClassData>[] = [
    {
      id: "select",
      header: ({ table }) => <Checkbox checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")} onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)} aria-label="Select all" />,
      cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Nama Kelas
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
    },
    {
      accessorKey: "grade",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Tingkat
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <Badge variant="secondary" className="font-medium">
          Kelas {row.getValue("grade")}
        </Badge>
      ),
    },
    {
      accessorKey: "major",
      header: "Jurusan",
      cell: ({ row }) => {
        const major = row.getValue("major") as ClassData["major"];
        return <div>{major.name}</div>;
      },
    },
    {
      accessorKey: "academicYear",
      header: "Tahun Ajaran",
      cell: ({ row }) => {
        const academicYear = row.getValue("academicYear") as ClassData["academicYear"];
        return <div>{academicYear.year}</div>;
      },
    },
    {
      accessorKey: "capacity",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Kapasitas
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const capacity = row.getValue("capacity") as number;
        const studentCount = row.original._count?.students || 0;
        return (
          <div className="text-center">
            <span className="font-medium">{studentCount}</span>
            <span className="text-muted-foreground">/{capacity}</span>
          </div>
        );
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const classData = row.original;

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
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(classData.id)}>Copy ID Kelas</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  setSelectedClass(classData);
                  setEditDialogOpen(true);
                }}
              >
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setSelectedClass(classData);
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
    data: classes,
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
            <p className="mt-2 text-sm text-muted-foreground">Memuat data kelas...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className=" mx-auto my-8 p-6 max-w-7xl">
        <div className="font-bold text-3xl">Kelas </div>
        <div className=" mx-auto">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-2">
              <Input placeholder="Cari nama kelas..." value={(table.getColumn("name")?.getFilterValue() as string) ?? ""} onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)} className="max-w-sm" />
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
                          {column.id}
                        </DropdownMenuCheckboxItem>
                      );
                    })}
                </DropdownMenuContent>
              </DropdownMenu>

              <Button onClick={() => setCreateDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Tambah Kelas
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
                      Tidak ada data kelas.
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
        <ClassFormDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} onSuccess={handleSuccess} />

        <ClassFormDialog open={editDialogOpen} onOpenChange={setEditDialogOpen} editData={selectedClass} onSuccess={handleSuccess} />

        <DeleteClassDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen} classData={selectedClass} onSuccess={handleSuccess} />
      </div>
    </>
  );
}
