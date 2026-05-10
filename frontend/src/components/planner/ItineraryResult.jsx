import { motion } from 'framer-motion';
import {
  MapPin, Calendar, DollarSign, Zap, Star, Clock, TrendingUp,
  Wallet, Target, BarChart2, Lightbulb, ChevronRight, CheckCircle2,
  Utensils, Sunrise, Sun, Sunset, Moon, Coffee
} from 'lucide-react';
import { formatCurrency } from '../../utils';

// ─── Time slot config ─────────────────────────────────────────────
const TIME_CONFIG = {
  'Morning':       { icon: Sunrise,  bg: 'from-amber-50 to-orange-50',  border: 'border-amber-200',  badge: 'bg-amber-100 text-amber-700',  dot: 'bg-amber-400' },
  'Late Morning':  { icon: Coffee,   bg: 'from-orange-50 to-yellow-50', border: 'border-orange-200', badge: 'bg-orange-100 text-orange-700', dot: 'bg-orange-400' },
  'Midday':        { icon: Utensils, bg: 'from-green-50 to-emerald-50', border: 'border-green-200',  badge: 'bg-green-100 text-green-700',  dot: 'bg-green-400' },
  'Afternoon':     { icon: Sun,      bg: 'from-blue-50 to-indigo-50',   border: 'border-blue-200',   badge: 'bg-blue-100 text-blue-700',   dot: 'bg-blue-400' },
  'Late Afternoon':{ icon: Sunset,   bg: 'from-purple-50 to-violet-50', border: 'border-purple-200', badge: 'bg-purple-100 text-purple-700',dot: 'bg-purple-400' },
  'Evening':       { icon: Moon,     bg: 'from-indigo-50 to-slate-50',  border: 'border-indigo-200', badge: 'bg-indigo-100 text-indigo-700',dot: 'bg-indigo-400' },
};
const DEFAULT_TIME = { icon: Clock, bg: 'from-gray-50 to-slate-50', border: 'border-gray-200', badge: 'bg-gray-100 text-gray-600', dot: 'bg-gray-400' };

// ─── Animation variants ───────────────────────────────────────────
const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 22 } },
};
const cardVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 16 },
  show:   { opacity: 1, scale: 1,    y: 0, transition: { type: 'spring', stiffness: 240, damping: 20 } },
};

// ─── Sub-components ───────────────────────────────────────────────

function InsightCard({ icon: Icon, label, value, sub, gradient, delay = 0 }) {
  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(0,0,0,0.1)' }}
      className="relative overflow-hidden rounded-2xl p-5 text-white"
      style={{ background: gradient }}
    >
      <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-white/10 -translate-y-8 translate-x-8" />
      <div className="relative z-10">
        <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center mb-3">
          <Icon className="w-5 h-5 text-white" />
        </div>
        <p className="text-white/70 text-xs font-semibold uppercase tracking-wider mb-1">{label}</p>
        <p className="text-2xl font-bold leading-none mb-1">{value}</p>
        {sub && <p className="text-white/60 text-xs">{sub}</p>}
      </div>
    </motion.div>
  );
}

