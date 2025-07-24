// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma"; // Adjust the import path based on your project structure

async function main() {
  const hashedPassword = await bcrypt.hash("123456", 10);

  await prisma.user.create({
    data: {
      email: "admin@example.com",
      password: hashedPassword,
      username: "adminuser",
      name: "Admin User",
      phone: "08123456789",
      avatar: "https://ui-avatars.com/api/?name=Admin+User",
      isActive: true,
      emailVerified: new Date(),
      lastLogin: new Date(),
    },
  });

  console.log("✅ Seed user berhasil dibuat");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
