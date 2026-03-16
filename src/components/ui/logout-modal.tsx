"use client";

import { motion } from "framer-motion";
import { LogOut, X } from "lucide-react";
import { Modal } from "@mui/material";

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function LogoutModal({ isOpen, onClose, onConfirm }: LogoutModalProps) {
  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      closeAfterTransition
      className="flex items-center justify-center p-6"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 focus:outline-none"
      >
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-500">
              <LogOut size={24} />
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400 hover:text-slate-600"
            >
              <X size={20} />
            </button>
          </div>

          <h3 className="text-2xl font-display font-bold text-slate-900 mb-2">
            Sign Out?
          </h3>
          <p className="text-slate-500 font-medium leading-relaxed mb-8">
            Are you sure you want to end your session? You will need to sign in again to access your workspace.
          </p>

          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 py-4 px-6 rounded-2xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all active:scale-95"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 py-4 px-6 rounded-2xl font-bold text-white bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/20 transition-all active:scale-95"
            >
              Yes, Sign Out
            </button>
          </div>
        </div>
        
        {/* Bottom Accent */}
        <div className="h-1.5 w-full bg-gradient-to-r from-red-400 to-red-600 opacity-20" />
      </motion.div>
    </Modal>
  );
}
