import React, { useState, useEffect } from 'react';
import { MapPin, Layers, Navigation, ArrowUpRight, X } from 'lucide-react';
import { PROPERTIES as FALLBACK_PROPERTIES } from '../data/mockData';
import { fetchPropertiesAPI } from '../services/api';

export default function PropertyMap({ onSelectProperty, properties: propProperties }) {
  const [selectedLocationFilter, setSelectedLocationFilter] = useState('All');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('All');
  const [selectedBhkFilter, setSelectedBhkFilter] = useState('All');
  const [allProperties, setAllProperties] = useState(propProperties || FALLBACK_PROPERTIES);
  const [activeMarkerProperty, setActiveMarkerProperty] = useState(null);

  useEffect(() => {
    if (propProperties && propProperties.length > 0) {
      setAllProperties(propProperties);
      setActiveMarkerProperty(propProperties[0]);
    } else {
      async function loadProps() {
        const apiData = await fetchPropertiesAPI('All');
        if (apiData && Array.isArray(apiData) && apiData.length > 0) {
          setAllProperties(apiData);
          setActiveMarkerProperty(apiData[0]);
        } else {
          setActiveMarkerProperty(FALLBACK_PROPERTIES[0]);
        }
      }
      loadProps();
    }
  }, [propProperties]);

  const mapPins = allProperties.filter(p => {
    if (selectedLocationFilter !== 'All' && !p.location?.includes(selectedLocationFilter)) return false;
    if (selectedTypeFilter !== 'All' && p.type !== selectedTypeFilter) return false;
    if (selectedBhkFilter !== 'All' && p.bhk !== Number(selectedBhkFilter)) return false;
    return true;
  });

  return (
    <section className="py-20 bg-[#0F172A] blueprint-grid relative text-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#1E293B] px-3 py-1 rounded-full text-xs font-mono font-semibold text-sky-400 border border-sky-500/30 mb-3">
              <Navigation className="w-3.5 h-3.5" />
              GEOSPATIAL PROPTECH DISCOVERY
            </div>
            <h2 className="font-serif-fraunces text-3xl sm:text-4xl font-extrabold text-white">
              Interactive Property Map
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 font-light">
              Explore luxury estates mapped across prime corridors of Madurai.
            </p>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap gap-2 text-xs font-mono">
            <select
              value={selectedLocationFilter}
              onChange={(e) => setSelectedLocationFilter(e.target.value)}
              className="bg-[#1E293B] text-slate-200 border border-slate-700 rounded-xl px-3 py-2 focus:outline-none focus:border-sky-500"
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
              className="bg-[#1E293B] text-slate-200 border border-slate-700 rounded-xl px-3 py-2 focus:outline-none focus:border-sky-500"
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
              className="bg-[#1E293B] text-slate-200 border border-slate-700 rounded-xl px-3 py-2 focus:outline-none focus:border-sky-500"
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
        <div className="relative h-[520px] rounded-3xl overflow-hidden border border-slate-700/60 glass-panel shadow-2xl bg-[#0F172A]">
          
          {/* Stylized Dark Map Background */}
          <div className="absolute inset-0 bg-[#0F172A] blueprint-grid opacity-90">
            <svg className="w-full h-full opacity-30 pointer-events-none stroke-sky-400">
              <path d="M 0 100 Q 300 200 600 150 T 1200 400" fill="none" strokeWidth="3" strokeDasharray="6 6" />
              <path d="M 200 0 Q 400 300 800 600" fill="none" strokeWidth="2" />
              <circle cx="450" cy="220" r="180" fill="none" stroke="#38BDF8" strokeWidth="1" strokeDasharray="4 4" />
            </svg>
          </div>

          {/* Map Overlay Cluster Label */}
          <div className="absolute top-4 left-4 bg-[#0F172A]/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700 text-xs text-slate-300 flex items-center gap-2 font-mono">
            <Layers className="w-4 h-4 text-sky-400" />
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
                      ? 'bg-gradient-to-r from-blue-600 to-sky-500 text-white border-sky-400 scale-110 font-bold'
                      : 'bg-[#1E293B]/90 text-white border-slate-700 hover:border-sky-400 hover:scale-105'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5 shrink-0 text-sky-400" />
                  <span className="text-xs font-semibold">{prop.price}</span>
                </button>

                {/* Radar Pulse Effect */}
                <span className="absolute -top-1 -left-1 flex h-full w-full pointer-events-none">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-20"></span>
                </span>
              </div>
            ))}
          </div>

          {/* Compact Property Preview Modal Popup */}
          {activeMarkerProperty && (
            <div className="absolute bottom-6 left-6 right-6 sm:left-auto sm:right-6 sm:w-96 glass-panel p-4 rounded-2xl border border-slate-700/80 shadow-2xl animate-in slide-in-from-bottom-4 duration-300 z-30 bg-[#1E293B]/95">
              <div className="flex items-start justify-between pb-3 font-mono">
                <span className="text-[10px] uppercase font-bold text-sky-400 tracking-wider">
                  Selected Map Node
                </span>
                <button
                  onClick={() => setActiveMarkerProperty(null)}
                  className="text-slate-400 hover:text-white p-1"
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
                  <h4 className="font-serif-fraunces font-bold text-sm text-white line-clamp-1">
                    {activeMarkerProperty.title}
                  </h4>
                  <p className="text-xs text-slate-400 font-mono">{activeMarkerProperty.location}</p>
                  <p className="text-xs font-bold text-sky-400 font-mono">{activeMarkerProperty.price}</p>
                  <div className="text-[10px] text-slate-400 pt-1 font-mono">
                    {activeMarkerProperty.bhk > 0 ? `${activeMarkerProperty.bhk} BHK • ` : ''}
                    {activeMarkerProperty.area}
                  </div>
                </div>
              </div>

              <button
                onClick={() => onSelectProperty(activeMarkerProperty)}
                className="w-full mt-4 bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 text-white font-semibold text-xs py-2.5 rounded-xl border border-sky-400 transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-blue-500/20"
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
