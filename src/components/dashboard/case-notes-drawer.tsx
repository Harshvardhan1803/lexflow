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
  Loader2,
  Calendar,
  Plus
} from "lucide-react";
import { cn } from "@/utils/utils";
import { DeadlineTracker } from "./deadline-tracker";
import { AddDeadlineModal } from "./add-deadline-modal";
import Tooltip from '@mui/material/Tooltip';
import Zoom from '@mui/material/Zoom';

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

import { LexLoader } from "../ui/loader";

export function CaseNotesDrawer({ isOpen, onClose, leadId, leadName }: CaseNotesDrawerProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"history" | "deadlines">("history");
  const [isAddDeadlineOpen, setIsAddDeadlineOpen] = useState(false);
  const [deadlineRefreshKey, setDeadlineRefreshKey] = useState(0);

  const fetchNotes = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/notes?contact_id=${leadId}&t=${Date.now()}`);
      if (res.ok) {
        const data = await res.json();
        const formattedNotes = data.data.map((n: any) => ({
          id: n.id.toString(),
          content: n.content,
          type: n.type || "Lead Action",
          date: n.created_at
        }));
        setNotes(formattedNotes);
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
              <Tooltip title="Close Drawer" placement="left" arrow slots={{ transition: Zoom }} slotProps={{ tooltip: { sx: { bgcolor: '#0f172a', fontWeight: 700, borderRadius: '8px' } } }}>
                <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
                  <X size={20} className="text-slate-400" />
                </button>
              </Tooltip>
            </div>

            {/* Tabs */}
            <div className="flex px-6 mt-4">
              <button
                onClick={() => setActiveTab("history")}
                className={cn(
                  "flex-1 py-3 text-[10px] font-black uppercase tracking-widest border-b-2 transition-all",
                  activeTab === "history" ? "border-accent text-accent" : "border-transparent text-slate-400"
                )}
              >
                Activity History
              </button>
              <button
                onClick={() => setActiveTab("deadlines")}
                className={cn(
                  "flex-1 py-3 text-[10px] font-black uppercase tracking-widest border-b-2 transition-all",
                  activeTab === "deadlines" ? "border-accent text-accent" : "border-transparent text-slate-400"
                )}
              >
                Deadline Tracker
              </button>
            </div>

            {/* Search / Context Actions */}
            <div className="p-6 pb-0 flex items-center gap-3">
              <div className="relative group flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-accent transition-colors" size={16} />
                <input
                  type="text"
                  placeholder={activeTab === "history" ? "Filter history..." : "Search deadlines..."}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-accent/5 focus:border-accent transition-all text-xs font-medium"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              {activeTab === "deadlines" && (
                <Tooltip title="Add New Deadline" placement="left" arrow slots={{ transition: Zoom }} slotProps={{ tooltip: { sx: { bgcolor: '#0f172a', fontWeight: 700, borderRadius: '8px' } } }}>
                  <button
                    onClick={() => setIsAddDeadlineOpen(true)}
                    className="p-2 bg-slate-900 border border-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10"
                  >
                    <Plus size={18} />
                  </button>
                </Tooltip>
              )}
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
              {activeTab === "history" ? (
                <div className="space-y-6">
                  {isLoading ? (
                    <div className="h-96 flex items-center justify-center">
                      <LexLoader label="Loading History..." />
                    </div>
                  ) : filteredNotes.length > 0 ? (
                    filteredNotes.map((note, idx) => (
                      <div key={note.id} className="relative pl-8 group pb-6">
                        {/* Timeline elements */}
                        {idx !== filteredNotes.length - 1 && (
                          <div className="absolute left-[11px] top-4 bottom-[-24px] w-0.5 bg-slate-50" />
                        )}
                        <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-white border border-slate-100 flex items-center justify-center z-10 group-hover:border-accent transition-colors">
                          {note.type === "AI Action" ? (
                            <Sparkles size={10} className="text-accent" />
                          ) : note.type === "Status Change" ? (
                            <Clock size={10} className="text-blue-500" />
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
                          <div className="p-4 bg-slate-50 border border-slate-50 rounded-xl group-hover:border-slate-100 transition-colors">
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
              ) : (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                  <DeadlineTracker key={deadlineRefreshKey} leadId={Number(leadId)} />
                </div>
              )}
            </div>

            {/* Footer Status */}
            <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Clock size={12} className="text-accent" /> {activeTab === "history" ? "History Tracking Enabled" : "Compliance Monitoring Active"}
              </span>
              <span className="text-[10px] font-bold text-slate-400">
                {activeTab === "history" ? `${filteredNotes.length} Items` : "Calculated Automagically"}
              </span>
            </div>
          </motion.div>

          <AddDeadlineModal
            isOpen={isAddDeadlineOpen}
            onClose={() => setIsAddDeadlineOpen(false)}
            leadId={Number(leadId)}
            onSuccess={() => setDeadlineRefreshKey(prev => prev + 1)}
          />
        </>
      )}
    </AnimatePresence>
  );
}
