import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Clock, DollarSign, Calendar, Edit, Wallet, CheckSquare, BookOpen, Share2, LayoutList, Timeline, Sparkles, Plane, Hotel, ArrowRight, Star } from 'lucide-react';
import { toast } from 'react-hot-toast';
import AppLayout from '../../components/layout/AppLayout';
import useTripStore from '../../store/tripStore';
import { PageLoader } from '../../components/ui/Skeleton';
import { formatDate, formatCurrency, getTotalBudget, CATEGORY_COLORS, CATEGORY_ICONS_MAP, STATUS_CONFIG, getMoodCoverImage, extractTripMood, MOOD_CONFIG, generateFlightBookingLink, generateHotelBookingLink } from '../../utils';

function getUnsplashFallback(types = [], category = '') {
  const ts = (types || []).join(' ').toLowerCase();
  const cat = (category || '').toLowerCase();

  if (ts.includes('night_club') || ts.includes('bar') || ts.includes('casino') || cat === 'nightlife') {
    return 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=300&q=80';
  }
  if (ts.includes('museum') || ts.includes('art_gallery') || ts.includes('heritage') || cat === 'culture') {
    return 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=300&q=80';
  }
  if (ts.includes('restaurant') || ts.includes('cafe') || ts.includes('bakery') || ts.includes('food') || cat === 'food') {
    return 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=300&q=80';
  }
  if (ts.includes('amusement_park') || ts.includes('zoo') || ts.includes('adventure') || cat === 'adventure') {
    return 'https://images.unsplash.com/photo-1533240332313-0db49b439ad3?auto=format&fit=crop&w=300&q=80';
  }
  if (ts.includes('shopping') || cat === 'shopping') {
    return 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=300&q=80';
  }
  if (ts.includes('spa') || ts.includes('wellness') || cat === 'relaxation') {
    return 'https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&w=300&q=80';
  }
  return 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=300&q=80'; // Sightseeing default
}

