"use client";

import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuthUser } from "@/hooks/useAuthUser";
import Link from "next/link";
import { motion } from "framer-motion";
import { Dumbbell, LogOut, LayoutDashboard, Sparkles, Wallet, ShieldCheck } from "lucide-react";

export default function Navbar() {
    const { user, loading } = useAuthUser();
    const [hasActiveSub, setHasActiveSub] = useState(false);
    const [creditBalance, setCreditBalance] = useState<number>(0);
    const [userRole, setUserRole] = useState<string>("user");

    useEffect(() => {
        if (!user) return;
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payments/my-subscription`, {
            credentials: "include",
        })
            .then((res) => {
                if (res.ok) setHasActiveSub(true);
            })
            .catch(() => {});

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/profile`, {
            credentials: "include",
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.creditBalance) setCreditBalance(data.creditBalance);
                if (data.role) setUserRole(data.role);
            })
            .catch(() => {});
    }, [user]);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`, {
                method: "POST",
                credentials: "include",
            });
            window.location.href = "/";
        } catch (err) {
            console.error("Logout failed:", err);
        }
    };

    return (
        <header className="w-full relative z-40 backdrop-blur-xl bg-slate-950/90 border-b border-slate-800/80 px-6 py-4 transition-all">
            <div className="max-w-6xl mx-auto flex items-center justify-between">

                {/* Brand Logo */}
                <Link href="/" className="flex items-center gap-2.5 group">
                    <motion.div
                        whileHover={{ rotate: 15, scale: 1.1 }}
                        className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-500 to-purple-400 flex items-center justify-center text-white shadow-lg shadow-violet-500/25"
                    >
                        <Dumbbell className="w-5 h-5" />
                    </motion.div>
                    <span className="text-2xl font-black tracking-tight text-white">
                        Fit<span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">Pass</span>
                    </span>
                </Link>

                {/* Nav Links */}
                <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-300">
                    <Link href="/" className="hover:text-white transition-colors">
                        Home
                    </Link>
                    <Link href="/pricing" className="hover:text-white transition-colors">
                        Pricing Plans
                    </Link>
                    <Link href="/dashboard" className="hover:text-white transition-colors flex items-center gap-1.5">
                        <LayoutDashboard className="w-4 h-4 text-violet-400" />
                        Dashboard
                    </Link>
                    {userRole === "admin" && (
                        <Link href="/admin" className="text-amber-400 hover:text-amber-300 font-bold transition-colors flex items-center gap-1.5">
                            <ShieldCheck className="w-4 h-4" />
                            Admin Panel
                        </Link>
                    )}
                </nav>

                {/* Auth & Member Status */}
                <div className="flex items-center gap-3">
                    {loading ? (
                        <div className="h-9 w-24 bg-slate-800/60 rounded-xl animate-pulse" />
                    ) : user ? (
                        <div className="flex items-center gap-3">
                            {/* Member Status Badge */}
                            {hasActiveSub && (
                                <motion.span
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="hidden lg:flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold px-3 py-1.5 rounded-full"
                                >
                                    <Sparkles className="w-3.5 h-3.5" />
                                    Active Member
                                </motion.span>
                            )}

                            {/* Credit Balance Badge (Only if > 0) */}
                            {creditBalance > 0 && (
                                <span className="hidden lg:flex items-center gap-1.5 bg-amber-500/10 text-amber-300 border border-amber-500/20 text-xs font-bold px-3 py-1.5 rounded-full">
                                    <Wallet className="w-3.5 h-3.5 text-amber-400" />
                                    ${creditBalance.toFixed(2)}
                                </span>
                            )}

                            <Link
                                href="/dashboard"
                                className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white px-3.5 py-1.5 rounded-xl transition-all"
                            >
                                {user.photoURL ? (
                                    <img
                                        src={user.photoURL}
                                        alt={user.displayName || "User"}
                                        referrerPolicy="no-referrer"
                                        className="w-7 h-7 rounded-full border border-violet-500 object-cover"
                                    />
                                ) : (
                                    <div className="w-7 h-7 rounded-full bg-violet-600 flex items-center justify-center text-white font-bold text-xs">
                                        {(user.displayName || user.email || "U")[0].toUpperCase()}
                                    </div>
                                )}
                                <span className="text-xs font-semibold text-slate-200 hidden sm:inline-block max-w-[120px] truncate">
                                    {user.displayName || user.email?.split("@")[0]}
                                </span>
                            </Link>

                            <motion.button
                                whileTap={{ scale: 0.95 }}
                                onClick={handleLogout}
                                className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                                title="Sign Out"
                            >
                                <LogOut className="w-4 h-4" />
                            </motion.button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <Link
                                href="/auth"
                                className="text-sm font-semibold text-slate-300 hover:text-white px-4 py-2 transition-colors"
                            >
                                Sign In
                            </Link>
                            <Link
                                href="/auth"
                                className="text-sm font-bold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white px-5 py-2.5 rounded-xl shadow-lg shadow-violet-500/25 transition-all hover:scale-[1.02]"
                            >
                                Get Started
                            </Link>
                        </div>
                    )}
                </div>

            </div>
        </header>
    );
}
