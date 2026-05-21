import { motion } from 'framer-motion';
import {
  MapPin, Calendar, DollarSign, Zap, Star, Clock, TrendingUp,
  Wallet, Target, BarChart2, Lightbulb, ChevronRight, CheckCircle2,
  Utensils, Sunrise, Sun, Sunset, Moon, Coffee, Sparkles, ArrowRight, ArrowLeft
} from 'lucide-react';
import { formatCurrency, MOOD_CONFIG, MOOD_COVER_IMAGES } from '../../utils';

// ─── Time slot config (Sleek high-contrast gray/slate design) ───
const TIME_CONFIG = {
  'Morning': { icon: Sunrise, bg: 'bg-white', border: 'border-slate-200/85', badge: 'bg-slate-100 text-slate-800 border-slate-200/80', dot: 'bg-slate-600' },
  'Late Morning': { icon: Coffee, bg: 'bg-white', border: 'border-slate-200/85', badge: 'bg-slate-100 text-slate-800 border-slate-200/80', dot: 'bg-slate-600' },
  'Midday': { icon: Utensils, bg: 'bg-white', border: 'border-slate-200/85', badge: 'bg-slate-100 text-slate-800 border-slate-200/80', dot: 'bg-slate-600' },
  'Afternoon': { icon: Sun, bg: 'bg-white', border: 'border-slate-200/85', badge: 'bg-slate-100 text-slate-800 border-slate-200/80', dot: 'bg-slate-600' },
  'Late Afternoon': { icon: Sunset, bg: 'bg-white', border: 'border-slate-200/85', badge: 'bg-slate-100 text-slate-800 border-slate-200/80', dot: 'bg-slate-600' },
  'Evening': { icon: Moon, bg: 'bg-white', border: 'border-slate-200/85', badge: 'bg-slate-900 text-white border-slate-950 shadow-sm', dot: 'bg-slate-800' },
};
const DEFAULT_TIME = { icon: Clock, bg: 'bg-white', border: 'border-slate-200/85', badge: 'bg-slate-100 text-slate-600 border-slate-200/80', dot: 'bg-slate-400' };

// ─── Animation variants ───
const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 22 } },
};
const cardVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 16 },
  show: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 240, damping: 20 } },
};

// ─── InsightCard upgraded to premium colored container ───
function InsightCard({ icon: Icon, label, value, sub, colorClass, iconColorClass }) {
  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(0,0,0,0.06)' }}
      className={`relative overflow-hidden rounded-[2rem] p-6 bg-gradient-to-br ${colorClass} border border-slate-200/50 shadow-sm transition-all duration-300`}
    >
      <div className="absolute -top-12 -right-12 w-28 h-28 rounded-full bg-white/40 blur-[40px] pointer-events-none" />
      <div className="relative z-10 flex flex-col justify-between h-full">
        <div>
          <div className={`w-10 h-10 ${iconColorClass} rounded-2xl flex items-center justify-center mb-4 shadow-md`}>
            <Icon className="w-5 h-5" />
          </div>
          <p className="text-slate-450 text-[10px] font-black uppercase tracking-widest mb-1.5 leading-none">{label}</p>
          <p className="text-2xl font-black text-slate-800 tracking-tight leading-none mb-1.5">{value}</p>
        </div>
        {sub && <p className="text-slate-500 text-xs font-bold mt-1">{sub}</p>}
      </div>
    </motion.div>
  );
}

// ─── Mood-specific image pools ───
const CATEGORY_IMAGE_POOLS = {
  nightlife: [
    'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=400&q=80',
  ],
  food: [
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=400&q=80',
  ],
  culture: [
    'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1601999109332-542b18dbec57?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1544015759-1124e4d58481?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1534430480872-3498386e7856?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1586348943529-beaae6c28db9?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1566847438217-76e82d383f84?auto=format&fit=crop&w=400&q=80',
  ],
  nature: [
    'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=400&q=80',
  ],
  adventure: [
    'https://images.unsplash.com/photo-1533240332313-0db49b439ad3?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=400&q=80',
  ],
  family: [
    'https://images.unsplash.com/photo-1594879574456-c0ef9b8e8e2a?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1479767574301-85ccde4c9474?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1526512340740-9217d0159da9?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1565019011521-b0575cbb87de?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1525155673738-63c5a1e1ac50?auto=format&fit=crop&w=400&q=80',
  ],
  relaxation: [
    'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1562979314-bee7453e911c?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1510414696678-2415ad8474aa?auto=format&fit=crop&w=400&q=80',
  ],
  shopping: [
    'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=400&q=80',
  ],
  sightseeing: [
    'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1587135941948-670b381f08e9?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1603262110263-fb0112e7cc33?auto=format&fit=crop&w=400&q=80',
  ],
};

