import { Response } from "express";
import Complaint from "../models/complaint";
import { AuthRequest } from "../middlewares/auth";

// CREATE COMPLAINT (Citizen)
export const createComplaint = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { complaintType, description, location, department } = req.body;

    if (!req.user) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    const complaint = await Complaint.create({
      user: req.user._id,
      complaintType,
      description,
      location,
      department: department || null,
      status: "Pending",
      submissionDate: new Date(),
    });

    res.status(201).json({
      message: "Complaint submitted successfully",
      complaint,
    });
  } catch (error) {
    console.error("Create Complaint Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET ALL COMPLAINTS (Admin / Officer)
export const getAllComplaints = async (
  _req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const complaints = await Complaint.find()
      .populate("user", "name email phone")
      .populate("department", "deptName");

    res.json(complaints);
  } catch (error) {
    console.error("Get Complaints Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET COMPLAINT BY ID
export const getComplaintById = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate("user", "name email phone")
      .populate("department", "deptName deptHead");

    if (!complaint) {
      res.status(404).json({ message: "Complaint not found" });
      return;
    }

    res.json(complaint);
  } catch (error) {
    console.error("Get Complaint Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE COMPLAINT (Admin / Officer / Owner)
export const updateComplaint = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const updatedComplaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedComplaint) {
      res.status(404).json({ message: "Complaint not found" });
      return;
    }

    res.json({
      message: "Complaint updated successfully",
      updatedComplaint,
    });
  } catch (error) {
    console.error("Update Complaint Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE COMPLAINT (Admin or Owner)
export const deleteComplaint = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const deletedComplaint = await Complaint.findByIdAndDelete(req.params.id);

    if (!deletedComplaint) {
      res.status(404).json({ message: "Complaint not found" });
      return;
    }

    res.json({ message: "Complaint deleted successfully" });
  } catch (error) {
    console.error("Delete Complaint Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET COMPLAINTS OF LOGGED-IN USER
export const getMyComplaints = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    const complaints = await Complaint.find({ user: req.user._id }).populate(
      "department",
      "deptName"
    );

    res.json(complaints);
  } catch (error) {
    console.error("My Complaints Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

