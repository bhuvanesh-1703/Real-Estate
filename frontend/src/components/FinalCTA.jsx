import React from 'react';
import { Compass, MessageSquare, Sparkles } from 'lucide-react';

export default function FinalCTA({ onExplore, onOpenAiChat }) {
  return (
    <section className="relative py-28 overflow-hidden bg-[#0F172A] blueprint-grid border-t border-slate-700/60 text-[#F8FAFC]">
      
      {/* Background Hero Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=80"
          alt="Luxury Interior"
          className="w-full h-full object-cover filter brightness-25 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/80 to-transparent" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        
        <span className="inline-flex items-center gap-2 bg-sky-500/10 px-4 py-1.5 rounded-full border border-sky-500/30 text-xs font-mono font-semibold text-sky-400">
          <Sparkles className="w-3.5 h-3.5" />
          ELEVATE YOUR LIFESTYLE TODAY
        </span>

        <h2 className="font-serif-fraunces font-extrabold text-4xl sm:text-6xl text-white tracking-tight leading-tight">
          Your Next Chapter <br />
          <span className="text-sky-400 italic">Starts Here.</span>
        </h2>

        <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto font-light">
          Whether seeking an architectural sanctuary or high-yield investment, let our AI platform match you with exceptional real estate assets.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <a
            href="#properties"
            onClick={onExplore}
            className="bg-gradient-to-r from-blue-600 via-sky-500 to-indigo-600 hover:from-blue-500 hover:to-sky-400 text-white font-bold text-xs sm:text-sm px-8 py-4 rounded-xl shadow-lg shadow-blue-500/25 transition-all flex items-center gap-2 font-sans"
          >
            <Compass className="w-4 h-4" />
            Explore Properties
          </a>

          <button
            onClick={onOpenAiChat}
            className="bg-[#1E293B] text-white font-semibold text-xs sm:text-sm px-8 py-4 rounded-xl border border-slate-700 hover:border-sky-500/60 transition-all flex items-center gap-2 font-sans"
          >
            <MessageSquare className="w-4 h-4 text-sky-400" />
            Talk to an Advisor
          </button>
        </div>

      </div>
    </section>
  );
}
