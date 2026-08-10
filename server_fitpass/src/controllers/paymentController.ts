// src/controllers/paymentController.ts
import { Request, Response } from "express";
import Stripe from "stripe";
import mongoose from "mongoose";
import User from "../models/User";
import Subscription from "../models/Subscription";
import Payment from "../models/Payment";

// Lazy-initialize Stripe so it only runs after dotenv has loaded
let _stripe: Stripe | null = null;
function getStripe(): Stripe {
    if (!_stripe) {
        if (!process.env.STRIPE_SECRET_KEY) {
            throw new Error("Missing STRIPE_SECRET_KEY in .env");
        }
        _stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    }
    return _stripe;
}

// ─────────────────────────────────────────────────────────────
// FUNCTION 1: Create a Stripe Checkout Session
// Called when user clicks "Subscribe"
// ─────────────────────────────────────────────────────────────
// Helper function to calculate proration details including stored user credit balance
async function calculateProration(userId: string, targetPlanName: string, targetPrice: number) {
    let accountCreditBalance = 0;

    if (userId && mongoose.Types.ObjectId.isValid(userId)) {
        const dbUser = await User.findById(userId);
        if (dbUser) {
            accountCreditBalance = dbUser.creditBalance || 0;
        }
    }

    const activeSub = await Subscription.findOne({
        userId: new mongoose.Types.ObjectId(userId),
        status: "active",
    }).sort({ createdAt: -1 });

    if (!activeSub || activeSub.plan === targetPlanName) {
        const creditApplied = Math.min(targetPrice, accountCreditBalance);
        const finalAmount = Math.max(0, Math.round((targetPrice - creditApplied) * 100) / 100);
        const newRemainingBalance = Math.round((accountCreditBalance - creditApplied) * 100) / 100;

        return {
            hasActiveSub: !!activeSub,
            currentPlan: activeSub?.plan || null,
            originalPrice: targetPrice,
            daysRemaining: 0,
            daysUsed: 0,
            planUnusedCredit: 0,
            accountCreditBalance,
            totalCredit: accountCreditBalance,
            finalAmount,
            newRemainingBalance,
        };
    }

    const now = new Date();
    const startDate = new Date(activeSub.startDate);
    const diffMs = now.getTime() - startDate.getTime();
    const daysUsed = Math.min(30, Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24))));
    const daysRemaining = Math.max(0, 30 - daysUsed);

    const dailyRate = activeSub.amount / 30;
    const planUnusedCredit = Math.round(dailyRate * daysRemaining * 100) / 100;
    const totalCredit = Math.round((accountCreditBalance + planUnusedCredit) * 100) / 100;

    const finalAmount = Math.max(0, Math.round((targetPrice - totalCredit) * 100) / 100);
    const newRemainingBalance = totalCredit > targetPrice ? Math.round((totalCredit - targetPrice) * 100) / 100 : 0;

    return {
        hasActiveSub: true,
        currentPlan: activeSub.plan,
        originalPrice: targetPrice,
        daysRemaining,
        daysUsed,
        planUnusedCredit,
        accountCreditBalance,
        totalCredit,
        finalAmount,
        newRemainingBalance,
    };
}

