import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../db.js";
import { verifyToken } from "../utils/jwt.js";

export const requireAuth: RequestHandler = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (typeof token !== "string") {
      res.status(401).json({
        message: "Authentication required",
      });
      return;
    }

    const payload = verifyToken(token);

    if (typeof payload === "string" || !payload.sub) {
      res.status(401).json({
        message: "Invalid token",
      });
      return;
    }

    const userId = Number(payload.sub);

    if (!Number.isSafeInteger(userId) || userId <= 0) {
      res.status(401).json({
        message: "Invalid token",
      });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        isActive: true,
      },
    });

    if (!user || !user.isActive) {
      res.status(401).json({
        message: "Unauthorized",
      });
      return;
    }

    res.locals.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        message: "Invalid or expired token",
      });
      return;
    }

    console.error("Authentication error:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};
