import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Plane, Menu, X, LayoutDashboard, Map, Search, User, LogOut, Plus, Hotel } from 'lucide-react';
import useAuthStore from '../../store/authStore';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/trips', icon: Map, label: 'My Trips' },
  { to: '/activities', icon: Search, label: 'Explore' },
  { to: '/booking/travel', icon: Plane, label: 'Travel Booking' },
  { to: '/booking/stay', icon: Hotel, label: 'Stay Booking' },
  { to: '/profile', icon: User, label: 'Profile' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <header className="lg:hidden sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100 shadow-sm">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
            <Plane className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold font-display gradient-text">Traveloop</span>
        </div>
        <button onClick={() => setOpen(!open)} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {open && (
        <div className="px-4 pb-4 space-y-1 animate-slide-up border-t border-gray-100 pt-3">
          <button onClick={() => { navigate('/trips/create'); setOpen(false); }} className="btn-primary w-full text-sm mb-3">
            <Plus className="w-4 h-4" /> Plan New Trip
          </button>
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} onClick={() => setOpen(false)}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <Icon className="w-5 h-5" /> {label}
            </NavLink>
          ))}
          <button onClick={handleLogout} className="btn-ghost w-full text-sm text-red-500 hover:bg-red-50">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      )}
    </header>
  );
}
