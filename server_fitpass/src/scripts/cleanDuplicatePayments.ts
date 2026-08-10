// Script to clean existing duplicate payment entries from MongoDB
// Run with: npx tsx src/scripts/cleanDuplicatePayments.ts
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

async function cleanDuplicates() {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log("✅ Connected to MongoDB");

    const db = mongoose.connection.db!;
    const collection = db.collection("payments");

    const allPayments = await collection.find({}).sort({ createdAt: 1 }).toArray();
    console.log(`Found ${allPayments.length} total payment records.`);

    const seenSessions = new Set<string>();
    const duplicateIds: mongoose.Types.ObjectId[] = [];

    for (const payment of allPayments) {
        const sessionKey = payment.checkoutSessionId || payment.paymentIntentId;
        if (!sessionKey) continue;

        if (seenSessions.has(sessionKey)) {
            duplicateIds.push(payment._id as mongoose.Types.ObjectId);
        } else {
            seenSessions.add(sessionKey);
        }
    }

    if (duplicateIds.length > 0) {
        console.log(`🧹 Removing ${duplicateIds.length} duplicate payment records...`);
        const result = await collection.deleteMany({ _id: { $in: duplicateIds } });
        console.log(`✅ Successfully deleted ${result.deletedCount} duplicate payment records.`);
    } else {
        console.log("✨ No duplicate payment records found in database!");
    }

    await mongoose.disconnect();
    console.log("✅ Done.");
}

cleanDuplicates().catch(console.error);
