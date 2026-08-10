// src/components/WhyChooseUs.tsx
"use client";

import { motion } from "framer-motion";
import { Dumbbell, ShieldCheck, Zap, Award, Sparkles, RefreshCw, Smartphone, MapPin } from "lucide-react";

const features = [
    {
        icon: MapPin,
        iconColor: "text-violet-400",
        badgeColor: "bg-violet-500/10 border-violet-500/20 text-violet-300",
        title: "500+ Top Gyms Nationwide",
        description: "Access premier fitness clubs, crossfit boxes, and boutique studios with one single pass across major cities.",
    },
    {
        icon: RefreshCw,
        iconColor: "text-cyan-400",
        badgeColor: "bg-cyan-500/10 border-cyan-500/20 text-cyan-300",
        title: "Instant Proration Credit",
        description: "Switch or upgrade plans anytime. Unused days on your previous plan automatically convert into dollar credit.",
    },
    {
        icon: Smartphone,
        iconColor: "text-emerald-400",
        badgeColor: "bg-emerald-500/10 border-emerald-500/20 text-emerald-300",
        title: "Instant QR Pass Entry",
        description: "Scan your digital pass QR code at partner gym front desks for immediate 24/7 contactless check-in.",
    },
    {
        icon: ShieldCheck,
        iconColor: "text-amber-400",
        badgeColor: "bg-amber-500/10 border-amber-500/20 text-amber-300",
        title: "Zero Lock-In Contracts",
        description: "Complete flexibility. Upgrade, pause, or cancel your subscription anytime with zero hidden fees.",
    },
];

export default function WhyChooseUs() {
    return (
        <section className="py-20 relative z-10 max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 bg-[#0f172a]/80 border border-white/10 backdrop-blur-md px-4 py-2 rounded-full text-xs font-bold text-violet-300 mb-4 shadow-xl">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <span>Why FitPass</span>
                </div>
                <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
                    The Smartest Way to <span className="bg-gradient-to-r from-violet-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">Train</span>
                </h2>
                <p className="text-slate-400 text-sm sm:text-base max-w-lg mx-auto">
                    Designed for fitness enthusiasts who value freedom, variety, and transparent pricing.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {features.map((item, idx) => {
                    const Icon = item.icon;
                    return (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-[#0f172a]/60 hover:bg-[#0f172a]/90 border border-white/10 hover:border-violet-500/40 rounded-3xl p-6 backdrop-blur-xl transition-all shadow-xl hover:-translate-y-1 flex flex-col justify-between group"
                        >
                            <div>
                                <div className={`w-12 h-12 rounded-2xl ${item.badgeColor} border flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                    <Icon className={`w-6 h-6 ${item.iconColor}`} />
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">{item.description}</p>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </section>
    );
}
