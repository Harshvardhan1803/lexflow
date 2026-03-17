"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, FileText, ChevronRight, Gavel, Scale, AlertCircle, Bookmark, Share2 } from "lucide-react";
import { UploadZone } from "@/components/dashboard/upload-zone";
import { AnalysisAnimation } from "@/components/dashboard/analysis-animation";
import { cn } from "@/utils/utils";

type ViewState = "upload" | "processing" | "results";

export default function AIDiscoveryPage() {
  const [view, setView] = useState<ViewState>("upload");
  const [fileName, setFileName] = useState("");

  const handleFileSelect = (file: File) => {
    setFileName(file.name);
    setView("processing");
  };

  const handleAnalysisComplete = () => {
    setView("results");
  };

  return (
    <div className="space-y-10 min-h-[calc(100vh-10rem)]">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-900 mb-2 tracking-tight">
            AI Discovery Workspace
          </h1>
          <p className="text-slate-500 font-medium max-w-lg italic">
            &quot;Autonomous intelligence for legal truth extraction.&quot;
          </p>
        </div>
        
        <AnimatePresence>
          {view === "results" && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-3"
            >
              <button className="p-3 rounded-xl bg-white border border-slate-100 text-slate-500 hover:text-accent transition-all shadow-sm">
                <Share2 size={18} />
              </button>
              <button className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold flex items-center gap-2 shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all">
                Export Discovery Report <ChevronRight size={18} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main Interactive View */}
      <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm min-h-[500px] flex flex-col items-center justify-center relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-brand-soft/50 blur-[120px] rounded-full" />

        <AnimatePresence mode="wait">
          {view === "upload" && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full"
            >
              <UploadZone onFileSelect={handleFileSelect} />
            </motion.div>
          )}

          {view === "processing" && (
            <motion.div
              key="processing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full"
            >
              <AnalysisAnimation onComplete={handleAnalysisComplete} />
            </motion.div>
          )}

          {view === "results" && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-4xl space-y-8"
            >
              {/* Discovery Summary Header */}
              <div className="flex items-start gap-6 p-6 rounded-3xl bg-slate-50 border border-slate-100 relative">
                <div className="w-14 h-14 bg-accent text-white rounded-2xl flex items-center justify-center shadow-lg shadow-accent/30 relative z-10">
                  <FileText size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-display font-bold text-slate-900 mb-1">{fileName || "Motion_to_Dismiss_Draft.pdf"}</h3>
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-bold text-accent uppercase tracking-wider">AI Score: 94% Accuracy</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                    <span className="text-xs font-medium text-slate-500">Processed in 4.2s by LexFlow Engine</span>
                  </div>
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <Bookmark className="text-slate-300 hover:text-accent cursor-pointer transition-colors" size={20} />
                </div>
              </div>

              {/* Data Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Legal Summary */}
                <div className="space-y-4">
                  <h4 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                    <Scale size={16} className="text-accent" /> Legal Narrative
                  </h4>
                  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm leading-relaxed text-slate-600 text-sm">
                    This document primarily addresses a **Motion to Dismiss** based on lack of personal jurisdiction. The plaintiff fails to establish sufficient minimum contacts between the defendant and the forum state. Key precedents cited include *International Shoe Co. v. Washington* and *Daimler AG v. Bauman*.
                  </div>
                </div>

                {/* Key Entities */}
                <div className="space-y-4">
                  <h4 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                    <Gavel size={16} className="text-accent" /> Key Entities
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    <EntityBadge type="Defendant" label="TechCorp Solutions LLC" />
                    <EntityBadge type="Jurisdiction" label="Southern District of NY" />
                    <EntityBadge type="Deadline" label="April 12, 2024" isUrgent />
                    <EntityBadge type="Precedent" label="Ford Motor Co. v. Montana" />
                  </div>
                </div>
              </div>

              {/* AI Insight Box */}
              <div className="p-6 rounded-2xl bg-slate-950 text-white relative overflow-hidden group border border-slate-800 shadow-xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 blur-3xl opacity-50 group-hover:opacity-100 transition-opacity" />
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center flex-shrink-0">
                    <Bot size={20} />
                  </div>
                  <div>
                    <h5 className="font-bold mb-1">LexFlow Strategy Insight</h5>
                    <p className="text-sm text-slate-400 leading-relaxed font-medium">
                      The defense argument regarding &quot;general jurisdiction&quot; appears weak. Recommendation: Focus on **Specific Jurisdiction** and the lack of a causal link between the defendant&apos;s forum-state conduct and the plaintiff&apos;s claim.
                    </p>
                  </div>
                </div>
              </div>

              {/* Reset Button */}
              <div className="flex justify-center pt-8">
                <button 
                  onClick={() => setView("upload")}
                  className="text-sm font-bold text-slate-400 hover:text-accent flex items-center gap-2 transition-colors"
                >
                  <AlertCircle size={14} /> Process another document
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function EntityBadge({ type, label, isUrgent }: { type: string, label: string, isUrgent?: boolean }) {
  return (
    <div className={cn(
      "px-4 py-2 rounded-xl border flex flex-col gap-0.5 transition-all hover:border-accent hover:shadow-md",
      isUrgent ? "bg-red-50 border-red-100" : "bg-white border-slate-100"
    )}>
      <span className={cn(
        "text-[9px] font-black uppercase tracking-wider",
        isUrgent ? "text-red-500" : "text-slate-400"
      )}>{type}</span>
      <span className="text-xs font-bold text-slate-800">{label}</span>
    </div>
  );
}
