import React, { useState } from 'react';
import { MapPin, Filter, Layers, Navigation, ArrowUpRight, X } from 'lucide-react';
import { PROPERTIES } from '../data/mockData';

export default function PropertyMap({ onSelectProperty }) {
  const [selectedLocationFilter, setSelectedLocationFilter] = useState('All');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('All');
  const [selectedBhkFilter, setSelectedBhkFilter] = useState('All');
  const [activeMarkerProperty, setActiveMarkerProperty] = useState(PROPERTIES[0]);

  const mapPins = PROPERTIES.filter(p => {
    if (selectedLocationFilter !== 'All' && !p.location.includes(selectedLocationFilter)) return false;
    if (selectedTypeFilter !== 'All' && p.type !== selectedTypeFilter) return false;
    if (selectedBhkFilter !== 'All' && p.bhk !== Number(selectedBhkFilter)) return false;
    return true;
  });

  return (
    <section className="py-20 bg-[#0B0F17] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full text-xs font-semibold text-[#D4AF37] border border-white/10 mb-3">
              <Navigation className="w-3.5 h-3.5" />
              GEOSPATIAL PROPTECH DISCOVERY
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white">
              Interactive Property Map
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              Explore luxury estates mapped across prime corridors of Madurai.
            </p>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap gap-2 text-xs">
            <select
              value={selectedLocationFilter}
              onChange={(e) => setSelectedLocationFilter(e.target.value)}
              className="bg-[#151C28] text-gray-200 border border-white/10 rounded-xl px-3 py-2 focus:outline-none focus:border-[#D4AF37]"
            >
              <option value="All">All Locations</option>
              <option value="Anna Nagar">Anna Nagar</option>
              <option value="KK Nagar">KK Nagar</option>
              <option value="Koodal Nagar">Koodal Nagar</option>
              <option value="TVS Nagar">TVS Nagar</option>
              <option value="Ring Road">Ring Road</option>
            </select>

            <select
              value={selectedTypeFilter}
              onChange={(e) => setSelectedTypeFilter(e.target.value)}
              className="bg-[#151C28] text-gray-200 border border-white/10 rounded-xl px-3 py-2 focus:outline-none focus:border-[#D4AF37]"
            >
              <option value="All">All Types</option>
              <option value="Villa">Villa</option>
              <option value="Apartment">Apartment</option>
              <option value="Plots">Plots</option>
              <option value="Independent Houses">Independent Houses</option>
            </select>

            <select
              value={selectedBhkFilter}
              onChange={(e) => setSelectedBhkFilter(e.target.value)}
              className="bg-[#151C28] text-gray-200 border border-white/10 rounded-xl px-3 py-2 focus:outline-none focus:border-[#D4AF37]"
            >
              <option value="All">All BHKs</option>
              <option value="2">2 BHK</option>
              <option value="3">3 BHK</option>
              <option value="4">4 BHK</option>
              <option value="5">5 BHK</option>
            </select>
          </div>
        </div>

        {/* Map Blueprint Grid Canvas */}
        <div className="relative h-[520px] rounded-3xl overflow-hidden border border-white/10 glass-panel shadow-2xl">
          
          {/* Stylized Dark Map Background */}
          <div className="absolute inset-0 bg-[#0F172A] bg-[radial-gradient(#1E293B_1px,transparent_1px)] [background-size:24px_24px] opacity-90">
            {/* Simulated Road Lines & Grid Map Markings */}
            <svg className="w-full h-full opacity-20 pointer-events-none stroke-gray-400">
              <path d="M 0 100 Q 300 200 600 150 T 1200 400" fill="none" strokeWidth="3" strokeDasharray="6 6" />
              <path d="M 200 0 Q 400 300 800 600" fill="none" strokeWidth="2" />
              <circle cx="450" cy="220" r="180" fill="none" stroke="#D4AF37" strokeWidth="1" strokeDasharray="4 4" />
            </svg>
          </div>

          {/* Map Overlay Cluster Label */}
          <div className="absolute top-4 left-4 bg-[#0B0F17]/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-xs text-gray-300 flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#D4AF37]" />
            <span>Madurai Metropolitan Grid ({mapPins.length} Listed)</span>
          </div>

          {/* Interactive Property Pin Markers */}
          <div className="absolute inset-0 p-8 sm:p-16 flex flex-wrap items-center justify-around gap-12 pointer-events-auto">
            {mapPins.map((prop, idx) => (
              <div key={prop.id} className="relative group cursor-pointer">
                
                {/* Pin Button */}
                <button
                  onClick={() => setActiveMarkerProperty(prop)}
                  className={`relative z-10 flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-300 shadow-xl ${
                    activeMarkerProperty?.id === prop.id
                      ? 'bg-[#D4AF37] text-black border-[#D4AF37] scale-110 font-bold'
                      : 'bg-[#151C28]/90 text-white border-white/20 hover:border-[#D4AF37] hover:scale-105'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  <span className="text-xs font-semibold">{prop.price}</span>
                </button>

                {/* Radar Pulse Effect */}
                <span className="absolute -top-1 -left-1 flex h-full w-full pointer-events-none">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4AF37] opacity-20"></span>
                </span>
              </div>
            ))}
          </div>

          {/* Compact Property Preview Modal Popup */}
          {activeMarkerProperty && (
            <div className="absolute bottom-6 left-6 right-6 sm:left-auto sm:right-6 sm:w-96 glass-panel p-4 rounded-2xl border border-[#D4AF37]/40 shadow-2xl animate-in slide-in-from-bottom-4 duration-300 z-30">
              <div className="flex items-start justify-between pb-3">
                <span className="text-[10px] uppercase font-bold text-[#D4AF37] tracking-wider">
                  Selected Map Node
                </span>
                <button
                  onClick={() => setActiveMarkerProperty(null)}
                  className="text-gray-400 hover:text-white p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex gap-4">
                <img
                  src={activeMarkerProperty.image}
                  alt={activeMarkerProperty.title}
                  className="w-24 h-24 rounded-xl object-cover"
                />
                <div className="flex-1 space-y-1">
                  <h4 className="font-heading font-bold text-sm text-white line-clamp-1">
                    {activeMarkerProperty.title}
                  </h4>
                  <p className="text-xs text-gray-400">{activeMarkerProperty.location}</p>
                  <p className="text-xs font-bold text-[#D4AF37]">{activeMarkerProperty.price}</p>
                  <div className="text-[10px] text-gray-400 pt-1">
                    {activeMarkerProperty.bhk > 0 ? `${activeMarkerProperty.bhk} BHK • ` : ''}
                    {activeMarkerProperty.area}
                  </div>
                </div>
              </div>

              <button
                onClick={() => onSelectProperty(activeMarkerProperty)}
                className="w-full mt-4 bg-white/10 hover:bg-[#D4AF37] text-white hover:text-black font-semibold text-xs py-2.5 rounded-xl border border-white/10 transition-all flex items-center justify-center gap-1.5"
              >
                <span>View Property Details</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

        </div>
      </div>
    </section>
  );
}
