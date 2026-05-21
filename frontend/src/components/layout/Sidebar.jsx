import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Map, Plus, Search, User, LogOut, Plane, ChevronRight, Sparkles, Compass, Hotel
} from 'lucide-react';
import useAuthStore from '../../store/authStore';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/trips', icon: Map, label: 'My Trips' },
  { to: '/activities', icon: Search, label: 'Explore Activities' },
  { to: '/booking/travel', icon: Plane, label: 'Travel Booking' },
  { to: '/booking/stay', icon: Hotel, label: 'Stay Booking' },
  { to: '/discover', icon: Compass, label: 'Discover Destinations' },
];

const AI_NAV = { to: '/planner', icon: Sparkles, label: 'AI Trip Planner', isAI: true };

export default function Sidebar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="hidden lg:flex flex-col w-[280px] bg-gradient-to-b from-white/90 to-white/60 backdrop-blur-2xl border-r border-gray-100/50 min-h-screen sticky top-0 shadow-[8px_0_30px_rgba(0,0,0,0.02)] z-40">
      {/* Logo */}
      <div className="px-6 py-8">
        <div className="flex items-center gap-3 group cursor-pointer" onClick={() => navigate('/dashboard')}>
          <div className="w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center shadow-2xl group-hover:scale-105 transition-transform duration-300">
            <Plane className="w-6 h-6 text-white" />
          </div>
          <span className="text-3xl font-black font-display tracking-tighter text-gray-900">
            Traveloop<span className="text-primary-600">.</span>
          </span>
        </div>
      </div>

      {/* New Trip CTA */}
      <div className="px-6 pb-6">
        <button
          onClick={() => navigate('/trips/create')}
          className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white font-bold py-3.5 rounded-2xl hover:bg-gray-800 transition-all hover:-translate-y-1 active:translate-y-0 shadow-xl shadow-gray-900/20"
        >
          <Plus className="w-5 h-5" />
          Plan New Trip
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 space-y-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `relative flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold text-sm transition-all duration-300 group overflow-hidden ${isActive
                ? 'bg-white text-gray-900 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-gray-100'
                : 'text-gray-500 hover:bg-white/50 hover:text-gray-900'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-primary-600 rounded-r-full shadow-[0_0_10px_rgba(79,70,229,0.5)]" />
                )}
                <Icon className={`w-5 h-5 transition-colors z-10 ${isActive ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
                <span className="z-10">{label}</span>
              </>
            )}
          </NavLink>
        ))}

        {/* Separator */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mx-4 my-8" />

        {/* AI Planner — Flagship Feature */}
        <div className="pt-2">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 px-4 mb-4">Intelligent Features</p>
          <NavLink
            to={AI_NAV.to}
            className={({ isActive }) =>
              `group relative flex items-center gap-4 px-4 py-4 rounded-2xl text-sm font-black transition-all duration-500 hover:-translate-y-1 ${isActive
                ? 'bg-gray-900 text-white shadow-[0_10px_30px_rgba(0,0,0,0.2)]'
                : 'bg-white text-gray-900 hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)] border border-gray-100'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className="absolute inset-0 bg-gradient-to-r from-primary-600/20 via-purple-600/20 to-accent-500/20 rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />

                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-500 shadow-inner ${isActive ? 'bg-white/10' : 'bg-gradient-to-br from-primary-500 to-purple-600 group-hover:rotate-12'
                  }`}>
                  <Sparkles className={`w-5 h-5 ${isActive ? 'text-white animate-pulse' : 'text-white'}`} />
                </div>

                <span className="flex-1 text-base">{AI_NAV.label}</span>

                <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider ${isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-gray-900 text-white'
                  }`}>AI</span>
              </>
            )}
          </NavLink>
        </div>
      </nav>

      {/* User */}
      <div className="p-6 mt-auto">
        <div className="bg-white rounded-2xl p-2 mb-3 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] group">
          <div className="flex items-center gap-3 p-2 rounded-xl cursor-pointer" onClick={() => navigate('/profile')}>
            <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center flex-shrink-0 shadow-inner">
              {user?.profile_photo
                ? <img src={`http://localhost:5000${user.profile_photo}`} alt="" className="w-full h-full object-cover" />
                : <span className="text-white font-black text-lg">{user?.name?.[0]?.toUpperCase()}</span>
              }
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black text-gray-900 truncate">{user?.name}</p>
              <p className="text-xs font-bold text-gray-400 truncate">Pro Member</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-gray-900 transition-colors group-hover:translate-x-1" />
          </div>
        </div>
        <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 py-3 text-sm font-bold text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
          <LogOut className="w-4 h-4" />
          Log out
        </button>
      </div>
    </aside>
  );
}
