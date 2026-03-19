"use client";

import { motion } from "framer-motion";
import { Loader2, ShieldCheck, FileSearch, Database, CheckCircle2 } from "lucide-react";
import { cn } from "@/utils/utils";
import { useEffect, useState } from "react";

const steps = [
  { id: 1, label: "Scanning Document", icon: FileSearch },
  { id: 2, label: "Extracting Legal Entities", icon: Database },
  { id: 3, label: "Summarizing Key Points", icon: Loader2 },
  { id: 4, label: "Security Verification", icon: ShieldCheck },
];

export function AnalysisAnimation({ onComplete }: { onComplete: () => void }) {
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev === steps.length) {
          clearInterval(timer);
          setTimeout(onComplete, 1000);
          return prev;
        }
        return prev + 1;
      });
    }, 1500);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="py-20 flex flex-col items-center">
      <div className="relative mb-12">
        {/* Core Pulsing Ring */}
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-32 h-32 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="w-20 h-20 rounded-full border-2 border-dashed border-accent flex items-center justify-center"
          >
            <div className="w-4 h-4 rounded-full bg-accent shadow-lg shadow-accent/50" />
          </motion.div>
        </motion.div>

        {/* Floating Particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -40, 0],
              x: [0, Math.sin(i) * 30, 0],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              delay: i * 0.3
            }}
            className="absolute top-1/2 left-1/2 w-1.5 h-1.5 rounded-full bg-accent/40"
          />
        ))}
      </div>

      <div className="space-y-4 w-full max-w-sm">
        {steps.map((step) => {
          const isDone = step.id < currentStep;
          const isActive = step.id === currentStep;

          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={cn(
                "flex items-center gap-4 px-6 py-4 rounded-xl border transition-all duration-500",
                isActive ? "bg-brand-soft border-brand-soft shadow-lg shadow-accent/5" : "bg-white border-slate-50"
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500",
                isDone ? "bg-green-100 text-green-600" :
                  isActive ? "bg-accent text-white" : "bg-slate-50 text-slate-300"
              )}>
                {isDone ? <CheckCircle2 size={20} /> : <step.icon size={20} className={cn(isActive && "animate-spin-slow")} />}
              </div>
              <span className={cn(
                "text-sm font-bold transition-all duration-500",
                isDone ? "text-slate-400 line-through decoration-slate-300" :
                  isActive ? "text-accent" : "text-slate-400"
              )}>
                {step.label}
              </span>
              {isActive && (
                <motion.div
                  className="ml-auto"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      <p className="mt-12 text-xs font-bold text-slate-400 uppercase tracking-[0.2em] animate-pulse whitespace-nowrap">
        Secure Judicial Analysis in Progress
      </p>
    </div>
  );
}