function ActivityCard({ activity, isLast }) {
  const config = TIME_CONFIG[activity.time] || DEFAULT_TIME;
  const TimeIcon = config.icon;

  if (activity.isMealBreak) {
    return (
      <motion.div variants={itemVariants} className="flex items-center gap-3 py-2 px-4 bg-green-50 border border-green-100 rounded-xl">
        <div className="w-6 h-6 bg-green-200 rounded-full flex items-center justify-center flex-shrink-0">
          <Utensils className="w-3 h-3 text-green-700" />
        </div>
        <p className="text-sm text-green-700 font-medium">{activity.name}</p>
        <span className="ml-auto text-xs text-green-600 font-semibold">{formatCurrency(activity.estimatedCost)}</span>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ x: 4 }}
      className={`relative flex gap-4 p-4 bg-gradient-to-r ${config.bg} border ${config.border} rounded-2xl transition-all duration-200`}
    >
      {/* Timeline dot */}
      {!isLast && (
        <div className="absolute left-[26px] top-full h-3 w-0.5 bg-gray-200 z-0" />
      )}

      {/* Time icon */}
      <div className="flex-shrink-0 flex flex-col items-center gap-1 pt-0.5">
        <div className="w-8 h-8 bg-white rounded-xl shadow-sm flex items-center justify-center">
          <TimeIcon className="w-4 h-4 text-gray-600" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-2">
          <p className="font-semibold text-gray-900 text-sm leading-snug">{activity.name}</p>
          <span className="flex-shrink-0 text-sm font-bold text-gray-800">
            {activity.estimatedCost === 0 ? <span className="text-green-600">Free</span> : formatCurrency(activity.estimatedCost)}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${config.badge}`}>
            <TimeIcon className="w-3 h-3" /> {activity.time}
          </span>
          {activity.rating && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-yellow-50 border border-yellow-200 rounded-full text-xs font-semibold text-yellow-700">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" /> {activity.rating}
            </span>
          )}
          {activity.address && (
            <span className="inline-flex items-center gap-1 text-xs text-gray-400">
              <MapPin className="w-3 h-3" />
              <span className="truncate max-w-[140px]">{activity.address}</span>
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function DayCard({ day, index }) {
  return (
    <motion.div variants={cardVariants} className="card overflow-hidden">
      {/* Day header */}
      <div className="px-6 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center font-bold text-sm">
              {day.day}
            </div>
            <div>
              <p className="text-white/60 text-xs font-semibold uppercase tracking-wider">Day {day.day}</p>
              <p className="font-bold text-base font-display">{day.theme}</p>
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="text-white/60 text-xs">Day total</p>
          <p className="font-bold text-lg">{formatCurrency(day.dayTotal)}</p>
        </div>
      </div>

      {/* Activities */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-40px' }}
        className="p-5 space-y-3"
      >
        {(day.activities || []).map((activity, i) => (
          <ActivityCard
            key={i}
            activity={activity}
            isLast={i === day.activities.length - 1}
          />
        ))}
      </motion.div>
    </motion.div>
  );
}

function RecommendationCard({ text, index }) {
  const icons = [Lightbulb, CheckCircle2, Target, TrendingUp, Zap, Star];
  const Icon = icons[index % icons.length];
  const colors = [
    'bg-amber-50 border-amber-200 text-amber-700',
    'bg-emerald-50 border-emerald-200 text-emerald-700',
    'bg-violet-50 border-violet-200 text-violet-700',
    'bg-blue-50 border-blue-200 text-blue-700',
    'bg-orange-50 border-orange-200 text-orange-700',
    'bg-pink-50 border-pink-200 text-pink-700',
  ];
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ x: 6 }}
      className={`flex items-start gap-3 p-4 border rounded-2xl transition-all duration-200 ${colors[index % colors.length]}`}
    >
      <div className="w-8 h-8 rounded-xl bg-white/70 flex items-center justify-center flex-shrink-0">
        <Icon className="w-4 h-4" />
      </div>
      <p className="text-sm font-medium leading-relaxed">{text}</p>
    </motion.div>
  );
}

// ─── Main ItineraryResult component ──────────────────────────────

export default function ItineraryResult({ result, onRegenerate, onSave }) {
  const { summary, metadata, itinerary, recommendations } = result;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-8 pb-16"
    >
      {/* ── Hero Summary ─────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, type: 'spring' }}
        className="relative overflow-hidden rounded-3xl p-8 md:p-10 text-white"
        style={{ background: 'linear-gradient(135deg, #4338ca 0%, #6366f1 40%, #a855f7 100%)' }}
      >
        {/* Decorative blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-64 h-64 rounded-full bg-white/5 -top-16 -right-16" />
          <div className="absolute w-48 h-48 rounded-full bg-white/5 -bottom-12 -left-12" />
        </div>

        <div className="relative z-10">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 bg-white/20 backdrop-blur rounded-full text-xs font-bold uppercase tracking-wider">
                  ✨ AI-Generated Itinerary
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold font-display mb-2">{summary.destination}</h2>
              <p className="text-indigo-200 text-lg font-medium">{summary.tripStyle}</p>
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="bg-white/10 backdrop-blur rounded-2xl px-4 py-3 text-center">
                <p className="text-white/60 text-xs font-semibold uppercase">Days</p>
                <p className="text-2xl font-bold">{summary.days}</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-2xl px-4 py-3 text-center">
                <p className="text-white/60 text-xs font-semibold uppercase">Budget</p>
                <p className="text-2xl font-bold">{formatCurrency(summary.estimatedBudget)}</p>
              </div>
              <div className="bg-white/10 backdrop-blur rounded-2xl px-4 py-3 text-center">
                <p className="text-white/60 text-xs font-semibold uppercase">Attractions</p>
                <p className="text-2xl font-bold">{metadata.totalAttractions}</p>
              </div>
            </div>
          </div>

          {/* Budget status banner */}
          <div className="mt-6 inline-flex items-center gap-2 bg-white/15 backdrop-blur rounded-xl px-4 py-2.5">
            <Wallet className="w-4 h-4 text-white/80" />
            <span className="text-sm font-semibold text-white/90">{summary.budgetStatus}</span>
          </div>
        </div>
      </motion.div>

      {/* ── Insight Cards ─────────────────────────────────────── */}
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
          value={summary.budgetCategory}
          sub={`₹${summary.budgetInput?.toLocaleString()} total`}
          gradient="linear-gradient(135deg, #6366f1, #4338ca)"
        />
        <InsightCard
          icon={BarChart2}
          label="Daily Spend"
          value={formatCurrency(metadata.avgDailySpend)}
          sub="average per day"
          gradient="linear-gradient(135deg, #f97316, #ea580c)"
        />
        <InsightCard
          icon={Zap}
          label="Trip Intensity"
          value={metadata.tripIntensity.split(' ').slice(0, 2).join(' ')}
          sub={metadata.tripIntensity.split(' ').pop()}
          gradient="linear-gradient(135deg, #a855f7, #7c3aed)"
        />
        <InsightCard
          icon={Target}
          label="Attractions"
          value={metadata.totalAttractions}
          sub={`across ${summary.days} days`}
          gradient="linear-gradient(135deg, #22c55e, #16a34a)"
        />
      </motion.div>

      {/* ── Day-by-Day Itinerary ──────────────────────────────── */}
      <div>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3 mb-6"
        >
          <div className="w-10 h-10 bg-primary-100 rounded-2xl flex items-center justify-center">
            <Calendar className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 font-display">Your Itinerary</h3>
            <p className="text-gray-500 text-sm">{summary.days}-day personalized plan</p>
          </div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-20px' }}
          className="space-y-5"
        >
          {(itinerary || []).map((day, i) => (
            <DayCard key={day.day} day={day} index={i} />
          ))}
        </motion.div>
      </div>

      {/* ── Recommendations ───────────────────────────────────── */}
      {recommendations?.length > 0 && (
        <div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3 mb-5"
          >
            <div className="w-10 h-10 bg-amber-100 rounded-2xl flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 font-display">Smart Recommendations</h3>
              <p className="text-gray-500 text-sm">AI-generated tips for your trip</p>
            </div>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-20px' }}
            className="grid grid-cols-1 md:grid-cols-2 gap-3"
          >
            {recommendations.map((rec, i) => (
              <RecommendationCard key={i} text={rec} index={i} />
            ))}
          </motion.div>
        </div>
      )}

      {/* ── Action Buttons ────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex flex-col sm:flex-row gap-3 pt-2"
      >
        {onSave && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onSave}
            className="btn-primary flex-1 py-3 text-base"
          >
            <CheckCircle2 className="w-5 h-5" />
            Save to My Trips
          </motion.button>
        )}
        {onRegenerate && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onRegenerate}
            className="btn-secondary flex-1 py-3 text-base"
          >
            <Zap className="w-4 h-4" />
            Regenerate
          </motion.button>
        )}
      </motion.div>
    </motion.div>
  );
}
