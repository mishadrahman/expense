import React from 'react';
import { useExpense } from '../context/ExpenseContext';
import { useBackToCloseModal } from '../hooks/useBackToCloseModal';
import { X, Smartphone, Download, RefreshCw } from 'lucide-react';

interface PwaInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PwaInstallModal: React.FC<PwaInstallModalProps> = ({ isOpen, onClose }) => {
  const { deferredPrompt, installApp, isInIframe, clearCacheAndReload } = useExpense();
  const [showManualGuide, setShowManualGuide] = React.useState(false);

  // Close PWA modal on Back button press
  useBackToCloseModal(isOpen, onClose);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    if (isInIframe) {
      window.open(window.location.href, '_blank');
      onClose();
      return;
    }

    const success = await installApp();
    if (success) {
      onClose();
    } else {
      setShowManualGuide(true);
    }
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
              Personal Expense Tracker
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              ইনস্টল করে আপনার ফোনে বা কম্পিউটারে অফলাইনে অ্যাপ হিসেবে ব্যবহার করুন
            </p>
          </div>
        </div>

        {/* Direct Action Buttons */}
        <div className="space-y-2.5">
          <button
            type="button"
            onClick={handleInstallClick}
            className="w-full flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm shadow-lg shadow-emerald-500/25 transition-all transform active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>ইনস্টল করুন (Install App)</span>
          </button>

          {showManualGuide && (
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-left text-xs text-amber-200 space-y-1 animate-fadeIn">
              <p className="font-bold text-amber-400">সরাসরি প্রম্পট পাওয়া যায়নি:</p>
              <p className="text-[11px] text-slate-300">
                ব্রাউজারের (⋮) মেনু থেকে <strong className="text-white">"Install app"</strong> অথবা <strong className="text-white">"Add to Home screen"</strong> চাপুন।
              </p>
            </div>
          )}

          {/* Dev / Cache Reset Button requested by user */}
          <button
            type="button"
            onClick={clearCacheAndReload}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold text-xs border border-amber-500/30 transition-all active:scale-95"
          >
            <RefreshCw className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
            <span>ক্যাশ মুছে নতুন আপডেট নিন (Clear Cache)</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-1.5 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors"
          >
            পরে করব (Not Now)
          </button>
        </div>
      </div>
    </div>
  );
};


