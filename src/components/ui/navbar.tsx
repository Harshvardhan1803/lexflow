"use client";

import Link from "next/link";
import { Scale, Menu, X, LogOut, LayoutDashboard, User as UserIcon } from "lucide-react";
import { cn } from "@/utils/utils";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { LogoutModal } from "./logout-modal";

interface User {
  name: string;
  email: string;
  role: string;
}

export function Navbar() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    // Check auth state
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user from localStorage", e);
      }
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      localStorage.removeItem("user");
      // Clear cookie client-side as well for extra safety
      document.cookie = "lexflow_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
      setUser(null);
      setShowLogoutModal(false);
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-white/80 backdrop-blur-xl border-b border-slate-200/60 py-4 shadow-sm"
          : "bg-transparent py-8"
      )}
    >
      <div className="container mx-auto px-6 max-w-6xl flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center text-white shadow-lg shadow-accent/20 group-hover:scale-105 transition-all duration-500 hover:rotate-3">
            <Scale size={20} />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-display font-bold text-slate-900 tracking-tight leading-none mb-0.5">
              LexFlow
            </span>
            <span className="text-[9px] text-accent font-bold uppercase tracking-[0.2em]">Legal AI</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-10">
          {[
            { name: "Smart Intake", href: "#features" },
            { name: "AI Discovery", href: "#solutions" },
            { name: "Case Flow", href: "#process" },
            { name: "Pricing", href: "#pricing" }
          ].map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-[13px] font-bold text-slate-600 hover:text-accent transition-all relative group py-2"
            >
              {item.name}
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-1 bg-accent/40 rounded-full transition-all duration-300 group-hover:w-full group-hover:bg-accent" />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-6">
          {isMounted && user ? (
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 text-[13px] font-bold text-slate-700 hover:text-accent transition-colors hidden sm:flex px-4 py-2 rounded-lg hover:bg-brand-light"
              >
                <LayoutDashboard size={16} />
                Dashboard
              </Link>
              <button
                onClick={() => setShowLogoutModal(true)}
                className="flex items-center gap-2 text-[13px] font-bold text-red-500 hover:bg-red-50 px-4 py-2 rounded-lg transition-all"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Logout</span>
              </button>
              <div className="w-9 h-9 rounded-full bg-brand-soft border border-brand-soft flex items-center justify-center text-accent" title={user.name}>
                <UserIcon size={18} />
              </div>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="text-[13px] font-bold text-slate-700 hover:text-accent transition-colors hidden sm:block"
              >
                Sign In
              </Link>
              <Link href="/signup">
                <button className="bg-slate-950 text-white px-7 py-3 rounded-full text-[13px] font-bold hover:bg-accent transition-all duration-500 shadow-[0_10px_20px_rgba(15,23,42,0.1)] hover:shadow-accent/25 active:scale-95">
                  Get Started
                </button>
              </Link>
            </>
          )}
          
          {/* Mobile Toggle */}
          <button 
            className="md:hidden w-10 h-10 flex items-center justify-center text-slate-900 bg-slate-50 rounded-lg border border-slate-200"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-slate-100 shadow-2xl overflow-hidden"
          >
            <div className="p-6">
              <nav className="flex flex-col gap-2">
                {[
                  { name: "Smart Intake", href: "#features" },
                  { name: "AI Discovery", href: "#solutions" },
                  { name: "Case Flow", href: "#process" },
                  { name: "Pricing", href: "#pricing" }
                ].map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-base font-bold text-slate-700 hover:text-accent p-4 rounded-xl hover:bg-brand-light transition-all flex items-center justify-between group"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                    <div className="w-1.5 h-1.5 rounded-full bg-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                ))}
                
                <div className="mt-4 pt-6 border-t border-slate-100 flex flex-col gap-4">
                  {isMounted && user ? (
                    <>
                      <Link 
                        href="/dashboard" 
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center justify-between p-4 rounded-xl bg-brand-light text-slate-900 font-bold"
                      >
                        <div className="flex items-center gap-3">
                          <LayoutDashboard size={18} className="text-accent" />
                          Dashboard
                        </div>
                      </Link>
                      <button 
                        onClick={() => {
                          setShowLogoutModal(true);
                          setMobileMenuOpen(false);
                        }}
                        className="flex items-center gap-3 p-4 rounded-xl text-red-500 font-bold hover:bg-red-50"
                      >
                        <LogOut size={18} />
                        Logout ({user.name})
                      </button>
                    </>
                  ) : (
                    <>
                      <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="text-center font-bold text-slate-700 py-3">Sign In</Link>
                      <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                        <button className="w-full bg-accent text-white py-4 rounded-2xl font-bold shadow-lg shadow-accent/20">Get Started</button>
                      </Link>
                    </>
                  )}
                </div>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <LogoutModal 
        isOpen={showLogoutModal} 
        onClose={() => setShowLogoutModal(false)} 
        onConfirm={handleLogout} 
      />
    </header>
  );
}
