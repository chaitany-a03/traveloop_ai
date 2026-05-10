export const formatDate = (date, options = {}) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric', ...options,
  });
};

export const formatCurrency = (amount, currency = 'INR') => {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount || 0);
};

export const getDaysBetween = (start, end) => {
  if (!start || !end) return 0;
  const diff = new Date(end) - new Date(start);
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

export const getTotalBudget = (budget) => {
  if (!budget) return 0;
  return (
    parseFloat(budget.transport_cost || 0) +
    parseFloat(budget.hotel_cost || 0) +
    parseFloat(budget.food_cost || 0) +
    parseFloat(budget.activity_cost || 0) +
    parseFloat(budget.miscellaneous_cost || 0)
  );
};

export const getActivityTotal = (stops) => {
  if (!stops) return 0;
  return stops.reduce((total, stop) =>
    total + (stop.activities || []).reduce((t, a) => t + parseFloat(a.cost || 0), 0), 0);
};

export const CATEGORY_COLORS = {
  sightseeing: { bg: 'bg-blue-100', text: 'text-blue-700', dot: '#3b82f6' },
  food: { bg: 'bg-orange-100', text: 'text-orange-700', dot: '#f97316' },
  adventure: { bg: 'bg-green-100', text: 'text-green-700', dot: '#22c55e' },
  culture: { bg: 'bg-purple-100', text: 'text-purple-700', dot: '#a855f7' },
  shopping: { bg: 'bg-pink-100', text: 'text-pink-700', dot: '#ec4899' },
  nightlife: { bg: 'bg-indigo-100', text: 'text-indigo-700', dot: '#6366f1' },
  relaxation: { bg: 'bg-teal-100', text: 'text-teal-700', dot: '#14b8a6' },
  transport: { bg: 'bg-gray-100', text: 'text-gray-700', dot: '#6b7280' },
  other: { bg: 'bg-slate-100', text: 'text-slate-700', dot: '#64748b' },
};

export const CHECKLIST_CATEGORIES = ['clothing', 'electronics', 'documents', 'essentials', 'other'];

export const CATEGORY_ICONS_MAP = {
  sightseeing: '🗺️',
  food: '🍽️',
  adventure: '🧗',
  culture: '🎭',
  shopping: '🛍️',
  nightlife: '🌃',
  relaxation: '🧘',
  transport: '✈️',
  other: '📌',
};

export const DESTINATION_IMAGES = {
  'Paris': 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800',
  'Tokyo': 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800',
  'New York': 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=800',
  'Bali': 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800',
  'Barcelona': 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800',
  'London': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800',
  'Dubai': 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800',
  'Rome': 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800',
  'default': 'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=800',
};

export const getDestinationImage = (city) => DESTINATION_IMAGES[city] || DESTINATION_IMAGES.default;

export const STATUS_CONFIG = {
  draft: { label: 'Draft', color: 'bg-gray-100 text-gray-600' },
  planned: { label: 'Planned', color: 'bg-blue-100 text-blue-700' },
  ongoing: { label: 'Ongoing', color: 'bg-green-100 text-green-700' },
  completed: { label: 'Completed', color: 'bg-purple-100 text-purple-700' },
};

export const truncate = (str, n) => str && str.length > n ? str.slice(0, n) + '...' : str;
