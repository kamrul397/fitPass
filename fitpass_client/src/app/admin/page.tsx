// src/app/admin/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/types";
import { useAuthUser } from "@/hooks/useAuthUser";
import { ShieldCheck, Users, DollarSign, Receipt, ArrowRight, UserCheck, CheckCircle2, Lock } from "lucide-react";
import Link from "next/link";

interface AnalyticsData {
    totalUsers: number;
    activeSubscribers: number;
    totalRevenue: number;
    totalPayments: number;
}

interface PaymentRecord {
    _id: string;
    userId: string | { _id: string; name?: string; email?: string };
    plan: string;
    amount: number;
    currency: string;
    status: string;
    checkoutSessionId: string;
    createdAt: string;
}

export default function AdminDashboard() {
    const router = useRouter();
    const { user: authUser, loading: authLoading } = useAuthUser();
    const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [payments, setPayments] = useState<PaymentRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!authLoading && !authUser) {
            router.replace("/login");
            return;
        }
    }, [authUser, authLoading, router]);

    useEffect(() => {
        const fetchAdminData = async () => {
            setLoading(true);
            try {
                // Verify admin profile first
                const profileRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/profile`, { credentials: "include" });
                if (!profileRes.ok) {
                    router.replace("/login");
                    return;
                }
                const profile = await profileRes.json();
                if (profile.role !== "admin") {
                    router.replace("/dashboard");
                    return;
                }

                const [analyticsRes, usersRes, paymentsRes] = await Promise.all([
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/analytics`, { credentials: "include" }),
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/all`, { credentials: "include" }),
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payments/all`, { credentials: "include" }),
                ]);

                if (analyticsRes.ok) {
                    setAnalytics(await analyticsRes.json());
                }
                if (usersRes.ok) {
                    setUsers(await usersRes.json());
                }
                if (paymentsRes.ok) {
                    setPayments(await paymentsRes.json());
                }
            } catch (err: any) {
                setError(err.message || "Failed to load admin dashboard");
            } finally {
                setLoading(false);
            }
        };

        if (authUser) {
            fetchAdminData();
        }
    }, [authUser, router]);

    const formatDate = (iso: string) =>
        new Date(iso).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });

    const planBadgeColors: Record<string, string> = {
        Basic: "bg-blue-500/10 text-blue-400 border-blue-500/20",
        Premium: "bg-violet-500/10 text-violet-400 border-violet-500/20",
        Elite: "bg-amber-500/10 text-amber-300 border-amber-500/20",
    };

    return (
        <main className="py-12 px-6 max-w-6xl mx-auto space-y-8 w-full bg-[#080b11] text-slate-100 min-h-screen">
            {/* Admin Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-6">
                <div>
                    <div className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-300 border border-amber-500/20 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider mb-2 shadow-md">
                        <ShieldCheck className="w-3.5 h-3.5" /> Read-Only Admin Control Panel
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">System Overview</h1>
                    <p className="text-slate-400 text-xs sm:text-sm mt-1">Live metrics, registered user database, and platform transaction audit logs</p>
                </div>
                <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 bg-[#0f172a] hover:bg-[#1e293b] border border-white/10 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-lg"
                >
                    <span>Member Dashboard</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                </Link>
            </div>

            {loading ? (
                <div className="py-20 text-center space-y-4">
                    <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-slate-400 text-sm">Fetching platform statistics & user data...</p>
                </div>
            ) : error ? (
                <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-center text-red-400 text-sm">
                    {error}
                </div>
            ) : (
                <>
                    {/* ── 4 STATS OVERVIEW CARDS ── */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-[#0f172a]/80 border border-white/10 rounded-3xl p-5 sm:p-6 backdrop-blur-xl shadow-xl">
                            <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center mb-3">
                                <Users className="w-5 h-5" />
                            </div>
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Total Users</p>
                            <p className="text-3xl font-black text-white">{analytics?.totalUsers || users.length}</p>
                        </div>

                        <div className="bg-[#0f172a]/80 border border-white/10 rounded-3xl p-5 sm:p-6 backdrop-blur-xl shadow-xl">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
                                <UserCheck className="w-5 h-5" />
                            </div>
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Active Subscribers</p>
                            <p className="text-3xl font-black text-emerald-400">{analytics?.activeSubscribers || 0}</p>
                        </div>

                        <div className="bg-[#0f172a]/80 border border-white/10 rounded-3xl p-5 sm:p-6 backdrop-blur-xl shadow-xl">
                            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-3">
                                <DollarSign className="w-5 h-5" />
                            </div>
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Total Revenue</p>
                            <p className="text-3xl font-black text-amber-300">${analytics?.totalRevenue?.toFixed(2) || "0.00"}</p>
                        </div>

                        <div className="bg-[#0f172a]/80 border border-white/10 rounded-3xl p-5 sm:p-6 backdrop-blur-xl shadow-xl">
                            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-3">
                                <Receipt className="w-5 h-5" />
                            </div>
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Total Transactions</p>
                            <p className="text-3xl font-black text-white">{analytics?.totalPayments || payments.length}</p>
                        </div>
                    </div>

                    {/* ── PLATFORM USER DATABASE ── */}
                    <div className="bg-[#0f172a]/80 border border-white/10 rounded-3xl p-5 sm:p-8 backdrop-blur-xl shadow-xl">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                                <Users className="w-5 h-5 text-violet-400" /> Platform User Directory ({users.length})
                            </h3>
                            <span className="text-xs font-bold text-slate-400 bg-slate-800/80 px-3 py-1 rounded-full border border-white/5">Read-Only View</span>
                        </div>

                        {users.length === 0 ? (
                            <div className="text-center py-10 bg-slate-950/60 rounded-2xl border border-white/10">
                                <Users className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                                <p className="text-slate-400 text-xs">No registered users in database yet.</p>
                            </div>
                        ) : (
                            <>
                                {/* Mobile Cards View */}
                                <div className="block md:hidden space-y-3">
                                    {users.map((u) => (
                                        <div key={u._id} className="bg-slate-950/60 border border-white/10 rounded-2xl p-4 space-y-2">
                                            <div className="flex items-center justify-between gap-2">
                                                <div className="flex items-center gap-2.5">
                                                    {u.photoURL ? (
                                                        <img src={u.photoURL} alt={u.name} className="w-8 h-8 rounded-full border border-violet-500/50 object-cover shrink-0" />
                                                    ) : (
                                                        <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-white font-bold text-xs shrink-0">
                                                            {u.name?.charAt(0).toUpperCase()}
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="font-bold text-white text-sm">{u.name}</p>
                                                        <p className="text-slate-400 text-[11px] break-all">{u.email}</p>
                                                    </div>
                                                </div>
                                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                                                    u.role === "admin"
                                                        ? "bg-amber-500/10 text-amber-300 border border-amber-500/20"
                                                        : "bg-slate-800 text-slate-300 border border-slate-700"
                                                }`}>
                                                    {u.role}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between border-t border-white/5 pt-2 text-xs text-slate-400">
                                                <span>Joined: {u.createdAt ? formatDate(u.createdAt) : "N/A"}</span>
                                                <span className="font-bold text-slate-200">Credit: ${(u.creditBalance || 0).toFixed(2)}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Desktop Table View */}
                                <div className="hidden md:block overflow-x-auto">
                                    <table className="w-full text-sm text-left">
                                        <thead>
                                            <tr className="text-slate-400 text-xs font-bold uppercase tracking-wider border-b border-white/10">
                                                <th className="pb-3 pr-4 whitespace-nowrap">User</th>
                                                <th className="pb-3 px-4 whitespace-nowrap">Email</th>
                                                <th className="pb-3 px-4 whitespace-nowrap">Role</th>
                                                <th className="pb-3 px-4 whitespace-nowrap">Credit Balance</th>
                                                <th className="pb-3 pl-4 text-right whitespace-nowrap">Joined Date</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {users.map((u) => (
                                                <tr key={u._id} className="hover:bg-white/5 transition-colors">
                                                    <td className="py-4 pr-4 flex items-center gap-3 whitespace-nowrap">
                                                        {u.photoURL ? (
                                                            <img src={u.photoURL} alt={u.name} className="w-8 h-8 rounded-full border border-violet-500/50 object-cover shrink-0" />
                                                        ) : (
                                                            <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-white font-bold text-xs shrink-0">
                                                                {u.name?.charAt(0).toUpperCase()}
                                                            </div>
                                                        )}
                                                        <span className="font-bold text-white">{u.name}</span>
                                                    </td>
                                                    <td className="py-4 px-4 text-slate-300 text-xs whitespace-nowrap">{u.email}</td>
                                                    <td className="py-4 px-4 whitespace-nowrap">
                                                        <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold uppercase ${
                                                            u.role === "admin"
                                                                ? "bg-amber-500/10 text-amber-300 border border-amber-500/20"
                                                                : "bg-slate-800 text-slate-300 border border-slate-700"
                                                        }`}>
                                                            {u.role}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-4 font-semibold text-slate-200 whitespace-nowrap">
                                                        ${(u.creditBalance || 0).toFixed(2)}
                                                    </td>
                                                    <td className="py-4 pl-4 text-slate-400 text-xs text-right whitespace-nowrap">
                                                        {u.createdAt ? formatDate(u.createdAt) : "N/A"}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        )}
                    </div>

                    {/* ── PLATFORM TRANSACTIONS & PAYMENTS LOG ── */}
                    <div className="bg-[#0f172a]/80 border border-white/10 rounded-3xl p-5 sm:p-8 backdrop-blur-xl shadow-xl">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                                <Receipt className="w-5 h-5 text-cyan-400" /> Platform Transactions & Audit Log ({payments.length})
                            </h3>
                            <span className="text-xs font-bold text-slate-400 bg-slate-800/80 px-3 py-1 rounded-full border border-white/5">Stripe Verified</span>
                        </div>

                        {payments.length === 0 ? (
                            <div className="text-center py-10 bg-slate-950/60 rounded-2xl border border-white/10">
                                <Receipt className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                                <p className="text-slate-400 text-xs">No platform payments recorded yet.</p>
                            </div>
                        ) : (
                            <>
                                {/* Mobile Cards View */}
                                <div className="block md:hidden space-y-3">
                                    {payments.map((p) => (
                                        <div key={p._id} className="bg-slate-950/60 border border-white/10 rounded-2xl p-4 space-y-2">
                                            <div className="flex items-center justify-between gap-2">
                                                <span className="text-slate-300 text-xs font-medium">{formatDate(p.createdAt)}</span>
                                                <span className={`px-3 py-0.5 rounded-full text-xs font-bold border ${planBadgeColors[p.plan] || "bg-slate-800 text-slate-300 border-slate-700"}`}>
                                                    {p.plan}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between border-t border-white/5 pt-2">
                                                <div>
                                                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Amount</span>
                                                    <span className="text-base font-black text-white">${p.amount} <span className="text-xs text-slate-400 font-normal">{p.currency.toUpperCase()}</span></span>
                                                </div>
                                                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full text-xs font-bold inline-flex items-center gap-1">
                                                    <CheckCircle2 className="w-3 h-3" />
                                                    {p.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Desktop Table View */}
                                <div className="hidden md:block overflow-x-auto">
                                    <table className="w-full text-sm text-left">
                                        <thead>
                                            <tr className="text-slate-400 text-xs font-bold uppercase tracking-wider border-b border-white/10">
                                                <th className="pb-3 pr-4 whitespace-nowrap">Date</th>
                                                <th className="pb-3 px-4 whitespace-nowrap">Plan</th>
                                                <th className="pb-3 px-4 whitespace-nowrap">Amount</th>
                                                <th className="pb-3 px-4 whitespace-nowrap">Currency</th>
                                                <th className="pb-3 pl-4 text-right whitespace-nowrap">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {payments.map((p) => (
                                                <tr key={p._id} className="hover:bg-white/5 transition-colors">
                                                    <td className="py-4 pr-4 text-slate-300 font-medium whitespace-nowrap">{formatDate(p.createdAt)}</td>
                                                    <td className="py-4 px-4 whitespace-nowrap">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${planBadgeColors[p.plan] || "bg-slate-800 text-slate-300 border-slate-700"}`}>
                                                            {p.plan}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-4 font-black text-white whitespace-nowrap">${p.amount}</td>
                                                    <td className="py-4 px-4 text-slate-400 uppercase font-semibold text-xs whitespace-nowrap">{p.currency}</td>
                                                    <td className="py-4 pl-4 text-right whitespace-nowrap">
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
                            </>
                        )}
                    </div>
                </>
            )}
        </main>
    );
}
