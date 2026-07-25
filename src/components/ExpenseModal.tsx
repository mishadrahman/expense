import React, { useState, useEffect } from 'react';
import { useExpense } from '../context/ExpenseContext';
import { Expense } from '../types';
import { getTodayDateString } from '../utils/formatters';
import { CategoryIcon } from './CategoryIcon';
import { X, Plus, Save, Calendar, FileText, Tag, Banknote } from 'lucide-react';

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  editExpense?: Expense | null;
}

export const ExpenseModal: React.FC<ExpenseModalProps> = ({ isOpen, onClose, editExpense }) => {
  const { categories, settings, addExpense, updateExpense } = useExpense();

  const [amount, setAmount] = useState<string>('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [date, setDate] = useState<string>(getTodayDateString());
  const [note, setNote] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editExpense) {
      setAmount(editExpense.amount.toString());
      setCategoryId(editExpense.categoryId);
      setDate(editExpense.date || getTodayDateString());
      setNote(editExpense.note || '');
    } else {
      setAmount('');
      setCategoryId(categories.length > 0 ? categories[0].id : '');
      setDate(getTodayDateString());
      setNote('');
    }
  }, [editExpense, categories, isOpen]);

  if (!isOpen) return null;

  const handleQuickAdd = (val: number) => {
    const current = parseFloat(amount) || 0;
    setAmount((current + val).toString());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      alert('Please enter a valid expense amount');
      return;
    }

    const selectedCategory = categories.find((c) => c.id === categoryId) || categories[0];
    if (!selectedCategory) {
      alert('Please select a category');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editExpense) {
        await updateExpense(editExpense.id, {
          amount: numAmount,
          categoryId: selectedCategory.id,
          categoryName: selectedCategory.name,
          categoryColor: selectedCategory.color,
          categoryIcon: selectedCategory.icon,
          date,
          note: note.trim(),
        });
      } else {
        await addExpense({
          amount: numAmount,
          categoryId: selectedCategory.id,
          categoryName: selectedCategory.name,
          categoryColor: selectedCategory.color,
          categoryIcon: selectedCategory.icon,
          date,
          note: note.trim(),
        });
      }
      onClose();
    } catch (err) {
      console.error('Error saving expense:', err);
      alert('Failed to save expense.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Banknote className="w-4 h-4" />
            </div>
            <h2 className="font-bold text-lg text-slate-100">
              {editExpense ? 'Edit Expense' : 'Add New Expense'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Amount Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Expense Amount ({settings.currency})
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-emerald-400">
                {settings.currency}
              </span>
              <input
                type="number"
                step="any"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                autoFocus
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-12 pr-4 py-3.5 text-2xl font-extrabold text-slate-100 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-slate-600"
              />
            </div>
            {/* Quick Amount Buttons */}
            <div className="flex items-center gap-2 mt-2.5 overflow-x-auto pb-1">
              {[50, 100, 200, 500, 1000].map((val) => (
                <button
                  type="button"
                  key={val}
                  onClick={() => handleQuickAdd(val)}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 border border-slate-700/60 transition-colors whitespace-nowrap"
                >
                  +{val}
                </button>
              ))}
            </div>
          </div>

          {/* Category Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-1">
              {categories.map((cat) => {
                const isSelected = categoryId === cat.id;
                return (
                  <button
                    type="button"
                    key={cat.id}
                    onClick={() => setCategoryId(cat.id)}
                    className={`flex items-center gap-2.5 p-2.5 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'bg-slate-800 border-emerald-500 ring-1 ring-emerald-500 text-slate-100'
                        : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                    }`}
                  >
                    <div
                      className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-white font-medium shadow-sm"
                      style={{ backgroundColor: cat.color }}
                    >
                      <CategoryIcon name={cat.icon} className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-semibold truncate">{cat.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date Picker */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-10 pr-4 py-2.5 text-sm font-medium text-slate-200 focus:outline-none focus:border-emerald-500 transition-all"
              />
            </div>
          </div>

          {/* Note Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Note / Description (Optional)
            </label>
            <div className="relative">
              <FileText className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <textarea
                placeholder="What did you buy? e.g. Grocery items..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={2}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-10 pr-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 transition-all placeholder:text-slate-600 resize-none"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? 'Saving...' : editExpense ? 'Update Expense' : 'Save Expense'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
