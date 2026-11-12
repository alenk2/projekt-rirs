import { Router } from "express";
import { prisma } from "../db.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

const levels = ["LOW", "MEDIUM", "HIGH"] as const;

router.post("/", requireAuth, async (req, res) => {
  try {
    const user = res.locals.user;

    // Samo zaposleni lahko oddajo nov zahtevek.
    if (user.role !== "EMPLOYEE") {
      res.status(403).json({
        message: "Only employees can create tickets",
      });
      return;
    }

    const { title, description, categoryId, impact, urgency } =
      req.body ?? {};

    // Preverjanje obveznih podatkov
    if (
      typeof title !== "string" ||
      !title.trim() ||
      title.trim().length > 200 ||
      typeof description !== "string" ||
      !description.trim() ||
      !Number.isSafeInteger(categoryId) ||
      categoryId <= 0 ||
      !levels.includes(impact) ||
      !levels.includes(urgency)
    ) {
      res.status(400).json({
        message: "Invalid or missing ticket data",
      });
      return;
    }

    // Preverjanje kategorije
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      res.status(400).json({
        message: "Category does not exist",
      });
      return;
    }

    // Shranjevanje zahtevka
    const ticket = await prisma.ticket.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        categoryId,
        createdBy: user.id,
        impact,
        urgency,
        priority: "MEDIUM", // Začasno, do implementacije US-02
        status: "OPEN",
      },
    });

    res.status(201).json({
      message: "Ticket created successfully",
      ticket,
    });
  } catch (error) {
    console.error("Ticket creation error:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
});

export default router;
