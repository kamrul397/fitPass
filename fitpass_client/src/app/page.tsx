// src/app/page.tsx
import { Plan } from "@/types";
import HomePlansSection from "@/components/HomePlansSection";
import { Dumbbell, ShieldCheck, Zap, Award, Sparkles } from "lucide-react";

async function getPlans(): Promise<Plan[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/plans`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return [];
    }

    return res.json();
  } catch {
    return [];
  }
}

export default async function Home() {
  const plans = await getPlans();

  return (
    <main className="relative overflow-hidden py-12 md:py-20 px-6">
      {/* Background Radial Ambient Lights */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-violet-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-96 left-1/4 w-[500px] h-[300px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* ── HERO SECTION ── */}
      <section className="max-w-5xl mx-auto text-center mb-20 relative z-10">
        {/* Top Pill Badge */}
        <div className="inline-flex items-center gap-2 bg-slate-900/80 border border-slate-800 backdrop-blur-md px-4 py-2 rounded-full text-xs font-bold text-violet-300 mb-6 shadow-xl">
          <Sparkles className="w-4 h-4 text-violet-400" />
          <span>One Pass for 500+ Top Gyms Nationwide</span>
        </div>

        {/* Main Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-tight mb-6">
          Work Out Anywhere with{" "}
          <span className="bg-gradient-to-r from-violet-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
            One Single Pass.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl mx-auto text-slate-400 text-lg sm:text-xl font-normal leading-relaxed mb-10">
          Access top gyms, fitness clubs, and boutique studios with no long-term contracts. Pause, upgrade, or switch plans anytime.
        </p>

        {/* Stats Ticker */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-6 border-t border-slate-800/80 text-left">
          <div className="bg-slate-900/40 border border-slate-800/60 p-4 rounded-2xl">
            <p className="text-2xl font-black text-white flex items-center gap-2">
              <Dumbbell className="w-5 h-5 text-violet-400" />
              500+
            </p>
            <p className="text-xs text-slate-400 mt-1">Partner Gym Locations</p>
          </div>
          <div className="bg-slate-900/40 border border-slate-800/60 p-4 rounded-2xl">
            <p className="text-2xl font-black text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-emerald-400" />
              24/7
            </p>
            <p className="text-xs text-slate-400 mt-1">Instant QR Pass Entry</p>
          </div>
          <div className="bg-slate-900/40 border border-slate-800/60 p-4 rounded-2xl">
            <p className="text-2xl font-black text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-400" />
              100%
            </p>
            <p className="text-xs text-slate-400 mt-1">Flexible Proration Credit</p>
          </div>
          <div className="bg-slate-900/40 border border-slate-800/60 p-4 rounded-2xl">
            <p className="text-2xl font-black text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              0 Day
            </p>
            <p className="text-xs text-slate-400 mt-1">Lock-in Contracts</p>
          </div>
        </div>
      </section>

      {/* ── PLANS SECTION ── */}
      <section className="relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">
            Flexible Membership Plans 💪
          </h2>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            Choose the pass that fits your lifestyle. Switch or upgrade anytime with unused credit applied instantly.
          </p>
        </div>

        <HomePlansSection plans={plans} />
      </section>
    </main>
  );
}
