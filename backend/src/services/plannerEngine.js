/**
 * plannerEngine.js
 * ─────────────────────────────────────────────────────────────────
 * Smart Itinerary Generation Engine for Traveloop.
 * Generates highly realistic, destination-aware, geographically
 * clustered, and mood-personalized itineraries.
 *
 * Exported function:
 *   generateSmartItinerary(options) → Promise<ItineraryResult>
 * ─────────────────────────────────────────────────────────────────
 */

const { searchPlaces, getNearbyPlaces } = require('./googlePlacesService');

// ─── Constants ────────────────────────────────────────────────────

const MAX_PER_DAY = 5;
const MIN_PER_DAY = 2;

const TIME_SLOTS = ['Morning', 'Late Morning', 'Afternoon', 'Late Afternoon', 'Evening'];

const MOOD_QUERIES = {
  Adventure:   ['adventure activities', 'trekking', 'water sports', 'hiking', 'scuba diving'],
  Food:        ['best restaurants', 'local food', 'cafes', 'food street', 'famous cuisine'],
  Nature:      ['waterfalls', 'parks', 'lakes', 'scenic viewpoints', 'nature reserve'],
  Nightlife:   ['beach clubs', 'casino nightlife', 'live music', 'rooftop lounges', 'party places'],
  Culture:     ['museums', 'heritage sites', 'temples', 'monuments', 'historical landmarks'],
  Family:      ['amusement parks', 'zoos', 'science centers', 'family attractions'],
  Relaxation:  ['luxury spas', 'beach cafes', 'resorts', 'massage therapies'],
  default:     ['top tourist attractions', 'must see places', 'hidden gems']
};

const TYPE_BASE_COST = {
  tourist_attraction: 300,
  museum:             250,
  art_gallery:        200,
  amusement_park:    1200,
  zoo:                400,
  aquarium:           500,
  restaurant:         600,
  cafe:               200,
  bar:                400,
  night_club:         800,
  spa:               1500,
  park:               100,
  natural_feature:    150,
  stadium:            500,
  casino:            1000,
  shopping_mall:      800,
  movie_theater:      300,
  default:            250,
};

// ─── Helpers ───────────────────────────────────────────────────────

function getBudgetTier(totalBudget, days) {
  const daily = totalBudget / days;
  if (daily < 2000)  return 'budget';
  if (daily < 6000)  return 'mid';
  return 'premium';
}

const BUDGET_MULTIPLIER = { budget: 0.6, mid: 1.0, premium: 1.8 };
const BUDGET_LABEL = { budget: 'Budget-Friendly', mid: 'Mid-Range', premium: 'Premium' };
const TARGET_UTILIZATION = { budget: 0.75, mid: 0.85, premium: 0.95 };

function resolveBaseCost(types = []) {
  for (const t of types) {
    if (TYPE_BASE_COST[t] !== undefined) return TYPE_BASE_COST[t];
  }
  return TYPE_BASE_COST.default;
}

function getPlaceCategory(types = []) {
  const ts = types.join(' ');
  if (ts.includes('night_club') || ts.includes('bar') || ts.includes('casino')) return 'nightlife';
  if (ts.includes('museum') || ts.includes('art_gallery') || ts.includes('church') || ts.includes('hindu_temple')) return 'culture';
  if (ts.includes('restaurant') || ts.includes('cafe') || ts.includes('bakery') || ts.includes('food')) return 'food';
  if (ts.includes('park') || ts.includes('natural_feature')) return 'nature';
  if (ts.includes('amusement_park') || ts.includes('zoo') || ts.includes('aquarium')) return 'family';
  if (ts.includes('shopping')) return 'shopping';
  return 'sightseeing';
}

function getPreferredTimeSlots(category) {
  switch (category) {
    case 'nightlife': return ['Evening'];
    case 'nature':    return ['Morning', 'Late Morning', 'Late Afternoon'];
    case 'food':      return ['Late Morning', 'Afternoon', 'Evening'];
    case 'culture':   return ['Morning', 'Late Morning', 'Afternoon'];
    case 'family':    return ['Morning', 'Late Morning', 'Afternoon'];
    default:          return ['Morning', 'Late Morning', 'Afternoon', 'Late Afternoon'];
  }
}

