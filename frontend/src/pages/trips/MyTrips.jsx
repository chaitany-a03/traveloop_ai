import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Trash2, Edit, Eye, Map, Filter } from 'lucide-react';
import { toast } from 'react-hot-toast';
import AppLayout from '../../components/layout/AppLayout';
import useTripStore from '../../store/tripStore';
import { CardSkeleton } from '../../components/ui/Skeleton';
import { formatDate, formatCurrency, getTotalBudget, STATUS_CONFIG, getDestinationImage } from '../../utils';

const FILTERS = ['all', 'planned', 'ongoing', 'completed', 'draft'];

export default function MyTrips() {
  const { trips, fetchTrips, deleteTrip, isLoading } = useTripStore();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => { fetchTrips(); }, []);

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!confirm('Delete this trip? This cannot be undone.')) return;
    await deleteTrip(id);
    toast.success('Trip deleted');
  };

  const filtered = trips
    .filter(t => filter === 'all' || t.status === filter)
    .filter(t => !search || t.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="page-header">My Trips</h1>
            <p className="text-gray-500 mt-1">{trips.length} trip{trips.length !== 1 ? 's' : ''} planned</p>
          </div>
          <button onClick={() => navigate('/trips/create')} className="btn-primary">
            <Plus className="w-4 h-4" /> Plan New Trip
          </button>
        </div>

        {/* Filters + Search */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input className="input-field pl-10" placeholder="Search trips..." value={search}
              onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="flex gap-2 flex-wrap">
            {FILTERS.map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold capitalize transition-all duration-200 ${
                  filter === f ? 'bg-primary-600 text-white shadow-glow' : 'bg-white border border-gray-200 text-gray-600 hover:border-primary-300'
                }`}>
                {f === 'all' ? 'All Trips' : f}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array(6).fill(0).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="card p-16 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Map className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-700 mb-2">No trips found</h3>
            <p className="text-gray-400 mb-6">{search ? 'Try a different search term' : 'Start planning your first adventure!'}</p>
            {!search && (
              <button onClick={() => navigate('/trips/create')} className="btn-primary mx-auto">
                <Plus className="w-4 h-4" /> Create Trip
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(trip => (
              <div key={trip.id} className="card group overflow-hidden hover:shadow-soft hover:-translate-y-1 transition-all duration-300">
                {/* Image */}
                <div className="h-48 relative overflow-hidden cursor-pointer" onClick={() => navigate(`/trips/${trip.id}`)}>
                  <img
                    src={trip.cover_image ? `http://localhost:5000${trip.cover_image}` : getDestinationImage(trip.stops?.[0]?.city)}
                    alt={trip.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <span className={`absolute top-3 left-3 badge ${STATUS_CONFIG[trip.status]?.color}`}>
                    {STATUS_CONFIG[trip.status]?.label}
                  </span>
                  {/* Quick actions */}
                  <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button onClick={(e) => { e.stopPropagation(); navigate(`/itinerary/${trip.id}`); }}
                      className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow hover:bg-primary-50 transition-colors">
                      <Edit className="w-4 h-4 text-gray-700" />
                    </button>
                    <button onClick={(e) => handleDelete(e, trip.id)}
                      className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow hover:bg-red-50 transition-colors">
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-bold text-gray-900 text-lg mb-1 truncate cursor-pointer"
                    onClick={() => navigate(`/trips/${trip.id}`)}>
                    {trip.title}
                  </h3>
                  {trip.description && (
                    <p className="text-sm text-gray-500 mb-3 line-clamp-2">{trip.description}</p>
                  )}
                  <div className="text-xs text-gray-400 mb-3">
                    {trip.start_date ? `${formatDate(trip.start_date)} → ${formatDate(trip.end_date)}` : 'Dates not set'}
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex gap-3 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Map className="w-3.5 h-3.5" /> {(trip.stops || []).length} stops
                      </span>
                    </div>
                    <span className="font-bold text-primary-600 text-sm">
                      {formatCurrency(getTotalBudget(trip.budget))}
                    </span>
                  </div>
                  {/* Action buttons */}
                  <div className="flex gap-2 mt-4">
                    <button onClick={() => navigate(`/trips/${trip.id}`)} className="btn-secondary flex-1 text-sm py-2">
                      <Eye className="w-4 h-4" /> View
                    </button>
                    <button onClick={() => navigate(`/itinerary/${trip.id}`)} className="btn-primary flex-1 text-sm py-2">
                      <Edit className="w-4 h-4" /> Plan
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
