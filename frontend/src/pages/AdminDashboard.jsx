import React, { useState, useEffect } from 'react';
import { MOCK_LEADS, PROPERTIES } from '../data/mockData';
import { fetchLeadsAPI, fetchPropertiesAPI, createPropertyAPI } from '../services/api';
import { Plus, Trash2, ShieldCheck, Flame } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('Overview');
  const [leads, setLeads] = useState(MOCK_LEADS);
  const [properties, setProperties] = useState(PROPERTIES);
  const [showAddPropertyModal, setShowAddPropertyModal] = useState(false);

  useEffect(() => {
    async function loadData() {
      const [apiLeads, apiProperties] = await Promise.all([
        fetchLeadsAPI(),
        fetchPropertiesAPI('All')
      ]);

      if (apiLeads && Array.isArray(apiLeads) && apiLeads.length > 0) {
        setLeads(apiLeads);
      }
      if (apiProperties && Array.isArray(apiProperties) && apiProperties.length > 0) {
        setProperties(apiProperties);
      }
    }
    loadData();
  }, []);

  const [newProp, setNewProp] = useState({
    title: '',
    price: '',
    location: '',
    type: 'Villa',
    bhk: 3,
    status: 'Available'
  });

  const handleAddProperty = async (e) => {
    e.preventDefault();
    const payload = {
      title: newProp.title,
      price: newProp.price,
      location: newProp.location,
      type: newProp.type,
      bhk: Number(newProp.bhk),
      area: '2,200 sq.ft',
      status: newProp.status,
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80"
    };

    const res = await createPropertyAPI(payload);
    if (res && res.success && res.data) {
      setProperties([res.data, ...properties]);
    } else {
      const created = { id: `prop-${Date.now()}`, ...payload };
      setProperties([created, ...properties]);
    }
    setShowAddPropertyModal(false);
  };


  const analyticsData = [
    { month: 'May', leads: 42, visits: 18 },
    { month: 'Jun', leads: 65, visits: 29 },
    { month: 'Jul', leads: 88, visits: 41 },
    { month: 'Aug', leads: 120, visits: 58 }
  ];

  return (
    <div className="pt-24 pb-20 bg-[#07090F] min-h-screen text-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <span className="text-xs uppercase font-bold text-[#D4AF37] tracking-widest flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              SECURE PORTAL
            </span>
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-white mt-1">
              Real Estate CRM & Operations Dashboard
            </h1>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setShowAddPropertyModal(true)}
              className="bg-[#D4AF37] hover:bg-amber-400 text-black font-bold text-xs px-4 py-2.5 rounded-xl transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add New Property
            </button>
            <button
              onClick={() => {
                localStorage.removeItem('admin_token');
                window.location.href = '/admin/login';
              }}
              className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 font-bold text-xs px-4 py-2.5 rounded-xl transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex overflow-x-auto gap-2 border-b border-white/10 pb-4 scrollbar-none text-xs">
          {['Overview', 'Leads CRM', 'Property Catalog', 'Analytics'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-xl font-semibold transition-all whitespace-nowrap ${
                activeTab === tab
                  ? 'bg-[#D4AF37] text-black font-bold'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === 'Overview' && (
          <div className="space-y-8">
            
            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-1">
                <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Total Leads</span>
                <span className="font-heading font-extrabold text-2xl text-white">120</span>
                <span className="text-[10px] text-emerald-400 font-semibold block">+24% this month</span>
              </div>

              <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-1">
                <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Hot Leads (AI Scored)</span>
                <span className="font-heading font-extrabold text-2xl text-[#D4AF37] flex items-center gap-2">
                  38 <Flame className="w-5 h-5 text-amber-500 fill-current" />
                </span>
                <span className="text-[10px] text-gray-400 block">Immediate buying intent</span>
              </div>

              <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-1">
                <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Site Visits Scheduled</span>
                <span className="font-heading font-extrabold text-2xl text-white">58</span>
                <span className="text-[10px] text-emerald-400 font-semibold block">12 pending this week</span>
              </div>

              <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-1">
                <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Conversion Rate</span>
                <span className="font-heading font-extrabold text-2xl text-emerald-400">18.4%</span>
                <span className="text-[10px] text-gray-400 block">SaaS Industry benchmark</span>
              </div>
            </div>

            {/* Recharts Analytics Chart */}
            <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
              <h3 className="font-heading font-bold text-base text-white">Lead Inflow vs Site Visit Conversion</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analyticsData}>
                    <XAxis dataKey="month" stroke="#6B7280" fontSize={11} />
                    <YAxis stroke="#6B7280" fontSize={11} />
                    <Tooltip contentStyle={{ backgroundColor: '#0B0F17', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }} />
                    <Bar dataKey="leads" fill="#D4AF37" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="visits" fill="#3B82F6" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        )}

        {/* LEADS CRM TAB */}
        {activeTab === 'Leads CRM' && (
          <div className="glass-panel rounded-3xl border border-white/10 p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-bold text-lg text-white">Automated Lead Scoring Pipeline</h3>
              <span className="text-xs text-[#D4AF37] font-semibold">Make.com Webhook Sync Active</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-gray-400 uppercase text-[10px]">
                    <th className="py-3 px-4">Lead ID / Name</th>
                    <th className="py-3 px-4">Contact</th>
                    <th className="py-3 px-4">Interested Property</th>
                    <th className="py-3 px-4">Source</th>
                    <th className="py-3 px-4">AI Score</th>
                    <th className="py-3 px-4">Pipeline Status</th>
                    <th className="py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {leads.map((ld) => (
                    <tr key={ld.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-4 px-4">
                        <span className="font-bold text-white block">{ld.name}</span>
                        <span className="text-[10px] text-gray-400">{ld.id}</span>
                      </td>
                      <td className="py-4 px-4 text-gray-300">
                        <div>{ld.phone}</div>
                        <div className="text-[10px] text-gray-500">{ld.email}</div>
                      </td>
                      <td className="py-4 px-4 text-gray-200 font-medium">{ld.interestedProperty}</td>
                      <td className="py-4 px-4 text-gray-400">{ld.source}</td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center gap-1 font-bold px-2.5 py-1 rounded-full text-[10px] ${
                            ld.status === 'HOT'
                              ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                              : ld.status === 'WARM'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-gray-500/20 text-gray-400'
                          }`}
                        >
                          {ld.score}/100 • {ld.status}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="bg-white/10 text-white px-2.5 py-1 rounded-lg text-[10px] font-medium">
                          Scheduled Site Visit
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <a
                          href={`https://wa.me/${ld.phone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-[10px] font-semibold hover:bg-emerald-500"
                        >
                          WhatsApp Lead
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PROPERTY CATALOG TAB */}
        {activeTab === 'Property Catalog' && (
          <div className="glass-panel rounded-3xl border border-white/10 p-6 space-y-6">
            <h3 className="font-heading font-bold text-lg text-white">Live Property Inventory ({properties.length})</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {properties.map((p) => (
                <div key={p.id} className="bg-white/5 p-4 rounded-2xl border border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img src={p.image} alt={p.title} className="w-16 h-16 rounded-xl object-cover" />
                    <div>
                      <h4 className="font-bold text-sm text-white">{p.title}</h4>
                      <p className="text-xs text-gray-400">{p.location} • <span className="text-[#D4AF37]">{p.price}</span></p>
                      <span className="text-[10px] text-emerald-400 font-semibold">{p.status}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setProperties(properties.filter(item => item.id !== p.id))}
                    className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ANALYTICS TAB */}
        {activeTab === 'Analytics' && (
          <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
            <h3 className="font-heading font-bold text-lg text-white">Monthly Traffic & Lead Conversion Rate</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analyticsData}>
                  <XAxis dataKey="month" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip contentStyle={{ backgroundColor: '#0B0F17', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }} />
                  <Line type="monotone" dataKey="leads" stroke="#D4AF37" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

      </div>

      {/* Add Property Modal */}
      {showAddPropertyModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <form onSubmit={handleAddProperty} className="bg-[#101725] border border-white/10 p-6 rounded-3xl w-full max-w-md space-y-4 text-xs">
            <h3 className="font-heading font-bold text-lg text-white">Add New Property Entry</h3>

            <div>
              <label className="text-gray-300 block mb-1">Property Title</label>
              <input
                type="text"
                required
                value={newProp.title}
                onChange={(e) => setNewProp({ ...newProp, title: e.target.value })}
                placeholder="e.g. Royal Crown Villa"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-gray-300 block mb-1">Price</label>
                <input
                  type="text"
                  required
                  value={newProp.price}
                  onChange={(e) => setNewProp({ ...newProp, price: e.target.value })}
                  placeholder="e.g. ₹95 Lakhs"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="text-gray-300 block mb-1">Location</label>
                <input
                  type="text"
                  required
                  value={newProp.location}
                  onChange={(e) => setNewProp({ ...newProp, location: e.target.value })}
                  placeholder="e.g. Anna Nagar"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-gray-300 block mb-1">Property Type</label>
                <select
                  value={newProp.type}
                  onChange={(e) => setNewProp({ ...newProp, type: e.target.value })}
                  className="w-full bg-[#151C28] border border-white/10 rounded-xl px-3 py-2 text-white"
                >
                  <option value="Villa">Villa</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Plots">Plots</option>
                  <option value="Independent Houses">Independent Houses</option>
                </select>
              </div>

              <div>
                <label className="text-gray-300 block mb-1">BHK</label>
                <input
                  type="number"
                  value={newProp.bhk}
                  onChange={(e) => setNewProp({ ...newProp, bhk: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddPropertyModal(false)}
                className="flex-1 bg-white/5 text-gray-300 py-2.5 rounded-xl font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-[#D4AF37] text-black py-2.5 rounded-xl font-bold"
              >
                Save Property
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
