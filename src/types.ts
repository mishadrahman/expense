export interface Expense {
  id: string;
  userId: string;
  amount: number;
  categoryId: string;
  categoryName: string;
  categoryColor: string;
  categoryIcon: string;
  note: string;
  date: string; // YYYY-MM-DD
  createdAt: number;
}

export interface Category {
  id: string;
  userId?: string;
  name: string;
  color: string; // Hex color code or Tailwind color
  icon: string; // Emoji or Lucide icon key
  isDefault?: boolean;
}

export interface UserSettings {
  monthlyBudget: number;
  currency: string;
  notificationsEnabled: boolean;
  reminderTimes: string[]; // e.g. ["09:00", "14:00", "21:00"]
  reminderLanguage: 'en' | 'bn';
}

export type TimeView = 'daily' | 'weekly' | 'monthly' | 'all';

export interface FilterState {
  searchQuery: string;
  categoryId: string; // 'all' or categoryId
  timeView: TimeView;
  startDate: string; // YYYY-MM-DD or ''
  endDate: string; // YYYY-MM-DD or ''
}

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'cat-food', name: 'Food & Dining', color: '#f59e0b', icon: 'Utensils', isDefault: true },
  { id: 'cat-transport', name: 'Transport', color: '#3b82f6', icon: 'Car', isDefault: true },
  { id: 'cat-shopping', name: 'Shopping', color: '#ec4899', icon: 'ShoppingBag', isDefault: true },
  { id: 'cat-bills', name: 'Bills & Utilities', color: '#10b981', icon: 'Receipt', isDefault: true },
  { id: 'cat-others', name: 'Others', color: '#8b5cf6', icon: 'MoreHorizontal', isDefault: true },
];

export const BANGLE_REMINDER_MESSAGES = [
  "আজকের খরচ যোগ করেছো?",
  "আজ কত টাকা খরচ হলো?",
  "আপনার দৈনিক ব্যয়ের হিসাব ঠিক রাখুন!"
];

export const ENGLISH_REMINDER_MESSAGES = [
  "Did you log your expenses today?",
  "How much did you spend today?",
  "Keep your daily budget on track!"
];
