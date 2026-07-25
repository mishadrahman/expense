import React, { useState } from 'react';
import { useExpense } from '../context/ExpenseContext';
import { Category } from '../types';
import { formatCurrency } from '../utils/formatters';
import { CategoryIcon } from './CategoryIcon';
import { Tag, Plus, Edit2, Trash2, X, Check, FolderKanban } from 'lucide-react';

const PRESET_COLORS = [
  '#f59e0b', // Amber
  '#3b82f6', // Blue
  '#ec4899', // Pink
  '#10b981', // Emerald
  '#8b5cf6', // Purple
  '#ef4444', // Red
  '#06b6d4', // Cyan
  '#84cc16', // Lime
  '#f97316', // Orange
  '#6366f1', // Indigo
];

const PRESET_ICONS = [
  'Utensils',
  'Car',
  'ShoppingBag',
  'Receipt',
  'Home',
  'Film',
  'HeartPulse',
  'GraduationCap',
  'Coffee',
  'Plane',
  'Gift',
  'Smartphone',
  'Wrench',
  'MoreHorizontal',
];

export const CategoryView: React.FC = () => {
  const { categories, expenses, settings, addCategory, updateCategory, deleteCategory } =
    useExpense();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [name, setName] = useState('');
  const [color, setColor] = useState(PRESET_COLORS[0]);
  const [icon, setIcon] = useState(PRESET_ICONS[0]);

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setName('');
    setColor(PRESET_COLORS[Math.floor(Math.random() * PRESET_COLORS.length)]);
    setIcon(PRESET_ICONS[0]);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setColor(cat.color);
    setIcon(cat.icon);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Category name cannot be empty');
      return;
    }

    if (editingCategory) {
      await updateCategory(editingCategory.id, { name: name.trim(), color, icon });
    } else {
      await addCategory({ name: name.trim(), color, icon });
    }
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string, name: string) => {
    const isUsed = expenses.some((e) => e.categoryId === id);
    if (isUsed) {
      if (!confirm(`Warning: Category "${name}" is assigned to some recorded expenses. Delete anyway?`)) {
        return;
      }
    } else {
      if (!confirm(`Delete category "${name}"?`)) return;
    }
    await deleteCategory(id);
  };

  // Calculate total expense per category
  const categoryTotals = expenses.reduce((acc, exp) => {
    acc[exp.categoryId] = (acc[exp.categoryId] || 0) + exp.amount;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6 pb-24 md:pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-extrabold text-slate-100">Categories</h2>
          <p className="text-xs text-slate-400">Manage expense categories and color tags</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-md shadow-emerald-500/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Category</span>
        </button>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => {
          const totalSpent = categoryTotals[cat.id] || 0;
          return (
            <div
              key={cat.id}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-5 flex items-center justify-between gap-3 shadow-lg relative overflow-hidden group hover:border-slate-700 transition-all"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-md ring-2 ring-white/10"
                  style={{ backgroundColor: cat.color }}
                >
                  <CategoryIcon name={cat.icon} className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base text-slate-100 truncate">{cat.name}</h3>
                    {cat.isDefault && (
                      <span className="text-[10px] font-semibold text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full shrink-0">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-1 font-medium">
                    Total: <span className="text-slate-200 font-bold">{formatCurrency(totalSpent, settings.currency)}</span>
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleOpenEdit(cat)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  title="Edit Category"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                {!cat.isDefault && (
                  <button
                    onClick={() => handleDelete(cat.id, cat.name)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-rose-950 text-rose-400 transition-colors"
                    title="Delete Category"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
              <h3 className="font-bold text-base text-slate-100">
                {editingCategory ? 'Edit Category' : 'Add Custom Category'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Category Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Category Name
                </label>
                <input
                  type="text"
                  placeholder="e.g., Subscriptions, Books..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Color Picker */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Color Tag
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  {PRESET_COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className={`w-8 h-8 rounded-xl flex items-center justify-center transition-transform ${
                        color === c ? 'scale-110 ring-2 ring-white' : 'hover:scale-105'
                      }`}
                      style={{ backgroundColor: c }}
                    >
                      {color === c && <Check className="w-4 h-4 text-white" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Icon Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Icon
                </label>
                <div className="grid grid-cols-7 gap-2 max-h-36 overflow-y-auto p-1">
                  {PRESET_ICONS.map((i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setIcon(i)}
                      className={`p-2 rounded-xl border flex items-center justify-center text-white transition-all ${
                        icon === i
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      <CategoryIcon name={i} className="w-4 h-4" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 text-slate-950 text-xs font-bold"
                >
                  {editingCategory ? 'Save Changes' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
