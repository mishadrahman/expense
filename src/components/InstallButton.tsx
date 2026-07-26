import React, { useState } from 'react';
import { usePWA } from '../context/PWAContext';
import { Download, Smartphone, CheckCircle2, Share, X } from 'lucide-react';

interface InstallButtonProps {
  variant?: 'header' | 'settings' | 'banner' | 'compact';
  className?: string;
}

export const InstallButton: React.FC<InstallButtonProps> = ({ variant = 'header', className = '' }) => {
  const { isInstallable, isInstalled, isStandalone, isIOS, promptInstall } = usePWA();
  const [showIOSModal, setShowIOSModal] = useState(false);

  const handleClick = async () => {
    if (isIOS && !isStandalone) {
      setShowIOSModal(true);
      return;
    }
    if (isInstallable) {
      await promptInstall();
    }
  };

  // If app is running as standalone app, show compact installed status
  if (isStandalone || isInstalled) {
    if (variant === 'settings') {
      return (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-800/60 text-emerald-400 text-xs font-bold">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>App Installed (Standalone Mode)</span>
        </div>
      );
    }
    return null; // Don't clutter header if already running in installed standalone app
  }

  // Header compact button
  if (variant === 'header' || variant === 'compact') {
    return (
      <>
        <button
          onClick={handleClick}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-extrabold shadow-md shadow-emerald-500/20 active:scale-95 transition-all ${className}`}
          title="Install Expense Tracker as a real app on your home screen"
        >
          <Download className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Install App</span>
        </button>

        {/* iOS Install Instruction Modal */}
        {showIOSModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl relative">
              <button
                onClick={() => setShowIOSModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-100 p-1"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mx-auto">
                <Smartphone className="w-6 h-6" />
              </div>

              <div className="text-center space-y-1">
                <h3 className="text-lg font-extrabold text-slate-100">Install Expense Tracker</h3>
                <p className="text-xs text-slate-400">Install on your iPhone/iPad home screen:</p>
              </div>

              <div className="space-y-3 bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs text-slate-300">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">
                    1
                  </span>
                  <span>
                    Tap the <strong>Share</strong> button <Share className="w-3.5 h-3.5 inline text-sky-400 mx-1" /> in Safari navigation bar.
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">
                    2
                  </span>
                  <span>
                    Scroll down and select <strong>"Add to Home Screen"</strong>.
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">
                    3
                  </span>
                  <span>
                    Tap <strong>Add</strong> at top right to place app icon on your home screen.
                  </span>
                </div>
              </div>

              <button
                onClick={() => setShowIOSModal(false)}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors"
              >
                Got it
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Settings variant
  return (
    <button
      onClick={handleClick}
      className={`w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-extrabold shadow-lg shadow-emerald-500/20 transition-all ${className}`}
    >
      <Download className="w-4 h-4 stroke-[2.5]" />
      <span>Install Expense Tracker App</span>
    </button>
  );
};
