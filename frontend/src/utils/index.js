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

// ─── Mood-based cover images (multiple per mood for variety) ──────────
export const MOOD_COVER_IMAGES = {
  adventure: [
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800',   // mountain peaks
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800',   // snowy mountains at night
    'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800',   // himalayan peaks
    'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=800',   // mountain summit sunrise
    'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800',       // hiking trail
  ],
  relaxation: [
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',   // tropical beach
    'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800',   // beach house sunset
    'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',   // resort pool
    'https://images.unsplash.com/photo-1540202404-a2f29016b523?w=800',      // hammock beach
    'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800',   // luxury spa
  ],
  culture: [
    'https://images.unsplash.com/photo-1518398046578-8cca57782e17?w=800',   // ancient temple
    'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800',   // kyoto temple
    'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800',   // taj mahal
    'https://images.unsplash.com/photo-1548013146-72479768bada?w=800',      // jaipur palace
    'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800',   // colosseum
  ],
  food: [
    'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800',   // restaurant ambience
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800',   // gourmet platter
    'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800',      // grilled food
    'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=800',   // fine dining
    'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800',   // pancakes breakfast
  ],
  nature: [
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800',   // lush green forest
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800',   // sun rays through valley
    'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=800',   // lake mountains
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800',   // foggy green hills
    'https://images.unsplash.com/photo-1446329813274-7c9036bd9a1f?w=800',   // wildflower meadow
  ],
  nightlife: [
    'https://images.unsplash.com/photo-1555985202-12975b0235dc?w=800',     // neon city lights
    'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=800',   // DJ party
    'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=800',   // neon bar street
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800',   // concert crowd
    'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800',   // festival lights
  ],
  family: [
    'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=800',   // family beach
    'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800',   // theme park
    'https://images.unsplash.com/photo-1472162072942-cd5147eb3902?w=800',   // family picnic
    'https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=800',   // travel family
    'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800',   // lake family
  ],
  default: [
    'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=800',
    'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800',
    'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800',
  ],
};

export const MOOD_CONFIG = {
  adventure: { emoji: '🧗', label: 'Adventure', gradient: 'from-orange-600 to-amber-500', bg: 'bg-orange-500', badge: 'bg-orange-500/90', textColor: 'text-orange-600' },
  relaxation: { emoji: '🧘', label: 'Relaxation', gradient: 'from-cyan-600 to-teal-400', bg: 'bg-cyan-500', badge: 'bg-cyan-500/90', textColor: 'text-cyan-600' },
  culture:    { emoji: '🎭', label: 'Culture', gradient: 'from-amber-600 to-yellow-400', bg: 'bg-amber-500', badge: 'bg-amber-500/90', textColor: 'text-amber-600' },
  food:       { emoji: '🍽️', label: 'Food', gradient: 'from-red-600 to-rose-400', bg: 'bg-red-500', badge: 'bg-red-500/90', textColor: 'text-red-600' },
  nature:     { emoji: '🌿', label: 'Nature', gradient: 'from-emerald-600 to-green-400', bg: 'bg-emerald-500', badge: 'bg-emerald-500/90', textColor: 'text-emerald-600' },
  nightlife:  { emoji: '🌃', label: 'Nightlife', gradient: 'from-purple-600 to-violet-500', bg: 'bg-purple-500', badge: 'bg-purple-500/90', textColor: 'text-purple-600' },
  family:     { emoji: '👨‍👩‍👧', label: 'Family', gradient: 'from-pink-600 to-rose-400', bg: 'bg-pink-500', badge: 'bg-pink-500/90', textColor: 'text-pink-600' },
  default:    { emoji: '✈️', label: 'Travel', gradient: 'from-primary-600 to-indigo-500', bg: 'bg-primary-500', badge: 'bg-primary-500/90', textColor: 'text-primary-600' },
};

// Extract the mood from a trip's title or description
export const extractTripMood = (trip) => {
  const searchText = `${trip.title || ''} ${trip.description || ''}`.toLowerCase();
  const moods = ['adventure', 'relaxation', 'culture', 'food', 'nature', 'nightlife', 'family'];
  return moods.find(m => searchText.includes(m)) || 'default';
};

// Get a mood-specific cover image (uses trip id as seed for consistent variety)
export const getMoodCoverImage = (trip) => {
  if (trip.cover_image) return `http://localhost:5000${trip.cover_image}`;
  const mood = extractTripMood(trip);
  const pool = MOOD_COVER_IMAGES[mood] || MOOD_COVER_IMAGES.default;
  // Use a simple hash of the trip id to pick a consistent image from the pool
  const seed = (trip.id || '').toString().split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return pool[seed % pool.length];
};

export const STATUS_CONFIG = {
  draft: { label: 'Draft', color: 'bg-gray-100 text-gray-600' },
  planned: { label: 'Planned', color: 'bg-blue-100 text-blue-700' },
  ongoing: { label: 'Ongoing', color: 'bg-green-100 text-green-700' },
  completed: { label: 'Completed', color: 'bg-purple-100 text-purple-700' },
};

export const truncate = (str, n) => str && str.length > n ? str.slice(0, n) + '...' : str;

export * from './bookingLinks';
