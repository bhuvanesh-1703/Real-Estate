import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { CATEGORIES } from '../data/mockData';

export default function PropertyCategories({ onSelectCategory }) {
  return (
    <section className="py-20 bg-[#090D14] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-[#D4AF37]">
              Tailored Portfolios
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white mt-1">
              Explore Property Categories
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-gray-400 max-w-md">
            From high-growth commercial assets to secluded luxury villas, discover real estate assets curated for your lifestyle.
          </p>
        </div>

        {/* Category Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat.name)}
              className="relative h-72 rounded-3xl overflow-hidden group cursor-pointer border border-white/10 glass-card"
            >
              {/* Image */}
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 filter brightness-75 group-hover:brightness-90"
              />

              {/* Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F17] via-[#0B0F17]/30 to-transparent" />

              {/* Text Content */}
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                <div>
                  <span className="text-xs font-semibold text-[#D4AF37] block mb-1">
                    {cat.count}
                  </span>
                  <h3 className="font-heading text-xl font-bold text-white group-hover:text-[#D4AF37] transition-colors">
                    {cat.name}
                  </h3>
                </div>

                <div className="w-10 h-10 rounded-full bg-white/10 group-hover:bg-[#D4AF37] text-white group-hover:text-black flex items-center justify-center transition-all duration-300 transform group-hover:rotate-45">
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
