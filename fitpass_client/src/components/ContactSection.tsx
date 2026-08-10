// src/components/ContactSection.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MessageSquare, Send, CheckCircle2, Sparkles, MapPin, Phone } from "lucide-react";

interface ContactSectionProps {
    whatsappNumber?: string; // e.g. "1234567890"
    supportEmail?: string;  // e.g. "support@fitpass.com"
}

export default function ContactSection({
    whatsappNumber = "+8801894565173",
    supportEmail = "kamrulislam25262800@gmail.com",
}: ContactSectionProps) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !email || !message) return;
        setLoading(true);

        setTimeout(() => {
            setLoading(false);
            setSubmitted(true);
            setName("");
            setEmail("");
            setMessage("");
        }, 600);
    };

    const cleanWhatsapp = whatsappNumber.replace(/[^0-9]/g, "");
    const whatsappUrl = `https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent("Hi FitPass Support! I have a question regarding gym membership.")}`;

    return (
        <section id="contact" className="py-20 relative z-10 max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 bg-[#0f172a]/80 border border-white/10 backdrop-blur-md px-4 py-2 rounded-full text-xs font-bold text-violet-300 mb-4 shadow-xl">
                    <MessageSquare className="w-4 h-4 text-cyan-400" />
                    <span>Get In Touch</span>
                </div>
                <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
                    Contact <span className="bg-gradient-to-r from-violet-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">FitPass Support</span>
                </h2>
                <p className="text-slate-400 text-sm sm:text-base max-w-lg mx-auto">
                    Have a question about gym passes, proration credit, or corporate plans? We&apos;re here 24/7 to help!
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* ── LEFT COL: DIRECT CONTACT CARDS ── */}
                <div className="lg:col-span-5 space-y-4">
                    {/* WhatsApp Card */}
                    <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[#0f172a]/80 hover:bg-[#0f172a] border border-emerald-500/30 hover:border-emerald-400 rounded-3xl p-6 backdrop-blur-xl transition-all shadow-xl block group hover:-translate-y-1"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                <Phone className="w-7 h-7 text-emerald-400" />
                            </div>
                            <div>
                                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 inline-block mb-1">
                                    Instant Chat
                                </span>
                                <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">WhatsApp Support</h3>
                                <p className="text-slate-400 text-xs mt-0.5">{whatsappNumber}</p>
                            </div>
                        </div>
                    </a>

                    {/* Email Support Card */}
                    <a
                        href={`mailto:${supportEmail}`}
                        className="bg-[#0f172a]/80 hover:bg-[#0f172a] border border-violet-500/30 hover:border-violet-400 rounded-3xl p-6 backdrop-blur-xl transition-all shadow-xl block group hover:-translate-y-1"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                <Mail className="w-7 h-7 text-violet-400" />
                            </div>
                            <div>
                                <span className="text-[10px] font-black uppercase tracking-wider text-violet-400 bg-violet-500/10 px-2.5 py-0.5 rounded-full border border-violet-500/20 inline-block mb-1">
                                    Email Us
                                </span>
                                <h3 className="text-lg font-bold text-white group-hover:text-violet-300 transition-colors">Official Support Email</h3>
                                <p className="text-slate-400 text-xs mt-0.5">{supportEmail}</p>
                            </div>
                        </div>
                    </a>

                    {/* Office Location Card */}
                    <div className="bg-[#0f172a]/60 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                                <MapPin className="w-6 h-6 text-cyan-400" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-white">Headquarters</h4>
                                <p className="text-slate-400 text-xs mt-0.5">FitPass Inc. • 500 Fitness Blvd, Tech Hub</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── RIGHT COL: QUICK MESSAGE FORM ── */}
                <div className="lg:col-span-7 bg-[#0f172a]/80 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
                    <h3 className="text-xl font-black text-white mb-2">Send Us a Direct Message</h3>
                    <p className="text-slate-400 text-xs sm:text-sm mb-6">Fill out the form below and our team will get back to you within 2 hours.</p>

                    {submitted ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-8 text-center text-emerald-400"
                        >
                            <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-emerald-400" />
                            <h4 className="text-xl font-bold text-white mb-1">Message Sent Successfully!</h4>
                            <p className="text-slate-300 text-xs max-w-sm mx-auto">
                                Thank you for contacting FitPass. A member of our support team will respond to your email shortly.
                            </p>
                            <button
                                onClick={() => setSubmitted(false)}
                                className="mt-6 text-xs font-bold text-emerald-400 hover:underline"
                            >
                                Send another message
                            </button>
                        </motion.div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-300 mb-1 block">Your Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Alex Johnson"
                                        className="w-full bg-slate-950/80 border border-white/10 focus:border-violet-500 text-white text-sm rounded-xl px-4 py-3 outline-none transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-300 mb-1 block">Your Email</label>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="alex@example.com"
                                        className="w-full bg-slate-950/80 border border-white/10 focus:border-violet-500 text-white text-sm rounded-xl px-4 py-3 outline-none transition-colors"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-slate-300 mb-1 block">Message</label>
                                <textarea
                                    required
                                    rows={4}
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="How can we help you today?"
                                    className="w-full bg-slate-950/80 border border-white/10 focus:border-violet-500 text-white text-sm rounded-xl px-4 py-3 outline-none transition-colors resize-none"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-extrabold py-3.5 rounded-xl shadow-lg shadow-violet-500/25 transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
                            >
                                {loading ? (
                                    <span>Sending...</span>
                                ) : (
                                    <>
                                        <span>Send Message</span>
                                        <Send className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </section>
    );
}
