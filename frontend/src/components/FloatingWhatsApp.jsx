import React, { useState } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';

export default function FloatingWhatsApp({ selectedPropertyTitle }) {
  const [isOpen, setIsOpen] = useState(false);

  const defaultMessage = selectedPropertyTitle
    ? `Hi, I am interested in ${selectedPropertyTitle}. I'd like to know more details and schedule a site visit.`
    : "Hi, I am looking for luxury property options in Madurai. Can you assist me?";

  const handleSendWhatsApp = () => {
    const encodedMessage = encodeURIComponent(defaultMessage);
    window.open(`https://wa.me/919876543210?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      {/* Popover Bubble */}
      {isOpen && (
        <div className="mb-3 glass-panel p-4 rounded-2xl w-80 shadow-2xl border border-[#D4AF37]/30 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center font-bold text-white text-sm">
                  WA
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-[#0B0F17] rounded-full"></span>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white">Property Advisor</h4>
                <span className="text-[10px] text-emerald-400 font-medium">Online Now</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="py-3">
            <div className="bg-white/5 rounded-xl p-3 text-xs text-gray-300 border border-white/5">
              "{defaultMessage}"
            </div>
          </div>

          <button
            onClick={handleSendWhatsApp}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
            Start WhatsApp Chat
          </button>
        </div>
      )}

      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center gap-3 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-3 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95"
      >
        <MessageSquare className="w-5 h-5 fill-current" />
        <span className="hidden sm:inline text-xs font-semibold tracking-wide">
          Chat with Advisor
        </span>
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400"></span>
        </span>
      </button>
    </div>
  );
}
