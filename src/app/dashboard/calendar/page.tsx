"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  AlertCircle,
  Briefcase,
  CheckCircle2
} from "lucide-react";
import { cn } from "@/utils/utils";

interface CalendarEvent {
  id: number;
  title: string;
  date: Date;
  type: "deadline" | "meeting" | "court";
  status: string;
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  // Simple calendar math
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  useEffect(() => {
    async function fetchDeadlines() {
      try {
        const response = await fetch("/api/deadlines");
        const data = await response.json();
        if (data.success) {
          const formattedEvents = data.data.map((d: any) => ({
            id: d.id,
            title: d.title,
            date: new Date(d.date),
            type: d.type,
            status: d.status
          }));
          setEvents(formattedEvents);
        }
      } catch (error) {
        console.error("Failed to fetch deadlines:", error);
      }
    }
    fetchDeadlines();
  }, []);

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const calendarDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-6 bg-accent rounded-lg flex items-center justify-center text-white shadow-lg shadow-accent/20">
              <CalendarIcon size={12} />
            </div>
            <span className="text-[8px] font-black uppercase tracking-widest text-accent">Compliance Central</span>
          </div>
          <h1 className="text-2xl font-display font-bold text-slate-900 mb-1 tracking-tight">
            Universal Calendar
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Real-time synchronization of all case deadlines, court dates, and appointments.
          </p>
        </div>

        <div className="flex items-center bg-white border border-slate-100 rounded-xl p-1 shadow-sm">
          <button onClick={prevMonth} className="p-2 hover:bg-slate-50 rounded-xl transition-all text-slate-400">
            <ChevronLeft size={20} />
          </button>
          <div className="px-6 text-sm font-bold text-slate-900 min-w-[140px] text-center">
            {monthName} {currentDate.getFullYear()}
          </div>
          <button onClick={nextMonth} className="p-2 hover:bg-slate-50 rounded-xl transition-all text-slate-400">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Calendar Grid */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white border border-slate-100 rounded-xl overflow-hidden shadow-sm">
            <div className="grid grid-cols-7 border-b border-slate-50 bg-slate-50/50">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="py-4 text-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7">
              {blanks.map(i => (
                <div key={`blank-${i}`} className="min-h-[120px] p-2 border-b border-r border-slate-50 bg-slate-50/20" />
              ))}
              {calendarDays.map(day => {
                const dayEvents = events.filter(e => 
                  e.date.getDate() === day && 
                  e.date.getMonth() === currentDate.getMonth() &&
                  e.date.getFullYear() === currentDate.getFullYear()
                );
                const isToday = day === new Date().getDate() && 
                               currentDate.getMonth() === new Date().getMonth() &&
                               currentDate.getFullYear() === new Date().getFullYear();

                return (
                  <div key={day} className={cn(
                    "min-h-[120px] p-2 border-b border-r border-slate-50 hover:bg-slate-50/30 transition-colors",
                    isToday && "bg-accent/2"
                  )}>
                    <div className="flex justify-between items-start mb-2">
                      <span className={cn(
                        "text-xs font-bold w-6 h-6 flex items-center justify-center rounded-lg",
                        isToday ? "bg-accent text-white" : "text-slate-400"
                      )}>
                        {day}
                      </span>
                    </div>
                    <div className="space-y-1">
                      {dayEvents.map(event => (
                        <div
                          key={event.id}
                          className={cn(
                            "px-2 py-1 rounded-md text-[9px] font-bold truncate transition-all cursor-pointer border",
                            event.type === "deadline" ? "bg-red-50 text-red-600 border-red-100" : "bg-blue-50 text-blue-600 border-blue-100",
                            event.status === "completed" && "opacity-50 line-through grayscale"
                          )}
                        >
                          {event.title}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar / List View */}
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-xl p-6 text-white space-y-4 relative overflow-hidden">
            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-accent" />
                <span className="text-[10px] font-black uppercase tracking-widest text-accent">Upcoming Priority</span>
              </div>
              <h3 className="text-lg font-display font-bold leading-tight">Prepare for Smith Hearing</h3>
              <p className="text-xs text-slate-400 font-medium">Detailed brief due in 48 hours for the superior court session.</p>
              <button className="w-full py-3 bg-accent text-white rounded-xl text-xs font-bold shadow-lg shadow-accent/20 hover:scale-[1.02] transition-all">
                Set Reminder
              </button>
            </div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-accent/10 rounded-full blur-3xl" />
          </div>

          <div className="bg-white border border-slate-100 rounded-xl p-6 space-y-6 shadow-sm">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Weekly Summary</h3>
            <div className="space-y-4">
              <EventSummary icon={<Clock size={16} />} label="Filing Deadlines" count="4" color="text-red-500" />
              <EventSummary icon={<Briefcase size={16} />} label="Court Appearances" count="2" color="text-blue-500" />
              <EventSummary icon={<CheckCircle2 size={16} />} label="Tasks Completed" count="18" color="text-green-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EventSummary({ icon, label, count, color }: any) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className={cn("w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center", color)}>
          {icon}
        </div>
        <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{label}</span>
      </div>
      <span className="text-sm font-bold text-slate-900">{count}</span>
    </div>
  );
}
