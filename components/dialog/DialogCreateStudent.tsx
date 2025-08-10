"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreateStudent } from "@/app/hooks/useStudents";
import { format } from "date-fns";
import { useGetClasses } from "@/app/hooks/useClass";
import { useGetAcademicYears } from "@/app/hooks/useAcademicYear";
import { useGetMajors } from "@/app/hooks/useMajor";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useGetClerk } from "@/app/hooks/useClerk";

// Interface untuk Clerk User sesuai dengan struktur data yang ada
interface ClerkUser {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email_addresses: Array<{
    email_address: string;
    verification: {
      status: string;
    };
  }>;
  image_url?: string;
  profile_image_url?: string;
}

// Fungsi upload yang disesuaikan dengan URL dan response format yang sama
const uploadPhoto = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch(`https://file.pasarjaya.cloud/api/upload`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (response.ok && data?.fileUrl) {
      return data.fileUrl;
    } else {
      throw new Error(data?.message || "Upload gagal");
    }
  } catch (error) {
    console.error("Error uploading photo:", error);
    throw error;
  }
};

const studentSchema = z.object({
  userId: z.string().min(1, "User ID wajib diisi"),
  nisn: z.string().min(5, "NISN wajib diisi"),
  name: z.string().min(1, "Nama wajib diisi"),
  birthPlace: z.string().min(1, "Tempat lahir wajib diisi"),
  birthDate: z.string().min(1, "Tanggal lahir wajib diisi"),
  nik: z.string().min(1, "NIK wajib diisi"),
  address: z.string().min(1, "Alamat wajib diisi"),
  classId: z.string().min(1, "Kelas wajib diisi"),
  academicYearId: z.string().min(1, "Tahun ajaran wajib diisi"),
  gender: z.enum(["L", "P"], { error: "Jenis kelamin wajib dipilih" }),
  enrollmentDate: z.string().min(1, "Tanggal masuk wajib diisi"),
  graduationDate: z.string().optional(),
  majorId: z.string().min(1, "Jurusan wajib diisi"),
  parentPhone: z.string().optional(),
  avatarUrl: z.string().optional(),
});

type StudentFormValues = z.infer<typeof studentSchema>;

