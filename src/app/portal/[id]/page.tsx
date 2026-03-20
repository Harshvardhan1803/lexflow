"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Clock,
  FileText,
  MessageSquare,
  Upload,
  Download,
  ShieldCheck,
  User,
  ChevronRight
} from "lucide-react";
import { cn } from "@/utils/utils";

interface CaseData {
  case_id: string;
  case_type: string;
  case_status: string;
  milestones: Array<{ id: number; title: string; date: string; status: string }>;
  client_name: string;
  attorney_name: string;
  firm_name: string;
  documents?: Array<{ id: number; name: string; size: string; date: string }>;
}

// Mock data unified with CaseData interface
const MOCK_CASE: CaseData = {
  case_id: "CASE-8829",
  case_type: "Personal Injury",
  case_status: "In Progress",
  client_name: "John Doe",
  attorney_name: "Robert Taylor",
  firm_name: "LexFlow Legal",
  milestones: [
    { id: 1, title: "Intake Completed", date: "Mar 15, 2024", status: "completed" },
    { id: 2, title: "Evidence Collection", date: "Mar 18, 2024", status: "completed" },
    { id: 3, title: "Insurance Negotiation", date: "Ongoing", status: "current" },
    { id: 4, title: "Final Settlement", date: "Est. Apr 2024", status: "upcoming" }
  ],
  documents: [
    { id: 1, name: "Police_Report.pdf", size: "2.4 MB", date: "Mar 16" },
    { id: 2, name: "Medical_Bills_V1.pdf", size: "1.1 MB", date: "Mar 17" }
  ]
};

import { useParams } from "next/navigation";

