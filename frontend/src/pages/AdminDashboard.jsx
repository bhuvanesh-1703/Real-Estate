import React, { useState, useEffect } from 'react';
import { MOCK_LEADS, PROPERTIES } from '../data/mockData';
import {
  fetchLeadsAPI,
  fetchPropertiesAPI,
  createPropertyAPI,
  updatePropertyAPI,
  patchPropertyStatusAPI,
  deletePropertyAPI,
  updateLeadAPI,
  updateLeadStatusAPI,
  deleteLeadAPI
} from '../services/api';
import {
  Plus, Trash2, Edit3, ShieldCheck, Flame, Search, RefreshCw, LogOut,
  Building2, Users, Calendar, TrendingUp, Sparkles, PhoneCall, Mail,
  CheckCircle2, ArrowUpRight, Activity, X, Eye, Layers, Image as ImageIcon,
  Video as VideoIcon, Play, AlertCircle, FileText, MapPin, Upload, Film
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

import {
  confirmAction,
  showToast,
  showAlert
} from '../utils/swal';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('Overview');
  const [leads, setLeads] = useState(MOCK_LEADS);
  const [properties, setProperties] = useState(PROPERTIES);
  const [isLoading, setIsLoading] = useState(false);

  // Search, Filter & Sort state for Properties
  const [propertySearch, setPropertySearch] = useState('');
  const [propertyTypeFilter, setPropertyTypeFilter] = useState('ALL');
  const [propertyStatusFilter, setPropertyStatusFilter] = useState('ALL');
  const [propertySort, setPropertySort] = useState('newest');

  // Search & Filter state for Leads
  const [leadSearch, setLeadSearch] = useState('');
  const [leadStatusFilter, setLeadStatusFilter] = useState('ALL');

  // Selected lead for detail view modal
  const [selectedLeadModal, setSelectedLeadModal] = useState(null);

  // Lead Edit Modal state
  const [editingLead, setEditingLead] = useState(null);

  // Property Form Modal state (Handles both ADD and EDIT)
  const [propertyModalOpen, setPropertyModalOpen] = useState(false);
  const [propertyModalMode, setPropertyModalMode] = useState('add'); // 'add' | 'edit'
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);
  const [isSubmittingProperty, setIsSubmittingProperty] = useState(false);

  // Property Form Data
  const [propertyFormData, setPropertyFormData] = useState({
    title: '',
    price: '',
    priceNumeric: '',
    location: '',
    propertyType: 'Villa',
    bhk: 3,
    area: '2,400 sq.ft',
    plotSize: 2400,
    plotSizeUnit: 'sqft',
    status: 'Available',
    description: '',
    features: 'Private Pool, Smart Home, 24/7 Security, Solar Powered',
    highYield: false,
    googleMapsUrl: '',
    latitude: '',
    longitude: '',
    img1: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
    img2: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
    img3: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-modern-luxury-villa-exterior-41561-large.mp4',
    videoDuration: 12
  });

  // Local Media Files State for multipart uploads
  const [imageFiles, setImageFiles] = useState([]); // File objects
  const [videoFile, setVideoFile] = useState(null); // Single File object
  const [videoDuration, setVideoDuration] = useState(0);
  const [videoFileSize, setVideoFileSize] = useState(0);

  const loadData = async () => {
    setIsLoading(true);
    try {
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
      showToast('Live API Data Synchronized', 'success');
    } catch (err) {
      console.warn('[Admin Dashboard] Failed to sync live API data:', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // ==================== LEAD ACTIONS ====================

  const handleLeadStatusChange = async (id, newStatus) => {
    setLeads(prev => prev.map(l => (l.id === id || l._id === id) ? { ...l, status: newStatus } : l));
    await updateLeadStatusAPI(id, newStatus);
    showToast(`Lead status updated to ${newStatus}`, 'success');
  };

  const handleOpenEditLead = (lead) => {
    setEditingLead({
      id: lead.id || lead._id,
      name: lead.name || '',
      phone: lead.phone || '',
      email: lead.email || '',
      interestedProperty: lead.interestedProperty || lead.property || '',
      status: lead.status || 'HOT',
      notes: lead.notes || lead.query || '',
      score: lead.score || 85
    });
  };

  const handleSaveEditedLead = async (e) => {
    e.preventDefault();
    if (!editingLead) return;

    const leadId = editingLead.id;
    const payload = {
      name: editingLead.name,
      phone: editingLead.phone,
      email: editingLead.email,
      property: editingLead.interestedProperty,
      status: editingLead.status,
      notes: editingLead.notes,
      score: Number(editingLead.score) || 85
    };

    setLeads(prev => prev.map(l => (l.id === leadId || l._id === leadId) ? { ...l, ...payload } : l));
    await updateLeadAPI(leadId, payload);
    setEditingLead(null);
    showToast('Lead details updated successfully!', 'success');
  };

  const handleDeleteLead = async (id) => {
    const res = await confirmAction({
      title: 'Delete Lead Record?',
      text: 'Are you sure you want to remove this CRM lead entry? This action cannot be undone.',
      confirmButtonText: 'Yes, Delete Lead',
      icon: 'warning'
    });

    if (res.isConfirmed) {
      setLeads(prev => prev.filter(l => l.id !== id && l._id !== id));
      await deleteLeadAPI(id);
      showToast('Lead record deleted successfully', 'success');
    }
  };

  // ==================== PROPERTY ACTIONS ====================

  // Quick Change Property Status
  const handlePropertyStatusChange = async (id, newStatus) => {
    setProperties(prev => prev.map(p => (p.id === id || p._id === id) ? { ...p, status: newStatus } : p));
    await patchPropertyStatusAPI(id, newStatus);
    showToast(`Property status updated to ${newStatus}`, 'success');
  };

  // Handle Video File Selection with Mandatory <= 15 Seconds Frontend Validation
  const handleVideoFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      showAlert({
        title: 'Invalid File Format',
        text: 'Please select a valid video file (MP4 or WebM).',
        icon: 'error'
      });
      return;
    }

    // Inspect video duration via temporary HTML5 video element
    const tempVideo = document.createElement('video');
    tempVideo.preload = 'metadata';
    tempVideo.src = URL.createObjectURL(file);

    tempVideo.onloadedmetadata = () => {
      URL.revokeObjectURL(tempVideo.src);
      const durationSec = Math.round(tempVideo.duration);

      if (durationSec > 15) {
        showAlert({
          title: 'Video Duration Exceeds Limit',
          text: `Selected video duration is ${durationSec} seconds. Video duration must be 15 seconds or less for property virtual tours!`,
          icon: 'warning',
          confirmButtonText: 'Select Shorter Video'
        });
        e.target.value = '';
        setVideoFile(null);
        setVideoDuration(0);
        setVideoFileSize(0);
        return;
      }

      setVideoFile(file);
      setVideoDuration(durationSec);
      setVideoFileSize((file.size / (1024 * 1024)).toFixed(2));
      showToast(`15-second video verified (${durationSec}s)`, 'success');
    };
  };

  // Remove Selected Video
  const handleRemoveVideo = () => {
    setVideoFile(null);
    setVideoDuration(0);
    setVideoFileSize(0);
    setPropertyFormData(prev => ({ ...prev, videoUrl: '' }));
  };

  // Open Property Modal for ADD
  const handleOpenAddProperty = () => {
    setPropertyModalMode('add');
    setSelectedPropertyId(null);
    setVideoFile(null);
    setImageFiles([]);
    setVideoDuration(0);
    setVideoFileSize(0);
    setPropertyFormData({
      title: '',
      price: '₹1.85 Cr',
      priceNumeric: 18500000,
      location: 'Anna Nagar, Madurai',
      propertyType: 'Villa',
      bhk: 3,
      area: '2,400 sq.ft',
      plotSize: 2400,
      plotSizeUnit: 'sqft',
      status: 'Available',
      description: 'Luxurious modern estate featuring premier architecture, private garden, and smart home connectivity.',
      features: 'Private Pool, Smart Home Automation, 24/7 Biometric Security, Solar Grid',
      highYield: true,
      googleMapsUrl: 'https://maps.google.com/?q=Anna+Nagar+Madurai',
      latitude: 9.9252,
      longitude: 78.1198,
      img1: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
      img2: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
      img3: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-modern-luxury-villa-exterior-41561-large.mp4',
      videoDuration: 12
    });
    setPropertyModalOpen(true);
  };

  // Open Property Modal for EDIT
  const handleOpenEditProperty = (prop) => {
    setPropertyModalMode('edit');
    setSelectedPropertyId(prop.id || prop._id);
    setVideoFile(null);
    setImageFiles([]);
    setVideoDuration(0);
    setVideoFileSize(0);

    const gallery = prop.gallery || (prop.images ? prop.images.map(i => typeof i === 'string' ? i : i.url) : []);
    const videoUrl = typeof prop.video === 'object' ? (prop.video.url || '') : (prop.video || '');
    const vidDur = typeof prop.video === 'object' ? (prop.video.duration || 0) : 0;

    setPropertyFormData({
      title: prop.title || '',
      price: prop.price || '',
      priceNumeric: prop.priceNumeric || '',
      location: prop.location || '',
      propertyType: prop.propertyType || prop.type || 'Villa',
      bhk: prop.bhk || 3,
      area: prop.area || '2,400 sq.ft',
      plotSize: prop.plotSize || 2400,
      plotSizeUnit: prop.plotSizeUnit || 'sqft',
      status: prop.status || 'Available',
      description: prop.description || '',
      features: Array.isArray(prop.features) ? prop.features.join(', ') : (prop.features || ''),
      highYield: prop.highYield || false,
      googleMapsUrl: prop.googleMapsUrl || '',
      latitude: prop.latitude || '',
      longitude: prop.longitude || '',
      img1: gallery[0] || prop.image || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
      img2: gallery[1] || 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
      img3: gallery[2] || 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80',
      videoUrl: videoUrl,
      videoDuration: vidDur
    });
    setPropertyModalOpen(true);
  };

  // Property Form Submit
  const handleSaveProperty = async (e) => {
    e.preventDefault();
    setIsSubmittingProperty(true);

    try {
      // Check if files are attached for multipart form submission
      if (imageFiles.length > 0 || videoFile) {
        const formData = new FormData();
        formData.append('title', propertyFormData.title);
        formData.append('price', propertyFormData.price);
        formData.append('priceNumeric', propertyFormData.priceNumeric);
        formData.append('location', propertyFormData.location);
        formData.append('propertyType', propertyFormData.propertyType);
        formData.append('bhk', propertyFormData.bhk);
        formData.append('area', propertyFormData.area);
        formData.append('plotSize', propertyFormData.plotSize);
        formData.append('plotSizeUnit', propertyFormData.plotSizeUnit);
        formData.append('status', propertyFormData.status);
        formData.append('description', propertyFormData.description);
        formData.append('highYield', propertyFormData.highYield);
        formData.append('googleMapsUrl', propertyFormData.googleMapsUrl);
        formData.append('latitude', propertyFormData.latitude);
        formData.append('longitude', propertyFormData.longitude);

        const featArr = propertyFormData.features ? propertyFormData.features.split(',').map(s => s.trim()) : [];
        formData.append('features', JSON.stringify(featArr));

        imageFiles.forEach(file => {
          formData.append('images', file);
        });
        if (videoFile) {
          formData.append('video', videoFile);
        }

        let res;
        if (propertyModalMode === 'add') {
          res = await createPropertyAPI(formData);
        } else {
          res = await updatePropertyAPI(selectedPropertyId, formData);
        }

        if (res && res.success && res.data) {
          if (propertyModalMode === 'add') {
            setProperties([res.data, ...properties]);
            showToast('Property published with Cloudinary media!', 'success');
          } else {
            setProperties(prev => prev.map(p => (p.id === selectedPropertyId || p._id === selectedPropertyId) ? res.data : p));
            showToast('Property details updated with Cloudinary media!', 'success');
          }
        }
      } else {
        // Standard JSON payload
        const galleryImages = [
          propertyFormData.img1,
          propertyFormData.img2,
          propertyFormData.img3
        ].filter(Boolean);

        const payload = {
          title: propertyFormData.title,
          price: propertyFormData.price,
          priceNumeric: Number(propertyFormData.priceNumeric) || 0,
          location: propertyFormData.location,
          propertyType: propertyFormData.propertyType,
          type: propertyFormData.propertyType,
          bhk: Number(propertyFormData.bhk),
          area: propertyFormData.area,
          plotSize: Number(propertyFormData.plotSize) || 2000,
          plotSizeUnit: propertyFormData.plotSizeUnit || 'sqft',
          status: propertyFormData.status,
          description: propertyFormData.description,
          features: propertyFormData.features ? propertyFormData.features.split(',').map(s => s.trim()) : [],
          highYield: Boolean(propertyFormData.highYield),
          googleMapsUrl: propertyFormData.googleMapsUrl,
          latitude: propertyFormData.latitude ? Number(propertyFormData.latitude) : undefined,
          longitude: propertyFormData.longitude ? Number(propertyFormData.longitude) : undefined,
          image: galleryImages[0] || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
          images: galleryImages.map(url => ({ url, publicId: '' })),
          gallery: galleryImages,
          video: {
            url: propertyFormData.videoUrl,
            publicId: '',
            duration: propertyFormData.videoDuration || 12
          }
        };

        if (propertyModalMode === 'add') {
          const res = await createPropertyAPI(payload);
          if (res && res.success && res.data) {
            setProperties([res.data, ...properties]);
          } else {
            const created = { id: `prop-${Date.now()}`, ...payload, createdAt: new Date().toISOString() };
            setProperties([created, ...properties]);
          }
          showToast('New Property entry published!', 'success');
        } else {
          setProperties(prev => prev.map(p => (p.id === selectedPropertyId || p._id === selectedPropertyId) ? { ...p, ...payload } : p));
          await updatePropertyAPI(selectedPropertyId, payload);
          showToast('Property details updated successfully!', 'success');
        }
      }

      setPropertyModalOpen(false);
    } catch (err) {
      showAlert({
        title: 'Property Save Error',
        text: err.message || 'Could not save property. Please verify backend service.',
        icon: 'error'
      });
    } finally {
      setIsSubmittingProperty(false);
    }
  };

  // Delete Property with SweetAlert2 prompt & Cloudinary cleanup
  const handleDeleteProperty = async (id) => {
    const res = await confirmAction({
      title: 'Remove Property Listing?',
      text: 'Are you sure you want to delete this property document and destroy all associated Cloudinary media assets?',
      confirmButtonText: 'Yes, Delete & Cleanup',
      icon: 'warning'
    });

    if (res.isConfirmed) {
      setProperties(prev => prev.filter(p => p.id !== id && p._id !== id));
      await deletePropertyAPI(id);
      showToast('Property and Cloudinary media deleted', 'success');
    }
  };

  // Logout handler
  const handleLogout = async () => {
    const res = await confirmAction({
      title: 'Logout Admin Session?',
      text: 'Are you sure you want to sign out from the Admin Command Hub?',
      confirmButtonText: 'Yes, Sign Out',
      icon: 'question'
    });

    if (res.isConfirmed) {
      localStorage.removeItem('admin_token');
      showToast('Signed out successfully', 'info');
      window.location.href = '/admin/login';
    }
  };

  // Filtered & Sorted Properties
  const filteredProperties = properties.filter(p => {
    const searchLower = propertySearch.toLowerCase();
    const titleMatch = (p.title || '').toLowerCase().includes(searchLower);
    const locationMatch = (p.location || '').toLowerCase().includes(searchLower);
    const pType = p.propertyType || p.type || '';
    const typeMatch = pType.toLowerCase().includes(searchLower);

    const matchesSearch = titleMatch || locationMatch || typeMatch;
    const matchesType = propertyTypeFilter === 'ALL' ? true : (pType === propertyTypeFilter);
    const matchesStatus = propertyStatusFilter === 'ALL' ? true : (p.status === propertyStatusFilter);

    return matchesSearch && matchesType && matchesStatus;
  }).sort((a, b) => {
    if (propertySort === 'price-asc') return (a.priceNumeric || 0) - (b.priceNumeric || 0);
    if (propertySort === 'price-desc') return (b.priceNumeric || 0) - (a.priceNumeric || 0);
    if (propertySort === 'size-desc') return (b.plotSize || 0) - (a.plotSize || 0);
    return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
  });

  // Filtered Leads
  const filteredLeads = leads.filter(l => {
    const matchesSearch = (l.name || '').toLowerCase().includes(leadSearch.toLowerCase()) ||
                          (l.phone || '').includes(leadSearch) ||
                          (l.email || '').toLowerCase().includes(leadSearch.toLowerCase()) ||
                          (l.interestedProperty || l.property || '').toLowerCase().includes(leadSearch.toLowerCase());
    const matchesStatus = leadStatusFilter === 'ALL' ? true : l.status === leadStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const availablePropCount = properties.filter(p => p.status === 'Available').length;
  const sellingFastCount = properties.filter(p => p.status === 'Selling Fast').length;
  const soldOutCount = properties.filter(p => p.status === 'Sold Out').length;

  return (
    <div className="min-h-screen bg-[#0F172A] text-[#F8FAFC] pt-24 pb-20 font-sans relative overflow-hidden">
      
      {/* Ambient Glow */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-sky-500/15 rounded-full blur-[150px] pointer-events-none" />

      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#33415510_1px,transparent_1px),linear-gradient(to_bottom,#33415510_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 relative z-10">
        
        {/* Top Header */}
        <div className="bg-[#1E293B]/80 backdrop-blur-xl border border-slate-700/60 p-6 sm:p-8 rounded-3xl shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-sky-400 inline-flex items-center gap-1.5 bg-sky-500/10 border border-sky-500/30 px-3 py-1 rounded-full">
                <ShieldCheck className="w-4 h-4 text-sky-400" />
                ENTERPRISE CRM & CLOUDINARY ENGINE
              </span>
              <span className="flex items-center gap-1.5 text-[11px] font-mono text-slate-300 bg-slate-800/80 border border-slate-700 px-2.5 py-1 rounded-full">
                <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
                Live MongoDB & Cloudinary Sync
              </span>
            </div>

            <h1 className="font-serif-fraunces font-extrabold text-2xl sm:text-4xl text-white tracking-tight">
              Real Estate Control Center
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 font-light max-w-2xl">
              Cloudinary media upload suite with 15-second video duration validation, lead management, and AI-ready property matchmaking.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={loadData}
              disabled={isLoading}
              className="bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 hover:text-white font-mono text-xs px-4 py-3 rounded-2xl transition-all flex items-center gap-2"
              title="Refresh Data from API"
            >
              <RefreshCw className={`w-4 h-4 text-sky-400 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'Syncing...' : 'Sync Data'}</span>
            </button>

            <button
              onClick={handleOpenAddProperty}
              className="bg-gradient-to-r from-blue-600 via-sky-500 to-indigo-600 hover:from-blue-500 hover:to-sky-400 text-white font-bold text-xs px-5 py-3 rounded-2xl transition-all shadow-lg shadow-blue-500/25 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Property</span>
            </button>

            <button
              onClick={handleLogout}
              className="bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 font-bold text-xs px-4 py-3 rounded-2xl transition-all flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Exit</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center space-x-2 border-b border-slate-800 pb-2">
          {['Overview', 'Property Management', 'Lead Engine'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-2xl text-xs font-mono font-bold transition-all flex items-center gap-2 ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-blue-600 to-sky-500 text-white shadow-lg shadow-blue-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              {tab === 'Overview' && <Activity className="w-4 h-4" />}
              {tab === 'Property Management' && <Building2 className="w-4 h-4" />}
              {tab === 'Lead Engine' && <Users className="w-4 h-4" />}
              <span>{tab}</span>
            </button>
          ))}
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === 'Overview' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            
            {/* Quick KPI Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#1E293B]/80 backdrop-blur-xl border border-slate-700/60 p-5 rounded-3xl space-y-2">
                <span className="text-[10px] font-mono uppercase text-slate-400 block">Total Inventory</span>
                <div className="flex items-center justify-between">
                  <span className="font-serif-fraunces font-extrabold text-3xl text-white">{properties.length}</span>
                  <div className="p-2.5 rounded-2xl bg-sky-500/10 text-sky-400 border border-sky-500/30">
                    <Building2 className="w-5 h-5" />
                  </div>
                </div>
              </div>

              <div className="bg-[#1E293B]/80 backdrop-blur-xl border border-slate-700/60 p-5 rounded-3xl space-y-2">
                <span className="text-[10px] font-mono uppercase text-slate-400 block">Available Units</span>
                <div className="flex items-center justify-between">
                  <span className="font-serif-fraunces font-extrabold text-3xl text-emerald-400">{availablePropCount}</span>
                  <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                </div>
              </div>

              <div className="bg-[#1E293B]/80 backdrop-blur-xl border border-slate-700/60 p-5 rounded-3xl space-y-2">
                <span className="text-[10px] font-mono uppercase text-slate-400 block">Selling Fast</span>
                <div className="flex items-center justify-between">
                  <span className="font-serif-fraunces font-extrabold text-3xl text-amber-400">{sellingFastCount}</span>
                  <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
                    <Flame className="w-5 h-5" />
                  </div>
                </div>
              </div>

              <div className="bg-[#1E293B]/80 backdrop-blur-xl border border-slate-700/60 p-5 rounded-3xl space-y-2">
                <span className="text-[10px] font-mono uppercase text-slate-400 block">Active CRM Leads</span>
                <div className="flex items-center justify-between">
                  <span className="font-serif-fraunces font-extrabold text-3xl text-sky-400">{leads.length}</span>
                  <div className="p-2.5 rounded-2xl bg-sky-500/10 text-sky-400 border border-sky-500/30">
                    <Users className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Action Banner */}
            <div className="bg-gradient-to-r from-blue-900/40 via-sky-900/30 to-slate-900/60 border border-sky-500/30 p-6 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <h3 className="font-serif-fraunces text-xl font-bold text-white">Add New Real Estate Property</h3>
                <p className="text-xs text-slate-300">Upload main cover, gallery images, and a 15-second virtual tour video directly to Cloudinary.</p>
              </div>
              <button
                onClick={handleOpenAddProperty}
                className="bg-gradient-to-r from-blue-600 to-sky-500 text-white font-bold text-xs px-6 py-3 rounded-2xl shadow-lg shadow-blue-500/25 flex items-center gap-2 whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                <span>Open Property Creator</span>
              </button>
            </div>
          </div>
        )}

        {/* PROPERTY MANAGEMENT TAB */}
        {(activeTab === 'Property Management' || activeTab === 'Overview') && (
          <div className="space-y-6 animate-in fade-in duration-300">
            
            {/* Search, Filter & Sort Controls */}
            <div className="bg-[#1E293B]/80 backdrop-blur-xl border border-slate-700/60 p-5 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-4">
              
              {/* Search Bar */}
              <div className="relative w-full md:w-96">
                <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                <input
                  type="text"
                  value={propertySearch}
                  onChange={(e) => setPropertySearch(e.target.value)}
                  placeholder="Search by title, location, or type..."
                  className="w-full bg-[#0B0F19] border border-slate-700/80 rounded-2xl pl-11 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-all font-mono"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                <select
                  value={propertyTypeFilter}
                  onChange={(e) => setPropertyTypeFilter(e.target.value)}
                  className="bg-[#0B0F19] border border-slate-700 text-xs text-slate-200 rounded-2xl px-3 py-2.5 focus:outline-none font-mono"
                >
                  <option value="ALL">All Types</option>
                  <option value="Villa">Villa</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Plots">Plots</option>
                  <option value="Independent Houses">Independent Houses</option>
                  <option value="Commercial">Commercial</option>
                </select>

                <select
                  value={propertyStatusFilter}
                  onChange={(e) => setPropertyStatusFilter(e.target.value)}
                  className="bg-[#0B0F19] border border-slate-700 text-xs text-slate-200 rounded-2xl px-3 py-2.5 focus:outline-none font-mono"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="Available">Available</option>
                  <option value="Selling Fast">Selling Fast</option>
                  <option value="Sold Out">Sold Out</option>
                  <option value="Upcoming">Upcoming</option>
                </select>

                <select
                  value={propertySort}
                  onChange={(e) => setPropertySort(e.target.value)}
                  className="bg-[#0B0F19] border border-slate-700 text-xs text-slate-200 rounded-2xl px-3 py-2.5 focus:outline-none font-mono"
                >
                  <option value="newest">Sort: Newest First</option>
                  <option value="price-asc">Sort: Price Low to High</option>
                  <option value="price-desc">Sort: Price High to Low</option>
                  <option value="size-desc">Sort: Plot Size Largest</option>
                </select>
              </div>
            </div>

            {/* Properties Data Table */}
            <div className="bg-[#1E293B]/80 backdrop-blur-xl border border-slate-700/60 rounded-3xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300 font-mono">
                  <thead className="bg-[#0F172A]/90 text-slate-400 uppercase tracking-widest text-[10px] border-b border-slate-800">
                    <tr>
                      <th className="py-4 px-5">Main Image</th>
                      <th className="py-4 px-5">Property Title</th>
                      <th className="py-4 px-5">Location</th>
                      <th className="py-4 px-5">Type</th>
                      <th className="py-4 px-5">Price</th>
                      <th className="py-4 px-5">Area / Size</th>
                      <th className="py-4 px-5">Media</th>
                      <th className="py-4 px-5">Status</th>
                      <th className="py-4 px-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {filteredProperties.length === 0 ? (
                      <tr>
                        <td colSpan="9" className="py-8 text-center text-slate-500 font-mono">
                          No matching properties found.
                        </td>
                      </tr>
                    ) : (
                      filteredProperties.map((prop) => {
                        const propId = prop.id || prop._id;
                        const mainImg = prop.image || (prop.images && prop.images[0]?.url) || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80';
                        const hasVideo = Boolean((typeof prop.video === 'object' && prop.video?.url) || (typeof prop.video === 'string' && prop.video));

                        return (
                          <tr key={propId} className="hover:bg-slate-800/40 transition-colors">
                            
                            {/* Main Image */}
                            <td className="py-3 px-5">
                              <div className="w-14 h-10 rounded-xl overflow-hidden border border-slate-700 bg-slate-900">
                                <img src={mainImg} alt={prop.title} className="w-full h-full object-cover" />
                              </div>
                            </td>

                            {/* Title */}
                            <td className="py-3 px-5 font-semibold text-white font-sans text-sm">
                              {prop.title}
                            </td>

                            {/* Location */}
                            <td className="py-3 px-5 text-slate-300">
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5 text-sky-400" />
                                {prop.location}
                              </span>
                            </td>

                            {/* Type */}
                            <td className="py-3 px-5">
                              <span className="bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700 text-slate-200">
                                {prop.propertyType || prop.type || 'Villa'}
                              </span>
                            </td>

                            {/* Price */}
                            <td className="py-3 px-5 font-bold text-sky-400 font-sans">
                              {prop.price}
                            </td>

                            {/* Area */}
                            <td className="py-3 px-5 text-slate-300">
                              {prop.area || `${prop.plotSize || 2000} sq.ft`}
                            </td>

                            {/* Video Indicator */}
                            <td className="py-3 px-5">
                              {hasVideo ? (
                                <span className="inline-flex items-center gap-1 bg-sky-500/10 border border-sky-500/30 text-sky-400 px-2.5 py-1 rounded-full text-[10px] font-bold">
                                  <Film className="w-3 h-3 text-sky-400" />
                                  15s Video
                                </span>
                              ) : (
                                <span className="text-slate-500 text-[10px]">Images Only</span>
                              )}
                            </td>

                            {/* Status Quick Dropdown */}
                            <td className="py-3 px-5">
                              <select
                                value={prop.status || 'Available'}
                                onChange={(e) => handlePropertyStatusChange(propId, e.target.value)}
                                className={`text-[11px] font-bold px-2.5 py-1 rounded-xl border focus:outline-none cursor-pointer transition-all ${
                                  prop.status === 'Available'
                                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                    : prop.status === 'Selling Fast'
                                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                                    : prop.status === 'Sold Out'
                                    ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                                    : 'bg-sky-500/10 text-sky-400 border-sky-500/30'
                                }`}
                              >
                                <option value="Available" className="bg-[#0F172A] text-emerald-400">Available</option>
                                <option value="Selling Fast" className="bg-[#0F172A] text-amber-400">Selling Fast</option>
                                <option value="Sold Out" className="bg-[#0F172A] text-rose-400">Sold Out</option>
                                <option value="Upcoming" className="bg-[#0F172A] text-sky-400">Upcoming</option>
                              </select>
                            </td>

                            {/* Action Buttons */}
                            <td className="py-3 px-5 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => handleOpenEditProperty(prop)}
                                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-sky-400 transition-colors"
                                  title="Edit Property"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteProperty(propId)}
                                  className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 transition-colors"
                                  title="Delete Property"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>

                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* LEAD ENGINE TAB */}
        {activeTab === 'Lead Engine' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            
            {/* Search & Filter Leads */}
            <div className="bg-[#1E293B]/80 backdrop-blur-xl border border-slate-700/60 p-5 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="relative w-full md:w-96">
                <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                <input
                  type="text"
                  value={leadSearch}
                  onChange={(e) => setLeadSearch(e.target.value)}
                  placeholder="Search leads by name, phone, or property..."
                  className="w-full bg-[#0B0F19] border border-slate-700/80 rounded-2xl pl-11 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-all font-mono"
                />
              </div>

              <select
                value={leadStatusFilter}
                onChange={(e) => setLeadStatusFilter(e.target.value)}
                className="bg-[#0B0F19] border border-slate-700 text-xs text-slate-200 rounded-2xl px-4 py-2.5 focus:outline-none font-mono"
              >
                <option value="ALL">All Lead Statuses</option>
                <option value="HOT">HOT Leads</option>
                <option value="WARM">WARM Leads</option>
                <option value="COLD">COLD Leads</option>
              </select>
            </div>

            {/* Leads Table */}
            <div className="bg-[#1E293B]/80 backdrop-blur-xl border border-slate-700/60 rounded-3xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300 font-mono">
                  <thead className="bg-[#0F172A]/90 text-slate-400 uppercase tracking-widest text-[10px] border-b border-slate-800">
                    <tr>
                      <th className="py-4 px-5">Lead Name</th>
                      <th className="py-4 px-5">Contact Details</th>
                      <th className="py-4 px-5">Target Property</th>
                      <th className="py-4 px-5">Status</th>
                      <th className="py-4 px-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {filteredLeads.map((lead) => {
                      const leadId = lead.id || lead._id;
                      return (
                        <tr key={leadId} className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-3.5 px-5 font-semibold text-white font-sans">{lead.name}</td>
                          <td className="py-3.5 px-5 text-slate-300">{lead.phone} • {lead.email}</td>
                          <td className="py-3.5 px-5 text-sky-400">{lead.interestedProperty || lead.property || 'General'}</td>
                          <td className="py-3.5 px-5">
                            <select
                              value={lead.status || 'HOT'}
                              onChange={(e) => handleLeadStatusChange(leadId, e.target.value)}
                              className="bg-[#0B0F19] border border-slate-700 text-xs text-white rounded-xl px-2.5 py-1"
                            >
                              <option value="HOT">HOT</option>
                              <option value="WARM">WARM</option>
                              <option value="COLD">COLD</option>
                            </select>
                          </td>
                          <td className="py-3.5 px-5 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleOpenEditLead(lead)}
                                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-sky-400 transition-colors"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteLead(leadId)}
                                className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* PROPERTY ADD & EDIT FORM MODAL */}
      {propertyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="bg-[#1E293B] border border-slate-700/80 rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-6 shadow-2xl my-8 relative z-10 text-[#F8FAFC]">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-sky-400 font-bold">
                  PROPERTY COMMAND STUDIO
                </span>
                <h3 className="font-serif-fraunces text-2xl font-bold text-white mt-0.5">
                  {propertyModalMode === 'add' ? 'Add New Real Estate Property' : 'Edit Property Listing'}
                </h3>
              </div>
              <button
                onClick={() => setPropertyModalOpen(false)}
                className="p-2 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProperty} className="space-y-6 text-xs font-mono">
              
              {/* Basic Information */}
              <div className="space-y-4">
                <span className="text-[11px] font-bold text-sky-400 uppercase tracking-wider block border-b border-slate-800 pb-1">
                  1. Basic Property Information
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-300 block mb-1 font-semibold">Property Title *</label>
                    <input
                      type="text"
                      required
                      value={propertyFormData.title}
                      onChange={(e) => setPropertyFormData({ ...propertyFormData, title: e.target.value })}
                      placeholder="e.g. The Grand Royale Estate"
                      className="w-full bg-[#0B0F19] border border-slate-700 rounded-2xl px-4 py-2.5 text-white focus:border-sky-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 block mb-1 font-semibold">Property Type *</label>
                    <select
                      value={propertyFormData.propertyType}
                      onChange={(e) => setPropertyFormData({ ...propertyFormData, propertyType: e.target.value })}
                      className="w-full bg-[#0B0F19] border border-slate-700 rounded-2xl px-4 py-2.5 text-white focus:border-sky-500 focus:outline-none"
                    >
                      <option value="Villa">Villa</option>
                      <option value="Apartment">Apartment</option>
                      <option value="Plots">Plots</option>
                      <option value="Independent Houses">Independent Houses</option>
                      <option value="Commercial">Commercial</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-slate-300 block mb-1 font-semibold">Price (Display Text) *</label>
                    <input
                      type="text"
                      required
                      value={propertyFormData.price}
                      onChange={(e) => setPropertyFormData({ ...propertyFormData, price: e.target.value })}
                      placeholder="e.g. ₹1.85 Cr"
                      className="w-full bg-[#0B0F19] border border-slate-700 rounded-2xl px-4 py-2.5 text-white focus:border-sky-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 block mb-1 font-semibold">Price Numeric (INR) *</label>
                    <input
                      type="number"
                      required
                      value={propertyFormData.priceNumeric}
                      onChange={(e) => setPropertyFormData({ ...propertyFormData, priceNumeric: e.target.value })}
                      placeholder="e.g. 18500000"
                      className="w-full bg-[#0B0F19] border border-slate-700 rounded-2xl px-4 py-2.5 text-white focus:border-sky-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 block mb-1 font-semibold">Location *</label>
                    <input
                      type="text"
                      required
                      value={propertyFormData.location}
                      onChange={(e) => setPropertyFormData({ ...propertyFormData, location: e.target.value })}
                      placeholder="e.g. Anna Nagar, Madurai"
                      className="w-full bg-[#0B0F19] border border-slate-700 rounded-2xl px-4 py-2.5 text-white focus:border-sky-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Property Details */}
              <div className="space-y-4">
                <span className="text-[11px] font-bold text-sky-400 uppercase tracking-wider block border-b border-slate-800 pb-1">
                  2. Area, Plot Size & Status
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="text-slate-300 block mb-1 font-semibold">Area / Size *</label>
                    <input
                      type="text"
                      required
                      value={propertyFormData.area}
                      onChange={(e) => setPropertyFormData({ ...propertyFormData, area: e.target.value })}
                      placeholder="e.g. 2,400 sq.ft"
                      className="w-full bg-[#0B0F19] border border-slate-700 rounded-2xl px-4 py-2.5 text-white focus:border-sky-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 block mb-1 font-semibold">Plot Size (Numeric)</label>
                    <input
                      type="number"
                      value={propertyFormData.plotSize}
                      onChange={(e) => setPropertyFormData({ ...propertyFormData, plotSize: e.target.value })}
                      placeholder="2400"
                      className="w-full bg-[#0B0F19] border border-slate-700 rounded-2xl px-4 py-2.5 text-white focus:border-sky-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 block mb-1 font-semibold">BHK</label>
                    <input
                      type="number"
                      value={propertyFormData.bhk}
                      onChange={(e) => setPropertyFormData({ ...propertyFormData, bhk: e.target.value })}
                      className="w-full bg-[#0B0F19] border border-slate-700 rounded-2xl px-4 py-2.5 text-white focus:border-sky-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 block mb-1 font-semibold">Availability Status *</label>
                    <select
                      value={propertyFormData.status}
                      onChange={(e) => setPropertyFormData({ ...propertyFormData, status: e.target.value })}
                      className="w-full bg-[#0B0F19] border border-slate-700 rounded-2xl px-4 py-2.5 text-white focus:border-sky-500 focus:outline-none font-bold text-sky-400"
                    >
                      <option value="Available">Available</option>
                      <option value="Selling Fast">Selling Fast</option>
                      <option value="Sold Out">Sold Out</option>
                      <option value="Upcoming">Upcoming</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">Description</label>
                  <textarea
                    rows={3}
                    value={propertyFormData.description}
                    onChange={(e) => setPropertyFormData({ ...propertyFormData, description: e.target.value })}
                    placeholder="Enter detailed description..."
                    className="w-full bg-[#0B0F19] border border-slate-700 rounded-2xl p-4 text-white focus:border-sky-500 focus:outline-none font-sans"
                  />
                </div>
              </div>

              {/* Media Upload (Cloudinary Integration) */}
              <div className="space-y-4">
                <span className="text-[11px] font-bold text-sky-400 uppercase tracking-wider block border-b border-slate-800 pb-1">
                  3. Cloudinary Media Assets (Images & 15s Video)
                </span>

                {/* File Upload Selector */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Multiple Property Images Input */}
                  <div className="bg-[#0B0F19] p-4 rounded-2xl border border-slate-700/80 space-y-2">
                    <label className="text-slate-200 font-semibold flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-sky-400" />
                      <span>Upload Property Images (Max 3)</span>
                    </label>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => setImageFiles(Array.from(e.target.files).slice(0, 3))}
                      className="w-full text-[11px] text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-sky-500/20 file:text-sky-400 hover:file:bg-sky-500/30"
                    />
                    <span className="text-[10px] text-slate-500 block">Selected: {imageFiles.length} file(s)</span>
                  </div>

                  {/* 15-Second Video Input */}
                  <div className="bg-[#0B0F19] p-4 rounded-2xl border border-slate-700/80 space-y-2">
                    <label className="text-slate-200 font-semibold flex items-center gap-2">
                      <VideoIcon className="w-4 h-4 text-sky-400" />
                      <span>Upload Video (Max 15 Seconds)</span>
                    </label>
                    <input
                      type="file"
                      accept="video/mp4,video/webm"
                      onChange={handleVideoFileSelect}
                      className="w-full text-[11px] text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-sky-500/20 file:text-sky-400 hover:file:bg-sky-500/30"
                    />
                    {videoFile ? (
                      <div className="flex items-center justify-between text-[11px] text-sky-400 bg-sky-500/10 p-2 rounded-xl border border-sky-500/30">
                        <span>Verified: {videoDuration}s ({videoFileSize} MB)</span>
                        <button type="button" onClick={handleRemoveVideo} className="text-rose-400 font-bold hover:underline">Remove</button>
                      </div>
                    ) : (
                      <span className="text-[10px] text-slate-500 block">Max 1 video • Duration ≤ 15 seconds</span>
                    )}
                  </div>
                </div>

                {/* Image URLs Fallback */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-slate-400 text-[10px] block mb-1">Image 1 (Main Cover URL)</label>
                    <input
                      type="url"
                      value={propertyFormData.img1}
                      onChange={(e) => setPropertyFormData({ ...propertyFormData, img1: e.target.value })}
                      className="w-full bg-[#0B0F19] border border-slate-800 rounded-xl px-3 py-2 text-white text-[11px]"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 text-[10px] block mb-1">Image 2 (Gallery URL)</label>
                    <input
                      type="url"
                      value={propertyFormData.img2}
                      onChange={(e) => setPropertyFormData({ ...propertyFormData, img2: e.target.value })}
                      className="w-full bg-[#0B0F19] border border-slate-800 rounded-xl px-3 py-2 text-white text-[11px]"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 text-[10px] block mb-1">Image 3 (Gallery URL)</label>
                    <input
                      type="url"
                      value={propertyFormData.img3}
                      onChange={(e) => setPropertyFormData({ ...propertyFormData, img3: e.target.value })}
                      className="w-full bg-[#0B0F19] border border-slate-800 rounded-xl px-3 py-2 text-white text-[11px]"
                    />
                  </div>
                </div>

              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setPropertyModalOpen(false)}
                  className="px-5 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingProperty}
                  className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 via-sky-500 to-indigo-600 hover:from-blue-500 hover:to-sky-400 text-white font-bold shadow-lg shadow-blue-500/25 disabled:opacity-50"
                >
                  {isSubmittingProperty ? 'Saving to MongoDB & Cloudinary...' : (propertyModalMode === 'add' ? 'Publish Property' : 'Save Changes')}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* LEAD EDIT MODAL */}
      {editingLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-[#1E293B] border border-slate-700/80 rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-serif-fraunces text-xl font-bold text-white">Edit CRM Lead Entry</h3>
              <button onClick={() => setEditingLead(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveEditedLead} className="space-y-4 text-xs font-mono">
              <div>
                <label className="text-slate-300 block mb-1">Lead Name</label>
                <input
                  type="text"
                  required
                  value={editingLead.name}
                  onChange={(e) => setEditingLead({ ...editingLead, name: e.target.value })}
                  className="w-full bg-[#0B0F19] border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1">Phone</label>
                  <input
                    type="text"
                    required
                    value={editingLead.phone}
                    onChange={(e) => setEditingLead({ ...editingLead, phone: e.target.value })}
                    className="w-full bg-[#0B0F19] border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={editingLead.email}
                    onChange={(e) => setEditingLead({ ...editingLead, email: e.target.value })}
                    className="w-full bg-[#0B0F19] border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button type="button" onClick={() => setEditingLead(null)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-sky-500 text-white font-bold">Save Lead</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
