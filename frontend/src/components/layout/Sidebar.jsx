import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Map, Plus, Wallet, CheckSquare, BookOpen,
  Search, User, LogOut, Plane, ChevronRight, Sparkles
} from 'lucide-react';
import useAuthStore from '../../store/authStore';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/trips', icon: Map, label: 'My Trips' },
  { to: '/activities', icon: Search, label: 'Explore Activities' },
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
    <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-100 min-h-screen sticky top-0">
      {/* Logo */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center shadow-glow">
            <Plane className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold font-display gradient-text">Traveloop</span>
        </div>
      </div>

      {/* New Trip CTA */}
      <div className="px-4 pt-5">
        <button
          onClick={() => navigate('/trips/create')}
          className="btn-primary w-full text-sm py-2.5"
        >
          <Plus className="w-4 h-4" />
          Plan New Trip
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 pt-4 space-y-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <Icon className="w-4.5 h-4.5 w-5 h-5" />
            {label}
          </NavLink>
        ))}

        {/* AI Planner — highlighted entry */}
        <div className="pt-3 pb-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-3 mb-2">AI Features</p>
          <NavLink
            to={AI_NAV.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-primary-600 to-accent-500 text-white shadow-glow'
                  : 'text-gray-600 hover:bg-primary-50 hover:text-primary-700'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  isActive ? 'bg-white/20' : 'bg-gradient-to-br from-primary-100 to-accent-100'
                }`}>
                  <Sparkles className={`w-4 h-4 ${isActive ? 'text-white' : 'text-primary-600'}`} />
                </div>
                <span className="flex-1">{AI_NAV.label}</span>
                {!isActive && (
                  <span className="text-[10px] font-bold bg-gradient-to-r from-primary-500 to-accent-500 text-white px-1.5 py-0.5 rounded-full">NEW</span>
                )}
              </>
            )}
          </NavLink>
        </div>
      </nav>

      {/* User */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group"
          onClick={() => navigate('/profile')}>
          <div className="w-9 h-9 rounded-full overflow-hidden bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center flex-shrink-0">
            {user?.profile_photo
              ? <img src={`http://localhost:5000${user.profile_photo}`} alt="" className="w-full h-full object-cover" />
              : <span className="text-white font-semibold text-sm">{user?.name?.[0]?.toUpperCase()}</span>
            }
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-800 truncate">{user?.name}</p>
            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
        </div>
        <button onClick={handleLogout} className="btn-ghost w-full text-sm mt-1 text-red-500 hover:bg-red-50 hover:text-red-600">
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}
