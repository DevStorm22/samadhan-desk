import express, { Express, Request, Response, NextFunction } from "express";
import { config } from "dotenv";
import cors from "cors";
import morgan from "morgan";

import connectDB from "./configs/database";
import userRoutes from "./routes/users";
import departmentRoutes from "./routes/departments";
import complaintRoutes from "./routes/complaints";
import feedbackRoutes from "./routes/feedbacks";

// Load environment variables
config();

// Initialize express
const app: Express = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json()); // parse JSON body
app.use(morgan("dev")); // logs requests

// Routes
app.use("/api/users", userRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/feedbacks", feedbackRoutes);

// Default route
app.get("/", (_req: Request, res: Response) => {
  res.send("Public Complaint Portal API Running...");
});

// Global Error Handler
app.use(
  (err: Error, _req: Request, res: Response, _next: NextFunction): void => {
    console.error("ERROR:", err);
    res.status(500).json({
      message: "Internal Server Error",
      error: process.env.NODE_ENV === "production" ? undefined : err.message,
    });
  }
);

// Start server
const PORT: number = parseInt(process.env.PORT || "5000", 10);
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