export default function CasePortalPage() {
  const params = useParams();
  const [activeTab, setActiveTab] = useState<"status" | "documents" | "messages">("status");
  const [isLoading, setIsLoading] = useState(true);
  const [caseData, setCaseData] = useState<CaseData | null>(null);

  useEffect(() => {
    const fetchCase = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/cases/${params?.id}`);
        if (res.ok) {
          const json = await res.json();
          setCaseData(json.data);
        }
      } catch (err) {
        console.error("Fetch case failed:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (params?.id) {
      fetchCase();
    } else {
      setIsLoading(false);
    }
  }, [params?.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-accent/20 border-t-accent rounded-full animate-spin" />
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest animate-pulse">Establishing Secure Connection...</p>
        </div>
      </div>
    );
  }

  const caseInfo: CaseData = caseData || MOCK_CASE;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-12">
      {/* Branded Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center">
              <ShieldCheck className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-lg font-display font-bold text-slate-900 leading-tight">{caseInfo.firm_name}</h1>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Secure Client Portal</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:block text-right">
              <p className="text-xs font-bold text-slate-900">{caseInfo.client_name}</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{caseInfo.case_id}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
              <User size={18} className="text-slate-500" />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Sidebar / Case Summary */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-xl p-8 border border-slate-200 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 blur-3xl rounded-full -mr-16 -mt-16" />

              <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                <FileText size={12} className="text-accent" /> Case Information
              </h2>

              <div className="space-y-6 relative z-10">
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Matter Type</label>
                  <p className="text-xl font-display font-bold text-slate-900">{caseInfo.case_type}</p>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Status</label>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-sm font-bold text-slate-900">{caseInfo.case_status}</span>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Assigned Attorney</label>
                  <p className="text-sm font-bold text-slate-900">{caseInfo.attorney_name}</p>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between text-slate-400">
                <p className="text-[10px] font-bold uppercase tracking-widest">Last updated: Today</p>
                <Clock size={14} />
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-slate-900 rounded-xl p-8 text-white shadow-xl shadow-slate-900/20">
              <h3 className="text-sm font-bold mb-4">Support Team</h3>
              <p className="text-xs text-slate-400 mb-6 leading-relaxed">Need help? Message your legal team or upload missing documents directly.</p>
              <button
                onClick={() => setActiveTab("messages")}
                className="w-full py-3 bg-accent text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-0.98 transition-all shadow-lg shadow-accent/20"
              >
                <MessageSquare size={16} /> Chat with Attorney
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* Tabs */}
            <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-slate-200 shadow-sm w-fit">
              <TabButton
                active={activeTab === "status"}
                onClick={() => setActiveTab("status")}
                label="Case Status"
                icon={<Clock size={16} />}
              />
              <TabButton
                active={activeTab === "documents"}
                onClick={() => setActiveTab("documents")}
                label="Documents"
                icon={<FileText size={16} />}
              />
              <TabButton
                active={activeTab === "messages"}
                onClick={() => setActiveTab("messages")}
                label="Messages"
                icon={<MessageSquare size={16} />}
              />
            </div>

            {/* Content Display */}
            <div className="flex-1 min-h-[500px]">
              {activeTab === "status" && <StatusTimeline milestones={caseInfo.milestones} />}
              {activeTab === "documents" && <DocumentView documents={caseInfo.documents || MOCK_CASE.documents!} />}
              {activeTab === "messages" && <PortalMessaging contactId={params?.id as string} attorneyName={caseInfo.attorney_name} />}
            </div>
          </div>

        </div>
      </main>

      {/* Footer Security Badge */}
      <div className="mt-12 text-center py-8">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center justify-center gap-3">
          <ShieldCheck size={14} className="text-accent" /> SSL Encrypted & HIPAA Compliant Portal
        </p>
      </div>
    </div>
  );
}

function TabButton({ active, label, icon, onClick }: {
  active: boolean;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all",
        active
          ? "bg-accent text-white shadow-lg shadow-accent/20"
          : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
      )}
    >
      {icon} {label}
    </button>
  );
}

function StatusTimeline({ milestones }: {
  milestones: Array<{ id: number; title: string; date: string; status: string }>
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white rounded-xl p-10 border border-slate-200 shadow-sm h-full"
    >
      <div className="flex items-center justify-between mb-10">
        <h3 className="text-xl font-display font-bold text-slate-900">Case Milestone Timeline</h3>
        <div className="px-4 py-1.5 bg-green-50 text-green-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-100">
          Updated Today
        </div>
      </div>

      <div className="relative space-y-12">
        {/* The connecting line */}
        <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-slate-100" />

        {milestones.map((ms, idx) => (
          <div key={ms.id} className="relative flex items-start gap-8 group">
            <div className={cn(
              "w-6 h-6 rounded-full border-4 relative z-10 transition-all duration-500",
              ms.status === "completed" ? "bg-accent border-accent/20" :
                ms.status === "current" ? "bg-white border-accent animate-pulse scale-110" :
                  "bg-white border-slate-200"
            )}>
              {ms.status === "completed" && <CheckCircle2 className="text-white w-full h-full p-0.5" size={12} />}
            </div>

            <div className={cn(
              "flex-1 transition-all duration-300",
              ms.status === "upcoming" ? "opacity-40" : "opacity-100"
            )}>
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-sm font-bold text-slate-800 tracking-tight group-hover:text-accent transition-colors">{ms.title}</h4>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{ms.date}</span>
              </div>
              <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-md">
                {ms.status === "completed"
                  ? "All required documentation for this step has been reviewed and verified by our legal team."
                  : ms.status === "current"
                    ? "We are currently negotiating with the insurance adjusters to maximize your settlement value."
                    : "Final step once all negotiations are settled."}
              </p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function DocumentView({ documents }: {
  documents: Array<{ id: number; name: string; size: string; date: string }>
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white rounded-xl p-8 border border-slate-200 shadow-sm h-[750px] flex flex-col"
    >
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-display font-bold text-slate-900">Shared Documents</h3>
          <p className="text-xs text-slate-400 font-medium mt-1">Review or upload files related to your case.</p>
        </div>

        <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10">
          <Upload size={16} /> Upload New
        </button>
      </div>

      {/* Scrollable list area */}
      <div className="flex-1 overflow-y-auto pr-2 min-h-[300px] max-h-[500px] space-y-3 custom-scrollbar">
        {documents.map((doc) => (
          <div key={doc.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-accent/30 hover:bg-slate-50 transition-all group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-accent transition-colors">
                <FileText size={24} />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-bold text-slate-800 truncate">{doc.name}</h4>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{doc.size} • {doc.date}</p>
              </div>
            </div>
            <button className="p-2 text-slate-400 hover:text-accent transition-colors">
              <Download size={18} />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-slate-50">
        <div className="p-6 bg-accent/5 rounded-xl border border-accent/10 border-dashed text-center">
          <Upload className="mx-auto text-accent/40 mb-3" size={32} />
          <p className="text-xs font-bold text-slate-600 mb-1">Drag and drop additional files</p>
          <p className="text-[10px] font-medium text-slate-400">PDF, JPG, PNG up to 10MB</p>
        </div>
      </div>
    </motion.div>
  );
}

function PortalMessaging({ contactId, attorneyName }: { contactId: string; attorneyName: string }) {
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    async function fetchMessages() {
      try {
        const res = await fetch(`/api/chat/messages?contact_id=${contactId}`);
        if (res.ok) {
          const data = await res.json();
          setMessages(data.data || []);
        }
      } catch (err) {
        console.error("Portal fetch messages failed:", err);
      }
    }
    if (contactId) fetchMessages();
  }, [contactId]);

  const handleSend = async () => {
    if (!msg.trim() || isSending) return;
    try {
      setIsSending(true);
      const res = await fetch("/api/chat/messages", {
        method: "POST",
        body: JSON.stringify({ contact_id: contactId, content: msg, sender_type: "client" }),
        headers: { "Content-Type": "application/json" }
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(prev => [...prev, data.data]);
        setMsg("");
      }
    } catch (err) {
      console.error("Portal send message failed:", err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white rounded-xl p-8 border border-slate-200 shadow-sm h-[750px] flex flex-col"
    >
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center shadow-lg shadow-accent/20">
          <User className="text-white" size={24} />
        </div>
        <div>
          <h3 className="text-xl font-display font-bold text-slate-900 tracking-tight">{attorneyName}</h3>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500" /> Lead Attorney
          </p>
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto mb-6 scrollbar-hide">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-2 opacity-50">
            <MessageSquare size={32} />
            <p className="text-xs font-bold uppercase tracking-widest">No messages yet</p>
          </div>
        ) : (
          messages.map((m, idx) => (
            <div key={idx} className={cn("flex", m.sender_type === "client" ? "justify-end" : "justify-start")}>
              <div className={cn(
                "max-w-[80%] p-4 rounded-xl text-sm font-medium leading-relaxed",
                m.sender_type === "client" 
                  ? "bg-accent text-white rounded-tr-none shadow-lg shadow-accent/10" 
                  : "bg-slate-50 border border-slate-100 rounded-tl-none text-slate-700"
              )}>
                {m.content}
                <span className={cn(
                  "text-[8px] font-bold mt-1.5 block uppercase tracking-tighter opacity-60",
                  m.sender_type === "client" ? "text-right" : "text-left"
                )}>
                  {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="relative">
        <textarea
          placeholder="Type your message to the attorney..."
          className="w-full bg-slate-50 border border-slate-100 rounded-xl p-6 pr-16 text-sm font-medium outline-none focus:ring-2 focus:ring-accent/10 focus:border-accent transition-all resize-none"
          rows={3}
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          disabled={isSending}
        />
        <button 
          onClick={handleSend}
          disabled={!msg.trim() || isSending}
          className={cn(
          "absolute bottom-4 right-4 w-10 h-10 rounded-xl flex items-center justify-center transition-all",
          msg.trim() && !isSending ? "bg-accent text-white shadow-lg shadow-accent/20 hover:scale-105 active:scale-95" : "bg-slate-200 text-slate-400 opacity-50"
        )}>
          {isSending ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <ChevronRight size={20} />}
        </button>
      </div>
    </motion.div>
  );
}
