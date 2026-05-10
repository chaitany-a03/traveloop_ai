import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Wallet, TrendingUp, AlertTriangle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';
import AppLayout from '../../components/layout/AppLayout';
import useTripStore from '../../store/tripStore';
import { formatCurrency, getDaysBetween } from '../../utils';

const COLORS = ['#6366f1', '#f97316', '#22c55e', '#a855f7', '#64748b'];
const CATEGORIES = [
  { key: 'transport_cost', label: 'Transport', icon: '✈️', color: 'bg-indigo-100 text-indigo-700' },
  { key: 'hotel_cost', label: 'Hotel', icon: '🏨', color: 'bg-orange-100 text-orange-700' },
  { key: 'food_cost', label: 'Food', icon: '🍽️', color: 'bg-green-100 text-green-700' },
  { key: 'activity_cost', label: 'Activities', icon: '🎯', color: 'bg-purple-100 text-purple-700' },
  { key: 'miscellaneous_cost', label: 'Misc', icon: '📦', color: 'bg-gray-100 text-gray-700' },
];

export default function BudgetDashboard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentTrip, fetchTrip, budget, fetchBudget, saveBudget } = useTripStore();
  const [form, setForm] = useState({ transport_cost: 0, hotel_cost: 0, food_cost: 0, activity_cost: 0, miscellaneous_cost: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [totalBudget, setTotalBudget] = useState(0);

  useEffect(() => {
    fetchTrip(id);
    fetchBudget(id);
  }, [id]);

  useEffect(() => {
    if (budget) {
      const b = {
        transport_cost: parseFloat(budget.transport_cost) || 0,
        hotel_cost: parseFloat(budget.hotel_cost) || 0,
        food_cost: parseFloat(budget.food_cost) || 0,
        activity_cost: parseFloat(budget.activity_cost) || 0,
        miscellaneous_cost: parseFloat(budget.miscellaneous_cost) || 0,
      };
      setForm(b);
      setTotalBudget(Object.values(b).reduce((s, v) => s + v, 0));
    }
  }, [budget]);

  useEffect(() => {
    setTotalBudget(Object.values(form).reduce((s, v) => s + parseFloat(v || 0), 0));
  }, [form]);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await saveBudget(id, form);
      toast.success('Budget saved!');
    } catch { toast.error('Failed to save budget'); }
    finally { setIsLoading(false); }
  };

  const days = getDaysBetween(currentTrip?.start_date, currentTrip?.end_date) || 1;
  const dailyAvg = totalBudget / days;

  const activityTotal = (currentTrip?.stops || []).flatMap(s => s.activities || []).reduce((s, a) => s + parseFloat(a.cost || 0), 0);
  const isOverActivity = activityTotal > parseFloat(form.activity_cost || 0);

  const pieData = CATEGORIES.map((c, i) => ({
    name: c.label, value: parseFloat(form[c.key] || 0), color: COLORS[i],
  })).filter(d => d.value > 0);

  const barData = CATEGORIES.map((c, i) => ({
    name: c.label, budget: parseFloat(form[c.key] || 0),
  }));

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3 flex-wrap">
          <button onClick={() => navigate(`/trips/${id}`)} className="btn-ghost p-2"><ArrowLeft className="w-5 h-5" /></button>
          <div className="flex-1">
            <h1 className="page-header">Budget Dashboard</h1>
            {currentTrip && <p className="text-gray-500 text-sm mt-0.5">{currentTrip.title}</p>}
          </div>
          <button onClick={handleSave} disabled={isLoading} className="btn-primary">
            <Save className="w-4 h-4" /> {isLoading ? 'Saving...' : 'Save Budget'}
          </button>
        </div>

        {/* Top Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="card p-5 col-span-2 bg-gradient-to-br from-primary-600 to-primary-700 text-white">
            <div className="flex items-center gap-3 mb-2">
              <Wallet className="w-5 h-5 text-primary-200" />
              <span className="text-primary-200 text-sm font-medium">Total Budget</span>
            </div>
            <p className="text-4xl font-bold">{formatCurrency(totalBudget)}</p>
          </div>
          <div className="card p-5">
            <p className="text-xs text-gray-500 font-medium mb-2 flex items-center gap-1"><TrendingUp className="w-3.5 h-3.5" /> Daily Average</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(dailyAvg)}</p>
            <p className="text-xs text-gray-400 mt-1">over {days} days</p>
          </div>
          <div className="card p-5">
            <p className="text-xs text-gray-500 font-medium mb-2">Activity Spend</p>
            <p className={`text-2xl font-bold ${isOverActivity ? 'text-red-500' : 'text-gray-900'}`}>{formatCurrency(activityTotal)}</p>
            <p className="text-xs text-gray-400 mt-1">vs {formatCurrency(form.activity_cost)} budget</p>
          </div>
        </div>

        {isOverActivity && (
          <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-semibold">Activity costs ({formatCurrency(activityTotal)}) exceed your activity budget ({formatCurrency(form.activity_cost)})!</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Inputs */}
          <div className="card p-6 space-y-4">
            <h2 className="section-title">Expense Breakdown</h2>
            {CATEGORIES.map(cat => (
              <div key={cat.key} className="flex items-center gap-3">
                <div className={`w-10 h-10 ${cat.color} rounded-xl flex items-center justify-center text-lg flex-shrink-0`}>
                  {cat.icon}
                </div>
                <div className="flex-1">
                  <label className="text-sm font-semibold text-gray-700">{cat.label}</label>
                </div>
                <div className="relative w-36">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
                  <input type="number" min="0" className="input-field pl-7 text-right"
                    value={form[cat.key]}
                    onChange={e => setForm({ ...form, [cat.key]: parseFloat(e.target.value) || 0 })} />
                </div>
              </div>
            ))}
            <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
              <span className="font-bold text-gray-700">Total</span>
              <span className="text-xl font-bold text-primary-600">{formatCurrency(totalBudget)}</span>
            </div>
          </div>

          {/* Pie Chart */}
          <div className="card p-6">
            <h2 className="section-title mb-4">Distribution</h2>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" outerRadius={90} paddingAngle={3} dataKey="value">
                    {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip formatter={(v) => formatCurrency(v)} />
                  <Legend formatter={(v) => <span className="text-xs text-gray-600">{v}</span>} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-56 flex items-center justify-center text-gray-400 text-sm">
                Enter budget values to see distribution
              </div>
            )}
          </div>
        </div>

        {/* Bar chart */}
        <div className="card p-6">
          <h2 className="section-title mb-4">Category Comparison</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={(v) => `₹${v}`} tick={{ fontSize: 12 }} />
              <Tooltip formatter={(v) => formatCurrency(v)} />
              <Bar dataKey="budget" fill="#6366f1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </AppLayout>
  );
}
