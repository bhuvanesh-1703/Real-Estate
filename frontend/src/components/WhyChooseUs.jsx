import React from 'react';
import { ShieldCheck, Award, Users, Building, Lock, Sparkles } from 'lucide-react';

export default function WhyChooseUs() {
  const stats = [
    { label: "Years of Experience", value: "15+", desc: "Delivering luxury estates since 2011" },
    { label: "Properties Sold", value: "450+", desc: "Over ₹500 Cr in transactions closed" },
    { label: "Happy Customers", value: "1,200+", desc: "99.4% satisfaction score from buyers" },
    { label: "Projects Delivered", value: "85+", desc: "RERA & DTCP approved landmarks" }
  ];

  const features = [
    {
      icon: <Sparkles className="w-6 h-6 text-[#D4AF37]" />,
      title: "AI-Powered Matchmaking",
      desc: "Our neural algorithms extract your lifestyle preferences and financial targets to recommend zero-compromise properties."
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-[#D4AF37]" />,
      title: "100% Verified Title Deeds",
      desc: "Every plot, villa, and high-rise undergoes 50+ legal checks by senior advocate panels before listing."
    },
    {
      icon: <Lock className="w-6 h-6 text-[#D4AF37]" />,
      title: "Transparent Valuation",
      desc: "Zero hidden brokerage fees or inflated pricing. Complete digital audit trail for all transactional documentation."
    }
  ];

  return (
    <section className="py-20 bg-[#0B0F17] relative border-y border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Animated Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-16 border-b border-white/10">
          {stats.map((st, i) => (
            <div key={i} className="glass-panel p-6 rounded-2xl text-center border border-white/5 space-y-1">
              <span className="font-heading font-extrabold text-3xl sm:text-4xl gold-gradient-text block">
                {st.value}
              </span>
              <h4 className="font-heading font-semibold text-xs sm:text-sm text-white uppercase tracking-wider">
                {st.label}
              </h4>
              <p className="text-[11px] text-gray-400">{st.desc}</p>
            </div>
          ))}
        </div>

        {/* Feature Cards Grid */}
        <div className="pt-16 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs uppercase font-bold tracking-widest text-[#D4AF37]">
              Uncompromising Standards
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white">
              Why Discerning Buyers Choose Aetheria
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((f, idx) => (
              <div
                key={idx}
                className="glass-card p-8 rounded-3xl border border-white/10 space-y-4 hover:border-[#D4AF37]/40 transition-all"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center">
                  {f.icon}
                </div>
                <h3 className="font-heading font-bold text-lg text-white">{f.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
