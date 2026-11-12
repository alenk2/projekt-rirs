import { Router } from "express";
import { prisma } from "../db.js";
import {
  requireAuth,
  requireRole,
} from "../middleware/auth.middleware.js";

const router = Router();

// GET /api/users/technicians
router.get(
  "/technicians",
  requireAuth,
  requireRole("ADMIN"),
  async (_req, res) => {
    try {
      const technicians = await prisma.user.findMany({
        where: {
          role: "TECHNICIAN",
          isActive: true,
        },
        select: {
          id: true,
          fullName: true,
          email: true,
        },
        orderBy: {
          fullName: "asc",
        },
      });

      res.json(technicians);
    } catch (error) {
      console.error("Failed to fetch technicians:", error);

      res.status(500).json({
        message: "Failed to fetch technicians",
      });
    }
  }
);

export default router;
