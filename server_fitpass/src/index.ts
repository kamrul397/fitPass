// src/index.ts
import dotenv from "dotenv";
dotenv.config(); // ← MUST be first, before anything reads process.env
import paymentRoutes from "./routes/paymentRoutes";


import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db";
import planRoutes from "./routes/planRoutes";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";

// Crash immediately if critical env vars are missing
if (!process.env.JWT_SECRET) throw new Error("Missing JWT_SECRET in .env");
if (!process.env.MONGO_URI) throw new Error("Missing MONGO_URI in .env");
if (!process.env.STRIPE_SECRET_KEY) throw new Error("Missing STRIPE_SECRET_KEY in .env");


const app = express();
const PORT = process.env.PORT || 5000;

import { stripeWebhook } from "./controllers/paymentController";

// Stripe Webhook MUST receive raw body — mount before express.json()
app.post("/api/payments/webhook", express.raw({ type: "application/json" }), stripeWebhook);

// Middlewares
app.use(express.json());
app.use(cookieParser());
const allowedOrigins = [
    "http://localhost:3000",
    process.env.CLIENT_URL,
    process.env.FRONTEND_URL,
].filter(Boolean) as string[];

app.use(
    cors({
        origin: allowedOrigins,
        credentials: true,
    })
);

app.use("/api/plans", planRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/payments", paymentRoutes);





// Test route
app.get("/", (req, res) => {
    res.json({ message: "FitPass Server is running! 🏋️" });
});

// Connect to Database
connectDB();

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
