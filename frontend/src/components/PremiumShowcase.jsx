import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, Eye, Check } from 'lucide-react';
import { SHOWCASE_STAGES } from '../data/mockData';

export default function PremiumShowcase({ onBookVisit }) {
  const [activeStage, setActiveStage] = useState(0);

  return (
    <section className="py-24 bg-[#07090F] relative overflow-hidden">
      
      {/* Background Accent Glow */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase font-bold tracking-widest text-[#D4AF37] inline-flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            CINEMATIC FLAGSHIP SHOWCASE
          </span>
          <h2 className="font-heading text-3xl sm:text-5xl font-extrabold text-white">
            The Celestia Grand Villa
          </h2>
          <p className="text-xs sm:text-sm text-gray-400">
            Experience our flagship ₹1.45 Cr villa through interactive stage inspection.
          </p>
        </div>

        {/* Stage Selector Pills */}
        <div className="flex justify-start sm:justify-center overflow-x-auto gap-2 pb-6 mb-8 scrollbar-none">
          {SHOWCASE_STAGES.map((stg, index) => (
            <button
              key={index}
              onClick={() => setActiveStage(index)}
              className={`px-5 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-300 border ${
                activeStage === index
                  ? 'bg-[#D4AF37] text-black border-[#D4AF37] shadow-lg shadow-[#D4AF37]/20 font-bold'
                  : 'bg-white/5 text-gray-300 border-white/10 hover:border-white/30'
              }`}
            >
              {stg.stage}
            </button>
          ))}
        </div>

        {/* Main Stage Display Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl">
          
          {/* Stage Visual */}
          <div className="lg:col-span-7 relative h-[380px] sm:h-[480px] rounded-2xl overflow-hidden bg-slate-900 border border-white/10">
            <AnimatePresence mode="wait">
              <motion.img
                key={activeStage}
                src={SHOWCASE_STAGES[activeStage].image}
                alt={SHOWCASE_STAGES[activeStage].title}
                initial={{ opacity: 0, scale: 1.08 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.6 }}
                className="w-full h-full object-cover"
              />
            </AnimatePresence>

            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F17] via-transparent to-transparent opacity-60" />

            <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-[11px] text-gray-300 flex items-center gap-2">
              <Eye className="w-3.5 h-3.5 text-[#D4AF37]" />
              Stage {activeStage + 1} of {SHOWCASE_STAGES.length}
            </div>
          </div>

          {/* Stage Details */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2">
              <span className="text-xs uppercase font-bold text-[#D4AF37] tracking-wider">
                {SHOWCASE_STAGES[activeStage].stage}
              </span>
              <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-white">
                {SHOWCASE_STAGES[activeStage].title}
              </h3>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed pt-2">
                {SHOWCASE_STAGES[activeStage].desc}
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-white/10 text-xs text-gray-300">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>3,800 sq.ft Italian Marble Construction</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Private Heated Plunge Pool & Deck</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Full Smart Home Automation Integration</span>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-3">
              <button
                onClick={onBookVisit}
                className="bg-[#D4AF37] hover:bg-amber-400 text-black font-bold text-xs px-6 py-3.5 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <span>Schedule Private VIP Tour</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
