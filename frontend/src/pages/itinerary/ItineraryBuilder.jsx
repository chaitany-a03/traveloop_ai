import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import {
  ArrowLeft, Plus, GripVertical, MapPin, Trash2, ChevronDown, ChevronUp,
  Clock, DollarSign, Edit3, Check, X, Calendar, Eye
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import AppLayout from '../../components/layout/AppLayout';
import useTripStore from '../../store/tripStore';
import { PageLoader } from '../../components/ui/Skeleton';
import { formatCurrency, CATEGORY_COLORS, CATEGORY_ICONS_MAP, formatDate } from '../../utils';

function ActivityForm({ onAdd, onCancel }) {
  const [form, setForm] = useState({ activity_name: '', category: 'sightseeing', cost: '', duration: '', time: '', notes: '' });
  return (
    <div className="bg-gray-50 rounded-xl p-4 space-y-3 border border-gray-200 animate-slide-up">
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <input className="input-field text-sm" placeholder="Activity name *" value={form.activity_name}
            onChange={e => setForm({ ...form, activity_name: e.target.value })} />
        </div>
        <select className="input-field text-sm" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
          {Object.keys(CATEGORY_COLORS).map(c => <option key={c} value={c}>{CATEGORY_ICONS_MAP[c]} {c}</option>)}
        </select>
        <input className="input-field text-sm" placeholder="Time (e.g. 9:00 AM)" value={form.time}
          onChange={e => setForm({ ...form, time: e.target.value })} />
        <input className="input-field text-sm" type="number" placeholder="Cost (₹)" value={form.cost}
          onChange={e => setForm({ ...form, cost: parseFloat(e.target.value) || '' })} />
        <input className="input-field text-sm" placeholder="Duration (e.g. 2 hrs)" value={form.duration}
          onChange={e => setForm({ ...form, duration: e.target.value })} />
        <div className="col-span-2">
          <input className="input-field text-sm" placeholder="Notes (optional)" value={form.notes}
            onChange={e => setForm({ ...form, notes: e.target.value })} />
        </div>
      </div>
      <div className="flex gap-2 justify-end">
        <button onClick={onCancel} className="btn-ghost text-sm py-1.5 px-3"><X className="w-4 h-4" /></button>
        <button onClick={() => { if (!form.activity_name) return; onAdd(form); }} className="btn-primary text-sm py-1.5 px-4">
          <Check className="w-4 h-4" /> Add Activity
        </button>
      </div>
    </div>
  );
}

function StopCard({ stop, tripId, index, onDelete }) {
  const [expanded, setExpanded] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const { addActivity, deleteActivity } = useTripStore();

  const handleAddActivity = async (data) => {
    try {
      await addActivity(tripId, stop.id, data);
      setShowForm(false);
      toast.success('Activity added');
    } catch { toast.error('Failed to add activity'); }
  };

  const handleDeleteActivity = async (actId) => {
    await deleteActivity(tripId, stop.id, actId);
    toast.success('Activity removed');
  };

  const stopTotal = (stop.activities || []).reduce((s, a) => s + parseFloat(a.cost || 0), 0);

  return (
    <div className="card border-l-4 border-l-primary-500">
      <div className="p-5">
        {/* Stop Header */}
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold text-sm">
            {index + 1}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary-500" />
                  {stop.city}, <span className="text-gray-500 font-normal text-base">{stop.country}</span>
                </h3>
                {(stop.start_date || stop.end_date) && (
                  <p className="text-xs text-gray-400 mt-0.5 ml-6">
                    <Calendar className="w-3 h-3 inline mr-1" />
                    {formatDate(stop.start_date)} {stop.end_date && `→ ${formatDate(stop.end_date)}`}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-accent-600">{formatCurrency(stopTotal)}</span>
                <button onClick={() => onDelete(stop.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
                <button onClick={() => setExpanded(!expanded)} className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors">
                  {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Activities */}
        {expanded && (
          <div className="mt-4 ml-11 space-y-2">
            {(stop.activities || []).length === 0 && !showForm && (
              <p className="text-sm text-gray-400 italic">No activities yet</p>
            )}
            {(stop.activities || []).map(activity => {
              const colors = CATEGORY_COLORS[activity.category] || CATEGORY_COLORS.other;
              return (
                <div key={activity.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl group">
                  <span className="text-lg mt-0.5">{CATEGORY_ICONS_MAP[activity.category]}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-semibold text-gray-800 text-sm">{activity.activity_name}</p>
                      <button onClick={() => handleDeleteActivity(activity.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-all">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-1.5">
                      <span className={`badge ${colors.bg} ${colors.text}`}>{activity.category}</span>
                      {activity.time && <span className="text-xs text-gray-400 flex items-center gap-1"><Clock className="w-3 h-3" />{activity.time}</span>}
                      {activity.duration && <span className="text-xs text-gray-400">{activity.duration}</span>}
                      {activity.cost > 0 && <span className="text-xs font-semibold text-accent-600 flex items-center gap-1"><DollarSign className="w-3 h-3" />{formatCurrency(activity.cost)}</span>}
                    </div>
                  </div>
                </div>
              );
            })}

            {showForm
              ? <ActivityForm onAdd={handleAddActivity} onCancel={() => setShowForm(false)} />
              : <button onClick={() => setShowForm(true)} className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-semibold mt-2 group">
                <div className="w-6 h-6 border-2 border-dashed border-primary-300 rounded-lg flex items-center justify-center group-hover:border-primary-500 transition-colors">
                  <Plus className="w-3.5 h-3.5" />
                </div>
                Add Activity
              </button>
            }
          </div>
        )}
      </div>
    </div>
  );
}

function AddStopForm({ onAdd, onCancel }) {
  const [form, setForm] = useState({ city: '', country: '', start_date: '', end_date: '' });
  return (
    <div className="card p-5 border-2 border-dashed border-primary-300 animate-slide-up">
      <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><MapPin className="w-4 h-4 text-primary-500" /> New Stop</h3>
      <div className="grid grid-cols-2 gap-3">
        <input className="input-field text-sm" placeholder="City *" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} />
        <input className="input-field text-sm" placeholder="Country *" value={form.country} onChange={e => setForm({ ...form, country: e.target.value })} />
        <input type="date" className="input-field text-sm" value={form.start_date} onChange={e => setForm({ ...form, start_date: e.target.value })} />
        <input type="date" className="input-field text-sm" value={form.end_date} min={form.start_date} onChange={e => setForm({ ...form, end_date: e.target.value })} />
      </div>
      <div className="flex gap-2 justify-end mt-4">
        <button onClick={onCancel} className="btn-ghost text-sm">Cancel</button>
        <button onClick={() => { if (!form.city || !form.country) { toast.error('City and country required'); return; } onAdd(form); }} className="btn-primary text-sm">
          <Plus className="w-4 h-4" /> Add Stop
        </button>
      </div>
    </div>
  );
}

export default function ItineraryBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentTrip, fetchTrip, addStop, deleteStop, reorderStops, isLoading } = useTripStore();
  const [showAddStop, setShowAddStop] = useState(false);

  useEffect(() => { fetchTrip(id); }, [id]);

  const handleDragEnd = async (result) => {
    if (!result.destination) return;
    const stops = Array.from(currentTrip.stops);
    const [moved] = stops.splice(result.source.index, 1);
    stops.splice(result.destination.index, 0, moved);
    const reordered = stops.map((s, i) => ({ id: s.id, order_index: i }));
    await reorderStops(id, reordered);
  };

  const handleAddStop = async (data) => {
    try {
      const order_index = (currentTrip?.stops || []).length;
      await addStop(id, { ...data, order_index });
      setShowAddStop(false);
      toast.success(`${data.city} added to itinerary!`);
    } catch { toast.error('Failed to add stop'); }
  };

  const handleDeleteStop = async (stopId) => {
    await deleteStop(id, stopId);
    toast.success('Stop removed');
  };

  if (isLoading || !currentTrip) return <AppLayout><PageLoader /></AppLayout>;

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/trips')} className="btn-ghost p-2"><ArrowLeft className="w-5 h-5" /></button>
            <div>
              <h1 className="page-header">{currentTrip.title}</h1>
              <p className="text-gray-500 text-sm mt-0.5">Itinerary Builder — drag to reorder stops</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => navigate(`/trips/${id}`)} className="btn-secondary text-sm">
              <Eye className="w-4 h-4" /> View Trip
            </button>
            <button onClick={() => navigate(`/budget/${id}`)} className="btn-ghost text-sm border border-gray-200">
              <DollarSign className="w-4 h-4" /> Budget
            </button>
          </div>
        </div>

        {/* Stops count */}
        {currentTrip.stops?.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-gray-500 bg-primary-50 border border-primary-100 rounded-xl px-4 py-2.5">
            <MapPin className="w-4 h-4 text-primary-500" />
            <span>{currentTrip.stops.length} stop{currentTrip.stops.length !== 1 ? 's' : ''} planned · Drag to reorder</span>
          </div>
        )}

        {/* DnD Stops */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="stops">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                {(currentTrip.stops || []).length === 0 && !showAddStop && (
                  <div className="card p-14 text-center border-2 border-dashed border-gray-200">
                    <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <MapPin className="w-8 h-8 text-primary-500" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-700 mb-2">No stops yet</h3>
                    <p className="text-gray-400 mb-6">Add your first destination to start building your itinerary</p>
                    <button onClick={() => setShowAddStop(true)} className="btn-primary mx-auto">
                      <Plus className="w-4 h-4" /> Add First Stop
                    </button>
                  </div>
                )}

                {(currentTrip.stops || []).map((stop, index) => (
                  <Draggable key={stop.id} draggableId={stop.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`relative transition-all duration-200 ${snapshot.isDragging ? 'opacity-90 scale-[1.02] shadow-2xl' : ''}`}
                      >
                        {/* Drag handle */}
                        <div {...provided.dragHandleProps}
                          className="absolute left-0 top-0 bottom-0 w-8 flex items-start pt-5 justify-center cursor-grab active:cursor-grabbing z-10">
                          <GripVertical className="w-4 h-4 text-gray-300 hover:text-gray-500 transition-colors" />
                        </div>
                        <div className="ml-6">
                          <StopCard stop={stop} tripId={id} index={index} onDelete={handleDeleteStop} />
                        </div>
                        {/* Timeline connector */}
                        {index < currentTrip.stops.length - 1 && (
                          <div className="absolute left-[14px] top-full h-4 w-0.5 bg-primary-200 z-10" />
                        )}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        {/* Add Stop */}
        {showAddStop
          ? <AddStopForm onAdd={handleAddStop} onCancel={() => setShowAddStop(false)} />
          : <button onClick={() => setShowAddStop(true)}
            className="w-full py-4 border-2 border-dashed border-primary-200 rounded-2xl text-primary-600 font-semibold hover:border-primary-400 hover:bg-primary-50 transition-all duration-200 flex items-center justify-center gap-2">
            <Plus className="w-5 h-5" /> Add Another Stop
          </button>
        }
      </div>
    </AppLayout>
  );
}
