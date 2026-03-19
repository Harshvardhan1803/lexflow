"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  History,
  FileText,
  Search,
  Loader2,
  ChevronRight,
  Clock
} from "lucide-react";

interface SummaryHistory {
  id: number;
  file_name: string;
  summary_json: any;
  created_at: string;
}

interface SummaryHistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSummary: (summary: any) => void;
}

export function SummaryHistoryDrawer({ isOpen, onClose, onSelectSummary }: SummaryHistoryDrawerProps) {
  const [history, setHistory] = useState<SummaryHistory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchHistory = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/ai/summarize");
      if (res.ok) {
        const data = await res.json();
        setHistory(data.data || []);
      }
    } catch (err) {
      console.error("Fetch history failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchHistory();
    }
  }, [isOpen]);

  const filteredHistory = history.filter(h =>
    h.file_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-100 bg-slate-900/40 backdrop-blur-[2px]"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-101 shadow-2xl flex flex-col border-l border-slate-100"
          >
            <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white shadow-sm border border-slate-100 rounded-xl flex items-center justify-center text-accent">
                  <History size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-display font-bold text-slate-900 leading-tight">Analysis History</h2>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Revisit past summaries</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <X size={20} className="text-slate-400" />
              </button>
            </div>

            <div className="p-6 pb-2">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-accent transition-colors" size={16} />
                <input
                  type="text"
                  placeholder="Find a document..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-accent/5 focus:border-accent transition-all text-xs font-medium"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {isLoading ? (
                <div className="h-full flex items-center justify-center">
                  <Loader2 className="animate-spin text-accent/40" size={32} />
                </div>
              ) : filteredHistory.length > 0 ? (
                filteredHistory.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelectSummary(item.summary_json);
                      onClose();
                    }}
                    className="w-full text-left p-4 rounded-xl border border-slate-50 hover:border-accent/20 hover:bg-accent/5 transition-all group relative overflow-hidden"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-accent group-hover:text-white transition-all">
                        <FileText size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-900 truncate mb-1">{item.file_name}</p>
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                            <Clock size={10} /> {new Date(item.created_at).toLocaleDateString()}
                          </span>
                          <span className="w-1 h-1 rounded-full bg-slate-200" />
                          <span className="text-[10px] font-black text-accent uppercase tracking-widest">Analysis Ready</span>
                        </div>
                      </div>
                      <ChevronRight size={16} className="text-slate-300 group-hover:text-accent transition-all mt-1" />
                    </div>
                  </button>
                ))
              ) : (
                <div className="h-48 flex flex-col items-center justify-center text-slate-400 gap-2">
                  <History size={24} className="opacity-20" />
                  <p className="text-[10px] font-black uppercase tracking-widest">No history found</p>
                </div>
              )}
            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-100 text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Last 10 Analysis Results
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
