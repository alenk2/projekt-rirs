import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "./db.js";

async function main() {
  const email = process.env.SEED_USER_EMAIL;
  const password = process.env.SEED_USER_PASSWORD;

  if (!email || !password || password.length < 12) {
    throw new Error("Invalid seed user configuration");
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      fullName: "Test Employee",
      email,
      passwordHash,
      role: "EMPLOYEE",
      isActive: true,
    },
  });

  console.log("Test user ready:", user.email);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
