// src/components/SkeletonLoaders.tsx
"use client";

export function PlanCardSkeleton() {
    return (
        <div className="relative flex flex-col rounded-2xl border border-slate-800 bg-slate-900/60 p-8 shadow-xl animate-pulse">
            <div className="h-6 w-1/3 bg-slate-800 rounded-lg mb-4" />
            <div className="h-10 w-1/2 bg-slate-800 rounded-xl mb-6" />
            <div className="space-y-3 mb-8">
                <div className="h-4 w-full bg-slate-800/80 rounded" />
                <div className="h-4 w-5/6 bg-slate-800/80 rounded" />
                <div className="h-4 w-4/6 bg-slate-800/80 rounded" />
            </div>
            <div className="mt-auto h-12 w-full bg-slate-800 rounded-xl" />
        </div>
    );
}

export function HomePlansSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <PlanCardSkeleton />
            <PlanCardSkeleton />
            <PlanCardSkeleton />
        </div>
    );
}

export function DashboardSkeleton() {
    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-pulse">
            {/* Profile Card Skeleton */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 flex items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-slate-800 shrink-0" />
                <div className="space-y-3 flex-1">
                    <div className="h-7 w-48 bg-slate-800 rounded-lg" />
                    <div className="h-4 w-64 bg-slate-800/70 rounded" />
                    <div className="h-6 w-32 bg-slate-800 rounded-full" />
                </div>
            </div>

            {/* Pass & Stats Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 h-64 bg-slate-900/80 border border-slate-800 rounded-3xl p-6" />
                <div className="h-64 bg-slate-900/80 border border-slate-800 rounded-3xl p-6" />
            </div>

            {/* History Table Skeleton */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-8 space-y-4">
                <div className="h-6 w-36 bg-slate-800 rounded-lg" />
                <div className="h-12 w-full bg-slate-800/60 rounded-xl" />
                <div className="h-12 w-full bg-slate-800/40 rounded-xl" />
            </div>
        </div>
    );
}
