import express, { Router } from "express";
import {
  createComplaint,
  getAllComplaints,
  getComplaintById,
  updateComplaint,
  deleteComplaint,
  getMyComplaints,
} from "../controllers/complaints";
import { authMiddleware, authorizeRoles } from "../middlewares/auth";

const router: Router = express.Router();

router.post("/", authMiddleware, createComplaint);

router.get("/my", authMiddleware, getMyComplaints);

router.get(
  "/",
  authMiddleware,
  authorizeRoles("admin", "officer"),
  getAllComplaints
);

router.get("/:id", authMiddleware, getComplaintById);

router.put(
  "/:id",
  authMiddleware,
  authorizeRoles("admin", "officer"),
  updateComplaint
);

router.delete("/:id", authMiddleware, deleteComplaint);

export default router;

