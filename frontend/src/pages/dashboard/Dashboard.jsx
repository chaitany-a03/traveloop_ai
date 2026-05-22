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

            <div className="absolute inset-0 bg-[url('/travel-bg.png')] opacity-65 mix-blend-overlay bg-cover bg-center" />

            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(248,250,252,0.85) 0%, rgba(248,250,252,0.4) 12%, transparent 30%, rgba(17,24,39,0.3) 60%, rgba(17,24,39,0.75) 100%)' }} />

            {/* Back Wave - behind boats, creates depth */}
            <svg className="ocean-wave-layer ocean-wave-back" height="120" viewBox="0 0 2400 120" preserveAspectRatio="none">
              <path d="M0,55 C100,25 250,80 450,50 C650,20 750,85 950,55 C1150,25 1250,80 1450,50 C1650,20 1750,85 1950,55 C2150,25 2250,80 2400,50 L2400,120 L0,120 Z" fill="rgba(20,50,100,0.3)" />
            </svg>

            {/* Mid Wave - between boats */}
            <svg className="ocean-wave-layer ocean-wave-mid" height="100" viewBox="0 0 2400 100" preserveAspectRatio="none">
              <path d="M0,40 C180,62 380,18 600,40 C820,62 1020,18 1200,42 C1380,64 1580,20 1800,40 C2020,62 2220,18 2400,40 L2400,100 L0,100 Z" fill="rgba(30,70,140,0.22)" />
            </svg>

            {/* Sailing Boats - z-index 5, between mid and front waves */}
            <div className="hero-boat hero-boat--1">
              <div className="hero-boat-inner">
                <svg width="140" height="110" viewBox="0 0 140 110" fill="none">
                  <path d="M15,80 Q20,100 70,100 Q120,100 125,80 L115,75 L25,75 Z" fill="rgba(255,255,255,0.9)" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
                  <rect x="50" y="65" width="30" height="14" rx="3" fill="rgba(255,255,255,0.7)" />
                  <line x1="68" y1="12" x2="68" y2="75" stroke="rgba(255,255,255,0.85)" strokeWidth="2.5" />
                  <path d="M70,15 L70,70 L115,70 Z" fill="rgba(255,255,255,0.75)" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
                  <path d="M66,15 L66,60 L28,60 Z" fill="rgba(255,255,255,0.55)" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
                  <path d="M68,12 L68,5 L80,8.5 L68,12 Z" fill="rgba(255,200,100,0.8)" />
                  <circle cx="42" cy="82" r="3" fill="rgba(100,180,255,0.5)" />
                  <circle cx="55" cy="82" r="3" fill="rgba(100,180,255,0.5)" />
                  <circle cx="85" cy="82" r="3" fill="rgba(100,180,255,0.5)" />
                  <circle cx="98" cy="82" r="3" fill="rgba(100,180,255,0.5)" />
                </svg>
              </div>
            </div>

            <div className="hero-boat hero-boat--2">
              <div className="hero-boat-inner">
                <svg width="100" height="80" viewBox="0 0 140 110" fill="none">
                  <path d="M15,80 Q20,100 70,100 Q120,100 125,80 L115,75 L25,75 Z" fill="rgba(255,255,255,0.9)" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
                  <rect x="50" y="65" width="30" height="14" rx="3" fill="rgba(255,255,255,0.6)" />
                  <line x1="68" y1="15" x2="68" y2="75" stroke="rgba(255,255,255,0.7)" strokeWidth="2" />
                  <path d="M70,18 L70,70 L110,70 Z" fill="rgba(255,255,255,0.6)" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
                  <path d="M66,18 L66,58 L32,58 Z" fill="rgba(255,255,255,0.4)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                  <path d="M68,15 L68,8 L78,11.5 L68,15 Z" fill="rgba(255,180,80,0.6)" />
                </svg>
              </div>
            </div>

            <div className="hero-boat hero-boat--3">
              <div className="hero-boat-inner">
                <svg width="120" height="95" viewBox="0 0 140 110" fill="none">
                  <path d="M15,80 Q20,100 70,100 Q120,100 125,80 L115,75 L25,75 Z" fill="rgba(255,255,255,0.9)" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
                  <rect x="55" y="66" width="25" height="12" rx="3" fill="rgba(255,255,255,0.65)" />
                  <line x1="68" y1="14" x2="68" y2="75" stroke="rgba(255,255,255,0.8)" strokeWidth="2" />
                  <path d="M70,16 L70,70 L112,70 Z" fill="rgba(255,255,255,0.65)" stroke="rgba(255,255,255,0.35)" strokeWidth="1" />
                  <path d="M66,16 L66,58 L30,58 Z" fill="rgba(255,255,255,0.45)" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
                  <path d="M68,14 L68,6 L79,10 L68,14 Z" fill="rgba(255,200,100,0.7)" />
                  <circle cx="45" cy="82" r="2.5" fill="rgba(100,180,255,0.4)" />
                  <circle cx="95" cy="82" r="2.5" fill="rgba(100,180,255,0.4)" />
                </svg>
              </div>
            </div>

            {/* Front Wave - IN FRONT of boats, covers their hulls so boats look submerged */}
            <svg className="ocean-wave-layer ocean-wave-front" height="90" viewBox="0 0 2400 90" preserveAspectRatio="none">
              <path d="M0,30 C200,52 400,10 600,32 C800,54 1000,12 1200,32 C1400,54 1600,12 1800,32 C2000,54 2200,12 2400,30 L2400,90 L0,90 Z" fill="rgba(15,40,90,0.18)" />
              <path d="M0,45 C150,58 350,35 550,48 C750,60 950,36 1150,48 C1350,60 1550,36 1750,48 C1950,60 2150,36 2400,48 L2400,90 L0,90 Z" fill="rgba(200,225,255,0.12)" />
            </svg>

            {/* Drifting Clouds */}
            <motion.div
              animate={{ x: ['-220px', 'calc(100vw + 220px)'] }}
              transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
              className="absolute top-[8%] left-0 text-white opacity-25 pointer-events-none z-[3]"
            >
              <svg width="120" height="45" viewBox="0 0 100 40" fill="currentColor">
                <path d="M20,30 Q30,15 45,22 Q55,10 70,18 Q85,15 90,30 Z" />
              </svg>
            </motion.div>
            <motion.div
              animate={{ x: ['calc(100vw + 200px)', '-200px'] }}
              transition={{ duration: 65, repeat: Infinity, ease: 'linear' }}
              className="absolute top-[18%] left-0 text-white opacity-20 pointer-events-none z-[3]"
            >
              <svg width="150" height="50" viewBox="0 0 100 40" fill="currentColor">
                <path d="M15,32 Q25,18 40,24 Q50,12 65,20 Q78,14 88,24 Q95,18 100,30 Z" />
              </svg>
            </motion.div>
            <motion.div
              animate={{ x: ['-180px', 'calc(100vw + 180px)'] }}
              transition={{ duration: 70, repeat: Infinity, ease: 'linear', delay: 8 }}
              className="absolute top-[30%] left-0 text-white opacity-15 pointer-events-none z-[3]"
            >
              <svg width="100" height="38" viewBox="0 0 100 40" fill="currentColor">
                <path d="M20,30 Q30,15 45,22 Q55,10 70,18 Q85,15 90,30 Z" />
              </svg>
            </motion.div>

            {/* Gliding Planes */}
            <motion.div
              animate={{ 
                x: ['-12vw', '112vw'],
                y: ['6vh', '2vh', '8vh', '4vh'],
                rotate: [8, 4, 10, 8]
              }}
              transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
              className="absolute top-[10%] left-0 pointer-events-none z-[4] opacity-30"
            >
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>
              </svg>
            </motion.div>
            <motion.div
              animate={{ 
                x: ['115vw', '-15vw'],
                y: ['12vh', '5vh', '10vh'],
                rotate: [-170, -175, -168]
              }}
              transition={{ duration: 28, repeat: Infinity, ease: 'linear', delay: 5 }}
              className="absolute top-[5%] left-0 pointer-events-none z-[4] opacity-20"
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>
              </svg>
            </motion.div>
          </div>

          <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-16 pt-16 pb-28 flex flex-col items-center text-center">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 mb-6 shadow-2xl">
              <Sparkles className="w-4 h-4 text-accent-300 animate-pulse" />
              <span className="text-white text-sm font-bold tracking-widest uppercase">Intelligent Travel Assistant</span>
            </motion.div>

            <h1 className="text-6xl md:text-8xl font-black text-white font-display leading-[1.1] mb-4 tracking-tighter text-balance">
              Traveloop<span className="text-primary-500">.</span>
              <br />
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
                      <span className={`px-4 py-1.5 text-xs font-black tracking-wider uppercase rounded-full shadow-lg backdrop-blur-xl border border-white/20 ${trip.status === 'completed' ? 'bg-green-500/90 text-white' :
                          trip.status === 'active' ? 'bg-accent-500/90 text-white' :
                            'bg-white/20 text-white'
                        }`}>
                        {STATUS_CONFIG[trip.status]?.label}
                      </span>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                      <div className="flex items-center gap-3 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                        <span className="bg-white/20 backdrop-blur-xl border border-white/20 text-white text-xs font-bold px-4 py-1.5 rounded-full flex items-center gap-2"><Map className="w-3.5 h-3.5" /> {(trip.stops || []).length} stops</span>
                        {getTotalBudget(trip.budget) > 0 && (
                          <span className="bg-white/20 backdrop-blur-xl border border-white/20 text-white text-xs font-bold px-4 py-1.5 rounded-full flex items-center gap-2"><Wallet className="w-3.5 h-3.5" /> {formatCurrency(getTotalBudget(trip.budget))}</span>
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
