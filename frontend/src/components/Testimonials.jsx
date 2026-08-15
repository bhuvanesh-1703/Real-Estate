import React, { useState } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { TESTIMONIALS } from '../data/mockData';

export default function Testimonials() {
  const [activeIdx, setActiveIdx] = useState(0);

  const prev = () => {
    setActiveIdx((prevIdx) => (prevIdx === 0 ? TESTIMONIALS.length - 1 : prevIdx - 1));
  };

  const next = () => {
    setActiveIdx((prevIdx) => (prevIdx === TESTIMONIALS.length - 1 ? 0 : prevIdx + 1));
  };

  const t = TESTIMONIALS[activeIdx];

  return (
    <section className="py-20 bg-[#0D1410] blueprint-grid relative text-[#EFEAE1]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center space-y-2 mb-12">
          <span className="text-xs uppercase font-mono font-bold text-[#B08D57] tracking-widest">
            Client Testimonials
          </span>
          <h2 className="font-serif-fraunces text-3xl sm:text-4xl font-extrabold text-[#EFEAE1]">
            Endorsed by Discerning Buyers
          </h2>
        </div>

        {/* Carousel Card Container */}
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-[#B08D57]/20 relative shadow-2xl">
          <Quote className="w-12 h-12 text-[#B08D57]/20 absolute top-6 left-6" />

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <img
              src={t.photo}
              alt={t.name}
              className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-2 border-[#B08D57] shadow-xl shrink-0"
            />

            <div className="space-y-4 text-center md:text-left flex-1">
              <div className="flex justify-center md:justify-start gap-1">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#B08D57] text-[#B08D57]" />
                ))}
              </div>

              <p className="text-sm sm:text-base text-gray-200 italic leading-relaxed font-light">
                "{t.review}"
              </p>

              <div>
                <h4 className="font-serif-fraunces font-bold text-base text-[#EFEAE1]">{t.name}</h4>
                <p className="text-xs text-gray-400 font-mono">{t.role}</p>
                <span className="text-[11px] text-[#B08D57] font-mono font-medium block pt-1">
                  Purchased: {t.property}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex justify-between items-center pt-8 border-t border-white/10 mt-8 font-mono">
            <div className="flex gap-2">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIdx(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    activeIdx === i ? 'bg-[#B08D57] w-6' : 'bg-white/20'
                  }`}
                />
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={prev}
                className="p-2.5 rounded-xl bg-[#16231C] hover:bg-[#B08D57] text-[#EFEAE1] hover:text-[#0D1410] transition-colors border border-[#B08D57]/30"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={next}
                className="p-2.5 rounded-xl bg-[#16231C] hover:bg-[#B08D57] text-[#EFEAE1] hover:text-[#0D1410] transition-colors border border-[#B08D57]/30"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
