import React, { useState } from 'react';
import { MapPin, Layers, Navigation, ArrowUpRight, X } from 'lucide-react';
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
    <section className="py-20 bg-[#0D1410] blueprint-grid relative text-[#EFEAE1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#16231C] px-3 py-1 rounded-full text-xs font-mono font-semibold text-[#B08D57] border border-[#B08D57]/30 mb-3">
              <Navigation className="w-3.5 h-3.5" />
              GEOSPATIAL PROPTECH DISCOVERY
            </div>
            <h2 className="font-serif-fraunces text-3xl sm:text-4xl font-extrabold text-[#EFEAE1]">
              Interactive Property Map
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 mt-1 font-light">
              Explore luxury estates mapped across prime corridors of Madurai.
            </p>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap gap-2 text-xs font-mono">
            <select
              value={selectedLocationFilter}
              onChange={(e) => setSelectedLocationFilter(e.target.value)}
              className="bg-[#16231C] text-gray-200 border border-white/10 rounded-xl px-3 py-2 focus:outline-none focus:border-[#B08D57]"
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
              className="bg-[#16231C] text-gray-200 border border-white/10 rounded-xl px-3 py-2 focus:outline-none focus:border-[#B08D57]"
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
              className="bg-[#16231C] text-gray-200 border border-white/10 rounded-xl px-3 py-2 focus:outline-none focus:border-[#B08D57]"
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
        <div className="relative h-[520px] rounded-3xl overflow-hidden border border-[#B08D57]/20 glass-panel shadow-2xl">
          
          {/* Stylized Dark Map Background */}
          <div className="absolute inset-0 bg-[#0D1410] blueprint-grid opacity-90">
            <svg className="w-full h-full opacity-30 pointer-events-none stroke-[#B08D57]">
              <path d="M 0 100 Q 300 200 600 150 T 1200 400" fill="none" strokeWidth="3" strokeDasharray="6 6" />
              <path d="M 200 0 Q 400 300 800 600" fill="none" strokeWidth="2" />
              <circle cx="450" cy="220" r="180" fill="none" stroke="#B08D57" strokeWidth="1" strokeDasharray="4 4" />
            </svg>
          </div>

          {/* Map Overlay Cluster Label */}
          <div className="absolute top-4 left-4 bg-[#0D1410]/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-xs text-gray-300 flex items-center gap-2 font-mono">
            <Layers className="w-4 h-4 text-[#B08D57]" />
            <span>Madurai Metropolitan Grid ({mapPins.length} Listed)</span>
          </div>

          {/* Interactive Property Pin Markers */}
          <div className="absolute inset-0 p-8 sm:p-16 flex flex-wrap items-center justify-around gap-12 pointer-events-auto">
            {mapPins.map((prop) => (
              <div key={prop.id} className="relative group cursor-pointer">
                
                {/* Pin Button */}
                <button
                  onClick={() => setActiveMarkerProperty(prop)}
                  className={`relative z-10 flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-300 shadow-xl font-mono ${
                    activeMarkerProperty?.id === prop.id
                      ? 'bg-[#B08D57] text-[#0D1410] border-[#B08D57] scale-110 font-bold'
                      : 'bg-[#16231C]/90 text-white border-white/20 hover:border-[#B08D57] hover:scale-105'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5 shrink-0 text-[#B08D57]" />
                  <span className="text-xs font-semibold">{prop.price}</span>
                </button>

                {/* Radar Pulse Effect */}
                <span className="absolute -top-1 -left-1 flex h-full w-full pointer-events-none">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B08D57] opacity-20"></span>
                </span>
              </div>
            ))}
          </div>

          {/* Compact Property Preview Modal Popup */}
          {activeMarkerProperty && (
            <div className="absolute bottom-6 left-6 right-6 sm:left-auto sm:right-6 sm:w-96 glass-panel p-4 rounded-2xl border border-[#B08D57]/40 shadow-2xl animate-in slide-in-from-bottom-4 duration-300 z-30">
              <div className="flex items-start justify-between pb-3 font-mono">
                <span className="text-[10px] uppercase font-bold text-[#B08D57] tracking-wider">
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
                  <h4 className="font-serif-fraunces font-bold text-sm text-[#EFEAE1] line-clamp-1">
                    {activeMarkerProperty.title}
                  </h4>
                  <p className="text-xs text-gray-400 font-mono">{activeMarkerProperty.location}</p>
                  <p className="text-xs font-bold text-[#B08D57] font-mono">{activeMarkerProperty.price}</p>
                  <div className="text-[10px] text-gray-400 pt-1 font-mono">
                    {activeMarkerProperty.bhk > 0 ? `${activeMarkerProperty.bhk} BHK • ` : ''}
                    {activeMarkerProperty.area}
                  </div>
                </div>
              </div>

              <button
                onClick={() => onSelectProperty(activeMarkerProperty)}
                className="w-full mt-4 bg-[#16231C] hover:bg-[#B08D57] text-[#EFEAE1] hover:text-[#0D1410] font-semibold text-xs py-2.5 rounded-xl border border-[#B08D57]/30 transition-all flex items-center justify-center gap-1.5"
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
