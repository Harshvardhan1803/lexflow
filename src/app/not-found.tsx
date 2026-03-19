"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Gavel, Search, ShieldAlert } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-white relative flex items-center justify-center p-6 overflow-hidden">
      {/* Background Proportions */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-light blur-[120px] rounded-full opacity-50" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-accent/5 blur-[100px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-2xl w-full text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-12 relative inline-block"
        >
          <div className="w-32 h-32 bg-brand-soft rounded-xl flex items-center justify-center text-accent relative z-10">
            <ShieldAlert size={64} strokeWidth={1.5} />
          </div>
          {/* Animated rings */}
          <div className="absolute inset-0 border-2 border-accent/20 rounded-xl animate-ping scale-110" />
          <div className="absolute inset-0 border border-accent/10 rounded-xl animate-pulse scale-125" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h1 className="text-8xl font-display font-black text-slate-900 mb-6 tracking-tighter opacity-10">
            404
          </h1>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-6 tracking-tight">
            Jurisdiction Unknown.
          </h2>
          <p className="text-lg text-slate-500 font-medium mb-12 max-w-md mx-auto leading-relaxed">
            The page you are looking for has been moved, archived, or never existed in our database.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link href="/">
              <button className="bg-primary text-white px-8 py-4 rounded-xl font-bold flex items-center gap-3 hover:bg-accent transition-all hover:scale-105 active:scale-95 shadow-xl shadow-primary/10">
                <ArrowLeft size={20} />
                Back to Home
              </button>
            </Link>
            <Link href="/#features">
              <button className="bg-white border border-slate-200 text-slate-600 px-8 py-4 rounded-xl font-bold hover:bg-slate-50 transition-all active:scale-95 flex items-center gap-2">
                <Search size={18} />
                Search Features
              </button>
            </Link>
          </div>
        </motion.div>

        {/* Decorative Watermark */}
        <div className="absolute -bottom-24 -right-24 opacity-[0.03] rotate-12 pointer-events-none">
          <Gavel size={400} />
        </div>
      </div>
    </main>
  );
}
