// src/controllers/planController.ts
import { Request, Response } from "express";
import Plan from "../models/Plans";

export const getPlans = async (req: Request, res: Response) => {
    try {
        const plans = await Plan.find(); // Fetch all plans from MongoDB
        res.status(200).json(plans);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch plans" });
    }
};
