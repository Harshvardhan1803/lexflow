"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, CheckCircle2, Loader2, Sparkles, AlertCircle, X } from "lucide-react";
import { cn } from "@/utils/utils";
import { LexLoader } from "../ui/loader";

interface SummarizerUploadProps {
  onSummaryGenerated: (data: any) => void;
}

export function SummarizerUpload({ onSummaryGenerated }: SummarizerUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile?.type === "application/pdf") {
      setFile(droppedFile);
      setError(null);
    } else {
      setError("Please upload a PDF document.");
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleProcess = async () => {
    if (!file) return;
    setIsProcessing(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/ai/summarize", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const result = await res.json();
        onSummaryGenerated(result.data);
      } else {
        setError("Summarization failed. Please try again.");
      }
    } catch (err) {
      setError("Server error during processing.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        className={cn(
          "relative border-2 border-dashed rounded-xl p-6 transition-all duration-500 overflow-hidden",
          isDragging ? "border-accent bg-accent/5 scale-[1.02]" : "border-slate-100 bg-white",
          file ? "border-green-500/30 bg-green-50/10" : "hover:border-accent/30 hover:bg-slate-50/50"
        )}
      >
        <input
          type="file"
          id="doc-upload"
          className="hidden"
          accept=".pdf"
          onChange={handleFileSelect}
        />

        <div className="flex flex-col items-center justify-center text-center space-y-3">
          <div className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 shadow-xl shadow-slate-200/50",
            file ? "bg-green-500 text-white" : "bg-white text-slate-400"
          )}>
            {file ? <CheckCircle2 size={20} /> : <Upload size={20} className={isDragging ? "animate-bounce" : ""} />}
          </div>

          {!file ? (
            <div className="space-y-0.5">
              <h3 className="text-base font-display font-bold text-slate-900">Legal Discovery Upload</h3>
              <p className="text-[10px] text-slate-400 font-medium max-w-xs mx-auto text-balance">
                Drag and drop your PDF case files here to begin AI analysis.
              </p>
              <label
                htmlFor="doc-upload"
                className="inline-block mt-2 px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full text-[8px] font-bold cursor-pointer transition-colors"
              >
                Browse Files
              </label>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3 px-4 py-2 bg-white border border-green-500/20 rounded-xl shadow-sm">
                <FileText className="text-green-500" size={16} />
                <p className="text-sm font-bold text-slate-700 truncate max-w-[200px]">{file.name}</p>
                <button
                  onClick={() => setFile(null)}
                  className="p-1 hover:bg-slate-50 rounded-full transition-colors"
                >
                  <X size={14} className="text-slate-400" />
                </button>
              </div>

              {!isProcessing ? (
                <button
                  onClick={handleProcess}
                  className="w-full px-10 py-4 bg-slate-900 text-white rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10"
                >
                  <Sparkles size={18} className="text-accent" /> Analyze Document
                </button>
              ) : (
                <div className="space-y-6 w-full max-w-md mx-auto">
                  <LexLoader label="Extracting Insights..." />
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden -mt-4">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "95%" }}
                      transition={{ duration: 3, ease: "easeInOut" }}
                      className="h-full bg-accent"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="absolute -top-12 -right-12 w-32 h-32 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-accent/5 rounded-full blur-3xl" />
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-xs font-bold"
        >
          <AlertCircle size={16} /> {error}
        </motion.div>
      )}
    </div>
  );
}
