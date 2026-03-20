"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar } from "lucide-react";
import { useEffect } from "react";

interface CalendlyModalProps {
  isOpen: boolean;
  onClose: () => void;
  url?: string;
}

export function CalendlyModal({
  isOpen,
  onClose,
  // IMPORTANT: Replace this with your actual Calendly link (e.g. https://calendly.com/yourname/30min)
  url = "https://calendly.com/lexflow-demo/consultation"
}: CalendlyModalProps) {

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-99999 flex items-center justify-center p-4 md:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative w-full max-w-4xl h-[90vh] bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-white">
                  <Calendar size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-display font-bold text-slate-900 tracking-tight">Schedule Consultation</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Select your preferred time slot</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500"
              >
                <X size={20} />
              </button>
            </div>

            {/* Calendly Content */}
            <div className="flex-1 bg-white relative">
              <iframe
                src={`${url}?hide_landing_page=1&hide_gdpr_banner=1`}
                width="100%"
                height="100%"
                frameBorder="0"
                title="Calendly Scheduling"
              ></iframe>

              {/* Optional: Subtle loader indicator while iframe loads */}
              <div className="absolute inset-0 -z-10 flex items-center justify-center bg-slate-50">
                <div className="w-8 h-8 border-4 border-accent/20 border-t-accent rounded-full animate-spin" />
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Powered by LexFlow Scheduling Engine
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
