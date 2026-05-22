import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import {
  Sparkles, Globe, Map, Navigation, Plane, Compass, Info, ArrowRight,
  Menu, X, Calendar, Layers, Cpu, Database, ChevronRight, Activity,
  CheckCircle2, DollarSign, Wallet, Star, MapPin, Search, ArrowUpRight, HelpCircle
} from 'lucide-react';
import useAuthStore from '../../store/authStore';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

// Curated high-resolution travel destination images
const mockLocations = [
  {
    id: 1,
    city: 'Kyoto',
    country: 'Japan',
    coords: { x: '75%', y: '45%' },
    gem: 'Fushimi Inari Forest Path',
    desc: 'An uncrowded hiking trail winding through secondary red torii gates, climbing the sacred forest mountain peak.',
    image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=600&q=80',
    type: 'Culture'
  },
  {
    id: 2,
    city: 'Rome',
    country: 'Italy',
    coords: { x: '48%', y: '38%' },
    gem: 'Appian Way Cypress Road',
    desc: 'Walk along the ancient cobblestone Roman highway lined with pine trees, catacombs, and historic ruins at sunset.',
    image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=600&q=80',
    type: 'History'
  },
  {
    id: 3,
    city: 'Reykjavik',
    country: 'Iceland',
    coords: { x: '42%', y: '20%' },
    gem: 'Seljavallalaug Valley Hot Pool',
    desc: 'A hidden geothermal outdoor pool nestled deep in a narrow volcanic valley, built in 1923.',
    image: 'https://images.unsplash.com/photo-1520769669658-f07657f5a307?auto=format&fit=crop&w=600&q=80',
    type: 'Nature'
  },
  {
    id: 4,
    city: 'Oaxaca',
    country: 'Mexico',
    coords: { x: '25%', y: '52%' },
    gem: 'Hierve el Agua Boiling Springs',
    desc: 'Natural calcified rock pools that resemble waterfalls overlooking the Southern Sierra Madre.',
    image: 'https://images.unsplash.com/photo-1518638150340-f706e86654de?auto=format&fit=crop&w=600&q=80',
    type: 'Adventure'
  }
];

// Mock mood itinerary mapping with relevant, travel-specific activities
const moodItineraries = {
  Adventure: [
    { day: 'Day 1', title: 'Mountain Pass Bike Descent', loc: 'Oaxaca, Mexico', cost: '₹3,700', category: 'Adventure', desc: 'Cycle down Sierra Norte forest pathways with local guides, stopping for firewood-cooked lunch in a rural village.' },
    { day: 'Day 2', title: 'Climbing & Waterfall Rappel', loc: 'Oaxaca Canyons', cost: '₹6,600', category: 'Adventure', desc: 'Descend sheer moss-covered canyon walls directly into cascading natural mountain pools.' },
    { day: 'Day 3', title: 'Zapotec Ancient Site Exploration', loc: 'Mitla Foothills', cost: '₹2,100', category: 'Adventure', desc: 'Explore historical high-altitude ruins via off-road trail runs with native historians.' }
  ],
  Nature: [
    { day: 'Day 1', title: 'Bamboo Grove Early Walk', loc: 'Kyoto, Japan', cost: 'Free', category: 'Nature', desc: 'Skip the crowds with a pre-dawn walking route through Arashiyama bamboo forest, listening to the morning rustle.' },
    { day: 'Day 2', title: 'Zen Meditation & Tea Ceremony', loc: 'Kyoto Zen Garden', cost: '₹990', category: 'Culture', desc: 'A private tea and Zen meditation session hosted by a temple monk in a quiet courtyard garden.' },
    { day: 'Day 3', title: 'Mountain Hot Spring Bath', loc: 'Kurama Valley', cost: '₹1,500', category: 'Nature', desc: 'Scenic mountain railway journey north of Kyoto to bathe in cedar wood outdoor hot springs.' }
  ],
  Food: [
    { day: 'Day 1', title: 'Morning Market Street Food', loc: 'Kyoto Market', cost: '₹2,500', category: 'Food', desc: 'Sample freshly grilled seafood, locally made soy-milk donuts, and skewered sweet rice cakes.' },
    { day: 'Day 2', title: 'Traditional Kaiseki Cooking Class', loc: 'Gion District', cost: '₹7,000', category: 'Food', desc: 'Learn the intricate principles of multi-course Japanese seasonal dining from local chefs.' },
    { day: 'Day 3', title: 'Hidden Tea Room Craft Tasting', loc: 'Higashiyama Alleys', cost: '₹1,800', category: 'Food', desc: 'Sample selected organic matcha varietals alongside hand-crafted seasonal wagashi pastries.' }
  ],
  Culture: [
    { day: 'Day 1', title: 'Ancient Roman Road Walkway', loc: 'Rome, Italy', cost: 'Free', category: 'History', desc: 'Walk along the historic cobblestones of the Appian Way under towering cypress trees at golden hour.' },
    { day: 'Day 2', title: 'Restoration Studio Private Visit', loc: 'Rome Center', cost: '₹4,100', category: 'Culture', desc: 'Observe painting and marble sculpture restoration up close in family-run studios spanning generations.' },
    { day: 'Day 3', title: 'Trastevere Sunset Food Tour', loc: 'Rome Alleys', cost: '₹5,400', category: 'Food', desc: 'Sample Rome\'s best cacio e pepe and local travel wines in tucked-away neighborhood cellars.' }
  ],
  Nightlife: [
    { day: 'Day 1', title: 'Secret Mezcal Speakeasy', loc: 'Oaxaca, Mexico', cost: '₹2,900', category: 'Nightlife', desc: 'Access an unmarked door in the old town to sample rare wild agaves hosted by generational distillers.' },
    { day: 'Day 2', title: 'Live Marimba Courtyard', loc: 'Oaxaca Center', cost: 'Free', category: 'Nightlife', desc: 'Enjoy lively traditional live percussion and brass bands playing under open-air market arches.' },
    { day: 'Day 3', title: 'Rooftop Lounge Firepit', loc: 'Oaxaca Heights', cost: '₹3,300', category: 'Nightlife', desc: 'Sip mezcal cocktails beside open fire pits overlooking the illuminated towers of Santo Domingo church.' }
  ]
};

