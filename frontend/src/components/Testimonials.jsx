import React, { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { fetchTestimonialsAPI } from '../services/api';
import { TESTIMONIALS as FALLBACK_TESTIMONIALS } from '../data/mockData';

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState(FALLBACK_TESTIMONIALS);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    async function loadTestimonials() {
      const data = await fetchTestimonialsAPI();
      if (data && Array.isArray(data) && data.length > 0) {
        setTestimonials(data);
      }
    }
    loadTestimonials();
  }, []);

  const prev = () => {
    setActiveIdx((prevIdx) => (prevIdx === 0 ? testimonials.length - 1 : prevIdx - 1));
  };

  const next = () => {
    setActiveIdx((prevIdx) => (prevIdx === testimonials.length - 1 ? 0 : prevIdx + 1));
  };

  const t = testimonials[activeIdx] || testimonials[0];

  return (
    <section className="py-20 bg-[#0F172A] blueprint-grid relative text-[#F8FAFC]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center space-y-2 mb-12">
          <span className="text-xs uppercase font-mono font-bold text-sky-400 tracking-widest">
            Client Testimonials
          </span>
          <h2 className="font-serif-fraunces text-3xl sm:text-4xl font-extrabold text-white">
            Endorsed by Discerning Buyers
          </h2>
        </div>

        {/* Carousel Card Container */}
        {t && (
          <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-slate-700/60 relative shadow-2xl bg-[#1E293B]/80">
            <Quote className="w-12 h-12 text-sky-400/20 absolute top-6 left-6" />

            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
              <img
                src={t.photo}
                alt={t.name}
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-2 border-sky-400 shadow-xl shrink-0"
              />

              <div className="space-y-4 text-center md:text-left flex-1">
                <div className="flex justify-center md:justify-start gap-1">
                  {[...Array(t.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-sky-400 text-sky-400" />
                  ))}
                </div>

                <p className="text-sm sm:text-base text-slate-200 italic leading-relaxed font-light">
                  "{t.review}"
                </p>

                <div>
                  <h4 className="font-serif-fraunces font-bold text-base text-white">{t.name}</h4>
                  <p className="text-xs text-slate-400 font-mono">{t.role}</p>
                  <span className="text-[11px] text-sky-400 font-mono font-medium block pt-1">
                    Purchased: {t.property}
                  </span>
                </div>
              </div>
            </div>

            {/* Navigation Controls */}
            <div className="flex justify-between items-center pt-8 border-t border-slate-800 mt-8 font-mono">
              <div className="flex gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveIdx(i)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      activeIdx === i ? 'bg-sky-400 w-6' : 'bg-slate-700'
                    }`}
                  />
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={prev}
                  className="p-2.5 rounded-xl bg-[#0F172A] hover:bg-sky-500 text-slate-200 hover:text-slate-950 transition-colors border border-slate-700"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={next}
                  className="p-2.5 rounded-xl bg-[#0F172A] hover:bg-sky-500 text-slate-200 hover:text-slate-950 transition-colors border border-slate-700"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        )}

      </div>
    </section>
  );
}
