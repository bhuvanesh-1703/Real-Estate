import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Bed, Maximize2, Sparkles, Check, Phone, Calendar, ArrowLeft, Heart, Share2, Play, Compass, ShieldCheck } from 'lucide-react';
import { PROPERTIES } from '../data/mockData';
import PropertyCard from '../components/PropertyCard';
import { fetchPropertyBySlugAPI } from '../services/api';

export default function PropertyDetails({ property: propFromProps, onOpenBooking, onSelectProperty }) {
  const { slug } = useParams();
  const [property, setProperty] = useState(propFromProps || PROPERTIES.find(p => p.slug === slug) || PROPERTIES[0]);
  const [activeImg, setActiveImg] = useState(property?.gallery ? property.gallery[0] : property?.image);
  const [showVideo, setShowVideo] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    async function resolveProperty() {
      if (propFromProps) {
        setProperty(propFromProps);
        setActiveImg(propFromProps.gallery ? propFromProps.gallery[0] : propFromProps.image);
        return;
      }

      if (slug) {
        const apiProp = await fetchPropertyBySlugAPI(slug);
        if (apiProp) {
          setProperty(apiProp);
          setActiveImg(apiProp.gallery ? apiProp.gallery[0] : apiProp.image);
          return;
        }
        const fallbackProp = PROPERTIES.find(p => p.slug === slug) || PROPERTIES[0];
        setProperty(fallbackProp);
        setActiveImg(fallbackProp.gallery ? fallbackProp.gallery[0] : fallbackProp.image);
      }
    }
    resolveProperty();
  }, [slug, propFromProps]);

  const similarProps = PROPERTIES.filter(p => p.id !== property?.id && p.slug !== property?.slug).slice(0, 3);

  if (!property) return <div className="pt-32 text-center text-gray-400 font-mono">Loading property details...</div>;

  return (
    <div className="pt-24 pb-20 bg-[#0D1410] blueprint-grid text-[#EFEAE1] min-h-screen">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Navigation back bar */}
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-gray-400 hover:text-[#B08D57] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to All Properties
          </Link>

          <div className="flex gap-2">
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className={`p-2.5 rounded-xl border border-white/10 glass-panel transition-colors ${
                isFavorite ? 'text-red-500 bg-red-500/10' : 'text-gray-300 hover:text-white'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
            <button className="p-2.5 rounded-xl border border-white/10 glass-panel text-gray-300 hover:text-white">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Gallery Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          
          {/* Main Large Image */}
          <div className="lg:col-span-8 relative h-[380px] sm:h-[480px] rounded-3xl overflow-hidden glass-panel border border-[#B08D57]/30">
            <img src={activeImg || property.image} alt={property.title} className="w-full h-full object-cover" />

            <button
              onClick={() => setShowVideo(true)}
              className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-[#B08D57] text-[#0D1410] flex items-center justify-center shadow-2xl hover:scale-110 transition-transform"
            >
              <Play className="w-6 h-6 fill-current ml-1" />
            </button>

            <div className="absolute bottom-4 left-4 bg-[#0D1410]/80 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs font-mono text-[#B08D57] border border-[#B08D57]/40 flex items-center gap-2">
              <Compass className="w-4 h-4" />
              360° Virtual Tour Ready
            </div>
          </div>

          {/* Thumbnails Stack */}
          <div className="lg:col-span-4 grid grid-cols-2 lg:grid-cols-1 gap-4 h-[380px] sm:h-[480px]">
            {(property.gallery || [property.image]).map((img, idx) => (
              <div
                key={idx}
                onClick={() => setActiveImg(img)}
                className={`relative rounded-2xl overflow-hidden cursor-pointer border-2 transition-all h-full ${
                  activeImg === img ? 'border-[#B08D57]' : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>

        </div>

        {/* Details & Sidebar Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Specs & Overview */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Title & Specs */}
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-[#B08D57]/20 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-xs uppercase font-mono font-bold text-[#B08D57] tracking-widest">
                    {property.type} • {property.status}
                  </span>
                  <h1 className="font-serif-fraunces font-extrabold text-2xl sm:text-4xl text-[#EFEAE1] mt-1">
                    {property.title}
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-400 flex items-center gap-1.5 mt-1 font-mono">
                    <MapPin className="w-4 h-4 text-[#B08D57]" />
                    {property.location}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xs text-gray-400 block font-mono">Offer Price</span>
                  <span className="font-serif-fraunces font-extrabold text-2xl sm:text-3xl text-[#B08D57]">
                    {property.price}
                  </span>
                </div>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10 text-center font-mono">
                {property.bhk > 0 && (
                  <div className="p-3 bg-[#0D1410]/60 rounded-2xl border border-white/5">
                    <Bed className="w-5 h-5 text-[#B08D57] mx-auto mb-1" />
                    <span className="text-xs text-gray-400 block">Bedrooms</span>
                    <span className="font-serif-fraunces font-bold text-sm text-[#EFEAE1]">{property.bhk} BHK</span>
                  </div>
                )}
                <div className="p-3 bg-[#0D1410]/60 rounded-2xl border border-white/5">
                  <Maximize2 className="w-5 h-5 text-[#B08D57] mx-auto mb-1" />
                  <span className="text-xs text-gray-400 block">Built-up Area</span>
                  <span className="font-serif-fraunces font-bold text-sm text-[#EFEAE1]">{property.area}</span>
                </div>
                <div className="p-3 bg-[#0D1410]/60 rounded-2xl border border-white/5">
                  <ShieldCheck className="w-5 h-5 text-[#B08D57] mx-auto mb-1" />
                  <span className="text-xs text-gray-400 block">Approval</span>
                  <span className="font-serif-fraunces font-bold text-sm text-[#EFEAE1]">RERA / DTCP</span>
                </div>
              </div>
            </div>

            {/* Description & Features */}
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-[#B08D57]/20 space-y-6">
              <h3 className="font-serif-fraunces font-bold text-xl text-[#EFEAE1]">Property Overview</h3>
              <p className="text-sm text-[#EFEAE1]/80 leading-relaxed font-light">
                {property.description || "This luxury property features state-of-the-art construction quality, Italian marble flooring, automated lighting systems, and panoramic landscape views."}
              </p>

              <h4 className="font-serif-fraunces font-semibold text-base text-[#EFEAE1] pt-4">Exclusive Amenities</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono">
                {(property.features || ['Private Pool', 'Smart Home', '24/7 Security', 'Clubhouse']).map((feature, i) => (
                  <div key={i} className="flex items-center gap-2 p-3 bg-[#0D1410]/60 rounded-xl border border-white/5">
                    <Check className="w-4 h-4 text-[#B08D57]" />
                    <span className="text-gray-200">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: CTA & Advisor Contact */}
          <div className="lg:col-span-4 space-y-6">
            <div className="glass-panel p-6 rounded-3xl border border-[#B08D57]/40 space-y-6 sticky top-28">
              
              <div className="space-y-1">
                <span className="text-xs uppercase font-mono font-bold text-[#B08D57] flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  EXCLUSIVE ACCESS
                </span>
                <h3 className="font-serif-fraunces font-bold text-lg text-[#EFEAE1]">Book VIP Inspection</h3>
                <p className="text-xs text-gray-400 font-light">Chauffeured site visits & private floor plan consultation.</p>
              </div>

              <div className="space-y-3 pt-2">
                <button
                  onClick={onOpenBooking}
                  className="w-full bg-[#B08D57] hover:bg-[#c29d63] text-[#0D1410] font-bold text-xs py-3.5 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Schedule Site Visit</span>
                </button>
                <a
                  href="tel:+919876543210"
                  className="w-full bg-[#16231C] hover:bg-[#203127] text-[#EFEAE1] font-semibold text-xs py-3.5 rounded-xl border border-[#B08D57]/30 transition-colors flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4 text-[#B08D57]" />
                  <span>Call Luxury Advisor</span>
                </a>
              </div>

            </div>
          </div>

        </div>

        {/* Similar Properties Showcase */}
        <div className="pt-12 space-y-6">
          <h3 className="font-serif-fraunces font-bold text-2xl text-[#EFEAE1]">Similar Luxury Listings</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {similarProps.map((p) => (
              <PropertyCard
                key={p.id || p.slug}
                property={p}
                onSelect={onSelectProperty}
                isFavorite={false}
                onFavoriteToggle={() => {}}
              />
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
