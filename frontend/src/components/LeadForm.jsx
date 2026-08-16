import React, { useState } from 'react';
import { User, Phone, Mail, Building, Clock, MessageSquare, Send, CheckCircle2, Sparkles, X, ShieldCheck } from 'lucide-react';
import { PROPERTIES } from '../data/mockData';
import { createLeadAPI } from '../services/api';
import { showAlert } from '../utils/swal';

export default function LeadForm({ initialPropertyTitle, isModal = false, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    property: initialPropertyTitle || PROPERTIES[0].title,
    timeline: 'Immediate (0-3 Months)',
    query: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedLead, setSubmittedLead] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const apiRes = await createLeadAPI({
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      property: formData.property,
      query: `Timeline: ${formData.timeline} | Query: ${formData.query}`
    });

    setIsSubmitting(false);

    const leadInfo = (apiRes && apiRes.success && apiRes.data) ? apiRes.data : {
      name: formData.name,
      status: 'HOT',
      score: 92,
      property: formData.property
    };

    setSubmittedLead(leadInfo);

    showAlert({
      title: 'Inquiry Submitted Successfully!',
      text: `Thank you ${formData.name}. Our senior real estate advisor will contact you regarding ${formData.property}.`,
      icon: 'success',
      confirmButtonText: 'OK'
    });
  };


  const formContent = (
    <div className={`glass-panel p-6 sm:p-10 rounded-3xl border border-slate-700/60 shadow-2xl relative overflow-hidden text-[#F8FAFC] bg-[#1E293B]/80 ${isModal ? 'max-w-2xl w-full' : ''}`}>
      
      {/* Background Accent Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />

      {isModal && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-xl bg-slate-800 border border-slate-700"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      {submittedLead ? (
        <div className="text-center py-10 space-y-6 animate-in zoom-in-95 duration-300">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto shadow-xl">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h3 className="font-serif-fraunces text-2xl sm:text-3xl font-extrabold text-white">
              Inquiry Received!
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto font-light">
              Thank you, <span className="text-sky-400 font-semibold">{submittedLead.name}</span>. Our senior real estate portfolio executive will contact you shortly regarding <span className="text-white font-semibold">{submittedLead.property}</span>.
            </p>
          </div>

          {/* AI Lead Scoring Feedback Pill */}
          <div className="glass-panel p-4 rounded-2xl max-w-md mx-auto text-left text-xs space-y-2 border border-slate-700 font-mono bg-[#0F172A]">
            <div className="flex items-center justify-between">
              <span className="text-sky-400 font-bold flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                AI Lead Qualification Score:
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/40">
                {submittedLead.score || 90}/100 • {submittedLead.status || 'HOT'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-light">
              Your inquiry has been routed to our high-priority executive pipeline for immediate action.
            </p>
          </div>

          <button
            onClick={() => {
              setSubmittedLead(null);
              if (onClose) onClose();
            }}
            className="bg-gradient-to-r from-blue-600 to-sky-500 text-white font-bold text-xs px-8 py-3.5 rounded-xl transition-all shadow-lg font-sans"
          >
            Submit Another Request
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          
          <div className="text-center space-y-2">
            <span className="text-xs uppercase font-mono font-bold text-sky-400 tracking-widest inline-flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              DIRECT PORTFOLIO INQUIRY
            </span>
            <h2 className="font-serif-fraunces text-2xl sm:text-4xl font-extrabold text-white">
              Get Exclusive Property Details
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 font-light">
              Submit your requirements to receive floor plans, pricing breakdowns, and pre-launch offers.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            
            {/* Full Name */}
            <div className="space-y-1">
              <label className="text-slate-300 font-medium flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-sky-400" />
                Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Ramesh Varma"
                className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-3.5 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 font-sans"
              />
            </div>

            {/* Phone Number */}
            <div className="space-y-1">
              <label className="text-slate-300 font-medium flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-sky-400" />
                Phone Number (WhatsApp) *
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 98765 43210"
                className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-3.5 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 font-sans"
              />
            </div>

            {/* Email Address */}
            <div className="space-y-1">
              <label className="text-slate-300 font-medium flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-sky-400" />
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="ramesh@example.com"
                className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-3.5 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 font-sans"
              />
            </div>

            {/* Interested Property */}
            <div className="space-y-1">
              <label className="text-slate-300 font-medium flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-sky-400" />
                Property of Interest
              </label>
              <select
                value={formData.property}
                onChange={(e) => setFormData({ ...formData, property: e.target.value })}
                className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-3 py-3 text-slate-200 focus:outline-none focus:border-sky-500"
              >
                {PROPERTIES.map((p) => (
                  <option key={p.id} value={p.title}>
                    {p.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Buying Timeline */}
            <div className="space-y-1 sm:col-span-2">
              <label className="text-slate-300 font-medium flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-sky-400" />
                Planning Timeline
              </label>
              <select
                value={formData.timeline}
                onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-3 py-3 text-slate-200 focus:outline-none focus:border-sky-500"
              >
                <option value="Immediate (0-3 Months)">Immediate (0-3 Months)</option>
                <option value="Medium Term (3-6 Months)">Medium Term (3-6 Months)</option>
                <option value="Future Investment (6+ Months)">Future Investment (6+ Months)</option>
              </select>
            </div>

            {/* Specific Queries */}
            <div className="space-y-1 sm:col-span-2">
              <label className="text-slate-300 font-medium flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-sky-400" />
                Specific Customization / Loan Requirements
              </label>
              <textarea
                rows={3}
                value={formData.query}
                onChange={(e) => setFormData({ ...formData, query: e.target.value })}
                placeholder="Ask about floor plan modifications, bank home loan pre-approval, or payment schedule options..."
                className="w-full bg-[#0F172A] border border-slate-700 rounded-xl p-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 font-sans"
              />
            </div>

            {/* Submit Button */}
            <div className="sm:col-span-2 pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-600 via-sky-500 to-indigo-600 hover:from-blue-500 hover:to-sky-400 text-white font-bold text-xs sm:text-sm py-4 rounded-xl transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 font-sans"
              >
                {isSubmitting ? (
                  <span>Submitting Inquiry to AI Pipeline...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Request Confidential Portfolio Package</span>
                  </>
                )}
              </button>
            </div>

          </form>

        </div>
      )}

    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
        {formContent}
      </div>
    );
  }

  return (
    <section id="inquire" className="py-20 bg-[#0F172A] blueprint-grid relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {formContent}
      </div>
    </section>
  );
}
