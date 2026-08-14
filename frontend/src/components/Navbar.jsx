import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sparkles, Building2, Menu, X, ShieldCheck } from 'lucide-react';

export default function Navbar({ onOpenAiChat, onOpenBooking }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0B0F17]/85 backdrop-blur-md border-b border-white/10 py-3 shadow-xl'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#D4AF37] to-[#FFF] p-[1px]">
              <div className="w-full h-full bg-[#0B0F17] rounded-[11px] flex items-center justify-center group-hover:bg-[#151C28] transition-colors">
                <Building2 className="w-5 h-5 text-[#D4AF37]" />
              </div>
            </div>
            <div>
              <span className="font-heading font-extrabold text-xl tracking-wider text-white">
                AETHERIA
              </span>
              <span className="block text-[10px] uppercase tracking-widest text-gold-gradient font-medium">
                Luxury Real Estate
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors hover:text-[#D4AF37] ${
                location.pathname === '/' ? 'text-[#D4AF37]' : 'text-gray-300'
              }`}
            >
              Home
            </Link>
            <a
              href="#properties"
              className="text-sm font-medium text-gray-300 transition-colors hover:text-[#D4AF37]"
            >
              Properties
            </a>
            <a
              href="#ai-finder"
              className="text-sm font-medium text-gray-300 transition-colors hover:text-[#D4AF37] flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              AI Match
            </a>
            <a
              href="#calculator"
              className="text-sm font-medium text-gray-300 transition-colors hover:text-[#D4AF37]"
            >
              Investment Calc
            </a>
            <Link
              to="/admin"
              className="text-xs font-semibold text-gray-400 bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-full border border-white/10 transition-colors flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
              CRM Portal
            </Link>
          </div>

          {/* Desktop Action Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            <button
              onClick={onOpenAiChat}
              className="glass-panel px-4 py-2 rounded-xl text-xs font-medium text-white hover:border-[#D4AF37]/50 transition-all flex items-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] animate-pulse" />
              AI Advisor
            </button>
            <button
              onClick={onOpenBooking}
              className="bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-black font-semibold text-xs px-5 py-2.5 rounded-xl hover:opacity-95 transition-opacity shadow-lg shadow-[#D4AF37]/20 active:scale-95"
            >
              Book Site Visit
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-3">
            <button
              onClick={onOpenAiChat}
              className="p-2 rounded-lg bg-white/5 border border-white/10 text-[#D4AF37]"
            >
              <Sparkles className="w-5 h-5" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-white/5 text-gray-300"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0B0F17]/95 border-b border-white/10 px-6 py-6 space-y-4">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-white"
          >
            Home
          </Link>
          <a
            href="#properties"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-gray-300"
          >
            Featured Properties
          </a>
          <a
            href="#ai-finder"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-gray-300"
          >
            AI Property Finder
          </a>
          <a
            href="#calculator"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-gray-300"
          >
            Investment Calculator
          </a>
          <Link
            to="/admin"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-[#D4AF37]"
          >
            CRM Portal (Admin)
          </Link>

          <div className="pt-4 border-t border-white/10 space-y-3">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBooking();
              }}
              className="w-full bg-[#D4AF37] text-black font-bold text-sm py-3 rounded-xl shadow-lg"
            >
              Book Site Visit
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