function resolveCategory(types = [], category = '', mood = '') {
  const ts = (types || []).join(' ').toLowerCase();
  const cat = (category || '').toLowerCase();
  const m = (mood || '').toLowerCase();

  if (ts.includes('night_club') || ts.includes('bar') || ts.includes('casino') || cat === 'nightlife' || m === 'nightlife') return 'nightlife';
  if (ts.includes('museum') || ts.includes('art_gallery') || ts.includes('church') || ts.includes('temple') || ts.includes('place_of_worship') || cat === 'culture' || m === 'culture') return 'culture';
  if (ts.includes('restaurant') || ts.includes('cafe') || ts.includes('bakery') || ts.includes('food') || cat === 'food' || m === 'food') return 'food';
  if (ts.includes('park') || ts.includes('natural_feature') || ts.includes('campground') || cat === 'nature' || m === 'nature') return 'nature';
  if (ts.includes('amusement_park') || ts.includes('zoo') || ts.includes('aquarium') || cat === 'adventure' || m === 'adventure') return 'adventure';
  if (ts.includes('spa') || ts.includes('wellness') || cat === 'relaxation' || m === 'relaxation') return 'relaxation';
  if (ts.includes('shopping_mall') || cat === 'shopping') return 'shopping';
  return 'sightseeing';
}

function hashStr(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) { h = (Math.imul(31, h) + str.charCodeAt(i)) | 0; }
  return Math.abs(h);
}

function getPoolImage(types = [], category = '', mood = '', name = '') {
  const cat = resolveCategory(types, category, mood);
  const pool = CATEGORY_IMAGE_POOLS[cat] || CATEGORY_IMAGE_POOLS.sightseeing;
  const idx = hashStr(name || cat) % pool.length;
  return pool[idx];
}

// ─── Day Header Config ───
const MOOD_DAY_CONFIG = {
  Nightlife: { emoji: '🌃' },
  Food: { emoji: '🍽️' },
  Culture: { emoji: '🏛️' },
  Nature: { emoji: '🌿' },
  Adventure: { emoji: '🏔️' },
  Family: { emoji: '👨‍👩‍👧' },
  Relaxation: { emoji: '🧘' },
  default: { emoji: '📍' },
};

