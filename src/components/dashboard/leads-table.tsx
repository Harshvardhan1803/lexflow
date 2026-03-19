"use client";

import { useState } from "react";
import {
  Search,
  MoreHorizontal,
  Mail,
  Phone,
  ExternalLink,
  ArrowUpDown,
  Sparkles,
  Clock,
  Briefcase
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { cn } from "@/utils/utils";
import { AIDraftModal } from "./ai-draft-modal";
import { CaseNotesDrawer } from "./case-notes-drawer";
import Tooltip from '@mui/material/Tooltip';
import Zoom from '@mui/material/Zoom';

export type LeadStatus = "New" | "Screening" | "Qualified" | "Disqualified" | "Converted";

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: string;
  status: LeadStatus;
  date: string;
  type: string;
}

const mockLeads: Lead[] = [];

export function LeadsTable({ leads = [], isLoading = false }: { leads?: Lead[], isLoading?: boolean }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeStatus, setActiveStatus] = useState<LeadStatus | "All">("All");
  const [selectedLeadForDraft, setSelectedLeadForDraft] = useState<Lead | null>(null);
  const [selectedLeadForHistory, setSelectedLeadForHistory] = useState<Lead | null>(null);

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
        headers: { "Content-Type": "application/json" }
      });
      if (res.ok) {
        // In a real app we'd refresh the parent data, for now we can just alert or wait for next fetch
        alert(`Lead successfully updated to ${newStatus}!`);
        window.location.reload(); // Simple refresh to show changes
      }
    } catch (err) {
      console.error("Status update failed:", err);
    }
  };

  const filteredLeads = leads.filter(lead => {
    // Map database 'case' status to UI 'Converted' status, and 'lead' to 'New'
    const dbStatus = lead.status as any;
    const uiStatus = dbStatus === "case" ? "Converted" : (dbStatus === "lead" ? "New" : dbStatus);

    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lead.email && lead.email.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = activeStatus === "All" || uiStatus === activeStatus;
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="w-full h-64 flex items-center justify-center bg-white border border-slate-100 rounded-xl">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-accent/20 border-t-accent rounded-full animate-spin" />
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Loading Leads...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-accent transition-colors" size={18} />
          <input
            type="text"
            placeholder="Search leads by name or email..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-accent/10 focus:border-accent transition-all text-sm font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          {["All", "New", "Screening", "Qualified", "Disqualified", "Converted"].map((status) => (
            <button
              key={status}
              onClick={() => setActiveStatus(status as LeadStatus | "All")}
              className={cn(
                "px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap border",
                activeStatus === status
                  ? "bg-accent text-white border-accent shadow-lg shadow-accent/20"
                  : "bg-white text-slate-500 border-slate-100 hover:border-accent/30 hover:text-accent"
              )}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-100 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-50 bg-slate-50/50">
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <div className="flex items-center gap-2 cursor-pointer hover:text-slate-600">
                    Lead Name <ArrowUpDown size={12} />
                  </div>
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Case Type</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Source</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              <AnimatePresence mode="popLayout">
                {filteredLeads.map((lead) => (
                  <motion.tr
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    key={lead.id}
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-900 leading-none mb-1.5 group-hover:text-accent transition-colors">
                          {lead.name}
                        </span>
                        <div className="flex items-center gap-3 text-[11px] text-slate-500 font-medium">
                          <span className="flex items-center gap-1"><Mail size={10} className="text-slate-300" /> {lead.email}</span>
                          <span className="flex items-center gap-1"><Phone size={10} className="text-slate-300" /> {lead.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-tight">
                        {lead.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs font-semibold text-slate-500">
                      {lead.source}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={lead.status === ("case" as any) ? "Converted" : lead.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Tooltip title="AI Draft Response" placement="top" arrow slots={{ transition: Zoom }} slotProps={{ tooltip: { sx: { bgcolor: '#0f172a', fontWeight: 700, borderRadius: '8px' } } }}>
                          <button
                            onClick={() => setSelectedLeadForDraft(lead)}
                            className="p-2 text-accent hover:bg-brand-soft rounded-lg transition-all"
                          >
                            <Sparkles size={16} />
                          </button>
                        </Tooltip>

                        <Tooltip title="View Case History" placement="top" arrow slots={{ transition: Zoom }} slotProps={{ tooltip: { sx: { bgcolor: '#0f172a', fontWeight: 700, borderRadius: '8px' } } }}>
                          <button
                            onClick={() => setSelectedLeadForHistory(lead)}
                            className="p-2 text-slate-400 hover:text-accent hover:bg-slate-50 rounded-lg transition-all"
                          >
                            <Clock size={16} />
                          </button>
                        </Tooltip>

                        <Tooltip title="View Client Portal" placement="top" arrow slots={{ transition: Zoom }} slotProps={{ tooltip: { sx: { bgcolor: '#0f172a', fontWeight: 700, borderRadius: '8px' } } }}>
                          <Link
                            href={`/portal/${lead.id}`}
                            className="p-2 text-slate-400 hover:text-accent hover:bg-brand-soft rounded-lg transition-all"
                          >
                            <ExternalLink size={16} />
                          </Link>
                        </Tooltip>

                        {lead.status !== ("case" as any) && (
                          <Tooltip title="Convert to Case" placement="top" arrow slots={{ transition: Zoom }} slotProps={{ tooltip: { sx: { bgcolor: '#0f172a', fontWeight: 700, borderRadius: '8px' } } }}>
                            <button
                              onClick={() => handleStatusUpdate(lead.id, "Converted")}
                              className="p-2 text-slate-400 hover:text-green-500 hover:bg-green-50 rounded-lg transition-all"
                            >
                              <Briefcase size={16} />
                            </button>
                          </Tooltip>
                        )}

                        <Tooltip title="More Actions" placement="top" arrow slots={{ transition: Zoom }} slotProps={{ tooltip: { sx: { bgcolor: '#0f172a', fontWeight: 700, borderRadius: '8px' } } }}>
                          <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
                            <MoreHorizontal size={16} />
                          </button>
                        </Tooltip>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {filteredLeads.length === 0 && (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-3">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100">
              <Search size={32} strokeWidth={1.5} />
            </div>
            <p className="text-sm font-bold">No leads found matching your criteria.</p>
          </div>
        )}
      </div>

      {selectedLeadForDraft && (
        <AIDraftModal
          isOpen={!!selectedLeadForDraft}
          onClose={() => setSelectedLeadForDraft(null)}
          clientInfo={{
            name: selectedLeadForDraft.name,
            caseType: selectedLeadForDraft.type,
            id: selectedLeadForDraft.id
          }}
        />
      )}

      {selectedLeadForHistory && (
        <CaseNotesDrawer
          isOpen={!!selectedLeadForHistory}
          onClose={() => setSelectedLeadForHistory(null)}
          leadId={selectedLeadForHistory.id}
          leadName={selectedLeadForHistory.name}
        />
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: LeadStatus }) {
  const styles = {
    New: "bg-blue-50 text-blue-600 border-blue-100",
    Screening: "bg-brand-soft text-accent border-brand-soft",
    Qualified: "bg-green-50 text-green-600 border-green-100",
    Disqualified: "bg-red-50 text-red-600 border-red-100",
    Converted: "bg-slate-900 text-white border-slate-900"
  };

  return (
    <span className={cn(
      "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm",
      styles[status]
    )}>
      {status}
    </span>
  );
}
