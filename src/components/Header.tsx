import React from 'react';
import { useExpense } from '../context/ExpenseContext';
import { Wallet, Wifi, WifiOff, Download, LogIn, LogOut, Bell } from 'lucide-react';

export const Header: React.FC<{ onOpenSettings: () => void }> = ({ onOpenSettings }) => {
  const {
    user,
    isOnline,
    openAuthModal,
    logout,
    deferredPrompt,
    installApp,
    notificationPermission,
    requestNotificationPermission
  } = useExpense();

  return (
    <header className="sticky top-0 z-30 bg-slate-900/80 backdrop-blur-md border-b border-slate-800/80 px-4 py-3">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-2">
        {/* Logo & Name */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-900/30 ring-1 ring-emerald-400/30">
            <Wallet className="w-5 h-5 text-slate-950 font-bold" />
          </div>
          <div>
            <h1 className="font-bold text-base sm:text-lg text-slate-100 leading-tight">
              Expense Tracker
            </h1>
            <p className="text-[10px] sm:text-xs text-slate-400 font-medium">Personal Finance</p>
          </div>
        </div>

        {/* Status Indicators & Actions */}
        <div className="flex items-center gap-2">
          {/* Network status */}
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
              isOnline
                ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800/50'
                : 'bg-amber-950/40 text-amber-400 border-amber-800/50'
            }`}
            title={isOnline ? 'Connected to internet & Firestore sync' : 'Offline mode active (saving locally)'}
          >
            {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5 animate-pulse" />}
            <span className="hidden sm:inline">{isOnline ? 'Online' : 'Offline'}</span>
          </div>

          {/* PWA Install Button */}
          {deferredPrompt && (
            <button
              onClick={installApp}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-semibold shadow-sm transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Install App</span>
            </button>
          )}

          {/* Notification Permission Quick Trigger */}
          {notificationPermission !== 'granted' && (
            <button
              onClick={requestNotificationPermission}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-emerald-400 transition-colors"
              title="Enable Daily Reminder Notifications"
            >
              <Bell className="w-4 h-4 text-amber-400 animate-bounce" />
            </button>
          )}

          {/* Google Auth Status / Login */}
          {user ? (
            <div className="flex items-center gap-2 pl-1 border-l border-slate-800">
              <img
                src={user.photoURL || 'https://api.dicebear.com/7.x/bottts/svg?seed=' + (user.email || 'user')}
                alt={user.displayName || 'User'}
                className="w-7 h-7 rounded-full ring-2 ring-emerald-500/50 object-cover"
              />
              <button
                onClick={logout}
                className="hidden md:flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 transition-colors"
                title="Sign out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={openAuthModal}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
              title="Sign In / Create Account"
            >
              <LogIn className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
