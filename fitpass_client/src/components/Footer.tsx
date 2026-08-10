// src/components/Footer.tsx
"use client";

import Link from "next/link";
import { Dumbbell } from "lucide-react";

export default function Footer() {
    return (
        <footer className="w-full bg-slate-950 border-t border-slate-800/60 py-6 px-6 text-slate-400 text-xs relative z-10">
            <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
                {/* Brand */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center text-white shadow-sm">
                        <Dumbbell className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-bold text-slate-200 text-sm tracking-tight">
                        Fit<span className="text-violet-400">Pass</span>
                    </span>
                </Link>

                {/* Minimal Quick Links */}
                <nav className="flex items-center gap-6 text-xs text-slate-400 font-medium">
                    <Link href="/" className="hover:text-white transition-colors">Home</Link>
                    <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
                    <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
                    <Link href="/admin" className="hover:text-white transition-colors">Admin</Link>
                </nav>

                {/* Copyright */}
                <p className="text-slate-500 text-[11px]">
                    © {new Date().getFullYear()} FitPass Inc. All rights reserved.
                </p>
            </div>
        </footer>
    );
}
