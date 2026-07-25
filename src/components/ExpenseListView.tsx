import React, { useState, useMemo } from 'react';
import { useExpense } from '../context/ExpenseContext';
import { Expense, TimeView } from '../types';
import {
  formatCurrency,
  formatDateLabel,
  getTodayDateString,
  getStartAndEndOfWeek,
  getStartAndEndOfMonth,
  exportToCSV,
} from '../utils/formatters';
import { CategoryIcon } from './CategoryIcon';
import {
  Search,
  Filter,
  Download,
  Calendar as CalendarIcon,
  X,
  Trash2,
  Edit2,
  Plus,
  ArrowUpDown,
} from 'lucide-react';

interface ExpenseListViewProps {
  onOpenAddModal: () => void;
  onEditExpense: (expense: Expense) => void;
}

export const ExpenseListView: React.FC<ExpenseListViewProps> = ({
  onOpenAddModal,
  onEditExpense,
}) => {
  const { expenses, categories, settings, deleteExpense } = useExpense();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [timeView, setTimeView] = useState<TimeView>('all');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  const todayStr = getTodayDateString();
  const weekRange = useMemo(() => getStartAndEndOfWeek(), []);
  const monthRange = useMemo(() => getStartAndEndOfMonth(), []);

  // Filter expenses logic
  const filteredExpenses = useMemo(() => {
    return expenses.filter((exp) => {
      // Search filter
      if (
        searchQuery.trim() &&
        !exp.note.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !exp.categoryName.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      // Category filter
      if (selectedCategory !== 'all' && exp.categoryId !== selectedCategory) {
        return false;
      }

      // Custom date range filter (overrides standard timeView if set)
      if (startDate && exp.date < startDate) return false;
      if (endDate && exp.date > endDate) return false;

      // Time view filter
      if (!startDate && !endDate) {
        if (timeView === 'daily' && exp.date !== todayStr) return false;
        if (timeView === 'weekly' && (exp.date < weekRange.start || exp.date > weekRange.end))
          return false;
        if (timeView === 'monthly' && (exp.date < monthRange.start || exp.date > monthRange.end))
          return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortOrder === 'desc') {
        return b.date.localeCompare(a.date) || b.createdAt - a.createdAt;
      }
      return a.date.localeCompare(b.date) || a.createdAt - b.createdAt;
    });
  }, [
    expenses,
    searchQuery,
    selectedCategory,
    timeView,
    startDate,
    endDate,
    sortOrder,
    todayStr,
    weekRange,
    monthRange,
  ]);

  // Total filtered expense
  const totalFilteredAmount = useMemo(() => {
    return filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
  }, [filteredExpenses]);

  // Group filtered expenses by Date
  const groupedExpenses = useMemo<Record<string, Expense[]>>(() => {
    const groups: Record<string, Expense[]> = {};
    filteredExpenses.forEach((exp) => {
      if (!groups[exp.date]) {
        groups[exp.date] = [];
      }
      groups[exp.date].push(exp);
    });
    return groups;
  }, [filteredExpenses]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setTimeView('all');
    setStartDate('');
    setEndDate('');
  };

  const hasActiveFilters = searchQuery || selectedCategory !== 'all' || timeView !== 'all' || startDate || endDate;

  return (
    <div className="space-y-5 pb-24 md:pb-12">
      {/* Header & Export CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-extrabold text-slate-100">Expense History</h2>
          <p className="text-xs text-slate-400">View, search, and manage all your logged expenses</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => exportToCSV(filteredExpenses)}
            disabled={filteredExpenses.length === 0}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-slate-100 hover:bg-slate-800 text-xs font-semibold transition-colors disabled:opacity-40"
            title="Download CSV report"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-md shadow-emerald-500/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Expense</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Controls Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 space-y-3.5 shadow-lg">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search by note or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-10 pr-10 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 transition-all placeholder:text-slate-600"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-slate-300"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Time View Switcher Tabs & Category Filter Dropdown */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-800/80">
          {/* Time View Pills */}
          <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800 overflow-x-auto">
            {(['all', 'daily', 'weekly', 'monthly'] as const).map((tv) => (
              <button
                key={tv}
                onClick={() => {
                  setTimeView(tv);
                  setStartDate('');
                  setEndDate('');
                }}
                className={`px-3 py-1 rounded-lg text-xs font-medium capitalize transition-all whitespace-nowrap ${
                  timeView === tv && !startDate && !endDate
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tv === 'daily' ? 'Daily' : tv === 'weekly' ? 'Weekly' : tv === 'monthly' ? 'Monthly' : 'All Time'}
              </button>
            ))}
          </div>

          {/* Category Dropdown */}
          <div className="flex items-center gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            {/* Sort Toggle */}
            <button
              onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
              className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200 text-xs transition-colors"
              title={`Sort by Date (${sortOrder === 'desc' ? 'Newest first' : 'Oldest first'})`}
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Custom Date Range Picker */}
        <div className="flex flex-wrap items-center gap-2 text-xs pt-2 border-t border-slate-800/60">
          <span className="text-slate-400 font-medium">Custom Range:</span>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-300 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-emerald-500"
          />
          <span className="text-slate-500">to</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-300 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-emerald-500"
          />

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="ml-auto text-xs text-rose-400 hover:underline font-semibold flex items-center gap-1"
            >
              <X className="w-3 h-3" /> Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Filtered Total Display Bar */}
      <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl px-5 py-3 flex items-center justify-between shadow-sm">
        <span className="text-xs font-semibold text-slate-400">
          Filtered Results ({filteredExpenses.length} items)
        </span>
        <div className="text-right">
          <span className="text-xs text-slate-400 mr-2">Total Spent:</span>
          <span className="text-base font-extrabold text-emerald-400">
            {formatCurrency(totalFilteredAmount, settings.currency)}
          </span>
        </div>
      </div>

      {/* Expense Grouped Items List */}
      {Object.keys(groupedExpenses).length > 0 ? (
        <div className="space-y-5">
          {(Object.entries(groupedExpenses) as [string, Expense[]][]).map(([dateStr, items]) => {
            const dayTotal = items.reduce((sum, i) => sum + i.amount, 0);
            return (
              <div key={dateStr} className="space-y-2">
                {/* Date Group Header */}
                <div className="flex items-center justify-between px-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <span>{formatDateLabel(dateStr)} ({dateStr})</span>
                  <span className="text-slate-300">
                    Day Total: {formatCurrency(dayTotal, settings.currency)}
                  </span>
                </div>

                {/* Items in this date */}
                <div className="space-y-2">
                  {items.map((expense) => (
                    <div
                      key={expense.id}
                      className="bg-slate-900 border border-slate-800/90 hover:border-slate-700 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-md transition-all group"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div
                          className="w-11 h-11 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-md"
                          style={{ backgroundColor: expense.categoryColor || '#10b981' }}
                        >
                          <CategoryIcon name={expense.categoryIcon || 'Tag'} className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-sm text-slate-100 truncate">
                            {expense.categoryName}
                          </p>
                          <p className="text-xs text-slate-400 truncate mt-0.5">
                            {expense.note ? expense.note : 'No description note'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className="font-extrabold text-base text-rose-400">
                          -{formatCurrency(expense.amount, settings.currency)}
                        </span>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                          <button
                            onClick={() => onEditExpense(expense)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteExpense(expense.id)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 text-rose-400 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-slate-500 space-y-3">
          <p className="text-base font-semibold text-slate-400">No matching expenses found</p>
          <p className="text-xs">Try clearing search filters or add a new expense.</p>
          {hasActiveFilters ? (
            <button
              onClick={clearFilters}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all"
            >
              Reset Filters
            </button>
          ) : (
            <button
              onClick={onOpenAddModal}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all"
            >
              Add Expense
            </button>
          )}
        </div>
      )}
    </div>
  );
};
