import React, { useState } from 'react';
import { Heart, MapPin, Bed, Maximize2, Sparkles, ArrowUpRight } from 'lucide-react';

export default function PropertyCard({ property, onSelect, onFavoriteToggle, isFavorite }) {
  return (
    <div className="glass-card rounded-2xl overflow-hidden group flex flex-col h-full border border-white/10 hover:border-[#D4AF37]/50 transition-all duration-300">
      
      {/* Image Container with Zoom Effect */}
      <div className="relative h-60 overflow-hidden bg-slate-800">
        <img
          src={property.image}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F17] via-transparent to-transparent opacity-80" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="bg-[#0B0F17]/80 backdrop-blur-md text-[#D4AF37] text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full border border-[#D4AF37]/30">
            {property.type}
          </span>
          <span
            className={`text-[10px] font-bold px-3 py-1 rounded-full backdrop-blur-md ${
              property.status === 'Available'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
            }`}
          >
            {property.status}
          </span>
        </div>

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onFavoriteToggle(property.id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all ${
            isFavorite
              ? 'bg-red-500 text-white'
              : 'bg-[#0B0F17]/60 text-white hover:bg-[#D4AF37] hover:text-black'
          }`}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
        </button>

        {/* Price Tag */}
        <div className="absolute bottom-3 left-3">
          <span className="text-xl font-heading font-extrabold text-white tracking-wide">
            {property.price}
          </span>
        </div>
      </div>

      {/* Content Info */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1">
            <MapPin className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
            <span>{property.location}</span>
          </div>
          <h3 className="font-heading font-bold text-base text-white group-hover:text-[#D4AF37] transition-colors line-clamp-1">
            {property.title}
          </h3>
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-2 gap-2 py-3 border-y border-white/10 text-xs text-gray-300">
          {property.bhk > 0 && (
            <div className="flex items-center gap-2">
              <Bed className="w-4 h-4 text-gray-400" />
              <span>{property.bhk} BHK Suite</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Maximize2 className="w-4 h-4 text-gray-400" />
            <span>{property.area}</span>
          </div>
        </div>

        {/* Action CTA */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-[11px] text-[#D4AF37] font-medium flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            AI Matched
          </span>
          <button
            onClick={() => onSelect(property)}
            className="bg-white/5 group-hover:bg-[#D4AF37] text-white group-hover:text-black font-semibold text-xs px-4 py-2 rounded-xl transition-all flex items-center gap-1 border border-white/10 group-hover:border-[#D4AF37]"
          >
            <span>View Details</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
