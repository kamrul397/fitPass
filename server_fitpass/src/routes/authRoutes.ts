// src/routes/authRoutes.ts
import express from "express";
import { createJWT, logout } from "../controllers/authController";

const router = express.Router();

// POST /api/auth/jwt
router.post("/jwt", createJWT);

// POST /api/auth/logout
router.post("/logout", logout);

export default router;
