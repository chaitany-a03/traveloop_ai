import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import {
  Sparkles, MapPin, Calendar, DollarSign, ChevronRight,
  ArrowLeft, RotateCcw, Plane, Search, X
} from 'lucide-react';
import AppLayout from '../../components/layout/AppLayout';
import AILoader from '../../components/planner/AILoader';
import ItineraryResult from '../../components/planner/ItineraryResult';
import { plannerAPI, tripsAPI } from '../../api';

// ─── Config ───────────────────────────────────────────────────────

const MOODS = [
  { value: 'Adventure',   emoji: '🧗', label: 'Adventure',   desc: 'Thrills & exploration' },
  { value: 'Relaxation',  emoji: '🧘', label: 'Relaxation',   desc: 'Slow & peaceful' },
  { value: 'Culture',     emoji: '🎭', label: 'Culture',      desc: 'Art, history & heritage' },
  { value: 'Food',        emoji: '🍽️', label: 'Food',         desc: 'Gastronomy & flavours' },
  { value: 'Nature',      emoji: '🌿', label: 'Nature',       desc: 'Outdoors & wildlife' },
  { value: 'Nightlife',   emoji: '🌃', label: 'Nightlife',    desc: 'Bars, clubs & events' },
  { value: 'Family',      emoji: '👨‍👩‍👧', label: 'Family',      desc: 'Fun for everyone' },
];

const TRAVEL_TYPES = [
  { value: 'Solo',    emoji: '🧑', label: 'Solo' },
  { value: 'Couple',  emoji: '💑', label: 'Couple' },
  { value: 'Friends', emoji: '👫', label: 'Friends' },
  { value: 'Family',  emoji: '👨‍👩‍👧', label: 'Family' },
];

// ─── Destinations list (searchable) ──────────────────────────────
const DESTINATIONS = [
  // 🇮🇳 India
  'Goa', 'Mumbai', 'Delhi', 'Bangalore', 'Jaipur', 'Agra', 'Varanasi',
  'Kerala', 'Darjeeling', 'Shimla', 'Manali', 'Leh', 'Udaipur', 'Jodhpur',
  'Amritsar', 'Rishikesh', 'Haridwar', 'Ooty', 'Mysore', 'Coorg',
  'Ahmedabad', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Surat',
  'Kasol', 'Spiti Valley', 'Andaman Islands', 'Ranthambore',
  // 🌏 Asia
  'Tokyo', 'Kyoto', 'Osaka', 'Bali', 'Bangkok', 'Singapore', 'Phuket',
  'Kathmandu', 'Colombo', 'Maldives', 'Hong Kong', 'Seoul', 'Hanoi',
  'Ho Chi Minh City', 'Langkawi', 'Kuala Lumpur', 'Chiang Mai',
  // 🌍 Europe
  'Paris', 'London', 'Rome', 'Barcelona', 'Amsterdam', 'Prague',
  'Vienna', 'Budapest', 'Lisbon', 'Madrid', 'Athens', 'Santorini',
  'Istanbul', 'Dubrovnik', 'Venice', 'Florence', 'Zurich', 'Berlin',
  // 🌎 Americas
  'New York', 'Los Angeles', 'Miami', 'Toronto', 'Vancouver',
  'Cancun', 'Mexico City', 'Buenos Aires', 'Rio de Janeiro', 'Machu Picchu',
  // 🌍 Middle East & Africa
  'Dubai', 'Abu Dhabi', 'Doha', 'Cape Town', 'Marrakech', 'Cairo',
  // 🌏 Oceania
  'Sydney', 'Melbourne', 'Auckland', 'Queenstown',
];

