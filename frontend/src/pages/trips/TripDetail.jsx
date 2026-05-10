import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, DollarSign, Calendar, Edit, Wallet, CheckSquare, BookOpen, Share2, LayoutList, Timeline } from 'lucide-react';
import { toast } from 'react-hot-toast';
import AppLayout from '../../components/layout/AppLayout';
import useTripStore from '../../store/tripStore';
import { PageLoader } from '../../components/ui/Skeleton';
import { formatDate, formatCurrency, getTotalBudget, CATEGORY_COLORS, CATEGORY_ICONS_MAP, STATUS_CONFIG, getDestinationImage } from '../../utils';

export default function TripDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentTrip, fetchTrip, updateTrip, isLoading } = useTripStore();
  const [view, setView] = useState('timeline');

  useEffect(() => { fetchTrip(id); }, [id]);

  const handleShare = async () => {
    try {
      await updateTrip(id, { is_public: 'true' });
      const url = `${window.location.origin}/shared/${id}`;
      navigator.clipboard.writeText(url);
      toast.success('Trip is now public! Link copied 🔗');
    } catch { toast.error('Failed to share trip'); }
  };

  if (isLoading || !currentTrip) return <AppLayout><PageLoader /></AppLayout>;

  const totalBudget = getTotalBudget(currentTrip.budget);
  const allActivities = (currentTrip.stops || []).flatMap(s => (s.activities || []).map(a => ({ ...a, city: s.city })));

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3 flex-wrap">
          <button onClick={() => navigate('/trips')} className="btn-ghost p-2"><ArrowLeft className="w-5 h-5" /></button>
          <div className="flex-1">
            <h1 className="page-header">{currentTrip.title}</h1>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button onClick={handleShare} className="btn-secondary text-sm"><Share2 className="w-4 h-4" /> Share</button>
            <button onClick={() => navigate(`/itinerary/${id}`)} className="btn-primary text-sm"><Edit className="w-4 h-4" /> Edit Itinerary</button>
          </div>
        </div>

        {/* Hero cover */}
        <div className="relative h-64 md:h-80 rounded-3xl overflow-hidden shadow-lg">
          <img
            src={currentTrip.cover_image ? `http://localhost:5000${currentTrip.cover_image}` : getDestinationImage(currentTrip.stops?.[0]?.city)}
            alt={currentTrip.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 p-6 text-white">
            <div className="flex flex-wrap gap-2 mb-3">
              <span className={`badge ${STATUS_CONFIG[currentTrip.status]?.color}`}>{STATUS_CONFIG[currentTrip.status]?.label}</span>
              <span className="badge bg-white/20 text-white backdrop-blur-sm">
                <MapPin className="w-3 h-3" /> {(currentTrip.stops || []).length} stops
              </span>
              {totalBudget > 0 && (
                <span className="badge bg-white/20 text-white backdrop-blur-sm">
                  <DollarSign className="w-3 h-3" /> {formatCurrency(totalBudget)}
                </span>
              )}
            </div>
            <p className="text-white/70 text-sm">
              {currentTrip.start_date && `${formatDate(currentTrip.start_date)} → ${formatDate(currentTrip.end_date)}`}
            </p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Budget', icon: Wallet, to: `/budget/${id}`, color: 'text-purple-600 bg-purple-100' },
            { label: 'Checklist', icon: CheckSquare, to: `/checklist/${id}`, color: 'text-green-600 bg-green-100' },
            { label: 'Notes', icon: BookOpen, to: `/notes/${id}`, color: 'text-orange-600 bg-orange-100' },
          ].map(({ label, icon: Icon, to, color }) => (
            <Link key={label} to={to} className="card p-4 flex flex-col items-center gap-2 text-center hover:shadow-soft hover:-translate-y-0.5 transition-all duration-200">
              <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-sm font-semibold text-gray-700">{label}</span>
            </Link>
          ))}
        </div>

        {/* Stops / Timeline */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="section-title">Itinerary</h2>
            <div className="flex bg-gray-100 p-1 rounded-xl gap-1">
              {['timeline', 'list'].map(v => (
                <button key={v} onClick={() => setView(v)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-semibold capitalize transition-all ${view === v ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}>
                  {v}
                </button>
              ))}
            </div>
          </div>

          {(currentTrip.stops || []).length === 0 ? (
            <div className="card p-10 text-center">
              <p className="text-gray-400 mb-4">No stops added yet</p>
              <button onClick={() => navigate(`/itinerary/${id}`)} className="btn-primary mx-auto">Start Building Itinerary</button>
            </div>
          ) : view === 'timeline' ? (
            <div className="relative">
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-300 to-accent-300" />
              <div className="space-y-6 pl-14">
                {(currentTrip.stops || []).sort((a, b) => a.order_index - b.order_index).map((stop, i) => (
                  <div key={stop.id} className="relative">
                    <div className="absolute -left-8 w-4 h-4 rounded-full bg-primary-500 border-2 border-white shadow-glow" />
                    <div className="card p-5">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-9 h-9 bg-primary-100 rounded-xl flex items-center justify-center">
                          <MapPin className="w-5 h-5 text-primary-600" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900">{stop.city}, {stop.country}</h3>
                          {stop.start_date && (
                            <p className="text-xs text-gray-400">
                              <Calendar className="w-3 h-3 inline mr-1" />{formatDate(stop.start_date)} {stop.end_date && `→ ${formatDate(stop.end_date)}`}
                            </p>
                          )}
                        </div>
                      </div>
                      {(stop.activities || []).length > 0 && (
                        <div className="space-y-2">
                          {stop.activities.map(act => {
                            const colors = CATEGORY_COLORS[act.category] || CATEGORY_COLORS.other;
                            return (
                              <div key={act.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                <span className="text-lg">{CATEGORY_ICONS_MAP[act.category]}</span>
                                <div className="flex-1">
                                  <p className="text-sm font-semibold text-gray-800">{act.activity_name}</p>
                                  <div className="flex gap-2 mt-1">
                                    <span className={`badge ${colors.bg} ${colors.text}`}>{act.category}</span>
                                    {act.time && <span className="text-xs text-gray-400">{act.time}</span>}
                                    {act.duration && <span className="text-xs text-gray-400">{act.duration}</span>}
                                  </div>
                                </div>
                                {act.cost > 0 && <span className="text-sm font-bold text-accent-600">{formatCurrency(act.cost)}</span>}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="card divide-y divide-gray-100">
              {(currentTrip.stops || []).map(stop => (
                <div key={stop.id} className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <MapPin className="w-4 h-4 text-primary-500" />
                    <span className="font-bold text-gray-900">{stop.city}, {stop.country}</span>
                    <span className="ml-auto text-xs text-gray-400">{(stop.activities || []).length} activities</span>
                  </div>
                  {stop.activities?.map(act => (
                    <div key={act.id} className="ml-7 flex items-center gap-2 py-1 text-sm text-gray-600">
                      <span>{CATEGORY_ICONS_MAP[act.category]}</span>
                      <span>{act.activity_name}</span>
                      {act.cost > 0 && <span className="ml-auto text-accent-600 font-semibold">{formatCurrency(act.cost)}</span>}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