// Helper function to handle order fulfillment idempotently
async function fulfillOrder(session: Stripe.Checkout.Session) {
    const { planName, amount, userEmail, userId } = session.metadata || {};

    // Check if subscription or payment has already been processed for this session
    const existingSub = await Subscription.findOne({ stripeSessionId: session.id });
    const existingPayment = await Payment.findOne({ checkoutSessionId: session.id });

    if (existingSub) {
        // Ensure payment record exists once if webhook/confirm raced
        if (!existingPayment && userEmail) {
            let user = await User.findOne({ email: userEmail });
            if (user) {
                try {
                    await Payment.create({
                        userId: user._id,
                        paymentIntentId: (session.payment_intent as string) || session.id,
                        checkoutSessionId: session.id,
                        plan: planName || "Premium",
                        amount: parseFloat(amount || "0"),
                        currency: session.currency || "usd",
                        status: "paid",
                    });
                } catch (err: any) {
                    if (err.code !== 11000) {
                        console.error("[fulfillOrder] Error creating payment record:", err);
                    }
                }
            }
        }
        return existingSub;
    }

    let user;
    if (userId && mongoose.Types.ObjectId.isValid(userId)) {
        user = await User.findById(userId);
    }
    if (!user && userEmail) {
        user = await User.findOne({ email: userEmail });
    }
    if (!user) {
        throw new Error(`User not found for session ${session.id} (email=${userEmail})`);
    }

    // Cancel previous active subscriptions for this user when switching/upgrading
    await Subscription.updateMany(
        { userId: user._id, status: "active" },
        { status: "cancelled" }
    );

    // Update user's credit balance (reset applied credit)
    const proration = await calculateProration(user._id.toString(), planName || "Premium", parseFloat(amount || "0"));
    await User.findByIdAndUpdate(user._id, { creditBalance: proration.newRemainingBalance });

    // Set expiry to 30 days from now
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30);

    const validPlans = ["Basic", "Premium", "Elite"] as const;
    type PlanType = typeof validPlans[number];
    const selectedPlan: PlanType = validPlans.includes(planName as PlanType) ? (planName as PlanType) : "Premium";

    let subscription;
    try {
        subscription = await Subscription.create({
            userId: user._id,
            plan: selectedPlan,
            amount: parseFloat(amount || "0"),
            status: "active",
            startDate: new Date(),
            expiryDate,
            stripeSessionId: session.id,
        });
    } catch (err: any) {
        if (err.code === 11000) {
            subscription = await Subscription.findOne({ stripeSessionId: session.id });
        } else {
            throw err;
        }
    }

    // Create payment record idempotently
    if (!existingPayment) {
        try {
            await Payment.create({
                userId: user._id,
                paymentIntentId: (session.payment_intent as string) || session.id,
                checkoutSessionId: session.id,
                plan: planName || "Premium",
                amount: parseFloat(amount || "0"),
                currency: session.currency || "usd",
                status: "paid",
            });
        } catch (err: any) {
            if (err.code !== 11000) {
                console.error("[fulfillOrder] Error creating payment record:", err);
            }
        }
    }

    return subscription;
}

// ─────────────────────────────────────────────────────────────
// FUNCTION 1: Preview Plan Switch Proration & Credit Balance
// ─────────────────────────────────────────────────────────────
export const previewSwitch = async (req: Request, res: Response) => {
    try {
        const { planName, amount } = req.body;
        const userId = (req as any).user.userId;

        const proration = await calculateProration(userId, planName, amount);
        res.json(proration);
    } catch (error) {
        console.error("[previewSwitch] Error:", error);
        res.status(500).json({ message: "Failed to calculate plan switch preview" });
    }
};

// ─────────────────────────────────────────────────────────────
// FUNCTION 2: Create a Stripe Checkout Session with Proration & Credit Balance
// ─────────────────────────────────────────────────────────────
export const createCheckoutSession = async (req: Request, res: Response) => {
    try {
        const { planName, amount } = req.body;
        const userEmail = (req as any).user.email;
        const userId = (req as any).user.userId;

        // Calculate proration credit & store credit
        const proration = await calculateProration(userId, planName, amount);
        const finalAmount = proration.finalAmount;

        // If total credit completely covers the new plan cost ($0 due today)
        if (finalAmount === 0) {
            await User.findByIdAndUpdate(userId, { creditBalance: proration.newRemainingBalance });
            await Subscription.updateMany(
                { userId: new mongoose.Types.ObjectId(userId), status: "active" },
                { status: "cancelled" }
            );

            const expiryDate = new Date();
            expiryDate.setDate(expiryDate.getDate() + 30);

            const validPlans = ["Basic", "Premium", "Elite"] as const;
            type PlanType = typeof validPlans[number];
            const selectedPlan: PlanType = validPlans.includes(planName as PlanType) ? (planName as PlanType) : "Premium";

            const freeSessionId = `credit_switch_${Date.now()}`;
            const subscription = await Subscription.create({
                userId: new mongoose.Types.ObjectId(userId),
                plan: selectedPlan,
                amount: 0,
                status: "active",
                startDate: new Date(),
                expiryDate,
                stripeSessionId: freeSessionId,
            });

            await Payment.create({
                userId: new mongoose.Types.ObjectId(userId),
                paymentIntentId: freeSessionId,
                checkoutSessionId: freeSessionId,
                plan: selectedPlan,
                amount: 0,
                currency: "usd",
                status: "paid",
            });

            return res.json({
                isFreeSwitch: true,
                subscription,
                newRemainingBalance: proration.newRemainingBalance,
            });
        }

        // Otherwise create Stripe checkout for final amount
        const session = await getStripe().checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            customer_email: userEmail,
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: `FitPass ${planName} Plan`,
                            description: proration.totalCredit > 0
                                ? `Includes $${proration.totalCredit.toFixed(2)} total credit applied`
                                : "30-day gym membership",
                        },
                        unit_amount: Math.round(finalAmount * 100), // Stripe uses cents!
                    },
                    quantity: 1,
                },
            ],
            success_url: `${process.env.CLIENT_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/payment/cancel`,
            metadata: {
                planName,
                amount: finalAmount.toString(),
                originalAmount: amount.toString(),
                totalCreditApplied: proration.totalCredit.toString(),
                userEmail,
                userId: userId ? userId.toString() : "",
            },
        });

        res.json({ url: session.url, finalAmount, totalCredit: proration.totalCredit });
    } catch (error) {
        console.error("[createCheckoutSession] Error:", error);
        res.status(500).json({ message: "Failed to create checkout session" });
    }
};

