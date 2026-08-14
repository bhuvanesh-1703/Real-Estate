import React, { useState } from 'react';
import { Calendar, Clock, User, Phone, Mail, Building, CheckCircle2, Sparkles, Send } from 'lucide-react';
import { PROPERTIES } from '../data/mockData';
import { createLeadAPI, createSiteVisitAPI } from '../services/api';

export default function SiteVisitBooking({ initialPropertyTitle, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    property: initialPropertyTitle || PROPERTIES[0].title,
    date: '',
    time: '10:00 AM'
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Call API endpoints
    await Promise.all([
      createLeadAPI({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        property: formData.property,
        date: formData.date,
        time: formData.time,
        query: 'VIP Site Visit Scheduled'
      }),
      createSiteVisitAPI({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        propertyTitle: formData.property,
        visitDate: formData.date,
        timeSlot: formData.time
      })
    ]);

    setIsSubmitting(false);
    setSubmitted(true);
  };

  return (
    <section id="site-visit" className="py-20 bg-[#0B0F17] relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-[#D4AF37]/30 shadow-2xl relative overflow-hidden">
          
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-[100px] pointer-events-none" />

          {submitted ? (
            <div className="text-center py-12 space-y-6 animate-in zoom-in-95 duration-300">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-white">
                  VIP Site Visit Confirmed!
                </h3>
                <p className="text-xs sm:text-sm text-gray-300 max-w-md mx-auto">
                  Thank you, <span className="text-[#D4AF37] font-semibold">{formData.name}</span>. A designated luxury property advisor will accompany you to <span className="text-white font-semibold">{formData.property}</span>.
                </p>
              </div>

              <div className="glass-panel p-4 rounded-2xl max-w-md mx-auto text-left text-xs space-y-2 border border-white/10">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                  <Sparkles className="w-4 h-4" />
                  <span>Backend API Sync Complete:</span>
                </div>
                <ul className="text-gray-400 space-y-1 pl-6 list-disc">
                  <li>Lead saved to MongoDB database with HOT AI score status</li>
                  <li>Site visit slot registered on backend API</li>
                  <li>Instant response routed to CRM dashboard</li>
                </ul>
              </div>

              <button
                onClick={() => {
                  setSubmitted(false);
                  if (onClose) onClose();
                }}
                className="bg-[#D4AF37] hover:bg-amber-400 text-black font-bold text-xs px-8 py-3 rounded-xl transition-all"
              >
                Done
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              
              <div className="text-center space-y-2">
                <span className="text-xs uppercase font-bold text-[#D4AF37] tracking-widest">
                  Personalized Inspection
                </span>
                <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white">
                  Schedule a Private Site Visit
                </h2>
                <p className="text-xs sm:text-sm text-gray-400">
                  Select your preferred timing. We arrange chauffeured luxury transport & private tour guides.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
                
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="text-gray-300 font-medium flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#D4AF37]" />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Anand Kumar"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <label className="text-gray-300 font-medium flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
                    Phone Number (WhatsApp) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-gray-300 font-medium flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#D4AF37]" />
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="anand@example.com"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                {/* Property Select */}
                <div className="space-y-1.5">
                  <label className="text-gray-300 font-medium flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-[#D4AF37]" />
                    Interested Property *
                  </label>
                  <select
                    value={formData.property}
                    onChange={(e) => setFormData({ ...formData, property: e.target.value })}
                    className="w-full bg-[#151C28] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]"
                  >
                    {PROPERTIES.map((p) => (
                      <option key={p.id} value={p.title}>
                        {p.title} ({p.price})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Preferred Date */}
                <div className="space-y-1.5">
                  <label className="text-gray-300 font-medium flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                    Preferred Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                {/* Preferred Time */}
                <div className="space-y-1.5">
                  <label className="text-gray-300 font-medium flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                    Preferred Time Slot *
                  </label>
                  <select
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full bg-[#151C28] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="10:00 AM">Morning (10:00 AM - 12:00 PM)</option>
                    <option value="02:00 PM">Afternoon (02:00 PM - 04:00 PM)</option>
                    <option value="05:00 PM">Evening (05:00 PM - 07:00 PM)</option>
                  </select>
                </div>

                <div className="sm:col-span-2 pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-black font-bold text-sm py-4 rounded-xl shadow-xl hover:brightness-110 transition-all flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <span>Syncing with API...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Confirm VIP Site Visit</span>
                      </>
                    )}
                  </button>
                </div>

              </form>

            </div>
          )}

        </div>

      </div>
    </section>
  );
}
