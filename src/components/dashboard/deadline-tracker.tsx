"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  MoreVertical,
  Plus
} from "lucide-react";
import { cn } from "@/utils/utils";

interface Deadline {
  id: number;
  title: string;
  deadline_date: string;
  status: "pending" | "completed";
}

interface DeadlineTrackerProps {
  leadId: number;
}

export function DeadlineTracker({ leadId }: DeadlineTrackerProps) {
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDeadlines = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/deadlines?contact_id=${leadId}`);
      if (res.ok) {
        const data = await res.json();
        setDeadlines(data.data || []);
      }
    } catch (err) {
      console.error("Fetch deadlines failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDeadlines();
  }, [leadId]);

  const toggleStatus = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === "pending" ? "completed" : "pending";
    try {
      const res = await fetch(`/api/deadlines/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
        headers: { "Content-Type": "application/json" }
      });
      if (res.ok) {
        setDeadlines(prev => prev.map(d => d.id === id ? { ...d, status: newStatus as any } : d));
      }
    } catch (err) {
      console.error("Update status failed:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Clock className="animate-spin text-slate-300" size={24} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Calendar size={16} className="text-accent" /> Upcoming Deadlines
        </h3>
        {deadlines.length > 0 && (
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            {deadlines.filter(d => d.status === "pending").length} Pending
          </span>
        )}
      </div>

      <div className="space-y-3">
        {deadlines.length > 0 ? (
          deadlines.map((deadline, idx) => {
            const date = new Date(deadline.deadline_date);
            const isOverdue = date < new Date() && deadline.status === "pending";
            const isToday = date.toDateString() === new Date().toDateString();

            return (
              <motion.div
                key={deadline.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={cn(
                  "group flex items-center gap-4 p-3 rounded-xl border transition-all",
                  deadline.status === "completed"
                    ? "bg-slate-50 border-slate-50 opacity-60"
                    : isOverdue
                      ? "bg-red-50 border-red-100"
                      : "bg-white border-slate-100 hover:border-accent/20"
                )}
              >
                <div className="shrink-0">
                  <button
                    onClick={() => toggleStatus(deadline.id, deadline.status)}
                    className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center transition-all border-2",
                      deadline.status === "completed"
                        ? "bg-green-500 border-green-500 text-white"
                        : isOverdue
                          ? "bg-white border-red-200 text-red-500"
                          : "bg-white border-slate-200 text-slate-300 hover:border-accent"
                    )}
                  >
                    {deadline.status === "completed" && <CheckCircle2 size={12} />}
                  </button>
                </div>

                <div className="flex-1 min-w-0">
                  <p className={cn(
                    "text-xs font-bold truncate",
                    deadline.status === "completed" ? "text-slate-500 line-through" : "text-slate-900"
                  )}>
                    {deadline.title}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={cn(
                      "text-[9px] font-bold px-1.5 py-0.5 rounded-md",
                      isOverdue ? "bg-red-100 text-red-700" : isToday ? "bg-orange-100 text-orange-700" : "bg-slate-100 text-slate-500"
                    )}>
                      {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    {isOverdue && <AlertCircle size={10} className="text-red-500" />}
                  </div>
                </div>

                <button className="p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreVertical size={14} className="text-slate-400" />
                </button>
              </motion.div>
            );
          })
        ) : (
          <div className="p-8 border-2 border-dashed border-slate-100 rounded-xl text-center space-y-3">
            <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
              <Calendar size={18} />
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">No deadlines set</p>
          </div>
        )}
      </div>
    </div>
  );
}
