"use client";

import * as React from "react";
import { ColumnDef, ColumnFiltersState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, SortingState, useReactTable, VisibilityState } from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal, Plus, Pencil, Trash2, User, Users, GraduationCap, BookOpen, Search } from "lucide-react";

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
import { useGetRoles } from "@/app/hooks/useRoles";
import { useGetClasses } from "@/app/hooks/useClass";
import { useGetAcademicYears } from "@/app/hooks/useAcademicYear";
import { useGetMajors } from "@/app/hooks/useMajors";
import { useGetClerk } from "@/app/hooks/useClerk";

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
  role?: {
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

// Clerk user type
type ClerkUser = {
  id: string;
  first_name: string;
  last_name: string;
  email_addresses: Array<{
    email_address: string;
    id: string;
  }>;
  image_url?: string;
};

// Form schema - simplified for basic user creation
const userSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi").max(100, "Nama maksimal 100 karakter"),
  email: z.string().email("Email tidak valid").optional().or(z.literal("")),
  roleId: z.string().min(1, "Role wajib dipilih"),
  clerkId: z.string().optional(),
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

// Clerk User Selector Component
function ClerkUserSelector({ onSelect, selectedClerkId, disabled = false }: { onSelect: (clerkUser: ClerkUser | null) => void; selectedClerkId?: string; disabled?: boolean }) {
  const [open, setOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const { data: clerkUsers = [], isLoading: clerkUsersLoading } = useGetClerk();

  const filteredClerkUsers = React.useMemo(() => {
    if (!searchTerm) return clerkUsers;

    return clerkUsers.filter((user: ClerkUser) => {
      const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
      const email = user.email_addresses[0]?.email_address.toLowerCase() || "";
      return fullName.includes(searchTerm.toLowerCase()) || email.includes(searchTerm.toLowerCase());
    });
  }, [clerkUsers, searchTerm]);

  const selectedUser = React.useMemo(() => {
    if (!selectedClerkId) return null;
    return clerkUsers.find((user: ClerkUser) => user.id === selectedClerkId) || null;
  }, [clerkUsers, selectedClerkId]);

  const handleSelect = (clerkUser: ClerkUser) => {
    onSelect(clerkUser);
    setOpen(false);
    setSearchTerm("");
  };

  const handleClear = () => {
    onSelect(null);
    setSearchTerm("");
  };

  return (
    <div className="space-y-2">
      <Label>Clerk User (Opsional)</Label>
      <div className="flex gap-2">
        <Button type="button" variant="outline" onClick={() => setOpen(true)} disabled={disabled || clerkUsersLoading} className="flex-1 justify-start">
          {clerkUsersLoading ? "Loading..." : selectedUser ? `${selectedUser.first_name} ${selectedUser.last_name} (${selectedUser.email_addresses[0]?.email_address})` : "Pilih Clerk User"}
        </Button>
        {selectedUser && (
          <Button type="button" variant="outline" size="sm" onClick={handleClear} disabled={disabled}>
            Clear
          </Button>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Pilih Clerk User</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Cari nama atau email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-8" />
            </div>

            <div className="max-h-96 overflow-y-auto space-y-2">
              {clerkUsersLoading ? (
                <div className="flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                </div>
              ) : filteredClerkUsers.length === 0 ? (
                <div className="text-center p-8 text-muted-foreground">{searchTerm ? "Tidak ada user yang cocok dengan pencarian" : "Tidak ada Clerk user tersedia"}</div>
              ) : (
                filteredClerkUsers.map((user: ClerkUser) => (
                  <div key={user.id} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted cursor-pointer" onClick={() => handleSelect(user)}>
                    <div className="flex-shrink-0">
                      {user.image_url ? (
                        <img src={user.image_url} alt={`${user.first_name} ${user.last_name}`} className="h-10 w-10 rounded-full" />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                          <User className="h-5 w-5" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {user.first_name} {user.last_name}
                      </p>
                      <p className="text-sm text-muted-foreground truncate">{user.email_addresses[0]?.email_address}</p>
                    </div>
                    {selectedClerkId === user.id && (
                      <div className="flex-shrink-0">
                        <Badge variant="default">Selected</Badge>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Create/Edit Dialog Component
function UserFormDialog({ open, onOpenChange, editData, onSuccess }: { open: boolean; onOpenChange: (open: boolean) => void; editData?: UserData | null; onSuccess: () => void }) {
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();

  // Fetch data inside the component
  const { data: roles = [], isLoading: rolesLoading } = useGetRoles();
  const { data: classes = [], isLoading: classesLoading } = useGetClasses();
  const { data: academicYears = [], isLoading: academicYearsLoading } = useGetAcademicYears();
  const { data: majors = [], isLoading: majorsLoading } = useGetMajors();
  const { data: clerkUsers = [], isLoading: clerkUsersLoading } = useGetClerk();

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
  const selectedClerkId = watch("clerkId");
  const selectedRole = roles.find((role: any) => role.id === selectedRoleId);

  React.useEffect(() => {
    if (editData) {
      setValue("name", editData.name);
      setValue("email", editData.email || "");
      setValue("roleId", editData.roleId);
      setValue("clerkId", editData.clerkId || "");
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

  const handleClerkUserSelect = (clerkUser: ClerkUser | null) => {
    if (clerkUser) {
      setValue("clerkId", clerkUser.id);
      setValue("name", `${clerkUser.first_name} ${clerkUser.last_name}`);
      setValue("email", clerkUser.email_addresses[0]?.email_address || "");
    } else {
      setValue("clerkId", "");
    }
  };

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
                    {classesLoading ? (
                      <SelectItem value="" disabled>
                        Loading...
                      </SelectItem>
                    ) : (
                      classes.map((cls: any) => (
                        <SelectItem key={cls.id} value={cls.id}>
                          {cls.name}
                        </SelectItem>
                      ))
                    )}
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
                    {majorsLoading ? (
                      <SelectItem value="" disabled>
                        Loading...
                      </SelectItem>
                    ) : (
                      majors.map((major: any) => (
                        <SelectItem key={major.id} value={major.id}>
                          {major.name}
                        </SelectItem>
                      ))
                    )}
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
                    {academicYearsLoading ? (
                      <SelectItem value="" disabled>
                        Loading...
                      </SelectItem>
                    ) : (
                      academicYears.map((year: any) => (
                        <SelectItem key={year.id} value={year.id}>
                          {year.year}
                        </SelectItem>
                      ))
                    )}
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

  // Show loading state if any required data is still loading
  if (rolesLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editData ? "Edit User" : "Tambah User Baru"}</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center h-32">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-sm text-muted-foreground">Memuat data...</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

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

            {/* Clerk User Selector */}
            <ClerkUserSelector onSelect={handleClerkUserSelect} selectedClerkId={selectedClerkId} disabled={createUser.isPending || updateUser.isPending} />

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
                    {roles.map((role: any) => (
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
            <Button type="submit" disabled={createUser.isPending || updateUser.isPending}>
              {createUser.isPending || updateUser.isPending ? "Loading..." : editData ? "Perbarui" : "Simpan"}
            </Button>
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
          <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700" disabled={deleteUser.isPending}>
            {deleteUser.isPending ? "Loading..." : "Hapus"}
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
  const { data: clerkUsers = [] } = useGetClerk();

  // Helper function to get clerk user info
  const getClerkUserInfo = (clerkId?: string) => {
    if (!clerkId) return null;
    return clerkUsers.find((user: ClerkUser) => user.id === clerkId) || null;
  };

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
      cell: ({ row }) => {
        const clerkInfo = getClerkUserInfo(row.original.clerkId);
        return (
          <div className="flex items-center space-x-2">
            {clerkInfo?.image_url && <img src={clerkInfo.image_url} alt={row.getValue("name")} className="h-8 w-8 rounded-full" />}
            <div>
              <div className="font-medium">{row.getValue("name")}</div>
              {clerkInfo && <div className="text-xs text-muted-foreground">Clerk User</div>}
            </div>
          </div>
        );
      },
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
        // Fix the runtime error by checking if role exists
        if (!role) {
          return <Badge variant="secondary">-</Badge>;
        }
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
      accessorKey: "clerkId",
      header: "Clerk Status",
      cell: ({ row }) => {
        const clerkId = row.getValue("clerkId") as string;
        const clerkInfo = getClerkUserInfo(clerkId);

        if (!clerkId) {
          return <Badge variant="outline">No Clerk</Badge>;
        }

        return (
          <div className="flex items-center space-x-2">
            <Badge variant="default">Linked</Badge>
            {clerkInfo && <span className="text-xs text-muted-foreground truncate max-w-32">{clerkInfo.email_addresses[0]?.email_address}</span>}
          </div>
        );
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
              {userData.clerkId && <DropdownMenuItem onClick={() => navigator.clipboard.writeText(userData.clerkId!)}>Copy Clerk ID</DropdownMenuItem>}
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
                        {column.id === "clerkId" ? "Clerk Status" : column.id}
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
