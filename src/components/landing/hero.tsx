"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Scale, CheckCircle2 } from "lucide-react";
import { FlowMockup } from "./flow-mockup";

export function Hero() {
  return (
    <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden bg-white">
      {/* Premium Background Elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-5%] left-[-5%] w-[35%] h-[35%] bg-accent/5 blur-[100px] rounded-full animate-pulse-slow" />
        <div className="absolute bottom-[5%] right-[5%] w-[25%] h-[25%] bg-brand-light blur-[80px] rounded-full" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-size-[32px_32px]" />
      </div>

      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-light text-accent text-xs font-bold mb-6 border border-brand-soft backdrop-blur-sm"
            >
              <Scale size={14} className="text-accent" />
              <span>Trusted by 200+ Boutique Law Firms</span>
            </motion.div>

            <h1 className="text-4xl md:text-5xl lg:text-5xl font-display font-bold text-slate-900 tracking-tight mb-6 leading-[1.1]">
              The AI Nervous <br />
              System for <span className="text-gradient">Modern Law.</span>
            </h1>

            <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-lg leading-relaxed font-medium">
              LexFlow automates your intake, tracking, and communication. Reclaim 20+ billable hours every month with legal-first intelligence.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-5">
              <Link href="/signup" className="w-full sm:w-auto">
                <button className="w-full bg-primary text-primary-foreground px-8 py-4 rounded-full text-lg font-bold hover:bg-accent transition-all shadow-lg hover:shadow-accent/15 active:scale-95 flex items-center justify-center gap-2 group">
                  Start Your Free Trial
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <button className="w-full sm:w-auto px-8 py-4 rounded-full text-lg font-bold text-slate-700 border border-slate-200 hover:bg-slate-50 transition-all flex items-center justify-center gap-2 bg-white/50 backdrop-blur-md">
                View Case Study
              </button>
            </div>

            <div className="mt-10 flex flex-wrap gap-5 items-center opacity-80">
              <div className="flex items-center gap-1.5 text-slate-500 text-xs font-bold">
                <CheckCircle2 size={14} className="text-accent" />
                No setup fee
              </div>
              <div className="flex items-center gap-1.5 text-slate-500 text-xs font-bold">
                <CheckCircle2 size={14} className="text-accent" />
                Cancel anytime
              </div>
              <div className="flex items-center gap-1.5 text-slate-500 text-xs font-bold">
                <CheckCircle2 size={14} className="text-green-600" />
                GDPR & HIPAA Compliant
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="hidden lg:block relative"
          >
            <FlowMockup />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