// ─────────────────────────────────────────────────────────────
// FUNCTION 2: Stripe Webhook
// Stripe calls this automatically after payment is confirmed
// ─────────────────────────────────────────────────────────────
export const stripeWebhook = async (req: Request, res: Response) => {
    const sig = req.headers["stripe-signature"] as string;

    let event: Stripe.Event;

    try {
        // Verify the request is actually from Stripe (not a fake)
        event = getStripe().webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (err: any) {
        console.error("[stripeWebhook] Signature verification error:", err.message);
        return res.status(400).json({ message: `Webhook Error: ${err.message}` });
    }

    if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;
        try {
            await fulfillOrder(session);
        } catch (err) {
            console.error("[stripeWebhook] Error fulfilling order:", err);
        }
    }

    res.json({ received: true });
};

// ─────────────────────────────────────────────────────────────
// FUNCTION 3: Confirm Checkout Session (Fallback for Redirect)
// Called by the frontend payment success page with session_id
// ─────────────────────────────────────────────────────────────
export const confirmSession = async (req: Request, res: Response) => {
    try {
        const { sessionId } = req.body;
        if (!sessionId) {
            return res.status(400).json({ message: "Session ID is required" });
        }

        const session = await getStripe().checkout.sessions.retrieve(sessionId);
        if (session.payment_status !== "paid") {
            return res.status(400).json({ message: "Payment status is not paid" });
        }

        const subscription = await fulfillOrder(session);
        res.json(subscription);
    } catch (error: any) {
        console.error("[confirmSession] Error:", error);
        res.status(500).json({ message: error.message || "Failed to confirm payment session" });
    }
};

// ─────────────────────────────────────────────────────────────
// FUNCTION 4: Get current user's active subscription
// Called by the frontend after payment success or on dashboard
// ─────────────────────────────────────────────────────────────
export const getMySubscription = async (req: Request, res: Response) => {
    try {
        const { userId, email } = (req as any).user;

        console.log(`[getMySubscription] Looking up subscription for userId=${userId} email=${email}`);

        const subscription = await Subscription.findOne({
            userId: new mongoose.Types.ObjectId(userId),
            status: "active",
        }).sort({ createdAt: -1 });

        if (!subscription) {
            return res.status(404).json({ message: "No active subscription found" });
        }

        res.json(subscription);
    } catch (error) {
        console.error("[getMySubscription] Error:", error);
        res.status(500).json({ message: "Failed to fetch subscription" });
    }
};

// ─────────────────────────────────────────────────────────────
// FUNCTION 5: Get current user's payment history
// Called by the dashboard to show the invoices / history table
// ─────────────────────────────────────────────────────────────
export const getPaymentHistory = async (req: Request, res: Response) => {
    try {
        const { userId } = (req as any).user;

        const payments = await Payment.find({
            userId: new mongoose.Types.ObjectId(userId),
        }).sort({ createdAt: -1 }); // newest first

        // Deduplicate payments by checkoutSessionId or paymentIntentId
        const uniquePayments = [];
        const seenSessions = new Set<string>();

        for (const payment of payments) {
            const key = payment.checkoutSessionId || payment.paymentIntentId || payment._id.toString();
            if (!seenSessions.has(key)) {
                seenSessions.add(key);
                uniquePayments.push(payment);
            }
        }

        res.json(uniquePayments);
    } catch (error) {
        console.error("[getPaymentHistory] Error:", error);
        res.status(500).json({ message: "Failed to fetch payment history" });
    }
};
