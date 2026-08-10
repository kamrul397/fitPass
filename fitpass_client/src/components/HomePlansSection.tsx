// src/components/HomePlansSection.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import PlanCard from "@/components/PlanCard";
import { HomePlansSkeleton } from "@/components/SkeletonLoaders";
import { Plan } from "@/types";
import { Sparkles, ArrowRight, ShieldCheck } from "lucide-react";

interface Subscription {
    plan: string;
    amount: number;
    status: string;
    startDate: string;
    expiryDate: string;
}

interface HomePlansSectionProps {
    plans: Plan[];
}

export default function HomePlansSection({ plans }: HomePlansSectionProps) {
    const [subscription, setSubscription] = useState<Subscription | null>(null);
    const [loadingSub, setLoadingSub] = useState(true);

    useEffect(() => {
        const fetchSubscription = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payments/my-subscription`, {
                    credentials: "include",
                });
                if (res.ok) {
                    const data = await res.json();
                    setSubscription(data);
                }
            } catch {
                // Not logged in or no active subscription
            } finally {
                setLoadingSub(false);
            }
        };

        fetchSubscription();
    }, []);

    const daysLeft = subscription
        ? Math.max(0, Math.ceil((new Date(subscription.expiryDate).getTime() - Date.now()) / 86400000))
        : 0;

    return (
        <div id="plans" className="max-w-6xl mx-auto px-4">
            {/* Active Subscription Banner */}
            {subscription && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-14 bg-gradient-to-r from-violet-950/80 via-indigo-950/60 to-[#0f172a] border border-white/10 rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl backdrop-blur-xl relative overflow-hidden"
                >
                    <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-violet-600/20 rounded-full blur-3xl" />

                    <div className="flex items-center gap-5 text-left z-10">
                        <div className="w-14 h-14 rounded-2xl bg-violet-500/20 border border-violet-500/30 text-violet-300 flex items-center justify-center text-2xl shrink-0">
                            <Sparkles className="w-7 h-7 text-violet-400" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1.5">
                                <span className="text-xs font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full flex items-center gap-1">
                                    <ShieldCheck className="w-3.5 h-3.5" />
                                    Active Member
                                </span>
                                <span className="text-xs font-medium text-slate-400">
                                    • {daysLeft} days remaining
                                </span>
                            </div>
                            <h2 className="text-2xl font-black">
                                Subscribed to <span className="text-violet-300">{subscription.plan} Plan</span>
                            </h2>
                            <p className="text-xs text-slate-400 mt-1">
                                Valid until {new Date(subscription.expiryDate).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                            </p>
                        </div>
                    </div>

                    <Link
                        href="/dashboard"
                        className="shrink-0 w-full sm:w-auto text-center bg-violet-600 hover:bg-violet-500 text-white font-bold px-8 py-4 rounded-2xl transition-all shadow-lg shadow-violet-500/25 flex items-center justify-center gap-2 z-10"
                    >
                        <span>Open Dashboard</span>
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </motion.div>
            )}

            {/* Plans Grid */}
            {loadingSub ? (
                <HomePlansSkeleton />
            ) : plans.length === 0 ? (
                <p className="text-center text-slate-400 py-12">No subscription plans available right now.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
                    {plans.map((plan) => (
                        <PlanCard
                            key={plan._id}
                            plan={plan}
                            currentPlanName={subscription?.plan}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
