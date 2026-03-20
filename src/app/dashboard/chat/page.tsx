"use client";

import { useState, useEffect, useRef } from "react";
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
  Filter,
  Loader2
} from "lucide-react";
import { cn } from "@/utils/utils";

export default function ChatPage() {
  const [threads, setThreads] = useState<any[]>([]);
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoadingThreads, setIsLoadingThreads] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchThreads() {
      try {
        const res = await fetch("/api/chat/threads");
        const data = await res.json();
        if (data.success) {
          setThreads(data.data);
          if (data.data.length > 0) setSelectedChat(data.data[0]);
        }
      } catch (err) {
        console.error("Fetch threads failed:", err);
      } finally {
        setIsLoadingThreads(false);
      }
    }
    fetchThreads();
  }, []);

  useEffect(() => {
    if (selectedChat) {
      async function fetchMessages() {
        setIsLoadingMessages(true);
        try {
          const res = await fetch(`/api/chat/messages?contact_id=${selectedChat.id}`);
          const data = await res.json();
          if (data.success) setMessages(data.data);
        } catch (err) {
          console.error("Fetch messages failed:", err);
        } finally {
          setIsLoadingMessages(false);
        }
      }
      fetchMessages();
    }
  }, [selectedChat]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !selectedChat) return;
    
    const content = inputValue;
    setInputValue("");
    
    // Optimistic update
    const tempMsg = { id: Date.now(), contact_id: selectedChat.id, sender_type: 'firm', content, created_at: new Date().toISOString() };
    setMessages(prev => [...prev, tempMsg]);

    try {
      const res = await fetch("/api/chat/messages", {
        method: "POST",
        body: JSON.stringify({ contact_id: selectedChat.id, sender_type: 'firm', content }),
        headers: { "Content-Type": "application/json" }
      });
      if (!res.ok) throw new Error("Failed to send");
    } catch (err) {
      console.error("Send failed:", err);
    }
  };

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
           {isLoadingThreads ? (
             <div className="p-8 flex items-center justify-center">
               <Loader2 className="animate-spin text-slate-300" size={24} />
             </div>
           ) : threads.length > 0 ? (
             threads.map((msg) => (
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
             ))
           ) : (
             <div className="py-20 text-center text-slate-400">
               <p className="text-xs font-bold uppercase tracking-widest">No conversations found</p>
             </div>
           )}
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
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-8 scroll-smooth">
               {isLoadingMessages ? (
                 <div className="h-full flex items-center justify-center">
                   <Loader2 className="animate-spin text-slate-200" size={32} />
                 </div>
               ) : messages.length > 0 ? (
                 messages.map((m) => (
                   <div key={m.id} className={cn(
                     "flex items-start gap-4",
                     m.sender_type === 'firm' ? "justify-end" : "justify-start"
                   )}>
                     {m.sender_type !== 'firm' && (
                       <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center font-bold text-[10px]", selectedChat.color)}>
                         {selectedChat.initials}
                       </div>
                     )}
                     <div className={cn("max-w-xl", m.sender_type === 'firm' ? "text-right" : "text-left")}>
                        <div className={cn(
                          "p-4 rounded-xl text-xs leading-relaxed font-medium",
                          m.sender_type === 'firm' 
                            ? "bg-slate-900 text-white rounded-tr-none shadow-xl shadow-slate-900/10" 
                            : "bg-slate-50 text-slate-600 rounded-tl-none border border-slate-100"
                        )}>
                           {m.content}
                        </div>
                        <div className={cn("flex items-center gap-2 mt-2", m.sender_type === 'firm' ? "justify-end mr-1" : "justify-start ml-1")}>
                          <span className="text-[9px] text-slate-400 font-medium tracking-tight">
                            {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {m.sender_type === 'firm' && <CheckCheck size={12} className="text-accent" />}
                        </div>
                     </div>
                   </div>
                 ))
               ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-300 gap-4">
                  <Sparkles size={32} className="opacity-20" />
                  <p className="text-[10px] font-bold uppercase tracking-widest">Start the conversation with AI drafting</p>
                </div>
               )}
            </div>

            {/* AI Assistant Overlay (Subtle) */}
            <div className="absolute bottom-28 left-8 right-8">
               <div className="bg-linear-to-r from-accent/5 to-transparent border border-accent/20 rounded-xl p-4 flex items-center justify-between backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center text-white shadow-lg shadow-accent/20">
                      <Sparkles size={16} />
                    </div>
                    <div className="text-left">
                       <p className="text-[10px] font-black text-accent uppercase tracking-widest">AI Suggestion</p>
                       <p className="text-[11px] font-medium text-slate-600">"I'll confirm the court appearance and share the secure document link."</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setInputValue("I'll confirm the court appearance and share the secure document link.")}
                    className="px-4 py-2 bg-accent text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-accent/20 active:scale-95"
                  >
                    Use Draft
                  </button>
               </div>
            </div>

            {/* Input Area */}
            <div className="p-8 border-t border-slate-50">
               <div className="bg-slate-50 rounded-xl p-2 flex items-center gap-2 border border-slate-100 focus-within:ring-4 focus-within:ring-accent/5 focus-within:border-accent transition-all group">
                  <input 
                    type="text" 
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type your message or ask AI to draft..."
                    className="flex-1 bg-transparent border-none outline-none font-medium text-xs px-4 py-2 text-slate-700 placeholder:text-slate-400"
                  />
                  <button 
                    onClick={handleSendMessage}
                    className="p-3 bg-slate-900 text-white rounded-xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-slate-900/10"
                  >
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
