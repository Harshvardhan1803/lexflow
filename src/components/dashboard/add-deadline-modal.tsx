"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Calendar,
  Sparkles,
  CheckCircle2,
  Loader2,
  Scale,
  Gavel,
  Briefcase,
  Users
} from "lucide-react";
import { cn } from "@/utils/utils";
import { CaseType } from "@/lib/deadline-calculator";

interface AddDeadlineModalProps {
  isOpen: boolean;
  onClose: () => void;
  leadId: number;
  onSuccess: () => void;
}

const CASE_TYPES: { id: CaseType; label: string; icon: any; color: string }[] = [
  { id: "civil", label: "Civil Litigation", icon: Scale, color: "text-blue-500 bg-blue-50" },
  { id: "criminal", label: "Criminal Defense", icon: Gavel, color: "text-red-500 bg-red-50" },
  { id: "family", label: "Family Law", icon: Users, color: "text-emerald-500 bg-emerald-50" },
  { id: "employment", label: "Employment Law", icon: Briefcase, color: "text-orange-500 bg-orange-50" },
];

export function AddDeadlineModal({ isOpen, onClose, leadId, onSuccess }: AddDeadlineModalProps) {
  const [selectedType, setSelectedType] = useState<CaseType>("civil");
  const [anchorDate, setAnchorDate] = useState(new Date().toISOString().split('T')[0]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleGenerate = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch(`/api/deadlines/${leadId}`, {
        method: "POST",
        body: JSON.stringify({ anchorDate, caseType: selectedType }),
        headers: { "Content-Type": "application/json" }
      });

      if (res.ok) {
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
          onSuccess();
          onClose();
        }, 1500);
      }
    } catch (err) {
      console.error("Generation failed:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center text-accent">
                  <Calendar size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-display font-bold text-slate-900 leading-tight">Automate Deadlines</h2>
                  <p className="text-[10px] text-slate-400 font-medium lowercase">LexFlow calculates milestones from case rules.</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-400"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Case Type Selection */}
              <div className="space-y-3">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Select Case Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {CASE_TYPES.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setSelectedType(type.id)}
                      className={cn(
                        "p-3 rounded-xl border-2 transition-all flex flex-col items-start gap-2 text-left group relative",
                        selectedType === type.id
                          ? "border-accent bg-accent/5 ring-4 ring-accent/5 shadow-sm"
                          : "border-slate-50 bg-white hover:border-slate-100"
                      )}
                    >
                      {selectedType === type.id && (
                        <div className="absolute top-2 right-2 text-accent">
                          <CheckCircle2 size={14} />
                        </div>
                      )}
                      <div className={cn("p-1.5 rounded-lg transition-colors", type.color)}>
                        <type.icon size={16} />
                      </div>
                      <span className={cn(
                        "text-[10px] font-bold transition-colors",
                        selectedType === type.id ? "text-accent" : "text-slate-600"
                      )}>
                        {type.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Anchor Date */}
              <div className="space-y-3">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Anchor Date (e.g. Filing Date)</label>
                <div className="relative group">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <Calendar size={16} />
                  </div>
                  <input
                    type="date"
                    value={anchorDate}
                    onChange={(e) => setAnchorDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all text-xs font-bold text-slate-700"
                  />
                </div>
              </div>

              {/* Action Button */}
              {!isSuccess ? (
                <button
                  onClick={handleGenerate}
                  disabled={isProcessing}
                  className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 disabled:opacity-50 text-xs"
                >
                  {isProcessing ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <>
                      <Sparkles className="text-accent" size={18} />
                      Generate {
                        selectedType === 'civil' ? '5' : 
                        selectedType === 'criminal' ? '4' : 
                        selectedType === 'family' ? '3' : '2'
                      } Deadlines
                    </>
                  )}
                </button>
              ) : (
                <div className="w-full bg-green-500 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-3 shadow-xl shadow-green-500/10 animate-pulse text-xs">
                  <CheckCircle2 size={20} /> Timeline Calculated
                </div>
              )}
            </div>

            {/* Warning / Footer */}
            <div className="p-6 bg-slate-50 text-center">
              <p className="text-[10px] font-bold text-slate-400 max-w-xs mx-auto text-balance">
                Warning: AI-calculated dates should be verified against local court rules and service requirements.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
