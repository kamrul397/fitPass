// src/app/auth/page.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { loginSchema, LoginFormData, registerSchema, RegisterFormData } from "@/schemas/auth";
import GoogleButton from "@/components/GoogleButton";
import { motion, AnimatePresence } from "framer-motion";
import { Dumbbell, Mail, Lock, User as UserIcon, ArrowRight, LogIn, UserPlus } from "lucide-react";

type BackendUserPayload = {
    name: string;
    email: string;
    photoURL: string;
};

const sendUserToBackend = async (payload: BackendUserPayload): Promise<void> => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/jwt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Authentication failed. Please try again.");
    }
};

export default function SingleAuthPage() {
    const [activeTab, setActiveTab] = useState<"login" | "register">("login");
    const [authError, setAuthError] = useState<string>("");

    // ── Login Form ──
    const loginForm = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        mode: "onTouched",
    });

    const loginMutation = useMutation<void, Error, LoginFormData>({
        mutationFn: async (credentials: LoginFormData) => {
            const result = await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
            await sendUserToBackend({
                name: result.user.displayName || "FitPass User",
                email: result.user.email || "",
                photoURL: result.user.photoURL || "",
            });
        },
        onSuccess: () => {
            window.location.href = "/dashboard";
        },
        onError: (err) => {
            if (err.message.includes("invalid-credential") || err.message.includes("wrong-password")) {
                setAuthError("Invalid email or password.");
            } else {
                setAuthError(err.message);
            }
        },
    });

    // ── Register Form ──
    const registerForm = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        mode: "onTouched",
    });

    const registerMutation = useMutation<void, Error, BackendUserPayload>({
        mutationFn: sendUserToBackend,
        onSuccess: () => {
            window.location.href = "/dashboard";
        },
        onError: async (error: Error) => {
            setAuthError(error.message);
            await signOut(auth);
        },
    });

    const onRegisterSubmit = async (data: RegisterFormData): Promise<void> => {
        setAuthError("");
        try {
            const result = await createUserWithEmailAndPassword(auth, data.email, data.password);
            await updateProfile(result.user, { displayName: data.name });

            registerMutation.mutate({
                name: data.name,
                email: data.email,
                photoURL: result.user.photoURL || "",
            });
        } catch (err: unknown) {
            if (err instanceof Error) {
                if (err.message.includes("email-already-in-use")) {
                    setAuthError("This email is already registered. Please sign in.");
                } else {
                    setAuthError(err.message);
                }
            } else {
                setAuthError("Something went wrong.");
            }
        }
    };

    return (
        <main className="flex-1 flex items-center justify-center px-6 py-12 relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-violet-600/15 rounded-full blur-[140px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl relative z-10"
            >
                {/* Header Logo */}
                <div className="text-center mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center text-white mx-auto mb-3 shadow-lg shadow-violet-500/25">
                        <Dumbbell className="w-6 h-6" />
                    </div>
                    <h1 className="text-3xl font-black text-white">Welcome to FitPass</h1>
                    <p className="text-slate-400 text-xs mt-1">Sign in or create an account to start training</p>
                </div>

                {/* Tab Switcher */}
                <div className="bg-slate-950 p-1.5 rounded-2xl flex gap-1 mb-6 border border-slate-800">
                    <button
                        onClick={() => {
                            setActiveTab("login");
                            setAuthError("");
                        }}
                        className={`w-1/2 py-2.5 rounded-xl font-extrabold text-xs transition-all flex items-center justify-center gap-2 ${
                            activeTab === "login"
                                ? "bg-violet-600 text-white shadow-lg shadow-violet-500/25"
                                : "text-slate-400 hover:text-white"
                        }`}
                    >
                        <LogIn className="w-4 h-4" />
                        <span>Sign In</span>
                    </button>

                    <button
                        onClick={() => {
                            setActiveTab("register");
                            setAuthError("");
                        }}
                        className={`w-1/2 py-2.5 rounded-xl font-extrabold text-xs transition-all flex items-center justify-center gap-2 ${
                            activeTab === "register"
                                ? "bg-violet-600 text-white shadow-lg shadow-violet-500/25"
                                : "text-slate-400 hover:text-white"
                        }`}
                    >
                        <UserPlus className="w-4 h-4" />
                        <span>Register</span>
                    </button>
                </div>

                {authError && (
                    <p className="text-red-400 text-xs font-semibold text-center mb-6 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                        {authError}
                    </p>
                )}

                <AnimatePresence mode="wait">
                    {activeTab === "login" ? (
                        <motion.form
                            key="login"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            onSubmit={loginForm.handleSubmit((data) => {
                                setAuthError("");
                                loginMutation.mutate(data);
                            })}
                            className="flex flex-col gap-4"
                        >
                            <div>
                                <label className="text-xs font-semibold text-slate-400 mb-1 flex items-center gap-1.5">
                                    <Mail className="w-3.5 h-3.5 text-violet-400" /> Email Address
                                </label>
                                <input
                                    {...loginForm.register("email")}
                                    type="email"
                                    placeholder="you@example.com"
                                    className="w-full bg-slate-950/80 text-white rounded-xl px-4 py-3 border border-slate-800 focus:border-violet-500 outline-none text-sm transition-all"
                                />
                                {loginForm.formState.errors.email && (
                                    <p className="text-red-400 text-xs mt-1">{loginForm.formState.errors.email.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-slate-400 mb-1 flex items-center gap-1.5">
                                    <Lock className="w-3.5 h-3.5 text-violet-400" /> Password
                                </label>
                                <input
                                    {...loginForm.register("password")}
                                    type="password"
                                    placeholder="••••••••"
                                    className="w-full bg-slate-950/80 text-white rounded-xl px-4 py-3 border border-slate-800 focus:border-violet-500 outline-none text-sm transition-all"
                                />
                                {loginForm.formState.errors.password && (
                                    <p className="text-red-400 text-xs mt-1">{loginForm.formState.errors.password.message}</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={loginMutation.isPending}
                                className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-extrabold py-3.5 rounded-xl transition-all shadow-lg shadow-violet-500/25 mt-2 flex items-center justify-center gap-2"
                            >
                                {loginMutation.isPending ? "Signing in..." : "Sign In"}
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </motion.form>
                    ) : (
                        <motion.form
                            key="register"
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            onSubmit={registerForm.handleSubmit(onRegisterSubmit)}
                            className="flex flex-col gap-4"
                        >
                            <div>
                                <label className="text-xs font-semibold text-slate-400 mb-1 flex items-center gap-1.5">
                                    <UserIcon className="w-3.5 h-3.5 text-violet-400" /> Full Name
                                </label>
                                <input
                                    {...registerForm.register("name")}
                                    type="text"
                                    placeholder="Kamrul Islam"
                                    className="w-full bg-slate-950/80 text-white rounded-xl px-4 py-3 border border-slate-800 focus:border-violet-500 outline-none text-sm transition-all"
                                />
                                {registerForm.formState.errors.name && (
                                    <p className="text-red-400 text-xs mt-1">{registerForm.formState.errors.name.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-slate-400 mb-1 flex items-center gap-1.5">
                                    <Mail className="w-3.5 h-3.5 text-violet-400" /> Email Address
                                </label>
                                <input
                                    {...registerForm.register("email")}
                                    type="email"
                                    placeholder="you@example.com"
                                    className="w-full bg-slate-950/80 text-white rounded-xl px-4 py-3 border border-slate-800 focus:border-violet-500 outline-none text-sm transition-all"
                                />
                                {registerForm.formState.errors.email && (
                                    <p className="text-red-400 text-xs mt-1">{registerForm.formState.errors.email.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-slate-400 mb-1 flex items-center gap-1.5">
                                    <Lock className="w-3.5 h-3.5 text-violet-400" /> Password
                                </label>
                                <input
                                    {...registerForm.register("password")}
                                    type="password"
                                    placeholder="Minimum 6 characters"
                                    className="w-full bg-slate-950/80 text-white rounded-xl px-4 py-3 border border-slate-800 focus:border-violet-500 outline-none text-sm transition-all"
                                />
                                {registerForm.formState.errors.password && (
                                    <p className="text-red-400 text-xs mt-1">{registerForm.formState.errors.password.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-slate-400 mb-1 flex items-center gap-1.5">
                                    <Lock className="w-3.5 h-3.5 text-violet-400" /> Confirm Password
                                </label>
                                <input
                                    {...registerForm.register("confirmPassword")}
                                    type="password"
                                    placeholder="Repeat password"
                                    className="w-full bg-slate-950/80 text-white rounded-xl px-4 py-3 border border-slate-800 focus:border-violet-500 outline-none text-sm transition-all"
                                />
                                {registerForm.formState.errors.confirmPassword && (
                                    <p className="text-red-400 text-xs mt-1">{registerForm.formState.errors.confirmPassword.message}</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={registerMutation.isPending}
                                className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-extrabold py-3.5 rounded-xl transition-all shadow-lg shadow-violet-500/25 mt-2 flex items-center justify-center gap-2"
                            >
                                {registerMutation.isPending ? "Creating Account..." : "Create Account"}
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </motion.form>
                    )}
                </AnimatePresence>

                <div className="my-6 flex items-center gap-4">
                    <div className="h-px bg-slate-800 flex-1"></div>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">OR</span>
                    <div className="h-px bg-slate-800 flex-1"></div>
                </div>

                <GoogleButton />
            </motion.div>
        </main>
    );
}
