import React from 'react';
import { Compass, MessageSquare, Sparkles } from 'lucide-react';

export default function FinalCTA({ onExplore, onOpenAiChat }) {
  return (
    <section className="relative py-28 overflow-hidden bg-[#07090F] border-t border-white/10">
      
      {/* Background Hero Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=80"
          alt="Luxury Interior"
          className="w-full h-full object-cover filter brightness-25 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#07090F] via-[#07090F]/70 to-transparent" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        
        <span className="inline-flex items-center gap-2 bg-[#D4AF37]/10 px-4 py-1.5 rounded-full border border-[#D4AF37]/30 text-xs font-semibold text-[#D4AF37]">
          <Sparkles className="w-3.5 h-3.5" />
          ELEVATE YOUR LIFESTYLE TODAY
        </span>

        <h2 className="font-heading font-extrabold text-4xl sm:text-6xl text-white tracking-tight leading-tight">
          Your Next Chapter <br />
          <span className="gold-gradient-text">Starts Here.</span>
        </h2>

        <p className="text-sm sm:text-base text-gray-300 max-w-xl mx-auto font-light">
          Whether seeking an architectural sanctuary or high-yield investment, let our AI platform match you with exceptional real estate assets.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <a
            href="#properties"
            onClick={onExplore}
            className="bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-black font-bold text-xs sm:text-sm px-8 py-4 rounded-xl shadow-2xl hover:brightness-110 transition-all flex items-center gap-2"
          >
            <Compass className="w-4 h-4" />
            Explore Properties
          </a>

          <button
            onClick={onOpenAiChat}
            className="glass-panel text-white font-semibold text-xs sm:text-sm px-8 py-4 rounded-xl border border-white/20 hover:border-[#D4AF37]/50 transition-all flex items-center gap-2"
          >
            <MessageSquare className="w-4 h-4 text-[#D4AF37]" />
            Talk to an Advisor
          </button>
        </div>

      </div>
    </section>
  );
}
