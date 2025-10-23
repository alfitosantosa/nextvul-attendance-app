"use client";

import * as React from "react";
import { ColumnDef, ColumnFiltersState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, SortingState, useReactTable, VisibilityState } from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal, Plus, Pencil, Trash2, Eye, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

// Import hooks
import { useGetMajors, useCreateMajor, useUpdateMajor, useDeleteMajor } from "@/app/hooks/useMajors";
import Navbar from "@/components/navbar";

// Type definitions
export type MajorData = {
  id: string;
  code: string;
  name: string;
  description: string | null;
  isActive: boolean;
  classes: any[];
  students: any[];
  subjects: any[];
};

// Form schema - Fixed to make isActive required boolean
const majorSchema = z.object({
  code: z.string().min(1, "Kode jurusan wajib diisi").max(10, "Kode maksimal 10 karakter"),
  name: z.string().min(1, "Nama jurusan wajib diisi").max(100, "Nama maksimal 100 karakter"),
  description: z.string().optional(),
  isActive: z.boolean(), // Removed .default(true) to make it required
});

type MajorFormValues = z.infer<typeof majorSchema>;

// Create/Edit Dialog Component
function MajorFormDialog({ open, onOpenChange, editData, onSuccess }: { open: boolean; onOpenChange: (open: boolean) => void; editData?: MajorData | null; onSuccess: () => void }) {
  const createMajor = useCreateMajor();
  const updateMajor = useUpdateMajor();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<MajorFormValues>({
    resolver: zodResolver(majorSchema),
    defaultValues: {
      code: "",
      name: "",
      description: "",
      isActive: true, // Explicitly set default value here
    },
  });

  const isActive = watch("isActive");

  React.useEffect(() => {
    if (editData) {
      setValue("code", editData.code);
      setValue("name", editData.name);
      setValue("description", editData.description || "");
      setValue("isActive", editData.isActive);
    } else {
      reset({
        code: "",
        name: "",
        description: "",
        isActive: true, // Explicitly set default value here too
      });
    }
  }, [editData, setValue, reset]);

  const onSubmit = async (data: MajorFormValues) => {
    try {
      if (editData) {
        await updateMajor.mutateAsync({ id: editData.id, ...data });
        toast.success("Jurusan berhasil diperbarui!");
      } else {
        await createMajor.mutateAsync(data);
        toast.success("Jurusan berhasil dibuat!");
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
          <DialogTitle>{editData ? "Edit Jurusan" : "Tambah Jurusan Baru"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="code">Kode Jurusan</Label>
            <Input id="code" placeholder="Contoh: IPA, IPS, TKJ" {...register("code")} />
            {errors.code && <p className="text-sm text-red-500">{errors.code.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Nama Jurusan</Label>
            <Input id="name" placeholder="Contoh: Ilmu Pengetahuan Alam" {...register("name")} />
            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi (Opsional)</Label>
            <Textarea id="description" placeholder="Deskripsi singkat tentang jurusan..." rows={3} {...register("description")} />
            {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="isActive" checked={isActive} onCheckedChange={(checked) => setValue("isActive", checked)} />
            <Label htmlFor="isActive">Jurusan Aktif</Label>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button type="submit" disabled={createMajor.isPending || updateMajor.isPending}>
              {createMajor.isPending || updateMajor.isPending ? "Menyimpan..." : editData ? "Perbarui" : "Simpan"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Detail Dialog Component
function MajorDetailDialog({ open, onOpenChange, majorData }: { open: boolean; onOpenChange: (open: boolean) => void; majorData: MajorData | null }) {
  if (!majorData) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Detail Jurusan</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Kode Jurusan</Label>
              <p className="text-lg font-semibold">{majorData.code}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Status</Label>
              <div className="mt-1">
                <Badge variant={majorData.isActive ? "default" : "secondary"}>{majorData.isActive ? "Aktif" : "Tidak Aktif"}</Badge>
              </div>
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium text-muted-foreground">Nama Jurusan</Label>
            <p className="text-lg">{majorData.name}</p>
          </div>

          {majorData.description && (
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Deskripsi</Label>
              <p className="text-sm text-muted-foreground mt-1">{majorData.description}</p>
            </div>
          )}

          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{majorData.classes?.length || 0}</div>
              <div className="text-sm text-muted-foreground">Kelas</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">{majorData.students?.length || 0}</div>
              <div className="text-sm text-muted-foreground">Siswa</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{majorData.subjects?.length || 0}</div>
              <div className="text-sm text-muted-foreground">Mata Pelajaran</div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={() => onOpenChange(false)}>Tutup</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Delete Confirmation Dialog
function DeleteMajorDialog({ open, onOpenChange, majorData, onSuccess }: { open: boolean; onOpenChange: (open: boolean) => void; majorData: MajorData | null; onSuccess: () => void }) {
  const deleteMajor = useDeleteMajor();

  const handleDelete = async () => {
    if (!majorData) return;

    try {
      await deleteMajor.mutateAsync(majorData.id);
      toast.success("Jurusan berhasil dihapus!");
      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || "Gagal menghapus jurusan");
    }
  };

  const hasRelatedData = majorData && ((majorData.classes?.length || 0) > 0 || (majorData.students?.length || 0) > 0 || (majorData.subjects?.length || 0) > 0);

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus Jurusan</AlertDialogTitle>
          <AlertDialogDescription>
            {hasRelatedData ? (
              <div className="space-y-2">
                <p>
                  Jurusan <strong>{majorData?.name}</strong> memiliki data terkait:
                </p>
                <ul className="list-disc list-inside text-sm space-y-1">
                  {majorData?.classes?.length ? <li>{majorData.classes.length} kelas</li> : null}
                  {majorData?.students?.length ? <li>{majorData.students.length} siswa</li> : null}
                  {majorData?.subjects?.length ? <li>{majorData.subjects.length} mata pelajaran</li> : null}
                </ul>
                <p className="text-red-600 font-medium">Menghapus jurusan akan menghapus semua data terkait. Tindakan ini tidak dapat dibatalkan.</p>
              </div>
            ) : (
              <p>
                Apakah Anda yakin ingin menghapus jurusan <strong>{majorData?.name}</strong>? Tindakan ini tidak dapat dibatalkan.
              </p>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={deleteMajor.isPending} className="bg-red-600 hover:bg-red-700">
            {deleteMajor.isPending ? "Menghapus..." : "Hapus"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// Main DataTable Component
export default function MajorDataTable() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = React.useState(false);
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = React.useState(false);
  const [selectedMajor, setSelectedMajor] = React.useState<MajorData | null>(null);

  const { data: majors = [], isLoading, refetch } = useGetMajors();

  const handleSuccess = () => {
    refetch();
  };

  const columns: ColumnDef<MajorData>[] = [
    {
      id: "select",
      header: ({ table }) => <Checkbox checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")} onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)} aria-label="Select all" />,
      cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "code",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Kode
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => <div className="font-mono font-medium text-center">{row.getValue("code")}</div>,
    },
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Nama Jurusan
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
    },
    {
      accessorKey: "description",
      header: "Deskripsi",
      cell: ({ row }) => {
        const description = row.getValue("description") as string;
        return <div className="max-w-[200px] truncate text-sm text-muted-foreground">{description || "Tidak ada deskripsi"}</div>;
      },
    },
    {
      accessorKey: "isActive",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Status
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const isActive = row.getValue("isActive") as boolean;
        return <Badge variant={isActive ? "default" : "secondary"}>{isActive ? "Aktif" : "Tidak Aktif"}</Badge>;
      },
    },
    {
      id: "stats",
      header: "Statistik",
      cell: ({ row }) => {
        const major = row.original;
        const classCount = major.classes?.length || 0;
        const studentCount = major.students?.length || 0;
        const subjectCount = major.subjects?.length || 0;

        return (
          <div className="text-sm text-center">
            <div className="flex space-x-2">
              <span className="text-blue-600 font-medium">{classCount}K</span>
              <span className="text-green-600 font-medium">{studentCount}S</span>
              <span className="text-purple-600 font-medium">{subjectCount}MP</span>
            </div>
            <div className="text-xs text-muted-foreground">Kelas • Siswa • MaPel</div>
          </div>
        );
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const majorData = row.original;

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
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(majorData.id)}>Copy ID Jurusan</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  setSelectedMajor(majorData);
                  setDetailDialogOpen(true);
                }}
              >
                <Eye className="mr-2 h-4 w-4" />
                Lihat Detail
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setSelectedMajor(majorData);
                  setEditDialogOpen(true);
                }}
              >
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setSelectedMajor(majorData);
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
    data: majors,
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
            <p className="mt-2 text-sm text-muted-foreground">Memuat data jurusan...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="w-max-7xl mx-auto my-8 p-6 max-w-7xl">
        <div className="font-bold text-3xl">Jurusan</div>
        <div className="max-w-7xl justify-center mx-auto">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari nama atau kode jurusan..."
                  value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                  onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
                  className="max-w-sm pl-10"
                />
              </div>
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
                Tambah Jurusan
              </Button>
            </div>
          </div>

          <div className="rounded-md border max-w-7xl justify-center mx-auto">
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
                      Tidak ada data jurusan.
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
        <MajorFormDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} onSuccess={handleSuccess} />

        <MajorFormDialog open={editDialogOpen} onOpenChange={setEditDialogOpen} editData={selectedMajor} onSuccess={handleSuccess} />

        <MajorDetailDialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen} majorData={selectedMajor} />

        <DeleteMajorDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen} majorData={selectedMajor} onSuccess={handleSuccess} />
      </div>
    </>
  );
}
