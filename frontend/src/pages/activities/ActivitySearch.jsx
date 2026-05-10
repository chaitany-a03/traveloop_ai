import { useState, useEffect } from 'react';
import { Search, Filter, DollarSign, Clock, Star } from 'lucide-react';
import { toast } from 'react-hot-toast';
import AppLayout from '../../components/layout/AppLayout';
import { activitiesAPI } from '../../api';
import { CATEGORY_COLORS, CATEGORY_ICONS_MAP, formatCurrency } from '../../utils';

const CATEGORIES = ['all', 'sightseeing', 'food', 'adventure', 'culture', 'shopping', 'nightlife', 'relaxation'];
const CITIES = ['All Cities', 'Paris', 'Tokyo', 'New York', 'Bali', 'Barcelona', 'London', 'Dubai', 'Rome'];

export default function ActivitySearch() {
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({ q: '', city: '', category: '', max_cost: '' });

  const search = async () => {
    setIsLoading(true);
    try {
      const params = {};
      if (filters.q) params.q = filters.q;
      if (filters.city && filters.city !== 'All Cities') params.city = filters.city;
      if (filters.category && filters.category !== 'all') params.category = filters.category;
      if (filters.max_cost) params.max_cost = filters.max_cost;
      const res = await activitiesAPI.search(params);
      setResults(res.data.activities || []);
    } catch { toast.error('Search failed'); }
    finally { setIsLoading(false); }
  };

  useEffect(() => { search(); }, [filters]);

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="page-header">Explore Activities</h1>
          <p className="text-gray-500 mt-1">Discover curated activities for popular destinations</p>
        </div>

        {/* Filters */}
        <div className="card p-5 space-y-4">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input className="input-field pl-10" placeholder="Search activities..."
              value={filters.q} onChange={e => setFilters({ ...filters, q: e.target.value })} />
          </div>
          <div className="flex flex-wrap gap-3">
            <select className="input-field w-auto flex-shrink-0 text-sm"
              value={filters.city} onChange={e => setFilters({ ...filters, city: e.target.value })}>
              {CITIES.map(c => <option key={c} value={c === 'All Cities' ? '' : c}>{c}</option>)}
            </select>
            <div className="relative w-40">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="number" className="input-field pl-8 text-sm" placeholder="Max cost"
                value={filters.max_cost} onChange={e => setFilters({ ...filters, max_cost: e.target.value })} />
            </div>
          </div>
          {/* Category pills */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setFilters({ ...filters, category: cat === 'all' ? '' : cat })}
                className={`px-3 py-1.5 rounded-full text-sm font-semibold capitalize transition-all duration-200 ${
                  (filters.category === cat || (cat === 'all' && !filters.category))
                    ? 'bg-primary-600 text-white shadow-glow'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}>
                {cat !== 'all' && CATEGORY_ICONS_MAP[cat]} {cat === 'all' ? 'All' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div>
          <p className="text-sm text-gray-500 mb-4">{results.length} activities found</p>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array(6).fill(0).map((_, i) => (
                <div key={i} className="card overflow-hidden">
                  <div className="shimmer-bg h-40" />
                  <div className="p-4 space-y-2">
                    <div className="shimmer-bg h-4 w-3/4 rounded" />
                    <div className="shimmer-bg h-3 w-1/2 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : results.length === 0 ? (
            <div className="card p-14 text-center">
              <Search className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No activities match your filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.map((act, i) => {
                const colors = CATEGORY_COLORS[act.category] || CATEGORY_COLORS.other;
                return (
                  <div key={i} className="card-hover group overflow-hidden">
                    <div className="h-40 overflow-hidden relative">
                      <img src={act.image} alt={act.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <div className="absolute bottom-3 left-3">
                        <span className={`badge ${colors.bg} ${colors.text}`}>
                          {CATEGORY_ICONS_MAP[act.category]} {act.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 mb-1">{act.name}</h3>
                      <p className="text-sm text-gray-500 mb-3">{act.city}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                          {act.duration && <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{act.duration}</span>}
                        </div>
                        <span className="font-bold text-accent-600">
                          {act.cost === 0 ? 'Free' : formatCurrency(act.cost)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
