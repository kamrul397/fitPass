// src/app/pricing/page.tsx
import { Plan } from "@/types";
import HomePlansSection from "@/components/HomePlansSection";
import { Check, X, HelpCircle, Zap } from "lucide-react";

async function getPlans(): Promise<Plan[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/plans`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function PricingPage() {
  const plans = await getPlans();

  const comparisonFeatures = [
    { name: "500+ Partner Gym Access", basic: true, premium: true, elite: true },
    { name: "Standard Gym Equipment & Lockers", basic: true, premium: true, elite: true },
    { name: "24/7 Digital QR Entry", basic: true, premium: true, elite: true },
    { name: "Group Fitness Classes", basic: false, premium: true, elite: true },
    { name: "Weekly Personal Trainer Session", basic: false, premium: true, elite: true },
    { name: "Unlimited Trainer Access", basic: false, premium: false, elite: true },
    { name: "VIP Member Lounge Access", basic: false, premium: false, elite: true },
    { name: "Nutrition & Meal Plan Consultation", basic: false, premium: false, elite: true },
  ];

  return (
    <main className="flex-1 py-16 px-6 relative overflow-hidden">
      {/* Background Ambient Lights */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-violet-600/15 rounded-full blur-[140px] pointer-events-none" />

      {/* Page Header */}
      <div className="max-w-4xl mx-auto text-center mb-16 relative z-10">
        <div className="inline-flex items-center gap-2 bg-slate-900/80 border border-slate-800 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold text-violet-300 mb-4">
          <Zap className="w-3.5 h-3.5 text-violet-400" /> Transparent Pricing, Zero Hidden Fees
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-4">
          Choose the Perfect FitPass Plan
        </h1>
        <p className="text-slate-400 text-sm sm:text-base max-w-lg mx-auto">
          Switch or upgrade anytime. Unused days on your previous plan are credited automatically to your account balance.
        </p>
      </div>

      {/* Plan Cards Grid */}
      <HomePlansSection plans={plans} />

      {/* Feature Comparison Table */}
      <section className="max-w-5xl mx-auto my-24 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-white mb-2">Detailed Plan Comparison</h2>
          <p className="text-xs text-slate-400">Compare features included in each FitPass subscription tier</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl overflow-hidden backdrop-blur-xl shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-300 text-xs font-bold uppercase tracking-wider">
                  <th className="p-5">Feature</th>
                  <th className="p-5 text-center text-blue-400">Basic ($9.99/mo)</th>
                  <th className="p-5 text-center text-violet-400">Premium ($19.99/mo)</th>
                  <th className="p-5 text-center text-amber-400">Elite ($39.99/mo)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {comparisonFeatures.map((feat, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-5 font-semibold text-slate-200">{feat.name}</td>
                    <td className="p-5 text-center">
                      {feat.basic ? (
                        <Check className="w-5 h-5 text-emerald-400 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-slate-600 mx-auto" />
                      )}
                    </td>
                    <td className="p-5 text-center">
                      {feat.premium ? (
                        <Check className="w-5 h-5 text-emerald-400 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-slate-600 mx-auto" />
                      )}
                    </td>
                    <td className="p-5 text-center">
                      {feat.elite ? (
                        <Check className="w-5 h-5 text-emerald-400 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-slate-600 mx-auto" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto my-16 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-white mb-2 flex items-center justify-center gap-2">
            <HelpCircle className="w-7 h-7 text-violet-400" /> Frequently Asked Questions
          </h2>
          <p className="text-xs text-slate-400">Everything you need to know about your FitPass subscription</p>
        </div>

        <div className="space-y-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl">
            <h4 className="text-base font-bold text-white mb-2">How does plan switching & proration work?</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              When you switch from Basic to Premium or Elite, your unused days on your previous plan are calculated as credit (`$Daily Rate × Days Left`). That credit is automatically deducted from the price of your new plan today!
            </p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl">
            <h4 className="text-base font-bold text-white mb-2">What happens if I downgrade to a cheaper plan?</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              If your unused credit exceeds the cost of the new cheaper plan, you pay **$0.00 today**! The remaining credit balance is saved to your account and automatically covers your future renewals.
            </p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl">
            <h4 className="text-base font-bold text-white mb-2">How do I check in at a gym?</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Simply open your **Member Dashboard** on your phone and present your Digital QR Gym Access Pass at the front desk of any partner location.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
