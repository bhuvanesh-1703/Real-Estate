import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, Eye, Check } from 'lucide-react';
import { fetchShowcaseAPI } from '../services/api';
import { SHOWCASE_STAGES as FALLBACK_STAGES } from '../data/mockData';

export default function PremiumShowcase({ onBookVisit }) {
  const [stages, setStages] = useState(FALLBACK_STAGES);
  const [activeStage, setActiveStage] = useState(0);

  useEffect(() => {
    async function loadShowcaseStages() {
      const data = await fetchShowcaseAPI();
      if (data && Array.isArray(data) && data.length > 0) {
        setStages(data);
      }
    }
    loadShowcaseStages();
  }, []);

  const currentStage = stages[activeStage] || stages[0];

  return (
    <section className="py-24 bg-[#0F172A] blueprint-grid relative overflow-hidden text-[#F8FAFC]">
      
      {/* Background Accent Glow */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase font-mono font-bold tracking-widest text-sky-400 inline-flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            CINEMATIC FLAGSHIP SHOWCASE
          </span>
          <h2 className="font-serif-fraunces text-3xl sm:text-5xl font-extrabold text-white">
            The Celestia Grand Villa
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-light">
            Experience our flagship ₹1.45 Cr villa through interactive stage inspection.
          </p>
        </div>

        {/* Stage Selector Pills */}
        <div className="flex justify-start sm:justify-center overflow-x-auto gap-2 pb-6 mb-8 scrollbar-none">
          {stages.map((stg, index) => (
            <button
              key={index}
              onClick={() => setActiveStage(index)}
              className={`px-5 py-2.5 rounded-full text-xs font-mono font-semibold whitespace-nowrap transition-all duration-300 border ${
                activeStage === index
                  ? 'bg-gradient-to-r from-blue-600 to-sky-500 text-white border-sky-400 shadow-lg shadow-blue-500/25 font-bold'
                  : 'bg-[#1E293B] text-slate-300 border-slate-700 hover:border-sky-500/40'
              }`}
            >
              {stg.stage}
            </button>
          ))}
        </div>

        {/* Main Stage Display Area */}
        {currentStage && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center glass-panel p-6 sm:p-8 rounded-3xl border border-slate-700/60 shadow-2xl bg-[#1E293B]/80">
            
            {/* Stage Visual */}
            <div className="lg:col-span-7 relative h-[380px] sm:h-[480px] rounded-2xl overflow-hidden bg-[#0F172A] border border-slate-700">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeStage}
                  src={currentStage.image}
                  alt={currentStage.title}
                  initial={{ opacity: 0, scale: 1.08 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.6 }}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>

              <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-transparent opacity-70" />

              <div className="absolute bottom-4 left-4 bg-[#0F172A]/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700 text-[11px] text-slate-300 flex items-center gap-2 font-mono">
                <Eye className="w-3.5 h-3.5 text-sky-400" />
                Stage {activeStage + 1} of {stages.length}
              </div>
            </div>

            {/* Stage Details */}
            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-2">
                <span className="text-xs uppercase font-mono font-bold text-sky-400 tracking-wider">
                  {currentStage.stage}
                </span>
                <h3 className="font-serif-fraunces text-2xl sm:text-3xl font-extrabold text-white">
                  {currentStage.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light pt-2">
                  {currentStage.desc}
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800 text-xs text-slate-300 font-mono">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-sky-400" />
                  <span>3,800 sq.ft Italian Marble Construction</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-sky-400" />
                  <span>Private Heated Plunge Pool & Deck</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-sky-400" />
                  <span>Full Smart Home Automation Integration</span>
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={onBookVisit}
                  className="bg-gradient-to-r from-blue-600 via-sky-500 to-indigo-600 hover:from-blue-500 hover:to-sky-400 text-white font-bold text-xs px-6 py-3.5 rounded-xl transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2"
                >
                  <span>Schedule Private VIP Tour</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        )}

      </div>
    </section>
  );
}
