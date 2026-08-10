// src/routes/planRoutes.ts
import express from "express";
import { getPlans } from "../controllers/planController";

const router = express.Router();

// GET /api/plans
router.get("/", getPlans);

export default router;