// ─── DestinationInput sub-component ──────────────────────────────
function DestinationInput({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(value);
  const wrapRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Sync external value → local query when parent resets form
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
    <div ref={wrapRef} className="relative">
      {/* Input */}
      <div className="relative">
        <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        <input
          className="input-field pl-10 pr-10 text-lg font-semibold"
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
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      <AnimatePresence>
        {open && filtered.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 w-full mt-1.5 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
          >
            {/* Scrollable list — max 6 visible rows */}
            <ul className="overflow-y-auto" style={{ maxHeight: '15rem' }}>
              {filtered.map((dest) => (
                <li key={dest}>
                  <button
                    type="button"
                    onMouseDown={(e) => { e.preventDefault(); handleSelect(dest); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left text-sm font-medium transition-colors hover:bg-primary-50 hover:text-primary-700
                      ${value === dest ? 'bg-primary-50 text-primary-700' : 'text-gray-700'}`}
                  >
                    <MapPin className={`w-3.5 h-3.5 flex-shrink-0 ${value === dest ? 'text-primary-500' : 'text-gray-400'}`} />
                    {dest}
                    {value === dest && (
                      <span className="ml-auto text-xs bg-primary-100 text-primary-600 px-2 py-0.5 rounded-full font-semibold">Selected</span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
            <div className="px-4 py-2.5 border-t border-gray-100 text-xs text-gray-400 flex items-center gap-1.5">
              <Search className="w-3 h-3" /> {filtered.length} destination{filtered.length !== 1 ? 's' : ''} found
            </div>
          </motion.div>
        )}
        {open && filtered.length === 0 && query.trim() !== '' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute z-50 w-full mt-1.5 bg-white rounded-2xl shadow-lg border border-gray-100 p-4 text-sm text-gray-500 text-center"
          >
            No matches — you can still type any city name
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────

function StepLabel({ number, label, active, done }) {
  return (
    <div className={`flex items-center gap-2 transition-all duration-300 ${active ? 'opacity-100' : done ? 'opacity-60' : 'opacity-30'}`}>
      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all
        ${done ? 'bg-green-500 text-white' : active ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
        {done ? '✓' : number}
      </div>
      <span className={`text-sm font-semibold hidden sm:block ${active ? 'text-gray-900' : 'text-gray-500'}`}>
        {label}
      </span>
    </div>
  );
}

// ─── SmartPlanner page ────────────────────────────────────────────

export default function SmartPlanner() {
  const navigate = useNavigate();

  // Form state
  const [destination, setDestination] = useState('');
  const [days, setDays]               = useState(3);
  const [budget, setBudget]           = useState(15000);
  const [mood, setMood]               = useState('');
  const [travelType, setTravelType]   = useState('Solo');

  // Phase: 'form' | 'loading' | 'result'
  const [phase, setPhase]     = useState('form');
  const [result, setResult]   = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // ── Generate ──────────────────────────────────────────────────
  const handleGenerate = async () => {
    if (!destination.trim()) { toast.error('Enter a destination first'); return; }
    if (!mood)               { toast.error('Select a travel mood');       return; }
    if (days < 1 || days > 30){ toast.error('Days must be between 1–30'); return; }
    if (budget <= 0)          { toast.error('Enter a valid budget');      return; }

    setPhase('loading');

    try {
      const res = await plannerAPI.generate({ destination: destination.trim(), days: Number(days), budget: Number(budget), mood, travelType });
      // Small delay so the loader feels intentional even if API is fast
      await new Promise(r => setTimeout(r, 1200));
      setResult(res.data);
      setPhase('result');
    } catch (err) {
      setPhase('form');
      const msg = err.response?.data?.message || 'Generation failed. Please try again.';
      toast.error(msg);
    }
  };

  // ── Save to trips ─────────────────────────────────────────────
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

  // ── Reset ─────────────────────────────────────────────────────
  const handleReset = () => {
    setResult(null);
    setPhase('form');
  };

  // ── Render ────────────────────────────────────────────────────
  return (
    <>
      {/* Full-screen AI loader (outside AppLayout so it's truly overlay) */}
      <AnimatePresence>
        {phase === 'loading' && <AILoader destination={destination} />}
      </AnimatePresence>

      <AppLayout>
        <div className="max-w-4xl mx-auto">

          {/* ── Header ─────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-between mb-8 flex-wrap gap-4"
          >
            <div className="flex items-center gap-4">
              {phase === 'result' && (
                <motion.button
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  onClick={handleReset}
                  className="btn-ghost p-2"
                >
                  <ArrowLeft className="w-5 h-5" />
                </motion.button>
              )}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center shadow-glow">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <h1 className="text-2xl font-bold font-display text-gray-900">
                    {phase === 'result' ? 'Your AI Itinerary' : 'Smart Trip Planner'}
                  </h1>
                </div>
                <p className="text-gray-500 text-sm">
                  {phase === 'result'
                    ? `${result?.summary?.destination} · ${result?.summary?.days} days · ${result?.summary?.mood}`
                    : 'Tell us your preferences — AI does the rest'}
                </p>
              </div>
            </div>

            {/* Step indicators (form phase only) */}
            {phase === 'form' && (
              <div className="hidden sm:flex items-center gap-3">
                <StepLabel number={1} label="Destination" active={!destination} done={!!destination} />
                <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
                <StepLabel number={2} label="Preferences" active={!!destination && !mood} done={!!mood} />
                <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
                <StepLabel number={3} label="Generate" active={!!destination && !!mood} done={false} />
              </div>
            )}

            {/* Result actions */}
            {phase === 'result' && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={handleReset}
                className="btn-ghost text-sm"
              >
                <RotateCcw className="w-4 h-4" /> New Plan
              </motion.button>
            )}
          </motion.div>

          {/* ── Form phase ────────────────────────────────────── */}
          <AnimatePresence mode="wait">
            {phase === 'form' && (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                {/* Destination + Days + Budget */}
                <div className="card p-6 space-y-5">
                  <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary-500" /> Where to?
                  </h2>

                  {/* Destination */}
                  <div>
                    <label className="label">Destination *</label>
                    <DestinationInput value={destination} onChange={setDestination} />
                  </div>

                  {/* Days + Budget */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="label flex items-center gap-2">
                        <Calendar className="w-4 h-4" /> Number of Days *
                      </label>
                      <div className="flex items-center gap-3">
                        <motion.button whileTap={{ scale: 0.9 }}
                          onClick={() => setDays(d => Math.max(1, d - 1))}
                          className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-xl font-bold text-gray-700 text-xl flex items-center justify-center transition-colors flex-shrink-0">
                          −
                        </motion.button>
                        <input
                          type="number" min={1} max={30}
                          className="input-field text-center text-xl font-bold flex-1"
                          value={days}
                          onChange={e => setDays(Math.max(1, Math.min(30, Number(e.target.value))))}
                        />
                        <motion.button whileTap={{ scale: 0.9 }}
                          onClick={() => setDays(d => Math.min(30, d + 1))}
                          className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-xl font-bold text-gray-700 text-xl flex items-center justify-center transition-colors flex-shrink-0">
                          +
                        </motion.button>
                      </div>
                    </div>

                    <div>
                      <label className="label flex items-center gap-2">
                        <DollarSign className="w-4 h-4" /> Total Budget *
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
                        <input
                          type="number" min={1}
                          className="input-field pl-8 text-lg font-bold"
                          value={budget}
                          onChange={e => setBudget(Math.max(1, Number(e.target.value)))}
                        />
                      </div>
                      {/* Quick budget presets */}
                      <div className="flex gap-2 mt-2">
                        {[5000, 15000, 30000, 60000].map(b => (
                          <button key={b} onClick={() => setBudget(b)}
                            className={`text-xs px-2.5 py-1 rounded-full font-semibold transition-colors
                              ${budget === b ? 'bg-primary-100 text-primary-700 ring-1 ring-primary-300' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                            ₹{(b / 1000).toFixed(0)}k
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mood selector */}
                <div id="mood-section" className="card p-6">
                  <h2 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary-500" /> Travel Mood *
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {MOODS.map(m => (
                      <motion.button
                        key={m.value}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setMood(m.value)}
                        className={`relative flex flex-col items-center gap-2 p-4 rounded-2xl border-2 text-center transition-all duration-200 cursor-pointer
                          ${mood === m.value
                            ? 'border-primary-500 bg-primary-50 shadow-glow'
                            : 'border-gray-200 bg-white hover:border-primary-300 hover:bg-primary-50/50'}`}
                      >
                        {mood === m.value && (
                          <motion.div
                            layoutId="moodSelected"
                            className="absolute inset-0 bg-primary-50 rounded-2xl"
                            transition={{ type: 'spring', duration: 0.4 }}
                          />
                        )}
                        <span className="text-2xl relative z-10">{m.emoji}</span>
                        <div className="relative z-10">
                          <p className={`text-sm font-bold ${mood === m.value ? 'text-primary-700' : 'text-gray-700'}`}>{m.label}</p>
                          <p className="text-xs text-gray-400 mt-0.5 hidden sm:block">{m.desc}</p>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Travel type */}
                <div className="card p-6">
                  <h2 className="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Plane className="w-4 h-4 text-primary-500" /> Travelling as
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    {TRAVEL_TYPES.map(t => (
                      <motion.button
                        key={t.value}
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => setTravelType(t.value)}
                        className={`flex items-center gap-2 px-5 py-3 rounded-2xl border-2 font-semibold text-sm transition-all duration-200
                          ${travelType === t.value
                            ? 'border-primary-500 bg-primary-600 text-white shadow-glow'
                            : 'border-gray-200 text-gray-700 hover:border-primary-300 hover:bg-primary-50'}`}
                      >
                        <span className="text-lg">{t.emoji}</span>
                        {t.label}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Generate CTA */}
                <motion.button
                  whileHover={{ scale: 1.01, boxShadow: '0 8px 40px rgba(99,102,241,0.4)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleGenerate}
                  disabled={!destination || !mood}
                  className="w-full py-4 rounded-2xl font-bold text-lg text-white flex items-center justify-center gap-3 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: (!destination || !mood)
                      ? '#94a3b8'
                      : 'linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #f97316 100%)',
                    backgroundSize: '200% 100%',
                  }}
                >
                  <Sparkles className="w-5 h-5" />
                  Generate Smart Itinerary
                  <ChevronRight className="w-5 h-5" />
                </motion.button>

                {/* Info note */}
                <p className="text-center text-xs text-gray-400">
                  🔒 Powered by Google Places API · Personalized by AI · Data-driven recommendations
                </p>
              </motion.div>
            )}

            {/* ── Result phase ───────────────────────────────── */}
            {phase === 'result' && result && (
              <motion.div
                key="result"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                <ItineraryResult
                  result={result}
                  onRegenerate={handleReset}
                  onSave={handleSave}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </AppLayout>
    </>
  );
}
