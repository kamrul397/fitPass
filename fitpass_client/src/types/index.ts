// src/types/index.ts

// This describes what a Subscription Plan looks like
export interface Plan {
    _id: string;
    name: "Basic" | "Premium" | "Elite";
    price: number;
    features: string[];
    isPopular: boolean;
}

// This describes what a User looks like
export interface User {
    _id: string;
    name: string;
    email: string;
    photoURL: string;
    role: "user" | "admin";
    creditBalance?: number;
    createdAt: string;
}
