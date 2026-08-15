import React from 'react';
import { Compass, MessageSquare, Sparkles } from 'lucide-react';

export default function FinalCTA({ onExplore, onOpenAiChat }) {
  return (
    <section className="relative py-28 overflow-hidden bg-[#0D1410] blueprint-grid border-t border-[#B08D57]/20 text-[#EFEAE1]">
      
      {/* Background Hero Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=80"
          alt="Luxury Interior"
          className="w-full h-full object-cover filter brightness-25 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D1410] via-[#0D1410]/80 to-transparent" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        
        <span className="inline-flex items-center gap-2 bg-[#B08D57]/10 px-4 py-1.5 rounded-full border border-[#B08D57]/30 text-xs font-mono font-semibold text-[#B08D57]">
          <Sparkles className="w-3.5 h-3.5" />
          ELEVATE YOUR LIFESTYLE TODAY
        </span>

        <h2 className="font-serif-fraunces font-extrabold text-4xl sm:text-6xl text-[#EFEAE1] tracking-tight leading-tight">
          Your Next Chapter <br />
          <span className="text-[#B08D57] italic">Starts Here.</span>
        </h2>

        <p className="text-sm sm:text-base text-gray-300 max-w-xl mx-auto font-light">
          Whether seeking an architectural sanctuary or high-yield investment, let our AI platform match you with exceptional real estate assets.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <a
            href="#properties"
            onClick={onExplore}
            className="bg-[#B08D57] hover:bg-[#c29d63] text-[#0D1410] font-bold text-xs sm:text-sm px-8 py-4 rounded-xl shadow-2xl transition-all flex items-center gap-2 font-sans"
          >
            <Compass className="w-4 h-4" />
            Explore Properties
          </a>

          <button
            onClick={onOpenAiChat}
            className="bg-[#16231C] text-[#EFEAE1] font-semibold text-xs sm:text-sm px-8 py-4 rounded-xl border border-[#B08D57]/40 hover:border-[#B08D57] transition-all flex items-center gap-2 font-sans"
          >
            <MessageSquare className="w-4 h-4 text-[#B08D57]" />
            Talk to an Advisor
          </button>
        </div>

      </div>
    </section>
  );
}
