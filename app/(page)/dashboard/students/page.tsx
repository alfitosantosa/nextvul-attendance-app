"use client";

import * as React from "react";
import { ColumnDef, ColumnFiltersState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, SortingState, useReactTable, VisibilityState } from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal, Plus, Pencil, Trash2, User, Users, GraduationCap, BookOpen } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

// Import hooks
import { useGetUsers, useCreateUser, useUpdateUser, useDeleteUser } from "@/app/hooks/useUsers";
import Navbar from "@/components/navbar";

// Type definitions
export type UserData = {
  id: string;
  clerkId?: string;
  roleId: string;
  name: string;
  email?: string;
  avatarUrl?: string;

  // Student fields
  nisn?: string;
  birthPlace?: string;
  birthDate?: Date;
  nik?: string;
  address?: string;
  classId?: string;
  academicYearId?: string;
  enrollmentDate?: Date;
  gender?: string;
  graduationDate?: Date;
  majorId?: string;
  parentPhone?: string;
  status?: string;

  // Teacher fields
  employeeId?: string;
  position?: string;
  startDate?: Date;
  endDate?: Date;

  // Parent fields
  studentIds?: string[];
  relation?: string;

  createdAt: string;
  updatedAt: string;

  // Relations
  role: {
    id: string;
    name: string;
  };
  class?: {
    id: string;
    name: string;
  };
  major?: {
    id: string;
    name: string;
  };
  academicYear?: {
    id: string;
    name: string;
  };
};

// Form schema - simplified for basic user creation
const userSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi").max(100, "Nama maksimal 100 karakter"),
  email: z.string().email("Email tidak valid").optional().or(z.literal("")),
  roleId: z.string().min(1, "Role wajib dipilih"),
  gender: z.string().optional(),

  // Conditional fields based on role
  nisn: z.string().optional(),
  birthPlace: z.string().optional(),
  birthDate: z.string().optional(),
  nik: z.string().optional(),
  address: z.string().optional(),
  classId: z.string().optional(),
  academicYearId: z.string().optional(),
  majorId: z.string().optional(),
  parentPhone: z.string().optional(),
  status: z.string().min(1, "Status wajib diisi").default("active"),

  employeeId: z.string().optional(),
  position: z.string().optional(),

  relation: z.string().optional(),
});

type UserFormValues = z.infer<typeof userSchema>;

// Mock data for dropdowns - replace with actual API calls
const mockRoles = [
  { id: "1", name: "Student" },
  { id: "2", name: "Teacher" },
  { id: "3", name: "Parent" },
  { id: "4", name: "Admin" },
];

const mockClasses = [
  { id: "1", name: "X-1" },
  { id: "2", name: "X-2" },
  { id: "3", name: "XI-1" },
  { id: "4", name: "XI-2" },
];

const mockMajors = [
  { id: "1", name: "IPA" },
  { id: "2", name: "IPS" },
  { id: "3", name: "Bahasa" },
];

const mockAcademicYears = [
  { id: "1", name: "2024/2025" },
  { id: "2", name: "2023/2024" },
];

