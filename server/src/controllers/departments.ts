import { Response } from "express";
import Department from "../models/department";
import { AuthRequest } from "../middlewares/auth";

// CREATE DEPARTMENT (ADMIN)
export const createDepartment = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { deptName, deptHead, description, email, phone } = req.body;

    const existing = await Department.findOne({ deptName });
    if (existing) {
      res.status(400).json({ message: "Department already exists" });
      return;
    }

    const department = await Department.create({
      deptName,
      deptHead,
      description,
      email,
      phone,
    });

    res.status(201).json({
      message: "Department created successfully",
      department,
    });
  } catch (error) {
    console.error("Create Department Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET ALL DEPARTMENTS
export const getAllDepartments = async (
  _req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const departments = await Department.find();
    res.json(departments);
  } catch (error) {
    console.error("Get Departments Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET SINGLE DEPARTMENT BY ID
export const getDepartmentById = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) {
      res.status(404).json({ message: "Department not found" });
      return;
    }
    res.json(department);
  } catch (error) {
    console.error("Get Department Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE DEPARTMENT (ADMIN)
export const updateDepartment = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const updatedDepartment = await Department.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedDepartment) {
      res.status(404).json({ message: "Department not found" });
      return;
    }

    res.json({
      message: "Department updated successfully",
      updatedDepartment,
    });
  } catch (error) {
    console.error("Update Department Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE DEPARTMENT (ADMIN)
export const deleteDepartment = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const deletedDepartment = await Department.findByIdAndDelete(req.params.id);

    if (!deletedDepartment) {
      res.status(404).json({ message: "Department not found" });
      return;
    }

    res.json({ message: "Department deleted successfully" });
  } catch (error) {
    console.error("Delete Department Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

