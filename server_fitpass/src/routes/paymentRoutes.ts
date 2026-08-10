// src/routes/paymentRoutes.ts
import express from "express";
import { createCheckoutSession, stripeWebhook, confirmSession, previewSwitch, getMySubscription, getPaymentHistory } from "../controllers/paymentController";
import { verifyToken } from "../middlewares/authMiddleware";

const router = express.Router();

// Protected: preview plan switch proration details
router.post("/preview-switch", verifyToken, previewSwitch);

// Protected: only logged-in users can start a checkout
router.post("/create-checkout-session", verifyToken, createCheckoutSession);

// Protected: confirm payment session after Stripe checkout redirect
router.post("/confirm-session", verifyToken, confirmSession);

// Protected: get the current user's active subscription
router.get("/my-subscription", verifyToken, getMySubscription);

// Protected: get the current user's payment history
router.get("/history", verifyToken, getPaymentHistory);

// Public: Stripe sends raw body — no JSON parsing here
router.post("/webhook", express.raw({ type: "application/json" }), stripeWebhook);

export default router;
