import { Router } from "express";
import bcrypt from "bcryptjs";
import { prisma } from "../db.js";
import { createToken } from "../utils/jwt.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body ?? {};

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password
    ) {
      res.status(400).json({
        message: "Email and password are required",
      });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { email: email.trim() },
    });

    if (!user || !user.isActive) {
      res.status(401).json({
        message: "Invalid credentials",
      });
      return;
    }

    const isValid = await bcrypt.compare(
      password,
      user.passwordHash
    );

    if (!isValid) {
      res.status(401).json({
        message: "Invalid credentials",
      });
      return;
    }

    const token = createToken(user.id, user.role);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 2 * 60 * 60 * 1000,
      path: "/",
    });

    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
});

router.post("/logout", (_req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  res.json({ message: "Logout successful" });
});


router.get("/me", requireAuth, (_req, res) => {
  const user = res.locals.user;

  res.json({
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    },
  });
});


export default router;
