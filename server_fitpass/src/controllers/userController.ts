// src/controllers/userController.ts
import { Response } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import User from "../models/User";
import Subscription from "../models/Subscription";
import Payment from "../models/Payment";

export const getProfile = async (req: AuthRequest, res: Response) => {
    try {
        const user = await User.findById(req.user?.userId);

        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

export const getAllUsers = async (req: AuthRequest, res: Response) => {
    try {
        const users = await User.find().sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch users" });
    }
};

export const getAdminAnalytics = async (req: AuthRequest, res: Response) => {
    try {
        const totalUsers = await User.countDocuments();
        const activeSubscribers = await Subscription.countDocuments({ status: "active" });

        const payments = await Payment.find({ status: "paid" });
        const totalRevenue = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

        res.json({
            totalUsers,
            activeSubscribers,
            totalRevenue,
            totalPayments: payments.length,
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch analytics" });
    }
};
