import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Compass, TrendingUp, Star, MapPin } from 'lucide-react';
import AppLayout from '../../components/layout/AppLayout';

const DESTINATIONS = [
  { city: 'Bali', country: 'Indonesia', img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80', tag: '🌺 Tropical', views: '2.4k', desc: 'Lush terraces and ancient temples.' },
  { city: 'Kyoto', country: 'Japan', img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80', tag: '🏯 Culture', views: '1.8k', desc: 'Timeless traditions and serene gardens.' },
  { city: 'Santorini', country: 'Greece', img: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?auto=format&fit=crop&w=1200&q=80', tag: '🌊 Coast', views: '3.1k', desc: 'Iconic sunsets and white-washed cliffs.' },
  { city: 'Swiss Alps', country: 'Switzerland', img: 'https://images.unsplash.com/photo-1531366936337-7c912a4588c7?auto=format&fit=crop&w=1200&q=80', tag: '🏔️ Nature', views: '1.2k', desc: 'Majestic peaks and pristine lakes.' },
  { city: 'Dubai', country: 'UAE', img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80', tag: '🏙️ Luxury', views: '4.5k', desc: 'Futuristic skylines and desert dunes.' },
  { city: 'Amalfi Coast', country: 'Italy', img: 'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?auto=format&fit=crop&w=1200&q=80', tag: '🍷 Romance', views: '2.9k', desc: 'Dramatic coastlines and culinary magic.' },
  { city: 'Reykjavik', country: 'Iceland', img: 'https://images.unsplash.com/photo-1476610182048-b716b8518aae?auto=format&fit=crop&w=1200&q=80', tag: '❄️ Adventure', views: '1.5k', desc: 'Northern lights and volcanic landscapes.' },
  { city: 'Cape Town', country: 'South Africa', img: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?auto=format&fit=crop&w=1200&q=80', tag: '🦁 Safari', views: '2.1k', desc: 'Table mountain and vibrant culture.' }
];

export default function DiscoverDestinations() {
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
    <AppLayout>
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="max-w-7xl mx-auto space-y-8"
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10">
          <div>
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-50 border border-primary-100 mb-4">
              <Compass className="w-4 h-4 text-primary-600" />
              <span className="text-primary-700 text-sm font-bold tracking-wide">Inspiration</span>
            </motion.div>
            <motion.h1 variants={itemVariants} className="text-4xl md:text-5xl font-black font-display text-gray-900 tracking-tight mb-3">
              Discover Destinations
            </motion.h1>
            <motion.p variants={itemVariants} className="text-lg text-gray-500 font-medium max-w-2xl">
              Immerse yourself in our curated selection of the world's most breathtaking locations. Let AI craft the perfect itinerary when you find your dream spot.
            </motion.p>
          </div>
          <motion.div variants={itemVariants} className="hidden lg:flex items-center gap-2 bg-white px-5 py-3 rounded-2xl border border-gray-100 shadow-soft">
            <TrendingUp className="w-5 h-5 text-accent-500" />
            <span className="font-bold text-gray-800">Trending Global Spots</span>
          </motion.div>
        </div>

        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {DESTINATIONS.map((dest, i) => (
            <motion.div 
              key={dest.city}
              whileHover={{ y: -8 }}
              onClick={() => navigate('/planner')}
              className="group relative h-[450px] rounded-[2rem] overflow-hidden cursor-pointer shadow-xl hover:shadow-2xl transition-all duration-500"
            >
              <img 
                src={dest.img} 
                alt={dest.city} 
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
              
              <div className="absolute top-5 right-5 bg-white/20 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full border border-white/20 shadow-lg">
                {dest.tag}
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-3xl font-black text-white font-display mb-1">{dest.city}</h3>
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-4 h-4 text-gray-300" />
                  <p className="text-gray-300 font-medium">{dest.country}</p>
                </div>
                
                <p className="text-white/80 text-sm leading-relaxed mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                  {dest.desc}
                </p>

                <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-150">
                  <span className="text-white text-xs font-bold flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                    <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400"/> {dest.views} explorers
                  </span>
                  <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center">
                    <Compass className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </AppLayout>
  );
}
