import React from 'react';
import { Heart, MapPin, Bed, Maximize2, Sparkles, ArrowUpRight } from 'lucide-react';

export default function PropertyCard({ property, onSelect, onFavoriteToggle, isFavorite }) {
  const standoutFeatures = property.features || ['Smart Automation', 'Private Terrace'];

  return (
    <div className="glass-card rounded-2xl overflow-hidden group flex flex-col h-full border border-slate-700/60 hover:border-sky-500/60 transition-all duration-300 relative bg-[#1E293B]/70">
      
      {/* Image Container with Zoom Effect */}
      <div className="relative h-60 overflow-hidden bg-[#0F172A]">
        <img
          src={property.image}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-transparent opacity-90" />

        {/* Status & Type Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="bg-[#0F172A]/90 backdrop-blur-md text-sky-400 text-[10px] uppercase font-mono font-bold tracking-wider px-3 py-1 rounded-full border border-sky-500/40">
            {property.type}
          </span>
          <span
            className={`text-[10px] font-mono font-bold px-3 py-1 rounded-full backdrop-blur-md ${
              property.status === 'Available'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                : 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
            }`}
          >
            {property.status}
          </span>
        </div>

        {/* Blueprint Floating Annotation Tag on Hover */}
        <div className="absolute bottom-12 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="bg-[#1E293B]/95 backdrop-blur-md border border-sky-500/50 px-2.5 py-1 rounded-lg text-[9px] font-mono text-white flex items-center gap-1.5 shadow-lg">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
            <span>{standoutFeatures[0]}</span>
          </div>
        </div>

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onFavoriteToggle(property.id || property._id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all ${
            isFavorite
              ? 'bg-rose-500 text-white'
              : 'bg-[#0F172A]/80 text-white hover:bg-sky-500 hover:text-slate-950'
          }`}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
        </button>

        {/* Price Tag */}
        <div className="absolute bottom-3 left-3">
          <span className="text-xl font-serif-fraunces font-extrabold text-white tracking-wide">
            {property.price}
          </span>
        </div>
      </div>

      {/* Content Info */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1 font-mono">
            <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <span>{property.location}</span>
          </div>
          <h3 className="font-serif-fraunces font-bold text-base text-white group-hover:text-sky-400 transition-colors line-clamp-1">
            {property.title}
          </h3>
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-2 gap-2 py-3 border-y border-slate-700/60 text-xs text-slate-300 font-mono">
          {property.bhk > 0 && (
            <div className="flex items-center gap-2">
              <Bed className="w-4 h-4 text-slate-400" />
              <span>{property.bhk} BHK Suite</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Maximize2 className="w-4 h-4 text-slate-400" />
            <span>{property.area}</span>
          </div>
        </div>

        {/* Action CTA */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-[11px] text-sky-400 font-mono font-medium flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            AI Matched
          </span>
          <button
            onClick={() => onSelect(property)}
            className="bg-[#0F172A] group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-sky-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all flex items-center gap-1 border border-slate-700 group-hover:border-sky-500 shadow-md"
          >
            <span>View Details</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
