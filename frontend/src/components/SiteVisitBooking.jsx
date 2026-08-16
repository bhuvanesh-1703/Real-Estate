import React, { useState } from 'react';
import { Calendar, Clock, User, Phone, Mail, Building, CheckCircle2, Sparkles, Send } from 'lucide-react';
import { PROPERTIES } from '../data/mockData';
import { createLeadAPI, createSiteVisitAPI } from '../services/api';
import { showAlert, showToast } from '../utils/swal';

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

    showAlert({
      title: 'VIP Chauffeured Tour Reserved!',
      text: `Thank you, ${formData.name}. Our relationship manager will contact you at ${formData.phone} for dispatch details.`,
      icon: 'success',
      confirmButtonText: 'Great'
    });
  };


  return (
    <section id="site-visit" className="py-20 bg-[#0F172A] blueprint-grid relative text-[#F8FAFC]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-slate-700/60 shadow-2xl relative overflow-hidden bg-[#1E293B]/80">
          
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

          {submitted ? (
            <div className="text-center py-12 space-y-6 animate-in zoom-in-95 duration-300">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h3 className="font-serif-fraunces font-bold text-2xl text-white">
                  VIP Chauffeured Visit Confirmed!
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto font-light">
                  Our private client relationship desk will contact you at <span className="text-sky-400 font-semibold">{formData.phone}</span> to confirm chauffeur dispatch details.
                </p>
              </div>

              <button
                onClick={() => setSubmitted(false)}
                className="bg-gradient-to-r from-blue-600 to-sky-500 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all shadow-lg font-sans"
              >
                Book Another Tour
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="text-center space-y-2">
                <div className="inline-flex items-center gap-2 bg-sky-500/10 px-3 py-1 rounded-full text-xs font-mono font-semibold text-sky-400 border border-sky-500/30">
                  <Sparkles className="w-3.5 h-3.5" />
                  WHITE-GLOVE VIP CONCIERGE
                </div>
                <h2 className="font-serif-fraunces text-2xl sm:text-4xl font-extrabold text-white">
                  Schedule Private Chauffeured Tour
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 font-light">
                  Experience prime construction quality, layout geometry, and neighborhood connectivity with private transport.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5 text-xs font-mono">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-300 block mb-1.5 font-medium">Full Name</label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Dr. Arvind Sundaram"
                        className="w-full bg-[#0F172A] border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-sky-500 transition-colors font-sans"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-300 block mb-1.5 font-medium">Phone Number (WhatsApp)</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="w-full bg-[#0F172A] border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-sky-500 transition-colors font-sans"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-300 block mb-1.5 font-medium">Email Address</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="arvind.s@example.com"
                        className="w-full bg-[#0F172A] border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-sky-500 transition-colors font-sans"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-300 block mb-1.5 font-medium">Select Property Estate</label>
                    <div className="relative">
                      <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <select
                        value={formData.property}
                        onChange={(e) => setFormData({ ...formData, property: e.target.value })}
                        className="w-full bg-[#0F172A] border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-slate-200 focus:outline-none focus:border-sky-500 transition-colors"
                      >
                        {PROPERTIES.map((p) => (
                          <option key={p.id} value={p.title}>
                            {p.title} ({p.price})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-300 block mb-1.5 font-medium">Preferred Tour Date</label>
                    <div className="relative">
                      <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="date"
                        required
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="w-full bg-[#0F172A] border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-slate-200 focus:outline-none focus:border-sky-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-300 block mb-1.5 font-medium">Preferred Time Slot</label>
                    <div className="relative">
                      <Clock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <select
                        value={formData.time}
                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                        className="w-full bg-[#0F172A] border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-slate-200 focus:outline-none focus:border-sky-500 transition-colors"
                      >
                        <option value="10:00 AM">10:00 AM (Morning Slot)</option>
                        <option value="02:30 PM">02:30 PM (Afternoon Slot)</option>
                        <option value="05:30 PM">05:30 PM (Sunset View Slot)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-600 via-sky-500 to-indigo-600 hover:from-blue-500 hover:to-sky-400 text-white font-bold text-xs sm:text-sm py-3.5 rounded-xl transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 font-sans mt-4"
                >
                  {isSubmitting ? (
                    <span>Confirming VIP Reservation...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Confirm VIP Private Tour</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

        </div>

      </div>
    </section>
  );
}
