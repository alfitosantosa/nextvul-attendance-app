"use client";

import * as React from "react";
import { ColumnDef, ColumnFiltersState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, SortingState, useReactTable, VisibilityState } from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal, Plus, Pencil, Trash2, User, BookOpen, GraduationCap } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// Import hooks
import { useGetUsers } from "@/app/hooks/useUsers";
import { useGetClerk } from "@/app/hooks/useClerk";
import Navbar from "@/components/navbar";

// Import dialog components
import { UserFormDialog, DeleteUserDialog, UserData, ClerkUser } from "@/components/dialog/Create/DialogCreateUser";

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

  // Fetch data with proper error handling
  const { data: usersData = [], isLoading, refetch, error } = useGetUsers();
  const { data: clerkUsers = [] } = useGetClerk();

  // Helper function to get clerk user info
  const getClerkUserInfo = (clerkId?: string) => {
    if (!clerkId || !clerkUsers.length) return null;
    return clerkUsers.find((user: ClerkUser) => user.id === clerkId) || null;
  };

  // Enhanced success handler with better state management
  const handleSuccess = React.useCallback(async () => {
    try {
      // Clear selections
      setRowSelection({});
      setSelectedUser(null);

      // Refetch the user data (not clerk data)
      await refetch();

      console.log("Data refetched successfully");
    } catch (error) {
      console.error("Error refetching data:", error);
    }
  }, [refetch]);

  // Close dialog handlers
  const handleCloseCreateDialog = () => {
    setCreateDialogOpen(false);
    setSelectedUser(null);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setSelectedUser(null);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setSelectedUser(null);
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
        const name = row.getValue("name") as string;

        return (
          <div className="flex items-center space-x-2">
            {clerkInfo?.image_url && (
              <img
                src={clerkInfo.image_url}
                alt={name || "User"}
                className="h-8 w-8 rounded-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            )}
            <div>
              <div className="font-medium">{name || "-"}</div>
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

        const getStatusLabel = (status: string) => {
          switch (status?.toLowerCase()) {
            case "active":
              return "Aktif";
            case "inactive":
              return "Tidak Aktif";
            case "graduated":
              return "Lulus";
            default:
              return status || "-";
          }
        };

        return <Badge variant={getStatusVariant(status)}>{getStatusLabel(status)}</Badge>;
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
            {clerkInfo && <span className="text-xs text-muted-foreground truncate max-w-32">{clerkInfo.email_addresses?.[0]?.email_address || "No email"}</span>}
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
    data: usersData,
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

  if (error) {
    return (
      <div className="w-full">
        <div className="flex items-center justify-center h-32">
          <div className="text-center text-red-600">
            <p>Error loading users: {error.message}</p>
            <Button onClick={() => refetch()} className="mt-2">
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="w-max-7xl mx-auto my-8 p-6 max-w-7xl">
        <div className="font-bold text-3xl">Users Menu</div>
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
                    const getColumnLabel = (columnId: string) => {
                      switch (columnId) {
                        case "clerkId":
                          return "Clerk Status";
                        case "name":
                          return "Nama";
                        case "email":
                          return "Email";
                        case "role":
                          return "Role";
                        case "class":
                          return "Kelas";
                        case "major":
                          return "Jurusan";
                        case "status":
                          return "Status";
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
        <UserFormDialog open={createDialogOpen} onOpenChange={handleCloseCreateDialog} onSuccess={handleSuccess} />

        <UserFormDialog open={editDialogOpen} onOpenChange={handleCloseEditDialog} editData={selectedUser} onSuccess={handleSuccess} />

        <DeleteUserDialog open={deleteDialogOpen} onOpenChange={handleCloseDeleteDialog} userData={selectedUser} onSuccess={handleSuccess} />
      </div>
    </>
  );
}
