// src/middlewares/authMiddleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// We extend the Express Request to include our custom user data
export interface AuthRequest extends Request {
    user?: { userId: string; email: string; role: string };
}

export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        // Read the token from the HTTP-only cookie
        const token = req.cookies.token;

        if (!token) {
            res.status(401).json({ message: "Unauthorized - No token found" });
            return;
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
        req.user = decoded; // Attach user payload to the request
        next(); // Move to the next function
    } catch (error) {
        res.status(401).json({ message: "Unauthorized - Invalid token" });
    }
};
