"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  History, 
  Clock, 
  FileText, 
  MessageSquare, 
  Sparkles,
  Search,
  Loader2
} from "lucide-react";
import { cn } from "@/utils/utils";

interface Note {
  id: string;
  content: string;
  type: string;
  date: string;
}

interface CaseNotesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  leadId: string;
  leadName: string;
}

export function CaseNotesDrawer({ isOpen, onClose, leadId, leadName }: CaseNotesDrawerProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchNotes = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/leads/notes/${leadId}`);
      if (res.ok) {
        const data = await res.json();
        setNotes(data.notes || []);
      }
    } catch (err) {
      console.error("Fetch notes failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && leadId) {
      fetchNotes();
    }
  }, [isOpen, leadId]);

  const filteredNotes = notes.filter(n => 
    n.content.toLowerCase().includes(searchTerm.toLowerCase()) || 
    n.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-100 bg-slate-900/40 backdrop-blur-[2px]"
          />
          
          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-lg bg-white z-101 shadow-2xl flex flex-col border-l border-slate-100"
          >
            {/* Header */}
            <div className="p-8 border-b border-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500">
                  <History size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-display font-bold text-slate-900 leading-tight">Case History</h2>
                  <p className="text-xs font-bold text-slate-400">{leadName}</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
                <X size={20} className="text-slate-400" />
              </button>
            </div>

            {/* Search */}
            <div className="p-6 pb-0">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-accent transition-colors" size={16} />
                <input 
                  type="text" 
                  placeholder="Filter history..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-accent/5 focus:border-accent transition-all text-xs font-medium"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
              {isLoading ? (
                <div className="h-full flex items-center justify-center">
                  <Loader2 className="animate-spin text-accent/40" size={32} />
                </div>
              ) : filteredNotes.length > 0 ? (
                filteredNotes.map((note, idx) => (
                  <div key={note.id} className="relative pl-8 group pb-6">
                    {/* Timeline elements */}
                    {idx !== filteredNotes.length - 1 && (
                      <div className="absolute left-[11px] top-4 bottom-[-24px] w-0.5 bg-slate-50" />
                    )}
                    <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-white border border-slate-100 flex items-center justify-center z-10 group-hover:border-accent transition-colors">
                      {note.type.includes("AI") ? (
                        <Sparkles size={10} className="text-accent" />
                      ) : (
                        <FileText size={10} className="text-slate-400" />
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                          {note.type} • {new Date(note.date).toLocaleDateString()}
                        </span>
                        <Clock size={10} className="text-slate-300" />
                      </div>
                      <div className="p-4 bg-slate-50 border border-slate-50 rounded-2xl group-hover:border-slate-100 transition-colors">
                        <p className="text-xs font-medium text-slate-600 leading-relaxed whitespace-pre-wrap">
                          {note.content}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-48 flex flex-col items-center justify-center text-slate-400 gap-2">
                  <History size={24} className="opacity-20" />
                  <p className="text-[10px] font-black uppercase tracking-widest">No history found</p>
                </div>
              )}
            </div>

            {/* Footer Status */}
            <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                 <Clock size={12} className="text-accent" /> Proper Tracking Enabled
               </span>
               <span className="text-[10px] font-bold text-slate-400">
                 {filteredNotes.length} Items
               </span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
