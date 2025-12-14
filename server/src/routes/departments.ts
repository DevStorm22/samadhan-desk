import express, { Router } from "express";
import {
  createDepartment,
  getAllDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
} from "../controllers/departments";
import { authMiddleware, authorizeRoles } from "../middlewares/auth";

const router: Router = express.Router();

router.get("/", getAllDepartments);
router.get("/:id", getDepartmentById);

router.post("/", authMiddleware, authorizeRoles("admin"), createDepartment);

router.put("/:id", authMiddleware, authorizeRoles("admin"), updateDepartment);

router.delete(
  "/:id",
  authMiddleware,
  authorizeRoles("admin"),
  deleteDepartment
);

export default router;