export default function TripDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentTrip, fetchTrip, updateTrip, isLoading } = useTripStore();
  const [view, setView] = useState('timeline');

  useEffect(() => { fetchTrip(id); }, [id]);

  const handleShare = async () => {
    try {
      await updateTrip(id, { is_public: 'true' });
      const url = `${window.location.origin}/shared/${id}`;
      navigator.clipboard.writeText(url);
      toast.success('Trip is now public! Link copied 🔗');
    } catch { toast.error('Failed to share trip'); }
  };

  if (isLoading || !currentTrip) return <AppLayout><PageLoader /></AppLayout>;

  const totalBudget = getTotalBudget(currentTrip.budget);
  const allActivities = (currentTrip.stops || []).flatMap(s => (s.activities || []).map(a => ({ ...a, city: s.city })));
  const destCity = currentTrip.stops?.[0]?.city || currentTrip.title.split('—')[0].trim();
  const mood = extractTripMood(currentTrip);
  const moodCfg = MOOD_CONFIG[mood] || MOOD_CONFIG.default;
  const coverImage = getMoodCoverImage(currentTrip);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 22 } }
  };

  return (
    <AppLayout noPadding={true}>
      <div className="w-full flex flex-col min-h-screen bg-surface-50">
        
        {/* ── Full-bleed Hero: Cover image IS the header ── */}
        <div className="relative w-full h-[28rem] md:h-[34rem] overflow-hidden">
          {/* Cover Image */}
          <img
            src={coverImage}
            alt={currentTrip.title}
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Animated gradient blobs behind the image for color bleed */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary-600/20 rounded-full blur-[100px] mix-blend-screen animate-blob" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-600/20 rounded-full blur-[120px] mix-blend-screen animate-blob animation-delay-2000" />
          </div>

          {/* Dark overlays for readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950/95 via-gray-900/40 to-gray-900/60" />
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-surface-50 to-transparent" />

          {/* Top Action Bar — inside the cover */}
          <div className="absolute top-0 left-0 right-0 z-20 p-5 md:p-8">
            <div className="max-w-5xl mx-auto flex items-center justify-between">
              <button 
                onClick={() => navigate('/trips')} 
                className="w-11 h-11 bg-black/30 backdrop-blur-xl hover:bg-black/50 text-white rounded-full flex items-center justify-center shadow-lg transition-all border border-white/10"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex gap-2.5">
                <button 
                  onClick={handleShare} 
                  className="px-5 py-2.5 rounded-full bg-black/30 backdrop-blur-xl text-white font-bold text-sm hover:bg-black/50 transition-all border border-white/10 flex items-center gap-2 shadow-lg"
                >
                  <Share2 className="w-4 h-4" /> Share
                </button>
                <button 
                  onClick={() => navigate(`/itinerary/${id}`)} 
                  className={`px-5 py-2.5 rounded-full bg-gradient-to-r ${moodCfg.gradient} text-white font-bold text-sm hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] transition-all flex items-center gap-2 shadow-lg`}
                >
                  <Edit className="w-4 h-4" /> Edit Itinerary
                </button>
              </div>
            </div>
          </div>

          {/* Bottom content overlay — title, badges, dates */}
          <div className="absolute bottom-12 left-0 right-0 z-20">
            <div className="max-w-5xl mx-auto px-6 md:px-12">
              {/* Badges */}
              <div className="flex flex-wrap gap-2.5 mb-5">
                <span className={`px-3.5 py-1.5 text-[10px] font-black tracking-widest uppercase rounded-full shadow-lg backdrop-blur-xl border border-white/20 ${
                  currentTrip.status === 'completed' ? 'bg-green-500/90 text-white' :
                  currentTrip.status === 'ongoing' ? 'bg-accent-500/90 text-white' :
                  currentTrip.status === 'planned' ? 'bg-primary-500/90 text-white' :
                  'bg-gray-600/90 text-white'
                }`}>
                  {STATUS_CONFIG[currentTrip.status]?.label}
                </span>

                <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase text-white ${moodCfg.badge} backdrop-blur-xl border border-white/20 shadow-lg`}>
                  <span className="text-sm">{moodCfg.emoji}</span> {moodCfg.label}
                </span>

                <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[10px] font-bold text-white bg-white/15 backdrop-blur-xl border border-white/15">
                  <MapPin className="w-3.5 h-3.5" /> {(currentTrip.stops || []).length} stops
                </span>
                
                {totalBudget > 0 && (
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[10px] font-bold text-white bg-white/15 backdrop-blur-xl border border-white/15">
                    <Wallet className="w-3.5 h-3.5" /> {formatCurrency(totalBudget)}
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-6xl font-black font-display tracking-tight leading-[1.1] mb-3 text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
                {currentTrip.title}
              </h1>

              {currentTrip.description && (
                <p className="text-white/75 text-sm md:text-base font-medium max-w-2xl mb-3 leading-relaxed">
                  {currentTrip.description}
                </p>
              )}

              <p className="text-white/50 text-xs md:text-sm font-semibold flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {currentTrip.start_date ? `${formatDate(currentTrip.start_date)} → ${formatDate(currentTrip.end_date)}` : 'Dates not set yet'}
              </p>
            </div>
          </div>
        </div>

        {/* Content Body — overlaps the hero slightly */}
        <div className="max-w-5xl mx-auto w-full px-6 md:px-12 -mt-6 relative z-20 pb-24 space-y-8">
          
          {/* Quick Links — Premium glassmorphic cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { 
                label: 'Budget Details', 
                desc: 'Track expenses, manage costs & stay on budget', 
                icon: Wallet, 
                to: `/budget/${id}`, 
                gradient: 'from-purple-600 to-indigo-600',
                bgImage: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400',
              },
              { 
                label: 'Hidden Gems', 
                desc: 'Discover secret spots & local favorites', 
                icon: Sparkles, 
                to: `/hidden-gems/${id}`, 
                gradient: 'from-blue-600 to-cyan-500',
                bgImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
              },
              { 
                label: 'Trip Notes', 
                desc: 'Save thoughts, guides & travel memories', 
                icon: BookOpen, 
                to: `/notes/${id}`, 
                gradient: 'from-orange-500 to-amber-500',
                bgImage: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400',
              },
            ].map(({ label, desc, icon: Icon, to, gradient, bgImage }) => (
              <Link 
                key={label} 
                to={to} 
                className="group relative h-44 rounded-[2rem] overflow-hidden shadow-lg hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)] hover:-translate-y-2 transition-all duration-500"
              >
                {/* Background image */}
                <img src={bgImage} alt="" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-85 group-hover:opacity-80 transition-opacity`} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                
                {/* Content */}
                <div className="relative z-10 h-full flex flex-col justify-end p-6">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-3 border border-white/20 group-hover:scale-110 transition-transform shadow-lg">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-black text-white tracking-tight mb-1">{label}</h3>
                  <p className="text-white/70 text-xs font-medium leading-snug">{desc}</p>
                </div>

                {/* Arrow indicator */}
                <div className="absolute top-5 right-5 w-8 h-8 bg-white/15 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                  <ArrowRight className="w-4 h-4 text-white" />
                </div>
              </Link>
            ))}
          </div>

          {/* Complete Your Journey Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary-600 animate-pulse" />
              <h2 className="text-xl font-black text-gray-900 tracking-tight font-display">Complete Your Journey</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Travel Booking Card */}
              <motion.div
                whileHover={{ y: -6 }}
                className="group relative h-64 rounded-[2rem] overflow-hidden shadow-lg border border-gray-150 bg-slate-900 flex flex-col justify-end p-6"
              >
                <img
                  src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80"
                  alt="Travel Booking"
                  className="absolute inset-0 w-full h-full object-cover opacity-35 group-hover:opacity-25 transition-all duration-[800ms] group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                
                <div className="relative z-10 space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-white/10 backdrop-blur-md border border-white/20">
                      <Plane className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-[10px] font-black text-white/90 uppercase tracking-widest">Travel Booking</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold text-white tracking-tight mb-1">
                      Book Travel to {destCity}
                    </h3>
                    <p className="text-slate-300 text-xs font-semibold">
                      Find flights, trains & transport instantly
                    </p>
                  </div>
                  <div className="flex flex-col gap-2.5">
                    <a
                      href={generateFlightBookingLink(destCity, 'skyscanner')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full text-center py-3 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 text-white font-extrabold text-xs shadow-md hover:shadow-lg transition-all"
                    >
                      Search Flights ↗
                    </a>
                    <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-slate-400">
                      <span>Or book via:</span>
                      <a
                        href={generateFlightBookingLink(destCity, 'skyscanner')}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white hover:text-blue-400 transition-colors"
                      >
                        Skyscanner
                      </a>
                      <span>•</span>
                      <a
                        href={generateFlightBookingLink(destCity, 'makemytrip')}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white hover:text-orange-400 transition-colors"
                      >
                        MakeMyTrip
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Stay Booking Card */}
              <motion.div
                whileHover={{ y: -6 }}
                className="group relative h-64 rounded-[2rem] overflow-hidden shadow-lg border border-gray-150 bg-slate-900 flex flex-col justify-end p-6"
              >
                <img
                  src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80"
                  alt="Stay Booking"
                  className="absolute inset-0 w-full h-full object-cover opacity-35 group-hover:opacity-25 transition-all duration-[800ms] group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                
                <div className="relative z-10 space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-white/10 backdrop-blur-md border border-white/20">
                      <Hotel className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-[10px] font-black text-white/90 uppercase tracking-widest">Stay Booking</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold text-white tracking-tight mb-1">
                      Book Stays in {destCity}
                    </h3>
                    <p className="text-slate-300 text-xs font-semibold">
                      Book premium stays near your destination
                    </p>
                  </div>
                  <div className="flex flex-col gap-2.5">
                    <a
                      href={generateHotelBookingLink(destCity, 'booking')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full text-center py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-extrabold text-xs shadow-md hover:shadow-lg transition-all"
                    >
                      Find Hotels ↗
                    </a>
                    <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-slate-400">
                      <span>Or book via:</span>
                      <a
                        href={generateHotelBookingLink(destCity, 'booking')}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white hover:text-indigo-400 transition-colors"
                      >
                        Booking.com
                      </a>
                      <span>•</span>
                      <a
                        href={generateHotelBookingLink(destCity, 'airbnb')}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white hover:text-rose-400 transition-colors"
                      >
                        Airbnb
                      </a>
                      <span>•</span>
                      <a
                        href={generateHotelBookingLink(destCity, 'agoda')}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white hover:text-emerald-400 transition-colors"
                      >
                        Agoda
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Stops / Timeline Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-gray-900 tracking-tight font-display">Itinerary Plan</h2>
              <div className="flex bg-gray-150 p-1 rounded-xl gap-1 border border-gray-200">
                {['timeline', 'list'].map(v => (
                  <button key={v} onClick={() => setView(v)}
                    className={`px-4 py-2 rounded-lg text-xs md:text-sm font-bold capitalize transition-all ${view === v ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
                    {v}
                  </button>
                ))}
              </div>
            </div>

            {(currentTrip.stops || []).length === 0 ? (
              <div className="card p-12 text-center bg-white border border-gray-150 rounded-[2rem] shadow-soft">
                <p className="text-gray-400 mb-4 font-semibold">No stops added yet</p>
                <button onClick={() => navigate(`/itinerary/${id}`)} className="btn-primary mx-auto">Start Building Itinerary</button>
              </div>
            ) : view === 'timeline' ? (
              <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-6 top-3 bottom-3 w-0.5 bg-gradient-to-b from-primary-400 via-purple-400 to-accent-300" />
                <div className="space-y-8 pl-14">
                  {(currentTrip.stops || []).sort((a, b) => a.order_index - b.order_index).map((stop, i) => (
                    <div key={stop.id} className="relative">
                      {/* Timeline Dot */}
                      <div className="absolute -left-[2.35rem] top-3.5 w-5 h-5 rounded-full bg-gradient-to-tr from-primary-500 to-indigo-500 border-4 border-white shadow-[0_0_12px_rgba(99,102,241,0.4)]" />
                      
                      <div className="space-y-4">
                        {/* Stop Header */}
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center border border-primary-100 shadow-sm">
                            <MapPin className="w-5 h-5 text-primary-600" />
                          </div>
                          <div>
                            <h3 className="font-extrabold text-gray-900 text-lg leading-tight">{stop.city}, {stop.country}</h3>
                            {stop.start_date && (
                              <p className="text-xs text-gray-400 font-semibold flex items-center gap-1 mt-0.5">
                                <Calendar className="w-3 h-3" />{formatDate(stop.start_date)} {stop.end_date && `→ ${formatDate(stop.end_date)}`}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Stop Activities */}
                        {(stop.activities || []).length > 0 && (
                          <div className="grid grid-cols-1 gap-4">
                            {stop.activities.map(act => {
                              const colors = CATEGORY_COLORS[act.category] || CATEGORY_COLORS.other;
                              let metadata = {};
                              try {
                                if (act.notes) {
                                  metadata = typeof act.notes === 'string' ? JSON.parse(act.notes) : act.notes;
                                }
                              } catch (e) {
                                // Fallback
                              }
                              const photo = metadata.photoUrl || getUnsplashFallback(metadata.placeTypes, act.category);
                              return (
                                <div key={act.id} className="group flex gap-4 p-4 bg-white rounded-2xl border border-gray-150 hover:shadow-[0_12px_24px_rgba(0,0,0,0.04)] hover:-translate-y-0.5 transition-all duration-300">
                                  {photo && (
                                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100 border border-gray-200/50">
                                      <img src={photo} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                                    </div>
                                  )}
                                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                                    <div>
                                      <div className="flex items-start justify-between gap-2">
                                        <p className="font-black text-gray-900 text-base leading-snug group-hover:text-primary-600 transition-colors">{act.activity_name}</p>
                                        {act.cost > 0 && (
                                          <span className="text-sm font-black text-accent-600 whitespace-nowrap pt-0.5">{formatCurrency(act.cost)}</span>
                                        )}
                                      </div>
                                      
                                      <div className="flex flex-wrap gap-2 mt-2 items-center">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${colors.bg} ${colors.text}`}>
                                          {act.category}
                                        </span>
                                        {act.time && <span className="text-xs text-gray-400 font-semibold bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100">{act.time}</span>}
                                        {metadata.rating && (
                                          <span className="inline-flex items-center gap-0.5 text-xs text-yellow-600 font-extrabold bg-yellow-50 px-2 py-0.5 rounded-md border border-yellow-100">
                                            <Star className="w-3 h-3 fill-yellow-600 text-yellow-600" /> {metadata.rating}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                    
                                    {metadata.address && (
                                      <p className="text-xs text-gray-400 font-medium truncate mt-2 max-w-[280px] md:max-w-md" title={metadata.address}>
                                        📍 {metadata.address}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="card divide-y divide-gray-100 bg-white border border-gray-150 rounded-[2rem] overflow-hidden shadow-soft">
                {(currentTrip.stops || []).map(stop => (
                  <div key={stop.id} className="p-6 hover:bg-gray-50/50 transition-colors">
                    <div className="flex items-center gap-3 mb-4">
                      <MapPin className="w-4 h-4 text-primary-500" />
                      <span className="font-bold text-gray-900 text-lg">{stop.city}, {stop.country}</span>
                      <span className="ml-auto text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full font-bold">{(stop.activities || []).length} activities</span>
                    </div>
                    <div className="space-y-2 ml-7">
                      {stop.activities?.map(act => (
                        <div key={act.id} className="flex items-center gap-3 py-1.5 text-sm text-gray-600">
                          <span className="text-base">{CATEGORY_ICONS_MAP[act.category]}</span>
                          <span className="font-medium text-gray-700">{act.activity_name}</span>
                          {act.cost > 0 && <span className="ml-auto text-accent-600 font-black">{formatCurrency(act.cost)}</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
