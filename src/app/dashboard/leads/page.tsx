"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { UserPlus, Download } from "lucide-react";
import { cn } from "@/utils/utils";
import { LeadsTable } from "@/components/dashboard/leads-table";
import { NewLeadModal } from "@/components/dashboard/new-lead-modal";

export default function LeadsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-10">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-900 mb-2 tracking-tight">
            Intake Leads
          </h1>
          <p className="text-slate-500 font-medium max-w-lg">
            Manage potential clients and coordinate with your AI Screening Bot.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="p-2.5 rounded-xl bg-white border border-slate-100 text-slate-500 hover:text-accent hover:border-accent/30 transition-all flex items-center gap-2 text-sm font-bold shadow-sm">
            <Download size={18} /> Export
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 bg-accent text-white rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-accent/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <UserPlus size={18} /> New Lead
          </button>
        </div>
      </div>

      {/* Stats Quick Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <LeadStatCard 
          label="Total Active Leads" 
          value="156" 
          increase="+12" 
          increaseLabel="this week"
        />
        <LeadStatCard 
          label="Conversion Rate" 
          value="24.8%" 
          increase="+3.2%" 
          increaseLabel="vs last month"
        />
        <LeadStatCard 
          label="AI Screening Queue" 
          value="8" 
          isWarning={true}
          increaseLabel="Needs attention"
        />
      </div>

      {/* Main Content: Table */}
      <div className="pt-4">
        <LeadsTable />
      </div>

      {/* Modals */}
      <NewLeadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

function LeadStatCard({ label, value, increase, increaseLabel, isWarning }: {
  label: string;
  value: string;
  increase?: string;
  increaseLabel: string;
  isWarning?: boolean;
}) {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow group">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">{label}</p>
      <div className="flex items-end justify-between">
        <h4 className="text-3xl font-display font-bold text-slate-900 leading-none">{value}</h4>
        <div className="flex flex-col items-end">
          {increase && (
            <span className="text-xs font-bold text-green-600 mb-0.5">{increase}</span>
          )}
          <span className={cn(
            "text-[10px] font-bold uppercase tracking-tight",
            isWarning ? "text-red-500" : "text-slate-400"
          )}>
            {increaseLabel}
          </span>
        </div>
      </div>
    </div>
  );
}
