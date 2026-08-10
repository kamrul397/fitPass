// src/seed.ts
import mongoose from "mongoose";
import dotenv from "dotenv";
import Plan from "./models/Plans"; // Notice: matches your file name Plans.ts

dotenv.config();

const plans = [
    {
        name: "Basic",
        price: 9.99,
        features: ["Gym Access", "Locker", "Basic Equipment"],
        isPopular: false,
    },
    {
        name: "Premium",
        price: 19.99,
        features: ["Everything in Basic", "Group Classes", "Personal Trainer (Weekly)"],
        isPopular: true,
    },
    {
        name: "Elite",
        price: 39.99,
        features: ["Everything in Premium", "Unlimited Trainer", "VIP Lounge", "Nutrition Consultation"],
        isPopular: false,
    },
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI as string);
        console.log("Connected to MongoDB for seeding...");

        await Plan.deleteMany(); // Clear old data
        await Plan.insertMany(plans); // Insert new data

        console.log("✅ Plans seeded successfully!");
        process.exit();
    } catch (error) {
        console.error("❌ Error seeding database:", error);
        process.exit(1);
    }
};

seedDB();
