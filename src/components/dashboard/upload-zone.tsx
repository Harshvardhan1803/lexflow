"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Upload, FileText, ShieldCheck, Cpu } from "lucide-react";
import { cn } from "@/utils/utils";

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
}

export function UploadZone({ onFileSelect }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      onFileSelect(files[0]);
    }
  }, [onFileSelect]);

  return (
    <div className="w-full max-w-3xl mx-auto">
      <motion.div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        className={cn(
          "relative border-2 border-dashed rounded-3xl p-12 transition-all duration-500 overflow-hidden group",
          isDragging 
            ? "border-accent bg-accent/5 scale-[1.02]" 
            : "border-slate-200 bg-white hover:border-accent/40"
        )}
      >
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-accent/10 transition-colors" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent/5 blur-3xl rounded-full -ml-16 -mb-16 group-hover:bg-accent/10 transition-colors" />

        <div className="relative z-10 flex flex-col items-center text-center">
          <div className={cn(
            "w-20 h-20 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500",
            isDragging ? "bg-accent text-white rotate-12" : "bg-slate-50 text-slate-400 group-hover:bg-brand-soft group-hover:text-accent"
          )}>
            <Upload size={32} strokeWidth={1.5} />
          </div>

          <h3 className="text-xl font-display font-bold text-slate-900 mb-2">
            AI Document Discovery
          </h3>
          <p className="text-slate-500 font-medium max-w-sm mb-8">
            Upload depositions, motions, or evidence. Our legal engine will extract key entities and patterns automatically.
          </p>

          <input 
            type="file" 
            id="file-upload" 
            className="hidden" 
            onChange={(e) => e.target.files && onFileSelect(e.target.files[0])}
          />
          <label 
            htmlFor="file-upload"
            className="px-8 py-3.5 bg-accent text-white rounded-xl font-bold shadow-lg shadow-accent/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer inline-flex items-center gap-2"
          >
            Select Document
          </label>
          
          <div className="mt-8 flex items-center gap-6">
            <Feature icon={<ShieldCheck size={14} />} text="Highly Secure" />
            <Feature icon={<Cpu size={14} />} text="Claude 3.5 Powered" />
            <Feature icon={<FileText size={14} />} text="PDF, DOCX, JPEG" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function Feature({ icon, text }: { icon: React.ReactNode, text: string }) {
  return (
    <div className="flex items-center gap-1.5 text-slate-400">
      <div className="text-accent">{icon}</div>
      <span className="text-[11px] font-bold uppercase tracking-wider">{text}</span>
    </div>
  );
}
