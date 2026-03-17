"use client";

import { useState, useEffect } from "react";
import { Bell, Keyboard, Search, User as UserIcon } from "lucide-react";
import { motion } from "framer-motion";

interface User {
  name: string;
  email: string;
  role: string;
}

export function Header() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  return (
    <header className="h-20 bg-white/80 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-30 flex items-center justify-between px-8">
      {/* Search Bar */}
      <div className="hidden md:flex items-center gap-3 bg-slate-50 border border-slate-100 px-4 py-2.5 rounded-xl w-full max-w-md group focus-within:bg-white focus-within:ring-2 focus-within:ring-accent/10 focus-within:border-accent transition-all">
        <Search size={18} className="text-slate-400 group-focus-within:text-accent" />
        <input 
          type="text" 
          placeholder="Search cases, documents, or leads..." 
          className="bg-transparent border-none outline-none text-sm font-medium w-full placeholder:text-slate-400"
        />
        <div className="flex items-center gap-1 bg-white border border-slate-200 px-1.5 py-0.5 rounded shadow-sm">
          <Keyboard size={12} className="text-slate-400" />
          <span className="text-[10px] font-bold text-slate-500">K</span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* Notifications */}
        <button className="relative p-2.5 text-slate-500 hover:bg-slate-50 rounded-xl transition-all group">
          <Bell size={20} className="group-hover:rotate-12 transition-transform" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-accent rounded-full border-2 border-white" />
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-6 border-l border-slate-100">
          <div className="flex flex-col items-end hidden sm:flex">
            <span className="text-sm font-bold text-slate-900 leading-none mb-1">
              {user?.name || "Member User"}
            </span>
            <span className="text-[10px] text-accent font-bold uppercase tracking-wider">
              {user?.role || "Attorney"}
            </span>
          </div>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="w-10 h-10 rounded-xl bg-brand-soft border border-brand-soft flex items-center justify-center text-accent cursor-pointer shadow-sm shadow-accent/5"
          >
            <UserIcon size={20} />
          </motion.div>
        </div>
      </div>
    </header>
  );
}
