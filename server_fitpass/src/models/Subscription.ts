// src/models/Subscription.ts
import mongoose, { Document, Schema } from "mongoose";

export interface ISubscription extends Document {
    userId: mongoose.Types.ObjectId;
    plan: "Basic" | "Premium" | "Elite";
    amount: number;
    status: "active" | "expired" | "cancelled";
    startDate: Date;
    expiryDate: Date;
    stripeSessionId: string;
}

const SubscriptionSchema = new Schema<ISubscription>(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        plan: { type: String, enum: ["Basic", "Premium", "Elite"], required: true },
        amount: { type: Number, required: true },
        status: { type: String, enum: ["active", "expired", "cancelled"], default: "active" },
        startDate: { type: Date, default: Date.now },
        expiryDate: { type: Date, required: true },
        stripeSessionId: { type: String, required: true, unique: true },
    },
    { timestamps: true }
);

export default mongoose.model<ISubscription>("Subscription", SubscriptionSchema);
