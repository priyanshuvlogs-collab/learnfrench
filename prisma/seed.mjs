// Seeds the admin account. Idempotent — safe to run repeatedly.
// Credentials configurable via ADMIN_EMAIL / ADMIN_PASSWORD env vars.
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const email = process.env.ADMIN_EMAIL ?? "admin@lumen.local";
const password = process.env.ADMIN_PASSWORD ?? "admin1234";

const passwordHash = bcrypt.hashSync(password, 10);

await prisma.user.upsert({
  where: { email },
  update: { role: "ADMIN", plan: "PREMIUM", active: true },
  create: {
    email,
    name: "Admin",
    passwordHash,
    role: "ADMIN",
    plan: "PREMIUM",
    active: true,
  },
});

console.log(`Admin ready: ${email}`);
await prisma.$disconnect();
