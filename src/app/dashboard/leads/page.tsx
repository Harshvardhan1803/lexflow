"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { UserPlus, Download } from "lucide-react";
import { cn, downloadCSV } from "@/utils/utils";
import { LeadsTable, Lead } from "@/components/dashboard/leads-table";
import { NewLeadModal } from "@/components/dashboard/new-lead-modal";

export default function LeadsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLeads = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/leads");
      if (res.ok) {
        const json = await res.json();
        const data = json.data || [];

        // Map DB data to UI data and filter for 'lead', 'archived', and 'case' status
        const mappedLeads: Lead[] = data
          .filter((item: any) => ['lead', 'archived', 'case'].includes(item.status)) 
          .map((item: {
            id: number;
            name: string;
            email?: string;
            phone?: string;
            intake_answers?: Record<string, unknown>;
            status: string;
            created_at: string;
            lead_score?: number;
          }) => ({
            id: item.id.toString(),
            name: item.name,
            email: item.email || "No Email",
            phone: item.phone || "No Phone",
            source: item.intake_answers?.source || "Website Widget",
            // Map DB status to UI status
            status: item.status === 'lead' ? 'New' : 
                   (item.status === 'case' ? 'Converted' : 
                   (item.status === 'archived' ? 'Archived' : item.status)),
            date: new Date(item.created_at).toISOString().split('T')[0],
            type: item.intake_answers?.selected_case_type || "General Intake",
            score: item.lead_score
          }));
        setLeads(mappedLeads);
      }
    } catch (err) {
      console.error("Fetch leads failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleExport = () => {
    const dataToExport = leads.map(lead => ({
      ID: lead.id,
      Name: lead.name,
      Email: lead.email,
      Phone: lead.phone,
      Source: lead.source,
      Status: lead.status,
      Type: lead.type,
      Date: lead.date
    }));
    
    const timestamp = new Date().toISOString().split('T')[0];
    downloadCSV(dataToExport, `lexflow-leads-${timestamp}.csv`);
  };

  const totalLeads = leads.length;
  const newLeads = leads.filter(l => l.status === 'New').length;
  const conversionPoints = leads.filter(l => l.status === 'Converted').length;
  const conversionRate = totalLeads > 0 ? ((conversionPoints / totalLeads) * 100).toFixed(1) : "0";

  return (
    <div className="space-y-10">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-900 mb-2 tracking-tight">
            Intake Leads
          </h1>
          <p className="text-slate-500 font-medium max-w-lg">
            Manage potential clients and coordinate with your AI Screening Bot.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={handleExport}
            className="p-2.5 rounded-xl bg-white border border-slate-100 text-slate-500 hover:text-accent hover:border-accent/30 transition-all flex items-center gap-2 text-sm font-bold shadow-sm"
          >
            <Download size={18} /> Export
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 bg-accent text-white rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-accent/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <UserPlus size={18} /> New Lead
          </button>
        </div>
      </div>

      {/* Stats Quick Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <LeadStatCard
          label="Total Active Leads"
          value={totalLeads.toString()}
          increase={totalLeads > 0 ? `+${totalLeads}` : "0"}
          increaseLabel="Live system"
        />
        <LeadStatCard
          label="Conversion Rate"
          value={`${conversionRate}%`}
          increaseLabel="from database"
        />
        <LeadStatCard
          label="AI Screening Queue"
          value={newLeads.toString()}
          isWarning={newLeads > 5}
          increaseLabel={newLeads > 0 ? "Needs attention" : "Queue clear"}
        />
      </div>

      {/* Main Content: Table */}
      <div className="pt-4">
        <LeadsTable leads={leads} isLoading={isLoading} />
      </div>

      {/* Modals */}
      <NewLeadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchLeads}
      />
    </div>
  );
}

function LeadStatCard({ label, value, increase, increaseLabel, isWarning }: {
  label: string;
  value: string;
  increase?: string;
  increaseLabel: string;
  isWarning?: boolean;
}) {
  return (
    <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow group">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">{label}</p>
      <div className="flex items-end justify-between">
        <h4 className="text-3xl font-display font-bold text-slate-900 leading-none">{value}</h4>
        <div className="flex flex-col items-end">
          {increase && (
            <span className="text-xs font-bold text-green-600 mb-0.5">{increase}</span>
          )}
          <span className={cn(
            "text-[10px] font-bold uppercase tracking-tight",
            isWarning ? "text-red-500" : "text-slate-400"
          )}>
            {increaseLabel}
          </span>
        </div>
      </div>
    </div>
  );
}
