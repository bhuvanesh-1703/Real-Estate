import React, { useState, useEffect } from "react";
import HeroBlueprintReveal from "../components/HeroBlueprintReveal";
import PropertyCard from "../components/PropertyCard";
import AIPropertyFinder from "../components/AIPropertyFinder";
import PropertyMap from "../components/PropertyMap";
import PropertyCategories from "../components/PropertyCategories";
import WhyChooseUs from "../components/WhyChooseUs";
import PremiumShowcase from "../components/PremiumShowcase";
import InvestmentCalc from "../components/InvestmentCalc";
import SiteVisitBooking from "../components/SiteVisitBooking";
import LeadForm from "../components/LeadForm";
import Testimonials from "../components/Testimonials";
import FAQ from "../components/FAQ";
import FinalCTA from "../components/FinalCTA";
import { PROPERTIES as FALLBACK_PROPERTIES } from "../data/mockData";
import { fetchPropertiesAPI } from "../services/api";
import { Sparkles } from "lucide-react";

export default function Home({
  onSelectProperty,
  onOpenBooking,
  onOpenAiChat,
}) {
  const [favorites, setFavorites] = useState([]);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("All");
  const [properties, setProperties] = useState(FALLBACK_PROPERTIES);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function loadPropertiesFromBackend() {
      setIsLoading(true);
      const apiData = await fetchPropertiesAPI(selectedCategoryFilter);
      if (apiData && Array.isArray(apiData) && apiData.length > 0) {
        setProperties(apiData);
      } else {
        const filteredFallback =
          selectedCategoryFilter === "All"
            ? FALLBACK_PROPERTIES
            : FALLBACK_PROPERTIES.filter(
                (p) => p.type === selectedCategoryFilter,
              );
        setProperties(filteredFallback);
      }
      setIsLoading(false);
    }
    loadPropertiesFromBackend();
  }, [selectedCategoryFilter]);

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  return (
    <div className="space-y-0">
      {/* 1. 3D BLUEPRINT REVEAL HERO SECTION */}
      <HeroBlueprintReveal
        onOpenBooking={onOpenBooking}
        onSelectProperty={onSelectProperty}
      />

      {/* 2. FEATURED PROPERTIES */}
      <section
        id="properties"
        className="py-24 bg-[#0F172A] blueprint-grid relative"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs uppercase font-mono font-bold tracking-widest text-sky-400 inline-flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                HANDPICKED LUXURY PORTFOLIO
              </span>
              <h2 className="font-serif-fraunces text-3xl sm:text-4xl font-extrabold text-white mt-1">
                Featured Properties
              </h2>
            </div>

            <div className="flex flex-wrap gap-2 text-xs font-mono">
              {["All", "Villa", "Apartment", "Plots", "Independent Houses"].map(
                (type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedCategoryFilter(type)}
                    className={`px-4 py-2 rounded-xl font-medium transition-all ${
                      selectedCategoryFilter === type
                        ? "bg-gradient-to-r from-blue-600 to-sky-500 text-white font-bold shadow-lg shadow-blue-500/25"
                        : "bg-[#1E293B] text-slate-300 hover:bg-slate-800 border border-slate-700/60"
                    }`}
                  >
                    {type}
                  </button>
                ),
              )}
            </div>
          </div>


          {isLoading ? (
            <div className="text-center py-12 text-gray-400 font-mono">
              Loading properties from backend...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {properties
                .filter((p) => p.status !== "Sold Out")
                .map((prop) => (
                  <PropertyCard
                    key={prop.id || prop._id}
                    property={prop}
                    onSelect={onSelectProperty}
                    onFavoriteToggle={toggleFavorite}
                    isFavorite={favorites.includes(prop.id || prop._id)}
                  />
                ))}
            </div>
          )}
        </div>
      </section>

      {/* 3. AI PROPERTY FINDER */}
      <AIPropertyFinder onSelectProperty={onSelectProperty} />

      {/* 4. PROPERTY MAP */}
      <PropertyMap onSelectProperty={onSelectProperty} />

      {/* 5. PROPERTY CATEGORIES */}
      <PropertyCategories
        onSelectCategory={(catName) => {
          setSelectedCategoryFilter(catName);
          const propsEl = document.getElementById("properties");
          propsEl?.scrollIntoView({ behavior: "smooth" });
        }}
      />

      {/* 6. WHY CHOOSE US */}
      <WhyChooseUs />

      {/* 7. PREMIUM PROPERTY SHOWCASE */}
      <PremiumShowcase onBookVisit={onOpenBooking} />

      {/* 8. INVESTMENT CALCULATOR */}
      <InvestmentCalc />

      {/* 9. SITE VISIT BOOKING */}
      <SiteVisitBooking />

      {/* 10. DIRECT PORTFOLIO LEAD CAPTURE FORM */}
      <LeadForm />

      {/* 11. TESTIMONIALS */}
      <Testimonials />

      {/* 12. FAQ */}
      <FAQ />

      {/* 13. FINAL CTA */}
      <FinalCTA
        onExplore={() => {
          const propsEl = document.getElementById("properties");
          propsEl?.scrollIntoView({ behavior: "smooth" });
        }}
        onOpenAiChat={onOpenAiChat}
      />
    </div>
  );
}
