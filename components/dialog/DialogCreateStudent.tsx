"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreateStudent } from "@/app/hooks/useStudents"; // ← Pastikan ada
import { format } from "date-fns";

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

  const onSubmit = (data: StudentFormValues) => {
    createStudent.mutate(data, {
      onSuccess: () => {
        reset();
        setPreview(null);
        setOpen(false);
      },
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setValue("avatarUrl", base64String);
        setPreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create Student</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Student</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-5 space-y-1">
          <div>
            <Label htmlFor="nisn">NISN</Label>
            <Input id="nisn" {...register("nisn")} />
            {errors.nisn && <p className="text-sm text-red-500">{errors.nisn.message}</p>}
          </div>

          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...register("name")} />
            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
          </div>

          <div>
            <Label htmlFor="birthPlace">Birth Place</Label>
            <Input id="birthPlace" {...register("birthPlace")} />
            {errors.birthPlace && <p className="text-sm text-red-500">{errors.birthPlace.message}</p>}
          </div>

          <div>
            <Label htmlFor="birthDate">Birth Date</Label>
            <Input id="birthDate" type="date" {...register("birthDate")} />
            {errors.birthDate && <p className="text-sm text-red-500">{errors.birthDate.message}</p>}
          </div>

          <div>
            <Label htmlFor="nik">NIK</Label>
            <Input id="nik" {...register("nik")} />
            {errors.nik && <p className="text-sm text-red-500">{errors.nik.message}</p>}
          </div>

          <div>
            <Label htmlFor="address">Address</Label>
            <Input id="address" {...register("address")} />
            {errors.address && <p className="text-sm text-red-500">{errors.address.message}</p>}
          </div>

          <div>
            <Label htmlFor="classId">Class ID</Label>
            <Input id="classId" {...register("classId")} />
            {errors.classId && <p className="text-sm text-red-500">{errors.classId.message}</p>}
          </div>

          <div>
            <Label htmlFor="academicYearId">Academic Year ID</Label>
            <Input id="academicYearId" {...register("academicYearId")} />
            {errors.academicYearId && <p className="text-sm text-red-500">{errors.academicYearId.message}</p>}
          </div>

          <div>
            <Label htmlFor="majorId">Major ID</Label>
            <Input id="majorId" {...register("majorId")} />
            {errors.majorId && <p className="text-sm text-red-500">{errors.majorId.message}</p>}
          </div>

          <div>
            <Label htmlFor="enrollmentDate">Enrollment Date</Label>
            <Input id="enrollmentDate" type="date" {...register("enrollmentDate")} />
            {errors.enrollmentDate && <p className="text-sm text-red-500">{errors.enrollmentDate.message}</p>}
          </div>

          <div>
            <Label htmlFor="graduationDate">Graduation Date</Label>
            <Input id="graduationDate" type="date" {...register("graduationDate")} />
          </div>

          <div>
            <Label htmlFor="gender">Gender</Label>
            <select id="gender" {...register("gender")} className="w-full border rounded-md p-2">
              <option value="L">Laki-laki</option>
              <option value="P">Perempuan</option>
            </select>
            {errors.gender && <p className="text-sm text-red-500">{errors.gender.message}</p>}
          </div>

          <div>
            <Label htmlFor="parentPhone">Parent Phone</Label>
            <Input id="parentPhone" {...register("parentPhone")} />
          </div>

          <div>
            <Label htmlFor="avatar">Avatar</Label>
            <Input id="avatar" type="file" accept="image/*" onChange={handleFileChange} />
            {preview && <img src={preview} alt="Preview" className="mt-2 h-20 rounded-md object-cover" />}
          </div>
        </form>
        <div className="flex w-full ">
          <Button type="submit" disabled={createStudent.isPending}>
            {createStudent.isPending ? "Saving..." : "Create Student"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
