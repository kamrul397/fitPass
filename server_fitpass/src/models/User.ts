// src/models/User.ts
import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
    name: string;
    email: string;
    photoURL: string;
    role: "user" | "admin";
    creditBalance: number;
}

const UserSchema = new Schema<IUser>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        photoURL: { type: String },
        role: { type: String, enum: ["user", "admin"], default: "user" },
        creditBalance: { type: Number, default: 0 },
    },
    { timestamps: true }
);

export default mongoose.model<IUser>("User", UserSchema);
