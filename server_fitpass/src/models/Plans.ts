// src/models/Plan.ts
import mongoose, { Document, Schema } from "mongoose";

// 1. Define the TypeScript Interface
export interface IPlan extends Document {
    name: string;
    price: number;
    features: string[];
    isPopular: boolean;
}

// 2. Define the Mongoose Schema
const PlanSchema = new Schema<IPlan>(
    {
        name: {
            type: String,
            required: true,
            enum: ["Basic", "Premium", "Elite"] // Only these names allowed!
        },
        price: {
            type: Number,
            required: true
        },
        features: {
            type: [String],
            required: true
        },
        isPopular: {
            type: Boolean,
            default: false
        },
    },
    { timestamps: true }
);

// 3. Export the Model
export default mongoose.model<IPlan>("Plan", PlanSchema);
