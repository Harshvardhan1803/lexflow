"use client";

import { motion } from "framer-motion";
import { Check, Circle, Clock } from "lucide-react";
import { cn } from "@/utils/utils";

export type TimelineStatus = "completed" | "active" | "upcoming";

export interface TimelineStep {
  id: string;
  title: string;
  description: string;
  status: TimelineStatus;
  date?: string;
}

interface CaseTimelineProps {
  steps: TimelineStep[];
  className?: string;
}

export function CaseTimeline({ steps, className }: CaseTimelineProps) {
  return (
    <div className={cn("space-y-6", className)}>
      <div className="relative">
        {/* Animated Background Line */}
        <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-slate-100 rounded-full overflow-hidden">
          <motion.div 
            initial={{ height: 0 }}
            animate={{ height: "100%" }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="w-full bg-accent"
          />
        </div>

        <div className="space-y-8 relative">
          {steps.map((step, index) => (
            <TimelineItem 
              key={step.id} 
              step={step} 
              isLast={index === steps.length - 1}
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function TimelineItem({ step, isLast, index }: { step: TimelineStep; isLast: boolean; index: number }) {
  const getIcon = () => {
    switch (step.status) {
      case "completed":
        return <Check size={12} className="text-white" />;
      case "active":
        return <Clock size={12} className="text-white animate-pulse" />;
      default:
        return <Circle size={8} className="text-slate-300" />;
    }
  };

  const statusStyles = {
    completed: "bg-accent border-accent text-white shadow-lg shadow-accent/20",
    active: "bg-slate-900 border-slate-900 text-white shadow-lg shadow-slate-900/20",
    upcoming: "bg-white border-slate-200 text-slate-400"
  };

  const textStyles = {
    completed: "text-slate-900",
    active: "text-slate-900 font-bold",
    upcoming: "text-slate-400"
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="flex gap-6 group"
    >
      <div className="flex flex-col items-center">
        <div className={cn(
          "w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-500 z-10",
          statusStyles[step.status]
        )}>
          {getIcon()}
        </div>
      </div>

      <div className="flex-1 pb-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-1">
          <h4 className={cn("text-sm transition-colors", textStyles[step.status])}>
            {step.title}
          </h4>
          {step.date && (
            <span className="text-[10px] font-medium text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100">
              {step.date}
            </span>
          )}
        </div>
        <p className="text-[11px] text-slate-500 max-w-md leading-relaxed">
          {step.description}
        </p>
        
        {step.status === "active" && (
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            className="mt-4 h-1 bg-slate-100 rounded-full overflow-hidden"
          >
            <motion.div 
              animate={{ x: ["-100%", "100%"] }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              className="w-1/3 h-full bg-accent/40 rounded-full"
            />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
