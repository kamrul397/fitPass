// src/app/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { DashboardSkeleton } from "@/components/SkeletonLoaders";
import { User } from "@/types";
import { ShieldCheck, QrCode, Calendar, Wallet, Dumbbell, ArrowRight, Receipt, CheckCircle2 } from "lucide-react";

interface Subscription {
    plan: string;
    amount: number;
    status: string;
    startDate: string;
    expiryDate: string;
}

interface Payment {
    _id: string;
    plan: string;
    amount: number;
    currency: string;
    status: string;
    createdAt: string;
}

export default function Dashboard() {
    const [user, setUser] = useState<User | null>(null);
    const [subscription, setSubscription] = useState<Subscription | null>(null);
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loadingUser, setLoadingUser] = useState(true);
    const [loadingSub, setLoadingSub] = useState(true);
    const [loadingPayments, setLoadingPayments] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/profile`, {
                    credentials: "include",
                });
                if (!res.ok) {
                    window.location.href = "/login";
                    return;
                }
                const data = await res.json();
                setUser(data);
            } catch {
                window.location.href = "/login";
            } finally {
                setLoadingUser(false);
            }
        };

        const fetchSubscription = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payments/my-subscription`, {
                    credentials: "include",
                });
                if (res.ok) {
                    setSubscription(await res.json());
                }
            } catch {
                // No active subscription
            } finally {
                setLoadingSub(false);
            }
        };

        const fetchPayments = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payments/history`, {
                    credentials: "include",
                });
                if (res.ok) {
                    setPayments(await res.json());
                }
            } catch {
                // No payments yet
            } finally {
                setLoadingPayments(false);
            }
        };

        fetchProfile();
        fetchSubscription();
        fetchPayments();
    }, []);

    const loading = loadingUser || loadingSub || loadingPayments;

    const formatDate = (iso: string) =>
        new Date(iso).toLocaleDateString("en-US", {
            year: "numeric", month: "short", day: "numeric",
        });

    const daysLeft = subscription
        ? Math.max(0, Math.ceil((new Date(subscription.expiryDate).getTime() - Date.now()) / 86400000))
        : 0;

    const planBadgeColors: Record<string, string> = {
        Basic: "bg-blue-500/10 text-blue-400 border-blue-500/20",
        Premium: "bg-violet-500/10 text-violet-400 border-violet-500/20",
        Elite: "bg-amber-500/10 text-amber-300 border-amber-500/20",
    };

    return (
        <main className="py-12 px-6 max-w-5xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Member Dashboard</h1>
                    <p className="text-slate-400 text-xs sm:text-sm mt-1">Manage your active gym pass, credit balance, and invoices</p>
                </div>
                <Link
                    href="/pricing"
                    className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-violet-500/20"
                >
                    <span>Upgrade / Change Plan</span>
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </div>

            {loading ? (
                <DashboardSkeleton />
            ) : (
                <>
                    {/* ── PROFILE CARD ── */}
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-slate-900/80 border border-slate-800 backdrop-blur-xl rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 shadow-xl"
                    >
                        {user?.photoURL ? (
                            <img
                                src={user.photoURL}
                                alt={user.name}
                                className="w-20 h-20 rounded-full border-4 border-violet-500/80 object-cover shrink-0 shadow-lg shadow-violet-500/20"
                            />
                        ) : (
                            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center text-white font-black text-3xl shrink-0 shadow-lg shadow-violet-500/20">
                                {user?.name?.charAt(0).toUpperCase()}
                            </div>
                        )}

                        <div className="text-center sm:text-left flex-1">
                            <h2 className="text-2xl font-black text-white">{user?.name}</h2>
                            <p className="text-slate-400 text-sm">{user?.email}</p>

                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-3">
                                <span className="bg-violet-500/10 text-violet-400 border border-violet-500/20 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider">
                                    {user?.role || "Member"}
                                </span>

                                {user?.creditBalance && user.creditBalance > 0 ? (
                                    <span className="bg-amber-500/10 text-amber-300 border border-amber-500/20 px-3.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm">
                                        <Wallet className="w-3.5 h-3.5 text-amber-400" />
                                        Credit Balance: ${user.creditBalance.toFixed(2)}
                                    </span>
                                ) : null}
                            </div>
                        </div>
                    </motion.div>

                    {/* ── QUICK STATS GRID ── */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl">
                            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1 flex items-center gap-1.5">
                                <Dumbbell className="w-3.5 h-3.5 text-violet-400" /> Active Plan
                            </p>
                            <p className="text-2xl font-black text-white">{subscription?.plan || "No Plan"}</p>
                        </div>

                        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl">
                            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1 flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5 text-emerald-400" /> Days Left
                            </p>
                            <p className="text-2xl font-black text-white">{subscription ? `${daysLeft} Days` : "0"}</p>
                        </div>

                        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl">
                            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1 flex items-center gap-1.5">
                                <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" /> Pass Status
                            </p>
                            <p className="text-2xl font-black text-emerald-400">{subscription ? "Active" : "Inactive"}</p>
                        </div>

                        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl">
                            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1 flex items-center gap-1.5">
                                <Wallet className="w-3.5 h-3.5 text-amber-400" /> Total Invoices
                            </p>
                            <p className="text-2xl font-black text-white">{payments.length}</p>
                        </div>
                    </div>

                    {/* ── DIGITAL GYM PASS TICKET CARD ── */}
                    <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-xl">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-black text-white flex items-center gap-2">
                                <QrCode className="w-5 h-5 text-violet-400" /> Digital Gym Check-in Pass
                            </h3>
                            {subscription && (
                                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                                    <CheckCircle2 className="w-3.5 h-3.5" /> Active Pass
                                </span>
                            )}
                        </div>

                        {subscription ? (
                            <div className="space-y-6">
                                {/* Ticket Graphic Card */}
                                <div className="bg-gradient-to-r from-violet-900 via-indigo-950 to-slate-900 border border-violet-500/40 rounded-3xl p-6 text-white shadow-2xl relative overflow-hidden">
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                                        <div>
                                            <p className="text-xs uppercase tracking-widest opacity-70 mb-1">FITPASS OFFICIAL ACCESS CARD</p>
                                            <h4 className="text-3xl font-black text-white">{subscription.plan} Gym Pass</h4>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-xs opacity-60 uppercase block mb-1">Pass ID</span>
                                            <span className="font-mono text-sm bg-white/10 px-3 py-1 rounded-lg border border-white/10">#FP-{subscription.plan.toUpperCase()}-882</span>
                                        </div>
                                    </div>

                                    {/* Simulated Barcode Access Line */}
                                    <div className="bg-slate-950/80 rounded-2xl p-4 mb-6 border border-white/10 flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-1 h-10 overflow-hidden flex-1 opacity-80">
                                            {[...Array(32)].map((_, i) => (
                                                <div
                                                    key={i}
                                                    className={`h-full rounded-sm ${i % 3 === 0 ? "w-1.5 bg-white" : i % 5 === 0 ? "w-2 bg-violet-400" : "w-1 bg-white/50"}`}
                                                />
                                            ))}
                                        </div>
                                        <div className="shrink-0 bg-white p-2 rounded-xl text-slate-950">
                                            <QrCode className="w-8 h-8" />
                                        </div>
                                    </div>

                                    {/* Progress Bar & Validity */}
                                    <div>
                                        <div className="flex justify-between text-xs opacity-80 mb-2">
                                            <span>Member since: {formatDate(subscription.startDate)}</span>
                                            <span className="font-bold">{daysLeft} days remaining</span>
                                            <span>Expires: {formatDate(subscription.expiryDate)}</span>
                                        </div>
                                        <div className="w-full bg-white/10 rounded-full h-2.5 overflow-hidden">
                                            <div
                                                className="bg-gradient-to-r from-emerald-400 to-teal-400 h-full rounded-full transition-all duration-500"
                                                style={{ width: `${Math.min(100, (daysLeft / 30) * 100)}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-10 bg-slate-950/60 rounded-2xl border border-slate-800">
                                <div className="w-16 h-16 rounded-2xl bg-slate-800/80 text-slate-400 flex items-center justify-center mx-auto mb-4 text-3xl">
                                    🏋️‍♂️
                                </div>
                                <h4 className="text-lg font-bold text-white mb-2">No Active Pass Found</h4>
                                <p className="text-slate-400 text-xs max-w-sm mx-auto mb-6">
                                    Subscribe to a FitPass plan to activate your digital gym check-in QR pass and unlock 500+ gyms.
                                </p>
                                <Link
                                    href="/pricing"
                                    className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-sm font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-violet-500/25"
                                >
                                    <span>Explore Plans</span>
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* ── PAYMENT & INVOICE HISTORY TABLE ── */}
                    <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-xl">
                        <h3 className="text-xl font-black text-white mb-6 flex items-center gap-2">
                            <Receipt className="w-5 h-5 text-violet-400" /> Payment & Invoice History
                        </h3>

                        {payments.length === 0 ? (
                            <div className="text-center py-10 bg-slate-950/60 rounded-2xl border border-slate-800">
                                <Receipt className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                                <p className="text-slate-400 text-sm">No payment transactions found yet.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead>
                                        <tr className="text-slate-400 text-xs font-bold uppercase tracking-wider border-b border-slate-800">
                                            <th className="pb-3">Date</th>
                                            <th className="pb-3">Plan</th>
                                            <th className="pb-3">Amount</th>
                                            <th className="pb-3">Currency</th>
                                            <th className="pb-3">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800/80">
                                        {payments.map((p) => (
                                            <tr key={p._id} className="hover:bg-slate-800/40 transition-colors">
                                                <td className="py-4 text-slate-300 font-medium">{formatDate(p.createdAt)}</td>
                                                <td className="py-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${planBadgeColors[p.plan] || "bg-slate-800 text-slate-300 border-slate-700"}`}>
                                                        {p.plan}
                                                    </span>
                                                </td>
                                                <td className="py-4 font-black text-white">${p.amount}</td>
                                                <td className="py-4 text-slate-400 uppercase font-semibold text-xs">{p.currency}</td>
                                                <td className="py-4">
                                                    <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1">
                                                        <CheckCircle2 className="w-3 h-3" />
                                                        {p.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </>
            )}
        </main>
    );
}
