// src/components/PlanCard.tsx
"use client";

import { Plan } from "@/types";
import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Zap, Sparkles, ArrowRight, X, RefreshCw } from "lucide-react";

interface PlanCardProps {
    plan: Plan;
    currentPlanName?: string;
}

interface ProrationPreview {
    hasActiveSub: boolean;
    currentPlan: string | null;
    originalPrice: number;
    daysRemaining: number;
    daysUsed: number;
    planUnusedCredit: number;
    accountCreditBalance: number;
    totalCredit: number;
    finalAmount: number;
    newRemainingBalance: number;
}

export default function PlanCard({ plan, currentPlanName }: PlanCardProps) {
    const [loading, setLoading] = useState(false);
    const [previewLoading, setPreviewLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [proration, setProration] = useState<ProrationPreview | null>(null);

    const isCurrentPlan = currentPlanName === plan.name;

    const handleCardClick = async () => {
        if (currentPlanName && !isCurrentPlan) {
            setPreviewLoading(true);
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payments/preview-switch`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({ planName: plan.name, amount: plan.price }),
                });

                if (res.status === 401) {
                    window.location.href = "/login";
                    return;
                }

                if (res.ok) {
                    const data = await res.json();
                    setProration(data);
                    setShowModal(true);
                } else {
                    await startCheckout();
                }
            } catch {
                await startCheckout();
            } finally {
                setPreviewLoading(false);
            }
        } else {
            await startCheckout();
        }
    };

    const startCheckout = async () => {
        setLoading(true);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payments/create-checkout-session`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    planName: plan.name,
                    amount: plan.price,
                }),
            });

            if (res.status === 401) {
                window.location.href = "/login";
                return;
            }

            const data = await res.json();

            if (data.isFreeSwitch) {
                window.location.href = "/dashboard";
                return;
            }

            if (data.url) {
                window.location.href = data.url;
            }
        } catch (error) {
            alert("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <motion.div
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className={`relative flex flex-col rounded-3xl border p-8 shadow-2xl backdrop-blur-xl transition-all duration-300
                    ${isCurrentPlan
                        ? "border-emerald-500/80 bg-emerald-950/30 text-white ring-2 ring-emerald-500/30 shadow-emerald-500/10 scale-105 z-10"
                        : plan.isPopular
                        ? "border-violet-500/80 bg-slate-900/90 text-white shadow-violet-500/20 scale-105 z-10"
                        : "border-slate-800 bg-slate-900/60 text-slate-100 hover:border-slate-700"
                    }`}
            >
                {/* Popular / Active Badges */}
                {isCurrentPlan ? (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-black uppercase tracking-wider px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        Your Current Plan
                    </div>
                ) : plan.isPopular ? (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-black uppercase tracking-wider px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 fill-white" />
                        Most Popular
                    </div>
                ) : null}

                {/* Header info */}
                <div className="mb-6">
                    <h3 className="text-2xl font-black text-white mb-1">{plan.name}</h3>
                    <p className="text-xs text-slate-400">Full 30-day all-access gym membership</p>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-1 mb-8">
                    <span className="text-5xl font-black text-white tracking-tight">${plan.price}</span>
                    <span className="text-sm font-semibold text-slate-400">/month</span>
                </div>

                {/* Features */}
                <ul className="flex flex-col gap-3.5 mb-8 flex-1">
                    {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-3 text-sm text-slate-300">
                            <CheckCircle2 className={`w-4 h-4 shrink-0 ${isCurrentPlan ? "text-emerald-400" : "text-violet-400"}`} />
                            <span>{feature}</span>
                        </li>
                    ))}
                </ul>

                {/* Action Button */}
                {isCurrentPlan ? (
                    <Link
                        href="/dashboard"
                        className="w-full py-4 rounded-2xl font-bold text-center bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                    >
                        <span>View Active Pass</span>
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                ) : (
                    <motion.button
                        whileTap={{ scale: 0.98 }}
                        onClick={handleCardClick}
                        disabled={loading || previewLoading}
                        className={`w-full py-4 rounded-2xl font-extrabold transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg
                            ${currentPlanName
                                ? "bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 hover:border-violet-500/50"
                                : plan.isPopular
                                ? "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-violet-500/25"
                                : "bg-slate-800 hover:bg-slate-700 text-white border border-slate-700"
                            }`}
                    >
                        {loading || previewLoading ? (
                            <div className="flex items-center gap-2">
                                <RefreshCw className="w-4 h-4 animate-spin" />
                                <span>Calculating...</span>
                            </div>
                        ) : (
                            <>
                                <span>{currentPlanName ? `Switch to ${plan.name}` : `Get ${plan.name}`}</span>
                                <ArrowRight className="w-4 h-4" />
                            </>
                        )}
                    </motion.button>
                )}
            </motion.div>

            {/* Proration & Store Credit Switch Modal */}
            <AnimatePresence>
                {showModal && proration && (
                    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full text-white shadow-2xl relative"
                        >
                            <button
                                onClick={() => setShowModal(false)}
                                className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="text-center mb-6">
                                <div className="w-14 h-14 rounded-2xl bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center mx-auto mb-3">
                                    <RefreshCw className="w-7 h-7" />
                                </div>
                                <h3 className="text-2xl font-black">Switch to {plan.name}</h3>
                                <p className="text-slate-400 text-xs mt-1">
                                    Unused days from your <span className="text-violet-300 font-semibold">{proration.currentPlan}</span> plan & account credit will be automatically deducted.
                                </p>
                            </div>

                            {/* Breakdown Table */}
                            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 mb-6 space-y-3.5 text-sm">
                                <div className="flex justify-between text-slate-300">
                                    <span>{plan.name} Plan Price:</span>
                                    <span className="font-semibold">${proration.originalPrice.toFixed(2)}</span>
                                </div>

                                {proration.planUnusedCredit > 0 && (
                                    <div className="flex justify-between text-emerald-400">
                                        <span>Plan Credit ({proration.daysRemaining} days on {proration.currentPlan}):</span>
                                        <span className="font-semibold">-${proration.planUnusedCredit.toFixed(2)}</span>
                                    </div>
                                )}

                                {proration.accountCreditBalance > 0 && (
                                    <div className="flex justify-between text-emerald-400">
                                        <span>Account Credit Applied:</span>
                                        <span className="font-semibold">-${Math.min(proration.accountCreditBalance, proration.originalPrice - proration.planUnusedCredit).toFixed(2)}</span>
                                    </div>
                                )}

                                {proration.newRemainingBalance > 0 && (
                                    <div className="flex justify-between text-amber-300 bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl text-xs font-semibold">
                                        <span>💰 Saved to Account Credit:</span>
                                        <span>${proration.newRemainingBalance.toFixed(2)}</span>
                                    </div>
                                )}

                                <div className="border-t border-slate-800 pt-3 flex justify-between items-center text-base">
                                    <span className="font-bold text-white">Total Due Today:</span>
                                    <span className="text-2xl font-black text-violet-400">
                                        ${proration.finalAmount.toFixed(2)}
                                    </span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="w-1/2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-3.5 rounded-xl transition-colors text-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        setShowModal(false);
                                        startCheckout();
                                    }}
                                    disabled={loading}
                                    className="w-1/2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg text-sm"
                                >
                                    {loading
                                        ? "Processing..."
                                        : proration.finalAmount === 0
                                        ? "Confirm Free Switch →"
                                        : `Pay $${proration.finalAmount.toFixed(2)} →`}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
