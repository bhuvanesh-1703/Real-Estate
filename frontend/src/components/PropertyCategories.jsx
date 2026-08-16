import React, { useState, useEffect } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { fetchCategoriesAPI } from '../services/api';
import { CATEGORIES as FALLBACK_CATEGORIES } from '../data/mockData';

export default function PropertyCategories({ onSelectCategory }) {
  const [categories, setCategories] = useState(FALLBACK_CATEGORIES);

  useEffect(() => {
    async function loadCategories() {
      const data = await fetchCategoriesAPI();
      if (data && Array.isArray(data) && data.length > 0) {
        setCategories(data);
      }
    }
    loadCategories();
  }, []);

  return (
    <section className="py-20 bg-[#0F172A] blueprint-grid relative text-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs uppercase font-mono font-bold tracking-widest text-sky-400">
              Tailored Portfolios
            </span>
            <h2 className="font-serif-fraunces text-3xl sm:text-4xl font-extrabold text-white mt-1">
              Explore Property Categories
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md font-light">
            From high-growth commercial assets to secluded luxury villas, discover real estate assets curated for your lifestyle.
          </p>
        </div>

        {/* Category Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat.name)}
              className="relative h-72 rounded-3xl overflow-hidden group cursor-pointer border border-slate-700/60 glass-card bg-[#1E293B]/70"
            >
              {/* Image */}
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 filter brightness-75 group-hover:brightness-90"
              />

              {/* Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/40 to-transparent" />

              {/* Text Content */}
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                <div>
                  <span className="text-xs font-mono font-semibold text-sky-400 block mb-1">
                    {cat.count}
                  </span>
                  <h3 className="font-serif-fraunces text-xl font-bold text-white group-hover:text-sky-400 transition-colors">
                    {cat.name}
                  </h3>
                </div>

                <div className="w-10 h-10 rounded-full bg-[#0F172A]/80 group-hover:bg-sky-400 text-white group-hover:text-slate-950 flex items-center justify-center transition-all duration-300 transform group-hover:rotate-45 border border-sky-500/40">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
