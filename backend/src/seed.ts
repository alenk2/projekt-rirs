import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "./db.js";
import type { UserRole } from "./generated/prisma/client.js";

type SeedUser = {
  fullName: string;
  email: string;
  password: string;
  role: UserRole;
};

async function main() {
  const password = process.env.SEED_USER_PASSWORD;

  if (!password || password.length < 12) {
    throw new Error("SEED_USER_PASSWORD must be at least 12 characters");
  }

  const users: SeedUser[] = [
    {
      fullName: "Test Employee",
      email: "employee@fixdesk.local",
      password,
      role: "EMPLOYEE",
    },
    {
      fullName: "Test Technician",
      email: "technician@fixdesk.local",
      password,
      role: "TECHNICIAN",
    },
    {
      fullName: "Test Administrator",
      email: "admin@fixdesk.local",
      password,
      role: "ADMIN",
    },
  ];

  for (const user of users) {
    const passwordHash = await bcrypt.hash(user.password, 12);

    await prisma.user.upsert({
      where: { email: user.email },
      update: {
        fullName: user.fullName,
        role: user.role,
        isActive: true,
        passwordHash,
      },
      create: {
        fullName: user.fullName,
        email: user.email,
        passwordHash,
        role: user.role,
        isActive: true,
      },
    });

    console.log(`User ready: ${user.email} (${user.role})`);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
