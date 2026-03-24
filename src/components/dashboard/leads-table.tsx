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
  Briefcase,
  ShieldCheck,
  ShieldAlert,
  ShieldQuestion,
  Loader2,
  Trash2,
  Archive,
  Edit2,
  RotateCcw
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { cn } from "@/utils/utils";
import { AIDraftModal } from "./ai-draft-modal";
import { CaseNotesDrawer } from "./case-notes-drawer";
import Tooltip from '@mui/material/Tooltip';
import Zoom from '@mui/material/Zoom';
import { EditLeadModal } from "./edit-lead-modal";
import { toast } from "react-hot-toast";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

export type LeadStatus = "New" | "Screening" | "Qualified" | "Disqualified" | "Converted" | "Archived";

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

import { LexLoader } from "../ui/loader";

export function LeadsTable({ leads = [], isLoading = false }: { leads?: Lead[], isLoading?: boolean }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeStatus, setActiveStatus] = useState<LeadStatus | "All">("All");
  const [selectedLeadForDraft, setSelectedLeadForDraft] = useState<Lead | null>(null);
  const [selectedLeadForHistory, setSelectedLeadForHistory] = useState<Lead | null>(null);
  const [checkingConflictId, setCheckingConflictId] = useState<string | null>(null);
  const [conflictResults, setConflictResults] = useState<Record<string, { hasConflict: boolean, severity: string, aiExplanation: string }>>({});
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [activeLeadId, setActiveLeadId] = useState<string | null>(null);
  const [selectedLeadForEdit, setSelectedLeadForEdit] = useState<Lead | null>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, id: string) => {
    setAnchorEl(event.currentTarget);
    setActiveLeadId(id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setActiveLeadId(null);
  };

  const handleDeleteLead = async (id: string) => {
    if (!confirm("Are you sure you want to delete this lead?")) return;
    try {
      const res = await fetch(`/api/leads/${id}`, { method: "DELETE" });
      if (res.ok) {
        window.location.reload();
      }
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
        headers: { "Content-Type": "application/json" }
      });
      if (res.ok) {
        toast.success(`Lead successfully updated to ${newStatus}!`);
        window.location.reload();
      }
    } catch (err) {
      console.error("Status update failed:", err);
    }
  };

  const runConflictCheck = async (lead: Lead) => {
    setCheckingConflictId(lead.id);
    try {
      const res = await fetch("/api/leads/conflict-check", {
        method: "POST",
        body: JSON.stringify({ name: lead.name, type: lead.type }),
        headers: { "Content-Type": "application/json" }
      });
      const data = await res.json();
      if (data.success) {
        setConflictResults(prev => ({
          ...prev,
          [lead.id]: {
            hasConflict: data.hasConflict,
            severity: data.severity,
            aiExplanation: data.aiExplanation
          }
        }));
      }
    } catch (err) {
      console.error("Conflict check failed:", err);
    } finally {
      setCheckingConflictId(null);
    }
  };

  const filteredLeads = leads.filter(lead => {
    // Map database 'case' status to UI 'Converted' status, and 'lead' to 'New'
    const dbStatus = lead.status as any;
    const uiStatus = dbStatus === "case" ? "Converted" : (dbStatus === "lead" ? "New" : dbStatus);

    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lead.email && lead.email.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = activeStatus === "All" 
      ? uiStatus !== "Archived" 
      : uiStatus === activeStatus;
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="w-full h-96 flex items-center justify-center bg-white border border-slate-100 rounded-xl">
        <LexLoader label="Fetching Leads..." />
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
          {["All", "New", "Screening", "Qualified", "Disqualified", "Converted", "Archived"].map((status) => (
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
      <div className="bg-white border border-slate-100 rounded-xl shadow-sm">
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
                {filteredLeads.map((lead, index) => (
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
                      <div className="flex items-center justify-end gap-2 transition-opacity">
                        <Tooltip 
                          title={
                            conflictResults[lead.id] 
                              ? `${conflictResults[lead.id].aiExplanation}` 
                              : "Run AI Conflict Check"
                          } 
                          placement="top" 
                          arrow 
                          slots={{ transition: Zoom }} 
                          slotProps={{ tooltip: { sx: { bgcolor: '#0f172a', fontWeight: 500, borderRadius: '8px', maxWidth: 300 } } }}
                        >
                          <button
                            onClick={() => !conflictResults[lead.id] && runConflictCheck(lead)}
                            disabled={checkingConflictId === lead.id}
                            className={cn(
                              "p-2 rounded-lg transition-all",
                              checkingConflictId === lead.id ? "animate-spin text-slate-300" :
                              conflictResults[lead.id]?.hasConflict ? "text-red-500 bg-red-50 hover:bg-red-100" :
                              conflictResults[lead.id] ? "text-green-500 bg-green-50" :
                              "text-slate-400 hover:text-accent hover:bg-slate-50"
                            )}
                          >
                            {checkingConflictId === lead.id ? <Loader2 size={16} /> : 
                             conflictResults[lead.id]?.hasConflict ? <ShieldAlert size={16} /> :
                             conflictResults[lead.id] ? <ShieldCheck size={16} /> :
                             <ShieldQuestion size={16} />}
                          </button>
                        </Tooltip>

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

                        {lead.status !== ("case" as any) && lead.status !== ("Converted" as any) && (
                          <Tooltip title="Convert to Case" placement="top" arrow slots={{ transition: Zoom }} slotProps={{ tooltip: { sx: { bgcolor: '#0f172a', fontWeight: 700, borderRadius: '8px' } } }}>
                            <button
                              onClick={() => handleStatusUpdate(lead.id, "Converted")}
                              className="p-2 text-slate-400 hover:text-green-500 hover:bg-green-50 rounded-lg transition-all"
                            >
                              <Briefcase size={16} />
                            </button>
                          </Tooltip>
                        )}

                        <div className="relative">
                          <Tooltip title="More Actions" placement="top" arrow slots={{ transition: Zoom }} slotProps={{ tooltip: { sx: { bgcolor: '#0f172a', fontWeight: 700, borderRadius: '8px' } } }}>
                            <button 
                              onClick={(e) => handleMenuOpen(e, lead.id)}
                              className={cn(
                                "p-2 rounded-lg transition-all",
                                activeLeadId === lead.id ? "bg-slate-100 text-slate-900" : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                              )}
                            >
                              <MoreHorizontal size={16} />
                            </button>
                          </Tooltip>

                          <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl) && activeLeadId === lead.id}
                            onClose={handleMenuClose}
                            TransitionComponent={Zoom}
                            PaperProps={{
                              sx: {
                                mt: 1,
                                borderRadius: '12px',
                                border: '1px solid #f1f5f9',
                                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                                padding: '6px',
                                minWidth: '180px'
                              }
                            }}
                          >
                            <MenuItem 
                              onClick={() => {
                                setSelectedLeadForEdit(lead);
                                handleMenuClose();
                              }}
                              sx={{
                                fontSize: '11px',
                                fontWeight: 700,
                                color: '#475569',
                                gap: '12px',
                                borderRadius: '8px',
                                '&:hover': { bgcolor: '#f8fafc' }
                              }}
                            >
                              <Edit2 size={14} /> Edit Lead
                            </MenuItem>
                            
                            {lead.status === "Archived" ? (
                              <MenuItem 
                                onClick={() => {
                                  handleStatusUpdate(lead.id, "New");
                                  handleMenuClose();
                                }}
                                sx={{
                                  fontSize: '11px',
                                  fontWeight: 700,
                                  color: '#16a34a',
                                  gap: '12px',
                                  borderRadius: '8px',
                                  '&:hover': { bgcolor: '#f0fdf4' }
                                }}
                              >
                                <RotateCcw size={14} /> Restore Lead
                              </MenuItem>
                            ) : (
                              <MenuItem 
                                onClick={() => {
                                  handleStatusUpdate(lead.id, "Archived");
                                  handleMenuClose();
                                }}
                                sx={{
                                  fontSize: '11px',
                                  fontWeight: 700,
                                  color: '#475569',
                                  gap: '12px',
                                  borderRadius: '8px',
                                  '&:hover': { bgcolor: '#f8fafc' }
                                }}
                              >
                                <Archive size={14} /> Archive Lead
                              </MenuItem>
                            )}
                            
                            <div className="my-1 border-t border-slate-50" />
                            
                            <MenuItem 
                              onClick={() => {
                                handleDeleteLead(lead.id);
                                handleMenuClose();
                              }}
                              sx={{
                                fontSize: '11px',
                                fontWeight: 700,
                                color: '#ef4444',
                                gap: '12px',
                                borderRadius: '8px',
                                '&:hover': { bgcolor: '#fef2f2' }
                              }}
                            >
                              <Trash2 size={14} /> Delete Lead
                            </MenuItem>
                          </Menu>
                        </div>
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

      {selectedLeadForEdit && (
        <EditLeadModal
          isOpen={!!selectedLeadForEdit}
          onClose={() => setSelectedLeadForEdit(null)}
          onSuccess={() => window.location.reload()}
          lead={selectedLeadForEdit}
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
    Converted: "bg-slate-900 text-white border-slate-900",
    Archived: "bg-slate-100 text-slate-400 border-slate-200"
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
