"use client";

import { motion } from "framer-motion";
import { 
  Users, 
  Calendar, 
  AlertTriangle, 
  FileText, 
  ArrowRight,
  ShieldCheck,
  CheckCheck,
  Download,
  Share2
} from "lucide-react";
import { cn } from "@/utils/utils";

interface SummaryResultsProps {
  data: {
    executive_summary: string;
    key_parties: { role: string; entity: string }[];
    critical_dates: { event: string; date: string }[];
    legal_risks: { risk: string; severity: string; description: string }[];
    obligations: string[];
  };
  onReset: () => void;
}

export function SummaryResults({ data, onReset }: SummaryResultsProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8 pb-20"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-display font-bold text-slate-900">Analysis Results</h2>
        <div className="flex gap-2">
          <button 
            onClick={() => window.print()}
            className="p-2 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors text-slate-500"
          >
            <Download size={18} />
          </button>
          <button 
            onClick={onReset}
            className="px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold transition-colors"
          >
            New Analysis
          </button>
        </div>
      </div>

      {/* Hero Summary */}
      <motion.div variants={item} className="bg-slate-900 text-white rounded-2xl p-6 md:p-10 relative overflow-hidden group">
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center text-white">
                <FileText size={16} />
             </div>
             <span className="text-[9px] font-black uppercase tracking-widest text-accent">Executive Summary</span>
          </div>
          <p className="text-base md:text-lg font-medium leading-relaxed max-w-4xl text-slate-200">
            {data.executive_summary}
          </p>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-[100px] -mr-32 -mt-32 transition-all group-hover:bg-accent/30" />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Parties & Entities */}
        <motion.div variants={item} className="bg-white border border-slate-100 rounded-2xl p-6 space-y-4 shadow-sm">
          <h3 className="text-xs font-bold text-slate-900 border-l-4 border-accent pl-3 flex items-center gap-2">
            <Users size={14} /> Key Parties & Entities
          </h3>
          <div className="space-y-3">
            {data.key_parties.map((party, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-50 hover:border-slate-100 transition-all">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-0.5">{party.role}</p>
                  <p className="text-xs font-bold text-slate-900">{party.entity}</p>
                </div>
                <ArrowRight size={14} className="text-slate-300" />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Timeline */}
        <motion.div variants={item} className="bg-white border border-slate-100 rounded-4xl p-8 space-y-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 border-l-4 border-blue-500 pl-4 flex items-center gap-2">
            <Calendar size={16} /> Critical Deadlines & Timeline
          </h3>
          <div className="space-y-4">
            {data.critical_dates.map((item, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                <div className="flex-1 flex items-center justify-between border-b border-slate-50 pb-2">
                  <span className="text-xs font-bold text-slate-700">{item.event}</span>
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">{item.date}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Risks & Red Flags */}
        <motion.div variants={item} className="bg-red-50/30 border border-red-100 rounded-4xl p-8 space-y-6 shadow-sm">
          <h3 className="text-sm font-bold text-red-900 border-l-4 border-red-500 pl-4 flex items-center gap-2">
            <AlertTriangle size={16} /> Risks & Red Flags
          </h3>
          <div className="space-y-6">
            {data.legal_risks.map((risk, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-red-700">{risk.risk}</span>
                  <span className={cn(
                    "px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest border",
                    risk.severity === "High" ? "bg-red-100 border-red-200 text-red-700" : "bg-orange-100 border-orange-200 text-orange-700"
                  )}>
                    {risk.severity} Severity
                  </span>
                </div>
                <p className="text-xs text-red-900/60 leading-relaxed font-medium">
                  {risk.description}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Obligations */}
        <motion.div variants={item} className="bg-emerald-50/30 border border-emerald-100 rounded-4xl p-8 space-y-6 shadow-sm">
          <h3 className="text-sm font-bold text-emerald-900 border-l-4 border-emerald-500 pl-4 flex items-center gap-2">
            <ShieldCheck size={16} /> Summary of Obligations
          </h3>
          <div className="space-y-4">
            {data.obligations.map((item, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="mt-1 w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                  <CheckCheck size={12} />
                </div>
                <p className="text-xs text-emerald-900 font-medium leading-relaxed">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div variants={item} className="p-8 bg-slate-50 border border-slate-100 rounded-4xl flex items-center justify-between">
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 border border-slate-100">
              <Share2 size={24} />
           </div>
           <div>
              <p className="text-sm font-bold text-slate-900">Share Report</p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Generate secure link for client portal</p>
           </div>
        </div>
        <button className="px-8 py-3 bg-white border border-slate-200 text-slate-900 rounded-2xl font-bold hover:bg-slate-100 transition-colors shadow-sm">
           Generate Share Link
        </button>
      </motion.div>
    </motion.div>
  );
}
