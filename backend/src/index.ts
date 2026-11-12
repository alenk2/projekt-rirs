import "dotenv/config";
import express from "express";
import cors from "cors";
import { prisma } from "./db.js";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import ticketRoutes from "./routes/ticket.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import { requireAuth, requireRole,} from "./middleware/auth.middleware.js";

const app = express();
const PORT = 3000;

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/categories", categoryRoutes);

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    message: "FixDesk API is running",
  });
});

app.get("/api/db-health", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    res.json({
      status: "ok",
      message: "Database connection successful",
    });
  } catch (error) {
    console.error("Database connection failed:", error);

    res.status(503).json({
      status: "error",
      message: "Database connection failed",
    });
  }
});

app.get(
  "/api/test/admin",
  requireAuth,
  requireRole("ADMIN"),
  (_req, res) => {
    res.json({ message: "Admin access granted" });
  }
);

app.get(
  "/api/test/technician",
  requireAuth,
  requireRole("TECHNICIAN", "ADMIN"),
  (_req, res) => {
    res.json({ message: "Technician access granted" });
  }
);


app.listen(PORT, () => {
  console.log(`FixDesk API running on http://localhost:${PORT}`);
});
