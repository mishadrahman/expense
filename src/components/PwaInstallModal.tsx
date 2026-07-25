import React from 'react';
import { useExpense } from '../context/ExpenseContext';
import { useBackToCloseModal } from '../hooks/useBackToCloseModal';
import { X, Download, Smartphone, Sparkles, CheckCircle2 } from 'lucide-react';

interface PwaInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PwaInstallModal: React.FC<PwaInstallModalProps> = ({ isOpen, onClose }) => {
  const { deferredPrompt, installApp } = useExpense();

  // Close PWA modal on Back button press
  useBackToCloseModal(isOpen, onClose);

  if (!isOpen) return null;

  const handleInstallClick = () => {
    if (deferredPrompt) {
      installApp();
    } else {
      // Fallback if browser didn't save prompt yet or already installed
      installApp();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-sm p-6 shadow-2xl relative space-y-6 text-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-100 bg-slate-800/60 hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Icon & Title */}
        <div className="space-y-3 pt-2">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-slate-950 font-bold flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20 ring-4 ring-emerald-500/20">
            <Smartphone className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-100">
              Install Expense Tracker
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Add to your device for instant offline access & quick tracking
            </p>
          </div>
        </div>

        {/* Feature Badges */}
        <div className="grid grid-cols-2 gap-2 text-left bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Fast & Lightweight</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Works 100% Offline</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Daily Reminders</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Cloud Backup</span>
          </div>
        </div>

        {/* Main Install Action Button */}
        <div className="space-y-2">
          <button
            type="button"
            onClick={handleInstallClick}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/25 transition-all transform active:scale-98"
          >
            <Download className="w-4 h-4" />
            <span>Install App Now</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors"
          >
            Not Now
          </button>
        </div>
      </div>
    </div>
  );
};

