"use client";

import { useMutation } from "@tanstack/react-query";
import { signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";

const saveUserToBackend = async (payload: {
    name: string;
    email: string;
    photoURL: string;
}): Promise<void> => {
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

export function useGoogleAuth() {
    const mutation = useMutation<void, Error, { name: string; email: string; photoURL: string }>({
        mutationFn: saveUserToBackend,
        onSuccess: () => {
            window.location.href = "/dashboard";
        },
        onError: async () => {
            // Backend failed → sign out from Firebase to keep state consistent.
            // Without this, Firebase says "logged in" but there's no JWT cookie,
            // causing all protected API routes to return 401.
            await signOut(auth);
        },
    });

    const signInWithGoogle = async (): Promise<void> => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            mutation.mutate({
                name: user.displayName || "FitPass User",
                email: user.email || "",
                photoURL: user.photoURL || "",
            });
        } catch (err: unknown) {
            if (err instanceof Error) {
                throw err;
            }
            throw new Error("Google sign-in failed. Please try again.");
        }
    };

    return {
        signInWithGoogle,
        isPending: mutation.isPending,
        error: mutation.error,
    };
}
