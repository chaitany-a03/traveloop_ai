import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, ArrowRight, Sparkles } from 'lucide-react';
import AppLayout from '../../components/layout/AppLayout';

export default function Dashboard() {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <AppLayout noPadding={true} fullScreen={true}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="w-full h-full flex flex-col bg-gray-900 overflow-hidden"
      >
        {/* Full-width Cinematic Hero */}
        <motion.div variants={itemVariants} className="relative w-full flex-1 overflow-hidden bg-gray-900 flex flex-col items-center justify-center py-4 md:py-6">
          {/* Advanced Animated Background Mesh */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-[-10%] left-[0%] w-[60%] h-[60%] bg-primary-600/40 rounded-full blur-[120px] mix-blend-screen animate-blob" />
            <div className="absolute top-[20%] right-[-10%] w-[70%] h-[70%] bg-accent-500/30 rounded-full blur-[140px] mix-blend-screen animate-blob animation-delay-2000" />
            <div className="absolute bottom-[-30%] left-[20%] w-[80%] h-[80%] bg-purple-600/40 rounded-full blur-[150px] mix-blend-screen animate-blob animation-delay-4000" />

            <div className="absolute inset-0 bg-[url('/travel-bg.png')] opacity-65 mix-blend-overlay bg-cover bg-center" />

            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(17,24,39,0.95) 0%, rgba(17,24,39,0.4) 12%, transparent 30%, rgba(17,24,39,0.3) 60%, rgba(17,24,39,0.75) 100%)' }} />

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

          <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-16 pt-2 pb-6 md:pb-10 flex flex-col items-center text-center justify-center flex-1">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 mb-3 sm:mb-4 shadow-2xl">
              <Sparkles className="w-4 h-4 text-accent-300 animate-pulse" />
              <span className="text-white text-sm font-bold tracking-widest uppercase">Intelligent Travel Assistant</span>
            </motion.div>

            <h1 className="text-6xl md:text-8xl font-black text-white font-display leading-[1.1] mb-2 sm:mb-4 tracking-tighter text-balance">
              Traveloop<span className="text-primary-500">.</span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-200 via-white to-primary-200 text-5xl md:text-7xl">
                Explore The World Smarter
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 font-medium max-w-3xl mb-4 sm:mb-6 text-balance leading-relaxed">
              Your next adventure powered by real-world intelligence. Generate highly personalized itineraries instantly using our AI engine.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-6 mt-1 sm:mt-2">
              <button onClick={() => navigate('/planner')} className="group relative px-8 py-5 rounded-2xl bg-white text-gray-900 font-bold text-lg hover:scale-105 transition-all shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] flex items-center gap-3 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-white via-primary-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <Sparkles className="w-6 h-6 text-primary-600 group-hover:rotate-12 transition-transform" />
                <span className="relative">Generate with AI</span>
              </button>
              <button onClick={() => navigate('/trips/create')} className="px-8 py-5 rounded-2xl text-lg font-bold text-white bg-gray-900 border border-gray-800 hover:bg-black transition-all hover:scale-105 flex items-center gap-3 shadow-xl">
                <Plus className="w-6 h-6" /> Manual Plan
              </button>
            </div>

            {/* AI Planner Spotlight */}
            <motion.div
              variants={itemVariants}
              className="group cursor-pointer relative w-full max-w-4xl mt-4 sm:mt-6 md:mt-8 text-left"
              onClick={() => navigate('/planner')}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary-600 via-purple-600 to-accent-500 rounded-3xl blur-xl opacity-40 group-hover:opacity-70 transition duration-700 animate-pulse-slow" />
              <div className="relative glass-panel rounded-3xl p-1.5 bg-gradient-to-br from-white/80 to-white/40">
                <div className="bg-white/70 backdrop-blur-2xl rounded-[1.25rem] p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-white/60 shadow-inner">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center shadow-glow shrink-0 group-hover:scale-110 transition-transform duration-500">
                      <Sparkles className="w-8 h-8 text-white animate-pulse" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black font-display text-gray-900 mb-1">AI Trip Planner</h3>
                      <p className="text-gray-600 text-base font-medium">Enter a destination and your travel mood. We'll instantly craft your perfect itinerary using real Google Places data.</p>
                    </div>
                  </div>
                  <div className="shrink-0 w-12 h-12 rounded-full bg-gray-900 text-white flex items-center justify-center group-hover:translate-x-2 transition-transform shadow-xl">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AppLayout>
  );
}
