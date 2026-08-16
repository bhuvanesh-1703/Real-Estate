import React from 'react';
import { Building2, Mail, Phone, MapPin, Share2, Globe, MessageSquare } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#0B0F19] border-t border-slate-700/60 pt-16 pb-12 text-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-sky-400" />
              </div>
              <span className="font-serif-fraunces font-bold text-xl text-white tracking-wide">
                AETHERIA
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-light">
              India's premier AI-powered luxury real estate discovery platform. Empowering high-net-worth buyers with intelligent property matching & financial clarity.
            </p>
            <div className="flex space-x-3 pt-2">
              <a href="#" className="w-8 h-8 rounded-lg bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-sky-400 hover:border-sky-500/40 transition-colors">
                <Globe className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-sky-400 hover:border-sky-500/40 transition-colors">
                <Share2 className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-sky-400 hover:border-sky-500/40 transition-colors">
                <MessageSquare className="w-4 h-4" />
              </a>
            </div>

          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-mono text-xs font-semibold text-sky-400 tracking-wider uppercase mb-4">
              Discovery
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400 font-light">
              <li><a href="#properties" className="hover:text-sky-400 transition-colors">Luxury Villas</a></li>
              <li><a href="#properties" className="hover:text-sky-400 transition-colors">High-Rise Apartments</a></li>
              <li><a href="#properties" className="hover:text-sky-400 transition-colors">DTCP & RERA Plots</a></li>
              <li><a href="#properties" className="hover:text-sky-400 transition-colors">Independent Houses</a></li>
              <li><a href="#calculator" className="hover:text-sky-400 transition-colors">Investment Yield Calculator</a></li>
            </ul>
          </div>

          {/* Locations */}
          <div>
            <h4 className="font-mono text-xs font-semibold text-sky-400 tracking-wider uppercase mb-4">
              Prime Locations
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400 font-light">
              <li>Anna Nagar, Madurai</li>
              <li>KK Nagar, Madurai</li>
              <li>Koodal Nagar, Madurai</li>
              <li>TVS Nagar, Madurai</li>
              <li>Ring Road Corridor</li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="font-mono text-xs font-semibold text-sky-400 tracking-wider uppercase mb-4">
              Corporate Office
            </h4>
            <ul className="space-y-3 text-xs text-slate-400 font-light">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <span>Suite 401, Aetheria Towers, West Veli Street, Madurai - 625001</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-sky-400 shrink-0" />
                <span>+91 (0452) 489-0199</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-sky-400 shrink-0" />
                <span>advisors@aetheriaproperties.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4 font-mono">
          <p>© {new Date().getFullYear()} Aetheria Luxury Real Estate Technologies Inc. All rights reserved.</p>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-slate-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-400 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-slate-400 transition-colors">RERA Compliance</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