// ─── Scoring & Filtering ───────────────────────────────────────────

function scoreAttraction(place, mood, budgetTier, travelType) {
  let score = 0;
  
  // Rating Quality & Popularity
  score += (place.rating || 3.5) * 10;
  if (place.totalRatings > 0) {
    score += Math.min(25, Math.log10(place.totalRatings) * 6);
  }

  const category = getPlaceCategory(place.types);
  
  // Mood Relevance
  const moodMap = { Nightlife: 'nightlife', Culture: 'culture', Food: 'food', Nature: 'nature', Family: 'family' };
  if (category === moodMap[mood]) score += 15;
  
  // Travel Type Compatibility
  if (travelType === 'Family' && category === 'nightlife') score -= 20;
  if (travelType === 'Couple' && category === 'family') score -= 10;
  
  // Budget Compatibility
  if (budgetTier === 'budget' && (place.priceLevel || 0) >= 3) score -= 20;
  if (budgetTier === 'mid'    && (place.priceLevel || 0) >= 4) score -= 10;

  return score;
}

function deduplicate(places) {
  const seenIds   = new Set();
  const seenNames = new Set();
  const result    = [];
  for (const p of places) {
    const normName = p.name.toLowerCase().replace(/\s+/g, ' ').trim();
    if (p.placeId && seenIds.has(p.placeId)) continue;
    if (seenNames.has(normName)) continue;
    if (p.placeId) seenIds.add(p.placeId);
    seenNames.add(normName);
    result.push(p);
  }
  return result;
}

// ─── Geographic Clustering ─────────────────────────────────────────

