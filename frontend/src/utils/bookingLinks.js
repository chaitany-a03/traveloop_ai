export const generateFlightBookingLink = (destination, provider = 'skyscanner') => {
  if (provider.toLowerCase() === 'makemytrip') {
    return 'https://www.makemytrip.com/flights/';
  }
  // Default to Skyscanner
  return 'https://www.skyscanner.com';
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
