// src/models/Payment.ts
import mongoose, { Document, Schema } from "mongoose";

export interface IPayment extends Document {
    userId: mongoose.Types.ObjectId;
    paymentIntentId: string;
    checkoutSessionId: string;
    plan: string;
    amount: number;
    currency: string;
    status: string;
}

const PaymentSchema = new Schema<IPayment>(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        paymentIntentId: { type: String, required: true },
        checkoutSessionId: { type: String, required: true, unique: true },
        plan: { type: String, required: true },
        amount: { type: Number, required: true },
        currency: { type: String, default: "usd" },
        status: { type: String, required: true },
    },
    { timestamps: true }
);

export default mongoose.model<IPayment>("Payment", PaymentSchema);
