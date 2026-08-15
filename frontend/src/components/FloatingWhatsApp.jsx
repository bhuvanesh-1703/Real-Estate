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
        <div className="mb-3 glass-panel p-4 rounded-2xl w-80 shadow-2xl border border-[#B08D57]/40 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-[#5C7A63] flex items-center justify-center font-bold text-[#EFEAE1] text-sm font-mono">
                  WA
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#7A9E84] border-2 border-[#0D1410] rounded-full"></span>
              </div>
              <div>
                <h4 className="text-xs font-serif-fraunces font-semibold text-[#EFEAE1]">Property Advisor</h4>
                <span className="text-[10px] text-[#7A9E84] font-mono font-medium">Online Now</span>
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
            <div className="bg-[#0D1410]/60 rounded-xl p-3 text-xs text-gray-300 border border-white/5 font-mono">
              "{defaultMessage}"
            </div>
          </div>

          <button
            onClick={handleSendWhatsApp}
            className="w-full bg-[#5C7A63] hover:bg-[#4a6450] text-[#EFEAE1] font-semibold text-xs py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-colors font-mono"
          >
            <Send className="w-3.5 h-3.5" />
            Start WhatsApp Chat
          </button>
        </div>
      )}

      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center gap-3 bg-[#5C7A63] hover:bg-[#4a6450] text-[#EFEAE1] px-4 py-3 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 border border-[#B08D57]/30"
      >
        <MessageSquare className="w-5 h-5 fill-current" />
        <span className="hidden sm:inline text-xs font-mono font-semibold tracking-wide">
          Chat with Advisor
        </span>
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#7A9E84] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-[#7A9E84]"></span>
        </span>
      </button>
    </div>
  );
}
