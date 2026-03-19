"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, History } from "lucide-react";
import { SummarizerUpload } from "@/components/dashboard/summarizer-upload";
import { SummaryResults } from "@/components/dashboard/summary-results";
import { SummaryHistoryDrawer } from "@/components/dashboard/summary-history-drawer";

export default function AIDiscoveryPage() {
  const [summaryData, setSummaryData] = useState<any>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  return (
    <div className="space-y-4 min-h-[calc(100vh-10rem)]">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
           <div className="flex items-center gap-2 mb-0.5">
             <div className="w-6 h-6 bg-accent rounded-md flex items-center justify-center text-white shadow-lg shadow-accent/20">
                <Sparkles size={12} />
             </div>
             <span className="text-[8px] font-black uppercase tracking-widest text-accent">AI Core Analysis</span>
           </div>
          <h1 className="text-xl font-display font-bold text-slate-900 mb-0.5 tracking-tight">
            Document Summarizer
          </h1>
          <p className="text-[10px] text-slate-500 font-medium">
            Autonomous intelligence for legal truth extraction.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsHistoryOpen(true)}
            className="px-5 py-2.5 bg-white border border-slate-100 text-slate-500 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-50 transition-all shadow-sm text-xs"
          >
            <History size={16} /> View History
          </button>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="relative">
        <AnimatePresence mode="wait">
          {!summaryData ? (
            <motion.div
              key="upload-view"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="bg-white border border-slate-100 rounded-3xl p-6 md:p-10 shadow-sm flex flex-col items-center justify-center overflow-hidden min-h-[400px] relative"
            >
              {/* Background Glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-radial-gradient from-accent/5 to-transparent pointer-events-none" />
              
              <div className="relative z-10 w-full max-w-xl mx-auto space-y-6">
                <div className="text-center space-y-1">
                   <h2 className="text-2xl font-display font-bold text-slate-900">Analyze Complex Documents</h2>
                   <p className="text-[10px] text-slate-500 font-medium">Upload discovery files, contracts, or medical records for instant structured summaries.</p>
                </div>
                
                <SummarizerUpload onSummaryGenerated={(data) => setSummaryData(data)} />

                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-50">
                   <FeatureIcon label="Court Filings" icon={<ScaleIcon />} />
                   <FeatureIcon label="Contracts" icon={<DocIcon />} />
                   <FeatureIcon label="Discovery" icon={<SearchIcon />} />
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="results-view"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full"
            >
              <SummaryResults 
                data={summaryData} 
                onReset={() => setSummaryData(null)} 
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <SummaryHistoryDrawer 
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        onSelectSummary={(data) => setSummaryData(data)}
      />
    </div>
  );
}

function FeatureIcon({ label, icon }: { label: string, icon: React.ReactNode }) {
  return (
    <div className="flex items-center justify-center gap-2">
      <div className="w-8 h-8 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 border border-slate-100">
        {icon}
      </div>
      <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">{label}</span>
    </div>
  );
}

function ScaleIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/></svg>; }
function DocIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>; }
function SearchIcon() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>; }
