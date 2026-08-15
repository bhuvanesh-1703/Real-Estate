import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Search, ArrowRight, Compass } from 'lucide-react';

export default function Hero({ onSearchSubmit, onExploreClick }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearchSubmit) {
      onSearchSubmit(query);
    }
  };

  const setExampleQuery = (text) => {
    setQuery(text);
    if (onSearchSubmit) {
      onSearchSubmit(text);
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden bg-[#0D1410] blueprint-grid text-[#EFEAE1]">
      {/* Background Image Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=90"
          alt="Luxury Villa"
          className="w-full h-full object-cover scale-105 filter brightness-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D1410] via-[#0D1410]/70 to-transparent" />
      </div>

      {/* Floating Light Accent */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#B08D57]/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 bg-[#16231C]/90 backdrop-blur-md px-4 py-2 rounded-full border border-[#B08D57]/30 text-xs font-mono text-[#B08D57]"
        >
          <Sparkles className="w-4 h-4 animate-spin text-[#B08D57]" />
          <span>AI-POWERED REAL ESTATE DISCOVERY PLATFORM</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-serif-fraunces font-extrabold text-4xl sm:text-6xl md:text-7xl text-[#EFEAE1] tracking-tight leading-tight"
        >
          Find a Place That <br />
          <span className="text-[#B08D57] italic">Feels Like Home.</span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-base sm:text-lg text-[#8A9186] max-w-2xl mx-auto font-light leading-relaxed"
        >
          Discover premium homes, villas, apartments and investment properties with intelligent property recommendations.
        </motion.p>

        {/* AI Search Bar Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="max-w-3xl mx-auto pt-4"
        >
          <form
            onSubmit={handleSubmit}
            className="glass-panel p-2 sm:p-3 rounded-2xl sm:rounded-3xl border border-[#B08D57]/40 shadow-2xl flex flex-col sm:flex-row items-center gap-3"
          >
            <div className="flex items-center gap-3 px-4 w-full flex-1">
              <Sparkles className="w-5 h-5 text-[#B08D57] shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="What are you looking for? (e.g. 'I need a 3BHK villa under ₹75 lakhs near Madurai')"
                className="w-full bg-transparent text-[#EFEAE1] text-xs sm:text-sm placeholder-gray-500 focus:outline-none py-2 font-mono"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto bg-[#B08D57] hover:bg-[#c29d63] text-[#0D1410] font-bold text-xs sm:text-sm px-6 py-3.5 rounded-xl sm:rounded-2xl transition-all flex items-center justify-center gap-2 shrink-0 shadow-lg"
            >
              <Search className="w-4 h-4" />
              <span>AI Search</span>
            </button>
          </form>

          {/* Quick Examples */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4 text-[11px] text-gray-400 font-mono">
            <span className="text-gray-500 font-medium">Try asking:</span>
            <button
              onClick={() => setExampleQuery("I need a 3BHK villa under ₹75 lakhs near Madurai")}
              className="bg-[#16231C] hover:bg-[#203127] px-3 py-1 rounded-full border border-white/10 transition-colors"
            >
              "3BHK villa under ₹75L"
            </button>
            <button
              onClick={() => setExampleQuery("Show apartments with high rental yield")}
              className="bg-[#16231C] hover:bg-[#203127] px-3 py-1 rounded-full border border-white/10 transition-colors"
            >
              "High rental yield"
            </button>
            <button
              onClick={() => setExampleQuery("DTCP plots near Ring Road")}
              className="bg-[#16231C] hover:bg-[#203127] px-3 py-1 rounded-full border border-white/10 transition-colors"
            >
              "DTCP Plots"
            </button>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-4 pt-4"
        >
          <a
            href="#properties"
            onClick={onExploreClick}
            className="bg-[#16231C] hover:bg-[#203127] text-[#EFEAE1] font-semibold text-xs sm:text-sm px-6 py-3.5 rounded-xl border border-[#B08D57]/30 backdrop-blur-md transition-all flex items-center gap-2"
          >
            <Compass className="w-4 h-4 text-[#B08D57]" />
            Explore Properties
          </a>
          <a
            href="#ai-finder"
            className="text-xs sm:text-sm text-gray-300 hover:text-[#B08D57] font-medium transition-colors flex items-center gap-1.5 py-3 font-mono"
          >
            Find My Property
            <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>

        {/* Trust Badges */}
        <div className="pt-12 grid grid-cols-2 sm:grid-cols-4 gap-6 text-left border-t border-[#B08D57]/20 max-w-4xl mx-auto font-mono">
          <div>
            <span className="text-2xl font-bold text-[#EFEAE1] font-serif-fraunces">100%</span>
            <p className="text-[11px] text-gray-400">RERA Verified listings</p>
          </div>
          <div>
            <span className="text-2xl font-bold text-[#EFEAE1] font-serif-fraunces">₹250Cr+</span>
            <p className="text-[11px] text-gray-400">Property portfolio value</p>
          </div>
          <div>
            <span className="text-2xl font-bold text-[#EFEAE1] font-serif-fraunces">0%</span>
            <p className="text-[11px] text-gray-400">Hidden brokerage fees</p>
          </div>
          <div>
            <span className="text-2xl font-bold text-[#EFEAE1] font-serif-fraunces">4.9/5</span>
            <p className="text-[11px] text-gray-400">Customer satisfaction rating</p>
          </div>
        </div>

      </div>
    </section>
  );
}
