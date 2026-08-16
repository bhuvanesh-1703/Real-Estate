import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Bed, Maximize2, Sparkles, Check, Phone, Calendar, ArrowLeft, Heart, Share2, Play, Compass, ShieldCheck, Film, ExternalLink } from 'lucide-react';
import { PROPERTIES } from '../data/mockData';
import PropertyCard from '../components/PropertyCard';
import { fetchPropertyBySlugAPI } from '../services/api';

export default function PropertyDetails({ property: propFromProps, onOpenBooking, onSelectProperty }) {
  const { slug } = useParams();
  const [property, setProperty] = useState(propFromProps || PROPERTIES.find(p => p.slug === slug) || PROPERTIES[0]);
  
  // Normalize images array (handles Cloudinary objects [{ url, publicId }] and legacy string arrays)
  const getImagesList = (prop) => {
    if (!prop) return [];
    if (prop.images && Array.isArray(prop.images) && prop.images.length > 0) {
      return prop.images.map(img => typeof img === 'string' ? img : img.url);
    }
    if (prop.gallery && Array.isArray(prop.gallery) && prop.gallery.length > 0) {
      return prop.gallery;
    }
    return [prop.image || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80'];
  };

  const imagesList = getImagesList(property);
  const [activeImg, setActiveImg] = useState(imagesList[0]);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    async function resolveProperty() {
      if (propFromProps) {
        setProperty(propFromProps);
        const imgs = getImagesList(propFromProps);
        setActiveImg(imgs[0]);
        return;
      }

      if (slug) {
        const apiProp = await fetchPropertyBySlugAPI(slug);
        if (apiProp) {
          setProperty(apiProp);
          const imgs = getImagesList(apiProp);
          setActiveImg(imgs[0]);
          return;
        }
        const fallbackProp = PROPERTIES.find(p => p.slug === slug) || PROPERTIES[0];
        setProperty(fallbackProp);
        const imgs = getImagesList(fallbackProp);
        setActiveImg(imgs[0]);
      }
    }
    resolveProperty();
  }, [slug, propFromProps]);

  const similarProps = PROPERTIES.filter(p => p.id !== property?.id && p.slug !== property?.slug).slice(0, 3);

  if (!property) return <div className="pt-32 text-center text-slate-400 font-mono">Loading property details...</div>;

  // Extract video details safely
  const videoUrl = typeof property.video === 'object' ? (property.video?.url || '') : (property.video || '');
  const videoDurationSec = typeof property.video === 'object' ? (property.video?.duration || 0) : 0;
  const hasVideo = Boolean(videoUrl && videoUrl.length > 0);

  return (
    <div className="pt-24 pb-20 bg-[#0F172A] blueprint-grid text-[#F8FAFC] min-h-screen">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Navigation back bar */}
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-slate-400 hover:text-sky-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to All Properties
          </Link>

          <div className="flex gap-2">
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className={`p-2.5 rounded-xl border border-slate-700 glass-panel transition-colors ${
                isFavorite ? 'text-rose-500 bg-rose-500/10' : 'text-slate-300 hover:text-white bg-[#1E293B]'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
            <button className="p-2.5 rounded-xl border border-slate-700 glass-panel text-slate-300 hover:text-white bg-[#1E293B]">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Gallery Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          
          {/* Main Large Image */}
          <div className="lg:col-span-8 relative h-[380px] sm:h-[480px] rounded-3xl overflow-hidden glass-panel border border-slate-700/80 bg-[#1E293B]">
            <img src={activeImg || imagesList[0]} alt={property.title} className="w-full h-full object-cover" />

            {hasVideo && (
              <a
                href="#video-tour"
                className="absolute bottom-4 right-4 bg-[#0F172A]/90 backdrop-blur-md px-4 py-2 rounded-2xl text-xs font-mono text-sky-400 border border-sky-500/40 flex items-center gap-2 hover:bg-sky-500/20 transition-all shadow-xl"
              >
                <Film className="w-4 h-4 text-sky-400" />
                <span>Watch 15s Virtual Tour ({videoDurationSec ? `${videoDurationSec}s` : '15s'})</span>
              </a>
            )}

            <div className="absolute bottom-4 left-4 bg-[#0F172A]/80 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs font-mono text-sky-400 border border-slate-700 flex items-center gap-2">
              <Compass className="w-4 h-4" />
              360° Virtual Tour Ready
            </div>
          </div>

          {/* Thumbnails Stack */}
          <div className="lg:col-span-4 grid grid-cols-3 lg:grid-cols-1 gap-4 h-[380px] sm:h-[480px]">
            {imagesList.map((imgUrl, idx) => (
              <div
                key={idx}
                onClick={() => setActiveImg(imgUrl)}
                className={`relative rounded-2xl overflow-hidden cursor-pointer border-2 transition-all h-full bg-[#1E293B] ${
                  activeImg === imgUrl ? 'border-sky-400 shadow-lg shadow-sky-500/20' : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img src={imgUrl} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>

        </div>

        {/* Details & Sidebar Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Specs, Video & Overview */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Title & Specs */}
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-700/60 space-y-4 bg-[#1E293B]/80">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-xs uppercase font-mono font-bold text-sky-400 tracking-widest">
                    {property.propertyType || property.type || 'Villa'} • {property.status}
                  </span>
                  <h1 className="font-serif-fraunces font-extrabold text-2xl sm:text-4xl text-white mt-1">
                    {property.title}
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-400 flex items-center gap-1.5 mt-1 font-mono">
                    <MapPin className="w-4 h-4 text-sky-400" />
                    {property.location}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-400 block font-mono">Offer Price</span>
                  <span className="font-serif-fraunces font-extrabold text-2xl sm:text-3xl text-sky-400">
                    {property.price}
                  </span>
                </div>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-800 text-center font-mono">
                {property.bhk > 0 && (
                  <div className="p-3 bg-[#0F172A]/80 rounded-2xl border border-slate-800">
                    <Bed className="w-5 h-5 text-sky-400 mx-auto mb-1" />
                    <span className="text-xs text-slate-400 block">Bedrooms</span>
                    <span className="font-serif-fraunces font-bold text-sm text-white">{property.bhk} BHK</span>
                  </div>
                )}
                <div className="p-3 bg-[#0F172A]/80 rounded-2xl border border-slate-800">
                  <Maximize2 className="w-5 h-5 text-sky-400 mx-auto mb-1" />
                  <span className="text-xs text-slate-400 block">Plot Size / Area</span>
                  <span className="font-serif-fraunces font-bold text-sm text-white">{property.area || `${property.plotSize || 2000} sq.ft`}</span>
                </div>
                <div className="p-3 bg-[#0F172A]/80 rounded-2xl border border-slate-800">
                  <ShieldCheck className="w-5 h-5 text-sky-400 mx-auto mb-1" />
                  <span className="text-xs text-slate-400 block">Approval</span>
                  <span className="font-serif-fraunces font-bold text-sm text-white">RERA / DTCP</span>
                </div>
              </div>
            </div>

            {/* DEDICATED 15-SECOND VIDEO PLAYER SECTION (Hidden if no video) */}
            {hasVideo && (
              <div id="video-tour" className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-700/60 space-y-4 bg-[#1E293B]/80 scroll-mt-28">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Film className="w-5 h-5 text-sky-400" />
                    <h3 className="font-serif-fraunces font-bold text-xl text-white">15-Second Property Virtual Tour</h3>
                  </div>
                  {videoDurationSec > 0 && (
                    <span className="text-xs font-mono text-sky-400 bg-sky-500/10 border border-sky-500/30 px-3 py-1 rounded-full font-bold">
                      Duration: {videoDurationSec}s
                    </span>
                  )}
                </div>

                <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-slate-700/80 shadow-2xl">
                  <video
                    controls
                    controlsList="nodownload"
                    preload="metadata"
                    poster={imagesList[0]}
                    className="w-full h-full object-cover"
                  >
                    <source src={videoUrl} type="video/mp4" />
                    Your browser does not support HTML5 video playback.
                  </video>
                </div>
              </div>
            )}

            {/* Description & Features */}
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-700/60 space-y-6 bg-[#1E293B]/80">
              <h3 className="font-serif-fraunces font-bold text-xl text-white">Property Overview</h3>
              <p className="text-sm text-slate-300 leading-relaxed font-light">
                {property.description || "This luxury property features state-of-the-art construction quality, Italian marble flooring, automated lighting systems, and panoramic landscape views."}
              </p>

              <h4 className="font-serif-fraunces font-semibold text-base text-white pt-4">Exclusive Amenities</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono">
                {(property.features || ['Private Pool', 'Smart Home', '24/7 Security', 'Clubhouse']).map((feature, i) => (
                  <div key={i} className="flex items-center gap-2 p-3 bg-[#0F172A]/80 rounded-xl border border-slate-800">
                    <Check className="w-4 h-4 text-sky-400" />
                    <span className="text-slate-200">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Google Maps Location */}
              {property.googleMapsUrl && (
                <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-mono">MAP LOCATION & COORDINATES</span>
                  <a
                    href={property.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-mono text-sky-400 hover:underline inline-flex items-center gap-1.5 font-bold"
                  >
                    <span>View on Google Maps</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>

          </div>

          {/* Right Column: CTA & Advisor Contact */}
          <div className="lg:col-span-4 space-y-6">
            <div className="glass-panel p-6 rounded-3xl border border-slate-700/80 space-y-6 sticky top-28 bg-[#1E293B]/90">
              
              <div className="space-y-1">
                <span className="text-xs uppercase font-mono font-bold text-sky-400 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  EXCLUSIVE ACCESS
                </span>
                <h3 className="font-serif-fraunces font-bold text-lg text-white">Book VIP Inspection</h3>
                <p className="text-xs text-slate-400 font-light">Chauffeured site visits & private floor plan consultation.</p>
              </div>

              <div className="space-y-3 pt-2">
                <button
                  onClick={onOpenBooking}
                  className="w-full bg-gradient-to-r from-blue-600 via-sky-500 to-indigo-600 hover:from-blue-500 hover:to-sky-400 text-white font-bold text-xs py-3.5 rounded-xl transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 font-sans"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Schedule Site Visit</span>
                </button>
                <a
                  href="tel:+919876543210"
                  className="w-full bg-[#0F172A] hover:bg-slate-800 text-white font-semibold text-xs py-3.5 rounded-xl border border-slate-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4 text-sky-400" />
                  <span>Call Luxury Advisor</span>
                </a>
              </div>

            </div>
          </div>

        </div>

        {/* Similar Properties Showcase */}
        <div className="pt-12 space-y-6">
          <h3 className="font-serif-fraunces font-bold text-2xl text-white">Similar Luxury Listings</h3>
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
