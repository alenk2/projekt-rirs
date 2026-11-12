import jwt from "jsonwebtoken";
import type { UserRole } from "../generated/prisma/client.js";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET || JWT_SECRET.length < 32) {
  throw new Error("JWT_SECRET must contain at least 32 characters");
}

export function createToken(userId: number, role: UserRole) {
  return jwt.sign(
    {
      sub: String(userId),
      role,
    },
    JWT_SECRET as string,
    { expiresIn: "2h" }
  );
}

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET as string);
}
