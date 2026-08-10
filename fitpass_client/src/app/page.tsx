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
    <main className="relative overflow-hidden py-12 md:py-20 px-6 bg-[#080b11]">
      {/* Background Radial Ambient Lights */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[850px] h-[450px] bg-gradient-to-tr from-violet-600/20 via-indigo-600/15 to-cyan-500/20 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-96 left-1/4 w-[550px] h-[350px] bg-cyan-600/10 rounded-full blur-[130px] pointer-events-none" />

      {/* ── HERO SECTION ── */}
      <section className="max-w-5xl mx-auto text-center mb-20 relative z-10">
        {/* Top Pill Badge */}
        <div className="inline-flex items-center gap-2 bg-[#0f172a]/80 border border-white/10 backdrop-blur-md px-4 py-2 rounded-full text-xs font-bold text-violet-300 mb-6 shadow-2xl">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>One Pass for 500+ Top Gyms Nationwide</span>
        </div>

        {/* Main Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-tight mb-6">
          Work Out Anywhere with{" "}
          <span className="bg-gradient-to-r from-violet-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">
            One Single Pass.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl mx-auto text-slate-300/90 text-lg sm:text-xl font-normal leading-relaxed mb-8">
          Access top gyms, fitness clubs, and boutique studios with no long-term contracts. Pause, upgrade, or switch plans anytime.
        </p>

        {/* Hero CTA Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-14">
          <a
            href="/register"
            className="bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white text-base font-extrabold px-8 py-4 rounded-2xl shadow-xl shadow-violet-500/25 hover:scale-[1.03] transition-all flex items-center gap-2 group"
          >
            <span>Get Started Now</span>
            <Zap className="w-5 h-5 text-cyan-300 group-hover:translate-x-0.5 transition-transform" />
          </a>
          <a
            href="#plans"
            className="bg-[#0f172a]/80 hover:bg-[#1e293b] border border-white/10 text-slate-200 text-base font-semibold px-8 py-4 rounded-2xl backdrop-blur-md transition-all hover:text-white"
          >
            Explore Plans
          </a>
        </div>

        {/* Stats Ticker */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-6 border-t border-white/10 text-left">
          <div className="bg-[#0f172a]/60 border border-white/10 hover:border-violet-500/30 p-4 rounded-2xl backdrop-blur-md transition-colors">
            <p className="text-2xl font-black text-white flex items-center gap-2">
              <Dumbbell className="w-5 h-5 text-violet-400" />
              500+
            </p>
            <p className="text-xs text-slate-400 mt-1">Partner Gym Locations</p>
          </div>
          <div className="bg-[#0f172a]/60 border border-white/10 hover:border-emerald-500/30 p-4 rounded-2xl backdrop-blur-md transition-colors">
            <p className="text-2xl font-black text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-emerald-400" />
              24/7
            </p>
            <p className="text-xs text-slate-400 mt-1">Instant QR Pass Entry</p>
          </div>
          <div className="bg-[#0f172a]/60 border border-white/10 hover:border-cyan-500/30 p-4 rounded-2xl backdrop-blur-md transition-colors">
            <p className="text-2xl font-black text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
              100%
            </p>
            <p className="text-xs text-slate-400 mt-1">Flexible Proration Credit</p>
          </div>
          <div className="bg-[#0f172a]/60 border border-white/10 hover:border-amber-500/30 p-4 rounded-2xl backdrop-blur-md transition-colors">
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