// Create/Edit Dialog Component
function UserFormDialog({ open, onOpenChange, editData, onSuccess }: { open: boolean; onOpenChange: (open: boolean) => void; editData?: UserData | null; onSuccess: () => void }) {
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema as any),
    defaultValues: {
      status: "active",
    },
  });

  const selectedRoleId = watch("roleId");
  const selectedRole = mockRoles.find((role) => role.id === selectedRoleId);

  React.useEffect(() => {
    if (editData) {
      setValue("name", editData.name);
      setValue("email", editData.email || "");
      setValue("roleId", editData.roleId);
      setValue("gender", editData.gender || "");
      setValue("nisn", editData.nisn || "");
      setValue("birthPlace", editData.birthPlace || "");
      setValue("birthDate", editData.birthDate ? new Date(editData.birthDate).toISOString().split("T")[0] : "");
      setValue("nik", editData.nik || "");
      setValue("address", editData.address || "");
      setValue("classId", editData.classId || "");
      setValue("academicYearId", editData.academicYearId || "");
      setValue("majorId", editData.majorId || "");
      setValue("parentPhone", editData.parentPhone || "");
      setValue("status", editData.status || "active");
      setValue("employeeId", editData.employeeId || "");
      setValue("position", editData.position || "");
      setValue("relation", editData.relation || "");
    } else {
      reset({
        status: "active",
      });
    }
  }, [editData, setValue, reset]);

  const onSubmit = async (data: UserFormValues) => {
    try {
      const submitData = {
        ...data,
        birthDate: data.birthDate ? new Date(data.birthDate) : undefined,
        enrollmentDate: selectedRole?.name === "Student" ? new Date() : undefined,
        startDate: selectedRole?.name === "Teacher" ? new Date() : undefined,
      };

      if (editData) {
        await updateUser.mutateAsync({ id: editData.id, ...submitData });
        toast.success("User berhasil diperbarui!");
      } else {
        await createUser.mutateAsync(submitData);
        toast.success("User berhasil dibuat!");
      }
      reset();
      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || "Terjadi kesalahan");
    }
  };

  const renderRoleSpecificFields = () => {
    if (!selectedRole) return null;

    switch (selectedRole.name.toLowerCase()) {
      case "student":
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nisn">NISN *</Label>
                <Input id="nisn" placeholder="1234567890" {...register("nisn")} />
                {errors.nisn && <p className="text-sm text-red-500">{errors.nisn.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="nik">NIK *</Label>
                <Input id="nik" placeholder="3201234567890123" {...register("nik")} />
                {errors.nik && <p className="text-sm text-red-500">{errors.nik.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="birthPlace">Tempat Lahir *</Label>
                <Input id="birthPlace" placeholder="Jakarta" {...register("birthPlace")} />
                {errors.birthPlace && <p className="text-sm text-red-500">{errors.birthPlace.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="birthDate">Tanggal Lahir *</Label>
                <Input id="birthDate" type="date" {...register("birthDate")} />
                {errors.birthDate && <p className="text-sm text-red-500">{errors.birthDate.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Alamat *</Label>
              <Textarea id="address" placeholder="Alamat lengkap siswa" {...register("address")} />
              {errors.address && <p className="text-sm text-red-500">{errors.address.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Kelas *</Label>
                <Select onValueChange={(value) => setValue("classId", value)} defaultValue={watch("classId")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kelas" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockClasses.map((cls) => (
                      <SelectItem key={cls.id} value={cls.id}>
                        {cls.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Jurusan *</Label>
                <Select onValueChange={(value) => setValue("majorId", value)} defaultValue={watch("majorId")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih jurusan" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockMajors.map((major) => (
                      <SelectItem key={major.id} value={major.id}>
                        {major.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tahun Akademik *</Label>
                <Select onValueChange={(value) => setValue("academicYearId", value)} defaultValue={watch("academicYearId")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih tahun akademik" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockAcademicYears.map((year) => (
                      <SelectItem key={year.id} value={year.id}>
                        {year.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="parentPhone">No. HP Orang Tua</Label>
                <Input id="parentPhone" placeholder="08123456789" {...register("parentPhone")} />
              </div>
            </div>
          </>
        );

      case "teacher":
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="employeeId">ID Pegawai *</Label>
                <Input id="employeeId" placeholder="EMP001" {...register("employeeId")} />
                {errors.employeeId && <p className="text-sm text-red-500">{errors.employeeId.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="position">Jabatan</Label>
                <Input id="position" placeholder="Guru Matematika" {...register("position")} />
              </div>
            </div>
          </>
        );

      case "parent":
        return (
          <>
            <div className="space-y-2">
              <Label>Hubungan *</Label>
              <Select onValueChange={(value) => setValue("relation", value)} defaultValue={watch("relation")}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih hubungan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Father">Ayah</SelectItem>
                  <SelectItem value="Mother">Ibu</SelectItem>
                  <SelectItem value="Guardian">Wali</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editData ? "Edit User" : "Tambah User Baru"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Informasi Dasar</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Lengkap *</Label>
                <Input id="name" placeholder="Masukkan nama lengkap" {...register("name")} />
                {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="user@example.com" {...register("email")} />
                {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Role *</Label>
                <Select onValueChange={(value) => setValue("roleId", value)} defaultValue={watch("roleId")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih role" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockRoles.map((role) => (
                      <SelectItem key={role.id} value={role.id}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.roleId && <p className="text-sm text-red-500">{errors.roleId.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>Jenis Kelamin</Label>
                <Select onValueChange={(value) => setValue("gender", value)} defaultValue={watch("gender")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih jenis kelamin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="L">Laki-laki</SelectItem>
                    <SelectItem value="P">Perempuan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Role-specific fields */}
          {selectedRole && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Informasi {selectedRole.name}</h3>
              {renderRoleSpecificFields()}
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button type="submit">{editData ? "Perbarui" : "Simpan"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Delete Confirmation Dialog
function DeleteUserDialog({ open, onOpenChange, userData, onSuccess }: { open: boolean; onOpenChange: (open: boolean) => void; userData: UserData | null; onSuccess: () => void }) {
  const deleteUser = useDeleteUser();

  const handleDelete = async () => {
    if (!userData) return;

    try {
      await deleteUser.mutateAsync(userData.id);
      toast.success("User berhasil dihapus!");
      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || "Gagal menghapus user");
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus User</AlertDialogTitle>
          <AlertDialogDescription>
            Apakah Anda yakin ingin menghapus user <strong>{userData?.name}</strong>? Tindakan ini tidak dapat dibatalkan.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
            Hapus
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// Main DataTable Component
export default function UserDataTable() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = React.useState(false);
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState<UserData | null>(null);

  const { data: users = [], isLoading, refetch } = useGetUsers();

  const handleSuccess = () => {
    refetch();
  };

  const columns: ColumnDef<UserData>[] = [
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
            <User className="mr-2 h-4 w-4" />
            Nama
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => {
        const email = row.getValue("email") as string;
        return <div className="lowercase">{email || "-"}</div>;
      },
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        const role = row.original.role;
        return <Badge variant="secondary">{role.name}</Badge>;
      },
    },
    {
      accessorKey: "class",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            <BookOpen className="mr-2 h-4 w-4" />
            Kelas
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const classData = row.original.class;
        return <div>{classData?.name || "-"}</div>;
      },
    },
    {
      accessorKey: "major",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            <GraduationCap className="mr-2 h-4 w-4" />
            Jurusan
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const major = row.original.major;
        return <div>{major?.name || "-"}</div>;
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        const getStatusVariant = (status: string) => {
          switch (status?.toLowerCase()) {
            case "active":
              return "default";
            case "inactive":
              return "secondary";
            case "graduated":
              return "outline";
            default:
              return "secondary";
          }
        };
        return <Badge variant={getStatusVariant(status)}>{status === "active" ? "Aktif" : status === "inactive" ? "Tidak Aktif" : status === "graduated" ? "Lulus" : status || "-"}</Badge>;
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const userData = row.original;

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
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(userData.id)}>Copy ID User</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  setSelectedUser(userData);
                  setEditDialogOpen(true);
                }}
              >
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setSelectedUser(userData);
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
    data: users,
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
            <p className="mt-2 text-sm text-muted-foreground">Memuat data user...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="w-max-7xl mx-auto my-8 p-6">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center space-x-2">
            <Input placeholder="Cari nama user..." value={(table.getColumn("name")?.getFilterValue() as string) ?? ""} onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)} className="max-w-sm" />
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
              Tambah User
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
                    Tidak ada data user.
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

        {/* Dialogs */}
        <UserFormDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} onSuccess={handleSuccess} />

        <UserFormDialog open={editDialogOpen} onOpenChange={setEditDialogOpen} editData={selectedUser} onSuccess={handleSuccess} />

        <DeleteUserDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen} userData={selectedUser} onSuccess={handleSuccess} />
      </div>
    </>
  );
}
