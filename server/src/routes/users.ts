import express, { Router } from "express";
import {
  register,
  login,
  getProfile,
  getAllUsers,
} from "../controllers/users";
import { authMiddleware, authorizeRoles } from "../middlewares/auth";

const router: Router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.get("/profile", authMiddleware, getProfile);

router.get("/all", authMiddleware, authorizeRoles("admin"), getAllUsers);

export default router;