export default function About() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [activeMood, setActiveMood] = useState('Adventure');
  const [selectedMapLocation, setSelectedMapLocation] = useState(mockLocations[0]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const containerRef = useRef(null);
  const [activeSection, setActiveSection] = useState('hero');
  const [exporting, setExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportStatus, setExportStatus] = useState('');

  const exportPitchDeck = async () => {
    if (exporting) return;
    setExporting(true);
    setExportProgress(0);
    setExportStatus('Initializing PDF generation...');

    const originalScroll = window.scrollY;
    const sections = [
      { id: 'hero', name: 'Traveloop Hero' },
      { id: 'problems', name: 'Problem Statement' },
      { id: 'solution', name: 'Reimagining Travel' },
      { id: 'ai-engine', name: 'AI Smart Itinerary Engine' },
      { id: 'maps', name: 'Google Maps Intelligence' },
      { id: 'booking', name: 'Stay & Transit Bookings' },
      { id: 'showcase', name: 'AI Travel Planning Dashboard' },
      { id: 'tech', name: 'Modular Architecture' },
      { id: 'future', name: 'Future Roadmap' },
      { id: 'cta', name: 'Call To Action' }
    ];

    try {
      let pdf = null;

      for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        const el = document.getElementById(section.id);
        
        if (!el) {
          console.warn(`Section with ID ${section.id} not found.`);
          continue;
        }

        // Update status and progress
        setExportStatus(`Capturing Slide ${i + 1} of ${sections.length}: ${section.name}...`);
        setExportProgress(Math.round((i / sections.length) * 100));

        // Scroll the element into view so Framer Motion / animations trigger and load
        el.scrollIntoView({ behavior: 'auto', block: 'start' });
        // Wait 500ms to allow layout adjustment and any entry animations to complete
        await new Promise(resolve => setTimeout(resolve, 500));

        // Capture section
        const canvas = await html2canvas(el, {
          scale: 2, // 2x high resolution
          useCORS: true,
          allowTaint: false,
          backgroundColor: '#020617', // Dark slate background to match Traveloop theme
          logging: false,
          ignoreElements: (element) => {
            // Exclude anything with class 'export-ignore'
            return element.classList.contains('export-ignore');
          }
        });

        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        const width = canvas.width;
        const height = canvas.height;

        if (i === 0) {
          // Initialize jsPDF with the exact canvas dimensions
          pdf = new jsPDF({
            orientation: width > height ? 'l' : 'p',
            unit: 'px',
            format: [width, height]
          });
        } else {
          pdf.addPage([width, height], width > height ? 'l' : 'p');
        }

        pdf.addImage(imgData, 'JPEG', 0, 0, width, height);
      }

      if (pdf) {
        setExportStatus('Finalizing & downloading presentation...');
        setExportProgress(100);
        await new Promise(resolve => setTimeout(resolve, 600));
        pdf.save('Traveloop_Pitch_Deck.pdf');
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate Pitch Deck. Please try again.');
    } finally {
      // Restore scroll and reset state
      window.scrollTo(0, originalScroll);
      setExporting(false);
    }
  };

  // Parallax effects
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const heroTextY = useTransform(scrollYProgress, [0, 0.2], ["0%", "45%"]);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'problems', 'solution', 'ai-engine', 'maps', 'booking', 'showcase', 'tech', 'future'];
      const scrollPos = window.scrollY + 200;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el && scrollPos >= el.offsetTop && scrollPos < el.offsetTop + el.offsetHeight) {
          setActiveSection(section);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  // Rendering the sticky public navbar (styled as premium glassmorphic dark-bar)
  const renderNavbar = () => (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/40 backdrop-blur-xl border-b border-white/10 px-6 py-4 shadow-lg text-white transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/dashboard')}>
          <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-xl border border-white/10">
            <Plane className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-black font-display tracking-tight text-white">
            Traveloop<span className="text-primary-500">.</span>
          </span>
        </div>

        {/* Desktop Nav Items */}
        <div className="hidden lg:flex items-center gap-8">
          {[
            { id: 'hero', label: 'Intro' },
            { id: 'problems', label: 'Why Us' },
            { id: 'solution', label: 'Our Solution' },
            { id: 'ai-engine', label: 'AI Engine' },
            { id: 'maps', label: 'Maps & Gems' },
            { id: 'tech', label: 'Tech Stack' },
            { id: 'future', label: 'Roadmap' },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`text-xs font-black tracking-widest transition-colors uppercase ${
                activeSection === item.id ? 'text-primary-400 font-extrabold' : 'text-gray-350 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Desktop Right Actions */}
        <div className="hidden lg:flex items-center gap-4">
          <button
            onClick={exportPitchDeck}
            disabled={exporting}
            className="px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/15 text-white rounded-xl text-sm font-bold shadow-md hover:scale-105 transition-all flex items-center gap-2 export-ignore"
          >
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span>Export Pitch Deck</span>
          </button>
          {isAuthenticated ? (
            <button
              onClick={() => navigate('/dashboard')}
              className="px-5 py-2.5 bg-primary-600 hover:bg-primary-500 text-white rounded-xl text-sm font-bold shadow-md hover:scale-105 transition-all border border-white/10"
            >
              Go to Dashboard
            </button>
          ) : (
            <>
              <button onClick={() => navigate('/login')} className="text-sm font-bold text-gray-300 hover:text-white transition-colors">
                Sign In
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="px-5 py-2.5 bg-primary-600 hover:bg-primary-500 text-white rounded-xl text-sm font-bold shadow-md hover:scale-105 transition-all border border-white/10"
              >
                Start Planning
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden text-gray-300 hover:text-white p-2">
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Dropdown Nav */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden mt-4 pt-4 border-t border-white/10 flex flex-col gap-4 pb-4"
          >
            {[
              { id: 'hero', label: 'Intro' },
              { id: 'problems', label: 'Why Us' },
              { id: 'solution', label: 'Our Solution' },
              { id: 'ai-engine', label: 'AI Engine' },
              { id: 'maps', label: 'Maps & Gems' },
              { id: 'tech', label: 'Tech Stack' },
              { id: 'future', label: 'Roadmap' },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`text-left text-xs font-bold tracking-widest transition-colors py-2 uppercase ${
                  activeSection === item.id ? 'text-primary-400' : 'text-gray-350 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
            <div className="h-px bg-white/10 my-2" />
            
            <button
              onClick={exportPitchDeck}
              disabled={exporting}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-white/5 hover:bg-white/10 border border-white/15 text-white rounded-xl font-bold text-sm shadow-md export-ignore"
            >
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span>Export Pitch Deck</span>
            </button>
            <div className="h-px bg-white/10 my-1" />

            {isAuthenticated ? (
              <button onClick={() => navigate('/dashboard')} className="w-full text-center py-2.5 bg-primary-600 text-white rounded-xl font-bold border border-white/10 shadow-md">
                Go to Dashboard
              </button>
            ) : (
              <div className="flex flex-col gap-3">
                <button onClick={() => navigate('/login')} className="w-full text-center py-2.5 border border-white/10 text-gray-300 rounded-xl font-bold bg-white/5 hover:bg-white/10">
                  Sign In
                </button>
                <button onClick={() => navigate('/signup')} className="w-full text-center py-2.5 bg-primary-600 text-white rounded-xl font-bold border border-white/10 shadow-md">
                  Start Free
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );

  // Rendering the main page body contents (transparent with glassmorphic cards)
  const renderContent = () => (
    <>
      {/* SECTION 1 — CINEMATIC HERO (Featuring ocean waves, rocking boats, gliding plane, and postcard collage) */}
      <section
        id="hero"
        className="relative min-h-[95vh] flex items-center justify-center overflow-hidden pt-28 pb-32"
        style={{
          background: 'linear-gradient(to bottom, #072F4F 0%, #0A4D68 60%, #020617 100%)'
        }}
      >
        {/* Blended Travel Background Image */}
        <img 
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80"
          alt=""
          className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0 mix-blend-overlay opacity-65"
          crossOrigin="anonymous"
          style={{ 
            maskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)'
          }}
        />

        {/* Floating background mesh blobs strictly confined to the Hero section */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[5%] left-[5%] w-[80%] h-[60%] bg-cyan-500/30 rounded-full blur-[120px] mix-blend-screen animate-blob" />
          <div className="absolute top-[25%] right-[5%] w-[70%] h-[55%] bg-teal-400/25 rounded-full blur-[120px] mix-blend-screen animate-blob animation-delay-2000" />
        </div>

        {/* Ocean Waves & Sailing Boats */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          {/* Back Wave */}
          <svg className="ocean-wave-layer ocean-wave-back" height="120" viewBox="0 0 2400 120" preserveAspectRatio="none">
            <path d="M0,55 C100,25 250,80 450,50 C650,20 750,85 950,55 C1150,25 1250,80 1450,50 C1650,20 1750,85 1950,55 C2150,25 2250,80 2400,50 L2400,120 L0,120 Z" fill="rgba(255,255,255,0.28)" />
          </svg>

          {/* Mid Wave */}
          <svg className="ocean-wave-layer ocean-wave-mid" height="100" viewBox="0 0 2400 100" preserveAspectRatio="none">
            <path d="M0,40 C180,62 380,18 600,40 C820,62 1020,18 1200,42 C1380,64 1580,20 1800,40 C2020,62 2220,18 2400,40 L2400,100 L0,100 Z" fill="rgba(255,255,255,0.22)" />
          </svg>

          {/* Sailing Boats - rocking & drifting */}
          <div className="hero-boat hero-boat--1">
            <div className="hero-boat-inner">
              <svg width="140" height="110" viewBox="0 0 140 110" fill="none">
                <path d="M15,80 Q20,100 70,100 Q120,100 125,80 L115,75 L25,75 Z" fill="rgba(255,255,255,0.9)" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
                <rect x="50" y="65" width="30" height="14" rx="3" fill="rgba(255,255,255,0.7)" />
                <line x1="68" y1="12" x2="68" y2="75" stroke="rgba(255,255,255,0.85)" strokeWidth="2.5" />
                <path d="M70,15 L70,70 L115,70 Z" fill="rgba(255,255,255,0.75)" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
                <path d="M66,15 L66,60 L28,60 Z" fill="rgba(255,255,255,0.55)" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
                <path d="M68,12 L68,5 L80,8.5 L68,12 Z" fill="rgba(249,115,22,0.8)" />
                <circle cx="42" cy="82" r="3" fill="rgba(56,189,248,0.5)" />
                <circle cx="55" cy="82" r="3" fill="rgba(56,189,248,0.5)" />
                <circle cx="85" cy="82" r="3" fill="rgba(56,189,248,0.5)" />
                <circle cx="98" cy="82" r="3" fill="rgba(56,189,248,0.5)" />
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
                <path d="M68,15 L68,8 L78,11.5 L68,15 Z" fill="rgba(249,115,22,0.6)" />
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
                <path d="M68,14 L68,6 L79,10 L68,14 Z" fill="rgba(249,115,22,0.7)" />
              </svg>
            </div>
          </div>

          {/* Front Wave */}
          <svg className="ocean-wave-layer ocean-wave-front" height="90" viewBox="0 0 2400 90" preserveAspectRatio="none">
            <path d="M0,30 C200,52 400,10 600,32 C800,54 1000,12 1200,32 C1400,54 1600,12 1800,32 C2000,54 2200,12 2400,30 L2400,90 L0,90 Z" fill="rgba(255,255,255,0.32)" />
          </svg>

          {/* Gliding Commercial Plane */}
          <motion.div
            animate={{ 
              x: ['-10vw', '110vw'],
              y: ['10vh', '3vh', '15vh', '8vh'],
              rotate: [10, 5, 12, 10]
            }}
            transition={{ 
              duration: 25, 
              repeat: Infinity, 
              ease: 'linear'
            }}
            className="absolute top-12 left-0 pointer-events-none z-10 opacity-40"
          >
            <Plane className="w-12 h-12 text-white rotate-90" />
          </motion.div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full py-16">
          <motion.div
            style={{ y: heroTextY }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7 space-y-6 text-center lg:text-left"
          >
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">
              <Sparkles className="w-4 h-4 text-accent-300 animate-pulse" />
              <span className="text-white text-xs font-bold tracking-widest uppercase">Intelligent Travel Assistant</span>
            </motion.div>

            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[1.05] text-white font-display">
              Traveloop<span className="text-primary-500">.</span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-400 to-pink-400 text-4xl md:text-6xl">
                Explore The World Smarter
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto lg:mx-0 font-medium leading-relaxed">
              “Plan Smarter • Discover More • Travel Better”
              <br />
              Create beautiful itineraries, manage budgets, and share your adventures. Generate highly personalized schedules instantly using our engine.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <button
                onClick={() => navigate(isAuthenticated ? '/planner' : '/signup')}
                className="w-full sm:w-auto group relative px-8 py-4 bg-white text-gray-900 hover:scale-105 hover:bg-gray-50 font-bold rounded-2xl shadow-[0_0_40px_rgba(255,255,255,0.15)] transition-all flex items-center justify-center gap-3 overflow-hidden"
              >
                <Sparkles className="w-5 h-5 text-primary-600 group-hover:rotate-12 transition-transform" />
                <span>Generate with AI</span>
              </button>
              <button
                onClick={() => scrollToSection('problems')}
                className="w-full sm:w-auto px-8 py-4 bg-black/40 hover:bg-black/60 text-white font-bold rounded-2xl border border-white/10 backdrop-blur-md transition-all hover:scale-105 flex items-center justify-center gap-2"
              >
                Explore Storytelling <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>

          {/* RIGHT SIDE: COLLAGE OF PREMIUM GLASS TRAVEL CARDS */}
          <div className="lg:col-span-5 relative flex items-center justify-center min-h-[450px]">
            <div className="relative w-full max-w-[400px] h-[400px] flex items-center justify-center">
              
              {/* Background Glow */}
              <div className="absolute w-72 h-72 bg-gradient-to-tr from-primary-500/20 to-accent-500/15 rounded-full blur-3xl opacity-60 animate-pulse" />

              {/* Card 1: Tropical Island */}
              <motion.div
                whileHover={{ y: -6, scale: 1.02 }}
                initial={{ opacity: 0, y: 40, rotate: -6 }}
                animate={{ opacity: 1, y: 0, rotate: -6 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="absolute top-2 left-0 bg-white/10 backdrop-blur-xl border border-white/20 p-3 rounded-[2rem] shadow-2xl max-w-[220px] z-20 cursor-pointer text-white"
              >
                <div className="relative rounded-[1.5rem] overflow-hidden h-36 border border-white/10">
                  <img
                    src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=350&h=250&q=80"
                    alt="Island paradise"
                    className="w-full h-full object-cover"
                    crossOrigin="anonymous"
                  />
                  <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-full text-[9px] font-black text-white uppercase tracking-wider">
                    Islands
                  </div>
                </div>
                <div className="pt-3 pb-1">
                  <div className="flex items-center gap-1 mb-1 text-gray-300">
                    <MapPin className="w-3 h-3 text-accent-400" />
                    <span className="text-[9px] font-bold uppercase tracking-wider">Bora Bora, Polynesia</span>
                  </div>
                  <p className="text-sm font-black text-white leading-tight">Crystal Clear Lagoons</p>
                </div>
              </motion.div>

              {/* Card 2: Sailing Boat near Coast */}
              <motion.div
                whileHover={{ y: -6, scale: 1.02 }}
                initial={{ opacity: 0, y: 40, rotate: 6 }}
                animate={{ opacity: 1, y: 0, rotate: 6 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="absolute bottom-2 right-0 bg-white/10 backdrop-blur-xl border border-white/20 p-3 rounded-[2rem] shadow-2xl max-w-[220px] z-30 cursor-pointer text-white"
              >
                <div className="relative rounded-[1.5rem] overflow-hidden h-36 border border-white/10">
                  <img
                    src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=350&h=250&q=80"
                    alt="Wooden Sailboat"
                    className="w-full h-full object-cover"
                    crossOrigin="anonymous"
                  />
                  <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-full text-[9px] font-black text-white uppercase tracking-wider">
                    Sailing
                  </div>
                </div>
                <div className="pt-3 pb-1">
                  <div className="flex items-center gap-1 mb-1 text-gray-300">
                    <Compass className="w-3 h-3 text-primary-400" />
                    <span className="text-[9px] font-bold uppercase tracking-wider">Amalfi Coast, Italy</span>
                  </div>
                  <p className="text-sm font-black text-white leading-tight">Generational Sailing</p>
                </div>
              </motion.div>

              {/* Card 3: Boarding Ticket */}
              <motion.div
                whileHover={{ y: -6, scale: 1.02 }}
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="absolute -bottom-6 left-12 bg-white/15 backdrop-blur-xl border border-white/25 p-5 rounded-[2rem] shadow-2xl w-[260px] text-white z-40 cursor-pointer"
              >
                <div className="flex items-center justify-between border-b border-white/15 pb-3 mb-3">
                  <div className="flex items-center gap-2">
                    <Plane className="w-4 h-4 text-accent-400 rotate-45" />
                    <span className="text-[10px] font-black uppercase tracking-wider">Boarding Pass</span>
                  </div>
                  <span className="text-[9px] font-bold text-accent-300">Active Planner Route</span>
                </div>

                <div className="flex justify-between items-center text-center my-2">
                  <div>
                    <p className="text-lg font-black text-white">HNL</p>
                    <p className="text-[9px] text-white/60">Honolulu</p>
                  </div>
                  <div className="flex-1 flex flex-col items-center px-4 relative">
                    <div className="w-full h-px border-t border-dashed border-white/25 my-1 relative">
                      <motion.div
                        animate={{ left: ['0%', '100%'] }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                        className="absolute -top-1.5 w-3 h-3 text-accent-400"
                        style={{ left: 0 }}
                      >
                        <Plane className="w-3 h-3 rotate-90" />
                      </motion.div>
                    </div>
                    <p className="text-[8px] text-white/55 font-bold">8h 45m Direct</p>
                  </div>
                  <div>
                    <p className="text-lg font-black text-white">FCO</p>
                    <p className="text-[9px] text-white/60">Rome</p>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-white/15 mt-3 text-[10px] font-bold text-white/70">
                  <span>Seat 12A • First Class</span>
                  <span className="text-accent-400 font-black">₹1,02,400</span>
                </div>
              </motion.div>

              {/* Floating tags */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-6 right-6 bg-white/15 backdrop-blur-xl border border-white/20 px-3.5 py-1.5 rounded-full shadow-lg flex items-center gap-2 z-50 text-white"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-[10px] font-black uppercase tracking-wider">Escape Routine</span>
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="absolute top-1/2 -left-12 bg-white/15 backdrop-blur-xl border border-white/20 px-3.5 py-1.5 rounded-full shadow-lg flex items-center gap-2 z-50 text-white"
              >
                <span className="w-2 h-2 rounded-full bg-accent-400" />
                <span className="text-[10px] font-black uppercase tracking-wider">Island Hopper</span>
              </motion.div>

            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-400">
          <span className="text-xs font-semibold uppercase tracking-widest">Scroll Down</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-6 bg-white/20 rounded-full relative"
          >
            <div className="absolute top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-primary-400 rounded-full" />
          </motion.div>
        </div>
      </section>

      {/* SECTION 2 — PROBLEMS (Unified Glassmorphic style with spinning compass) */}
      <section id="problems" className="py-28 bg-transparent relative overflow-hidden border-t border-white/5">
        {/* Blended Travel Background Image */}
        <img 
          src="https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1920&q=80"
          alt=""
          className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0 opacity-20"
          crossOrigin="anonymous"
          style={{ 
            maskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)'
          }}
        />

        {/* Drifting Clouds Background Animation */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 opacity-30">
          <motion.div
            animate={{ x: ['-200px', 'calc(100vw + 200px)'] }}
            transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
            className="absolute top-[8%] text-white"
          >
            <svg width="120" height="45" viewBox="0 0 100 40" fill="currentColor">
              <path d="M20,30 Q30,15 45,22 Q55,10 70,18 Q85,15 90,30 Z" />
            </svg>
          </motion.div>
        </div>

        {/* Spinning Compass Background Animation */}
        <div className="absolute right-[-100px] top-[10%] w-[350px] h-[350px] opacity-[0.25] pointer-events-none z-0">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
            className="w-full h-full text-white"
          >
            <Compass className="w-full h-full" strokeWidth={1} />
          </motion.div>
        </div>

        {/* Section wave separator line */}
        <div className="absolute bottom-0 left-0 right-0 h-12 pointer-events-none overflow-hidden z-10 opacity-[0.28] text-white">
          <svg className="w-[200%] h-full animate-waveFlow" viewBox="0 0 2400 60" preserveAspectRatio="none" style={{ animationDuration: '24s' }}>
            <path d="M0,30 C300,10 600,50 900,30 C1200,10 1500,50 1800,30 C2100,10 2400,50 2700,30 L2700,60 L0,60 Z" fill="currentColor" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <span className="text-xs font-black text-accent-400 uppercase tracking-widest font-display">The Traveler's Dilemma</span>
            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">More than 1.4 billion people travel every year...</h2>
            <p className="text-gray-300 text-lg">Yet, the process of researching, planning, and scheduling journeys is fundamentally broken and scattered.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left: Stats cards in glass style */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-6">
              {[
                { label: 'Travelers Annually', value: '1.4B+', desc: 'Navigating crowded, commercial paths.', color: 'text-primary-400' },
                { label: 'Planning Time Spent', value: '80h+', desc: 'Reading endless scattered articles.', color: 'text-accent-400' },
                { label: 'Missed Hidden Gems', value: '85%', desc: 'Missing authentic local spots.', color: 'text-purple-400' },
                { label: 'Generic Lists', value: '92%', desc: 'Receiving copy-paste itineraries.', color: 'text-emerald-400' }
              ].map((stat, idx) => (
                <div key={idx} className="bg-slate-950/40 border border-white/10 backdrop-blur-xl rounded-3xl p-6 shadow-2xl hover:-translate-y-1 transition-transform duration-300">
                  <span className={`text-3xl md:text-4xl font-black ${stat.color} font-display`}>{stat.value}</span>
                  <p className="text-xs font-black text-white uppercase mt-2 tracking-wider">{stat.label}</p>
                  <p className="text-[11px] text-gray-300 mt-1 leading-relaxed">{stat.desc}</p>
                </div>
              ))}
            </div>

            {/* Right: Frustration list cards in glass style */}
            <div className="lg:col-span-7 space-y-6">
              {[
                { title: 'Commercialized Recommendations', desc: 'Typical algorithms serve standard, sponsored tourist traps rather than actual local heritage highlights, creating uniform travel itineraries.', label: 'Sponsored Planners' },
                { title: 'Fragmented Planning Search', desc: 'Organizing routes forces you to jump between dozens of tabs, hotels, flight calendars, map pins, and checklist sheets, causing massive cognitive friction.', label: 'Tool Fatigue' },
                { title: 'Inability to Locate True Hidden Gems', desc: 'Generational restaurants, quiet shrines, and scenic viewpoints are buried beneath commercially optimized search results.', label: 'Hidden Spots' },
                { title: 'Rigid & Static Timelines', desc: 'Itinerary documents are static and do not adapt dynamically to local weather changes, transit delays, or physical exhaustion.', label: 'Zero Flexibility' }
              ].map((prob, idx) => (
                <motion.div
                  key={idx}
                  viewport={{ once: true }}
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1, duration: 0.6 }}
                  className="group flex gap-5 bg-slate-950/40 hover:bg-slate-950/60 border border-white/10 backdrop-blur-xl shadow-2xl p-6 rounded-3xl transition-all text-white"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 group-hover:bg-primary-500/20 flex items-center justify-center flex-shrink-0 text-accent-400 font-bold font-display transition-colors">
                    0{idx + 1}
                  </div>
                  <div>
                    <span className="text-[9px] font-black text-primary-400 uppercase tracking-widest">{prob.label}</span>
                    <h3 className="text-base font-bold text-white mt-0.5 group-hover:text-primary-400 transition-colors">{prob.title}</h3>
                    <p className="text-xs text-gray-350 mt-1.5 leading-relaxed">{prob.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 3 — SOLUTION (Pipeline with floating clouds and glowing neon currents) */}
      <section id="solution" className="py-28 bg-transparent relative overflow-hidden border-t border-white/5">
        {/* Blended Travel Background Image */}
        <img 
          src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1920&q=80"
          alt=""
          className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0 opacity-20"
          crossOrigin="anonymous"
          style={{ 
            maskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)'
          }}
        />

        {/* Floating Clouds Background Animation */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 opacity-30">
          <motion.div
            animate={{ x: ['-200px', 'calc(100vw + 200px)'] }}
            transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
            className="absolute top-[10%] text-white"
          >
            <svg width="100" height="40" viewBox="0 0 100 40" fill="currentColor">
              <path d="M20,30 Q30,15 45,22 Q55,10 70,18 Q85,15 90,30 Z" />
            </svg>
          </motion.div>
          <motion.div
            animate={{ x: ['calc(100vw + 200px)', '-200px'] }}
            transition={{ duration: 65, repeat: Infinity, ease: 'linear' }}
            className="absolute bottom-[20%] text-white"
          >
            <svg width="140" height="50" viewBox="0 0 100 40" fill="currentColor">
              <path d="M20,30 Q30,15 45,22 Q55,10 70,18 Q85,15 90,30 Z" />
            </svg>
          </motion.div>
        </div>

        {/* Sailing boat rocking & drifting */}
        <div className="hero-boat hero-boat--1 opacity-70">
          <div className="hero-boat-inner">
            <svg width="120" height="95" viewBox="0 0 140 110" fill="none">
              <path d="M15,80 Q20,100 70,100 Q120,100 125,80 L115,75 L25,75 Z" fill="rgba(255,255,255,0.9)" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
              <line x1="68" y1="12" x2="68" y2="75" stroke="rgba(255,255,255,0.85)" strokeWidth="2.5" />
              <path d="M70,15 L70,70 L115,70 Z" fill="rgba(255,255,255,0.75)" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
              <path d="M68,12 L68,5 L80,8.5 L68,12 Z" fill="rgba(249,115,22,0.8)" />
            </svg>
          </div>
        </div>

        {/* Section wave separator line */}
        <div className="absolute bottom-0 left-0 right-0 h-12 pointer-events-none overflow-hidden z-10 opacity-[0.28] text-white">
          <svg className="w-[200%] h-full animate-waveFlow" viewBox="0 0 2400 60" preserveAspectRatio="none" style={{ animationDuration: '28s', animationDirection: 'reverse' }}>
            <path d="M0,30 C300,10 600,50 900,30 C1200,10 1500,50 1800,30 C2100,10 2400,50 2700,30 L2700,60 L0,60 Z" fill="currentColor" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <span className="text-xs font-black text-primary-400 uppercase tracking-widest font-display font-black">Reimagining Travel</span>
            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">How Traveloop Solves The Puzzle</h2>
            <p className="text-gray-300 text-lg">We organize trip parameters into a clean, structured pipeline, creating dynamic timelines centered around real-world geography.</p>
          </div>

          {/* Dynamic Pipeline Chart */}
          <div className="relative w-full rounded-3xl border border-white/10 bg-slate-950/40 p-8 md:p-12 mb-20 overflow-hidden shadow-2xl">
            {/* Background Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-4 gap-8 items-stretch">
              
              {/* Node 1: Input */}
              <div className="flex flex-col justify-between bg-slate-900/40 border border-white/15 rounded-2xl p-6 shadow-lg text-white">
                <div>
                  <div className="w-10 h-10 bg-primary-500/20 rounded-xl flex items-center justify-center mb-4"><Compass className="w-5 h-5 text-primary-400" /></div>
                  <h4 className="text-sm font-bold text-white mb-2">1. Input Vibe</h4>
                  <p className="text-xs text-gray-300 leading-relaxed">Define your dates, maximum budget limits, and dynamic travel mood profile (Adventure, Culture, Food).</p>
                </div>
                <div className="mt-6 flex flex-wrap gap-1.5">
                  <span className="text-[9px] px-2.5 py-0.5 bg-slate-950/40 text-gray-300 border border-white/10 rounded-full font-bold">Preferences</span>
                  <span className="text-[9px] px-2.5 py-0.5 bg-slate-950/40 text-gray-300 border border-white/10 rounded-full font-bold">Budget Vibe</span>
                </div>
              </div>

              {/* Node 2: Engine */}
              <div className="flex flex-col justify-between bg-slate-900/40 border border-white/15 rounded-2xl p-6 shadow-lg text-white">
                <div>
                  <div className="w-10 h-10 bg-purple-550/20 rounded-xl flex items-center justify-center mb-4"><Cpu className="w-5 h-5 text-purple-400" /></div>
                  <h4 className="text-sm font-bold text-white mb-2">2. Match Engine</h4>
                  <p className="text-xs text-gray-300 leading-relaxed">Scores nearby locations, grouping geographical points into tight daily itineraries to minimize travel time.</p>
                </div>
                <div className="mt-6 flex flex-wrap gap-1.5">
                  <span className="text-[9px] px-2.5 py-0.5 bg-slate-950/40 text-gray-300 border border-white/10 rounded-full font-bold">Clustering</span>
                  <span className="text-[9px] px-2.5 py-0.5 bg-slate-950/40 text-gray-300 border border-white/10 rounded-full font-bold">Match Score</span>
                </div>
              </div>

              {/* Node 3: Maps API */}
              <div className="flex flex-col justify-between bg-slate-900/40 border border-white/15 rounded-2xl p-6 shadow-lg text-white">
                <div>
                  <div className="w-10 h-10 bg-accent-500/20 rounded-xl flex items-center justify-center mb-4"><Map className="w-5 h-5 text-accent-400" /></div>
                  <h4 className="text-sm font-bold text-white mb-2">3. Google Places API</h4>
                  <p className="text-xs text-gray-300 leading-relaxed">Verifies live operational hours, coordinates, traveler reviews, and pinpoints authentic spots.</p>
                </div>
                <div className="mt-6 flex flex-wrap gap-1.5">
                  <span className="text-[9px] px-2.5 py-0.5 bg-slate-950/40 text-gray-300 border border-white/10 rounded-full font-bold">Live Maps</span>
                  <span className="text-[9px] px-2.5 py-0.5 bg-slate-950/40 text-gray-300 border border-white/10 rounded-full font-bold">POI Query</span>
                </div>
              </div>

              {/* Node 4: Output */}
              <div className="flex flex-col justify-between bg-gradient-to-br from-primary-950/40 to-purple-950/40 border border-primary-500/35 rounded-2xl p-6 shadow-lg text-white">
                <div>
                  <div className="w-10 h-10 bg-primary-500/30 rounded-xl flex items-center justify-center mb-4"><CheckCircle2 className="w-5 h-5 text-primary-400 animate-pulse" /></div>
                  <h4 className="text-sm font-bold text-white mb-2">4. Smart Itinerary</h4>
                  <p className="text-xs text-gray-250 leading-relaxed">Outputs a visual, modular map and calendar timeline, complete with booking shortcuts and checklist folders.</p>
                </div>
                <div className="mt-6 flex flex-wrap gap-1.5">
                  <span className="text-[9px] px-2.5 py-0.5 bg-primary-600 text-white rounded-full font-bold">Dynamic Map</span>
                  <span className="text-[9px] px-2.5 py-0.5 bg-primary-600 text-white rounded-full font-bold">Editable</span>
                </div>
              </div>

            </div>

            {/* Flow lines (Dotted Glowing SVG) */}
            <div className="hidden lg:block absolute left-12 right-12 top-[60px] h-2 z-0 pointer-events-none">
              <svg className="w-full h-full" fill="none">
                <path d="M 120 4 L 750 4" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="2" strokeDasharray="8 8" />
                <path d="M 120 4 L 750 4" stroke="#818cf8" strokeWidth="2.5" strokeDasharray="40 160">
                  <animate attributeName="stroke-dashoffset" values="200;0" dur="6s" repeatCount="indefinite" />
                </path>
              </svg>
            </div>
          </div>

          {/* Solution Highlight Cards in glass style */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Cpu, color: 'text-primary-400 bg-primary-500/10 border-primary-500/15', title: 'AI Planning Engine', desc: 'No more generic guides. The engine aligns your schedules with your personal travel paces and budgets.' },
              { icon: Compass, color: 'text-purple-400 bg-purple-500/10 border-purple-500/15', title: 'Local Hidden Spots', desc: 'Leverages verified user reports and offline community files to surface beautiful off-path sites.' },
              { icon: Wallet, color: 'text-accent-400 bg-accent-500/10 border-accent-500/15', title: 'Budget Control', desc: 'Maintains budget boundaries across lodging, transit, food, and ticketing without hidden platform costs.' },
              { icon: Plane, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/15', title: 'Connected Bookings', desc: 'Quick-access shortcuts send parameters directly to Skyscanner, Booking.com, or Airbnb.' }
            ].map((sol, index) => (
              <div key={index} className="bg-slate-950/40 border border-white/10 p-6 rounded-3xl shadow-2xl text-white">
                <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center mb-5 ${sol.color}`}><sol.icon className="w-6 h-6" /></div>
                <h3 className="text-base font-bold text-white mb-2">{sol.title}</h3>
                <p className="text-xs text-gray-300 leading-relaxed">{sol.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4 — AI SMART ITINERARY ENGINE (Interactive Mood Timelines with floating hot air balloon) */}
      <section id="ai-engine" className="py-28 bg-transparent relative overflow-hidden border-t border-white/5">
        {/* Blended Travel Background Image */}
        <img 
          src="https://images.unsplash.com/photo-1507501336603-6e31db2be093?auto=format&fit=crop&w=1920&q=80"
          alt=""
          className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0 opacity-20"
          crossOrigin="anonymous"
          style={{ 
            maskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)'
          }}
        />

        {/* Floating Hot Air Balloon Background Animation */}
        <div className="absolute right-[5%] top-[15%] w-24 h-32 opacity-40 pointer-events-none z-0">
          <motion.div
            animate={{ 
              y: [0, -25, 0],
              x: [0, 10, 0],
              rotate: [0, 3, -3, 0]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
            className="w-full h-full text-white"
          >
            <svg viewBox="0 0 100 130" fill="currentColor">
              <path d="M50,10 C20,10 10,35 25,65 Q35,85 45,95 L55,95 Q65,85 75,65 C90,35 80,10 50,10 Z" />
              <line x1="45" y1="95" x2="47" y2="110" stroke="currentColor" strokeWidth="2" />
              <line x1="55" y1="95" x2="53" y2="110" stroke="currentColor" strokeWidth="2" />
              <rect x="45" y="110" width="10" height="8" rx="2" />
            </svg>
          </motion.div>
        </div>

        {/* Section wave separator line */}
        <div className="absolute bottom-0 left-0 right-0 h-12 pointer-events-none overflow-hidden z-10 opacity-[0.28] text-white">
          <svg className="w-[200%] h-full animate-waveFlow" viewBox="0 0 2400 60" preserveAspectRatio="none" style={{ animationDuration: '32s' }}>
            <path d="M0,30 C300,10 600,50 900,30 C1200,10 1500,50 1800,30 C2100,10 2400,50 2700,30 L2700,60 L0,60 Z" fill="currentColor" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-black text-primary-400 uppercase tracking-widest font-display font-black">Interactive Feature Showcase</span>
            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">AI Smart Itinerary Engine</h2>
            <p className="text-gray-300 text-lg">Watch how the platform automatically maps attractions, schedules timelines, and optimizes travel days based on your chosen vibe.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
            
            {/* Left Col: Vibe selects */}
            <div className="lg:col-span-4 flex flex-col justify-between gap-4">
              <div className="space-y-3">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-2">Select Travel Vibe</p>
                {[
                  { id: 'Adventure', icon: '🌋', tagline: 'Hiking, climbing & outback trails', bg: 'https://images.unsplash.com/photo-1533240332313-0db49b439ad3?auto=format&fit=crop&w=400&q=80' },
                  { id: 'Nature', icon: '🎋', tagline: 'Lakes, parks & serene forest spots', bg: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=400&q=80' },
                  { id: 'Food', icon: '🍣', tagline: 'Bakeries, markets & regional dinners', bg: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80' },
                  { id: 'Culture', icon: '🏛️', tagline: 'Artisans, ancient temples & galleries', bg: 'https://images.unsplash.com/photo-1491156855053-9cdff72c7f85?auto=format&fit=crop&w=400&q=80' },
                  { id: 'Nightlife', icon: '🍸', tagline: 'Mezcal speakeasies & jazz rooms', bg: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=400&q=80' }
                ].map(mood => (
                  <button
                    key={mood.id}
                    onClick={() => setActiveMood(mood.id)}
                    className={`w-full group text-left relative overflow-hidden rounded-2xl border p-4 transition-all ${
                      activeMood === mood.id ? 'border-primary-500 bg-slate-950/40 shadow-lg' : 'border-white/10 bg-slate-900/20 hover:bg-slate-900/40 hover:border-white/20'
                    }`}
                  >
                    <img
                      src={mood.bg}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover opacity-[0.03] group-hover:opacity-[0.06] transition-opacity pointer-events-none"
                      crossOrigin="anonymous"
                    />
                    <div className="relative z-10 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{mood.icon}</span>
                        <div>
                          <p className="text-xs font-black text-white">{mood.id}</p>
                          <p className="text-[10px] text-gray-350">{mood.tagline}</p>
                        </div>
                      </div>
                      <ChevronRight className={`w-4 h-4 transition-transform ${activeMood === mood.id ? 'text-primary-400 translate-x-1' : 'text-gray-500'}`} />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Right Col: Timeline output in glass style */}
            <div className="lg:col-span-8 flex flex-col">
              <div className="bg-slate-950/40 border border-white/10 backdrop-blur-xl rounded-[2.5rem] p-6 md:p-8 flex-1 flex flex-col justify-between shadow-2xl text-white">
                <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                  <div className="flex items-center gap-2">
                     <span className="w-2.5 h-2.5 rounded-full bg-primary-400 animate-pulse" />
                     <span className="text-[10px] font-black text-white uppercase tracking-widest">Live Schedule Preview</span>
                  </div>
                  <span className="text-[9px] font-bold text-accent-300 uppercase tracking-widest">{activeMood} Engine Model active</span>
                </div>

                <div className="space-y-4 flex-1">
                  {moodItineraries[activeMood].map((day, idx) => (
                    <motion.div
                      key={day.title}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: idx * 0.08 }}
                      className="flex gap-4 p-4 rounded-2xl bg-slate-900/30 border border-white/10 hover:bg-slate-900/50 hover:border-white/15 transition-all text-white"
                    >
                      <div className="flex flex-col items-center">
                        <span className="text-[9px] font-black text-primary-400 uppercase tracking-widest bg-primary-500/10 px-2 py-0.5 rounded border border-primary-500/15">{day.day}</span>
                        <div className="w-0.5 flex-1 bg-white/10 my-2" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-black text-white">{day.title}</h4>
                          <span className="text-[9px] font-black text-emerald-400 uppercase tracking-wider">{day.cost}</span>
                        </div>
                        <p className="text-[10px] text-gray-400 font-bold flex items-center gap-1.5 mt-1"><MapPin className="w-3.5 h-3.5 text-accent-400" /> {day.loc}</p>
                        <p className="text-[11px] text-gray-300 mt-2 leading-relaxed">{day.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-white/10 mt-6">
                  <p className="text-[10px] text-gray-400">Pressing 'Generate' configures all route matrices dynamically.</p>
                  <button
                    onClick={() => navigate(isAuthenticated ? '/planner' : '/signup')}
                    className="px-5 py-2.5 bg-primary-600 hover:bg-primary-500 rounded-xl text-xs font-bold transition-all hover:scale-105 flex items-center gap-2 border border-white/10"
                  >
                    <span>Generate Vibe Route</span> <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 5 — GOOGLE MAPS & HIDDEN GEMS (Unified glassmorphic map with sailing yacht silhouette) */}
      <section id="maps" className="py-28 bg-transparent relative overflow-hidden border-t border-white/5">
        {/* Blended Travel Background Image */}
        <img 
          src="https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=1920&q=80"
          alt=""
          className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0 opacity-20"
          crossOrigin="anonymous"
          style={{ 
            maskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)'
          }}
        />

        {/* Sailing boat rocking & drifting */}
        <div className="hero-boat hero-boat--2 opacity-65">
          <div className="hero-boat-inner">
            <svg width="110" height="90" viewBox="0 0 140 110" fill="none">
              <path d="M15,80 Q20,100 70,100 Q120,100 125,80 L115,75 L25,75 Z" fill="rgba(255,255,255,0.9)" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
              <line x1="68" y1="15" x2="68" y2="75" stroke="rgba(255,255,255,0.7)" strokeWidth="2" />
              <path d="M70,18 L70,70 L110,70 Z" fill="rgba(255,255,255,0.6)" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
              <path d="M68,15 L68,8 L78,11.5 L68,15 Z" fill="rgba(249,115,22,0.6)" />
            </svg>
          </div>
        </div>

        {/* Section wave separator line */}
        <div className="absolute bottom-0 left-0 right-0 h-12 pointer-events-none overflow-hidden z-10 opacity-[0.28] text-white">
          <svg className="w-[200%] h-full animate-waveFlow" viewBox="0 0 2400 60" preserveAspectRatio="none" style={{ animationDuration: '30s', animationDirection: 'reverse' }}>
            <path d="M0,30 C300,10 600,50 900,30 C1200,10 1500,50 1800,30 C2100,10 2400,50 2700,30 L2700,60 L0,60 Z" fill="currentColor" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
            <div className="lg:col-span-6 space-y-4">
              <span className="text-xs font-black text-primary-400 uppercase tracking-widest font-display">Google Maps Intelligence & Hidden Gems</span>
              <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">Real Location Intelligence Powered by Google Maps</h2>
              <p className="text-gray-300 text-base leading-relaxed">
                Traveloop uses Google Places API and intelligent attraction scoring to discover authentic attractions, local experiences, cafes, nightlife spots, and hidden gems based on user mood and destination preferences.
              </p>
            </div>
            
            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Card 1: Mood-Based Attraction Ranking */}
              <div className="bg-slate-950/40 border border-white/10 rounded-2xl p-5 shadow-lg text-white hover:border-primary-500/50 hover:bg-slate-950/60 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 group flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[9px] font-black text-primary-400 uppercase tracking-widest">Attraction Scoring</span>
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 animate-pulse" />
                  </div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">Mood-Based Attraction Ranking</h4>
                  <p className="text-[11px] text-gray-300 leading-relaxed">
                    Ranks attractions using ratings, popularity, travel mood, and user preferences to generate smarter recommendations.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-white/5 flex items-center gap-2">
                  <div className="flex -space-x-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/15">Match Score Active</span>
                </div>
              </div>

              {/* Card 2: Geographic Clustering Engine */}
              <div className="bg-slate-950/40 border border-white/10 rounded-2xl p-5 shadow-lg text-white hover:border-purple-500/50 hover:bg-slate-950/60 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 group flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[9px] font-black text-purple-400 uppercase tracking-widest">Optimization</span>
                    <Layers className="w-4 h-4 text-purple-400" />
                  </div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">Geographic Clustering Engine</h4>
                  <p className="text-[11px] text-gray-300 leading-relaxed">
                    Groups nearby attractions together to create realistic and optimized day-wise travel plans with reduced travel distance.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                    <span className="w-5 h-px bg-purple-500/50 animate-pulse" />
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                    <span className="w-5 h-px bg-purple-500/50 animate-pulse" />
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-400" />
                  </div>
                  <span className="text-[9px] font-mono text-purple-300">Transit Optimized</span>
                </div>
              </div>

              {/* Card 3: Hidden Gems Discovery */}
              <div className="bg-slate-950/40 border border-white/10 rounded-2xl p-5 shadow-lg text-white hover:border-accent-500/50 hover:bg-slate-950/60 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 group flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[9px] font-black text-accent-400 uppercase tracking-widest">Local Experience</span>
                    <Sparkles className="w-4 h-4 text-accent-400 animate-pulse" />
                  </div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">Hidden Gems Discovery</h4>
                  <p className="text-[11px] text-gray-300 leading-relaxed">
                    Finds underrated cafes, scenic viewpoints, local food streets, and authentic experiences beyond mainstream tourist spots.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-white/5 flex items-center gap-2">
                  <div className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-500"></span>
                  </div>
                  <span className="text-[9px] font-semibold text-accent-300">Non-commercial Highlights</span>
                </div>
              </div>

              {/* Card 4: Real Google Places Data */}
              <div className="bg-slate-950/40 border border-white/10 rounded-2xl p-5 shadow-lg text-white hover:border-emerald-500/50 hover:bg-slate-950/60 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 group flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">API Integration</span>
                    <Globe className="w-4 h-4 text-emerald-400" />
                  </div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">Real Google Places Data</h4>
                  <p className="text-[11px] text-gray-300 leading-relaxed">
                    Uses authentic Google Places ratings, photos, coordinates, and nearby search results for realistic itinerary generation.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[9px] font-mono text-gray-400">api.google.places/sync</span>
                  <span className="text-[9px] text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/15">Active Sync</span>
                </div>
              </div>
            </div>
          </div>

          {/* HIDDEN GEMS SHOWCASE GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockLocations.map((loc) => (
              <motion.div
                key={loc.id}
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 120, damping: 14 }}
                className="bg-slate-950/45 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl text-white hover:border-primary-500/40 transition-all duration-300 group cursor-pointer"
                onClick={() => setSelectedMapLocation(loc)}
              >
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={loc.image}
                    alt={loc.gem}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    crossOrigin="anonymous"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  <span className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md border border-white/15 text-[9px] font-black px-3 py-1 rounded-full text-primary-300 uppercase tracking-widest">
                    {loc.type}
                  </span>
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="text-sm font-black text-white leading-tight drop-shadow-lg">{loc.gem}</h3>
                  </div>
                </div>
                <div className="p-4 space-y-2">
                  <p className="text-[10px] text-gray-300 font-bold flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-accent-400 flex-shrink-0" /> {loc.city}, {loc.country}
                  </p>
                  <p className="text-[11px] text-gray-400 leading-relaxed line-clamp-2">{loc.desc}</p>
                  <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[8px] font-black text-emerald-400 uppercase tracking-wider bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/15">Google Places Verified</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-primary-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6 — SMART BUDGET & BOOKING (Unified glassmorphic booking widgets with gliding jet) */}
      <section id="booking" className="py-28 bg-transparent relative overflow-hidden border-t border-white/5">
        {/* Blended Travel Background Image */}
        <img 
          src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1920&q=80"
          alt=""
          className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0 opacity-20"
          crossOrigin="anonymous"
          style={{ 
            maskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)'
          }}
        />

        {/* Drifting Clouds for plane theme */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 opacity-30">
          <motion.div
            animate={{ x: ['-200px', 'calc(100vw + 200px)'] }}
            transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
            className="absolute top-[5%] text-white"
          >
            <svg width="150" height="50" viewBox="0 0 100 40" fill="currentColor">
              <path d="M20,30 Q30,15 45,22 Q55,10 70,18 Q85,15 90,30 Z" />
            </svg>
          </motion.div>
        </div>

        {/* Gliding plane background animation */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 opacity-35">
          <motion.div
            animate={{ 
              x: ['-20vw', '120vw'],
              y: ['80px', '200px', '120px'],
              rotate: [5, 15, -5]
            }}
            transition={{ 
              duration: 20, 
              repeat: Infinity, 
              ease: 'linear'
            }}
            className="absolute top-0 left-0"
          >
            <Plane className="w-10 h-10 text-white rotate-90" />
          </motion.div>
        </div>

        {/* Section wave separator line */}
        <div className="absolute bottom-0 left-0 right-0 h-12 pointer-events-none overflow-hidden z-10 opacity-[0.28] text-white">
          <svg className="w-[200%] h-full animate-waveFlow" viewBox="0 0 2400 60" preserveAspectRatio="none" style={{ animationDuration: '26s' }}>
            <path d="M0,30 C300,10 600,50 900,30 C1200,10 1500,50 1800,30 C2100,10 2400,50 2700,30 L2700,60 L0,60 Z" fill="currentColor" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Col: Explainer details */}
            <div className="lg:col-span-5 space-y-6">
              <span className="text-xs font-black text-accent-400 uppercase tracking-widest font-display">Unified Bookings</span>
              <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">One-click transit & stay booking</h2>
              <p className="text-gray-300 text-base leading-relaxed">
                Configure your overall budget limits, and watch the platform split resources across stays, flights, daily meals, and entertainment. Once finalized, Traveloop routes you directly to booking providers with parameters pre-set.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-primary-500/20 border border-primary-500/30 flex items-center justify-center text-primary-400 font-bold text-xs">✓</div>
                  <span className="text-xs font-bold text-gray-300">Direct integrations with Skyscanner, Airbnb, and Booking.com.</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-primary-500/20 border border-primary-500/30 flex items-center justify-center text-primary-400 font-bold text-xs">✓</div>
                  <span className="text-xs font-bold text-gray-300">No secret booking markups or commission overrides.</span>
                </div>
              </div>
            </div>

            {/* Right Col: Booking Cards in glass style */}
            <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-950/40 border border-white/10 backdrop-blur-xl rounded-3xl p-6 shadow-2xl flex flex-col justify-between min-h-[260px] text-white hover:-translate-y-1.5 hover:shadow-2xl hover:border-white/20 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="px-2.5 py-1 rounded bg-primary-500/20 border border-primary-500/30 text-[9px] font-black text-primary-300 uppercase tracking-wider">
                    Flight Booking
                  </div>
                  <span className="text-[10px] font-bold text-gray-400">Skyscanner Partner</span>
                </div>

                <div className="bg-slate-900/30 border border-white/10 rounded-2xl p-4 my-2 text-white">
                  <div className="flex justify-between items-center text-center">
                    <div>
                      <p className="text-base font-black text-white">NRT</p>
                      <p className="text-[9px] text-gray-300">Tokyo</p>
                    </div>
                    <div className="flex-1 flex flex-col items-center px-4">
                      <Plane className="w-4 h-4 text-primary-400 rotate-90" />
                      <div className="w-full h-px border-t border-dashed border-white/20 my-1" />
                      <p className="text-[8px] text-gray-400">11h 20m Direct</p>
                    </div>
                    <div>
                      <p className="text-base font-black text-white">LAX</p>
                      <p className="text-[9px] text-gray-300">Los Angeles</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <div>
                    <p className="text-[9px] text-gray-400">Best round price</p>
                    <p className="text-sm font-black text-white">₹48,990 <span className="text-[10px] text-gray-450 font-normal">/ seat</span></p>
                  </div>
                  <button
                    onClick={() => navigate(isAuthenticated ? '/booking/travel' : '/login')}
                    className="px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-xl text-xs font-bold shadow-md transition-colors border border-white/10"
                  >
                    Compare Rates
                  </button>
                </div>
              </div>

              <div className="bg-slate-950/40 border border-white/10 backdrop-blur-xl rounded-3xl p-6 shadow-2xl flex flex-col justify-between min-h-[260px] text-white hover:-translate-y-1.5 hover:shadow-2xl hover:border-white/20 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="px-2.5 py-1 rounded bg-accent-500/20 border border-accent-500/30 text-[9px] font-black text-accent-300 uppercase tracking-wider">
                    Stay Booking
                  </div>
                  <span className="text-[10px] font-bold text-gray-400">Airbnb Partner</span>
                </div>

                <div className="flex gap-3 bg-slate-900/30 border border-white/10 rounded-2xl p-3 my-2 text-white">
                  <img
                    src="https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=150&h=150&q=80"
                    alt="Traditional Ryokan"
                    className="w-14 h-14 object-cover rounded-xl border border-white/10"
                    crossOrigin="anonymous"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-[11px] font-black text-white line-clamp-1">Traditional Cedar Ryokan</h4>
                      <p className="text-[9px] text-gray-300">Kyoto Historic Town</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-accent-400 text-accent-400" />
                      <span className="text-[9px] font-bold text-white">4.92 (180 reviews)</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4">
                  <div>
                    <p className="text-[9px] text-gray-400">Average Nightly</p>
                    <p className="text-sm font-black text-white">₹11,990 <span className="text-[10px] text-gray-400 font-normal">/ night</span></p>
                  </div>
                  <button
                    onClick={() => navigate(isAuthenticated ? '/booking/stay' : '/login')}
                    className="px-4 py-2 bg-gray-800 hover:bg-black text-white rounded-xl text-xs font-bold shadow-md transition-colors border border-white/10"
                  >
                    Select Room
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7 — PREMIUM UI SHOWCASE (Workspace Dashboards in Glass panel with 3D Tilt) */}
      <section id="showcase" className="py-28 bg-transparent relative overflow-hidden border-t border-white/5">
        {/* Blended Travel Background Image */}
        <img 
          src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1920&q=80"
          alt=""
          className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0 opacity-20"
          crossOrigin="anonymous"
          style={{ 
            maskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)'
          }}
        />

        {/* Floating Light Particles Background Animation */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 opacity-15">
          <motion.div animate={{ y: [-10, 10, -10], x: [-5, 5, -5] }} transition={{ duration: 6, repeat: Infinity }} className="absolute top-[10%] left-[20%] w-3 h-3 rounded-full bg-primary-400 blur-sm" />
          <motion.div animate={{ y: [10, -10, 10], x: [5, -5, 5] }} transition={{ duration: 8, repeat: Infinity, delay: 1 }} className="absolute bottom-[20%] right-[30%] w-4 h-4 rounded-full bg-accent-400 blur-sm" />
          <motion.div animate={{ y: [-15, 15, -15], x: [10, -10, 10] }} transition={{ duration: 7, repeat: Infinity, delay: 2 }} className="absolute top-[40%] right-[15%] w-2 h-2 rounded-full bg-purple-400 blur-sm" />
        </div>

        {/* Sailing boat rocking & drifting */}
        <div className="hero-boat hero-boat--3 opacity-70">
          <div className="hero-boat-inner">
            <svg width="100" height="80" viewBox="0 0 140 110" fill="none">
              <path d="M15,80 Q20,100 70,100 Q120,100 125,80 L115,75 L25,75 Z" fill="rgba(255,255,255,0.9)" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
              <line x1="68" y1="15" x2="68" y2="75" stroke="rgba(255,255,255,0.7)" strokeWidth="2" />
              <path d="M70,18 L70,70 L110,70 Z" fill="rgba(255,255,255,0.6)" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
              <path d="M68,15 L68,8 L78,11.5 L68,15 Z" fill="rgba(249,115,22,0.6)" />
            </svg>
          </div>
        </div>

        {/* Section wave separator line */}
        <div className="absolute bottom-0 left-0 right-0 h-12 pointer-events-none overflow-hidden z-10 opacity-[0.28] text-white">
          <svg className="w-[200%] h-full animate-waveFlow" viewBox="0 0 2400 60" preserveAspectRatio="none" style={{ animationDuration: '34s', animationDirection: 'reverse' }}>
            <path d="M0,30 C300,10 600,50 900,30 C1200,10 1500,50 1800,30 C2100,10 2400,50 2700,30 L2700,60 L0,60 Z" fill="currentColor" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <span className="text-xs font-black text-primary-400 uppercase tracking-widest font-display">Client Workspace</span>
            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">AI Travel Planning Dashboard</h2>
            <p className="text-gray-100 text-lg">An intelligent workspace that organizes itineraries, budgets, activities, hidden gems, and travel flow into one seamless experience.</p>
          </div>

          {/* Dashboard replica card (Premium glass panel) */}
          <div className="flex justify-center">
            <motion.div
              whileHover={{ y: -4, scale: 1.005 }}
              transition={{ type: 'spring', stiffness: 80, damping: 15 }}
              className="w-full max-w-4xl bg-slate-950/40 border border-white/15 backdrop-blur-xl rounded-[2.5rem] p-1.5 shadow-2xl relative text-white"
            >
              <div className="bg-slate-950/45 rounded-[2.35rem] p-6 md:p-8 border border-white/10 space-y-6">
                
                {/* Header Mockup */}
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
                    <span className="text-[10px] text-gray-300 ml-2">traveloop-workspace.app</span>
                  </div>
                  <div className="px-3 py-1 bg-white/10 border border-white/10 text-white rounded-md text-[9px] font-black uppercase tracking-wider shadow-sm">
                    AI Itinerary Generated
                  </div>
                </div>

                {/* Dashboard layout simulator */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  
                  {/* Left (Timeline summary) */}
                  <div className="md:col-span-7 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black text-white uppercase tracking-wider">Tokyo Cultural Explorer — 5 Day Trip</h4>
                      <span className="text-[9px] text-gray-300 font-bold">Aug 15 – Aug 20</span>
                    </div>

                    <div className="space-y-3">
                      {[
                        { title: 'Senso-ji Temple Heritage Walk', time: '08:00 AM', status: 'Completed', color: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/20' },
                        { title: 'Tsukiji Sushi & Street Food Trail', time: '12:30 PM', status: 'Active', color: 'bg-orange-500/20 text-orange-300 border border-orange-500/20' },
                        { title: 'Hidden Café Discovery — Shimokitazawa', time: '04:00 PM', status: 'Recommended', color: 'bg-purple-500/20 text-purple-300 border border-purple-500/20' },
                        { title: 'Shinjuku Nightlife Experience', time: '07:00 PM', status: 'Upcoming', color: 'bg-white/5 text-gray-300 border border-white/5' },
                        { title: 'Tokyo Skyline Observation Deck', time: '08:30 PM', status: 'Saved', color: 'bg-blue-500/20 text-blue-300 border border-blue-500/20' }
                      ].map((item, index) => (
                        <motion.div
                          key={index}
                          whileHover={{ y: -2, scale: 1.01, boxShadow: '0 4px 20px rgba(99,102,241,0.15)' }}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.08 }}
                          className="bg-slate-900/30 border border-white/10 rounded-xl p-3.5 flex items-center justify-between gap-4 shadow-md transition-all"
                        >
                          <div>
                            <p className="text-xs font-bold text-white">{item.title}</p>
                            <p className="text-[9px] text-gray-300 mt-0.5">{item.time}</p>
                          </div>
                          <span className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${item.color}`}>{item.status}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Right (Budget / Weather stats) */}
                  <div className="md:col-span-5 space-y-4">
                    <div className="bg-slate-900/30 border border-white/10 rounded-2xl p-5 space-y-4 shadow-md">
                      <h5 className="text-[10px] font-black text-white uppercase tracking-wider">Trip Budget Intelligence</h5>
                      <div>
                        <p className="text-[9px] text-gray-300">Remaining Budget</p>
                        <p className="text-2xl font-black text-emerald-400">₹18,450</p>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-[8px] text-gray-300 mb-1 font-bold">
                            <span>Spent (₹11,550)</span>
                            <span>Budget Cap (₹30,000)</span>
                          </div>
                          <div className="w-full h-1.5 bg-white/5 border border-white/10 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: '38.5%' }}
                              transition={{ duration: 1.2, ease: 'easeOut' }}
                              className="h-full bg-gradient-to-r from-primary-600 to-emerald-450" 
                            />
                          </div>
                        </div>

                        <div className="pt-2 border-t border-white/5 space-y-2">
                          <p className="text-[9px] font-black text-gray-400 uppercase tracking-wider mb-2">Category Split</p>
                          {[
                            { category: 'Food', spent: '₹3,700', percent: 32, color: 'bg-orange-500' },
                            { category: 'Attractions', spent: '₹4,620', percent: 40, color: 'bg-purple-500' },
                            { category: 'Transport', spent: '₹1,730', percent: 15, color: 'bg-blue-500' },
                            { category: 'Nightlife', spent: '₹1,500', percent: 13, color: 'bg-accent-500' }
                          ].map((cat, cIdx) => (
                            <div key={cIdx} className="space-y-1">
                              <div className="flex justify-between text-[9px] text-gray-300 font-medium">
                                <span>{cat.category} ({cat.spent})</span>
                                <span>{cat.percent}%</span>
                              </div>
                              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${cat.percent}%` }}
                                  transition={{ duration: 1, delay: 0.2 + cIdx * 0.1 }}
                                  className={`h-full ${cat.color}`} 
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-900/30 border border-white/10 rounded-2xl p-4 flex items-center justify-between shadow-md">
                      <div>
                        <p className="text-xs font-black text-white">Live Trip Conditions</p>
                        <p className="text-[9px] text-gray-300 mt-1 font-bold">☀️ Tokyo — Clear Weather</p>
                        <p className="text-[9px] text-gray-400">24°C • Ideal for Outdoor Activities</p>
                      </div>
                      <motion.span 
                        animate={{ scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                        className="text-2xl filter drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]"
                      >
                        ☀️
                      </motion.span>
                    </div>

                    <motion.div
                      whileHover={{ y: -2, scale: 1.01, boxShadow: '0 8px 30px rgba(244,63,94,0.15)' }}
                      className="bg-slate-900/40 border border-white/15 backdrop-blur-xl rounded-2xl p-4 shadow-md space-y-3 relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/10 rounded-full blur-xl pointer-events-none" />
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-black text-accent-400 uppercase tracking-widest flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-accent-300 animate-pulse" /> Hidden Gem Suggested
                        </span>
                        <span className="text-[8px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 font-bold">94% Match</span>
                      </div>
                      <div>
                        <h6 className="text-xs font-black text-white flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-accent-400" /> Golden Gai Alley Bars
                        </h6>
                        <p className="text-[9px] text-gray-300 font-semibold mt-0.5">Shinjuku, Tokyo</p>
                      </div>
                      <p className="text-[10px] text-gray-350 leading-relaxed italic border-l-2 border-accent-500/50 pl-2">
                        "Matches your nightlife mood and is located near your evening itinerary cluster."
                      </p>
                    </motion.div>
                  </div>

                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </section>

      {/* SECTION 8 — TECH STACK & ARCHITECTURE (Glass stack nodes connected by glowing paths) */}
      <section id="tech" className="py-28 bg-transparent relative overflow-hidden border-t border-white/5">
        {/* Blended Travel Background Image */}
        <img 
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&q=80"
          alt=""
          className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0 opacity-20"
          crossOrigin="anonymous"
          style={{ 
            maskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)'
          }}
        />

        {/* Section wave separator line */}
        <div className="absolute bottom-0 left-0 right-0 h-12 pointer-events-none overflow-hidden z-10 opacity-[0.28] text-white">
          <svg className="w-[200%] h-full animate-waveFlow" viewBox="0 0 2400 60" preserveAspectRatio="none" style={{ animationDuration: '36s' }}>
            <path d="M0,30 C300,10 600,50 900,30 C1200,10 1500,50 1800,30 C2100,10 2400,50 2700,30 L2700,60 L0,60 Z" fill="currentColor" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <span className="text-xs font-black text-primary-400 uppercase tracking-widest font-display">System Integrity</span>
            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">Modular Travel Architecture</h2>
            <p className="text-gray-300 text-lg">Engineered using modular asynchronous pipelines, linking our client dashboard with caching databases and external data maps.</p>
          </div>

          <div className="relative w-full border border-white/10 bg-slate-950/40 rounded-[2rem] p-8 md:p-12 overflow-hidden shadow-2xl text-white">
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 items-stretch">
              
              {/* Node 1 */}
              <div className="bg-slate-900/30 border border-white/20 rounded-2xl p-6 flex flex-col justify-between shadow-md hover:-translate-y-1 hover:border-white/30 transition-all duration-300">
                <div>
                  <span className="text-[9px] font-black uppercase text-primary-450 tracking-wider">Client Interface</span>
                  <h4 className="text-xs font-black text-white mt-1 mb-3">1. Frontend Client</h4>
                  <p className="text-[10px] text-gray-300 leading-relaxed">Built on React 19, incorporating Tailwind CSS styling sheets and Framer Motion logic.</p>
                </div>
                <div className="flex gap-2 mt-4">
                  <span className="text-[8px] font-bold text-gray-400 bg-white/5 px-2 py-0.5 rounded border border-white/10">React</span>
                  <span className="text-[8px] font-bold text-gray-400 bg-white/5 px-2 py-0.5 rounded border border-white/10">Tailwind</span>
                </div>
              </div>
 
              {/* Node 2 */}
              <div className="bg-slate-900/30 border border-white/20 rounded-2xl p-6 flex flex-col justify-between shadow-md hover:-translate-y-1 hover:border-white/30 transition-all duration-300">
                <div>
                  <span className="text-[9px] font-black uppercase text-purple-400 tracking-wider">Backend Core</span>
                  <h4 className="text-xs font-black text-white mt-1 mb-3">2. Node Express API</h4>
                  <p className="text-[10px] text-gray-300 leading-relaxed">Manages session authorization, routing calls, and budget calculators.</p>
                </div>
                <div className="flex gap-2 mt-4">
                  <span className="text-[8px] font-bold text-gray-400 bg-white/5 px-2 py-0.5 rounded border border-white/10">Express</span>
                  <span className="text-[8px] font-bold text-gray-400 bg-white/5 px-2 py-0.5 rounded border border-white/10">Node.js</span>
                </div>
              </div>
 
              {/* Node 3 */}
              <div className="bg-slate-900/30 border border-white/20 rounded-2xl p-6 flex flex-col justify-between shadow-md hover:-translate-y-1 hover:border-white/30 transition-all duration-300">
                <div>
                  <span className="text-[9px] font-black uppercase text-accent-400 tracking-wider">Calculation Core</span>
                  <h4 className="text-xs font-black text-white mt-1 mb-3">3. Scoring Engine</h4>
                  <p className="text-[10px] text-gray-300 leading-relaxed">Weights location reviews, geographic coordinates, and groupings dynamically.</p>
                </div>
                <div className="flex gap-2 mt-4">
                  <span className="text-[8px] font-bold text-gray-400 bg-white/5 px-2 py-0.5 rounded border border-white/10">Matching</span>
                  <span className="text-[8px] font-bold text-gray-400 bg-white/5 px-2 py-0.5 rounded border border-white/10">Clustering</span>
                </div>
              </div>
 
              {/* Node 4 */}
              <div className="bg-slate-900/30 border border-white/20 rounded-2xl p-6 flex flex-col justify-between shadow-md hover:-translate-y-1 hover:border-white/30 transition-all duration-300">
                <div>
                  <span className="text-[9px] font-black uppercase text-gray-400 tracking-wider">Maps Provider</span>
                  <h4 className="text-xs font-black text-white mt-1 mb-3">4. Google Places</h4>
                  <p className="text-[10px] text-gray-300 leading-relaxed">Fetches points of interest details, coordinates, ratings, and reviews.</p>
                </div>
                <div className="flex gap-2 mt-4">
                  <span className="text-[8px] font-bold text-gray-400 bg-white/5 px-2 py-0.5 rounded border border-white/10">Places SDK</span>
                  <span className="text-[8px] font-bold text-gray-400 bg-white/5 px-2 py-0.5 rounded border border-white/10">Geocoding</span>
                </div>
              </div>
 
              {/* Node 5 */}
              <div className="bg-slate-900/30 border border-white/20 rounded-2xl p-6 flex flex-col justify-between shadow-md hover:-translate-y-1 hover:border-white/30 transition-all duration-300">
                <div>
                  <span className="text-[9px] font-black uppercase text-emerald-400 tracking-wider">Database Node</span>
                  <h4 className="text-xs font-black text-white mt-1 mb-3">5. DB Storage</h4>
                  <p className="text-[10px] text-gray-300 leading-relaxed">Maintains user profile folders, active trips, checklists, and note feeds.</p>
                </div>
                <div className="flex gap-2 mt-4">
                  <span className="text-[8px] font-bold text-gray-400 bg-white/5 px-2 py-0.5 rounded border border-white/10">PostgreSQL</span>
                  <span className="text-[8px] font-bold text-gray-400 bg-white/5 px-2 py-0.5 rounded border border-white/10">Pool</span>
                </div>
              </div>

            </div>

            {/* Connection dot lines */}
            <div className="hidden lg:block absolute left-12 right-12 top-[75px] h-2 z-0 pointer-events-none">
              <svg className="w-full h-full opacity-40" fill="none">
                <path d="M 110 4 L 880 4" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="1.5" strokeDasharray="6 6" />
                <path d="M 110 4 L 880 4" stroke="#818cf8" strokeWidth="1.5" strokeDasharray="20 120">
                  <animate attributeName="stroke-dashoffset" values="200;0" dur="5s" repeatCount="indefinite" />
                </path>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 9 — FUTURE VISION (Radar pulse background and glass textboxes) */}
      <section id="future" className="py-28 bg-transparent relative overflow-hidden border-t border-white/5">
        {/* Blended Travel Background Image */}
        <img 
          src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1920&q=80"
          alt=""
          className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0 opacity-20"
          crossOrigin="anonymous"
          style={{ 
            maskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)'
          }}
        />

        {/* Drifting Clouds Background Animation */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 opacity-30">
          <motion.div
            animate={{ x: ['-200px', 'calc(100vw + 200px)'] }}
            transition={{ duration: 48, repeat: Infinity, ease: 'linear' }}
            className="absolute top-[12%] text-white"
          >
            <svg width="130" height="45" viewBox="0 0 100 40" fill="currentColor">
              <path d="M20,30 Q30,15 45,22 Q55,10 70,18 Q85,15 90,30 Z" />
            </svg>
          </motion.div>
        </div>

        {/* Radar Pulse Background Animation */}
        <div className="absolute right-[10%] top-[20%] w-[400px] h-[400px] opacity-[0.04] pointer-events-none z-0">
          <div className="w-full h-full rounded-full border border-white flex items-center justify-center animate-ping" style={{ animationDuration: '4s' }} />
        </div>

        {/* Section wave separator line */}
        <div className="absolute bottom-0 left-0 right-0 h-12 pointer-events-none overflow-hidden z-10 opacity-[0.28] text-white">
          <svg className="w-[200%] h-full animate-waveFlow" viewBox="0 0 2400 60" preserveAspectRatio="none" style={{ animationDuration: '38s', animationDirection: 'reverse' }}>
            <path d="M0,30 C300,10 600,50 900,30 C1200,10 1500,50 1800,30 C2100,10 2400,50 2700,30 L2700,60 L0,60 Z" fill="currentColor" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <span className="text-xs font-black text-primary-400 uppercase tracking-widest font-display">Roadmap Releases</span>
            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">Future Milestones</h2>
            <p className="text-gray-300 text-lg">We are continually extending the platform capabilities. Here is what is on the itinerary for the upcoming cycles.</p>
          </div>

          <div className="relative border-l border-dashed border-white/10 max-w-4xl mx-auto pl-8 space-y-12">
            {[
              { milestone: 'Q3 2026', title: 'Collaborative Multi-traveler Workspace', desc: 'Invite friends or family members to edit and plan itineraries together. Changes sync instantly across all clients using WebSockets.' },
              { milestone: 'Q4 2026', title: 'Dynamic Weather-aware Schedule Swaps', desc: 'Queries real-time meteorological forecasts to automatically recommend indoor museums or dining on rainy days.' },
              { milestone: 'Q1 2027', title: 'Asynchronous AI Travel Assistant', desc: 'Embedded natural language nodes allowing users to modify stops, recalculate routes, and check booking rates using text.' },
              { milestone: 'Q2 2027', title: 'Cheapest Multi-country Route Mapping', desc: 'Upgrades the route engine to determine the most cost-effective travel corridors across complex multi-city trips.' }
            ].map((milestone, idx) => (
              <div key={idx} className="relative">
                {/* Milestone Badge */}
                <div className="absolute -left-[54px] top-1.5 px-3 py-1 bg-slate-900 border border-white/10 rounded-full text-[9px] font-black text-primary-300 uppercase tracking-wider shadow-md">
                  {milestone.milestone}
                </div>
                
                <div className="bg-slate-950/70 hover:bg-slate-950/85 border border-white/10 rounded-2xl p-6 shadow-2xl max-w-3xl hover:-translate-y-1 hover:border-white/20 transition-all duration-300 text-white">
                  <h4 className="text-xs font-black text-white mb-1.5 uppercase">{milestone.title}</h4>
                  <p className="text-[11px] text-gray-300 leading-relaxed">{milestone.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 10 — FINAL CTA (Cinematic sunset fade-out) */}
      <section id="cta" className="py-32 bg-transparent relative overflow-hidden flex items-center justify-center text-center border-t border-white/5">
        {/* Blended Travel Background Image */}
        <img 
          src="https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=1920&q=80"
          alt=""
          className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0 opacity-20"
          crossOrigin="anonymous"
          style={{ 
            maskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)'
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.06),transparent_60%)] pointer-events-none" />

        {/* Sailing boat rocking & drifting */}
        <div className="hero-boat hero-boat--1 opacity-70">
          <div className="hero-boat-inner">
            <svg width="120" height="95" viewBox="0 0 140 110" fill="none">
              <path d="M15,80 Q20,100 70,100 Q120,100 125,80 L115,75 L25,75 Z" fill="rgba(255,255,255,0.9)" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
              <line x1="68" y1="12" x2="68" y2="75" stroke="rgba(255,255,255,0.85)" strokeWidth="2.5" />
              <path d="M70,15 L70,70 L115,70 Z" fill="rgba(255,255,255,0.75)" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
              <path d="M68,12 L68,5 L80,8.5 L68,12 Z" fill="rgba(249,115,22,0.8)" />
            </svg>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 space-y-8 relative z-10 text-white">
          <div className="w-14 h-14 bg-white/10 border border-white/20 rounded-3xl flex items-center justify-center mx-auto shadow-2xl">
            <Plane className="w-6 h-6 text-white" />
          </div>
          
          <h2 className="text-4xl md:text-6xl font-black font-display text-white tracking-tighter leading-tight">
            Traveloop is not just a trip planner — it is a smart travel intelligence platform.
          </h2>
          
          <p className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
            Stop copy-pasting lines into note pages. Let our planning algorithms organize your next adventure today.
          </p>

          <div className="pt-4 animate-bounce">
            <button
              onClick={() => navigate(isAuthenticated ? '/dashboard' : '/signup')}
              className="px-10 py-5 bg-white text-gray-900 hover:scale-105 active:scale-95 transition-all font-bold rounded-2xl text-lg shadow-[0_0_50px_rgba(255,255,255,0.25)] flex items-center gap-3 mx-auto"
            >
              <Sparkles className="w-6 h-6 text-primary-600" />
              <span>Start Planning Your Journey</span>
            </button>
          </div>
        </div>
      </section>
    </>
  );

  const renderFooter = () => (
    <footer className="py-12 border-t border-white/10 bg-slate-950/40 backdrop-blur-xl text-gray-400 text-xs relative z-10">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <span className="font-bold text-white">Traveloop.</span>
          <span>© 2026. All rights reserved.</span>
        </div>
        <div className="flex gap-6 font-bold uppercase tracking-wider text-[10px]">
          <span className="hover:text-primary-400 cursor-pointer" onClick={() => scrollToSection('hero')}>Intro</span>
          <span className="hover:text-primary-400 cursor-pointer" onClick={() => scrollToSection('problems')}>Why Us</span>
          <span className="hover:text-primary-400 cursor-pointer" onClick={() => scrollToSection('solution')}>Solution</span>
          <span className="hover:text-primary-400 cursor-pointer" onClick={() => scrollToSection('tech')}>Tech Stack</span>
        </div>
      </div>
    </footer>
  );

  // Return layout wrapping: always full-width with top navbar, never inside AppLayout sidebar
  return (
    <div
      ref={containerRef}
      className="min-h-screen font-sans text-white selection:bg-primary-500 selection:text-white overflow-x-hidden relative bg-[#020617]"
      style={{
        background: 'linear-gradient(to bottom, #020617 0%, #010204 100%)'
      }}
    >
      {/* Fixed background travel texture */}
      <div className="absolute inset-0 bg-[url('/travel-bg.png')] opacity-[0.05] mix-blend-overlay bg-repeat pointer-events-none z-0" />

      {renderNavbar()}
      {renderContent()}
      {renderFooter()}

      {/* Floating Action Button for Exporting Pitch Deck */}
      <button
        onClick={exportPitchDeck}
        disabled={exporting}
        className="fixed bottom-6 right-6 z-40 bg-white/10 hover:bg-white/20 active:scale-95 border border-white/20 backdrop-blur-xl p-4 rounded-2xl shadow-2xl hover:scale-110 transition-all flex items-center gap-2 text-white group export-ignore"
        title="Export Pitch Deck"
      >
        <Sparkles className="w-5 h-5 text-yellow-400 group-hover:rotate-12 transition-transform" />
        <span className="text-xs font-black tracking-wider uppercase">Export Pitch Deck</span>
      </button>

      {/* Glassmorphic Loader Overlay */}
      <AnimatePresence>
        {exporting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-950/85 backdrop-blur-2xl text-white pointer-events-auto"
          >
            <div className="max-w-md w-full px-6 flex flex-col items-center text-center space-y-6">
              {/* Spinner animation */}
              <div className="relative w-24 h-24 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-white/5 border-t-primary-500 animate-spin" />
                <Sparkles className="w-8 h-8 text-yellow-400 animate-pulse" />
              </div>

              {/* Progress Text */}
              <div className="space-y-2 w-full">
                <h3 className="text-xl font-black font-display tracking-tight text-white">Generating Pitch Deck</h3>
                <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold">{exportStatus}</p>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 bg-white/5 border border-white/10 rounded-full overflow-hidden relative">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary-500 to-accent-500"
                  initial={{ width: '0%' }}
                  animate={{ width: `${exportProgress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              {/* Progress Number */}
              <span className="text-sm font-mono font-bold text-primary-400">{exportProgress}%</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
