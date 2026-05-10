import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Map, Wallet, Globe, Calendar, ArrowRight, Sparkles, Navigation } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import useTripStore from '../../store/tripStore';
import AppLayout from '../../components/layout/AppLayout';
import { StatCardSkeleton, CardSkeleton } from '../../components/ui/Skeleton';
import { formatDate, formatCurrency, getTotalBudget, STATUS_CONFIG, getDestinationImage } from '../../utils';

export default function Dashboard() {
  const { user } = useAuthStore();
  const { trips, fetchTrips, isLoading } = useTripStore();
  const navigate = useNavigate();

  useEffect(() => { fetchTrips(); }, []);

  const totalBudget = trips.reduce((sum, t) => sum + getTotalBudget(t.budget), 0);
  const countries = [...new Set(trips.flatMap(t => (t.stops || []).map(s => s.country)))].length;
  const upcoming = trips.filter(t => t.status === 'planned' && new Date(t.start_date) > new Date()).length;
  const recent = trips.slice(0, 3);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <AppLayout noPadding={true}>
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="w-full flex flex-col min-h-screen"
      >
        {/* Full-width Cinematic Hero */}
        <motion.div variants={itemVariants} className="relative w-full overflow-hidden bg-gray-900 min-h-[400px] flex items-center justify-center">
          {/* Advanced Animated Background Mesh */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-[-10%] left-[0%] w-[60%] h-[60%] bg-primary-600/40 rounded-full blur-[120px] mix-blend-screen animate-blob" />
            <div className="absolute top-[20%] right-[-10%] w-[70%] h-[70%] bg-accent-500/30 rounded-full blur-[140px] mix-blend-screen animate-blob animation-delay-2000" />
            <div className="absolute bottom-[-30%] left-[20%] w-[80%] h-[80%] bg-purple-600/40 rounded-full blur-[150px] mix-blend-screen animate-blob animation-delay-4000" />
            
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=2500&q=80')] opacity-30 mix-blend-overlay bg-cover bg-center" />
            
            <div className="absolute inset-0 bg-gradient-to-t from-surface-50 via-gray-900/40 to-gray-900/80" />
          </div>

          <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-16 pt-16 pb-28 flex flex-col items-center text-center">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 mb-6 shadow-2xl">
              <Sparkles className="w-4 h-4 text-accent-300 animate-pulse" />
              <span className="text-white text-sm font-bold tracking-widest uppercase">Intelligent Travel Assistant</span>
            </motion.div>
            
            <h1 className="text-6xl md:text-8xl font-black text-white font-display leading-[1.1] mb-4 tracking-tighter text-balance">
              Traveloop<span className="text-primary-500">.</span>
              <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-200 via-white to-primary-200 text-5xl md:text-7xl">
                Explore The World Smarter
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 font-medium max-w-3xl mb-8 text-balance leading-relaxed">
              Your next adventure powered by real-world intelligence. Generate highly personalized itineraries instantly using our AI engine.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-6 mt-2">
              <button onClick={() => navigate('/planner')} className="group relative px-8 py-5 rounded-2xl bg-white text-gray-900 font-bold text-lg hover:scale-105 transition-all shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] flex items-center gap-3 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-white via-primary-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <Sparkles className="w-6 h-6 text-primary-600 group-hover:rotate-12 transition-transform" /> 
                <span className="relative">Generate with AI</span>
              </button>
              <button onClick={() => navigate('/trips/create')} className="px-8 py-5 rounded-2xl text-lg font-bold text-white bg-gray-900 border border-gray-800 hover:bg-black transition-all hover:scale-105 flex items-center gap-3 shadow-xl">
                <Plus className="w-6 h-6" /> Manual Plan
              </button>
            </div>
          </div>
        </motion.div>

        {/* Content Wrapper for standard padded layout */}
        <div className="max-w-7xl mx-auto w-full px-6 md:px-12 lg:px-16 -mt-20 relative z-20 pb-20 space-y-10">
          
          {/* AI Planner Spotlight */}
          <motion.div variants={itemVariants} className="group cursor-pointer relative" onClick={() => navigate('/planner')}>
            <div className="absolute inset-0 bg-gradient-to-r from-primary-600 via-purple-600 to-accent-500 rounded-3xl blur-xl opacity-40 group-hover:opacity-70 transition duration-700 animate-pulse-slow" />
            <div className="relative glass-panel rounded-3xl p-1.5 bg-gradient-to-br from-white/80 to-white/40">
               <div className="bg-white/70 backdrop-blur-2xl rounded-[1.25rem] p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 border border-white/60 shadow-inner">
                 <div className="flex items-center gap-8">
                   <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center shadow-glow shrink-0 group-hover:scale-110 transition-transform duration-500">
                     <Sparkles className="w-10 h-10 text-white animate-pulse" />
                   </div>
                   <div>
                     <h3 className="text-3xl font-black font-display text-gray-900 mb-2">AI Trip Planner</h3>
                     <p className="text-gray-600 text-lg font-medium">Enter a destination and your travel mood. We'll instantly craft your perfect itinerary using real Google Places data.</p>
                   </div>
                 </div>
                 <div className="shrink-0 w-14 h-14 rounded-full bg-gray-900 text-white flex items-center justify-center group-hover:translate-x-3 transition-transform shadow-xl">
                   <ArrowRight className="w-6 h-6" />
                 </div>
               </div>
            </div>
          </motion.div>

          {/* Floating Stats */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoading ? Array(4).fill(0).map((_, i) => <StatCardSkeleton key={i} />) : (
              <>
                <div className="bg-white rounded-3xl p-6 hover:-translate-y-2 transition-transform duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center mb-5 shadow-lg shadow-blue-500/30"><Map className="w-7 h-7 text-white" /></div>
                  <p className="text-sm text-gray-500 font-bold tracking-wide uppercase mb-1">Total Trips</p>
                  <p className="text-4xl font-black text-gray-900">{trips.length}</p>
                </div>
                <div className="bg-white rounded-3xl p-6 hover:-translate-y-2 transition-transform duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-500 to-yellow-400 flex items-center justify-center mb-5 shadow-lg shadow-accent-500/30"><Calendar className="w-7 h-7 text-white" /></div>
                  <p className="text-sm text-gray-500 font-bold tracking-wide uppercase mb-1">Upcoming</p>
                  <p className="text-4xl font-black text-gray-900">{upcoming}</p>
                </div>
                <div className="bg-white rounded-3xl p-6 hover:-translate-y-2 transition-transform duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-400 flex items-center justify-center mb-5 shadow-lg shadow-emerald-500/30"><Globe className="w-7 h-7 text-white" /></div>
                  <p className="text-sm text-gray-500 font-bold tracking-wide uppercase mb-1">Countries Explored</p>
                  <p className="text-4xl font-black text-gray-900">{countries}</p>
                </div>
                <div className="bg-white rounded-3xl p-6 hover:-translate-y-2 transition-transform duration-300 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-5 shadow-lg shadow-purple-500/30"><Wallet className="w-7 h-7 text-white" /></div>
                  <p className="text-sm text-gray-500 font-bold tracking-wide uppercase mb-1">Total Budget Spent</p>
                  <p className="text-4xl font-black text-gray-900">{formatCurrency(totalBudget)}</p>
                </div>
              </>
            )}
          </motion.div>

          {/* Premium Trip Cards */}
          <motion.div variants={itemVariants}>
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-4xl font-black font-display text-gray-900">Your Journeys</h2>
              <button onClick={() => navigate('/trips')} className="text-sm font-bold text-primary-600 hover:text-primary-700 bg-primary-50 px-5 py-2.5 rounded-full flex items-center gap-2 hover:bg-primary-100 transition-colors">
                View all <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {Array(3).fill(0).map((_, i) => <CardSkeleton key={i} />)}
              </div>
            ) : recent.length === 0 ? (
              <div className="bg-white rounded-[2rem] border border-gray-100 p-20 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8">
                  <Navigation className="w-12 h-12 text-gray-300" />
                </div>
                <h3 className="text-3xl font-black text-gray-900 mb-4">The canvas is blank</h3>
                <p className="text-gray-500 mb-10 max-w-lg mx-auto text-xl leading-relaxed">Your next great adventure is waiting to be written. Let our AI craft your perfect itinerary.</p>
                <button onClick={() => navigate('/planner')} className="px-10 py-4 bg-gray-900 text-white rounded-2xl font-bold text-lg hover:bg-gray-800 transition-all flex items-center gap-3 mx-auto shadow-xl">
                  <Sparkles className="w-6 h-6" /> Start Planning
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {recent.map((trip) => (
                  <motion.div 
                    key={trip.id} 
                    whileHover={{ y: -10 }}
                    className="group relative h-[480px] rounded-[2rem] overflow-hidden cursor-pointer shadow-2xl hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)] transition-all duration-500"
                    onClick={() => navigate(`/trips/${trip.id}`)}
                  >
                    <img
                      src={trip.cover_image ? `http://localhost:5000${trip.cover_image}` : getDestinationImage(trip.stops?.[0]?.city)}
                      alt={trip.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
                    
                    <div className="absolute top-6 right-6 flex flex-col items-end gap-2">
                      <span className={`px-4 py-1.5 text-xs font-black tracking-wider uppercase rounded-full shadow-lg backdrop-blur-xl border border-white/20 ${
                        trip.status === 'completed' ? 'bg-green-500/90 text-white' :
                        trip.status === 'active' ? 'bg-accent-500/90 text-white' :
                        'bg-white/20 text-white'
                      }`}>
                        {STATUS_CONFIG[trip.status]?.label}
                      </span>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                      <div className="flex items-center gap-3 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                        <span className="bg-white/20 backdrop-blur-xl border border-white/20 text-white text-xs font-bold px-4 py-1.5 rounded-full flex items-center gap-2"><Map className="w-3.5 h-3.5"/> {(trip.stops || []).length} stops</span>
                        {getTotalBudget(trip.budget) > 0 && (
                           <span className="bg-white/20 backdrop-blur-xl border border-white/20 text-white text-xs font-bold px-4 py-1.5 rounded-full flex items-center gap-2"><Wallet className="w-3.5 h-3.5"/> {formatCurrency(getTotalBudget(trip.budget))}</span>
                        )}
                      </div>
                      <h3 className="font-black font-display text-white text-3xl mb-3 line-clamp-2 leading-tight">{trip.title}</h3>
                      <p className="text-white/80 font-bold text-sm flex items-center gap-2">
                        <Calendar className="w-4 h-4" /> 
                        {trip.start_date ? formatDate(trip.start_date) : 'No dates set'}
                        {trip.end_date && ` → ${formatDate(trip.end_date)}`}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

        </div>
      </motion.div>
    </AppLayout>
  );
}
