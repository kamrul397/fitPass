// One-time script to drop the stale nid_1 index from the users collection
// Run with: npx tsx src/scripts/dropNidIndex.ts
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

async function dropNidIndex() {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log("✅ Connected to MongoDB");

    const db = mongoose.connection.db!;
    const collection = db.collection("users");

    try {
        await collection.dropIndex("nid_1");
        console.log("✅ Dropped stale index: nid_1");
    } catch (err: any) {
        if (err.code === 27) {
            console.log("ℹ️  Index nid_1 does not exist, nothing to drop.");
        } else {
            throw err;
        }
    }

    await mongoose.disconnect();
    console.log("✅ Done. You can delete this script now.");
}

dropNidIndex().catch(console.error);
