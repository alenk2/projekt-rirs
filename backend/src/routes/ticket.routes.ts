import { Router } from "express";
import {
  TicketStatus,
  Priority,
} from "../generated/prisma/client.js";
import type { Prisma } from "../generated/prisma/client.js";

import { prisma } from "../db.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

const levels = ["LOW", "MEDIUM", "HIGH"] as const;

const statuses = Object.values(TicketStatus);
const priorities = Object.values(Priority);

function isTicketStatus(value: unknown): value is TicketStatus {
  return (
    typeof value === "string" &&
    statuses.some((status) => status === value)
  );
}

function isPriority(value: unknown): value is Priority {
  return (
    typeof value === "string" &&
    priorities.some((priority) => priority === value)
  );
}

// POST /api/tickets - Ustvarjanje novega zahtevka
router.post("/", requireAuth, async (req, res) => {
  try {
    const user = res.locals.user;

    // Samo zaposleni lahko ustvarjajo zahtevke.
    if (user.role !== "EMPLOYEE") {
      res.status(403).json({
        message: "Only employees can create tickets",
      });
      return;
    }

    const { title, description, categoryId, impact, urgency } =
      req.body ?? {};

    // Preverjanje obveznih polj
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

    // Preverjanje obstoja kategorije
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      res.status(400).json({
        message: "Category does not exist",
      });
      return;
    }

    // Ustvarjanje zahtevka
    const ticket = await prisma.ticket.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        categoryId,
        createdBy: user.id,
        impact,
        urgency,
        priority: "MEDIUM", // Začasno do implementacije US-02
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

// GET /api/tickets - Pregled in filtriranje zahtevkov
router.get("/", requireAuth, async (req, res) => {
  try {
    const user = res.locals.user;

    const status = req.query.status;
    const priority = req.query.priority;

    // Preverjanje veljavnosti filtrov
    if (
      (status !== undefined && !isTicketStatus(status)) ||
      (priority !== undefined && !isPriority(priority))
    ) {
      res.status(400).json({
        message: "Invalid filters",
      });
      return;
    }

    const where: Prisma.TicketWhereInput = {};

    // Omejitev dostopa glede na uporabniško vlogo
    if (user.role === "EMPLOYEE") {
      where.createdBy = user.id;
    } else if (user.role === "TECHNICIAN") {
      where.assignedTo = user.id;
    } else if (user.role !== "ADMIN") {
      res.status(403).json({
        message: "Access denied",
      });
      return;
    }

    // Filtriranje po statusu in prioriteti
    if (isTicketStatus(status)) {
      where.status = status;
    }

    if (isPriority(priority)) {
      where.priority = priority;
    }

    const tickets = await prisma.ticket.findMany({
      where,
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        creator: {
          select: {
            id: true,
            fullName: true,
          },
        },
        assignee: {
          select: {
            id: true,
            fullName: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(tickets);
  } catch (error) {
    console.error("Ticket fetch error:", error);

    res.status(500).json({
      message: "Failed to fetch tickets",
    });
  }
});

export default router;
