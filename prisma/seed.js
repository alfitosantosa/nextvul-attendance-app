// prisma/seed.js
const { PrismaClient, Prisma } = require("@prisma/client");
const { hash } = require("bcryptjs");
const { Decimal } = require("@prisma/client/runtime/library");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...");

  // 1. Clear existing data (for development only)
  if (process.env.NODE_ENV === "development") {
    console.log("🧹 Clearing existing data...");
    const tables = ["calendarEvent", "payment", "paymentType", "violation", "violationType", "attendance", "schedule", "student", "parent", "teacher", "classes", "subject", "major", "academicYear", "userRole", "user", "role"];

    for (const table of tables) {
      try {
        await prisma[table].deleteMany();
        console.log(`✓ Cleared ${table}`);
      } catch (error) {
        console.log(`⚠️ Could not clear ${table}:`, error.message);
      }
    }
  }

  // 2. Seed Roles
  console.log("🎭 Seeding roles...");
  const roles = [
    { id: "role_admin", name: "admin", description: "System Administrator" },
    { id: "role_teacher", name: "teacher", description: "Teaching Staff" },
    { id: "role_student", name: "student", description: "Student" },
    { id: "role_parent", name: "parent", description: "Student Parent" },
  ];

  for (const role of roles) {
    await prisma.role.upsert({ where: { id: role.id }, update: {}, create: role });
    console.log(`✓ Seeded role: ${role.name}`);
  }

  // 3. Seed Academic Year
  console.log("🗕️ Seeding academic year...");
  const currentYear = new Date().getFullYear();
  const academicYear = await prisma.academicYear.upsert({
    where: { year: `${currentYear}/${currentYear + 1}` },
    update: {},
    create: {
      year: `${currentYear}/${currentYear + 1}`,
      startDate: new Date(`${currentYear}-07-15`),
      endDate: new Date(`${currentYear + 1}-06-15`),
      isActive: true,
    },
  });
  console.log(`✓ Seeded academic year: ${academicYear.year}`);

  // 4. Seed Majors
  console.log("🎓 Seeding majors...");
  const majors = [
    { code: "TKJ", name: "Teknik Komputer dan Jaringan", description: "Jurusan Teknologi Informasi" },
    { code: "MM", name: "Multimedia", description: "Jurusan Desain Digital" },
    { code: "RPL", name: "Rekayasa Perangkat Lunak", description: "Jurusan Pemrograman" },
  ];

  for (const major of majors) {
    await prisma.major.upsert({ where: { code: major.code }, update: {}, create: major });
    console.log(`✓ Seeded major: ${major.name}`);
  }

  // 5. Seed Subjects
  console.log("📚 Seeding subjects...");
  const subjects = [
    { code: "MTK", name: "Matematika", credits: 4 },
    { code: "BIN", name: "Bahasa Indonesia", credits: 3 },
    { code: "BIG", name: "Bahasa Inggris", credits: 3 },
    { code: "PKWU", name: "Prakarya", credits: 2 },
    { code: "TKJ", name: "Teknik Komputer", credits: 4, majorId: (await prisma.major.findFirst({ where: { code: "TKJ" } })).id },
    { code: "MMD", name: "Desain Multimedia", credits: 4, majorId: (await prisma.major.findFirst({ where: { code: "MM" } })).id },
  ];

  for (const subject of subjects) {
    await prisma.subject.upsert({ where: { code: subject.code }, update: {}, create: subject });
    console.log(`✓ Seeded subject: ${subject.name}`);
  }

  // 6. Seed Classes
  console.log("🏫 Seeding classes...");
  const classData = [
    { name: "X TKJ 1", grade: 10, majorCode: "TKJ", capacity: 36 },
    { name: "XI MM 1", grade: 11, majorCode: "MM", capacity: 32 },
    { name: "XII RPL 1", grade: 12, majorCode: "RPL", capacity: 30 },
  ];

  for (const cls of classData) {
    const major = await prisma.major.findFirst({ where: { code: cls.majorCode } });
    await prisma.classes.upsert({
      where: { name: cls.name },
      update: {},
      create: {
        name: cls.name,
        grade: cls.grade,
        majorId: major.id,
        academicYearId: academicYear.id,
        capacity: cls.capacity,
      },
    });
    console.log(`✓ Seeded class: ${cls.name}`);
  }

  // 7. Seed Admin User
  console.log("👨‍💼 Seeding admin user...");
  const adminUser = await prisma.user.upsert({ where: { id: "user_admin1" }, update: {}, create: { id: "user_admin1" } });
  await prisma.userRole.upsert({ where: { userId_roleId: { userId: adminUser.id, roleId: "role_admin" } }, update: {}, create: { userId: adminUser.id, roleId: "role_admin" } });
  console.log(`✓ Seeded admin user`);

  // 8. Seed Teachers
  console.log("👩‍🏫 Seeding teachers...");
  const teacherUser = await prisma.user.upsert({ where: { id: "user_teacher1" }, update: {}, create: { id: "user_teacher1" } });
  const teacher = await prisma.teacher.upsert({
    where: { userId: teacherUser.id },
    update: {},
    create: {
      userId: teacherUser.id,
      employeeId: "198703012022011001",
      nik: "1234567890123456",
      name: "Budi Santoso, S.Kom",
      birthPlace: "Jakarta",
      birthDate: new Date("1987-03-01"),
      address: "Jl. Pendidikan No. 123",
      gender: "L",
      position: "Guru Matematika",
      startDate: new Date("2022-01-01"),
    },
  });
  await prisma.userRole.upsert({ where: { userId_roleId: { userId: teacherUser.id, roleId: "role_teacher" } }, update: {}, create: { userId: teacherUser.id, roleId: "role_teacher" } });
  console.log(`✓ Seeded teacher: ${teacher.name}`);

  // 9. Seed Students & Parents
  console.log("👨‍🏫 Seeding students & parents...");
  const studentClass = await prisma.classes.findFirst({ where: { name: "X TKJ 1" } });
  const majorTKJ = await prisma.major.findFirst({ where: { code: "TKJ" } });
  const cities = ["Jakarta", "Bandung", "Surabaya"];

  for (let i = 1; i <= 15; i++) {
    const paddedId = i.toString().padStart(2, "0");
    const birthDate = new Date(2005 + (i % 3), (i % 11) + 1, (i % 27) + 1);
    const city = cities[i % cities.length];

    const studentUser = await prisma.user.upsert({
      where: { id: `user_student${paddedId}` },
      update: {},
      create: {
        id: `user_student${paddedId}`,
        username: `siswa${paddedId}`,
        email: `siswa${paddedId}@mail.com`,
        password: await hash("password123", 10),
        name: `Siswa ${paddedId}`,
        phone: `0812345678${paddedId}`,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    const student = await prisma.student.upsert({
      where: { userId: studentUser.id },
      update: {},
      create: {
        userId: studentUser.id,
        nisn: `00${paddedId}23456789`,
        nik: `12345678901234${paddedId}`,
        name: `Siswa ${paddedId}`,
        birthPlace: city,
        birthDate,
        address: `Jl. Siswa No. ${i}, ${city}`,
        classId: studentClass.id,
        academicYearId: academicYear.id,
        majorId: majorTKJ.id,
        gender: i % 2 === 0 ? "L" : "P",
        parentPhone: `0812345678${paddedId}`,
        enrollmentDate: new Date(academicYear.startDate),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    const parentUser = await prisma.user.upsert({
      where: { id: `user_parent${paddedId}` },
      update: {},
      create: {
        id: `user_parent${paddedId}`,
        username: `ortu${paddedId}`,
        email: `ortu${paddedId}@mail.com`,
        password: await hash("password123", 10),
        name: `Orang Tua Siswa ${paddedId}`,
        phone: `0812345678${paddedId}`,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    await prisma.parent.upsert({
      where: { userId: parentUser.id },
      update: {},
      create: {
        userId: parentUser.id,
        studentId: student.id,
        name: `Orang Tua Siswa ${paddedId}`,
        relation: i % 2 === 0 ? "Ayah" : "Ibu",
        phone: `0812345678${paddedId}`,
        address: `Jl. Siswa No. ${i}, ${city}`,
      },
    });

    await prisma.userRole.upsert({ where: { userId_roleId: { userId: studentUser.id, roleId: "role_student" } }, update: {}, create: { userId: studentUser.id, roleId: "role_student" } });
    await prisma.userRole.upsert({ where: { userId_roleId: { userId: parentUser.id, roleId: "role_parent" } }, update: {}, create: { userId: parentUser.id, roleId: "role_parent" } });
    console.log(`✓ Seeded student ${i}/15`);
  }

  console.log("✅ Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });