import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, Bot, User, Building, ArrowRight } from 'lucide-react';
import { PROPERTIES } from '../data/mockData';
import { sendAiChatAPI } from '../services/api';

export default function AIChatModal({ isOpen, onClose, onSelectProperty }) {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: "Greetings! I am your AI Property Advisor. Tell me what you're looking for (e.g. '3BHK villa under ₹75L in Madurai') or ask any investment questions.",
      recommendedProps: []
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!isOpen) return null;

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input.trim();
    const newMessages = [...messages, { sender: 'user', text: userText }];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    // Call backend AI chat endpoint
    const apiResult = await sendAiChatAPI(userText);

    let aiResponseText = "";
    let matches = [];

    if (apiResult && apiResult.reply) {
      aiResponseText = apiResult.reply;
      const queryLower = userText.toLowerCase();
      if (queryLower.includes('villa') || queryLower.includes('house')) {
        matches = PROPERTIES.filter(p => p.type === 'Villa');
      } else if (queryLower.includes('apartment') || queryLower.includes('flat')) {
        matches = PROPERTIES.filter(p => p.type === 'Apartment');
      } else if (queryLower.includes('plot')) {
        matches = PROPERTIES.filter(p => p.type === 'Plots');
      } else {
        matches = PROPERTIES.slice(0, 2);
      }
    } else {
      // Local fallback
      const queryLower = userText.toLowerCase();
      if (queryLower.includes('75') || queryLower.includes('villa')) {
        matches = PROPERTIES.filter(p => p.type === 'Villa');
        aiResponseText = `I analyzed our portfolio. I found ${matches.length} properties matching your parameters. The top option is ${matches[0]?.title} at ${matches[0]?.price}.`;
      } else {
        matches = PROPERTIES.slice(0, 2);
        aiResponseText = `Based on your request, I recommend exploring properties like ${matches[0]?.title} (${matches[0]?.price}).`;
      }
    }

    setMessages(prev => [
      ...prev,
      {
        sender: 'ai',
        text: aiResponseText,
        recommendedProps: matches
      }
    ]);
    setIsTyping(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#101725] border border-[#D4AF37]/30 rounded-3xl w-full max-w-xl h-[600px] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 bg-[#0B0F17] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#D4AF37] to-amber-200 p-[1px]">
              <div className="w-full h-full bg-[#0B0F17] rounded-[11px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-[#D4AF37]" />
              </div>
            </div>
            <div>
              <h3 className="font-heading font-semibold text-sm text-white flex items-center gap-2">
                AI Property Advisor
                <span className="text-[10px] bg-[#D4AF37]/20 text-[#D4AF37] px-2 py-0.5 rounded-full font-sans border border-[#D4AF37]/30">
                  Backend API Connected
                </span>
              </h3>
              <p className="text-[11px] text-gray-400">Natural language search & financial consultation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-2 rounded-lg bg-white/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'ai' && (
                <div className="w-8 h-8 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-[#D4AF37]" />
                </div>
              )}

              <div className={`space-y-3 max-w-[80%] ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                <div
                  className={`inline-block p-4 rounded-2xl text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#D4AF37] text-black font-medium'
                      : 'glass-panel text-gray-200 border border-white/10'
                  }`}
                >
                  {msg.text}
                </div>

                {/* Recommended Property Cards in Stream */}
                {msg.recommendedProps && msg.recommendedProps.length > 0 && (
                  <div className="grid grid-cols-1 gap-2 pt-2">
                    {msg.recommendedProps.slice(0, 2).map((prop) => (
                      <div
                        key={prop.id}
                        onClick={() => {
                          onSelectProperty(prop);
                          onClose();
                        }}
                        className="glass-card p-3 rounded-xl flex items-center justify-between border border-[#D4AF37]/30 hover:border-[#D4AF37] cursor-pointer group"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={prop.image}
                            alt={prop.title}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div>
                            <h4 className="text-xs font-bold text-white group-hover:text-[#D4AF37]">
                              {prop.title}
                            </h4>
                            <p className="text-[10px] text-gray-400">{prop.location} • {prop.price}</p>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-[#D4AF37] group-hover:translate-x-1 transition-transform" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-[#D4AF37]" />
              </div>
              <div className="glass-panel p-3 rounded-2xl text-xs text-gray-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full animate-bounce" />
                <span className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full animate-bounce delay-150" />
                <span className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full animate-bounce delay-300" />
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-4 bg-[#0B0F17] border-t border-white/10 flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about properties, pricing, home loans..."
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
          />
          <button
            type="submit"
            className="bg-[#D4AF37] hover:bg-amber-400 text-black font-bold p-3 rounded-xl transition-all shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
}
