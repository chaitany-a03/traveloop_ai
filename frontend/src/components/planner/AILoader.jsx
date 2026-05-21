import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Brain, MapPin, Zap, Globe, Star } from 'lucide-react';

const LOADING_STEPS = [
  { icon: Globe, text: 'Analyzing destination...', color: 'text-blue-400' },
  { icon: MapPin, text: 'Finding top attractions...', color: 'text-emerald-400' },
  { icon: Star, text: 'Scoring by ratings & popularity...', color: 'text-yellow-400' },
  { icon: Brain, text: 'Personalizing to your mood...', color: 'text-purple-400' },
  { icon: Zap, text: 'Optimizing your budget...', color: 'text-orange-400' },
  { icon: Sparkles, text: 'Building personalized itinerary...', color: 'text-pink-400' },
  { icon: Globe, text: 'Creating unforgettable experiences...', color: 'text-cyan-400' },
];

// Orbiting dot component
function OrbitDot({ angle, radius, duration, color }) {
  return (
    <motion.div
      className={`absolute w-2.5 h-2.5 rounded-full ${color}`}
      style={{ originX: '50%', originY: '50%' }}
      animate={{ rotate: 360 }}
      transition={{ duration, ease: 'linear', repeat: Infinity }}
    >
      <div
        className="w-2.5 h-2.5 rounded-full"
        style={{
          position: 'absolute',
          top: `calc(50% - ${radius}px - 5px)`,
          left: 'calc(50% - 5px)',
          transform: `rotate(${angle}deg) translateY(-${radius}px)`,
        }}
      />
    </motion.div>
  );
}

export default function AILoader({ destination }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Cycle through step messages
    const msgInterval = setInterval(() => {
      setStepIndex(i => (i + 1) % LOADING_STEPS.length);
    }, 900);

    // Progress bar
    const progInterval = setInterval(() => {
      setProgress(p => {
        if (p >= 95) { clearInterval(progInterval); return 95; }
        return p + Math.random() * 4;
      });
    }, 300);

    return () => { clearInterval(msgInterval); clearInterval(progInterval); };
  }, []);

  const CurrentIcon = LOADING_STEPS[stepIndex].icon;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        background: 'radial-gradient(ellipse at 30% 20%, #1e1b4b 0%, #0f0f1a 40%, #0a0a14 100%)',
      }}
    >
      {/* Ambient background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-96 h-96 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #6366f1, transparent)', top: '-10%', left: '-5%' }}
          animate={{ scale: [1, 1.2, 1], x: [0, 30, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute w-80 h-80 rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, #f97316, transparent)', bottom: '-5%', right: '-5%' }}
          animate={{ scale: [1, 1.3, 1], x: [0, -20, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />
        <motion.div
          className="absolute w-64 h-64 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #a855f7, transparent)', top: '40%', right: '15%' }}
          animate={{ scale: [1, 1.4, 1] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        />
      </div>

      {/* Main card */}
      <div className="relative z-10 flex flex-col items-center text-center px-8 max-w-lg w-full">

        {/* Animated ring + icon */}
        <div className="relative w-36 h-36 flex items-center justify-center mb-10">
          {/* Outer spinning ring */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              border: '2px solid transparent',
              background: 'linear-gradient(#0f0f1a, #0f0f1a) padding-box, linear-gradient(135deg, #6366f1, #f97316, #a855f7, #6366f1) border-box',
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 3, ease: 'linear', repeat: Infinity }}
          />
          {/* Middle ring */}
          <motion.div
            className="absolute w-24 h-24 rounded-full"
            style={{
              border: '1px solid transparent',
              background: 'linear-gradient(#0f0f1a, #0f0f1a) padding-box, linear-gradient(225deg, #22d3ee, #6366f1) border-box',
            }}
            animate={{ rotate: -360 }}
            transition={{ duration: 2, ease: 'linear', repeat: Infinity }}
          />
          {/* Center icon */}
          <motion.div
            className="relative z-10 w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Sparkles className="w-8 h-8 text-white" />
          </motion.div>
        </div>

        {/* Title */}
        <motion.h2
          className="text-3xl font-bold text-white font-display mb-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Generating Your Itinerary
        </motion.h2>
        {destination && (
          <motion.p
            className="text-indigo-300 text-lg font-medium mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            ✈️ {destination}
          </motion.p>
        )}

        {/* Rotating step message */}
        <div className="h-8 mb-8 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={stepIndex}
              initial={{ opacity: 0, y: 8, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -8, filter: 'blur(4px)' }}
              transition={{ duration: 0.35 }}
              className={`flex items-center gap-2.5 text-base font-medium ${LOADING_STEPS[stepIndex].color}`}
            >
              <CurrentIcon className="w-4.5 h-4.5 w-5 h-5 flex-shrink-0" />
              {LOADING_STEPS[stepIndex].text}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Progress bar */}
        <div className="w-full max-w-sm">
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{
                background: 'linear-gradient(90deg, #6366f1, #a855f7, #f97316)',
                backgroundSize: '200% 100%',
              }}
              animate={{ width: `${Math.min(progress, 100)}%`, backgroundPosition: ['0% 0%', '100% 0%'] }}
              transition={{ width: { duration: 0.5 }, backgroundPosition: { duration: 2, repeat: Infinity, ease: 'linear' } }}
            />
          </div>
          <p className="text-white/30 text-xs mt-2">{Math.round(progress)}% complete</p>
        </div>

        {/* Pulsing dots */}
        <div className="flex gap-1.5 mt-8">
          {[0, 1, 2, 3, 4].map(i => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-indigo-400"
              animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.15 }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
