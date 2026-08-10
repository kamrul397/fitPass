"use client";
// src/app/payment/success/page.tsx

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2, Sparkles, ArrowRight, ShieldCheck, QrCode } from "lucide-react";

interface Subscription {
    _id?: string;
    plan: string;
    amount: number;
    status: string;
    startDate: string;
    expiryDate: string;
    stripeSessionId?: string;
}

function PaymentSuccessContent() {
    const searchParams = useSearchParams();
    const sessionId = searchParams.get("session_id");

    const [subscription, setSubscription] = useState<Subscription | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const confirmAndFetch = async () => {
            setLoading(true);
            try {
                if (sessionId) {
                    const confirmRes = await fetch(
                        `${process.env.NEXT_PUBLIC_API_URL}/api/payments/confirm-session`,
                        {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ sessionId }),
                            credentials: "include",
                        }
                    );

                    if (confirmRes.ok) {
                        const data = await confirmRes.json();
                        setSubscription(data);
                        setLoading(false);
                        return;
                    }
                }

                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/payments/my-subscription`,
                    { credentials: "include" }
                );

                if (res.ok) {
                    const data = await res.json();
                    setSubscription(data);
                } else {
                    setError("Subscription is being activated. Please check your dashboard.");
                }
            } catch (err: any) {
                setError(err.message || "Failed to confirm payment details.");
            } finally {
                setLoading(false);
            }
        };

        confirmAndFetch();
    }, [sessionId]);

    const formatDate = (iso?: string) => {
        if (!iso) return "N/A";
        return new Date(iso).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    return (
        <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-6 py-12 relative overflow-hidden">
            {/* Ambient Lighting */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-violet-600/15 rounded-full blur-[140px] pointer-events-none" />

            <div className="text-center max-w-lg w-full relative z-10">
                {loading ? (
                    <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-10 backdrop-blur-xl">
                        <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
                        <h1 className="text-2xl font-black text-white mb-2">
                            Confirming Your Payment…
                        </h1>
                        <p className="text-slate-400 text-sm">
                            Verifying your subscription with Stripe. Please wait a moment.
                        </p>
                    </div>
                ) : subscription ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 backdrop-blur-xl shadow-2xl"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200, damping: 15 }}
                            className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto mb-4"
                        >
                            <CheckCircle2 className="w-9 h-9" />
                        </motion.div>

                        <h1 className="text-3xl font-black text-white mb-2">
                            Payment Successful!
                        </h1>
                        <p className="text-slate-400 text-sm mb-6">
                            Welcome to FitPass! Your subscription details are confirmed below.
                        </p>

                        {/* Digital Receipt Pass Ticket Card */}
                        <div className="bg-gradient-to-br from-violet-950 via-purple-950 to-slate-900 border border-violet-500/40 rounded-2xl p-6 mb-6 text-white text-left shadow-xl relative overflow-hidden">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-widest text-violet-300 mb-1 flex items-center gap-1">
                                        <Sparkles className="w-3.5 h-3.5" /> Subscribed Plan
                                    </p>
                                    <p className="text-3xl font-black">{subscription.plan} Plan</p>
                                </div>
                                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                                    <ShieldCheck className="w-3.5 h-3.5" /> {subscription.status}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-4 mt-2">
                                <div>
                                    <p className="text-slate-400 text-xs uppercase tracking-wide">Amount Paid</p>
                                    <p className="font-black text-xl text-white">${subscription.amount}</p>
                                </div>
                                <div>
                                    <p className="text-slate-400 text-xs uppercase tracking-wide">Start Date</p>
                                    <p className="font-semibold text-sm text-slate-200">{formatDate(subscription.startDate)}</p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-slate-400 text-xs uppercase tracking-wide">Valid Until</p>
                                    <p className="font-semibold text-sm text-slate-200">{formatDate(subscription.expiryDate)}</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Link
                                href="/dashboard"
                                className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-extrabold py-4 px-6 rounded-2xl transition-all shadow-lg shadow-violet-500/25 flex items-center justify-center gap-2"
                            >
                                <span>Go to Member Dashboard</span>
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                            <Link
                                href="/"
                                className="block text-sm text-slate-400 hover:text-white transition-colors py-2"
                            >
                                Back to Home
                            </Link>
                        </div>
                    </motion.div>
                ) : (
                    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 backdrop-blur-xl shadow-2xl">
                        <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4 text-3xl">
                            ✅
                        </div>
                        <h1 className="text-3xl font-black text-white mb-2">
                            Payment Received!
                        </h1>
                        <p className="text-slate-400 text-sm mb-6">
                            {error || "Your payment was processed. Your subscription will reflect on your dashboard."}
                        </p>
                        <Link
                            href="/dashboard"
                            className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-bold px-8 py-3.5 rounded-2xl transition-all shadow-lg"
                        >
                            <span>Go to Dashboard</span>
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                )}
            </div>
        </main>
    );
}

export default function PaymentSuccessPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
            </div>
        }>
            <PaymentSuccessContent />
        </Suspense>
    );
}
