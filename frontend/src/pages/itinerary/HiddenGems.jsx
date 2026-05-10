import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
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
          <button onClick={() => navigate(`/trips/${id}`)} className="btn-ghost p-2">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="page-header">Hidden Gems Near {currentTrip.stops?.[0]?.city || 'Your Trip'}</h1>
            <p className="text-sm text-gray-500 mt-1">AI-curated local favorites based on your destination and travel style.</p>
          </div>
        </div>

        {loadingGems ? (
          <div className="py-20 text-center">
            <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500 font-medium">Discovering local secrets...</p>
          </div>
        ) : hiddenGems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            {hiddenGems.map((gem, i) => (
              <motion.div
                key={gem.placeId || gem.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="card overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                {gem.photoUrl ? (
                  <div className="h-48 overflow-hidden relative">
                    <img src={gem.photoUrl} alt={gem.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white px-2.5 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1">
                      ⭐ {gem.rating} <span className="font-normal opacity-70 text-xs">({gem.totalRatings})</span>
                    </div>
                  </div>
                ) : (
                   <div className="h-48 bg-gray-100 flex items-center justify-center relative">
                    <span className="text-5xl opacity-20">📍</span>
                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white px-2.5 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1">
                      ⭐ {gem.rating} <span className="font-normal opacity-70 text-xs">({gem.totalRatings})</span>
                    </div>
                  </div>
                )}
                <div className="p-5 space-y-3">
                  <div className="flex justify-between items-start gap-3">
                    <h3 className="font-bold text-gray-900 text-lg line-clamp-1">{gem.name}</h3>
                    <span className="bg-primary-50 text-primary-700 text-xs font-semibold px-2 py-1 rounded-full shrink-0 border border-primary-100 shadow-sm">
                      ✨ Local Pick
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 capitalize font-medium">{gem.types?.slice(0,2).join(' • ').replace(/_/g, ' ')} • {gem.distance}</p>
                  <div className="mt-4 p-3.5 bg-gradient-to-r from-accent-50 to-transparent rounded-xl border-l-4 border-accent-400 shadow-sm">
                    <p className="text-sm text-accent-900 italic leading-relaxed">"{gem.whyRecommended}"</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="card p-14 text-center border-2 border-dashed border-gray-200">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">✨</span>
            </div>
            <h3 className="text-lg font-bold text-gray-700 mb-2">No Hidden Gems Found</h3>
            <p className="text-gray-400">We couldn't find any hidden gems for this specific location.</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
