import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, X, Calendar, FileText, Tag } from 'lucide-react';
import { toast } from 'react-hot-toast';
import AppLayout from '../../components/layout/AppLayout';
import useTripStore from '../../store/tripStore';

const STATUSES = ['draft', 'planned', 'ongoing', 'completed'];

export default function CreateTrip() {
  const [form, setForm] = useState({ title: '', description: '', start_date: '', end_date: '', status: 'planned' });
  const [coverPreview, setCoverPreview] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileRef = useRef();
  const { createTrip } = useTripStore();
  const navigate = useNavigate();

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return toast.error('Trip title is required');
    setIsLoading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => v && formData.append(k, v));
      if (coverFile) formData.append('cover_image', coverFile);
      const trip = await createTrip(formData);
      toast.success('Trip created! Start building your itinerary 🗺️');
      navigate(`/itinerary/${trip.id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create trip');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate(-1)} className="btn-ghost p-2">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="page-header">Create New Trip</h1>
            <p className="text-gray-500 text-sm mt-0.5">Fill in the details to get started</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Cover Image */}
          <div className="card overflow-hidden">
            <div
              className={`relative h-52 bg-gradient-to-br from-primary-100 to-accent-100 cursor-pointer group flex items-center justify-center ${coverPreview ? '' : 'border-2 border-dashed border-primary-200'}`}
              onClick={() => fileRef.current?.click()}
            >
              {coverPreview ? (
                <>
                  <img src={coverPreview} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white font-semibold flex items-center gap-2"><Upload className="w-5 h-5" /> Change Image</span>
                  </div>
                  <button type="button" onClick={(e) => { e.stopPropagation(); setCoverPreview(null); setCoverFile(null); }}
                    className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow">
                    <X className="w-4 h-4 text-gray-600" />
                  </button>
                </>
              ) : (
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary-200 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Upload className="w-6 h-6 text-primary-600" />
                  </div>
                  <p className="text-primary-600 font-semibold">Upload cover image</p>
                  <p className="text-gray-400 text-sm mt-1">PNG, JPG, WebP up to 5MB</p>
                </div>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />

            <div className="p-6 space-y-5">
              {/* Title */}
              <div>
                <label className="label flex items-center gap-2"><FileText className="w-4 h-4" /> Trip Title *</label>
                <input className="input-field" placeholder="e.g. Summer Europe Adventure 2024"
                  value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
              </div>

              {/* Description */}
              <div>
                <label className="label">Description</label>
                <textarea className="input-field resize-none" rows={3} placeholder="What's this trip about?"
                  value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label flex items-center gap-2"><Calendar className="w-4 h-4" /> Start Date</label>
                  <input type="date" className="input-field"
                    value={form.start_date} onChange={e => setForm({ ...form, start_date: e.target.value })} />
                </div>
                <div>
                  <label className="label flex items-center gap-2"><Calendar className="w-4 h-4" /> End Date</label>
                  <input type="date" className="input-field"
                    value={form.end_date} onChange={e => setForm({ ...form, end_date: e.target.value })} min={form.start_date} />
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="label flex items-center gap-2"><Tag className="w-4 h-4" /> Status</label>
                <select className="input-field" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                  {STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button type="button" onClick={() => navigate(-1)} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={isLoading} className="btn-primary flex-1">
              {isLoading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Create Trip & Build Itinerary →'}
            </button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
