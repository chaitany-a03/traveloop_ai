import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, DollarSign, Calendar, Copy, Check, Plane } from 'lucide-react';
import { tripsAPI } from '../../api';
import { formatDate, formatCurrency, getTotalBudget, CATEGORY_COLORS, CATEGORY_ICONS_MAP } from '../../utils';

export default function SharedTrip() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    tripsAPI.getPublic(id)
      .then(res => { setTrip(res.data.trip); setIsLoading(false); })
      .catch(() => { setError('Trip not found or not public'); setIsLoading(false); });
  }, [id]);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-surface-50">
      <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-surface-50 gap-4">
      <Plane className="w-12 h-12 text-gray-300" />
      <h2 className="text-xl font-bold text-gray-600">Trip not found</h2>
      <p className="text-gray-400">{error}</p>
      <button onClick={() => navigate('/login')} className="btn-primary">Go to Traveloop</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
              <Plane className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900">Traveloop</span>
            <span className="text-gray-300 mx-2">·</span>
            <span className="text-gray-500 text-sm">Shared Itinerary</span>
          </div>
          <div className="flex gap-2">
            <button onClick={handleCopy} className="btn-secondary text-sm">
              {copied ? <><Check className="w-4 h-4 text-green-500" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Link</>}
            </button>
            <button onClick={() => navigate('/signup')} className="btn-primary text-sm">Plan Your Own Trip</button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-8 animate-fade-in">
        {/* Trip info */}
        <div>
          <h1 className="text-3xl font-bold font-display text-gray-900 mb-2">{trip.title}</h1>
          {trip.description && <p className="text-gray-500 text-lg mb-4">{trip.description}</p>}
          <div className="flex flex-wrap gap-3 text-sm text-gray-500">
            {trip.user && <span className="flex items-center gap-1.5">by <strong>{trip.user.name}</strong></span>}
            {trip.start_date && <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {formatDate(trip.start_date)} – {formatDate(trip.end_date)}</span>}
            <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {(trip.stops || []).length} stops</span>
            {getTotalBudget(trip.budget) > 0 && <span className="flex items-center gap-1"><DollarSign className="w-4 h-4" /> {formatCurrency(getTotalBudget(trip.budget))}</span>}
          </div>
        </div>

        {/* Itinerary */}
        <div className="relative">
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-300 to-accent-300" />
          <div className="space-y-6 pl-14">
            {(trip.stops || []).sort((a, b) => a.order_index - b.order_index).map((stop, i) => (
              <div key={stop.id} className="relative">
                <div className="absolute -left-8 w-4 h-4 rounded-full bg-primary-500 border-2 border-white shadow-glow" />
                <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 bg-primary-100 rounded-xl flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{stop.city}, {stop.country}</h3>
                      {stop.start_date && <p className="text-xs text-gray-400">{formatDate(stop.start_date)} {stop.end_date && `→ ${formatDate(stop.end_date)}`}</p>}
                    </div>
                  </div>
                  {(stop.activities || []).map(act => {
                    const colors = CATEGORY_COLORS[act.category] || CATEGORY_COLORS.other;
                    return (
                      <div key={act.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl mb-2">
                        <span className="text-lg">{CATEGORY_ICONS_MAP[act.category]}</span>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-800">{act.activity_name}</p>
                          <div className="flex gap-2 mt-1">
                            <span className={`badge ${colors.bg} ${colors.text} text-xs`}>{act.category}</span>
                            {act.duration && <span className="text-xs text-gray-400">{act.duration}</span>}
                          </div>
                        </div>
                        {act.cost > 0 && <span className="text-sm font-bold text-accent-600">{formatCurrency(act.cost)}</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-br from-primary-600 to-accent-500 rounded-3xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-2">Love this trip?</h3>
          <p className="text-white/80 mb-6">Join Traveloop and start planning your own dream adventure for free.</p>
          <button onClick={() => navigate('/signup')} className="bg-white text-primary-600 font-bold px-8 py-3 rounded-xl hover:bg-primary-50 transition-colors">
            Get Started Free →
          </button>
        </div>
      </div>
    </div>
  );
}
