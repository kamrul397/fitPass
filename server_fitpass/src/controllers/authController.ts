// src/controllers/authController.ts
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

export const createJWT = async (req: Request, res: Response) => {
    try {
        const { email, name, photoURL } = req.body;

        if (!email) {
            res.status(400).json({ message: "Email is required" });
            return;
        }

        // 1. Check if user exists, if not, create them!
        let user = await User.findOne({ email });
        if (!user) {
            user = await User.create({ email, name, photoURL, role: "user" });
        }

        // 2. Create the JWT Token
        // In production, use a real secret from .env like process.env.JWT_SECRET
        const token = jwt.sign(
            { userId: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET!,
            { expiresIn: "7d" }
        );

        // 3. Send token in an HTTP-only Cookie
        res.cookie("token", token, {
            httpOnly: true, // Javascript cannot read it (Secure against XSS)
            secure: process.env.NODE_ENV === "production", // HTTPS only in prod
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.status(200).json({ message: "Login successful", user });
    } catch (error) {
        console.error("❌ createJWT error:", error);
        const message = error instanceof Error ? error.message : "Server Error";
        res.status(500).json({ message });
    }
};

export const logout = (_req: Request, res: Response) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    });
    res.status(200).json({ message: "Logged out successfully" });
};
