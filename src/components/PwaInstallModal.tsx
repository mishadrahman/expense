import React from 'react';
import { useExpense } from '../context/ExpenseContext';
import { useBackToCloseModal } from '../hooks/useBackToCloseModal';
import { X, Download, Smartphone, Share, MoreVertical, PlusSquare, Monitor, CheckCircle2 } from 'lucide-react';

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
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl relative space-y-5">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-100 bg-slate-800/60 hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-2">
            <Smartphone className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-100">
            Install Expense Tracker App
          </h2>
          <p className="text-xs text-slate-400">
            Install on your phone or desktop for quick access and full offline support.
          </p>
        </div>

        {/* One-click native install button if browser prompt ready */}
        {deferredPrompt ? (
          <div className="bg-emerald-950/40 border border-emerald-800/60 rounded-2xl p-4 text-center space-y-3">
            <p className="text-xs font-semibold text-emerald-300">
              One-click installation is ready for your device!
            </p>
            <button
              onClick={handleInstallClick}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold shadow-lg shadow-emerald-500/20 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Install App Now</span>
            </button>
          </div>
        ) : (
          /* Step-by-step manual guide for Android, iPhone, and PC */
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
            {/* iPhone / iOS instructions */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                <span className="w-5 h-5 rounded-full bg-slate-800 text-emerald-400 flex items-center justify-center text-[11px]">
                  1
                </span>
                <span>iPhone / iPad (Safari Browser)</span>
              </div>
              <ol className="text-xs text-slate-400 space-y-1.5 pl-7 list-disc">
                <li>
                  Tap the <strong className="text-slate-200 font-semibold inline-flex items-center gap-1"><Share className="w-3 h-3 text-emerald-400 inline" /> Share</strong> button at the bottom bar.
                </li>
                <li>
                  Scroll down and tap <strong className="text-slate-200 font-semibold inline-flex items-center gap-1"><PlusSquare className="w-3 h-3 text-emerald-400 inline" /> Add to Home Screen</strong>.
                </li>
                <li>Tap <strong>Add</strong> at the top right.</li>
              </ol>
            </div>

            {/* Android / Chrome instructions */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                <span className="w-5 h-5 rounded-full bg-slate-800 text-emerald-400 flex items-center justify-center text-[11px]">
                  2
                </span>
                <span>Android (Chrome Browser)</span>
              </div>
              <ol className="text-xs text-slate-400 space-y-1.5 pl-7 list-disc">
                <li>
                  Tap the <strong className="text-slate-200 font-semibold inline-flex items-center gap-1"><MoreVertical className="w-3 h-3 text-emerald-400 inline" /> 3 dots</strong> menu at top right.
                </li>
                <li>
                  Select <strong className="text-slate-200 font-semibold">Install App</strong> or <strong className="text-slate-200 font-semibold">Add to Home Screen</strong>.
                </li>
              </ol>
            </div>

            {/* Desktop PC instructions */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                <span className="w-5 h-5 rounded-full bg-slate-800 text-emerald-400 flex items-center justify-center text-[11px]">
                  3
                </span>
                <span>Computer / Laptop (Chrome/Edge)</span>
              </div>
              <p className="text-xs text-slate-400 pl-7 leading-relaxed">
                Click the <strong className="text-slate-200 font-semibold inline-flex items-center gap-1"><Download className="w-3 h-3 text-emerald-400 inline" /> Install Icon</strong> in your browser's address bar at top right.
              </p>
            </div>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
        >
          Got it
        </button>
      </div>
    </div>
  );
};
