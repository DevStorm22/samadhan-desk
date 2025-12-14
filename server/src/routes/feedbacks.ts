import express, { Router } from "express";
import {
  createFeedback,
  getFeedbacksForComplaint,
} from "../controllers/feedbacks";
import { authMiddleware } from "../middlewares/auth";

const router: Router = express.Router();

router.post("/:complaintId", authMiddleware, createFeedback);

router.get("/:complaintId", authMiddleware, getFeedbacksForComplaint);

export default router;

