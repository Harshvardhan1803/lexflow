"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Briefcase,
  Search,
  Filter,
  MoreHorizontal,
  ChevronRight,
  Clock,
  AlertCircle
} from "lucide-react";
import { cn } from "@/utils/utils";
import { LeadsTable } from "@/components/dashboard/leads-table";

export default function ActiveCasesPage() {
  const [cases, setCases] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deadlinesCount, setDeadlinesCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [leadsRes, deadlinesRes] = await Promise.all([
          fetch("/api/leads"),
          fetch("/api/deadlines")
        ]);

        if (leadsRes.ok) {
          const data = await leadsRes.json();
          const activeCases = (data.data || []).filter((item: any) => item.status === "case");
          setCases(activeCases);
        }

        if (deadlinesRes.ok) {
          const data = await deadlinesRes.json();
          const upcoming = (data.data || []).filter((d: any) => {
            const date = new Date(d.date);
            const weekAway = new Date();
            weekAway.setDate(weekAway.getDate() + 7);
            return d.status === 'pending' && date <= weekAway;
          });
          setDeadlinesCount(upcoming.length);
        }
      } catch (err) {
        console.error("Fetch cases failed:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 bg-slate-900 rounded-lg flex items-center justify-center text-white shadow-lg shadow-slate-900/20">
              <Briefcase size={14} />
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Firm Operations</span>
          </div>
          <h1 className="text-2xl font-display font-bold text-slate-900 mb-1 tracking-tight">
            Active Case Management
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Manage your firm's ongoing litigation and high-value matters.
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          label="Total Active Cases"
          value={cases.length.toString()}
          subtext="From your leads funnel"
          icon={<Briefcase size={18} />}
        />
        <StatCard
          label="Upcoming Deadlines"
          value={deadlinesCount.toString()}
          subtext="Next 7 days"
          icon={<Clock size={18} />}
          variant="accent"
        />
        <StatCard
          label="Risk Alerts"
          value={deadlinesCount > 5 ? "High" : "Low"}
          subtext={deadlinesCount > 0 ? "Check timeline" : "No risks detected"}
          icon={<AlertCircle size={18} />}
          variant={deadlinesCount > 5 ? "danger" : "default"}
        />
      </div>

      {/* Main Content - Reusing LeadsTable with case filter */}
      <div className="bg-white border border-slate-100 rounded-xl p-8 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-lg font-display font-bold text-slate-900">Litigation Queue</h2>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-slate-100 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50 transition-all flex items-center gap-2">
              <Filter size={14} /> Filter
            </button>
          </div>
        </div>

        <LeadsTable leads={cases} isLoading={isLoading} />
      </div>
    </div>
  );
}

function StatCard({ label, value, subtext, icon, variant = "default" }: any) {
  const styles = {
    default: "bg-white border-slate-100",
    accent: "bg-accent/5 border-accent/20",
    danger: "bg-red-50 border-red-100"
  };

  const iconStyles = {
    default: "bg-slate-50 text-slate-400",
    accent: "bg-accent text-white",
    danger: "bg-red-500 text-white"
  };

  return (
    <div className={cn("p-6 rounded-xl border shadow-sm space-y-4", styles[variant as keyof typeof styles])}>
      <div className="flex items-center justify-between">
        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", iconStyles[variant as keyof typeof iconStyles])}>
          {icon}
        </div>
        <ChevronRight size={16} className="text-slate-300" />
      </div>
      <div>
        <h3 className="text-3xl font-display font-bold text-slate-900">{value}</h3>
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">{label}</p>
        <p className="text-[10px] text-slate-400 font-medium mt-0.5">{subtext}</p>
      </div>
    </div>
  );
}
