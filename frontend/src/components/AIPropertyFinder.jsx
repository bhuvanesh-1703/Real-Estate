import React, { useState } from 'react';
import { Sparkles, CheckCircle2, Sliders, ArrowRight, Zap } from 'lucide-react';
import { PROPERTIES } from '../data/mockData';
import { sendAiRecommendAPI } from '../services/api';

export default function AIPropertyFinder({ onSelectProperty }) {
  const [prompt, setPrompt] = useState('');
  const [extractedData, setExtractedData] = useState(null);
  const [recommendations, setRecommendations] = useState(PROPERTIES.slice(0, 3));
  const [isSearching, setIsSearching] = useState(false);

  const handleAISearch = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsSearching(true);

    const apiRes = await sendAiRecommendAPI(prompt);

    const lower = prompt.toLowerCase();
    const budget = lower.includes('50') || lower.includes('50l') ? '₹50 Lakhs' : lower.includes('75') ? '₹75 Lakhs' : '₹1.5 Crore';
    const propertyType = lower.includes('villa') ? 'Villa' : lower.includes('apartment') ? 'Apartment' : lower.includes('plot') ? 'Plots' : 'All Luxury Types';
    const bhk = lower.includes('2bhk') ? '2 BHK' : lower.includes('3bhk') ? '3 BHK' : lower.includes('4bhk') ? '4 BHK' : '3+ BHK';
    const location = lower.includes('madurai') ? 'Madurai Prime Areas' : 'Anna Nagar Corridor';
    const purpose = lower.includes('investment') || lower.includes('rental') ? 'Capital Appreciation & Rental Yield' : 'Primary Residence';

    setExtractedData({
      budget,
      propertyType,
      bhk,
      location,
      purpose,
      preferences: apiRes?.matchReasons ? apiRes.matchReasons.join(' • ') : "Gated Security, Smart Home Connectivity"
    });

    let matched = PROPERTIES;
    if (propertyType !== 'All Luxury Types') {
      matched = PROPERTIES.filter(p => p.type === propertyType || p.type.includes(propertyType));
    }
    if (matched.length === 0) matched = PROPERTIES;

    setRecommendations(matched);
    setIsSearching(false);
  };

  return (
    <section id="ai-finder" className="py-20 relative bg-[#0D1410] blueprint-grid text-[#EFEAE1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 bg-[#B08D57]/10 px-3.5 py-1.5 rounded-full border border-[#B08D57]/30 text-xs font-mono font-semibold text-[#B08D57]">
            <Sparkles className="w-3.5 h-3.5" />
            INTELLIGENT MATCHMAKING ENGINE
          </div>
          <h2 className="font-serif-fraunces text-3xl sm:text-5xl font-extrabold text-[#EFEAE1] tracking-tight">
            Tell Us What You’re Looking For.
          </h2>
          <p className="text-sm text-[#8A9186] font-light">
            Type your requirements in conversational plain language. Our neural algorithm analyzes pricing models, floor plans, and locational yield to tailor choices.
          </p>
        </div>

        {/* Input Interface */}
        <div className="max-w-3xl mx-auto mb-12">
          <form onSubmit={handleAISearch} className="glass-panel p-3 rounded-2xl border border-[#B08D57]/30 flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. 'I need a 2BHK apartment under ₹50L with high rental yield near Madurai'"
              className="flex-1 bg-transparent px-4 py-3 text-xs sm:text-sm text-[#EFEAE1] placeholder-gray-500 focus:outline-none font-mono"
            />
            <button
              type="submit"
              disabled={isSearching}
              className="bg-[#B08D57] hover:bg-[#c29d63] text-[#0D1410] font-bold text-xs sm:text-sm px-6 py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shrink-0"
            >
              {isSearching ? (
                <>
                  <Zap className="w-4 h-4 animate-bounce" />
                  Extracting Parameters...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Analyze Requirements
                </>
              )}
            </button>
          </form>

          {/* Preset Prompts */}
          <div className="flex flex-wrap gap-2 mt-3 text-[11px] justify-center text-gray-400 font-mono">
            <span className="text-gray-500">Quick examples:</span>
            <button
              onClick={() => {
                setPrompt("I need a 2BHK apartment under ₹50L.");
              }}
              className="hover:text-[#B08D57] transition-colors"
            >
              "2BHK apartment under ₹50L"
            </button>
            <span>•</span>
            <button
              onClick={() => {
                setPrompt("Show villas near Madurai with good road connectivity.");
              }}
              className="hover:text-[#B08D57] transition-colors"
            >
              "Villas near Madurai"
            </button>
            <span>•</span>
            <button
              onClick={() => {
                setPrompt("I want an investment property with high rental potential.");
              }}
              className="hover:text-[#B08D57] transition-colors"
            >
              "High rental potential"
            </button>
          </div>
        </div>

        {/* AI Extracted Attributes Breakdown */}
        {extractedData && (
          <div className="glass-panel p-6 rounded-2xl border border-[#B08D57]/40 mb-12 max-w-4xl mx-auto animate-in fade-in duration-300">
            <h4 className="text-xs uppercase font-mono font-bold text-[#B08D57] tracking-wider mb-4 flex items-center gap-2">
              <Sliders className="w-4 h-4" />
              Extracted Parameters by AI Engine
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-xs font-mono">
              <div className="bg-[#0D1410]/60 p-3 rounded-xl">
                <span className="text-[10px] text-gray-400 block">Target Budget</span>
                <span className="font-semibold text-[#EFEAE1]">{extractedData.budget}</span>
              </div>
              <div className="bg-[#0D1410]/60 p-3 rounded-xl">
                <span className="text-[10px] text-gray-400 block">Property Type</span>
                <span className="font-semibold text-[#EFEAE1]">{extractedData.propertyType}</span>
              </div>
              <div className="bg-[#0D1410]/60 p-3 rounded-xl">
                <span className="text-[10px] text-gray-400 block">BHK Specs</span>
                <span className="font-semibold text-[#EFEAE1]">{extractedData.bhk}</span>
              </div>
              <div className="bg-[#0D1410]/60 p-3 rounded-xl">
                <span className="text-[10px] text-gray-400 block">Location Zone</span>
                <span className="font-semibold text-[#EFEAE1]">{extractedData.location}</span>
              </div>
              <div className="bg-[#0D1410]/60 p-3 rounded-xl col-span-2 sm:col-span-1">
                <span className="text-[10px] text-gray-400 block">Key Purpose</span>
                <span className="font-semibold text-[#B08D57]">{extractedData.purpose}</span>
              </div>
            </div>
          </div>
        )}

        {/* Recommendations Display */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-serif-fraunces text-lg font-bold text-[#EFEAE1] flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#5C7A63]" />
              <span>{recommendations.length} properties match your requirements</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recommendations.map((prop) => (
              <div
                key={prop.id}
                className="glass-card rounded-2xl p-4 border border-[#B08D57]/20 flex flex-col justify-between hover:border-[#B08D57]/60 transition-all group"
              >
                <div>
                  <div className="relative h-48 rounded-xl overflow-hidden mb-4 bg-[#16231C]">
                    <img src={prop.image} alt={prop.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-2 right-2 bg-[#0D1410]/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] text-[#B08D57] font-mono font-semibold border border-[#B08D57]/40">
                      {prop.matchScore}% Match
                    </div>
                  </div>

                  <span className="text-[10px] text-gray-400 uppercase tracking-wider font-mono font-semibold">{prop.type}</span>
                  <h4 className="font-serif-fraunces font-bold text-base text-[#EFEAE1] group-hover:text-[#B08D57] transition-colors">{prop.title}</h4>
                  <p className="text-xs text-gray-400 mt-1 font-mono">{prop.location}</p>

                  <div className="mt-3 p-3 rounded-xl bg-[#0D1410]/60 border border-white/5 text-[11px] space-y-1">
                    <span className="font-semibold text-[#B08D57] block font-mono">Why this property?</span>
                    <p className="text-gray-300 leading-tight font-light">{prop.matchReason}</p>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between">
                  <span className="font-serif-fraunces text-lg font-bold text-[#EFEAE1]">{prop.price}</span>
                  <button
                    onClick={() => onSelectProperty(prop)}
                    className="bg-[#B08D57] hover:bg-[#c29d63] text-[#0D1410] font-semibold text-xs px-4 py-2 rounded-xl transition-colors flex items-center gap-1"
                  >
                    <span>View Property</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
