"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Sparkles,
  Send,
  Copy,
  Check,
  Loader2,
  FileText,
  Mail,
  AlertCircle
} from "lucide-react";
import { cn } from "@/utils/utils";
import { toast } from "react-hot-toast";

interface AIDraftModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientInfo: {
    name: string;
    caseType: string;
    id: string;
  };
}

const DRAFT_TYPES = [
  "Case Update",
  "Document Request",
  "Appointment Reminder",
  "Delay Notification"
];

export function AIDraftModal({ isOpen, onClose, clientInfo }: AIDraftModalProps) {
  const [draftType, setDraftType] = useState(DRAFT_TYPES[0]);
  const [briefNote, setBriefNote] = useState("");
  const [generatedDraft, setGeneratedDraft] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch("/api/ai/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          draftType,
          briefNote,
          clientName: clientInfo.name,
          attorneyName: "Admin User", // Placeholder for actual logged in user
          caseType: clientInfo.caseType
        })
      });

      if (res.ok) {
        const data = await res.json();
        setGeneratedDraft(data.draft);
      }
    } catch (error) {
      console.error("Draft generation failed:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedDraft);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const [isSaving, setIsSaving] = useState(false);

  const handleSaveAsNote = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contact_id: Number(clientInfo.id),
          content: generatedDraft,
          type: "AI Action"
        })
      });

      if (res.ok) {
        onClose();
      }
    } catch (err) {
      console.error("Save note error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center shadow-lg shadow-accent/20">
                  <Sparkles className="text-white" size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-display font-bold text-slate-900">AI Communication Draft</h2>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Powered by LexFlow AI Core</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              {/* Settings Section */}
              {!generatedDraft && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Draft Type</label>
                      <select
                        className="w-full h-12 px-4 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-accent/10 focus:border-accent transition-all cursor-pointer"
                        value={draftType}
                        onChange={(e) => setDraftType(e.target.value)}
                      >
                        {DRAFT_TYPES.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Target Client</label>
                      <div className="h-12 px-4 bg-slate-50 border border-slate-100 rounded-xl flex items-center text-sm font-bold text-slate-500">
                        {clientInfo.name}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Brief Note (Optional)</label>
                    <textarea
                      placeholder="e.g. Next hearing is Jun 15, need to discuss insurance offer."
                      className="w-full h-32 px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-accent/10 focus:border-accent transition-all resize-none"
                      value={briefNote}
                      onChange={(e) => setBriefNote(e.target.value)}
                    />
                  </div>

                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                    {isGenerating ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      <Sparkles className="text-accent group-hover:animate-pulse" size={20} />
                    )}
                    {isGenerating ? "Analyzing Case Context..." : "Generate Professional Draft"}
                  </button>
                </motion.div>
              )}

              {/* Review Section */}
              {generatedDraft && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Mail size={16} className="text-accent" /> Review Generated Draft
                    </h3>
                    <div className="flex gap-2">
                      <button
                        onClick={handleCopy}
                        className="p-2 bg-slate-50 text-slate-500 hover:text-accent rounded-lg border border-slate-100 transition-all flex items-center gap-2 text-xs font-bold"
                      >
                        {isCopied ? <Check size={14} /> : <Copy size={14} />}
                        {isCopied ? "Copied!" : "Copy"}
                      </button>
                      <button
                        onClick={() => setGeneratedDraft("")}
                        className="p-2 bg-slate-50 text-slate-500 hover:text-slate-900 rounded-lg border border-slate-100 transition-all text-xs font-bold"
                      >
                        Reset
                      </button>
                    </div>
                  </div>

                  <div className="p-6 bg-slate-50 border border-slate-100 rounded-xl relative group">
                    <textarea
                      className="w-full min-h-[400px] bg-transparent text-sm font-medium leading-relaxed outline-none resize-none border-none p-0"
                      value={generatedDraft}
                      onChange={(e) => setGeneratedDraft(e.target.value)}
                    />
                  </div>

                  <div className="flex items-center gap-4">
                    <button
                      onClick={handleSaveAsNote}
                      disabled={isSaving}
                      className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all disabled:opacity-50"
                    >
                      {isSaving ? "Saving..." : "Save as Note"}
                    </button>
                    <button
                      onClick={() => toast.success("Email feature coming soon in pro version!", { icon: "🚀" })}
                      className="flex-1 py-4 bg-accent text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] shadow-lg shadow-accent/20 transition-all"
                    >
                      <Send size={18} /> Send to Client
                    </button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 bg-slate-50/50 border-t border-slate-50 flex items-center justify-center">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <AlertCircle size={10} /> AI can make mistakes. Please review before sending.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
