"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { createUserWithEmailAndPassword, updateProfile, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { registerSchema, RegisterFormData } from "@/schemas/auth";
import GoogleButton from "@/components/GoogleButton";
import { motion } from "framer-motion";
import { Dumbbell, Mail, Lock, User as UserIcon, ArrowRight } from "lucide-react";
import Link from "next/link";

type BackendUserPayload = {
    name: string;
    email: string;
    photoURL: string;
};

const registerUserOnBackend = async (payload: BackendUserPayload): Promise<void> => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/jwt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to register. Please try again.");
    }
};

export default function RegisterPage() {
    const [authError, setAuthError] = useState<string>("");

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        mode: "onTouched",
    });

    const registerMutation = useMutation<void, Error, BackendUserPayload>({
        mutationFn: registerUserOnBackend,
        onSuccess: () => {
            window.location.href = "/dashboard";
        },
        onError: async (error: Error) => {
            setAuthError(error.message);
            await signOut(auth);
        },
    });

    const onSubmit = async (data: RegisterFormData): Promise<void> => {
        setAuthError("");

        try {
            const result = await createUserWithEmailAndPassword(
                auth,
                data.email,
                data.password
            );

            await updateProfile(result.user, { displayName: data.name });

            registerMutation.mutate({
                name: data.name,
                email: data.email,
                photoURL: result.user.photoURL || "",
            });
        } catch (err: unknown) {
            if (err instanceof Error) {
                if (err.message.includes("email-already-in-use")) {
                    setAuthError("This email is already registered. Please login.");
                } else {
                    setAuthError(err.message);
                }
            } else {
                setAuthError("Something went wrong. Please try again.");
            }
        }
    };

    const displayError = authError || registerMutation.error?.message;

    return (
        <main className="min-h-screen flex items-center justify-center bg-[#080b11] px-6 py-12 relative overflow-hidden text-slate-100 selection:bg-violet-500 selection:text-white">
            {/* Background Ambient Lights */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-tr from-violet-600/20 to-cyan-500/15 rounded-full blur-[140px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="w-full max-w-md bg-[#0f172a]/90 border border-white/10 rounded-3xl p-8 shadow-2xl backdrop-blur-xl relative z-10"
            >
                {/* Header Logo */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2.5 mb-4 group">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-violet-500/25">
                            <Dumbbell className="w-6 h-6" />
                        </div>
                    </Link>
                    <h1 className="text-3xl font-black text-white">Create Account</h1>
                    <p className="text-slate-400 text-xs mt-1">Start your fitness journey with FitPass today</p>
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
                    {/* Full Name */}
                    <div>
                        <label className="text-xs font-semibold text-slate-400 mb-1 flex items-center gap-1.5">
                            <UserIcon className="w-3.5 h-3.5 text-violet-400" /> Full Name
                        </label>
                        <input
                            {...register("name")}
                            type="text"
                            placeholder="Kamrul Islam"
                            className="w-full bg-slate-950/80 text-white rounded-xl px-4 py-3 border border-slate-800 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none text-sm transition-all"
                        />
                        {errors.name && (
                            <p className="text-red-400 text-xs mt-1 font-medium">{errors.name.message}</p>
                        )}
                    </div>

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
                            placeholder="Minimum 6 characters"
                            className="w-full bg-slate-950/80 text-white rounded-xl px-4 py-3 border border-slate-800 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none text-sm transition-all"
                        />
                        {errors.password && (
                            <p className="text-red-400 text-xs mt-1 font-medium">{errors.password.message}</p>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="text-xs font-semibold text-slate-400 mb-1 flex items-center gap-1.5">
                            <Lock className="w-3.5 h-3.5 text-violet-400" /> Confirm Password
                        </label>
                        <input
                            {...register("confirmPassword")}
                            type="password"
                            placeholder="Repeat password"
                            className="w-full bg-slate-950/80 text-white rounded-xl px-4 py-3 border border-slate-800 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none text-sm transition-all"
                        />
                        {errors.confirmPassword && (
                            <p className="text-red-400 text-xs mt-1 font-medium">{errors.confirmPassword.message}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={registerMutation.isPending}
                        className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-extrabold py-3.5 rounded-xl transition-all shadow-lg shadow-violet-500/25 mt-2 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {registerMutation.isPending ? "Creating account..." : "Create Account"}
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
                    Already have an account?{" "}
                    <Link href="/login" className="text-violet-400 hover:text-violet-300 font-bold transition-colors">
                        Sign In
                    </Link>
                </p>
            </motion.div>
        </main>
    );
}
