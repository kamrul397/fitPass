"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { loginSchema, LoginFormData } from "@/schemas/auth";
import GoogleButton from "@/components/GoogleButton";
import { motion } from "framer-motion";
import { Dumbbell, Mail, Lock, ArrowRight } from "lucide-react";
import Link from "next/link";

const loginWithEmail = async (credentials: LoginFormData): Promise<void> => {
    const result = await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
    const user = result.user;

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/jwt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
            name: user.displayName || "FitPass User",
            email: user.email || "",
            photoURL: user.photoURL || "",
        }),
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Login failed. Please try again.");
    }
};

export default function LoginPage() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        mode: "onTouched",
    });

    const emailMutation = useMutation<void, Error, LoginFormData>({
        mutationFn: loginWithEmail,
        onSuccess: () => {
            window.location.href = "/dashboard";
        },
    });

    const onSubmit = (data: LoginFormData) => {
        emailMutation.mutate(data);
    };

    const displayError = emailMutation.isError
        ? emailMutation.error?.message?.includes("invalid-credential") ||
            emailMutation.error?.message?.includes("wrong-password")
            ? "Invalid email or password."
            : emailMutation.error?.message
        : "";

    return (
        <main className="min-h-screen flex items-center justify-center bg-slate-950 px-6 py-12 relative overflow-hidden text-slate-100 selection:bg-violet-500 selection:text-white">
            {/* Background Ambient Lights */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-violet-600/15 rounded-full blur-[140px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl relative z-10"
            >
                {/* Header Logo */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2.5 mb-4 group">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-violet-500/25">
                            <Dumbbell className="w-6 h-6" />
                        </div>
                    </Link>
                    <h1 className="text-3xl font-black text-white">Welcome Back</h1>
                    <p className="text-slate-400 text-xs mt-1">Sign in to access your FitPass membership</p>
                </div>

                {displayError && (
                    <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-400 text-xs font-semibold text-center mb-6 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3"
                    >
                        {displayError}
                    </motion.p>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    {/* Email */}
                    <div>
                        <label className="text-xs font-semibold text-slate-400 mb-1 flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5 text-violet-400" /> Email Address
                        </label>
                        <input
                            {...register("email")}
                            type="email"
                            placeholder="you@example.com"
                            className="w-full bg-slate-950/80 text-white rounded-xl px-4 py-3 border border-slate-800 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none text-sm transition-all"
                        />
                        {errors.email && (
                            <p className="text-red-400 text-xs mt-1 font-medium">{errors.email.message}</p>
                        )}
                    </div>

                    {/* Password */}
                    <div>
                        <label className="text-xs font-semibold text-slate-400 mb-1 flex items-center gap-1.5">
                            <Lock className="w-3.5 h-3.5 text-violet-400" /> Password
                        </label>
                        <input
                            {...register("password")}
                            type="password"
                            placeholder="••••••••"
                            className="w-full bg-slate-950/80 text-white rounded-xl px-4 py-3 border border-slate-800 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none text-sm transition-all"
                        />
                        {errors.password && (
                            <p className="text-red-400 text-xs mt-1 font-medium">{errors.password.message}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={emailMutation.isPending}
                        className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-extrabold py-3.5 rounded-xl transition-all shadow-lg shadow-violet-500/25 mt-2 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {emailMutation.isPending ? "Signing in..." : "Sign In"}
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </form>

                <div className="my-6 flex items-center gap-4">
                    <div className="h-px bg-slate-800 flex-1"></div>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">OR</span>
                    <div className="h-px bg-slate-800 flex-1"></div>
                </div>

                <GoogleButton />

                <p className="text-center text-xs text-slate-400 mt-6">
                    Don&apos;t have an account?{" "}
                    <Link href="/register" className="text-violet-400 hover:text-violet-300 font-bold transition-colors">
                        Create Account
                    </Link>
                </p>
            </motion.div>
        </main>
    );
}