export function DialogCreateStudent() {
  const [open, setOpen] = React.useState(false);
  const [preview, setPreview] = React.useState<string | null>(null);
  const [uploading, setUploading] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [userSelectOpen, setUserSelectOpen] = React.useState(false);
  const [classSelectOpen, setClassSelectOpen] = React.useState(false);
  const [academicYearSelectOpen, setAcademicYearSelectOpen] = React.useState(false);
  const [majorSelectOpen, setMajorSelectOpen] = React.useState(false);

  const createStudent = useCreateStudent();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<StudentFormValues>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      gender: "L",
      enrollmentDate: format(new Date(), "yyyy-MM-dd"),
    },
  });

  // Watch userId untuk auto-fill name
  const selectedUserId = watch("userId");
  const selectedClassId = watch("classId");
  const selectedAcademicYearId = watch("academicYearId");
  const selectedMajorId = watch("majorId");

  const onSubmit = async (data: StudentFormValues) => {
    try {
      await createStudent.mutateAsync(data);
      reset();
      setPreview(null);
      setSelectedFile(null);
      setOpen(false);
      toast.success("Data siswa berhasil disimpan!");
    } catch (error) {
      console.error("Error creating student:", error);
      toast.error("Gagal menyimpan data siswa : " + error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);

    // Reset preview and URL when new file is selected
    setPreview(null);
    setValue("avatarUrl", "");

    // Create preview for image files
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadPhoto = async () => {
    if (!selectedFile) {
      toast.error("Pilih foto terlebih dahulu");
      return;
    }

    setUploading(true);

    try {
      const photoUrl = await uploadPhoto(selectedFile);
      setValue("avatarUrl", photoUrl);
      toast.success("Foto berhasil diupload!");

      // Update preview with uploaded URL
      setPreview(photoUrl);
    } catch (error) {
      toast.error("Gagal upload foto");
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  const { data: classes } = useGetClasses();
  const { data: academicYears } = useGetAcademicYears();
  const { data: majors } = useGetMajors();
  const { data: clerkUsers } = useGetClerk();

  // Fungsi untuk mendapatkan nama lengkap user
  const getUserFullName = (user: ClerkUser): string => {
    const firstName = user.first_name || "";
    const lastName = user.last_name || "";
    return `${firstName} ${lastName}`.trim() || "Nama tidak tersedia";
  };

  // Fungsi untuk mendapatkan email user
  const getUserEmail = (user: ClerkUser): string => {
    const primaryEmail = user.email_addresses?.find((email) => email.verification?.status === "verified");
    return primaryEmail?.email_address || "Email tidak tersedia";
  };

  // Auto-fill name ketika user dipilih
  React.useEffect(() => {
    if (selectedUserId && clerkUsers) {
      const selectedUser = clerkUsers.find((user: ClerkUser) => user.id === selectedUserId);
      if (selectedUser) {
        const fullName = getUserFullName(selectedUser);
        setValue("name", fullName);

        // Opsional: Set avatar dari Clerk jika ada
        if (selectedUser.profile_image_url || selectedUser.image_url) {
          const avatarUrl = selectedUser.profile_image_url || selectedUser.image_url;
          setValue("avatarUrl", avatarUrl);
          setPreview(avatarUrl);
        }
      }
    }
  }, [selectedUserId, clerkUsers, setValue]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create Student</Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">Tambah Siswa Baru</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="userId">User Login</Label>
              <Popover open={userSelectOpen} onOpenChange={setUserSelectOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" role="combobox" aria-expanded={userSelectOpen} className="w-full justify-between">
                    {selectedUserId && clerkUsers ? getUserFullName(clerkUsers.find((user: ClerkUser) => user.id === selectedUserId)!) : "Pilih User..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Cari user..." />
                    <CommandList>
                      <CommandEmpty>User tidak ditemukan.</CommandEmpty>
                      <CommandGroup>
                        {clerkUsers?.map((user: ClerkUser) => (
                          <CommandItem
                            key={user.id}
                            value={`${getUserFullName(user)} ${getUserEmail(user)}`}
                            onSelect={() => {
                              setValue("userId", user.id);
                              setUserSelectOpen(false);
                            }}
                          >
                            <Check className={cn("mr-2 h-4 w-4", selectedUserId === user.id ? "opacity-100" : "opacity-0")} />
                            <div className="flex flex-col items-start">
                              <span className="font-medium">{getUserFullName(user)}</span>
                              <span className="text-xs text-muted-foreground">{getUserEmail(user)}</span>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              {errors.userId && <p className="text-sm text-red-500">{errors.userId.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="nisn">NISN</Label>
              <Input id="nisn" {...register("nisn")} />
              {errors.nisn && <p className="text-sm text-red-500">{errors.nisn.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Nama</Label>
              <Input id="name" {...register("name")} placeholder="Nama akan terisi otomatis setelah memilih user" />
              {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="birthPlace">Tempat Lahir</Label>
              <Input id="birthPlace" {...register("birthPlace")} />
              {errors.birthPlace && <p className="text-sm text-red-500">{errors.birthPlace.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="birthDate">Tanggal Lahir</Label>
              <Input id="birthDate" type="date" {...register("birthDate")} />
              {errors.birthDate && <p className="text-sm text-red-500">{errors.birthDate.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="nik">NIK</Label>
              <Input id="nik" {...register("nik")} />
              {errors.nik && <p className="text-sm text-red-500">{errors.nik.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Alamat</Label>
              <Input id="address" {...register("address")} />
              {errors.address && <p className="text-sm text-red-500">{errors.address.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>Kelas</Label>
              <Popover open={classSelectOpen} onOpenChange={setClassSelectOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" role="combobox" aria-expanded={classSelectOpen} className="w-full justify-between">
                    {selectedClassId && classes ? classes.find((cls: { id: string | number; name: string }) => String(cls.id) === selectedClassId)?.name : "Pilih Kelas..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Cari kelas..." />
                    <CommandList>
                      <CommandEmpty>Kelas tidak ditemukan.</CommandEmpty>
                      <CommandGroup>
                        {classes?.map((cls: { id: string | number; name: string }) => (
                          <CommandItem
                            key={String(cls.id)}
                            value={cls.name}
                            onSelect={() => {
                              setValue("classId", String(cls.id));
                              setClassSelectOpen(false);
                            }}
                          >
                            <Check className={cn("mr-2 h-4 w-4", selectedClassId === String(cls.id) ? "opacity-100" : "opacity-0")} />
                            {cls.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              {errors.classId && <p className="text-sm text-red-500">{errors.classId.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>Tahun Ajaran</Label>
              <Popover open={academicYearSelectOpen} onOpenChange={setAcademicYearSelectOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" role="combobox" aria-expanded={academicYearSelectOpen} className="w-full justify-between">
                    {selectedAcademicYearId && academicYears ? academicYears.find((year: { id: string | number; year: string }) => String(year.id) === selectedAcademicYearId)?.year : "Pilih Tahun Ajaran..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Cari tahun ajaran..." />
                    <CommandList>
                      <CommandEmpty>Tahun ajaran tidak ditemukan.</CommandEmpty>
                      <CommandGroup>
                        {academicYears?.map((year: { id: string | number; year: string }) => (
                          <CommandItem
                            key={String(year.id)}
                            value={year.year}
                            onSelect={() => {
                              setValue("academicYearId", String(year.id));
                              setAcademicYearSelectOpen(false);
                            }}
                          >
                            <Check className={cn("mr-2 h-4 w-4", selectedAcademicYearId === String(year.id) ? "opacity-100" : "opacity-0")} />
                            {year.year}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              {errors.academicYearId && <p className="text-sm text-red-500">{errors.academicYearId.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>Jurusan</Label>
              <Popover open={majorSelectOpen} onOpenChange={setMajorSelectOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" role="combobox" aria-expanded={majorSelectOpen} className="w-full justify-between">
                    {selectedMajorId && majors ? majors.find((major: { id: string | number; name: string }) => String(major.id) === selectedMajorId)?.name : "Pilih Jurusan..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Cari jurusan..." />
                    <CommandList>
                      <CommandEmpty>Jurusan tidak ditemukan.</CommandEmpty>
                      <CommandGroup>
                        {majors?.map((major: { id: string | number; name: string }) => (
                          <CommandItem
                            key={String(major.id)}
                            value={major.name}
                            onSelect={() => {
                              setValue("majorId", String(major.id));
                              setMajorSelectOpen(false);
                            }}
                          >
                            <Check className={cn("mr-2 h-4 w-4", selectedMajorId === String(major.id) ? "opacity-100" : "opacity-0")} />
                            {major.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              {errors.majorId && <p className="text-sm text-red-500">{errors.majorId.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>Tanggal Masuk</Label>
              <Input type="date" {...register("enrollmentDate")} />
              {errors.enrollmentDate && <p className="text-sm text-red-500">{errors.enrollmentDate.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>Tanggal Lulus (opsional)</Label>
              <Input type="date" {...register("graduationDate")} />
            </div>

            <div className="space-y-2">
              <Label>Jenis Kelamin</Label>
              <Select onValueChange={(value) => setValue("gender", value as "L" | "P")}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Jenis Kelamin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="L">Laki-laki</SelectItem>
                  <SelectItem value="P">Perempuan</SelectItem>
                </SelectContent>
              </Select>
              {errors.gender && <p className="text-sm text-red-500">{errors.gender.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>Nomor HP Orang Tua</Label>
              <Input {...register("parentPhone")} />
            </div>

            {/* Photo Upload Section */}
            <div className="md:col-span-2 space-y-3">
              <Label>Foto Siswa</Label>

              {/* File Input */}
              <div className="space-y-2">
                <Input type="file" accept="image/*" onChange={handleFileChange} />

                {selectedFile && (
                  <p className="text-sm text-muted-foreground">
                    File dipilih: <strong>{selectedFile.name}</strong>
                  </p>
                )}
              </div>

              {/* Upload Button */}
              {selectedFile && (
                <Button type="button" onClick={handleUploadPhoto} disabled={uploading} variant="outline" className="w-full md:w-auto">
                  {uploading ? "Mengupload..." : "Upload Foto"}
                </Button>
              )}

              {/* Upload Status */}
              {uploading && <p className="text-sm text-yellow-600">Mengunggah foto...</p>}

              {/* Preview */}
              {preview && (
                <div className="mt-3">
                  <p className="text-sm text-green-600 mb-2">✅ Foto berhasil diupload</p>
                  <img src={preview} alt="Preview foto siswa" className="h-32 w-32 rounded-lg object-cover border-2 border-border" />
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setOpen(false);
                reset();
                setPreview(null);
                setSelectedFile(null);
                setUserSelectOpen(false);
                setClassSelectOpen(false);
                setAcademicYearSelectOpen(false);
                setMajorSelectOpen(false);
              }}
            >
              Batal
            </Button>
            <Button type="submit" disabled={createStudent.isPending || uploading}>
              {createStudent.isPending ? "Menyimpan..." : "Simpan Data"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
