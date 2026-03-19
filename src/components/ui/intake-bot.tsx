"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Bot } from "lucide-react";
import { cn } from "@/utils/utils";
import { useCallback } from "react";

interface Message {
  id: string;
  text: string;
  sender: "bot" | "user";
  timestamp: Date;
}

const QUESTIONS = [
  "Hi! I'm Lexi, your LexFlow assistant. What's your full name?",
  "Great to meet you, {name}! Briefly, what kind of legal help are you looking for today?",
  "I understand. And which city or state are you located in?",
  "Got it. Lastly, what's the best phone number to reach you at?",
  "Thank you! A member of our legal team will review your case and contact you shortly. Have a great day!"
];

export function IntakeBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [step, setStep] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [userName, setUserName] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const sendBotMessage = useCallback((text: string) => {
    setIsTyping(true);
    const delay = 1500; // Fixed delay for consistency in prototype

    /**
     * AI INTEGRATION POINT (CLAUDE):
     * Instead of using the static QUESTIONS array, send a fetch request to the AI route here:
     * 
     * const response = await fetch('/api/chat', { 
     *   method: 'POST', 
     *   body: JSON.stringify({ message: userMessage, history: messages }) 
     * });
     * 
     * The dynamic response from Claude will be set as the next message.
     */

    setTimeout(() => {
      setIsTyping(false);
      const newMessage: Message = {
        id: Math.random().toString(36).substring(7),
        text: text.replace("{name}", userName),
        sender: "bot",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, newMessage]);
    }, delay);
  }, [userName]);

  // Initial Greeting
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const timer = setTimeout(() => {
        sendBotMessage(QUESTIONS[0]);
      }, 500); // Small initial delay for premium feel
      return () => clearTimeout(timer);
    }
  }, [isOpen, messages.length, sendBotMessage]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!inputValue.trim() || isTyping) return;

    const userMsg: Message = {
      id: Math.random().toString(36).substring(7),
      text: inputValue,
      sender: "user",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue("");

    /**
     * AI DATA EXTRACTION (CLAUDE):
     * After each user message, Claude can be used to extract structured data:
     * "Does this message contain Name, Case Type, or Phone number?"
     * 
     * If extracted, update the corresponding states (userName, caseType, etc.)
     * to ensure structured leads are saved to the database at the end of the flow.
     */

    // Logic for next question
    if (step === 0) setUserName(inputValue);
    
    const nextStep = step + 1;
    if (nextStep < QUESTIONS.length) {
      setStep(nextStep);
      sendBotMessage(QUESTIONS[nextStep]);
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <div className="fixed bottom-6 right-6 z-[9999]">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-colors relative group",
            isOpen ? "bg-slate-900 text-white" : "bg-accent text-white"
          )}
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 90 }}
              >
                <X size={24} />
              </motion.div>
            ) : (
              <motion.div
                key="open"
                initial={{ opacity: 0, rotate: 90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: -90 }}
                className="relative"
              >
                <MessageSquare size={24} />
                <motion.div 
                  animate={{ scale: [1, 1.2, 1], opacity: [0, 1, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full"
                />
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Tooltip */}
          {!isOpen && (
            <div className="absolute right-full mr-4 px-4 py-2 bg-white border border-slate-100 rounded-xl text-xs font-bold text-slate-900 whitespace-nowrap shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              Need legal help? <span className="text-accent underline">Chat with us</span>
            </div>
          )}
        </motion.button>
      </div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20, transformOrigin: "bottom right" }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-24 right-6 z-[9999] w-[380px] h-[550px] bg-white rounded-[2rem] shadow-[-20px_20px_60px_rgba(0,0,0,0.1)] border border-slate-100 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 bg-slate-950 text-white relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 blur-3xl rounded-full -mr-16 -mt-16" />
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-accent flex items-center justify-center shadow-lg shadow-accent/40">
                  <Bot size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg leading-tight">Lexi Assistant</h3>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Online & Ready</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide bg-slate-50/50"
            >
              {messages.map((msg) => (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  key={msg.id}
                  className={cn(
                    "flex w-full mb-2",
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  <div className={cn(
                    "max-w-[80%] p-4 text-sm font-medium shadow-sm",
                    msg.sender === "user" 
                      ? "bg-accent text-white rounded-2xl rounded-tr-none shadow-accent/10" 
                      : "bg-white text-slate-800 rounded-2xl rounded-tl-none border border-slate-100"
                  )}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-none p-4 flex gap-1 shadow-sm">
                    <motion.span animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                    <motion.span animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                    <motion.span animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                  </div>
                </motion.div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-slate-100">
              {step < QUESTIONS.length - 1 ? (
                <div className="flex gap-2">
                  <input
                    autoFocus
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Type your answer..."
                    className="flex-1 px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-accent/10 focus:border-accent transition-all"
                  />
                  <button
                    onClick={handleSend}
                    disabled={!inputValue.trim() || isTyping}
                    className="w-12 h-12 bg-accent text-white rounded-2xl flex items-center justify-center shadow-lg shadow-accent/20 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:grayscale transition-all"
                  >
                    <Send size={18} />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3 py-2">
                  <div className="flex items-center gap-2 text-green-600 font-bold text-sm">
                    <CheckCircle2 size={16} /> Lead Captured Successfully
                  </div>
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-accent transition-colors underline"
                  >
                    Close Assistant
                  </button>
                </div>
              )}
              
              <p className="mt-3 text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                <ShieldCheck size={10} className="text-accent" /> Encrypted & Secure Judicial Portal
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function CheckCircle2({ size }: { size: number }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="3" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function ShieldCheck({ size, className }: { size: number, className?: string }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
