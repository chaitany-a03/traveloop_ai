import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import {
  Sparkles, MapPin, Calendar, DollarSign, ChevronRight,
  ArrowLeft, RotateCcw, Plane, Search, X, Check
} from 'lucide-react';
import AppLayout from '../../components/layout/AppLayout';
import AILoader from '../../components/planner/AILoader';
import ItineraryResult from '../../components/planner/ItineraryResult';
import { plannerAPI, tripsAPI } from '../../api';

// ─── Config ───────────────────────────────────────────────────────

const MOODS = [
  { value: 'Adventure', emoji: '🧗', label: 'Adventure', desc: 'Thrills & exploration', img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80', color: 'from-orange-500/5 to-orange-500/20', border: 'border-orange-500/40' },
  { value: 'Relaxation', emoji: '🧘', label: 'Relaxation', desc: 'Slow & peaceful', img: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&q=80', color: 'from-cyan-500/5 to-cyan-500/20', border: 'border-cyan-500/40' },
  { value: 'Culture', emoji: '🎭', label: 'Culture', desc: 'Art & heritage', img: 'https://images.unsplash.com/photo-1518398046578-8cca57782e17?auto=format&fit=crop&q=80', color: 'from-amber-500/5 to-amber-500/20', border: 'border-amber-500/40' },
  { value: 'Food', emoji: '🍽️', label: 'Food', desc: 'Gastronomy & dining', img: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&q=80', color: 'from-red-500/5 to-red-500/20', border: 'border-red-500/40' },
  { value: 'Nature', emoji: '🌿', label: 'Nature', desc: 'Outdoors & wildlife', img: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80', color: 'from-emerald-500/5 to-emerald-500/20', border: 'border-emerald-500/40' },
  { value: 'Nightlife', emoji: '🌃', label: 'Nightlife', desc: 'Bars, clubs & music', img: 'https://images.unsplash.com/photo-1555985202-12975b0235dc?auto=format&fit=crop&q=80', color: 'from-purple-500/5 to-purple-500/20', border: 'border-purple-500/40' },
  { value: 'Family', emoji: '👨‍👩‍👧', label: 'Family', desc: 'Fun activities for all', img: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&q=80', color: 'from-pink-500/5 to-pink-500/20', border: 'border-pink-500/40' },
];

const TRAVEL_TYPES = [
  { value: 'Solo', emoji: '🧑', label: 'Solo' },
  { value: 'Couple', emoji: '💑', label: 'Couple' },
  { value: 'Friends', emoji: '👫', label: 'Friends' },
  { value: 'Family', emoji: '👨‍👩‍👧', label: 'Family' },
];

const DESTINATIONS = [
  'Goa', 'Mumbai', 'Delhi', 'Bangalore', 'Jaipur', 'Agra', 'Varanasi',
  'Kerala', 'Darjeeling', 'Shimla', 'Manali', 'Leh', 'Udaipur', 'Jodhpur',
  'Amritsar', 'Rishikesh', 'Haridwar', 'Ooty', 'Mysore', 'Coorg',
  'Ahmedabad', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Surat',
  'Kasol', 'Spiti Valley', 'Andaman Islands', 'Ranthambore',
  'Tokyo', 'Kyoto', 'Osaka', 'Bali', 'Bangkok', 'Singapore', 'Phuket',
  'Kathmandu', 'Colombo', 'Maldives', 'Hong Kong', 'Seoul', 'Hanoi',
  'Ho Chi Minh City', 'Langkawi', 'Kuala Lumpur', 'Chiang Mai',
  'Paris', 'London', 'Rome', 'Barcelona', 'Amsterdam', 'Prague',
  'Vienna', 'Budapest', 'Lisbon', 'Madrid', 'Athens', 'Santorini',
  'Istanbul', 'Dubrovnik', 'Venice', 'Florence', 'Zurich', 'Berlin',
  'New York', 'Los Angeles', 'Miami', 'Toronto', 'Vancouver',
  'Cancun', 'Mexico City', 'Buenos Aires', 'Rio de Janeiro', 'Machu Picchu',
  'Dubai', 'Abu Dhabi', 'Doha', 'Cape Town', 'Marrakech', 'Cairo',
  'Sydney', 'Melbourne', 'Auckland', 'Queenstown',
];

// ─── DestinationInput sub-component ──────────────────────────────
function DestinationInput({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(value);
  const wrapRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => { setQuery(value); }, [value]);

  const filtered = query.trim() === ''
    ? DESTINATIONS
    : DESTINATIONS.filter(d => d.toLowerCase().includes(query.toLowerCase()));

  const handleSelect = (dest) => {
    setQuery(dest);
    onChange(dest);
    setOpen(false);
  };

  const handleChange = (e) => {
    const v = e.target.value;
    setQuery(v);
    onChange(v);
    setOpen(true);
  };

  const handleClear = () => {
    setQuery('');
    onChange('');
    setOpen(false);
  };

  return (
    <div ref={wrapRef} className="relative w-full z-40">
      <div className="relative group">
        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-600 transition-colors pointer-events-none" />
        <input
          className="w-full bg-white border border-slate-300 hover:border-slate-400 rounded-2xl pl-12 pr-12 py-4 text-base font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-purple-500/80 focus:ring-4 focus:ring-purple-500/10 transition-all shadow-sm"
          placeholder="Search city or country…"
          value={query}
          onChange={handleChange}
          onFocus={() => setOpen(true)}
          autoComplete="off"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {open && filtered.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-full mt-2 bg-white rounded-2xl shadow-[0_15px_45px_rgba(0,0,0,0.1)] border border-slate-300 overflow-hidden"
          >
            <ul className="overflow-y-auto max-h-[16rem] custom-scrollbar py-2">
              {filtered.map((dest) => (
                <li key={dest}>
                  <button
                    type="button"
                    onMouseDown={(e) => { e.preventDefault(); handleSelect(dest); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left text-sm font-semibold transition-colors hover:bg-slate-50
                      ${value === dest ? 'bg-purple-50/70 text-purple-700' : 'text-slate-700'}`}
                  >
                    <MapPin className={`w-4 h-4 flex-shrink-0 ${value === dest ? 'text-purple-600' : 'text-slate-400'}`} />
                    {dest}
                    {value === dest && (
                      <span className="ml-auto text-[10px] uppercase tracking-wider bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-bold">Selected</span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
            <div className="px-4 py-3 border-t border-slate-200 text-xs text-slate-400 flex items-center gap-2 bg-slate-50">
              <Search className="w-3.5 h-3.5" /> {filtered.length} destination{filtered.length !== 1 ? 's' : ''} found
            </div>
          </motion.div>
        )}
        {open && filtered.length === 0 && query.trim() !== '' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute z-50 w-full mt-2 bg-white rounded-2xl shadow-xl border border-slate-300 p-5 text-sm text-slate-400 text-center"
          >
            No matches — you can still type any city name
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────

function StepLabel({ number, label, active, done, isDark }) {
  return (
    <div className={`flex items-center gap-3 transition-all duration-500 ${active ? 'opacity-100 scale-105' : done ? 'opacity-70' : 'opacity-40'}`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm relative z-10 transition-all duration-500
        ${done ? 'bg-purple-650 text-white shadow-[0_0_15px_rgba(147,51,234,0.3)] border border-purple-500' 
               : active ? (isDark ? 'bg-white text-purple-600 border border-white shadow-[0_0_15px_rgba(255,255,255,0.2)]' : 'bg-purple-50 text-purple-600 border border-purple-300 shadow-[0_0_10px_rgba(147,51,234,0.1)]')
               : (isDark ? 'bg-white/10 text-white/60 border border-white/15' : 'bg-slate-100 text-slate-400 border border-slate-300')}`}>
        {done ? <Check className="w-4 h-4 text-white" /> : number}
      </div>
      <span className={`text-sm font-bold tracking-wide hidden sm:block ${active ? (isDark ? 'text-white' : 'text-slate-800') : (isDark ? 'text-white/40' : 'text-slate-400')}`}>
        {label}
      </span>
    </div>
  );
}

// ─── SmartPlanner page ────────────────────────────────────────────

export default function SmartPlanner() {
  const navigate = useNavigate();

  const [destination, setDestination] = useState('');
  const [days, setDays] = useState(3);
  const [budget, setBudget] = useState(15000);
  const [mood, setMood] = useState('');
  const [travelType, setTravelType] = useState('Solo');

  const [phase, setPhase] = useState('form');
  const [result, setResult] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleGenerate = async () => {
    if (!destination.trim()) { toast.error('Enter a destination first'); return; }
    if (!mood) { toast.error('Select a travel mood'); return; }
    if (days < 1 || days > 30) { toast.error('Days must be between 1–30'); return; }
    if (budget <= 0) { toast.error('Enter a valid budget'); return; }

    setPhase('loading');

    try {
      const res = await plannerAPI.generate({ destination: destination.trim(), days: Number(days), budget: Number(budget), mood, travelType });
      await new Promise(r => setTimeout(r, 1500));
      setResult(res.data);
      setPhase('result');
    } catch (err) {
      setPhase('form');
      const msg = err.response?.data?.message || 'Generation failed. Please try again.';
      toast.error(msg);
    }
  };

  const handleSave = async () => {
    if (!result) return;
    setIsSaving(true);
    try {
      const fd = new FormData();
      fd.append('title', `${result.summary.destination} — ${result.summary.tripStyle}`);
      fd.append('description', `AI-generated ${result.summary.days}-day ${result.summary.mood} trip`);
      fd.append('status', 'planned');
      fd.append('aiItinerary', JSON.stringify(result));

      const trip = await tripsAPI.create(fd);
      toast.success('Trip saved to My Trips! 🗺️');
      navigate(`/itinerary/${trip.data.trip.id}`);
    } catch {
      toast.error('Could not save trip');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setPhase('form');
  };

  if (phase === 'result' && result) {
    return (
      <>
        <AppLayout noPadding={true}>
          <ItineraryResult
            result={result}
            onRegenerate={handleReset}
            onSave={handleSave}
          />
        </AppLayout>
        <style dangerouslySetInnerHTML={{__html: `
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}} />
      </>
    );
  }

  return (
    <>
      <AnimatePresence>
        {phase === 'loading' && <AILoader destination={destination} />}
      </AnimatePresence>
      <AppLayout noPadding={true}>
        <div className="w-full flex flex-col min-h-screen bg-slate-50/30">
          
          {/* Cinematic Header with Beach / Travel Vibe */}
          <div className="relative w-full overflow-hidden bg-gray-900 py-16 flex items-center justify-center">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-[-10%] left-[0%] w-[60%] h-[60%] bg-purple-600/35 rounded-full blur-[120px] mix-blend-screen animate-blob" />
              <div className="absolute top-[20%] right-[-10%] w-[70%] h-[70%] bg-indigo-500/25 rounded-full blur-[140px] mix-blend-screen animate-blob animation-delay-2000" />
              <div className="absolute bottom-[-30%] left-[20%] w-[80%] h-[80%] bg-pink-600/20 rounded-full blur-[150px] mix-blend-screen animate-blob animation-delay-4000" />
              <div className="absolute inset-0 bg-[url('/travel-bg.png')] opacity-45 mix-blend-overlay bg-cover bg-center" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-50/30 via-gray-900/50 to-gray-900/90" />
            </div>

            <div className="relative z-10 w-full max-w-5xl mx-auto px-6 md:px-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div>
                <button 
                  onClick={() => navigate('/')} 
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white mb-4 border border-white/10 transition-colors w-fit font-bold text-xs shadow-sm backdrop-blur-md"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
                </button>
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/10 border border-white/15 backdrop-blur-md mb-3 shadow-md">
                  <Sparkles className="w-3.5 h-3.5 text-purple-300 animate-pulse" />
                  <span className="text-[10px] font-extrabold text-white tracking-widest uppercase">AI Travel Planner</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-white leading-none tracking-tight font-display mb-3">
                  Plan Your Next <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-300">Smart Journey</span>
                </h1>
                <p className="text-gray-300 text-sm md:text-base font-bold max-w-xl leading-relaxed">
                  Select your preferences and let our AI curate the ultimate itinerary for you.
                </p>
              </div>

              {/* Step indicators */}
              <div className="hidden lg:flex items-center gap-4 bg-white/5 p-2 pr-6 rounded-full border border-white/10 backdrop-blur-md shadow-lg">
                <StepLabel number={1} label="Destination" active={!destination} done={!!destination} isDark={true} />
                <ChevronRight className="w-4 h-4 text-white/30" />
                <StepLabel number={2} label="Preferences" active={!!destination && !mood} done={!!mood} isDark={true} />
                <ChevronRight className="w-4 h-4 text-white/30" />
                <StepLabel number={3} label="Generate" active={!!destination && !!mood} done={false} isDark={true} />
              </div>
            </div>
          </div>

          {/* Form Content Wrapper — overlapping the header slightly */}
          <div className="relative z-10 max-w-5xl mx-auto w-full px-6 md:px-10 -mt-10 pb-16 flex-1 flex flex-col">
            
            {/* SaaS container glass card */}
            <div className="relative bg-white/90 backdrop-blur-xl rounded-[2.5rem] shadow-[0_24px_60px_rgba(0,0,0,0.08)] border border-slate-200/80 p-6 sm:p-10 flex-1 flex flex-col">
              
              {/* Subtle Gradient Mesh Background for SaaS Form */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 rounded-[2.5rem]">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-50/30 blur-[120px] rounded-full" />
                <div className="absolute bottom-[10%] right-[-10%] w-[50%] h-[50%] bg-indigo-50/20 blur-[130px] rounded-full" />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.01] mix-blend-overlay" />
              </div>

              <div className="relative z-10 flex-1 flex flex-col">
                <AnimatePresence mode="wait">
                  {phase === 'form' && (
                    <motion.div
                      key="form"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5 }}
                      className="space-y-6 lg:space-y-8 flex-1"
                    >
                      {/* Row 1: Destination, Days, Budget */}
                      <motion.div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        {/* Destination */}
                        <div className="lg:col-span-5 p-6 md:p-8 rounded-2xl bg-white border border-slate-200 shadow-[0_8px_30px_rgba(0,0,0,0.02)] hover:border-slate-350 transition-all duration-300 relative overflow-hidden group">
                          <h2 className="text-xs font-bold text-slate-400 flex items-center gap-2 mb-4 tracking-wide uppercase">
                            <MapPin className="w-4 h-4 text-purple-650" /> Where to?
                          </h2>
                          <DestinationInput value={destination} onChange={setDestination} />
                          
                          {/* Suggestion pills */}
                          <div className="flex flex-wrap gap-2 mt-4">
                            {['Goa', 'Bali', 'Tokyo', 'Manali'].map(sug => (
                              <button
                                key={sug}
                                type="button"
                                onClick={() => { setDestination(sug); }}
                                className="text-xs px-3.5 py-1.5 rounded-full bg-slate-50 hover:bg-purple-50 text-slate-600 hover:text-purple-650 border border-slate-250 hover:border-purple-300 transition-all font-semibold shadow-sm"
                              >
                                {sug}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Days + Budget */}
                        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
                          {/* Days */}
                          <div className="p-6 md:p-8 rounded-2xl bg-white border border-slate-200 shadow-[0_8px_30px_rgba(0,0,0,0.02)] hover:border-slate-350 transition-all duration-300">
                            <h2 className="text-xs font-bold text-slate-400 flex items-center gap-2 mb-4 tracking-wide uppercase">
                              <Calendar className="w-4 h-4 text-purple-650" /> Duration
                            </h2>
                            <div className="flex items-center gap-4">
                              <button type="button" onClick={() => setDays(Math.max(1, days - 1))} className="w-11 h-11 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-center text-xl font-bold text-slate-500 transition-colors">−</button>
                              <div className="flex-1 text-center">
                                <span className="text-4xl font-black text-slate-800 leading-none">{days}</span>
                                <p className="text-[11px] font-bold text-slate-400 mt-1 uppercase tracking-wider">Days</p>
                              </div>
                              <button type="button" onClick={() => setDays(Math.min(30, days + 1))} className="w-11 h-11 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-center text-xl font-bold text-slate-500 transition-colors">+</button>
                            </div>
                          </div>

                          {/* Budget */}
                          <div className="p-6 md:p-8 rounded-2xl bg-white border border-slate-200 shadow-[0_8px_30px_rgba(0,0,0,0.02)] hover:border-slate-350 transition-all duration-300">
                            <h2 className="text-xs font-bold text-slate-400 flex items-center gap-2 mb-4 tracking-wide uppercase">
                              <DollarSign className="w-4 h-4 text-purple-650" /> Budget
                            </h2>
                            <div className="relative">
                              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-base font-bold text-slate-400">₹</span>
                              <input
                                type="number"
                                value={budget}
                                onChange={(e) => setBudget(Number(e.target.value))}
                                className="w-full bg-white border border-slate-300 hover:border-slate-400 rounded-2xl pl-10 pr-4 py-4 text-base font-semibold text-slate-800 focus:outline-none focus:border-purple-500/80 focus:ring-4 focus:ring-purple-500/10 transition-all shadow-sm"
                              />
                            </div>
                            <div className="flex gap-2 mt-3">
                              {[5000, 15000, 30000, 50000].map(v => (
                                <button key={v} type="button" onClick={() => setBudget(v)}
                                  className={`text-[11px] px-3 py-1.5 rounded-full font-bold transition-all border ${budget === v ? 'bg-purple-50 text-purple-700 border-purple-300' : 'bg-slate-50 text-slate-500 border-slate-200 hover:border-slate-300'}`}
                                >
                                  ₹{(v / 1000)}k
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>

                      {/* Row 2: Travel Mood */}
                      <div>
                        <h2 className="text-xs font-bold text-slate-400 flex items-center gap-2 mb-4 tracking-wide uppercase">
                          <Sparkles className="w-4 h-4 text-purple-650" /> Travel Mood
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
                          {MOODS.map(m => (
                            <motion.button
                              key={m.value}
                              type="button"
                              whileHover={{ scale: 1.04, y: -2 }}
                              whileTap={{ scale: 0.97 }}
                              onClick={() => setMood(m.value)}
                              className={`relative flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-300 overflow-hidden group
                                ${mood === m.value
                                  ? 'border-purple-500 bg-gradient-to-b from-purple-50 to-white shadow-[0_8px_25px_rgba(147,51,234,0.12)]'
                                  : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'
                                }`}
                            >
                              {mood === m.value && (
                                <div className="absolute top-2 right-2">
                                  <div className="w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center">
                                    <Check className="w-3 h-3 text-white" />
                                  </div>
                                </div>
                              )}
                              <span className="text-2xl">{m.emoji}</span>
                              <span className="text-xs font-bold text-slate-700">{m.label}</span>
                              <span className="text-[10px] text-slate-400 font-medium">{m.desc}</span>
                            </motion.button>
                          ))}
                        </div>
                      </div>

                      {/* Row 3: Travel Type */}
                      <div>
                        <h2 className="text-xs font-bold text-slate-400 flex items-center gap-2 mb-4 tracking-wide uppercase">
                          <Plane className="w-4 h-4 text-purple-650" /> Travel Type
                        </h2>
                        <div className="flex flex-wrap gap-3">
                          {TRAVEL_TYPES.map(t => (
                            <motion.button
                              key={t.value}
                              type="button"
                              whileHover={{ scale: 1.04 }}
                              whileTap={{ scale: 0.97 }}
                              onClick={() => setTravelType(t.value)}
                              className={`flex items-center gap-2.5 px-5 py-3.5 rounded-2xl border-2 font-bold text-sm transition-all duration-300
                                ${travelType === t.value
                                  ? 'border-purple-500 bg-purple-50 text-purple-700 shadow-[0_4px_15px_rgba(147,51,234,0.1)]'
                                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:shadow-sm'
                                }`}
                            >
                              <span className="text-lg">{t.emoji}</span>
                              {t.label}
                              {travelType === t.value && <Check className="w-4 h-4 text-purple-600" />}
                            </motion.button>
                          ))}
                        </div>
                      </div>

                      {/* Generate Button */}
                      <div className="pt-4">
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleGenerate}
                          className="w-full relative overflow-hidden bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-700 hover:via-indigo-700 hover:to-purple-800 text-white font-bold text-base py-5 rounded-2xl shadow-[0_8px_30px_rgba(147,51,234,0.25)] transition-all duration-300 flex items-center justify-center gap-3"
                        >
                          <div className="absolute inset-0 overflow-hidden">
                            <div className="absolute -left-[100%] top-0 w-[60%] h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 animate-shine" />
                          </div>
                          <Sparkles className="w-5 h-5" />
                          Generate My Itinerary
                          <ChevronRight className="w-5 h-5" />
                        </motion.button>
                      </div>

                      {/* Powered by footer */}
                      <div className="flex justify-center pt-2 pb-2">
                        <p className="text-center text-xs text-slate-400 font-semibold px-4 py-2 rounded-full bg-slate-50 border border-slate-100 inline-flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                          Powered by advanced AI models & real-time travel data
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </AppLayout>

      {/* Add Custom Animations CSS */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shine {
          100% { left: 125%; }
        }
        .animate-shine {
          animation: shine 1.5s infinite;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.02);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.08);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 0, 0, 0.15);
        }
      `}} />
    </>
  );
}
