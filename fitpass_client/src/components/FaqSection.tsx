// src/components/FaqSection.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle, Sparkles } from "lucide-react";

interface FaqItem {
    question: string;
    answer: string;
}

const faqs: FaqItem[] = [
    {
        question: "How does the single pass work across different gyms?",
        answer: "FitPass partners with over 500+ top gym locations nationwide. Once subscribed, you get a digital QR pass on your dashboard. Simply show or scan your digital pass at any partner gym front desk for instant contactless check-in.",
    },
    {
        question: "What happens to my unused balance when I upgrade or switch plans?",
        answer: "We calculate exact daily proration credit. Any unused days remaining on your active plan automatically convert into dollar credit and apply directly toward your new plan checkout!",
    },
    {
        question: "Are there long-term contracts or cancellation fees?",
        answer: "Never. All FitPass memberships are month-to-month. You can switch, upgrade, pause, or cancel your pass anytime directly from your user dashboard with zero hidden penalties.",
    },
    {
        question: "Can I access gyms in multiple cities while traveling?",
        answer: "Yes! Your FitPass travels with you. Whether you're traveling for work or vacation, your subscription grants you full access to any partner gym across the country.",
    },
    {
        question: "What facilities are included in each membership tier?",
        answer: "The Basic plan includes full gym floor & locker access. Premium adds group fitness classes & weekly personal trainer sessions. Elite unlocks VIP lounges, unlimited trainer access, and custom nutrition consultations.",
    },
];

export default function FaqSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const toggleFaq = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="py-20 relative z-10 max-w-4xl mx-auto px-4">
            <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 bg-[#0f172a]/80 border border-white/10 backdrop-blur-md px-4 py-2 rounded-full text-xs font-bold text-violet-300 mb-4 shadow-xl">
                    <HelpCircle className="w-4 h-4 text-cyan-400" />
                    <span>Got Questions?</span>
                </div>
                <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
                    Frequently Asked <span className="bg-gradient-to-r from-violet-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">Questions</span>
                </h2>
                <p className="text-slate-400 text-sm sm:text-base max-w-lg mx-auto">
                    Everything you need to know about FitPass memberships, proration credit, and gym entry.
                </p>
            </div>

            <div className="space-y-4">
                {faqs.map((faq, idx) => {
                    const isOpen = openIndex === idx;
                    return (
                        <div
                            key={idx}
                            className="bg-[#0f172a]/70 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl transition-all shadow-lg"
                        >
                            <button
                                onClick={() => toggleFaq(idx)}
                                className="w-full p-6 text-left flex items-center justify-between gap-4 font-bold text-white text-base sm:text-lg hover:text-violet-300 transition-colors outline-none"
                            >
                                <span>{faq.question}</span>
                                <motion.div
                                    animate={{ rotate: isOpen ? 180 : 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="shrink-0 w-8 h-8 rounded-full bg-slate-800/80 flex items-center justify-center text-slate-300"
                                >
                                    <ChevronDown className="w-5 h-5" />
                                </motion.div>
                            </button>

                            <AnimatePresence initial={false}>
                                {isOpen && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.25 }}
                                    >
                                        <div className="px-6 pb-6 text-slate-300/90 text-sm leading-relaxed border-t border-white/5 pt-4">
                                            {faq.answer}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
