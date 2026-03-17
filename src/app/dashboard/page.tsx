"use client";

import { motion } from "framer-motion";
import { 
  Briefcase, 
  Users, 
  TrendingUp, 
  Clock, 
  ArrowUpRight, 
  ArrowDownRight,
  ChevronRight,
  Gavel
} from "lucide-react";
import { cn } from "@/utils/utils";

export default function DashboardOverview() {
  return (
    <div className="space-y-10">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-900 mb-2 tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-slate-500 font-medium">
            Welcome back. Here&apos;s a snapshot of your firm&apos;s current activity.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-white border border-slate-100 shadow-sm flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-bold text-slate-600">AI Engine: Online</span>
          </div>
        </div>
      </div>

      {/* Stat Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Active Cases" 
          value="42" 
          change="+12%" 
          isPositive={true} 
          icon={<Briefcase size={20} />} 
        />
        <StatCard 
          title="New Leads" 
          value="128" 
          change="+18%" 
          isPositive={true} 
          icon={<Users size={20} />} 
        />
        <StatCard 
          title="Revenue (MRR)" 
          value="$24,500" 
          change="-4%" 
          isPositive={false} 
          icon={<TrendingUp size={20} />} 
        />
        <StatCard 
          title="Avg. Response" 
          value="1.2h" 
          change="-15%" 
          isPositive={true} 
          icon={<Clock size={20} />} 
          subtitle="Time saved by AI"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-3xl p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-display font-bold text-slate-900 tracking-tight">
              Recent Case Activity
            </h3>
            <button className="text-sm font-bold text-accent hover:underline flex items-center gap-1">
              View All <ChevronRight size={16} />
            </button>
          </div>
          
          <div className="space-y-6">
            <ActivityItem 
              firm="Green Tree Legal" 
              action="AI Drafted: Motion to Dismiss" 
              time="2h ago" 
              tag="Civil"
            />
            <ActivityItem 
              firm="Pacific Law Group" 
              action="Smart Intake: New Lead from Widget" 
              time="4h ago" 
              tag="Family"
            />
            <ActivityItem 
              firm="Elite Defense" 
              action="AI Discovery: Uploaded 54 files" 
              time="1d ago" 
              tag="Criminal"
            />
            <ActivityItem 
              firm="Elite Defense" 
              action="New Milestone: Trial Date Set" 
              time="2d ago" 
              tag="Criminal"
            />
          </div>
        </div>

        {/* Quick Actions / Tools */}
        <div className="space-y-6">
          <div className="bg-slate-950 text-white rounded-3xl p-8 relative overflow-hidden group border border-slate-800">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 blur-3xl opacity-50 group-hover:opacity-100 transition-opacity" />
            <h3 className="text-xl font-display font-bold mb-4 relative z-10">AI Intake Ready</h3>
            <p className="text-slate-400 text-sm font-medium mb-6 relative z-10">
              Your autonomous screening bot has identified 12 high-intent leads today.
            </p>
            <button className="w-full bg-accent text-white py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all relative z-10">
              Review Leads <ArrowUpRight size={18} />
            </button>
          </div>

          <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm">
            <h3 className="text-lg font-display font-bold text-slate-900 mb-6 tracking-tight">
              Platform Status
            </h3>
            <div className="space-y-5">
              <StatusRow label="Database Cloud" status="Healthy" />
              <StatusRow label="Claude-3.5-Sonnet" status="Active" />
              <StatusRow label="SMS Gateway" status="Healthy" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: React.ReactNode;
  subtitle?: string;
}

function StatCard({ title, value, change, isPositive, icon, subtitle }: StatCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow group"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-600 group-hover:bg-brand-soft group-hover:text-accent group-hover:border-brand-soft transition-colors">
          {icon}
        </div>
        <div className={cn(
          "flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg",
          isPositive ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50"
        )}>
          {isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {change}
        </div>
      </div>
      <div>
        <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">{title}</p>
        <h4 className="text-2xl font-display font-bold text-slate-900">{value}</h4>
        {subtitle && <p className="text-[10px] text-accent font-bold mt-1.5 uppercase tracking-tight">{subtitle}</p>}
      </div>
    </motion.div>
  );
}

interface ActivityItemProps {
  firm: string;
  action: string;
  time: string;
  tag: string;
}

function ActivityItem({ firm, action, time, tag }: ActivityItemProps) {
  return (
    <div className="flex items-center gap-4 group">
      <div className="w-10 h-10 rounded-xl bg-brand-light flex items-center justify-center text-accent flex-shrink-0">
        <Gavel size={18} />
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-0.5">
          <span className="text-sm font-bold text-slate-900 tracking-tight">{action}</span>
          <span className="text-[11px] font-bold text-slate-400">{time}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-slate-500 font-medium">{firm}</span>
          <span className="w-1 h-1 rounded-full bg-slate-200" />
          <span className="text-[10px] font-bold text-accent uppercase tracking-wider">{tag}</span>
        </div>
      </div>
    </div>
  );
}

interface StatusRowProps {
  label: string;
  status: string;
}

function StatusRow({ label, status }: StatusRowProps) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm font-bold text-slate-600">{label}</span>
      <div className="flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
        <span className="text-xs font-bold text-green-600">{status}</span>
      </div>
    </div>
  );
}
