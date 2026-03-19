"use client";

import { motion } from "framer-motion";
import { Scale } from "lucide-react";

export function LexLoader({ label = "Loading Data..." }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-6 p-10">
      <div className="relative">
        {/* Outer Orbit Rings */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="absolute inset-[-12px] border border-accent/20 border-t-accent rounded-full"
        />
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          className="absolute inset-[-24px] border border-slate-100 border-b-slate-200 rounded-full opacity-40"
        />

        {/* Core Icon Container */}
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            boxShadow: [
              "0 0 0 0px rgba(139, 92, 246, 0.2)", 
              "0 0 0 15px rgba(139, 92, 246, 0)", 
              "0 0 0 0px rgba(139, 92, 246, 0)"
            ]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center text-white relative z-10 shadow-2xl shadow-accent/40"
        >
          <Scale size={32} strokeWidth={1.5} />
        </motion.div>
      </div>

      <div className="flex flex-col items-center gap-1.5 mt-4">
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm font-display font-black text-slate-800 uppercase tracking-[0.2em]"
        >
          {label}
        </motion.p>
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ 
                scale: [0.8, 1.2, 0.8],
                opacity: [0.3, 1, 0.3]
              }}
              transition={{ 
                duration: 1, 
                repeat: Infinity, 
                delay: i * 0.2 
              }}
              className="w-1 h-1 bg-accent rounded-full"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
