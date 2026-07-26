import React, { useState } from 'react';
import { useExpense } from '../context/ExpenseContext';
import { usePWA } from '../context/PWAContext';
import { InstallButton } from './InstallButton';
import {
  Bell,
  CheckCircle2,
  Globe,
  LogIn,
  LogOut,
  Moon,
  Save,
  Shield,
  Smartphone,
  Sparkles,
  Wifi,
  WifiOff,
  Plus,
  Trash2,
  Clock,
  Download,
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const {
    user,
    isOnline,
    settings,
    updateSettings,
    openAuthModal,
    logout,
    notificationPermission,
    requestNotificationPermission,
    sendTestNotification,
    clearCacheAndReload,
  } = useExpense();

  const { isStandalone, isInstalled } = usePWA();
  const [budget, setBudget] = useState<string>(settings.monthlyBudget.toString());
  const [currency, setCurrency] = useState<string>(settings.currency || '৳');
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(settings.notificationsEnabled);
  const [reminderLanguage, setReminderLanguage] = useState<'en' | 'bn'>(settings.reminderLanguage || 'bn');
  const [reminderTimes, setReminderTimes] = useState<string[]>(settings.reminderTimes || ['09:00', '14:00', '21:00']);
  const [newTimeInput, setNewTimeInput] = useState<string>('18:00');
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    const numBudget = parseFloat(budget);
    if (isNaN(numBudget) || numBudget < 0) {
      alert('Please enter a valid monthly budget amount');
      return;
    }

    await updateSettings({
      monthlyBudget: numBudget,
      currency,
      notificationsEnabled,
      reminderLanguage,
      reminderTimes,
    });

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const addReminderTime = () => {
    if (!newTimeInput) return;
    if (reminderTimes.includes(newTimeInput)) {
      alert('Time slot already added');
      return;
    }
    setReminderTimes([...reminderTimes, newTimeInput].sort());
  };

  const removeReminderTime = (timeToRemove: string) => {
    setReminderTimes(reminderTimes.filter((t) => t !== timeToRemove));
  };

  return (
    <div className="space-y-6 pb-24 md:pb-12 max-w-3xl mx-auto">
      {/* Title */}
      <div>
        <h2 className="text-xl font-extrabold text-slate-100">Settings & Preferences</h2>
        <p className="text-xs text-slate-400">Configure budget limits, local notifications, and cloud sync</p>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Monthly Budget & Currency Section */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-100">Budget & Currency</h3>
              <p className="text-xs text-slate-400">Set monthly spending threshold and currency symbol</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Currency Symbol
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-sm rounded-2xl px-4 py-3 focus:outline-none focus:border-emerald-500"
              >
                <option value="৳">৳ Bangladeshi Taka (BDT)</option>
                <option value="$">$ US Dollar (USD)</option>
                <option value="€">€ Euro (EUR)</option>
                <option value="₹">₹ Indian Rupee (INR)</option>
                <option value="£">£ British Pound (GBP)</option>
                <option value="RM">RM Malaysian Ringgit (MYR)</option>
                <option value="AED">AED UAE Dirham</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Monthly Spending Limit
              </label>
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="25000"
                required
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-sm font-bold rounded-2xl px-4 py-3 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Local Notification Reminder System Section */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-100">Local Expense Reminders</h3>
                <p className="text-xs text-slate-400">Daily browser notifications to keep you on track</p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notificationsEnabled}
                onChange={(e) => setNotificationsEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
          </div>

          {/* Notification Permission Trigger Button */}
          {notificationPermission !== 'granted' ? (
            <div className="bg-amber-950/40 border border-amber-800/60 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="text-xs text-amber-200">
                <p className="font-bold">Browser notification permission required</p>
                <p className="opacity-80">Grant permission to allow local reminder alerts on this device.</p>
              </div>
              <button
                type="button"
                onClick={requestNotificationPermission}
                className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold shrink-0 hover:bg-amber-400 transition-colors"
              >
                Enable Permission
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
              <CheckCircle2 className="w-4 h-4" /> Notification permission granted
            </div>
          )}

          {/* Reminder Language */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Reminder Message Language
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setReminderLanguage('bn')}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  reminderLanguage === 'bn'
                    ? 'bg-slate-800 border-emerald-500 text-slate-100 font-bold'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <span className="block text-sm">বাংলা (Bengali)</span>
                <span className="text-[10px] text-slate-400 mt-0.5 block">"আজকের খরচ যোগ করেছো?"</span>
              </button>
              <button
                type="button"
                onClick={() => setReminderLanguage('en')}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  reminderLanguage === 'en'
                    ? 'bg-slate-800 border-emerald-500 text-slate-100 font-bold'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                <span className="block text-sm">English</span>
                <span className="text-[10px] text-slate-400 mt-0.5 block">"Did you log your expenses today?"</span>
              </button>
            </div>
          </div>

          {/* Scheduled Reminder Times */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Daily Reminder Schedules
            </label>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {reminderTimes.map((time) => (
                <div
                  key={time}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs font-bold"
                >
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>{time}</span>
                  <button
                    type="button"
                    onClick={() => removeReminderTime(time)}
                    className="p-0.5 text-slate-500 hover:text-rose-400"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="time"
                value={newTimeInput}
                onChange={(e) => setNewTimeInput(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="button"
                onClick={addReminderTime}
                className="flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
              >
                <Plus className="w-3.5 h-3.5" /> Add Time
              </button>
            </div>
          </div>

          {/* Test Notification Action */}
          <div className="pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={sendTestNotification}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-bold transition-colors"
            >
              <Bell className="w-3.5 h-3.5" /> Send Test Local Notification
            </button>
          </div>
        </div>

        {/* Progressive Web App (PWA) Section */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Smartphone className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-100">Progressive Web App (PWA)</h3>
                <p className="text-xs text-slate-400">Install as native application on Android, iOS, or Desktop</p>
              </div>
            </div>

            {isStandalone || isInstalled ? (
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> App Installed
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold">
                Browser Mode
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-300">
            <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-1">
              <span className="font-bold text-slate-200 block">📱 Standalone Window</span>
              <p className="text-[11px] text-slate-400">Opens in full screen with no browser search bar or chrome UI.</p>
            </div>
            <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-1">
              <span className="font-bold text-slate-200 block">📴 Offline First</span>
              <p className="text-[11px] text-slate-400">Opens instantly without internet connection using cached assets.</p>
            </div>
            <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-1">
              <span className="font-bold text-slate-200 block">🚀 Home Screen Icon</span>
              <p className="text-[11px] text-slate-400">Launches directly from app drawer and desktop home screen.</p>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800">
            <InstallButton variant="settings" />
          </div>
        </div>

        {/* Storage & Cache Options Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg space-y-3">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <div className="w-8 h-8 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-100">Data & Cache Options</h3>
              <p className="text-xs text-slate-400">Manage offline data persistence and cache updates</p>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-300">
            <span>Offline Data Storage:</span>
            <span className="font-bold text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Enabled (IndexedDB / LocalStorage)
            </span>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={clearCacheAndReload}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-bold border border-amber-500/30 transition-all"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>ক্যাশ ও ক্যাশ ফাইল মুছে নতুন আপডেট নিন (Clear Cache & Reload)</span>
            </button>
          </div>
        </div>

        {/* Firebase Cloud Sync & Auth Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-100">Account & Firestore Cloud Sync</h3>
              <p className="text-xs text-slate-400">Email/Password & Google login with automatic Firestore cloud backup</p>
            </div>
          </div>

          {user ? (
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
              <div className="flex items-center gap-3">
                <img
                  src={user.photoURL || 'https://api.dicebear.com/7.x/bottts/svg?seed=' + (user.email || 'user')}
                  alt={user.displayName || 'User'}
                  className="w-10 h-10 rounded-full ring-2 ring-emerald-500/50 object-cover"
                />
                <div>
                  <p className="font-bold text-sm text-slate-100">{user.displayName || 'Signed In User'}</p>
                  <p className="text-xs text-slate-400">{user.email}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={logout}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-400 text-xs font-semibold transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" /> Sign Out
              </button>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-3">
              <p className="text-xs text-slate-400">
                You are currently in local Guest mode. Sign in with Email or Google to backup & sync expenses to your Firestore database.
              </p>
              <button
                type="button"
                onClick={openAuthModal}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-emerald-500/20"
              >
                <LogIn className="w-4 h-4" /> Sign In / Register
              </button>
            </div>
          )}

          {/* Firebase Authorized Domain Guide */}
          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-slate-300">
              <Globe className="w-3.5 h-3.5 text-blue-400" />
              <span>Firebase Authorized Domain Notice</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              When deploying to GitHub Pages (<code className="text-emerald-400 font-mono">mishadrahman.github.io</code>), ensure <code className="text-emerald-400 font-mono">mishadrahman.github.io</code> is added in Firebase Console &rarr; Authentication &rarr; Settings &rarr; Authorized Domains.
            </p>
          </div>
        </div>

        {/* Save Settings Bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          {isSaved && (
            <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Settings Saved!
            </span>
          )}
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold shadow-lg shadow-emerald-500/20 transition-all"
          >
            <Save className="w-4 h-4" /> Save Settings
          </button>
        </div>
      </form>
    </div>
  );
};
