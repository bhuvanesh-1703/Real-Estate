import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sparkles, Building2, Menu, X, ShieldCheck, Mail } from 'lucide-react';

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
          ? 'bg-[#0F172A]/90 backdrop-blur-md border-b border-slate-700/60 py-3 shadow-2xl'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-sky-400 p-[1px]">
              <div className="w-full h-full bg-[#0F172A] rounded-[11px] flex items-center justify-center group-hover:bg-[#1E293B] transition-colors">
                <Building2 className="w-5 h-5 text-sky-400" />
              </div>
            </div>
            <div>
              <span className="font-serif-fraunces font-extrabold text-xl tracking-wider text-white">
                AETHERIA
              </span>
              <span className="block text-[10px] uppercase tracking-widest text-sky-400 font-bold font-mono">
                Luxury Real Estate
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors hover:text-sky-400 ${
                location.pathname === '/' ? 'text-sky-400 font-bold' : 'text-slate-300'
              }`}
            >
              Home
            </Link>
            <a
              href="#properties"
              className="text-sm font-medium text-slate-300 transition-colors hover:text-sky-400"
            >
              Properties
            </a>
            <a
              href="#ai-finder"
              className="text-sm font-medium text-slate-300 transition-colors hover:text-sky-400 flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              AI Match
            </a>
            <a
              href="#inquire"
              className="text-sm font-medium text-slate-300 transition-colors hover:text-sky-400 flex items-center gap-1.5"
            >
              <Mail className="w-3.5 h-3.5 text-sky-400" />
              Inquire
            </a>
            <a
              href="#calculator"
              className="text-sm font-medium text-slate-300 transition-colors hover:text-sky-400"
            >
              Investment Calc
            </a>
            <Link
              to="/admin"
              className="text-xs font-semibold text-slate-200 bg-[#1E293B] hover:bg-slate-700/70 px-3.5 py-1.5 rounded-full border border-slate-700 transition-colors flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
              CRM Portal
            </Link>
          </div>

          {/* Desktop Action Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            <button
              onClick={onOpenAiChat}
              className="bg-[#1E293B]/90 backdrop-blur-md border border-slate-700 hover:border-sky-500/60 px-4 py-2 rounded-xl text-xs font-mono text-slate-200 hover:text-white transition-all flex items-center gap-2 shadow-lg"
            >
              <Sparkles className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
              <span>AI Advisor</span>
            </button>
            <button
              onClick={onOpenBooking}
              className="bg-gradient-to-r from-blue-600 via-sky-500 to-indigo-600 hover:from-blue-500 hover:to-sky-400 text-white font-bold text-xs px-5 py-2.5 rounded-xl hover:opacity-95 transition-opacity shadow-lg shadow-blue-500/25 active:scale-95 font-sans"
            >
              Book Site Visit
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-3">
            <button
              onClick={onOpenAiChat}
              className="p-2 rounded-lg bg-[#1E293B] border border-slate-700 text-sky-400"
            >
              <Sparkles className="w-5 h-5" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-[#1E293B] text-slate-200"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0F172A]/95 backdrop-blur-xl border-b border-slate-700/60 px-6 py-6 space-y-4">
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
            className="block text-base font-medium text-slate-300"
          >
            Featured Properties
          </a>
          <a
            href="#inquire"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-sky-400"
          >
            Direct Inquiry Form
          </a>
          <a
            href="#ai-finder"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-slate-300"
          >
            AI Property Finder
          </a>
          <a
            href="#calculator"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-slate-300"
          >
            Investment Calculator
          </a>
          <Link
            to="/admin"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-sky-400"
          >
            CRM Portal (Admin)
          </Link>

          <div className="pt-4 border-t border-slate-800 space-y-3">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBooking();
              }}
              className="w-full bg-gradient-to-r from-blue-600 to-sky-500 text-white font-bold text-sm py-3 rounded-xl shadow-lg"
            >
              Book Site Visit
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
