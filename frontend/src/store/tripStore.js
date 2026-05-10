import { create } from 'zustand';
import { tripsAPI, stopsAPI, activitiesAPI, budgetAPI, checklistAPI, notesAPI } from '../api';

const useTripStore = create((set, get) => ({
  trips: [],
  currentTrip: null,
  budget: null,
  checklist: [],
  notes: [],
  isLoading: false,

  fetchTrips: async () => {
    set({ isLoading: true });
    try {
      const res = await tripsAPI.getAll();
      set({ trips: res.data.trips, isLoading: false });
    } catch { set({ isLoading: false }); }
  },

  fetchTrip: async (id) => {
    set({ isLoading: true });
    try {
      const res = await tripsAPI.getOne(id);
      set({ currentTrip: res.data.trip, isLoading: false });
    } catch { set({ isLoading: false }); }
  },

  createTrip: async (data) => {
    const res = await tripsAPI.create(data);
    set((state) => ({ trips: [res.data.trip, ...state.trips] }));
    return res.data.trip;
  },

  updateTrip: async (id, data) => {
    const res = await tripsAPI.update(id, data);
    set((state) => ({
      trips: state.trips.map(t => t.id === id ? res.data.trip : t),
      currentTrip: state.currentTrip?.id === id ? res.data.trip : state.currentTrip,
    }));
    return res.data.trip;
  },

  deleteTrip: async (id) => {
    await tripsAPI.delete(id);
    set((state) => ({ trips: state.trips.filter(t => t.id !== id) }));
  },

  addStop: async (tripId, data) => {
    const res = await stopsAPI.add(tripId, data);
    set((state) => ({
      currentTrip: state.currentTrip ? {
        ...state.currentTrip,
        stops: [...(state.currentTrip.stops || []), { ...res.data.stop, activities: [] }],
      } : null,
    }));
    return res.data.stop;
  },

  updateStop: async (tripId, stopId, data) => {
    const res = await stopsAPI.update(tripId, stopId, data);
    set((state) => ({
      currentTrip: state.currentTrip ? {
        ...state.currentTrip,
        stops: state.currentTrip.stops.map(s => s.id === stopId ? { ...s, ...res.data.stop } : s),
      } : null,
    }));
  },

  deleteStop: async (tripId, stopId) => {
    await stopsAPI.delete(tripId, stopId);
    set((state) => ({
      currentTrip: state.currentTrip ? {
        ...state.currentTrip,
        stops: state.currentTrip.stops.filter(s => s.id !== stopId),
      } : null,
    }));
  },

  reorderStops: async (tripId, stops) => {
    await stopsAPI.reorder(tripId, stops);
    set((state) => ({
      currentTrip: state.currentTrip ? {
        ...state.currentTrip,
        stops: stops.map(s => state.currentTrip.stops.find(cs => cs.id === s.id)).filter(Boolean),
      } : null,
    }));
  },

  addActivity: async (tripId, stopId, data) => {
    const res = await activitiesAPI.add(tripId, stopId, data);
    set((state) => ({
      currentTrip: state.currentTrip ? {
        ...state.currentTrip,
        stops: state.currentTrip.stops.map(s => s.id === stopId
          ? { ...s, activities: [...(s.activities || []), res.data.activity] }
          : s),
      } : null,
    }));
    return res.data.activity;
  },

  deleteActivity: async (tripId, stopId, actId) => {
    await activitiesAPI.delete(tripId, stopId, actId);
    set((state) => ({
      currentTrip: state.currentTrip ? {
        ...state.currentTrip,
        stops: state.currentTrip.stops.map(s => s.id === stopId
          ? { ...s, activities: s.activities.filter(a => a.id !== actId) }
          : s),
      } : null,
    }));
  },

  fetchBudget: async (tripId) => {
    const res = await budgetAPI.get(tripId);
    set({ budget: res.data.budget });
  },

  saveBudget: async (tripId, data) => {
    const res = await budgetAPI.upsert(tripId, data);
    set({ budget: res.data.budget });
  },

  fetchChecklist: async (tripId) => {
    const res = await checklistAPI.getAll(tripId);
    set({ checklist: res.data.items });
  },

  addChecklistItem: async (tripId, data) => {
    const res = await checklistAPI.add(tripId, data);
    set((state) => ({ checklist: [...state.checklist, res.data.item] }));
  },

  toggleChecklistItem: async (tripId, itemId) => {
    const item = get().checklist.find(i => i.id === itemId);
    const res = await checklistAPI.update(tripId, itemId, { completed: !item.completed });
    set((state) => ({
      checklist: state.checklist.map(i => i.id === itemId ? res.data.item : i),
    }));
  },

  deleteChecklistItem: async (tripId, itemId) => {
    await checklistAPI.delete(tripId, itemId);
    set((state) => ({ checklist: state.checklist.filter(i => i.id !== itemId) }));
  },

  fetchNotes: async (tripId) => {
    const res = await notesAPI.getAll(tripId);
    set({ notes: res.data.notes });
  },

  addNote: async (tripId, data) => {
    const res = await notesAPI.add(tripId, data);
    set((state) => ({ notes: [res.data.note, ...state.notes] }));
  },

  deleteNote: async (tripId, noteId) => {
    await notesAPI.delete(tripId, noteId);
    set((state) => ({ notes: state.notes.filter(n => n.id !== noteId) }));
  },

  clearCurrentTrip: () => set({ currentTrip: null, budget: null, checklist: [], notes: [] }),
}));

export default useTripStore;
