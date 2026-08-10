// src/app/admin/page.tsx
"use client";

import { useEffect, useState } from "react";
import { User } from "@/types";
import { ShieldCheck, Users, DollarSign, Receipt, ArrowRight, UserCheck } from "lucide-react";
import Link from "next/link";

interface AnalyticsData {
    totalUsers: number;
    activeSubscribers: number;
    totalRevenue: number;
    totalPayments: number;
}

export default function AdminDashboard() {
    const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAdminData = async () => {
            setLoading(true);
            try {
                const [analyticsRes, usersRes] = await Promise.all([
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/analytics`, { credentials: "include" }),
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/all`, { credentials: "include" }),
                ]);

                if (analyticsRes.ok) {
                    setAnalytics(await analyticsRes.json());
                }
                if (usersRes.ok) {
                    setUsers(await usersRes.json());
                }
            } catch (err: any) {
                setError(err.message || "Failed to load admin dashboard");
            } finally {
                setLoading(false);
            }
        };

        fetchAdminData();
    }, []);

    const formatDate = (iso: string) =>
        new Date(iso).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });

    return (
        <main className="py-12 px-6 max-w-6xl mx-auto space-y-8 w-full">
            {/* Admin Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <div className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-300 border border-amber-500/20 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider mb-2">
                        <ShieldCheck className="w-3.5 h-3.5" /> Admin Control Panel
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">System Overview</h1>
                </div>
                <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all"
                >
                    <span>User Dashboard</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                </Link>
            </div>

            {loading ? (
                <div className="py-20 text-center space-y-4">
                    <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-slate-400 text-sm">Loading admin analytics & user database…</p>
                </div>
            ) : (
                <>
                    {/* ── 4 STATS CARDS ── */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl">
                            <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center mb-3">
                                <Users className="w-5 h-5" />
                            </div>
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Total Users</p>
                            <p className="text-3xl font-black text-white">{analytics?.totalUsers || users.length}</p>
                        </div>

                        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
                                <UserCheck className="w-5 h-5" />
                            </div>
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Active Subscribers</p>
                            <p className="text-3xl font-black text-emerald-400">{analytics?.activeSubscribers || 0}</p>
                        </div>

                        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl">
                            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-3">
                                <DollarSign className="w-5 h-5" />
                            </div>
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Total Revenue</p>
                            <p className="text-3xl font-black text-amber-300">${analytics?.totalRevenue?.toFixed(2) || "0.00"}</p>
                        </div>

                        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl">
                            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-3">
                                <Receipt className="w-5 h-5" />
                            </div>
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Total Payments</p>
                            <p className="text-3xl font-black text-white">{analytics?.totalPayments || 0}</p>
                        </div>
                    </div>

                    {/* ── USER MANAGEMENT TABLE ── */}
                    <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-xl">
                        <h3 className="text-xl font-black text-white mb-6 flex items-center gap-2">
                            <Users className="w-5 h-5 text-violet-400" /> Platform User Database
                        </h3>

                        {users.length === 0 ? (
                            <div className="text-center py-10 bg-slate-950/60 rounded-2xl border border-slate-800">
                                <Users className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                                <p className="text-slate-400 text-xs">No registered users in database yet.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead>
                                        <tr className="text-slate-400 text-xs font-bold uppercase tracking-wider border-b border-slate-800">
                                            <th className="pb-3">User</th>
                                            <th className="pb-3">Email</th>
                                            <th className="pb-3">Role</th>
                                            <th className="pb-3">Credit Balance</th>
                                            <th className="pb-3">Joined Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800/80">
                                        {users.map((u) => (
                                            <tr key={u._id} className="hover:bg-slate-800/40 transition-colors">
                                                <td className="py-4 flex items-center gap-3">
                                                    {u.photoURL ? (
                                                        <img src={u.photoURL} alt={u.name} className="w-8 h-8 rounded-full border border-violet-500/50 object-cover shrink-0" />
                                                    ) : (
                                                        <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-white font-bold text-xs shrink-0">
                                                            {u.name?.charAt(0).toUpperCase()}
                                                        </div>
                                                    )}
                                                    <span className="font-bold text-white">{u.name}</span>
                                                </td>
                                                <td className="py-4 text-slate-300 text-xs">{u.email}</td>
                                                <td className="py-4">
                                                    <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold uppercase ${
                                                        u.role === "admin"
                                                            ? "bg-amber-500/10 text-amber-300 border border-amber-500/20"
                                                            : "bg-slate-800 text-slate-300 border border-slate-700"
                                                    }`}>
                                                        {u.role}
                                                    </span>
                                                </td>
                                                <td className="py-4 font-semibold text-slate-200">
                                                    ${(u.creditBalance || 0).toFixed(2)}
                                                </td>
                                                <td className="py-4 text-slate-400 text-xs">
                                                    {u.createdAt ? formatDate(u.createdAt) : "N/A"}
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
