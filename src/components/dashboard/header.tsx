"use client";

import { useState, useEffect } from "react";
import { Bell, Keyboard, Search, User as UserIcon, LogOut, Settings, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

interface User {
  name: string;
  email: string;
  role: string;
}

export function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");
    router.push("/");
  };

  return (
    <header className="h-20 bg-white/80 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-40 flex items-center justify-between px-8">
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
        <div className="relative">
          <div 
            className="flex items-center gap-3 pl-6 border-l border-slate-100 cursor-pointer"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-black text-slate-900 leading-none mb-1">
                {user?.name || "LexFlow User"}
              </span>
              <span className="text-[10px] text-accent font-black uppercase tracking-widest">
                {user?.role || "Attorney / Admin"}
              </span>
            </div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 rounded-xl bg-accent/5 border border-accent/10 flex items-center justify-center text-accent shadow-lg shadow-accent/5"
            >
              <UserIcon size={20} strokeWidth={2.5} />
            </motion.div>
          </div>

          <AnimatePresence>
            {showDropdown && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowDropdown(false)} 
                />
                <motion.div
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 15, scale: 0.95 }}
                  className="absolute right-0 mt-3 w-56 bg-white border border-slate-100 rounded-xl shadow-2xl shadow-slate-200/50 z-50 overflow-hidden"
                >
                  <div className="p-4 bg-slate-50/50 border-b border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Signed in as</p>
                    <p className="text-xs font-bold text-slate-900 truncate">{user?.email || "admin@lexflow.ai"}</p>
                  </div>
                  <div className="p-2">                   
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-colors text-xs font-black uppercase tracking-widest"
                    >
                       <LogOut size={16} /> Sign Out
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
