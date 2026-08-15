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
          ? 'bg-[#0D1410]/90 backdrop-blur-md border-b border-[#B08D57]/20 py-3 shadow-xl'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#B08D57] to-[#EFEAE1] p-[1px]">
              <div className="w-full h-full bg-[#0D1410] rounded-[11px] flex items-center justify-center group-hover:bg-[#16231C] transition-colors">
                <Building2 className="w-5 h-5 text-[#B08D57]" />
              </div>
            </div>
            <div>
              <span className="font-serif-fraunces font-extrabold text-xl tracking-wider text-[#EFEAE1]">
                AETHERIA
              </span>
              <span className="block text-[10px] uppercase tracking-widest text-[#B08D57] font-medium font-mono">
                Luxury Real Estate
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors hover:text-[#B08D57] ${
                location.pathname === '/' ? 'text-[#B08D57]' : 'text-[#EFEAE1]/80'
              }`}
            >
              Home
            </Link>
            <a
              href="#properties"
              className="text-sm font-medium text-[#EFEAE1]/80 transition-colors hover:text-[#B08D57]"
            >
              Properties
            </a>
            <a
              href="#ai-finder"
              className="text-sm font-medium text-[#EFEAE1]/80 transition-colors hover:text-[#B08D57] flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#B08D57]" />
              AI Match
            </a>
            <a
              href="#calculator"
              className="text-sm font-medium text-[#EFEAE1]/80 transition-colors hover:text-[#B08D57]"
            >
              Investment Calc
            </a>
            <Link
              to="/admin"
              className="text-xs font-semibold text-[#EFEAE1]/80 bg-[#16231C] hover:bg-[#203127] px-3.5 py-1.5 rounded-full border border-[#B08D57]/30 transition-colors flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#B08D57]" />
              CRM Portal
            </Link>
          </div>

          {/* Desktop Action Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            <button
              onClick={onOpenAiChat}
              className="bg-[#16231C]/90 backdrop-blur-md border border-[#B08D57]/40 px-4 py-2 rounded-xl text-xs font-mono text-[#EFEAE1] hover:border-[#B08D57] transition-all flex items-center gap-2 shadow-lg"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#B08D57] animate-pulse" />
              <span>AI Advisor</span>
            </button>
            <button
              onClick={onOpenBooking}
              className="bg-[#B08D57] hover:bg-[#c29d63] text-[#0D1410] font-bold text-xs px-5 py-2.5 rounded-xl hover:opacity-95 transition-opacity shadow-lg shadow-[#B08D57]/20 active:scale-95"
            >
              Book Site Visit
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-3">
            <button
              onClick={onOpenAiChat}
              className="p-2 rounded-lg bg-[#16231C] border border-[#B08D57]/40 text-[#B08D57]"
            >
              <Sparkles className="w-5 h-5" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-[#16231C] text-[#EFEAE1]"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0D1410]/95 border-b border-[#B08D57]/20 px-6 py-6 space-y-4">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-[#EFEAE1]"
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
            className="block text-base font-medium text-[#B08D57]"
          >
            CRM Portal (Admin)
          </Link>

          <div className="pt-4 border-t border-white/10 space-y-3">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBooking();
              }}
              className="w-full bg-[#B08D57] text-[#0D1410] font-bold text-sm py-3 rounded-xl shadow-lg"
            >
              Book Site Visit
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
