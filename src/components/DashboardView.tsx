import React, { useMemo, useState } from 'react';
import { useExpense } from '../context/ExpenseContext';
import { formatCurrency, formatDateLabel, getTodayDateString, getStartAndEndOfWeek, getStartAndEndOfMonth } from '../utils/formatters';
import { CategoryIcon } from './CategoryIcon';
import { Expense } from '../types';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';
import {
  TrendingUp,
  DollarSign,
  Calendar,
  AlertTriangle,
  ArrowUpRight,
  Plus,
  Trash2,
  Edit2,
  PieChart as PieIcon,
  BarChart3,
  CheckCircle2,
} from 'lucide-react';

interface DashboardViewProps {
  onOpenAddModal: () => void;
  onEditExpense: (expense: Expense) => void;
  onNavigateToExpenses: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onOpenAddModal,
  onEditExpense,
  onNavigateToExpenses,
}) => {
  const { expenses, categories, settings, deleteExpense } = useExpense();
  const [timePeriod, setTimePeriod] = useState<'today' | 'week' | 'month'>('month');

  const todayStr = getTodayDateString();
  const weekRange = useMemo(() => getStartAndEndOfWeek(), []);
  const monthRange = useMemo(() => getStartAndEndOfMonth(), []);

  // Filter expenses by selected timePeriod
  const periodExpenses = useMemo(() => {
    return expenses.filter((exp) => {
      if (timePeriod === 'today') {
        return exp.date === todayStr;
      }
      if (timePeriod === 'week') {
        return exp.date >= weekRange.start && exp.date <= weekRange.end;
      }
      if (timePeriod === 'month') {
        return exp.date >= monthRange.start && exp.date <= monthRange.end;
      }
      return true;
    });
  }, [expenses, timePeriod, todayStr, weekRange, monthRange]);

  // Current month total expenses for budget check
  const monthExpenses = useMemo(() => {
    return expenses.filter((exp) => exp.date >= monthRange.start && exp.date <= monthRange.end);
  }, [expenses, monthRange]);

  const totalMonthExpense = useMemo(() => {
    return monthExpenses.reduce((sum, e) => sum + e.amount, 0);
  }, [monthExpenses]);

  const totalPeriodExpense = useMemo(() => {
    return periodExpenses.reduce((sum, e) => sum + e.amount, 0);
  }, [periodExpenses]);

  // Daily average calculation for current month
  const todayDayOfMonth = new Date().getDate();
  const dailyAverageMonth = totalMonthExpense / (todayDayOfMonth || 1);

  // Budget calculations
  const budgetRatio = settings.monthlyBudget > 0 ? (totalMonthExpense / settings.monthlyBudget) * 100 : 0;
  const isBudgetWarning = budgetRatio >= 80;
  const isBudgetExceeded = budgetRatio >= 100;

  // Category Breakdown Data for Pie Chart
  const categoryChartData = useMemo(() => {
    const map: Record<string, { name: string; value: number; color: string; icon: string }> = {};

    periodExpenses.forEach((exp) => {
      if (!map[exp.categoryId]) {
        map[exp.categoryId] = {
          name: exp.categoryName || 'Other',
          value: 0,
          color: exp.categoryColor || '#10b981',
          icon: exp.categoryIcon || 'Tag',
        };
      }
      map[exp.categoryId].value += exp.amount;
    });

    return Object.values(map).sort((a, b) => b.value - a.value);
  }, [periodExpenses]);

  // Daily Trend Bar Chart Data
  const dailyTrendData = useMemo(() => {
    const map: Record<string, number> = {};

    // Get all dates in current period
    if (timePeriod === 'today') {
      map[todayStr] = 0;
    } else if (timePeriod === 'week') {
      let curr = new Date(weekRange.start + 'T00:00:00');
      const end = new Date(weekRange.end + 'T00:00:00');
      while (curr <= end) {
        const y = curr.getFullYear();
        const m = String(curr.getMonth() + 1).padStart(2, '0');
        const d = String(curr.getDate()).padStart(2, '0');
        map[`${y}-${m}-${d}`] = 0;
        curr.setDate(curr.getDate() + 1);
      }
    } else {
      let curr = new Date(monthRange.start + 'T00:00:00');
      const end = new Date(todayStr + 'T00:00:00'); // up to today
      while (curr <= end) {
        const y = curr.getFullYear();
        const m = String(curr.getMonth() + 1).padStart(2, '0');
        const d = String(curr.getDate()).padStart(2, '0');
        map[`${y}-${m}-${d}`] = 0;
        curr.setDate(curr.getDate() + 1);
      }
    }

    periodExpenses.forEach((exp) => {
      if (map[exp.date] !== undefined) {
        map[exp.date] += exp.amount;
      } else {
        map[exp.date] = exp.amount;
      }
    });

    return Object.entries(map)
      .map(([date, amount]) => {
        const d = new Date(date + 'T00:00:00');
        const label = d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
        return { date: label, rawDate: date, Amount: amount };
      })
      .sort((a, b) => a.rawDate.localeCompare(b.rawDate));
  }, [periodExpenses, timePeriod, todayStr, weekRange, monthRange]);

  // Recent transactions (latest 5)
  const recentExpenses = useMemo(() => {
    return [...expenses].sort((a, b) => b.createdAt - a.createdAt).slice(0, 5);
  }, [expenses]);

  return (
    <div className="space-y-6 pb-24 md:pb-12">
      {/* Time Period Filter Pills */}
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-xl font-extrabold text-slate-100">Financial Overview</h2>
          <p className="text-xs text-slate-400">Track and monitor your daily spending</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-1 rounded-2xl flex items-center gap-1">
          {(['today', 'week', 'month'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setTimePeriod(p)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                timePeriod === p
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {p === 'today' ? 'Today' : p === 'week' ? 'This Week' : 'This Month'}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Total Expense Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 relative overflow-hidden shadow-lg">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl -mr-6 -mt-6 pointer-events-none" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {timePeriod === 'today'
                ? "Today's Expense"
                : timePeriod === 'week'
                ? 'This Week Expense'
                : 'This Month Expense'}
            </span>
            <div className="w-9 h-9 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-100 tracking-tight">
            {formatCurrency(totalPeriodExpense, settings.currency)}
          </p>
          <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
            <span className="text-emerald-400 font-semibold">{periodExpenses.length}</span> transactions logged
          </div>
        </div>

        {/* Monthly Budget Tracker Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 relative overflow-hidden shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Monthly Budget Limit
            </span>
            {isBudgetExceeded ? (
              <span className="flex items-center gap-1 text-[11px] font-bold text-rose-400 bg-rose-950/60 border border-rose-800 px-2 py-0.5 rounded-full">
                <AlertTriangle className="w-3 h-3" /> Exceeded
              </span>
            ) : isBudgetWarning ? (
              <span className="flex items-center gap-1 text-[11px] font-bold text-amber-400 bg-amber-950/60 border border-amber-800 px-2 py-0.5 rounded-full">
                <AlertTriangle className="w-3 h-3" /> Near Limit
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded-full">
                <CheckCircle2 className="w-3 h-3" /> On Track
              </span>
            )}
          </div>
          <div className="flex items-baseline justify-between mb-2">
            <p className="text-2xl font-extrabold text-slate-100">
              {formatCurrency(totalMonthExpense, settings.currency)}
            </p>
            <p className="text-xs text-slate-400 font-medium">
              / {formatCurrency(settings.monthlyBudget, settings.currency)}
            </p>
          </div>
          {/* Progress Bar */}
          <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                isBudgetExceeded
                  ? 'bg-rose-500'
                  : isBudgetWarning
                  ? 'bg-amber-500'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-400'
              }`}
              style={{ width: `${Math.min(budgetRatio, 100)}%` }}
            />
          </div>
          <p className="mt-2 text-[11px] text-slate-400 font-medium text-right">
            {budgetRatio.toFixed(1)}% budget spent
          </p>
        </div>

        {/* Daily Average Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg hidden sm:block">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Daily Avg (This Month)
            </span>
            <div className="w-9 h-9 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-100 tracking-tight">
            {formatCurrency(dailyAverageMonth, settings.currency)}
          </p>
          <p className="mt-3 text-xs text-slate-400">
            Based on {todayDayOfMonth} days elapsed this month
          </p>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown Donut / Pie Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-emerald-400" />
              <h3 className="font-bold text-slate-100 text-sm">Category Breakdown</h3>
            </div>
            <span className="text-xs text-slate-400">{categoryChartData.length} Categories</span>
          </div>

          {categoryChartData.length > 0 ? (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="w-full sm:w-1/2 h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={75}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {categoryChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val: any) => [formatCurrency(Number(val), settings.currency), 'Amount']}
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderColor: '#334155',
                        borderRadius: '12px',
                        color: '#f8fafc',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Legend List */}
              <div className="w-full sm:w-1/2 space-y-2 max-h-52 overflow-y-auto pr-1">
                {categoryChartData.map((cat) => {
                  const percent = totalPeriodExpense > 0 ? ((cat.value / totalPeriodExpense) * 100).toFixed(1) : 0;
                  return (
                    <div
                      key={cat.name}
                      className="flex items-center justify-between text-xs p-2 rounded-xl bg-slate-950/50 border border-slate-800/60"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div
                          className="w-3 h-3 rounded-full shrink-0"
                          style={{ backgroundColor: cat.color }}
                        />
                        <span className="font-medium text-slate-300 truncate">{cat.name}</span>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-bold text-slate-100">
                          {formatCurrency(cat.value, settings.currency)}
                        </span>
                        <span className="text-[10px] text-slate-400 block">{percent}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="h-52 flex flex-col items-center justify-center text-slate-500 text-xs">
              <p>No expenses recorded for this period.</p>
              <button
                onClick={onOpenAddModal}
                className="mt-3 text-emerald-400 font-semibold flex items-center gap-1 hover:underline"
              >
                <Plus className="w-3.5 h-3.5" /> Add First Expense
              </button>
            </div>
          )}
        </div>

        {/* Daily Spending Trend Bar Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-400" />
              <h3 className="font-bold text-slate-100 text-sm">Spending Trend</h3>
            </div>
            <span className="text-xs text-slate-400">Daily Amount</span>
          </div>

          {dailyTrendData.length > 0 ? (
            <div className="h-52 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="date" stroke="#64748b" fontSize={10} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                  <Tooltip
                    formatter={(val: any) => [formatCurrency(Number(val), settings.currency), 'Spent']}
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '12px',
                      color: '#f8fafc',
                    }}
                  />
                  <Bar dataKey="Amount" fill="#10b981" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-52 flex items-center justify-center text-slate-500 text-xs">
              No trend data available.
            </div>
          )}
        </div>
      </div>

      {/* Recent Transactions Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-slate-100 text-base">Recent Transactions</h3>
            <p className="text-xs text-slate-400">Latest expense entries</p>
          </div>
          <button
            onClick={onNavigateToExpenses}
            className="flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            <span>View All ({expenses.length})</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        {recentExpenses.length > 0 ? (
          <div className="space-y-2.5">
            {recentExpenses.map((expense) => (
              <div
                key={expense.id}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-all group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-md"
                    style={{ backgroundColor: expense.categoryColor || '#10b981' }}
                  >
                    <CategoryIcon name={expense.categoryIcon || 'Tag'} className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-sm text-slate-200 truncate">
                      {expense.categoryName}
                    </p>
                    <p className="text-xs text-slate-400 truncate">
                      {expense.note ? expense.note : formatDateLabel(expense.date)}
                      {expense.note && <span className="ml-1 opacity-75">· {formatDateLabel(expense.date)}</span>}
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
        ) : (
          <div className="text-center py-8 text-slate-500 space-y-3">
            <p className="text-sm">No expenses logged yet.</p>
            <button
              onClick={onOpenAddModal}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-md"
            >
              Log Your First Expense
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
