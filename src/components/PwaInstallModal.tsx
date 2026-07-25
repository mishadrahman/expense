import React from 'react';
import { useExpense } from '../context/ExpenseContext';
import { useBackToCloseModal } from '../hooks/useBackToCloseModal';
import { X, Smartphone, ExternalLink, Download, Share, MoreVertical, PlusSquare, CheckCircle2 } from 'lucide-react';

interface PwaInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PwaInstallModal: React.FC<PwaInstallModalProps> = ({ isOpen, onClose }) => {
  const { deferredPrompt, installApp, isInIframe } = useExpense();

  // Close PWA modal on Back button press
  useBackToCloseModal(isOpen, onClose);

  if (!isOpen) return null;

  const handleInstallClick = () => {
    if (deferredPrompt) {
      installApp();
      onClose();
    } else if (isInIframe) {
      window.open(window.location.href, '_blank');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-sm p-6 shadow-2xl relative space-y-5 text-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-100 bg-slate-800/60 hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Icon & Title */}
        <div className="space-y-2 pt-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-slate-950 font-bold flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20 ring-4 ring-emerald-500/20">
            <Smartphone className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-slate-100">
              অ্যাপ ইনস্টল করুন (PWA)
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              মোবাইলে বা কম্পিউটারে অ্যাপের মতো ইনস্টল করে একদম অফলাইনে ব্যবহার করুন।
            </p>
          </div>
        </div>

        {/* Dynamic Action Section based on browser environment */}
        {deferredPrompt ? (
          /* Native 1-click install ready */
          <div className="space-y-3">
            <div className="bg-emerald-950/40 border border-emerald-800/60 rounded-2xl p-3 text-center">
              <p className="text-xs font-semibold text-emerald-300 flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>আপনার ব্রাউজারে ইনস্টল তৈরি আছে!</span>
              </p>
            </div>
            <button
              type="button"
              onClick={handleInstallClick}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm shadow-lg shadow-emerald-500/25 transition-all transform active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>এক ক্লিকে ইনস্টল করুন</span>
            </button>
          </div>
        ) : isInIframe ? (
          /* Inside preview iframe */
          <div className="space-y-3">
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3 text-left text-xs text-slate-300 space-y-1.5">
              <p className="font-semibold text-emerald-400 flex items-center gap-1.5">
                <ExternalLink className="w-3.5 h-3.5" />
                <span>নতুন ট্যাবে খুলুন</span>
              </p>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                ব্রাউজারের সিকিউরিটির জন্য প্রিভিউ উইন্ডোর ভেতরে সরাসরি ইনস্টল বাটন কাজ করে না। নিচের বাটনে ক্লিক করে নতুন ট্যাবে খুলুন এবং সহজেই ইনস্টল করুন।
              </p>
            </div>
            <button
              type="button"
              onClick={handleInstallClick}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
            >
              <ExternalLink className="w-4 h-4" />
              <span>নতুন ট্যাবে অ্যাপ খুলুন</span>
            </button>
          </div>
        ) : (
          /* Manual browser menu instructions for Android & iPhone */
          <div className="space-y-2 text-left max-h-[45vh] overflow-y-auto pr-1">
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
              <p className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <MoreVertical className="w-3.5 h-3.5 text-emerald-400" />
                <span>Android (Chrome Browser)</span>
              </p>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                উপরে ডান কোণায় ৩ ডট (⋮) মেনুতে চাপুন এবং <strong className="text-slate-200 font-semibold">"Install app"</strong> বা <strong className="text-slate-200 font-semibold">"Add to Home screen"</strong> নির্বাচন করুন।
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
              <p className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Share className="w-3.5 h-3.5 text-emerald-400" />
                <span>iPhone / iPad (Safari)</span>
              </p>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                নিচে <strong className="text-slate-200 font-semibold">Share</strong> আইকনে চাপুন এবং একটু নিচে গিয়ে <strong className="text-slate-200 font-semibold"><PlusSquare className="w-3 h-3 inline text-emerald-400" /> Add to Home Screen</strong> এ চাপুন।
              </p>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={onClose}
          className="w-full py-2 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors"
        >
          বন্ধ করুন (Close)
        </button>
      </div>
    </div>
  );
};

