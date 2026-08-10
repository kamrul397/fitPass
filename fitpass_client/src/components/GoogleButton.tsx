"use client";

import { useState } from "react";
import { useGoogleAuth } from "@/hooks/useGoogleAuth";

export default function GoogleButton() {
    const [popupError, setPopupError] = useState("");
    const { signInWithGoogle, isPending, error } = useGoogleAuth();

    const handleGoogleLogin = async () => {
        setPopupError("");
        try {
            await signInWithGoogle();
        } catch (err: unknown) {
            if (err instanceof Error) {
                setPopupError(
                    err.message.includes("popup-closed-by-user")
                        ? "Sign-in popup was closed."
                        : err.message
                );
            }
        }
    };

    const errorMessage = popupError || error?.message;

    return (
        <div className="w-full flex flex-col gap-2">
            {errorMessage && (
                <p className="text-red-400 text-sm text-center bg-red-950 border border-red-800 rounded-lg px-4 py-2">
                    {errorMessage}
                </p>
            )}
            <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isPending}
                className="w-full bg-white hover:bg-gray-100 text-black font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
                <img
                    src="https://www.svgrepo.com/show/475656/google-color.svg"
                    alt="Google"
                    className="w-5 h-5"
                />
                {isPending ? "Connecting..." : "Continue with Google"}
            </button>
        </div>
    );
}
