export const generateFlightBookingLink = (destination, provider = 'skyscanner') => {
  if (!destination) return 'https://www.skyscanner.com';
  const cleanDest = encodeURIComponent(destination.trim());
  if (provider.toLowerCase() === 'makemytrip') {
    return `https://www.makemytrip.com/flight/search?fromCity=Anywhere&toCity=${cleanDest}`;
  }
  // Default to Skyscanner
  return `https://www.skyscanner.com/transport/flights/anywhere/${cleanDest}/`;
};

export const generateHotelBookingLink = (destination, provider = 'booking') => {
  if (!destination) return 'https://www.booking.com';
  const cleanDest = encodeURIComponent(destination.trim());
  const prov = provider.toLowerCase();
  if (prov === 'airbnb') {
    return `https://www.airbnb.com/s/${cleanDest}/homes`;
  }
  if (prov === 'agoda') {
    return `https://www.agoda.com/search?query=${cleanDest}`;
  }
  // Default to Booking.com
  return `https://www.booking.com/searchresults.html?ss=${cleanDest}`;
};
