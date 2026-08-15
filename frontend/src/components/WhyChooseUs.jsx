import React from 'react';
import { ShieldCheck, Lock, Sparkles } from 'lucide-react';

export default function WhyChooseUs() {
  const stats = [
    { label: "Years of Experience", value: "15+", desc: "Delivering luxury estates since 2011" },
    { label: "Properties Sold", value: "450+", desc: "Over ₹500 Cr in transactions closed" },
    { label: "Happy Customers", value: "1,200+", desc: "99.4% satisfaction score from buyers" },
    { label: "Projects Delivered", value: "85+", desc: "RERA & DTCP approved landmarks" }
  ];

  const features = [
    {
      icon: <Sparkles className="w-6 h-6 text-[#B08D57]" />,
      title: "AI-Powered Matchmaking",
      desc: "Our neural algorithms extract your lifestyle preferences and financial targets to recommend zero-compromise properties."
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-[#B08D57]" />,
      title: "100% Verified Title Deeds",
      desc: "Every plot, villa, and high-rise undergoes 50+ legal checks by senior advocate panels before listing."
    },
    {
      icon: <Lock className="w-6 h-6 text-[#B08D57]" />,
      title: "Transparent Valuation",
      desc: "Zero hidden brokerage fees or inflated pricing. Complete digital audit trail for all transactional documentation."
    }
  ];

  return (
    <section className="py-20 bg-[#0D1410] blueprint-grid relative border-y border-[#B08D57]/20 text-[#EFEAE1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Animated Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-16 border-b border-[#B08D57]/15">
          {stats.map((st, i) => (
            <div key={i} className="glass-panel p-6 rounded-2xl text-center border border-[#B08D57]/20 space-y-1">
              <span className="font-serif-fraunces font-extrabold text-3xl sm:text-4xl text-[#B08D57] block">
                {st.value}
              </span>
              <h4 className="font-mono font-semibold text-xs sm:text-sm text-[#EFEAE1] uppercase tracking-wider">
                {st.label}
              </h4>
              <p className="text-[11px] text-gray-400 font-light">{st.desc}</p>
            </div>
          ))}
        </div>

        {/* Feature Cards Grid */}
        <div className="pt-16 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs uppercase font-mono font-bold tracking-widest text-[#B08D57]">
              Uncompromising Standards
            </span>
            <h2 className="font-serif-fraunces text-3xl sm:text-4xl font-extrabold text-[#EFEAE1]">
              Why Discerning Buyers Choose Aetheria
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((f, idx) => (
              <div
                key={idx}
                className="glass-card p-8 rounded-3xl border border-[#B08D57]/20 space-y-4 hover:border-[#B08D57]/50 transition-all"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#B08D57]/10 border border-[#B08D57]/30 flex items-center justify-center">
                  {f.icon}
                </div>
                <h3 className="font-serif-fraunces font-bold text-lg text-[#EFEAE1]">{f.title}</h3>
                <p className="text-xs text-[#8A9186] leading-relaxed font-light">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
