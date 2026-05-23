import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles, MapPin } from 'lucide-react';
import AppLayout from '../../components/layout/AppLayout';
import useTripStore from '../../store/tripStore';
import { hiddenGemsAPI } from '../../api';
import { PageLoader } from '../../components/ui/Skeleton';

export default function HiddenGems() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentTrip, fetchTrip, isLoading } = useTripStore();
  const [hiddenGems, setHiddenGems] = useState([]);
  const [loadingGems, setLoadingGems] = useState(false);

  useEffect(() => {
    fetchTrip(id);
  }, [id]);

  useEffect(() => {
    const fetchGems = async () => {
      setLoadingGems(true);
      try {
        const res = await hiddenGemsAPI.getForTrip(id);
        if (res.data.success) {
          setHiddenGems(res.data.hiddenGems);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingGems(false);
      }
    };
    if (currentTrip && currentTrip.id) fetchGems();
  }, [id, currentTrip?.id]);

  if (isLoading || !currentTrip) return <AppLayout><PageLoader /></AppLayout>;

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(`/trips/${id}`)} className="btn-ghost p-2 hover:bg-slate-100 rounded-xl">
            <ArrowLeft className="w-5 h-5 text-slate-700" />
          </button>
          <div>
            <h1 className="page-header text-slate-900">Hidden Gems Near {currentTrip.stops?.[0]?.city || 'Your Trip'}</h1>
            <p className="text-sm text-slate-500 mt-1">AI-curated local favorites based on your destination and travel style.</p>
          </div>
        </div>

        {loadingGems ? (
          <div className="py-20 text-center">
            <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-500 font-medium">Discovering local secrets...</p>
          </div>
        ) : hiddenGems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            {hiddenGems.map((gem, i) => (
              <motion.div
                key={gem.placeId || gem.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white border border-slate-200/60 rounded-[2rem] shadow-sm hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] hover:-translate-y-1.5 overflow-hidden group transition-all duration-500"
              >
                {gem.photoUrl ? (
                  <div className="h-48 overflow-hidden relative">
                    <img src={gem.photoUrl} alt={gem.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md text-white px-2.5 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1 border border-white/10">
                      ⭐ {gem.rating} <span className="font-normal opacity-70 text-xs">({gem.totalRatings})</span>
                    </div>
                  </div>
                ) : (
                  <div className="h-48 bg-slate-50 flex items-center justify-center relative border-b border-slate-100">
                    <span className="text-5xl opacity-20">📍</span>
                    <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md text-white px-2.5 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1 border border-white/10">
                      ⭐ {gem.rating} <span className="font-normal opacity-70 text-xs">({gem.totalRatings})</span>
                    </div>
                  </div>
                )}
                <div className="p-5 space-y-3.5">
                  <div className="flex justify-between items-start gap-3">
                    <h3 className="font-extrabold text-slate-900 text-lg line-clamp-1">{gem.name}</h3>
                    <span className="bg-indigo-50 text-indigo-700 text-xs font-black px-2.5 py-1 rounded-full shrink-0 border border-indigo-100 shadow-sm flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> Local Pick
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-500 capitalize tracking-wide">
                    {gem.types?.slice(0, 2).join(' • ').replace(/_/g, ' ')} • {gem.distance}
                  </p>
                  <div className="mt-4 p-4 bg-indigo-50/40 border-l-2 border-indigo-500 rounded-2xl">
                    <p className="text-sm text-slate-700 italic leading-relaxed font-medium">
                      "{gem.whyRecommended}"
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-slate-200/60 border-dashed rounded-[2rem] p-16 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-indigo-50 border border-indigo-100 rounded-3xl flex items-center justify-center mb-6">
              <Sparkles className="w-6 h-6 text-indigo-600 animate-pulse" />
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900 font-display mb-2">No Hidden Gems Found</h3>
            <p className="text-slate-500 max-w-sm mx-auto leading-relaxed">
              We couldn't find any hidden gems for this specific location. Try exploring standard activities or planning a different route.
            </p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
