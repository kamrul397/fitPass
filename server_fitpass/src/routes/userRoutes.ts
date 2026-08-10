// src/routes/userRoutes.ts
import express from "express";
import { getProfile, getAllUsers, getAdminAnalytics } from "../controllers/userController";
import { verifyToken } from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/profile", verifyToken, getProfile);
router.get("/all", verifyToken, getAllUsers);
router.get("/analytics", verifyToken, getAdminAnalytics);

export default router;
