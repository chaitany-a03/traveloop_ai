import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Search, Trash2, Edit, Eye, Map, Calendar, Sparkles, Wallet, ArrowRight } from 'lucide-react';
import { toast } from 'react-hot-toast';
import AppLayout from '../../components/layout/AppLayout';
import useTripStore from '../../store/tripStore';
import { CardSkeleton } from '../../components/ui/Skeleton';
import { formatDate, formatCurrency, getTotalBudget, STATUS_CONFIG, getMoodCoverImage, extractTripMood, MOOD_CONFIG } from '../../utils';

const FILTERS = ['all', 'planned', 'ongoing', 'completed', 'draft'];

export default function MyTrips() {
  const { trips, fetchTrips, deleteTrip, isLoading } = useTripStore();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => { fetchTrips(); }, []);

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!confirm('Delete this trip? This cannot be undone.')) return;
    await deleteTrip(id);
    toast.success('Trip deleted');
  };

  const filtered = trips
    .filter(t => filter === 'all' || t.status === filter)
    .filter(t => !search || t.title.toLowerCase().includes(search.toLowerCase()));

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 260, damping: 20 } }
  };

  return (
    <AppLayout noPadding={true}>
      <div className="w-full flex flex-col min-h-screen bg-surface-50">
        
        {/* Cinematic Header with Beach / Travel Vibe */}
        <div className="relative w-full overflow-hidden bg-gray-900 py-16 flex items-center justify-center">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-[-10%] left-[0%] w-[60%] h-[60%] bg-primary-600/30 rounded-full blur-[120px] mix-blend-screen animate-blob" />
            <div className="absolute top-[20%] right-[-10%] w-[70%] h-[70%] bg-accent-500/20 rounded-full blur-[140px] mix-blend-screen animate-blob animation-delay-2000" />
            <div className="absolute bottom-[-30%] left-[20%] w-[80%] h-[80%] bg-purple-600/30 rounded-full blur-[150px] mix-blend-screen animate-blob animation-delay-4000" />
            <div className="absolute inset-0 bg-[url('/travel-bg.png')] opacity-40 mix-blend-overlay bg-cover bg-center" />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-50 via-gray-900/50 to-gray-900/90" />
          </div>

          <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-16 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-white font-display tracking-tight mb-2">
                My Trips
              </h1>
              <p className="text-gray-300 font-medium text-lg">
                Manage your adventures, itineraries, and travel memories.
              </p>
              <div className="inline-flex items-center gap-2 mt-3 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10">
                <span className="w-2 h-2 rounded-full bg-primary-400 animate-pulse" />
                <span className="text-xs font-bold text-gray-200 tracking-wider uppercase">
                  {trips.length} Adventure{trips.length !== 1 ? 's' : ''} Cataloged
                </span>
              </div>
            </div>
            <button 
              onClick={() => navigate('/planner')} 
              className="group relative px-6 py-4 rounded-xl bg-white text-gray-900 font-bold text-base hover:scale-105 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] flex items-center gap-2 overflow-hidden self-start md:self-auto"
            >
              <Sparkles className="w-5 h-5 text-primary-600 group-hover:rotate-12 transition-transform" />
              <span>Plan with AI</span>
            </button>
          </div>
        </div>

        {/* Content Wrapper */}
        <div className="max-w-7xl mx-auto w-full px-6 md:px-12 lg:px-16 -mt-8 relative z-20 pb-20 space-y-8">
          
          {/* Glassmorphic Search & Filters Panel */}
          <div className="glass-panel rounded-2xl p-4 bg-white/80 backdrop-blur-xl border border-white/60 shadow-lg flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-sm" 
                placeholder="Search by trip title or destination..." 
                value={search}
                onChange={e => setSearch(e.target.value)} 
              />
            </div>
            <div className="flex gap-2 flex-wrap w-full md:w-auto">
              {FILTERS.map(f => (
                <button 
                  key={f} 
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2.5 rounded-xl text-xs md:text-sm font-bold capitalize transition-all duration-200 flex-1 md:flex-none text-center ${
                    filter === f 
                      ? 'bg-primary-600 text-white shadow-glow' 
                      : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {f === 'all' ? 'All Trips' : f}
                </button>
              ))}
            </div>
          </div>

          {/* Grid / Content States */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array(6).fill(0).map((_, i) => <CardSkeleton key={i} />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="card p-20 text-center bg-white/80 backdrop-blur-lg border border-gray-100 rounded-3xl shadow-soft">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Map className="w-10 h-10 text-gray-300 animate-pulse" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">No journeys found</h3>
              <p className="text-gray-500 max-w-md mx-auto mb-8 text-base">
                {search ? 'No trips match your search filters. Try using other keywords!' : 'Your adventure journal is empty. Let\'s draft a new journey!'}
              </p>
              {!search && (
                <button onClick={() => navigate('/planner')} className="px-8 py-4 bg-gray-900 text-white rounded-xl font-bold text-base hover:bg-gray-800 transition-all flex items-center gap-2 mx-auto shadow-xl">
                  <Sparkles className="w-5 h-5" /> Start AI Planner
                </button>
              )}
            </div>
          ) : (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filtered.map(trip => {
                const mood = extractTripMood(trip);
                const moodCfg = MOOD_CONFIG[mood] || MOOD_CONFIG.default;
                const coverImage = getMoodCoverImage(trip);

                return (
                  <motion.div 
                    key={trip.id} 
                    variants={itemVariants}
                    whileHover={{ y: -8 }}
                    className="group relative rounded-[2rem] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_25px_50px_rgba(0,0,0,0.15)] transition-shadow duration-500 flex flex-col bg-white border border-gray-100/50"
                  >
                    {/* ── Full-bleed Cover Image ── */}
                    <div className="relative h-64 overflow-hidden cursor-pointer" onClick={() => navigate(`/trips/${trip.id}`)}>
                      <img
                        src={coverImage}
                        alt={trip.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[800ms] ease-out"
                      />
                      
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/30 to-transparent" />

                      {/* Top badges row */}
                      <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
                        {/* Status */}
                        <span className={`px-3 py-1.5 text-[10px] font-black tracking-widest uppercase rounded-full shadow-lg backdrop-blur-xl border border-white/20 ${
                          trip.status === 'completed' ? 'bg-green-500/90 text-white' :
                          trip.status === 'ongoing' ? 'bg-accent-500/90 text-white' :
                          trip.status === 'planned' ? 'bg-white/20 text-white' :
                          'bg-gray-800/60 text-white'
                        }`}>
                          {STATUS_CONFIG[trip.status]?.label}
                        </span>

                        {/* Quick Actions */}
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
                          <button 
                            onClick={(e) => { e.stopPropagation(); navigate(`/itinerary/${trip.id}`); }}
                            className="w-9 h-9 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center shadow-lg hover:bg-white/40 transition-all border border-white/20"
                          >
                            <Edit className="w-4 h-4 text-white" />
                          </button>
                          <button 
                            onClick={(e) => handleDelete(e, trip.id)}
                            className="w-9 h-9 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center shadow-lg hover:bg-red-500/80 transition-all border border-white/20"
                          >
                            <Trash2 className="w-4 h-4 text-white" />
                          </button>
                        </div>
                      </div>

                      {/* Bottom overlay — Title + Mood on the image */}
                      <div className="absolute bottom-0 left-0 right-0 p-5">
                        {/* Mood pill */}
                        <div className="flex items-center gap-2 mb-3">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase text-white ${moodCfg.badge} backdrop-blur-md border border-white/20 shadow-md`}>
                            <span className="text-sm">{moodCfg.emoji}</span> {moodCfg.label}
                          </span>
                          {(trip.stops || []).length > 0 && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold text-white bg-white/15 backdrop-blur-md border border-white/15">
                              <Map className="w-3 h-3" /> {(trip.stops || []).length} stops
                            </span>
                          )}
                        </div>
                        <h3 className="font-black font-display text-white text-xl leading-tight line-clamp-2 drop-shadow-lg">
                          {trip.title}
                        </h3>
                      </div>
                    </div>

                    {/* ── Mood-colored accent strip ── */}
                    <div className={`h-1 w-full bg-gradient-to-r ${moodCfg.gradient}`} />

                    {/* ── Card Body ── */}
                    <div className="p-5 flex-1 flex flex-col justify-between bg-white">
                      <div>
                        <p className="text-sm text-gray-500 mb-4 line-clamp-2 leading-relaxed">
                          {trip.description || "An exciting personalized journey waiting to be explored."}
                        </p>

                        {/* Date & Budget pills */}
                        <div className="flex flex-wrap items-center gap-2 mb-4">
                          <div className="flex items-center gap-1.5 text-xs text-gray-600 font-semibold bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
                            <Calendar className="w-3.5 h-3.5 text-gray-400" />
                            {trip.start_date ? `${formatDate(trip.start_date)} → ${formatDate(trip.end_date)}` : 'Dates not set'}
                          </div>
                          <div className={`flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-lg border ${
                            mood !== 'default' 
                              ? `bg-gradient-to-r ${moodCfg.gradient} bg-clip-text text-transparent border-gray-200`
                              : 'text-primary-700 border-primary-100 bg-primary-50'
                          }`}>
                            <Wallet className={`w-3.5 h-3.5 ${moodCfg.textColor}`} />
                            <span className={`font-extrabold ${mood !== 'default' ? moodCfg.textColor : ''}`}>
                              {formatCurrency(getTotalBudget(trip.budget))}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex gap-2 pt-3 border-t border-gray-100">
                        <button 
                          onClick={() => navigate(`/trips/${trip.id}`)} 
                          className="flex-1 text-sm py-2.5 rounded-xl flex items-center justify-center gap-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold transition-all border border-gray-200"
                        >
                          <Eye className="w-4 h-4 text-gray-400" /> View
                        </button>
                        <button 
                          onClick={() => navigate(`/itinerary/${trip.id}`)} 
                          className={`flex-1 text-sm py-2.5 rounded-xl flex items-center justify-center gap-1.5 bg-gradient-to-r ${moodCfg.gradient} text-white font-bold transition-all hover:shadow-lg hover:opacity-90`}
                        >
                          <Edit className="w-4 h-4" /> Plan
                          <ArrowRight className="w-3.5 h-3.5 opacity-60 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
