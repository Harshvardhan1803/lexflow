"use client";

import { useState } from "react";
import { 
  MessageSquare, 
  Search, 
  Plus, 
  Send, 
  Sparkles,
  User,
  Clock,
  CheckCheck,
  MoreVertical,
  Filter
} from "lucide-react";
import { cn } from "@/utils/utils";

const MOCK_MESSAGES = [
  { 
    id: 1, 
    sender: "Harsh Vardhan", 
    subject: "Personal Injury Case Update", 
    preview: "I wanted to check if there are any updates on the filing for my case...", 
    time: "10:24 AM", 
    unread: true,
    initials: "HV",
    color: "bg-blue-100 text-blue-600"
  },
  { 
    id: 2, 
    sender: "Rahul Sharma", 
    subject: "H1B Documentation Query", 
    preview: "I've uploaded the requested birth certificate to the portal. Please verify...", 
    time: "Yesterday", 
    unread: false,
    initials: "RS",
    color: "bg-purple-100 text-purple-600"
  },
  { 
    id: 3, 
    sender: "Aman Singh", 
    subject: "Court Date Confirmation", 
    preview: "Thank you for the draft response. I will be present at the hearing...", 
    time: "Mar 18", 
    unread: false,
    initials: "AS",
    color: "bg-green-100 text-green-600"
  }
];

export default function ChatPage() {
  const [activeTab, setActiveTab] = useState("inbox");
  const [selectedChat, setSelectedChat] = useState<any>(MOCK_MESSAGES[0]);

  return (
    <div className="h-[calc(100vh-120px)] flex gap-6 animate-in fade-in duration-700">
      {/* Sidebar List */}
      <div className="w-96 flex flex-col bg-white border border-slate-100 rounded-xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-50 space-y-4">
           <div className="flex items-center justify-between">
              <h1 className="text-xl font-display font-bold text-slate-900">Inbox</h1>
              <button className="p-2 bg-slate-900 text-white rounded-xl hover:scale-105 transition-all">
                <Plus size={18} />
              </button>
           </div>
           <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-accent transition-colors" size={16} />
              <input 
                type="text" 
                placeholder="Search messages..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all text-xs font-bold text-slate-700"
              />
           </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
           {MOCK_MESSAGES.map((msg) => (
             <button
               key={msg.id}
               onClick={() => setSelectedChat(msg)}
               className={cn(
                 "w-full p-4 rounded-xl flex items-start gap-4 transition-all text-left group",
                 selectedChat?.id === msg.id ? "bg-accent/5 border border-accent/10" : "hover:bg-slate-50/50 border border-transparent"
               )}
             >
               <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs shrink-0", msg.color)}>
                 {msg.initials}
               </div>
               <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-900 truncate">{msg.sender}</span>
                    <span className="text-[10px] text-slate-400">{msg.time}</span>
                  </div>
                  <p className="text-[11px] font-bold text-slate-700 truncate mb-1">{msg.subject}</p>
                  <p className="text-[10px] text-slate-400 truncate leading-relaxed">{msg.preview}</p>
               </div>
               {msg.unread && <div className="w-2 h-2 bg-accent rounded-full mt-1.5 shadow-sm" />}
             </button>
           ))}
        </div>
      </div>

      {/* Main Chat View */}
      <div className="flex-1 flex flex-col bg-white border border-slate-100 rounded-xl overflow-hidden shadow-sm relative">
        {selectedChat ? (
          <>
            {/* Toolbar */}
            <div className="px-8 py-5 border-b border-slate-50 flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs", selectedChat.color)}>
                    {selectedChat.initials}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{selectedChat.sender}</h3>
                    <div className="flex items-center gap-2">
                       <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Now</span>
                    </div>
                  </div>
               </div>
               <div className="flex items-center gap-2">
                  <button className="p-2 text-slate-400 hover:text-slate-600 transition-all rounded-lg hover:bg-slate-50">
                    <Filter size={18} />
                  </button>
                  <button className="p-2 text-slate-400 hover:text-slate-600 transition-all rounded-lg hover:bg-slate-50">
                    <MoreVertical size={18} />
                  </button>
               </div>
            </div>

            {/* Message Area */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8">
               <div className="flex flex-col items-center gap-4 py-4">
                  <div className="px-4 py-1.5 bg-slate-50 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Today
                  </div>
               </div>

               <div className="flex items-start gap-4">
                  <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center font-bold text-[10px]", selectedChat.color)}>
                    {selectedChat.initials}
                  </div>
                  <div className="max-w-xl">
                    <div className="bg-slate-50 p-4 rounded-xl rounded-tl-none text-xs text-slate-600 leading-relaxed font-medium">
                       {selectedChat.preview} Is there anyone from the intake team who can give me a quick call? I'm a bit nervous about the discovery deadline coming up.
                    </div>
                    <span className="text-[9px] text-slate-400 font-medium mt-2 block ml-1">10:24 AM</span>
                  </div>
               </div>

               <div className="flex items-start justify-end gap-4">
                  <div className="max-w-xl text-right">
                    <div className="bg-slate-900 text-white p-4 rounded-xl rounded-tr-none text-xs leading-relaxed font-medium shadow-xl shadow-slate-900/10">
                       Hello {selectedChat.sender.split(' ')[0]}! We've received your request. I've already shared an AI-generated draft case strategy with your attorney. We'll be in touch shortly.
                    </div>
                    <div className="flex items-center justify-end gap-2 mt-2 mr-1">
                      <span className="text-[9px] text-slate-400 font-medium tracking-tight">10:25 AM</span>
                      <CheckCheck size={12} className="text-accent" />
                    </div>
                  </div>
               </div>
            </div>

            {/* AI Assistant Overlay (Subtle) */}
            <div className="absolute bottom-28 left-8 right-8">
               <div className="bg-gradient-to-r from-accent/5 to-transparent border border-accent/20 rounded-xl p-4 flex items-center justify-between backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center text-white shadow-lg shadow-accent/20">
                      <Sparkles size={16} />
                    </div>
                    <div className="text-left">
                       <p className="text-[10px] font-black text-accent uppercase tracking-widest">AI Suggestion</p>
                       <p className="text-[11px] font-medium text-slate-600">"I'll confirm the court appearance and share the secure document link."</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-accent text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-accent/20">
                    Use Draft
                  </button>
               </div>
            </div>

            {/* Input Area */}
            <div className="p-8 border-t border-slate-50">
               <div className="bg-slate-50 rounded-xl p-2 flex items-center gap-2 border border-slate-100 focus-within:ring-4 focus-within:ring-accent/5 focus-within:border-accent transition-all group">
                  <input 
                    type="text" 
                    placeholder="Type your message or ask AI to draft..."
                    className="flex-1 bg-transparent border-none outline-none font-medium text-xs px-4 py-2 text-slate-700 placeholder:text-slate-400"
                  />
                  <button className="p-3 bg-slate-900 text-white rounded-xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-slate-900/10">
                    <Send size={18} />
                  </button>
               </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 gap-4">
            <div className="w-20 h-20 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100">
               <MessageSquare size={32} strokeWidth={1.5} />
            </div>
            <p className="text-sm font-bold uppercase tracking-widest">Select a conversation to start drafting</p>
          </div>
        )}
      </div>
    </div>
  );
}
