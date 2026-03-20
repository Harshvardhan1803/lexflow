"use client";

import { motion } from "framer-motion";
import {
  Building2,
  User,
  Mail,
  Shield,
  Bell,
  Sparkles,
  Database,
  Globe,
  Save
} from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-slate-900 tracking-tight">Settings</h1>
        <p className="text-slate-500 mt-1">Manage your law firm profile and AI preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Firm & Profile */}
        <div className="lg:col-span-2 space-y-6">
          {/* Firm Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl border border-slate-100 p-8 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-brand-soft rounded-xl flex items-center justify-center text-accent">
                <Building2 size={20} />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Law Firm Profile</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Firm Name</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="text"
                    defaultValue="LexFlow Global Partners"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-accent/20 transition-all outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Website URL</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="text"
                    defaultValue="https://lexflow.ai"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-accent/20 transition-all outline-none"
                  />
                </div>
              </div>

              <div className="md:col-span-2 space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Firm Address</label>
                <textarea
                  defaultValue="1212 Avenue of the Americas, New York, NY 10036"
                  className="w-full px-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-accent/20 transition-all outline-none min-h-[80px]"
                />
              </div>
            </div>
          </motion.div>

          {/* User Account Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl border border-slate-100 p-8 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-brand-soft rounded-xl flex items-center justify-center text-accent">
                <User size={20} />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Account Preferences</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Your Name</label>
                <input
                  type="text"
                  defaultValue="Harshvardhan Singh"
                  className="w-full px-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm font-medium outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Professional Email</label>
                <input
                  type="email"
                  defaultValue="harsh@lexflow.ai"
                  className="w-full px-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm font-medium outline-none"
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column: AI & Security */}
        <div className="space-y-6">
          {/* AI Configuration */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-slate-900 rounded-xl p-8 text-white shadow-xl shadow-slate-200"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-accent">
                <Sparkles size={20} />
              </div>
              <h2 className="text-xl font-bold">AI Intelligence</h2>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold">Auto-Draft Responses</p>
                  <p className="text-xs text-slate-400">Draft emails instantly on lead entry</p>
                </div>
                <div className="w-12 h-6 bg-accent rounded-full relative cursor-pointer">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold">Priority Lead Scoring</p>
                  <p className="text-xs text-slate-400">Use AI to rank urgency automatically</p>
                </div>
                <div className="w-12 h-6 bg-accent rounded-full relative cursor-pointer">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Model Selection</p>
                <select className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm outline-none">
                  <option>Claude 3.5 Sonnet (Optimized)</option>
                  <option>GPT-4o (Balanced)</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Security & Access */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl border border-slate-100 p-8 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-600">
                <Shield size={20} />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Security</h2>
            </div>

            <button className="w-full py-2.5 text-sm font-bold text-slate-600 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
              Two-Factor Authentication
            </button>
            <button className="w-full py-2.5 mt-3 text-sm font-bold text-red-600 border border-red-50/50 rounded-xl hover:bg-red-50 transition-colors">
              Request Data Export
            </button>
          </motion.div>
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-10 right-10 z-50">
        <button className="bg-accent text-white px-8 py-4 rounded-xl font-bold shadow-2xl shadow-accent/40 flex items-center gap-3 hover:scale-105 transition-all">
          <Save size={20} />
          Save Changes
        </button>
      </div>
    </div>
  );
}
