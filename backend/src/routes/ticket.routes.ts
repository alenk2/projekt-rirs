import { Router } from "express";
import {
  TicketStatus,
  Priority,
} from "../generated/prisma/client.js";
import type { Prisma } from "../generated/prisma/client.js";

import { prisma } from "../db.js";
import {
  requireAuth,
  requireRole,
} from "../middleware/auth.middleware.js";

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


// PATCH /api/tickets/:id/assign
router.patch(
  "/:id/assign",
  requireAuth,
  requireRole("ADMIN"),
  async (req, res) => {
    try {
      const ticketId = Number(req.params.id);
      const { technicianId } = req.body ?? {};

      // Preverjanje ID-jev
      if (
        !Number.isSafeInteger(ticketId) ||
        ticketId <= 0 ||
        !Number.isSafeInteger(technicianId) ||
        technicianId <= 0
      ) {
        res.status(400).json({
          message: "Invalid ticket or technician ID",
        });
        return;
      }

      // Preverimo, ali zahtevek obstaja.
      const ticket = await prisma.ticket.findUnique({
        where: { id: ticketId },
      });

      if (!ticket) {
        res.status(404).json({
          message: "Ticket not found",
        });
        return;
      }

      // Zaključenih zahtevkov ne dodeljujemo.
      if (ticket.status === "CLOSED") {
        res.status(409).json({
          message: "Closed tickets cannot be assigned",
        });
        return;
      }

      // Preverimo, ali je uporabnik aktiven IT-tehnik.
      const technician = await prisma.user.findFirst({
        where: {
          id: technicianId,
          role: "TECHNICIAN",
          isActive: true,
        },
      });

      if (!technician) {
        res.status(400).json({
          message: "Invalid or inactive technician",
        });
        return;
      }

      // Dodelimo zahtevek tehniku.
      const updatedTicket = await prisma.ticket.update({
        where: { id: ticketId },
        data: {
          assignedTo: technician.id,
        },
        include: {
          assignee: {
            select: {
              id: true,
              fullName: true,
              email: true,
            },
          },
        },
      });

      res.json({
        message: "Ticket assigned successfully",
        ticket: updatedTicket,
      });
    } catch (error) {
      console.error("Ticket assignment failed:", error);

      res.status(500).json({
        message: "Failed to assign ticket",
      });
    }
  }
);


//
// PATCH /api/tickets/:id/status
// Spreminjanje statusa IT zahtevka
//

router.patch("/:id/status", requireAuth, async (req, res) => {
  try {
    const ticketId = Number(req.params.id);
    const { status, resolution } = req.body ?? {};
    const user = res.locals.user;

    // 1. Preverjanje podatkov
    if (!Number.isSafeInteger(ticketId) || ticketId <= 0) {
      res.status(400).json({ message: "Invalid ticket ID" });
      return;
    }

    if (!isTicketStatus(status)) {
      res.status(400).json({ message: "Invalid status" });
      return;
    }

    // 2. Poiščemo zahtevek
    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
    });

    if (!ticket) {
      res.status(404).json({ message: "Ticket not found" });
      return;
    }

    // 3. Preverimo dovoljene prehode
    const validTransition =
      (ticket.status === "OPEN" && status === "IN_PROGRESS") ||
      (ticket.status === "IN_PROGRESS" && status === "RESOLVED") ||
      (ticket.status === "RESOLVED" && status === "CLOSED");

    if (!validTransition) {
      res.status(409).json({
        message: "Invalid status transition",
      });
      return;
    }

    // 4. Preverimo pravice
    if (status === "IN_PROGRESS" || status === "RESOLVED") {
      // Samo dodeljeni tehnik lahko obravnava zahtevek
      if (
        user.role !== "TECHNICIAN" ||
        ticket.assignedTo !== user.id
      ) {
        res.status(403).json({
          message: "Only assigned technician can update ticket",
        });
        return;
      }
    }

    if (status === "CLOSED") {
      // Samo prijavitelj lahko zaključi zahtevek
      if (
        user.role !== "EMPLOYEE" ||
        ticket.createdBy !== user.id
      ) {
        res.status(403).json({
          message: "Only ticket creator can close ticket",
        });
        return;
      }
    }

    // 5. Pripravimo podatke za posodobitev
    const updateData: Prisma.TicketUpdateInput = {
      status,
    };

    if (status === "RESOLVED") {
      if (
        typeof resolution !== "string" ||
        !resolution.trim()
      ) {
        res.status(400).json({
          message: "Resolution description is required",
        });
        return;
      }

      updateData.resolution = resolution.trim();
      updateData.resolvedAt = new Date();
    }

    if (status === "CLOSED") {
      updateData.closedAt = new Date();
    }

    // 6. Posodobimo zahtevek v podatkovni bazi
    const updatedTicket = await prisma.ticket.update({
      where: { id: ticketId },
      data: updateData,
    });

    res.json({
      message: "Ticket status updated successfully",
      ticket: updatedTicket,
    });
  } catch (error) {
    console.error("Ticket status update failed:", error);

    res.status(500).json({
      message: "Failed to update ticket status",
    });
  }
});


export default router;
