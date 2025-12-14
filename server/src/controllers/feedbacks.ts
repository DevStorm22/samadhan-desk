import { Response } from "express";
import Feedback from "../models/feedback";
import Complaint from "../models/complaint";
import { AuthRequest } from "../middlewares/auth";

// CREATE FEEDBACK (Only after complaint resolution)
export const createFeedback = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { rating, comment } = req.body;
    const { complaintId } = req.params;

    if (!req.user) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
      res.status(404).json({ message: "Complaint not found" });
      return;
    }

    if (complaint.status !== "Resolved" && complaint.status !== "Solved") {
      res
        .status(400)
        .json({ message: "Feedback allowed only after resolution" });
      return;
    }

    const feedback = await Feedback.create({
      complaint: complaintId,
      user: req.user._id,
      rating,
      comment,
      feedbackDate: new Date(),
    });

    res.status(201).json({
      message: "Feedback submitted successfully",
      feedback,
    });
  } catch (error) {
    console.error("Create Feedback Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET FEEDBACKS FOR A COMPLAINT
export const getFeedbacksForComplaint = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const feedbacks = await Feedback.find({
      complaint: req.params.complaintId,
    }).populate("user", "name email");

    res.json(feedbacks);
  } catch (error) {
    console.error("Get Feedbacks Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

