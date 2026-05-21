import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import ProtectedRoute from './components/ui/ProtectedRoute';

import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import Dashboard from './pages/dashboard/Dashboard';
import MyTrips from './pages/trips/MyTrips';
import CreateTrip from './pages/trips/CreateTrip';
import TripDetail from './pages/trips/TripDetail';
import ItineraryBuilder from './pages/itinerary/ItineraryBuilder';
import BudgetDashboard from './pages/budget/BudgetDashboard';
import PackingChecklist from './pages/checklist/PackingChecklist';
import TripNotes from './pages/notes/TripNotes';
import ActivitySearch from './pages/activities/ActivitySearch';
import Profile from './pages/profile/Profile';
import SharedTrip from './pages/public/SharedTrip';
import SmartPlanner from './pages/planner/SmartPlanner';
import HiddenGems from './pages/itinerary/HiddenGems';
import DiscoverDestinations from './pages/activities/DiscoverDestinations';
import BookingHub from './pages/booking/BookingHub';

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: '12px',
            background: '#fff',
            color: '#1e293b',
            boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
            fontSize: '14px',
            fontWeight: '500',
          },
          success: { iconTheme: { primary: '#6366f1', secondary: '#fff' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
        }}
      />
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/shared/:id" element={<SharedTrip />} />

        {/* Protected routes */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/trips" element={<ProtectedRoute><MyTrips /></ProtectedRoute>} />
        <Route path="/trips/create" element={<ProtectedRoute><CreateTrip /></ProtectedRoute>} />
        <Route path="/trips/:id" element={<ProtectedRoute><TripDetail /></ProtectedRoute>} />
        <Route path="/itinerary/:id" element={<ProtectedRoute><ItineraryBuilder /></ProtectedRoute>} />
        <Route path="/budget/:id" element={<ProtectedRoute><BudgetDashboard /></ProtectedRoute>} />
        <Route path="/checklist/:id" element={<ProtectedRoute><PackingChecklist /></ProtectedRoute>} />
        <Route path="/hidden-gems/:id" element={<ProtectedRoute><HiddenGems /></ProtectedRoute>} />
        <Route path="/notes/:id" element={<ProtectedRoute><TripNotes /></ProtectedRoute>} />
        <Route path="/activities" element={<ProtectedRoute><ActivitySearch /></ProtectedRoute>} />
        <Route path="/discover" element={<ProtectedRoute><DiscoverDestinations /></ProtectedRoute>} />
        <Route path="/booking/travel" element={<ProtectedRoute><BookingHub /></ProtectedRoute>} />
        <Route path="/booking/stay" element={<ProtectedRoute><BookingHub /></ProtectedRoute>} />
        <Route path="/planner" element={<ProtectedRoute><SmartPlanner /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

        {/* Fallbacks */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
