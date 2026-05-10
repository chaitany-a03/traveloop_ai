import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, CheckSquare, Square, Package } from 'lucide-react';
import { toast } from 'react-hot-toast';
import AppLayout from '../../components/layout/AppLayout';
import useTripStore from '../../store/tripStore';
import { CHECKLIST_CATEGORIES } from '../../utils';

const CATEGORY_ICONS = {
  clothing: '👕', electronics: '📱', documents: '📄', essentials: '🧴', other: '📦'
};
const CATEGORY_COLORS = {
  clothing: 'from-blue-500 to-blue-600',
  electronics: 'from-purple-500 to-purple-600',
  documents: 'from-orange-500 to-orange-600',
  essentials: 'from-green-500 to-green-600',
  other: 'from-gray-500 to-gray-600',
};

const DEFAULT_ITEMS = {
  clothing: ['T-shirts', 'Jeans', 'Underwear', 'Socks', 'Jacket', 'Swimwear'],
  electronics: ['Phone charger', 'Power bank', 'Camera', 'Earphones', 'Adapter'],
  documents: ['Passport', 'Visa', 'Travel insurance', 'Hotel bookings', 'Flight tickets'],
  essentials: ['Sunscreen', 'Toiletries', 'Medications', 'First aid kit', 'Water bottle'],
};

export default function PackingChecklist() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { checklist, fetchChecklist, addChecklistItem, toggleChecklistItem, deleteChecklistItem } = useTripStore();
  const [newItem, setNewItem] = useState('');
  const [newCategory, setNewCategory] = useState('other');
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => { fetchChecklist(id); }, [id]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newItem.trim()) return;
    await addChecklistItem(id, { item_name: newItem.trim(), category: newCategory });
    setNewItem('');
    toast.success('Item added');
  };

  const handleAddDefault = async (item, category) => {
    await addChecklistItem(id, { item_name: item, category });
    toast.success(`${item} added`);
  };

  const filtered = activeCategory === 'all' ? checklist : checklist.filter(i => i.category === activeCategory);
  const grouped = CHECKLIST_CATEGORIES.reduce((acc, cat) => {
    acc[cat] = checklist.filter(i => i.category === cat);
    return acc;
  }, {});

  const totalItems = checklist.length;
  const completedItems = checklist.filter(i => i.completed).length;
  const progress = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3 flex-wrap">
          <button onClick={() => navigate(`/trips/${id}`)} className="btn-ghost p-2"><ArrowLeft className="w-5 h-5" /></button>
          <div className="flex-1">
            <h1 className="page-header">Packing Checklist</h1>
          </div>
        </div>

        {/* Progress */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="font-semibold text-gray-800">{completedItems} of {totalItems} items packed</p>
              <p className="text-sm text-gray-400 mt-0.5">{progress}% complete</p>
            </div>
            <div className="w-14 h-14 relative flex-shrink-0">
              <svg className="w-14 h-14 -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15" fill="none" stroke="#e2e8f0" strokeWidth="3" />
                <circle cx="18" cy="18" r="15" fill="none" stroke="#6366f1" strokeWidth="3"
                  strokeDasharray={`${progress * 0.942} 94.2`} strokeLinecap="round" />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-700">{progress}%</span>
            </div>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Add Item */}
        <div className="card p-5">
          <form onSubmit={handleAdd} className="flex gap-3">
            <select className="input-field w-36 flex-shrink-0 text-sm" value={newCategory} onChange={e => setNewCategory(e.target.value)}>
              {CHECKLIST_CATEGORIES.map(c => <option key={c} value={c}>{CATEGORY_ICONS[c]} {c}</option>)}
            </select>
            <input className="input-field flex-1 text-sm" placeholder="Add item to your list..." value={newItem}
              onChange={e => setNewItem(e.target.value)} />
            <button type="submit" className="btn-primary text-sm px-4 flex-shrink-0"><Plus className="w-4 h-4" /></button>
          </form>
        </div>

        {/* Categories */}
        <div className="space-y-4">
          {CHECKLIST_CATEGORIES.map(cat => {
            const items = grouped[cat] || [];
            const catCompleted = items.filter(i => i.completed).length;
            if (items.length === 0 && !DEFAULT_ITEMS[cat]) return null;
            return (
              <div key={cat} className="card overflow-hidden">
                {/* Category header */}
                <div className={`bg-gradient-to-r ${CATEGORY_COLORS[cat]} p-4 flex items-center justify-between`}>
                  <div className="flex items-center gap-3 text-white">
                    <span className="text-2xl">{CATEGORY_ICONS[cat]}</span>
                    <div>
                      <p className="font-bold capitalize">{cat}</p>
                      <p className="text-xs text-white/70">{catCompleted}/{items.length} packed</p>
                    </div>
                  </div>
                  {items.length > 0 && (
                    <div className="text-white/80 text-sm font-semibold">
                      {Math.round((catCompleted / items.length) * 100)}%
                    </div>
                  )}
                </div>

                {/* Items */}
                <div className="divide-y divide-gray-50">
                  {items.map(item => (
                    <div key={item.id} className={`flex items-center gap-3 px-4 py-3 group transition-colors ${item.completed ? 'bg-gray-50' : 'hover:bg-gray-50'}`}>
                      <button onClick={() => toggleChecklistItem(id, item.id)} className="flex-shrink-0">
                        {item.completed
                          ? <CheckSquare className="w-5 h-5 text-primary-500" />
                          : <Square className="w-5 h-5 text-gray-300 hover:text-primary-400 transition-colors" />}
                      </button>
                      <span className={`flex-1 text-sm ${item.completed ? 'line-through text-gray-400' : 'text-gray-700 font-medium'}`}>
                        {item.item_name}
                      </span>
                      <button onClick={() => deleteChecklistItem(id, item.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-all">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}

                  {/* Quick add defaults */}
                  {DEFAULT_ITEMS[cat] && (
                    <div className="px-4 py-3">
                      <p className="text-xs text-gray-400 font-semibold mb-2">Quick add:</p>
                      <div className="flex flex-wrap gap-2">
                        {DEFAULT_ITEMS[cat]
                          .filter(d => !items.some(i => i.item_name === d))
                          .slice(0, 4)
                          .map(d => (
                            <button key={d} onClick={() => handleAddDefault(d, cat)}
                              className="text-xs px-3 py-1 bg-gray-100 hover:bg-primary-100 hover:text-primary-700 rounded-full transition-colors flex items-center gap-1">
                              <Plus className="w-3 h-3" /> {d}
                            </button>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}
