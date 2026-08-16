import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, Bot, User, ArrowRight } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#1E293B] border border-slate-700/80 rounded-3xl w-full max-w-xl h-[600px] flex flex-col shadow-2xl overflow-hidden font-sans">
        
        {/* Header */}
        <div className="px-6 py-4 bg-[#0F172A] border-b border-slate-700/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-sky-400 p-[1px]">
              <div className="w-full h-full bg-[#0F172A] rounded-[11px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-sky-400" />
              </div>
            </div>
            <div>
              <h3 className="font-serif-fraunces font-semibold text-sm text-white flex items-center gap-2">
                AI Property Advisor
                <span className="text-[10px] bg-sky-500/10 text-sky-400 px-2 py-0.5 rounded-full font-mono border border-sky-500/30">
                  Backend API Connected
                </span>
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">Natural language search & financial consultation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-lg bg-slate-800"
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
                <div className="w-8 h-8 rounded-full bg-sky-500/20 border border-sky-500/40 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-sky-400" />
                </div>
              )}

              <div className={`space-y-3 max-w-[80%] ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                <div
                  className={`inline-block p-4 rounded-2xl text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-blue-600 to-sky-500 text-white font-bold'
                      : 'glass-panel text-slate-200 border border-slate-700 bg-[#0F172A]'
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
                        className="glass-card p-3 rounded-xl flex items-center justify-between border border-slate-700 hover:border-sky-500 cursor-pointer group bg-[#0F172A]/80"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={prop.image}
                            alt={prop.title}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div>
                            <h4 className="text-xs font-bold text-white group-hover:text-sky-400">
                              {prop.title}
                            </h4>
                            <p className="text-[10px] text-slate-400 font-mono">{prop.location} • {prop.price}</p>
                          </div>
                        </div>

                        <div className="w-8 h-8 rounded-full bg-slate-800 text-sky-400 flex items-center justify-center group-hover:bg-sky-400 group-hover:text-slate-950 transition-colors">
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3 items-center text-xs font-mono text-sky-400">
              <Bot className="w-4 h-4 animate-bounce" />
              <span>Analyzing portfolio models...</span>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-4 bg-[#0F172A] border-t border-slate-700/60 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask AI property recommendations..."
            className="flex-1 bg-[#1E293B] border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 font-mono"
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-blue-600 to-sky-500 text-white p-2.5 rounded-xl hover:opacity-90 transition-opacity"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
}