// Simple Haversine distance in km
function haversineDist(loc1, loc2) {
  if (!loc1 || !loc2) return 0;
  const toRad = x => x * Math.PI / 180;
  const R = 6371; // km
  const dLat = toRad(loc2.lat - loc1.lat);
  const dLon = toRad(loc2.lng - loc1.lng);
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(toRad(loc1.lat)) * Math.cos(toRad(loc2.lat)) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

/**
 * Lightweight proximity-based grouping.
 */
function groupPlacesByProximity(places, numDays) {
  if (places.length === 0) return Array.from({length: numDays}, () => []);
  
  const validPlaces = places.filter(p => p.location && p.location.lat);
  const groups = Array.from({length: numDays}, () => []);
  
  if (validPlaces.length === 0) {
    places.forEach((p, i) => groups[i % numDays].push(p));
    return groups;
  }

  // 1. Pick distinct centers
  const centers = [validPlaces[0]];
  for (let i = 1; i < numDays; i++) {
    let bestCandidate = null;
    let maxDist = -1;
    for (const p of validPlaces) {
      const minDistToCenters = Math.min(...centers.map(c => haversineDist(c.location, p.location)));
      if (minDistToCenters > maxDist) {
        maxDist = minDistToCenters;
        bestCandidate = p;
      }
    }
    centers.push(bestCandidate || validPlaces[Math.floor(Math.random() * validPlaces.length)]);
  }

  // 2. Assign to nearest center
  for (const p of places) {
    if (!p.location) {
      groups[0].push(p);
      continue;
    }
    let closestIdx = 0;
    let minDist = Infinity;
    for (let i = 0; i < centers.length; i++) {
      const d = haversineDist(p.location, centers[i].location);
      if (d < minDist) {
        minDist = d;
        closestIdx = i;
      }
    }
    groups[closestIdx].push(p);
  }
  
  return groups;
}

function getRegionLabel(group, destination) {
  if (!group || group.length === 0) return `Exploring ${destination}`;
  const types = group.map(p => getPlaceCategory(p.types));
  const hasNightlife = types.includes('nightlife');
  const hasNature = types.includes('nature');
  const hasCulture = types.includes('culture');
  
  if (hasCulture && hasNature) return `${destination} Heritage & Scenery`;
  if (hasNightlife) return `${destination} City & Nightlife`;
  if (hasCulture) return `Historic ${destination} Circuit`;
  if (hasNature) return `Scenic ${destination} Trail`;
  return `Classic ${destination} Discovery`;
}

// ─── Day distribution ─────────────────────────────────────────────

function actionsPerDay(days, budgetTier) {
  let base = days <= 2 ? 4 : days <= 5 ? 3 : 2;
  if (budgetTier === 'premium') return Math.min(MAX_PER_DAY, base + 1);
  if (budgetTier === 'budget') return Math.max(MIN_PER_DAY, base - 1);
  return base;
}

/**
 * Assign activities ensuring a humanized flow and preventing repetitive types.
 */
function scheduleHumanizedDay(pool, perDay, costMultiplier) {
  pool.sort((a,b) => b._score - a._score);
  const dayAttractions = [];
  const usedCategories = new Set();
  
  for (let s = 0; s < TIME_SLOTS.length; s++) {
    const slot = TIME_SLOTS[s];
    if (dayAttractions.length >= perDay) break;
    
    let bestIdx = -1;
    for (let i = 0; i < pool.length; i++) {
      const p = pool[i];
      if (p._used) continue;
      
      const cat = getPlaceCategory(p.types);
      const prefSlots = getPreferredTimeSlots(cat);
      
      // Strict exclusions
      if (slot === 'Morning' && cat === 'nightlife') continue;
      if (slot === 'Late Morning' && cat === 'nightlife') continue;
      
      // Try to avoid repetitive categories unless we are desperate
      if (usedCategories.has(cat) && pool.filter(x => !x._used).length > 2) {
        // Skip if there's a better alternative later
        continue; 
      }
      
      // Preference matching
      if (prefSlots.includes(slot) || bestIdx === -1) {
        bestIdx = i;
        if (prefSlots.includes(slot)) break; // Perfect match
      }
    }
    
    if (bestIdx !== -1) {
      pool[bestIdx]._used = true;
      const p = pool[bestIdx];
      usedCategories.add(getPlaceCategory(p.types));
      
      const baseCost = resolveBaseCost(p.types);
      dayAttractions.push({
        name:          p.name,
        placeId:       p.placeId || null,
        address:       p.address || '',
        time:          slot,
        rating:        p.rating || null,
        totalRatings:  p.totalRatings || 0,
        types:         p.types || [],
        location:      p.location || null,
        photoUrl:      p.photoUrl || null,
        estimatedCost: Math.round(baseCost * costMultiplier),
        openNow:       p.openNow,
      });
    }
  }
  
  // Sort chronologically
  dayAttractions.sort((a, b) => TIME_SLOTS.indexOf(a.time) - TIME_SLOTS.indexOf(b.time));
  return dayAttractions;
}

function distributeAcrossDays(attractions, days, mood, budgetTier, costMultiplier, dailyTarget, destination) {
  const perDay = Math.min(MAX_PER_DAY, Math.max(MIN_PER_DAY, actionsPerDay(days, budgetTier)));
  
  // Group geographically
  const clusters = groupPlacesByProximity(attractions, days);
  const dayPlans = [];

  for (let d = 1; d <= days; d++) {
    const clusterPool = clusters[d - 1] || [];
    const dayAttractions = scheduleHumanizedDay(clusterPool, perDay, costMultiplier);
    
    // Inject a meal break hint for days with >= 2 activities
    if (dayAttractions.length >= 2) {
      dayAttractions.splice(
        Math.floor(dayAttractions.length / 2), 0,
        buildMealBreak(d, mood, budgetTier, costMultiplier)
      );
    }

    // Safety Rule: Max 1 enrichment activity per day. Only if budget allows.
    let currentTotal = dayAttractions.reduce((s, a) => s + (a.estimatedCost || 0), 0);
    const realAttractionsCount = dayAttractions.filter(a => !a.isMealBreak && !a.isEnrichment).length;
    
    // Strict Fallback Control: Only inject if we are desperate for places or completely relying on fallback.
    if (currentTotal < dailyTarget * 0.75 && realAttractionsCount < 3) {
      dayAttractions.push(buildExperience(d, mood, budgetTier, costMultiplier, dailyTarget - currentTotal, destination));
    }

    // Sort chronologically (Midday is index 1.5)
    const getSortIdx = time => time === 'Midday' ? 1.5 : TIME_SLOTS.indexOf(time);
    dayAttractions.sort((a, b) => getSortIdx(a.time) - getSortIdx(b.time));

    const dayTotal = dayAttractions.reduce((s, a) => s + (a.estimatedCost || 0), 0);
    const theme = getRegionLabel(clusterPool, destination);

    dayPlans.push({
      day:            d,
      theme,
      activities:     dayAttractions,
      dayTotal,
    });
  }

  return dayPlans;
}

function buildMealBreak(day, mood, budgetTier, costMultiplier) {
  const mealCosts  = { budget: 150, mid: 400, premium: 900 };
  const baseMeal   = mealCosts[budgetTier] || 400;
  const labels     = {
    Food:      '🍽️ Authentic Local Food Discovery',
    Nightlife: '🍹 Sunset Drinks & Snacks',
    Relaxation:'☕ Specialty Café Break',
    default:   '🍛 Curated Lunch Break',
  };
  return {
    name:          labels[mood] || labels.default,
    placeId:       null,
    address:       '',
    time:          'Midday',
    rating:        null,
    totalRatings:  0,
    types:         ['meal_break'],
    location:      null,
    photoUrl:      null,
    estimatedCost: Math.round(baseMeal * costMultiplier),
    isMealBreak:   true,
  };
}

function buildExperience(day, mood, budgetTier, costMultiplier, budgetGap, destination) {
  const isPremium = budgetTier === 'premium';
  const labels = {
    Adventure: isPremium ? `VIP Guided Adventure Tour` : `Guided Nature Walk`,
    Relaxation: isPremium ? `Luxury Spa & Wellness` : `Relaxing Beach Lounge`,
    Culture: isPremium ? `Private Heritage Tour` : `Artisan Workshop Visit`,
    Food: isPremium ? `Premium Rooftop Dining` : `Hidden Gem Street Food Tour`,
    Nature: isPremium ? `Private Scenic Cruise` : `Sunset Picnic`,
    Nightlife: isPremium ? `VIP Club Access & Drinks` : `Local Pub Crawl`,
    Family: isPremium ? `Private Family Experience` : `Local Park Picnic`,
    default: isPremium ? `Curated Premium Local Experience` : `Local Discovery Walk`,
  };
  
  return {
    name:          labels[mood] || labels.default,
    placeId:       null,
    address:       '',
    time:          'Evening',
    rating:        4.8,
    totalRatings:  0,
    types:         ['tourist_attraction'],
    location:      null,
    photoUrl:      null,
    estimatedCost: Math.max(Math.round(400 * costMultiplier), Math.min(budgetGap, Math.round(4000 * costMultiplier))),
    openNow:       true,
    isEnrichment:  true,
  };
}

function buildRecommendations(mood, budgetTier, days, totalAttractions, destination, remainingBudget, budget) {
  const recs = [];
  const moodRecs = {
    Adventure: [`Bring comfortable footwear — ${destination} has excellent outdoor trails.`],
    Relaxation: [`${destination} has excellent spas — pre-book to avoid queues.`],
    Culture: [`Visit museums in ${destination} on weekday mornings for smaller crowds.`],
    Food: [`Try street food at local ${destination} markets for the most authentic flavours.`],
    Nature: [`Early morning visits to natural sites offer the best wildlife sightings.`],
    Nightlife: [`Most venues in ${destination} open after 9 PM — plan dinners early.`],
    Family: [`Book theme parks online to skip ticket queues in ${destination}.`],
  };
  recs.push(...(moodRecs[mood] || []));

  if (remainingBudget > budget * 0.15) {
    recs.push(`You have ₹${remainingBudget.toLocaleString()} remaining in your total budget for premium accommodation and flights.`);
  }

  if (budgetTier === 'budget') {
    recs.push('Prioritized free/public attractions and affordable local eats.');
  } else if (budgetTier === 'mid') {
    recs.push('Local guided experiences have been included to enrich your trip.');
  } else {
    recs.push('Included luxury dining and VIP experiences to maximize your trip.');
  }

  recs.push(`${totalAttractions} curated real attractions clustered intelligently using Google Places data.`);
  return recs;
}

function classifyIntensity(avgActivitiesPerDay) {
  if (avgActivitiesPerDay <= 2) return 'Relaxed Trip 🌿';
  if (avgActivitiesPerDay <= 3) return 'Balanced Trip ✈️';
  if (avgActivitiesPerDay <= 4) return 'Active Trip 🏃';
  return 'Packed Adventure Trip 🔥';
}

function buildDemoAttractions(destination) {
  const destLower = destination.toLowerCase();
  
  if (destLower.includes('goa')) {
    return [
      { name: `Baga Beach`, rating: 4.6, totalRatings: 13200, types: ['natural_feature'], address: 'Goa', priceLevel: 1 },
      { name: `Tito's Lane`, rating: 4.4, totalRatings: 8800, types: ['night_club'], address: 'Goa', priceLevel: 2 },
      { name: `Fort Aguada`, rating: 4.7, totalRatings: 15100, types: ['tourist_attraction'], address: 'Goa', priceLevel: 0 },
      { name: `Curlies Beach Shack`, rating: 4.5, totalRatings: 9700, types: ['restaurant', 'bar'], address: 'Goa', priceLevel: 1 },
      { name: `Dudhsagar Waterfalls`, rating: 4.5, totalRatings: 11400, types: ['natural_feature'], address: 'Goa', priceLevel: 0 },
      { name: `Club Cubana`, rating: 4.8, totalRatings: 6200, types: ['night_club'], address: 'Goa', priceLevel: 3 },
    ];
  }
  
  if (destLower.includes('mumbai')) {
    return [
      { name: `Marine Drive`, rating: 4.8, totalRatings: 45200, types: ['natural_feature'], address: 'Mumbai', priceLevel: 0 },
      { name: `Gateway of India`, rating: 4.7, totalRatings: 58000, types: ['tourist_attraction'], address: 'Mumbai', priceLevel: 0 },
      { name: `Colaba Causeway`, rating: 4.5, totalRatings: 15100, types: ['shopping_mall'], address: 'Mumbai', priceLevel: 1 },
      { name: `Juhu Beach`, rating: 4.3, totalRatings: 32700, types: ['natural_feature'], address: 'Mumbai', priceLevel: 0 },
      { name: `Aer Lounge`, rating: 4.6, totalRatings: 3400, types: ['bar', 'night_club'], address: 'Mumbai', priceLevel: 3 },
      { name: `Elephanta Caves`, rating: 4.6, totalRatings: 16200, types: ['tourist_attraction'], address: 'Mumbai', priceLevel: 1 },
    ];
  }

  // Generic fallback without revealing template names
  return [
    { name: `City Center Plaza`, rating: 4.6, totalRatings: 3200, types: ['tourist_attraction'], address: destination, priceLevel: 1 },
    { name: `National History Museum`, rating: 4.4, totalRatings: 1800, types: ['museum'], address: destination, priceLevel: 1 },
    { name: `Central Gardens`, rating: 4.7, totalRatings: 5100, types: ['park'], address: destination, priceLevel: 0 },
    { name: `Local Street Food Market`, rating: 4.5, totalRatings: 2700, types: ['restaurant'], address: destination, priceLevel: 1 },
    { name: `Grand Avenue Shopping`, rating: 4.5, totalRatings: 1400, types: ['shopping_mall'], address: destination, priceLevel: 2 },
    { name: `Sky View Lounge`, rating: 4.8, totalRatings: 6200, types: ['bar'], address: destination, priceLevel: 2 },
  ];
}

// ─── Main exported function ───────────────────────────────────────

async function generateSmartItinerary({ destination, days, budget, mood, travelType }) {
  const apiKeyPresent = !!process.env.GOOGLE_MAPS_API_KEY && process.env.GOOGLE_MAPS_API_KEY !== 'your_google_maps_api_key_here';

  let rawPlaces = [];
  let dataSource = 'google_places';

  if (apiKeyPresent) {
    // API Capped Batching: Max 4 queries total to prevent exhaustion
    const moodQueries = (MOOD_QUERIES[mood] || MOOD_QUERIES.default).slice(0, 3);
    const baseQuery = 'top attractions';
    
    const allQueries = [baseQuery, ...moodQueries].map(q => searchPlaces(destination, q).catch(() => []));
    const queryResults = await Promise.all(allQueries);
    
    let combined = queryResults.flat();
    
    // Nearby Search logic for richer discovery (only if we found a good central hub)
    if (combined.length > 0 && combined[0].location) {
      try {
        const nearbyType = mood === 'Food' ? 'restaurant' : mood === 'Nightlife' ? 'bar' : 'tourist_attraction';
        const nearby = await getNearbyPlaces(combined[0].location.lat, combined[0].location.lng, nearbyType, 5000);
        combined = [...combined, ...nearby];
      } catch (e) {
        // Safe fail
      }
    }
    rawPlaces = combined;
  } else {
    rawPlaces  = buildDemoAttractions(destination);
    dataSource = 'demo_data';
  }

  const unique = deduplicate(rawPlaces);

  const budgetTier    = getBudgetTier(budget, days);
  const costMultiplier = BUDGET_MULTIPLIER[budgetTier];
  const targetRate = TARGET_UTILIZATION[budgetTier];
  const assumedFixedCosts = (budget * 0.25) + (budget * 0.10);
  const dailyTarget = Math.max(0, (budget * targetRate) - assumedFixedCosts) / days;

  const scored = unique
    .map(p => ({ ...p, _score: scoreAttraction(p, mood, budgetTier, travelType) }))
    .sort((a, b) => b._score - a._score);

  const dayPlans = distributeAcrossDays(scored, days, mood, budgetTier, costMultiplier, dailyTarget, destination);

  const estimatedItineraryCost = dayPlans.reduce((s, d) => s + d.dayTotal, 0);
  const estimatedBudget = Math.round(estimatedItineraryCost + assumedFixedCosts);
  const avgDailySpend   = Math.round(estimatedBudget / days);

  const totalAttractions = dayPlans.reduce((s, d) => s + d.activities.filter(a => !a.isMealBreak).length, 0);
  const intensity = classifyIntensity(totalAttractions / days);

  const budgetUtilization = Math.min(100, Math.round((estimatedBudget / budget) * 100));
  const remainingBudget = Math.max(0, budget - estimatedBudget);

  const experienceLevels = { budget: 'Budget Explorer', mid: 'Comfort Standard', premium: 'Premium Luxury' };
  const tripRichnessMapping = { budget: 'Standard', mid: 'Balanced', premium: 'High' };

  const budgetStatus = remainingBudget > 0
    ? `Within budget (₹${remainingBudget.toLocaleString()} remaining)`
    : `Slightly over budget by ₹${Math.abs(remainingBudget).toLocaleString()}`;

  const recommendations = buildRecommendations(mood, budgetTier, days, totalAttractions, destination, remainingBudget, budget);

  return {
    summary: {
      destination, days, travelType: travelType || 'Solo', mood,
      tripStyle: `${mood} — ${travelType || 'Solo'}`, budgetInput: budget,
      estimatedBudget, budgetCategory: BUDGET_LABEL[budgetTier], budgetStatus,
    },
    metadata: {
      totalAttractions, avgDailySpend, tripIntensity: intensity,
      budgetUtilization, remainingBudget, experienceLevel: experienceLevels[budgetTier],
      tripRichness: tripRichnessMapping[budgetTier], dataSource, generatedAt: new Date().toISOString(),
    },
    itinerary: dayPlans.map(({ day, theme, activities, dayTotal }) => ({
      day, theme, dayTotal,
      activities: activities.map(({ _score, _used, ...rest }) => rest),
    })),
    recommendations,
  };
}

module.exports = { generateSmartItinerary };
