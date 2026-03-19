"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, User, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role: "user" }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to sign up");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-12 rounded-xl bg-white border border-slate-100 shadow-2xl max-w-md w-full"
        >
          <div className="w-20 h-20 bg-brand-light rounded-full flex items-center justify-center text-accent mx-auto mb-6">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="text-3xl font-display font-bold text-slate-900 mb-4">Account Created!</h2>
          <p className="text-slate-500 mb-8 font-medium">Redirecting you to the login page...</p>
          <Loader2 className="animate-spin mx-auto text-accent" size={32} />
        </motion.div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white relative flex items-center justify-center p-6 selection:bg-brand-soft selection:text-accent">
      {/* Background Proportions */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-light blur-[120px] rounded-full opacity-50" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-accent/5 blur-[100px] rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-xl"
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6 group">
            <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center text-white font-black italic shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform text-sm">LF</div>
            <span className="text-xl font-display font-bold text-slate-900 tracking-tight">LexFlow AI</span>
          </Link>
          <h1 className="text-3xl font-display font-bold text-slate-900 mb-2 tracking-tight">Create your account</h1>
          <p className="text-slate-500 text-base font-medium">Start automating your legal workflow today.</p>
        </div>

        <div className="bg-white border border-slate-200 p-8 md:p-10 rounded-xl shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 ml-1">Full Name</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-accent transition-colors" size={18} />
                <input
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-accent/15 focus:border-accent transition-all hover:bg-slate-100 font-medium text-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-accent transition-colors" size={18} />
                <input
                  name="email"
                  type="email"
                  placeholder="name@firm.com"
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-accent/15 focus:border-accent transition-all hover:bg-slate-100 font-medium text-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-accent transition-colors" size={18} />
                <input
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-accent/15 focus:border-accent transition-all hover:bg-slate-100 font-medium text-sm"
                />
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-bold"
              >
                {error}
              </motion.div>
            )}

            <button
              disabled={loading}
              type="submit"
              className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-bold text-lg hover:bg-accent hover:shadow-xl hover:shadow-accent/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:hover:scale-100"
            >
              {loading ? <Loader2 className="animate-spin" /> : (
                <>
                  Create Account
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-100 text-center">
            <p className="text-center text-sm text-slate-500">
              Already have an account?{" "}
              <Link href="/login" className="text-accent font-bold hover:underline transition-all">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
