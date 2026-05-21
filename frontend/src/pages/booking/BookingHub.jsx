import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plane, Hotel, ArrowRight, MapPin, Search, Sparkles, Navigation, Globe } from 'lucide-react';
import AppLayout from '../../components/layout/AppLayout';
import useTripStore from '../../store/tripStore';
import { generateFlightBookingLink, generateHotelBookingLink } from '../../utils';

export default function BookingHub() {
  const location = useLocation();
  const navigate = useNavigate();
  const isTravel = location.pathname.includes('/travel');
  
  const { trips, fetchTrips, isLoading } = useTripStore();
  const [destination, setDestination] = useState('');
  const [customDest, setCustomDest] = useState('');
  const [selectedTripId, setSelectedTripId] = useState(null);

  useEffect(() => {
    fetchTrips();
  }, []);

  // Set default destination from first active trip if available
  useEffect(() => {
    if (trips && trips.length > 0 && !destination) {
      const activeTrip = trips[0];
      const firstCity = activeTrip.stops?.[0]?.city || activeTrip.title.split('—')[0].trim();
      setDestination(firstCity);
      setSelectedTripId(activeTrip.id);
    }
  }, [trips]);

  const handleTripSelect = (trip) => {
    setSelectedTripId(trip.id);
    const city = trip.stops?.[0]?.city || trip.title.split('—')[0].trim();
    setDestination(city);
    setCustomDest('');
  };

  const handleCustomSearch = (e) => {
    e.preventDefault();
    if (customDest.trim()) {
      setDestination(customDest.trim());
      setSelectedTripId(null);
    }
  };

  const travelProviders = [
    {
      name: 'Skyscanner',
      description: 'Compare flights from 1000+ providers and find the best routes instantly.',
      url: generateFlightBookingLink(destination, 'skyscanner'),
      image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80',
      badge: 'Highly Recommended',
      color: 'from-blue-600 to-sky-500'
    },
    {
      name: 'MakeMyTrip',
      description: 'Book flight tickets, trains, buses, and local transport options.',
      url: generateFlightBookingLink(destination, 'makemytrip'),
      image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
      badge: 'Best for India',
      color: 'from-orange-600 to-red-500'
    }
  ];

  const stayProviders = [
    {
      name: 'Booking.com',
      description: 'Book premium hotels, cozy luxury resorts, villas, and apartments.',
      url: generateHotelBookingLink(destination, 'booking'),
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
      badge: 'Top Choice',
      color: 'from-indigo-600 to-blue-500'
    },
    {
      name: 'Airbnb',
      description: 'Discover unique home stays, cabins, villas, and local experiences.',
      url: generateHotelBookingLink(destination, 'airbnb'),
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
      badge: 'Unique Stays',
      color: 'from-rose-600 to-pink-500'
    },
    {
      name: 'Agoda',
      description: 'Compare hotel deals, boutique properties, and value accommodations.',
      url: generateHotelBookingLink(destination, 'agoda'),
      image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80',
      badge: 'Best Rates',
      color: 'from-emerald-600 to-teal-500'
    }
  ];

  const currentProviders = isTravel ? travelProviders : stayProviders;

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200/80 pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-50 border border-primary-100 mb-3">
              {isTravel ? <Plane className="w-3.5 h-3.5 text-primary-600" /> : <Hotel className="w-3.5 h-3.5 text-primary-600" />}
              <span className="text-[10px] font-extrabold text-primary-700 uppercase tracking-wider">
                {isTravel ? 'Travel Booking Partner' : 'Stay Booking Partner'}
              </span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight font-display">
              {isTravel ? 'Find Your Perfect Flights & Transport' : 'Find Your Premium Stays & Hotels'}
            </h1>
            <p className="text-slate-500 text-sm font-medium mt-1">
              Select one of your trips or search any destination below to book instantly via our trusted partners.
            </p>
          </div>
          
          {/* Quick tab switch */}
          <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 w-fit shrink-0">
            <button
              onClick={() => navigate('/booking/travel')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${
                isTravel ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Plane className="w-4 h-4" /> Travel
            </button>
            <button
              onClick={() => navigate('/booking/stay')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${
                !isTravel ? 'bg-white shadow text-slate-900' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Hotel className="w-4 h-4" /> Stays
            </button>
          </div>
        </div>

        {/* Trips & Custom Destination Selection */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Select Trip Panel */}
          <div className="lg:col-span-8 space-y-4">
            <h2 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary-600" />
              Your Active Trips
            </h2>
            
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2].map(n => (
                  <div key={n} className="h-28 rounded-2xl bg-slate-100 animate-pulse border border-slate-200" />
                ))}
              </div>
            ) : trips && trips.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {trips.map(trip => {
                  const city = trip.stops?.[0]?.city || trip.title.split('—')[0].trim();
                  const isSelected = selectedTripId === trip.id;
                  return (
                    <motion.div
                      key={trip.id}
                      onClick={() => handleTripSelect(trip)}
                      whileHover={{ y: -3, scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between h-28 relative overflow-hidden group shadow-sm ${
                        isSelected
                          ? 'border-primary-500 bg-primary-50/20 shadow-primary-500/5'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex justify-between items-start z-10">
                        <div>
                          <p className="text-xs font-bold text-slate-400 group-hover:text-primary-500/80 transition-colors uppercase tracking-wider">
                            Active Trip
                          </p>
                          <h3 className="font-extrabold text-slate-850 mt-0.5 leading-snug line-clamp-1">
                            {trip.title}
                          </h3>
                        </div>
                        {isSelected && (
                          <span className="w-2.5 h-2.5 rounded-full bg-primary-600 shadow-glow" />
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold z-10">
                        <Navigation className="w-3.5 h-3.5 text-slate-450" />
                        <span>Destination: <strong className="text-slate-800">{city}</strong></span>
                      </div>
                      
                      {/* Subtle decorative glow */}
                      <div className={`absolute -right-6 -bottom-6 w-20 h-20 rounded-full blur-2xl opacity-10 transition-opacity duration-300 group-hover:opacity-20 ${
                        isSelected ? 'bg-primary-600' : 'bg-slate-400'
                      }`} />
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center">
                <p className="text-slate-400 font-bold text-sm">No saved trips yet. Add one below manually!</p>
              </div>
            )}
          </div>

          {/* Custom Search Panel */}
          <div className="lg:col-span-4 space-y-4">
            <h2 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
              <Globe className="w-4 h-4 text-primary-600" />
              Manual Search
            </h2>
            
            <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-5 space-y-4">
              <form onSubmit={handleCustomSearch} className="space-y-3">
                <div>
                  <label className="text-[10px] font-black text-slate-450 uppercase tracking-wider block mb-1.5">
                    Enter City or Country
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={customDest}
                      onChange={(e) => setCustomDest(e.target.value)}
                      placeholder="e.g., Goa, Bali, Tokyo"
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 hover:border-slate-350 focus:border-primary-500 focus:outline-none text-sm font-semibold transition-all"
                    />
                    <Search className="w-4.5 h-4.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-all hover:shadow-lg shadow-sm"
                >
                  Apply Destination <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>

              {destination && (
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-400">Current Destination:</span>
                  <span className="px-2.5 py-1 rounded-lg bg-primary-50 border border-primary-100 text-primary-750 font-bold">
                    📍 {destination}
                  </span>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Booking Cards Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-slate-850 tracking-tight flex items-center gap-2 font-display">
              <Sparkles className="w-5 h-5 text-primary-600 animate-pulse" />
              Pre-filled Bookings for <span className="text-primary-700 font-extrabold underline decoration-wavy decoration-primary-200">{destination || 'Selected City'}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="wait">
              {currentProviders.map((provider, i) => (
                <motion.div
                  key={provider.name}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="group relative h-[380px] rounded-3xl overflow-hidden shadow-[0_15px_35px_rgba(0,0,0,0.06)] border border-slate-200 bg-slate-900"
                >
                  {/* Photo Overlay */}
                  <img
                    src={provider.image}
                    alt={provider.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-40 group-hover:opacity-30"
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent" />
                  
                  {/* Content Container */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-between z-10">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-black tracking-widest uppercase bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-white border border-white/10">
                        {provider.badge}
                      </span>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h3 className="text-2xl font-black text-white tracking-tight leading-none mb-1 font-display">
                          {provider.name}
                        </h3>
                        <p className="text-slate-350 text-xs font-medium leading-relaxed mt-2 line-clamp-3">
                          {provider.description}
                        </p>
                      </div>

                      <motion.a
                        href={provider.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full block text-center py-3.5 rounded-2xl bg-gradient-to-r ${provider.color} text-white font-extrabold text-sm shadow-lg hover:shadow-xl transition-all duration-300`}
                      >
                        Book {isTravel ? 'Travel' : 'Stay'} Now ↗
                      </motion.a>
                    </div>
                  </div>

                  {/* Border shine glow */}
                  <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-white/10 pointer-events-none transition-all duration-350" />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </AppLayout>
  );
}
