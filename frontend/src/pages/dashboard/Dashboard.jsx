import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Map, Wallet, Globe, Calendar, ArrowRight, TrendingUp } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import useTripStore from '../../store/tripStore';
import AppLayout from '../../components/layout/AppLayout';
import { StatCardSkeleton, CardSkeleton } from '../../components/ui/Skeleton';
import { formatDate, formatCurrency, getTotalBudget, STATUS_CONFIG, getDestinationImage } from '../../utils';

const RECOMMENDED = [
  { city: 'Bali', country: 'Indonesia', img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400', tag: '🌺 Tropical' },
  { city: 'Tokyo', country: 'Japan', img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400', tag: '🏯 Culture' },
  { city: 'Paris', country: 'France', img: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400', tag: '🗼 Iconic' },
  { city: 'Barcelona', country: 'Spain', img: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=400', tag: '⛱️ Beach' },
  { city: 'New York', country: 'USA', img: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=400', tag: '🗽 Urban' },
];

export default function Dashboard() {
  const { user } = useAuthStore();
  const { trips, fetchTrips, isLoading } = useTripStore();
  const navigate = useNavigate();

  useEffect(() => { fetchTrips(); }, []);

  const totalBudget = trips.reduce((sum, t) => sum + getTotalBudget(t.budget), 0);
  const countries = [...new Set(trips.flatMap(t => (t.stops || []).map(s => s.country)))].length;
  const upcoming = trips.filter(t => t.status === 'planned' && new Date(t.start_date) > new Date()).length;
  const recent = trips.slice(0, 4);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Hero */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 via-primary-700 to-accent-600 p-8 md:p-10 text-white">
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1200)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <p className="text-primary-200 font-medium mb-1">{greeting} 👋</p>
              <h1 className="text-3xl md:text-4xl font-bold font-display mb-3">
                {user?.name?.split(' ')[0]}, ready to explore?
              </h1>
              <p className="text-primary-100 text-lg">You have {trips.length} trip{trips.length !== 1 ? 's' : ''} planned. Keep the adventure going!</p>
            </div>
            <button onClick={() => navigate('/trips/create')} className="flex-shrink-0 flex items-center gap-2 bg-white text-primary-600 font-bold px-6 py-3 rounded-2xl hover:bg-primary-50 transition-all duration-200 shadow-lg hover:shadow-xl">
              <Plus className="w-5 h-5" /> Plan New Trip
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {isLoading ? Array(4).fill(0).map((_, i) => <StatCardSkeleton key={i} />) : (
            <>
              <div className="stat-card">
                <div className="stat-icon bg-primary-100"><Map className="w-6 h-6 text-primary-600" /></div>
                <div><p className="text-xs text-gray-500 font-medium">Total Trips</p><p className="text-2xl font-bold text-gray-900">{trips.length}</p></div>
              </div>
              <div className="stat-card">
                <div className="stat-icon bg-accent-100"><Calendar className="w-6 h-6 text-accent-600" /></div>
                <div><p className="text-xs text-gray-500 font-medium">Upcoming</p><p className="text-2xl font-bold text-gray-900">{upcoming}</p></div>
              </div>
              <div className="stat-card">
                <div className="stat-icon bg-green-100"><Globe className="w-6 h-6 text-green-600" /></div>
                <div><p className="text-xs text-gray-500 font-medium">Countries</p><p className="text-2xl font-bold text-gray-900">{countries}</p></div>
              </div>
              <div className="stat-card">
                <div className="stat-icon bg-purple-100"><Wallet className="w-6 h-6 text-purple-600" /></div>
                <div><p className="text-xs text-gray-500 font-medium">Total Budget</p><p className="text-xl font-bold text-gray-900">{formatCurrency(totalBudget)}</p></div>
              </div>
            </>
          )}
        </div>

        {/* Recent Trips */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="section-title">Recent Trips</h2>
            <button onClick={() => navigate('/trips')} className="text-sm text-primary-600 font-semibold flex items-center gap-1 hover:underline">
              View all <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array(3).fill(0).map((_, i) => <CardSkeleton key={i} />)}
            </div>
          ) : recent.length === 0 ? (
            <div className="card p-12 text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Map className="w-8 h-8 text-primary-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">No trips yet</h3>
              <p className="text-gray-500 mb-6">Start planning your first adventure!</p>
              <button onClick={() => navigate('/trips/create')} className="btn-primary mx-auto">
                <Plus className="w-4 h-4" /> Create First Trip
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {recent.map(trip => (
                <div key={trip.id} className="card-hover group" onClick={() => navigate(`/trips/${trip.id}`)}>
                  <div className="h-44 overflow-hidden relative">
                    <img
                      src={trip.cover_image ? `http://localhost:5000${trip.cover_image}` : getDestinationImage(trip.stops?.[0]?.city)}
                      alt={trip.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <span className={`absolute top-3 right-3 badge ${STATUS_CONFIG[trip.status]?.color}`}>
                      {STATUS_CONFIG[trip.status]?.label}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-gray-900 text-lg mb-1 line-clamp-1">{trip.title}</h3>
                    <p className="text-sm text-gray-500 mb-3">
                      {trip.start_date ? formatDate(trip.start_date) : 'No dates set'}
                      {trip.end_date && ` → ${formatDate(trip.end_date)}`}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">{(trip.stops || []).length} stops</span>
                      <span className="text-sm font-semibold text-primary-600">
                        {formatCurrency(getTotalBudget(trip.budget))}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recommended Destinations */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="section-title">Recommended Destinations</h2>
            <div className="flex items-center gap-1 text-xs text-gray-400"><TrendingUp className="w-4 h-4" /> Trending</div>
          </div>
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
            {RECOMMENDED.map(dest => (
              <div key={dest.city} onClick={() => navigate('/trips/create')}
                className="flex-shrink-0 w-48 rounded-2xl overflow-hidden cursor-pointer group shadow-card hover:shadow-soft hover:-translate-y-1 transition-all duration-300">
                <div className="relative h-32">
                  <img src={dest.img} alt={dest.city} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-3 text-white">
                    <p className="font-bold text-sm">{dest.city}</p>
                    <p className="text-xs text-white/70">{dest.country}</p>
                  </div>
                  <span className="absolute top-2 right-2 bg-white/90 text-xs font-semibold px-2 py-0.5 rounded-full">{dest.tag}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
