"use client";

import { useState, useEffect } from "react";
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
import Link from "next/link";
import { cn } from "@/utils/utils";
import { LexLoader } from "@/components/ui/loader";

export default function DashboardOverview() {
  const [stats, setStats] = useState<any>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsRes, activityRes] = await Promise.all([
          fetch("/api/dashboard/stats").then(res => res.json()),
          fetch("/api/dashboard/activity").then(res => res.json())
        ]);

        if (statsRes.success) setStats(statsRes.stats);
        if (activityRes.success) setActivities(activityRes.activity);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="h-[70vh] flex items-center justify-center">
        <LexLoader />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-900 mb-2 tracking-tight">
            {stats?.firmName || "Dashboard Overview"}
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
          value={stats?.totalCases?.toString() || "0"}
          change={stats?.casesChange || "+0%"}
          isPositive={true}
          icon={<Briefcase size={20} />}
        />
        <StatCard
          title="New Leads"
          value={stats?.totalLeads?.toString() || "0"}
          change={stats?.leadsChange || "+0%"}
          isPositive={true}
          icon={<Users size={20} />}
        />
        <StatCard
          title="Revenue (MRR)"
          value={stats?.revenue || "$0"}
          change="-4%"
          isPositive={false}
          icon={<TrendingUp size={20} />}
        />
        <StatCard
          title="Avg. Response"
          value={stats?.avgResponseTime || "1.2h"}
          change="-15%"
          isPositive={true}
          icon={<Clock size={20} />}
          subtitle="Time saved by AI"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-xl p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-display font-bold text-slate-900 tracking-tight">
              Recent Case Activity
            </h3>
            <Link href="/dashboard/leads" className="text-sm font-bold text-accent hover:underline flex items-center gap-1 group">
              View All <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="space-y-6 max-h-[440px] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
            {activities.length > 0 ? (
              activities.map((item) => (
                <ActivityItem
                  key={item.id}
                  firm={item.firm}
                  action={item.action}
                  time={item.time}
                  tag={item.tag}
                />
              ))
            ) : (
              <div className="py-10 text-center">
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No recent activity found</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions / Tools */}
        <div className="space-y-6">
          <div className="bg-slate-950 text-white rounded-xl p-8 relative overflow-hidden group border border-slate-800">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 blur-3xl opacity-50 group-hover:opacity-100 transition-opacity" />
            <h3 className="text-xl font-display font-bold mb-4 relative z-10">AI Intake Ready</h3>
            <p className="text-slate-400 text-sm font-medium mb-6 relative z-10">
              Your autonomous screening bot has identified {stats?.totalLeads || 0} high-intent leads total.
            </p>
            <Link
              href="/dashboard/leads"
              className="w-full bg-accent text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-brand-soft hover:text-accent hover:scale-[1.02] active:scale-[0.98] transition-all relative z-10 shadow-lg shadow-accent/20"
            >
              Review Leads <ArrowUpRight size={18} />
            </Link>
          </div>

          <div className="bg-white border border-slate-100 rounded-xl p-8 shadow-sm">
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
      className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow group"
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
      <div className="w-10 h-10 rounded-xl bg-brand-light flex items-center justify-center text-accent shrink-0">
        <Gavel size={18} />
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-0.5">
          <span className="text-sm font-bold text-slate-900 tracking-tight line-clamp-1 max-w-[400px]">{action}</span>
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
