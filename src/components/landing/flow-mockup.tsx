"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import {
  FileText,
  Bot,
  Zap,
  Calendar,
  Mail,
  Shield
} from "lucide-react";

export function FlowMockup() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 1 });

      // Initial States
      gsap.set(".node", { scale: 0, opacity: 0 });
      gsap.set(".connection-path", { strokeDashoffset: 1000, strokeDasharray: 1000, opacity: 0 });
      gsap.set(".feature-card", { y: 15, opacity: 0, scale: 0.95 });
      gsap.set(".ai-spark", { scale: 0, opacity: 0 });
      gsap.set(".data-stream", { opacity: 0, y: 8 });

      // Stage 1: Intake (The Lead Node)
      tl.to(".node-intake", { scale: 1, opacity: 1, duration: 0.4, ease: "expo.out" })
        .to(".feature-intake", { opacity: 1, y: 0, scale: 1, duration: 0.4 }, "-=0.2")
        .to(".path-to-ai", { opacity: 0.3, strokeDashoffset: 0, duration: 0.6, ease: "power2.inOut" })

      // Stage 2: Center Hub (AI Engine)
      tl.to(".node-ai", { scale: 1, opacity: 1, duration: 0.5, ease: "expo.out" }, "-=0.3")
        .to(".feature-ai", { opacity: 1, y: 0, scale: 1, duration: 0.4 }, "-=0.3")
        .to(".ai-spark", { scale: 1.5, opacity: 0.8, duration: 0.3, stagger: 0.05, yoyo: true, repeat: 1 })
        .to(".data-stream", { opacity: 1, y: 0, stagger: 0.05, duration: 0.3 })

      // Stage 3: Auto-Operations (Outflow)
      tl.to(".path-to-ops", { opacity: 0.3, strokeDashoffset: 0, duration: 0.5, stagger: 0.1 })
        .to(".node-ops", { scale: 1, opacity: 1, duration: 0.4, stagger: 0.05, ease: "expo.out" }, "-=0.4")
        .to(".feature-ops", { opacity: 1, y: 0, scale: 1, duration: 0.4, stagger: 0.05 }, "-=0.3")

      // Final Pulse / Completion
      tl.to(".node-ai", { boxShadow: "0 0 30px var(--brand-primary)", duration: 0.6, yoyo: true, repeat: 1 })
        .to([".feature-card", ".node", ".connection-path"], { opacity: 0.2, duration: 0.8, delay: 0.8 })
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full aspect-square flex items-center justify-center p-4">
      {/* SVG Connection Layer */}
      <svg className="absolute inset-0 w-full h-full -z-10 bg-transparent" viewBox="0 0 400 400" fill="none">
        {/* Path Intake to AI */}
        <path className="connection-path path-to-ai" d="M200 80 Q 200 150 200 200" stroke="var(--brand-primary)" strokeWidth="1.5" />

        {/* Paths AI to Ops */}
        <path className="connection-path path-to-ops" d="M200 200 Q 120 250 80 320" stroke="var(--brand-primary)" strokeWidth="1" />
        <path className="connection-path path-to-ops" d="M200 200 Q 200 260 200 320" stroke="var(--brand-primary)" strokeWidth="1" />
        <path className="connection-path path-to-ops" d="M200 200 Q 280 250 320 320" stroke="var(--brand-primary)" strokeWidth="1" />

        {/* Animated Lead Flow Particle */}
        <circle className="node-lead-flow" r="3" fill="var(--brand-primary)">
          <animateMotion dur="1.2s" repeatCount="indefinite" path="M200 80 Q 200 150 200 200" />
        </circle>
      </svg>

      {/* Narrative Nodes & Cards */}

      {/* 1. Intake Node (Top Center) */}
      <div className="absolute top-[10%] left-1/2 -translate-x-1/2 flex flex-col items-center">
        <div className="node node-intake w-12 h-12 rounded-xl bg-white border border-slate-200 shadow-xl flex items-center justify-center text-accent relative">
          <Bot size={22} />
          <div className="absolute -inset-2 bg-accent/5 blur-lg rounded-full animate-pulse" />
        </div>
        <div className="feature-card feature-intake mt-4 glass px-4 py-2 rounded-xl text-center border-brand-soft shadow-lg">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-0.5">Stage 1</span>
          <span className="text-[11px] font-bold text-slate-900">24/7 Smart Intake</span>
        </div>
      </div>

      {/* 2. AI Hub (Center) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
        <div className="node node-ai w-20 h-20 rounded-xl bg-slate-900 shadow-[0_0_50px_rgba(192,133,82,0.15)] flex items-center justify-center text-white relative border-2 border-brand-soft z-20">
          <Zap size={32} className="text-accent" />
          {/* AI Sparks */}
          <div className="absolute top-0 left-0 ai-spark w-2 h-2 bg-accent rounded-full blur-[2px]" />
          <div className="absolute bottom-0 right-0 ai-spark w-3 h-3 bg-accent/50 rounded-full blur-xs" />
          <div className="absolute top-1/2 -right-4 ai-spark w-1.5 h-1.5 bg-accent rounded-full" />
        </div>
        <div className="feature-card feature-ai mt-6 glass px-6 py-3 rounded-xl border-brand-soft shadow-2xl z-20">
          <div className="flex items-center gap-2 mb-2">
            <Shield size={12} className="text-accent" />
            <span className="text-[10px] font-black uppercase tracking-widest text-accent">AI Core Analysis</span>
          </div>
          <div className="space-y-1.5">
            <div className="data-stream h-1 w-24 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full w-2/3 bg-accent/30 animate-pulse" />
            </div>
            <div className="data-stream h-1 w-20 bg-slate-100 rounded-full" />
            <div className="data-stream flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
              <span className="text-[9px] font-bold text-slate-500">Conflicts Cleared</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Output Nodes (Bottom) */}
      <div className="absolute bottom-[10%] w-full flex justify-between px-4 max-w-sm">
        {/* Deadline Tracker */}
        <div className="flex flex-col items-center">
          <div className="node node-ops w-10 h-10 rounded-xl bg-white border border-slate-200 shadow-lg flex items-center justify-center text-slate-600">
            <Calendar size={18} />
          </div>
          <div className="feature-card feature-ops mt-3 glass px-3 py-1.5 rounded-lg border-brand-soft">
            <span className="text-[9px] font-bold text-slate-800">Deadlines</span>
          </div>
        </div>

        {/* Case Coordinator */}
        <div className="flex flex-col items-center scale-110">
          <div className="node node-ops w-12 h-12 rounded-xl bg-white border border-slate-200 shadow-xl flex items-center justify-center text-slate-900 border-b-4 border-b-accent">
            <FileText size={20} />
          </div>
          <div className="feature-card feature-ops mt-3 glass px-4 py-2 rounded-xl border-accent/20 bg-brand-light shadow-lg">
            <span className="text-[10px] font-black uppercase tracking-widest text-accent block mb-0.5">Success</span>
            <span className="text-[11px] font-bold text-slate-900">Case Created</span>
          </div>
        </div>

        {/* AI Drafter */}
        <div className="flex flex-col items-center">
          <div className="node node-ops w-10 h-10 rounded-xl bg-white border border-slate-200 shadow-lg flex items-center justify-center text-slate-600">
            <Mail size={18} />
          </div>
          <div className="feature-card feature-ops mt-3 glass px-3 py-1.5 rounded-lg border-brand-soft">
            <span className="text-[9px] font-bold text-slate-800">AI Drafts</span>
          </div>
        </div>
      </div>

      {/* Ambient Glows */}
      <div className="absolute inset-0 -z-30">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-accent/5 blur-[100px] rounded-full" />
      </div>
    </div>
  );
}
