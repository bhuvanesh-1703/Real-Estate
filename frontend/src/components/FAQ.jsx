import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState(0);

  const faqs = [
    {
      q: "How can I schedule a site visit?",
      a: "You can schedule a site visit directly through our online booking tool on this platform or by clicking 'Book Site Visit' in the top navigation. Alternatively, send us a quick text on WhatsApp!"
    },
    {
      q: "Do you provide home loans?",
      a: "Yes! We partner with India's leading banks (HDFC, SBI, ICICI, Axis) to offer pre-approved home loan options with instant digital sanction letters and competitive interest rates."
    },
    {
      q: "Are these properties verified?",
      a: "100% of our portfolio properties undergo strict RERA, DTCP, and legal title verification by advocate panels before being published."
    },
    {
      q: "Can I visit the property before booking?",
      a: "Absolutely. We encourage private chauffeured site visits so you can experience the neighborhood, construction quality, and exact layout."
    },
    {
      q: "Do you handle documentation?",
      a: "Yes. Our legal executive desk handles end-to-end sale deed drafting, stamp duty processing, EC certificates, and registration at the registrar's office."
    },
    {
      q: "What areas do you cover?",
      a: "We specialize in prime luxury corridors including Anna Nagar, KK Nagar, Koodal Nagar, TVS Nagar, Ring Road Bypass, and Madurai suburban growth centers."
    }
  ];

  return (
    <section className="py-20 bg-[#0D1410] blueprint-grid relative text-[#EFEAE1]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center space-y-2 mb-12">
          <span className="text-xs uppercase font-mono font-bold text-[#B08D57] tracking-widest flex items-center justify-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5" />
            Frequently Asked Questions
          </span>
          <h2 className="font-serif-fraunces text-3xl sm:text-4xl font-extrabold text-[#EFEAE1]">
            Everything You Need to Know
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((item, idx) => (
            <div
              key={idx}
              className="glass-panel rounded-2xl border border-[#B08D57]/20 overflow-hidden transition-all"
            >
              <button
                onClick={() => setOpenIdx(openIdx === idx ? -1 : idx)}
                className="w-full p-5 text-left flex items-center justify-between text-xs sm:text-sm font-semibold text-[#EFEAE1] hover:text-[#B08D57] transition-colors"
              >
                <span>{item.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-[#B08D57] transition-transform duration-300 ${
                    openIdx === idx ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {openIdx === idx && (
                <div className="px-5 pb-5 text-xs text-gray-300 leading-relaxed border-t border-white/5 pt-3 animate-in fade-in duration-200 font-light">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