function ActivityCard({ activity = {}, isLast, mood }) {
  const name = activity?.name || 'Activity';
  const estimatedCost = activity?.estimatedCost || 0;
  const time = activity?.time || 'Morning';
  const config = TIME_CONFIG[time] || DEFAULT_TIME;
  const TimeIcon = config.icon;
  const photo = activity?.photoUrl || getPoolImage(activity?.types, activity?.category, mood, name);
  const rating = activity?.rating;
  const address = activity?.address;

  if (activity?.isMealBreak) {
    return (
      <motion.div 
        variants={itemVariants} 
        className="flex items-center gap-3.5 py-3.5 px-4 bg-slate-50 border border-slate-200/80 rounded-2xl shadow-sm relative"
      >
        {!isLast && (
          <div className="absolute left-[32px] top-full h-4 w-0.5 bg-slate-200 z-0 pointer-events-none" />
        )}
        
        <div className="w-8 h-8 bg-slate-900 rounded-xl flex items-center justify-center flex-shrink-0 shadow-[0_2px_8px_rgba(0,0,0,0.15)] z-10">
          <Utensils className="w-4 h-4 text-white" />
        </div>
        {photo && (
          <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100 border border-slate-200/60 shadow-sm">
            <img src={photo} alt="" className="w-full h-full object-cover" />
          </div>
        )}
        <div className="min-w-0">
          <p className="text-sm text-slate-800 font-bold tracking-tight">{name}</p>
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Meal Break</span>
        </div>
        <span className="ml-auto text-sm font-black text-slate-900 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200/50">
          {estimatedCost === 0 ? 'Free' : formatCurrency(estimatedCost)}
        </span>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ x: 4, borderColor: '#4f46e5' }}
      className="group relative flex gap-4 p-4 bg-white border border-slate-150 rounded-2xl transition-all duration-300 shadow-sm hover:shadow-[0_12px_24px_rgba(0,0,0,0.04)]"
    >
      {/* Timeline connection line */}
      {!isLast && (
        <div className="absolute left-[32px] top-full h-6 w-0.5 bg-slate-200 z-0 pointer-events-none" />
      )}

      {/* Time icon bubble */}
      <div className="flex-shrink-0 flex flex-col items-center gap-1 pt-0.5 relative z-10">
        <div className="w-8 h-8 bg-slate-50 border border-slate-205 rounded-xl flex items-center justify-center shadow-inner">
          <TimeIcon className="w-4 h-4 text-slate-655" />
        </div>
      </div>

      {/* Activity photo */}
      {photo && (
        <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden flex-shrink-0 bg-slate-100 border border-slate-200/50 shadow-sm relative group">
          <img
            src={photo}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            loading="lazy"
          />
        </div>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <p className="font-black text-slate-900 text-base leading-snug tracking-tight group-hover:text-indigo-600 transition-colors">
              {name}
            </p>
            {estimatedCost > 0 && (
              <span className="flex-shrink-0 text-sm font-black text-indigo-650 bg-slate-50 border border-slate-200/80 px-2.5 py-1 rounded-lg">
                {formatCurrency(estimatedCost)}
              </span>
            )}
          </div>

          {/* Rating, Time badge, and Address */}
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${config.badge}`}>
              {time}
            </span>
            {rating && (
              <span className="inline-flex items-center gap-0.5 text-xs text-yellow-600 font-extrabold bg-yellow-50 px-2 py-0.5 rounded-md border border-yellow-100 shadow-sm">
                <Star className="w-3 h-3 fill-yellow-600 text-yellow-600" /> {rating}
              </span>
            )}
            {address && (
              <span className="inline-flex items-center gap-1 text-xs text-slate-400 font-semibold">
                <span className="truncate max-w-[150px] md:max-w-[200px]">📍 {address}</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function DayCard({ day = {}, index, mood }) {
  const moodCfg = MOOD_DAY_CONFIG[mood] || MOOD_DAY_CONFIG.default;
  const dayNum = day?.day || (index + 1);
  const theme = day?.theme || 'Theme';
  const dayTotal = day?.dayTotal || 0;
  const activities = day?.activities || [];

  return (
    <motion.div 
      variants={cardVariants} 
      className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-[0_12px_35px_rgba(0,0,0,0.03)] transition-all duration-300"
    >
      {/* Day header — Gorgeous dark slate-black gradient */}
      <div className="px-6 py-5 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 text-white flex items-center justify-between border-b border-slate-950 relative overflow-hidden">
        <div 
          className="absolute inset-0 opacity-5 mix-blend-overlay pointer-events-none" 
          style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/cubes.png')" }}
        />
        
        <div className="relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center font-bold text-base shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] backdrop-blur-md border border-white/10">
              {moodCfg.emoji}
            </div>
            <div>
              <p className="text-slate-400 text-[10px] font-extrabold uppercase tracking-widest">Day {dayNum}</p>
              <p className="font-extrabold text-lg font-display text-white tracking-tight">{theme}</p>
            </div>
          </div>
        </div>
        <div className="text-right relative z-10">
          <p className="text-slate-400 text-[10px] font-extrabold uppercase tracking-widest">Day total</p>
          <p className="font-black text-xl text-white tracking-tight">{formatCurrency(dayTotal)}</p>
        </div>
      </div>

      {/* Activities */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-40px' }}
        className="p-6 space-y-4 bg-slate-50/20"
      >
        {activities.map((activity, i) => (
          <ActivityCard
            key={i}
            activity={activity}
            isLast={i === activities.length - 1}
            mood={mood}
          />
        ))}
      </motion.div>
    </motion.div>
  );
}

function RecommendationCard({ text, index }) {
  const icons = [Lightbulb, CheckCircle2, Target, TrendingUp, Zap, Star];
  const Icon = icons[index % icons.length];
  
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ x: 6, borderColor: '#64748b' }}
      className="flex items-start gap-4 p-5 border border-slate-200 bg-white rounded-3xl transition-all duration-300 shadow-sm hover:shadow-[0_8px_30px_rgba(0,0,0,0.03)]"
    >
      <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center flex-shrink-0 shadow-[0_4px_12px_rgba(0,0,0,0.15)]">
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-bold text-slate-700 leading-relaxed">{text}</p>
      </div>
    </motion.div>
  );
}

// ─── Main ItineraryResult component ───
export default function ItineraryResult({ result, onRegenerate, onSave }) {
  const { 
    summary = {}, 
    metadata = {}, 
    itinerary = [], 
    recommendations = [] 
  } = result || {};

  const rawMood = summary?.mood || 'default';
  const mood = rawMood.toLowerCase();
  const moodCfg = MOOD_CONFIG[mood] || MOOD_CONFIG.default;
  
  const destination = summary?.destination || 'Destination';
  const tripStyle = summary?.tripStyle || 'Custom Journey';
  const days = summary?.days || 0;
  const estimatedBudget = summary?.estimatedBudget || 0;
  const budgetStatus = summary?.budgetStatus || 'Planned within budget';
  const budgetCategory = summary?.budgetCategory || 'Standard';
  const budgetInput = summary?.budgetInput || 0;

  const avgDailySpend = metadata?.avgDailySpend || 0;
  const tripIntensity = metadata?.tripIntensity || 'Moderate pacing';
  const totalAttractions = metadata?.totalAttractions || 0;

  // Resolve cover image from mood pool based on destination hash
  const pool = MOOD_COVER_IMAGES[mood] || MOOD_COVER_IMAGES.default;
  const seed = (destination || '').toString().split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const coverImage = pool[seed % pool.length];

  return (
    <div className="w-full flex flex-col min-h-screen bg-surface-50">
      {/* ── Full-bleed Hero: Cover image IS the header ── */}
      <div className="relative w-full h-[28rem] md:h-[34rem] overflow-hidden">
        {/* Cover Image Background */}
        <img
          src={coverImage}
          alt={destination}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Color Bleed Gradients */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/20 rounded-full blur-[100px] mix-blend-screen animate-blob" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-600/20 rounded-full blur-[120px] mix-blend-screen animate-blob animation-delay-2000" />
        </div>

        {/* Cinematic dark gradients for text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950/95 via-gray-900/40 to-gray-900/10" />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-surface-50 to-transparent" />

        {/* Top Action Bar — inside the cover overlay */}
        <div className="absolute top-0 left-0 right-0 z-20 p-5 md:p-8">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <button 
              onClick={onRegenerate} 
              className="px-4 py-2.5 rounded-full bg-black/35 backdrop-blur-xl text-white font-bold text-sm hover:bg-black/50 transition-all border border-white/10 flex items-center gap-2 shadow-lg"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Planner
            </button>
            <div className="flex gap-2.5">
              {onSave && (
                <button 
                  onClick={onSave} 
                  className="px-5 py-2.5 rounded-full bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-all border border-slate-950 flex items-center gap-2 shadow-lg"
                >
                  <CheckCircle2 className="w-4 h-4" /> Save Trip
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Bottom content overlay — title, badges, budget status */}
        <div className="absolute bottom-12 left-0 right-0 z-20">
          <div className="max-w-5xl mx-auto px-6 md:px-12">
            <div className="flex flex-wrap gap-2.5 mb-5">
              <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase text-white ${moodCfg?.badge || 'bg-primary-500/90'} backdrop-blur-xl border border-white/20 shadow-lg`}>
                <span className="text-sm">{moodCfg?.emoji || '📍'}</span> {moodCfg?.label || rawMood} Trip
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[10px] font-bold text-white bg-white/15 backdrop-blur-xl border border-white/15">
                <Calendar className="w-3.5 h-3.5" /> {days} Days
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[10px] font-bold text-white bg-white/15 backdrop-blur-xl border border-white/15">
                <MapPin className="w-3.5 h-3.5" /> {totalAttractions} attractions
              </span>
            </div>

            <h2 className="text-4xl md:text-6xl font-black font-display tracking-tight leading-[1.1] mb-3 text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
              {destination}
            </h2>
            <p className="text-white/75 text-sm md:text-base font-medium max-w-2xl mb-4 leading-relaxed">{tripStyle}</p>

            {/* Budget status banner */}
            <div className="inline-flex items-center gap-2 bg-black/30 border border-white/15 backdrop-blur-md rounded-2xl px-4 py-2 shadow-[0_8px_30px_rgba(0,0,0,0.15)]">
              <Wallet className="w-4 h-4 text-purple-300" />
              <span className="text-xs md:text-sm font-extrabold text-white tracking-tight">{budgetStatus}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Body — overlaps the hero slightly */}
      <div className="max-w-5xl mx-auto w-full px-6 md:px-12 -mt-6 relative z-20 pb-24 space-y-12">
        {/* Insight Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-30px' }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <InsightCard
            icon={Wallet}
            label="Budget Category"
            value={budgetCategory}
            sub={`₹${budgetInput?.toLocaleString()} total`}
            colorClass="from-purple-500/5 to-indigo-500/5 hover:border-purple-300 text-purple-600"
            iconColorClass="bg-purple-100 text-purple-600"
          />
          <InsightCard
            icon={BarChart2}
            label="Daily Spend"
            value={formatCurrency(avgDailySpend)}
            sub="average per day"
            colorClass="from-orange-500/5 to-amber-500/5 hover:border-orange-300 text-orange-600"
            iconColorClass="bg-orange-100 text-orange-600"
          />
          <InsightCard
            icon={Zap}
            label="Trip Intensity"
            value={tripIntensity ? tripIntensity.split(' ').slice(0, 2).join(' ') : 'Moderate'}
            sub={tripIntensity ? tripIntensity.split(' ').pop() : 'pacing'}
            colorClass="from-emerald-500/5 to-green-500/5 hover:border-emerald-300 text-emerald-600"
            iconColorClass="bg-emerald-100 text-emerald-600"
          />
          <InsightCard
            icon={Target}
            label="Attractions"
            value={totalAttractions}
            sub={`across ${days} days`}
            colorClass="from-blue-500/5 to-cyan-500/5 hover:border-blue-300 text-blue-600"
            iconColorClass="bg-blue-100 text-blue-600"
          />
        </motion.div>

        {/* Day-by-Day Itinerary */}
        <div className="space-y-6">
          <div className="flex items-center gap-3.5 mb-2">
            <div className="w-10 h-10 bg-slate-900 rounded-2xl flex items-center justify-center shadow-md">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900 font-display tracking-tight">Your Itinerary</h3>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">{days}-day personalized plan</p>
            </div>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-20px' }}
            className="space-y-6"
          >
            {itinerary.map((day, i) => (
              <DayCard key={day.day || i} day={day} index={i} mood={mood} />
            ))}
          </motion.div>
        </div>

        {/* Recommendations */}
        {recommendations?.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3.5 mb-2">
              <div className="w-10 h-10 bg-slate-900 rounded-2xl flex items-center justify-center shadow-md">
                <Lightbulb className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900 font-display tracking-tight">Smart Recommendations</h3>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">AI-generated tips for your trip</p>
              </div>
            </div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-20px' }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {recommendations.map((rec, i) => (
                <RecommendationCard key={i} text={rec} index={i} />
              ))}
            </motion.div>
          </div>
        )}

        {/* Bottom CTA Actions */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-200">
          {onSave && (
            <button
              onClick={onSave}
              className="flex-1 py-4 text-base font-extrabold text-white bg-indigo-600 hover:bg-indigo-700 border border-indigo-700 rounded-2xl shadow-lg flex items-center justify-center gap-2 transition-all duration-300"
            >
              <CheckCircle2 className="w-5 h-5 text-white" />
              Save to My Trips
            </button>
          )}
          {onRegenerate && (
            <button
              onClick={onRegenerate}
              className="flex-1 py-4 text-base font-extrabold text-slate-800 bg-white hover:bg-slate-50 border border-slate-200 shadow-sm rounded-2xl flex items-center justify-center gap-2 transition-all duration-300 hover:border-slate-400"
            >
              <Zap className="w-4 h-4 text-slate-650" />
              Back to Form
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
