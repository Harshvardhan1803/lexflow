"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  Calendar, 
  Bot, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  Scale,
  MessageSquare
} from "lucide-react";
import { cn } from "@/utils/utils";

const navItems = [
  { name: "Overview", icon: LayoutDashboard, href: "/dashboard" },
  { name: "Active Cases", icon: Briefcase, href: "/dashboard/cases" },
  { name: "Intake Leads", icon: Users, href: "/dashboard/leads" },
  { name: "AI Discovery", icon: Bot, href: "/dashboard/ai" },
  { name: "Calendar", icon: Calendar, href: "/dashboard/calendar" },
  { name: "Communications", icon: MessageSquare, href: "/dashboard/chat" },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) setIsCollapsed(true);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <aside 
      className={cn(
        "h-screen sticky top-0 bg-white border-r border-slate-100 transition-all duration-500 z-40 flex flex-col",
        isCollapsed ? "w-20" : "w-72"
      )}
    >
      {/* Brand Section */}
      <div className={cn(
        "mb-4 flex items-center overflow-hidden relative transition-all duration-300",
        isCollapsed ? "flex-col p-4 gap-4" : "p-6 justify-between"
      )}>
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-accent rounded-xl shrink-0 flex items-center justify-center text-white shadow-lg shadow-accent/20 group-hover:rotate-3 transition-all">
            <Scale size={20} />
          </div>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex flex-col whitespace-nowrap"
              >
                <span className="text-xl font-display font-bold text-slate-900 tracking-tight leading-none mb-0.5">LexFlow</span>
                <span className="text-[9px] text-accent font-bold uppercase tracking-[0.2em]">Workspace</span>
              </motion.div>
            )}
          </AnimatePresence>
        </Link>

        {/* Top Collapse Toggle */}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn(
            "p-2 rounded-lg text-slate-400 hover:bg-slate-50 hover:text-accent transition-all",
            isCollapsed ? "w-full flex justify-center" : ""
          )}
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-4 space-y-1.5 scrollbar-hide overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.name} href={item.href}>
              <div 
                className={cn(
                  "flex items-center rounded-xl transition-all group relative",
                  isCollapsed ? "justify-center py-3.5" : "gap-4 px-4 py-3.5",
                  isActive 
                    ? "bg-brand-soft text-accent" 
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <item.icon size={20} className={cn("shrink-0 transition-transform group-hover:scale-110", isActive && "stroke-[2.5px]")} />
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="text-sm font-bold whitespace-nowrap"
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>
                
                {/* Active Indicator */}
                {isActive && (
                  <motion.div 
                    layoutId="active-nav"
                    className={cn(
                      "absolute bg-accent rounded-full",
                      isCollapsed ? "inset-y-3 left-0 w-1" : "inset-y-2 left-0 w-1"
                    )}
                  />
                )}

                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                  <div className="absolute left-full ml-4 px-3 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap shadow-xl">
                    {item.name}
                  </div>
                )}
              </div>
            </Link>
          );
        })}

        {/* Settings Item (Integrated into main list) */}
        <div className="pt-4 mt-4 border-t border-slate-50">
          <Link href="/dashboard/settings">
            <div className={cn(
              "flex items-center rounded-xl text-slate-500 hover:bg-slate-50 transition-all group relative",
              isCollapsed ? "justify-center py-3.5" : "gap-4 px-4 py-3.5",
              pathname === "/dashboard/settings" ? "bg-brand-soft text-accent" : ""
            )}>
              <Settings size={20} className="shrink-0 group-hover:rotate-45 transition-transform" />
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="text-sm font-bold whitespace-nowrap"
                  >
                    Settings
                  </motion.span>
                )}
              </AnimatePresence>
              {isCollapsed && (
                <div className="absolute left-full ml-4 px-3 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap shadow-xl">
                  Settings
                </div>
              )}
            </div>
          </Link>
        </div>
      </nav>
    </aside>
  );
}
