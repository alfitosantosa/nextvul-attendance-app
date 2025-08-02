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
import { toast } from "sonner";

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

  const createStudent = useCreateStudent();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<StudentFormValues>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      gender: "L",
      enrollmentDate: format(new Date(), "yyyy-MM-dd"),
    },
  });

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
            <div>
              <Label htmlFor="nisn">NISN</Label>
              <Input id="nisn" {...register("nisn")} />
              {errors.nisn && <p className="text-sm text-red-500">{errors.nisn.message}</p>}
            </div>

            <div>
              <Label htmlFor="name">Nama</Label>
              <Input id="name" {...register("name")} />
              {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
            </div>

            <div>
              <Label htmlFor="birthPlace">Tempat Lahir</Label>
              <Input id="birthPlace" {...register("birthPlace")} />
              {errors.birthPlace && <p className="text-sm text-red-500">{errors.birthPlace.message}</p>}
            </div>

            <div>
              <Label htmlFor="birthDate">Tanggal Lahir</Label>
              <Input id="birthDate" type="date" {...register("birthDate")} />
              {errors.birthDate && <p className="text-sm text-red-500">{errors.birthDate.message}</p>}
            </div>

            <div>
              <Label htmlFor="nik">NIK</Label>
              <Input id="nik" {...register("nik")} />
              {errors.nik && <p className="text-sm text-red-500">{errors.nik.message}</p>}
            </div>

            <div>
              <Label htmlFor="address">Alamat</Label>
              <Input id="address" {...register("address")} />
              {errors.address && <p className="text-sm text-red-500">{errors.address.message}</p>}
            </div>

            <div>
              <Label>Kelas</Label>
              <Select onValueChange={(value) => setValue("classId", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Kelas" />
                </SelectTrigger>
                <SelectContent>
                  {classes?.map((cls: { id: string | number; name: string }) => (
                    <SelectItem key={String(cls.id)} value={String(cls.id)}>
                      {cls.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.classId && <p className="text-sm text-red-500">{errors.classId.message}</p>}
            </div>

            <div>
              <Label>Tahun Ajaran</Label>
              <Select onValueChange={(value) => setValue("academicYearId", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Tahun Ajaran" />
                </SelectTrigger>
                <SelectContent>
                  {academicYears?.map((year: { id: string | number; year: string }) => (
                    <SelectItem key={String(year.id)} value={String(year.id)}>
                      {year.year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.academicYearId && <p className="text-sm text-red-500">{errors.academicYearId.message}</p>}
            </div>

            <div>
              <Label>Jurusan</Label>
              <Select onValueChange={(value) => setValue("majorId", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Jurusan" />
                </SelectTrigger>
                <SelectContent>
                  {majors?.map((major: { id: string | number; name: string }) => (
                    <SelectItem key={String(major.id)} value={String(major.id)}>
                      {major.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.majorId && <p className="text-sm text-red-500">{errors.majorId.message}</p>}
            </div>

            <div>
              <Label>Tanggal Masuk</Label>
              <Input type="date" {...register("enrollmentDate")} />
              {errors.enrollmentDate && <p className="text-sm text-red-500">{errors.enrollmentDate.message}</p>}
            </div>

            <div>
              <Label>Tanggal Lulus (opsional)</Label>
              <Input type="date" {...register("graduationDate")} />
            </div>

            <div>
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

            <div>
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
