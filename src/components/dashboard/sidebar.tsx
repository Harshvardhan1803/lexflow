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
import Tooltip from '@mui/material/Tooltip';
import Zoom from '@mui/material/Zoom';

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
  const [userRole, setUserRole] = useState<string>("User");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setUserRole(user.role || "User");
      } catch (e) {
        console.error(e);
      }
    }
    
    const handleResize = () => {
      if (window.innerWidth < 1024) setIsCollapsed(true);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Define logic for item visibility
  const isItemVisible = (name: string) => {
    const roleNormalized = userRole.toLowerCase();
    if (roleNormalized === "admin") return true;
    
    // Non-Admin (Attorney) restricted items
    const restricted = ["AI Discovery", "Settings"];
    return !restricted.includes(name);
  };

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
        {navItems.filter(i => isItemVisible(i.name)).map((item) => {
          const isActive = pathname === item.href;
          return (
            <Tooltip 
              key={item.name} 
              title={isCollapsed ? item.name : ""} 
              placement="right" 
              arrow 
              slots={{ transition: Zoom }}
              slotProps={{
                tooltip: {
                  sx: {
                    bgcolor: '#0f172a', // slate-900
                    '& .MuiTooltip-arrow': { color: '#0f172a' },
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '8px 12px',
                    borderRadius: '8px',
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)'
                  }
                }
              }}
            >
              <Link href={item.href}>
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
                </div>
              </Link>
            </Tooltip>
          );
        })}

        {/* Settings Item (Conditional) */}
        {isItemVisible("Settings") && (
          <div className="pt-4 mt-4 border-t border-slate-50">
            <Tooltip 
              title={isCollapsed ? "Settings" : ""} 
              placement="right" 
              arrow 
              slots={{ transition: Zoom }}
              slotProps={{
                tooltip: {
                  sx: {
                    bgcolor: '#0f172a',
                    '& .MuiTooltip-arrow': { color: '#0f172a' },
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '8px 12px',
                    borderRadius: '8px'
                  }
                }
              }}
            >
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
                </div>
              </Link>
            </Tooltip>
          </div>
        )}
      </nav>
    </aside>
  );
}
