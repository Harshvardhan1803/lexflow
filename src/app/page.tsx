"use client";

import Link from "next/link";
import { Navbar } from "@/components/ui/navbar";
import { Hero } from "@/components/landing/hero";
import { cn } from "@/utils/utils";
import {
  Bot,
  Check,
  Globe,
  MessageSquare,
  Search,
  Clock,
  ShieldCheck,
  TrendingUp,
  ArrowUpRight,
  CheckCircle2
} from "lucide-react";
// import { motion } from "framer-motion";

export default function Home() {
  return (
    <main className="min-h-screen bg-white selection:bg-brand-soft selection:text-accent">
      <Navbar />
      <Hero />

      {/* Social Proof / Stats */}
      <section className="py-16 bg-slate-50 border-y border-slate-100 relative z-10">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
            <StatItem value="200+" label="Firms Empowered" />
            <StatItem value="15k+" label="Cases Tracked" />
            <StatItem value="85%" label="Automation Rate" />
            <StatItem value="$2M+" label="Unbilled Recovered" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 relative overflow-hidden bg-white">
        <div id="solutions" className="absolute top-0 left-0" />
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-brand-light blur-[120px] rounded-full opacity-40" />

        <div className="container mx-auto px-6 max-w-6xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-light text-accent text-xs font-bold uppercase tracking-widest mb-5">
                Core Capabilities
              </div>
              <h2 className="text-3xl md:text-5xl font-display font-bold text-slate-900 mb-5 tracking-tight">
                Designed for the <br />
                <span className="text-gradient">Fastest-Growing Firms</span>
              </h2>
            </div>
            <p className="text-lg text-slate-500 max-w-sm leading-relaxed font-medium">
              We eliminate the administrative friction that delays case progress and hurts client satisfaction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={<Bot size={24} />}
              title="Smart Intake Widget"
              description="Deploy a 24/7 AI intake bot that screens leads, answers basic questions, and books consultations directly to your calendar."
              features={["Conflict-check automation", "Practice-specific screening", "Auto-scheduling"]}
            />
            <FeatureCard
              icon={<Search size={24} />}
              title="AI Discovery Summarizer"
              description="Upload 500-page discovery files and receive structured, hyperlinked summaries in seconds. Never miss a critical detail again."
              features={["Entity extraction", "Timeline generation", "Risk identification"]}
            />
            <FeatureCard
              icon={<Globe size={24} />}
              title="Secure Case Portal"
              description="Give clients real-time visibility with a branded portal. Secure document sharing, messaging, and milestone tracking."
              features={["End-to-end encryption", "Custom firm branding", "Mobile-first experience"]}
            />
            <FeatureCard
              icon={<Clock size={24} />}
              title="Automated Deadline Engine"
              description="The system monitors court dates and filing requirements, sending multi-channel alerts to the right team members."
              features={["Statute of limitation tracking", "Court rule integration", "SMS & Email alerts"]}
            />
            <FeatureCard
              icon={<MessageSquare size={24} />}
              title="Smart Communication Drafts"
              description="Generate case updates, document requests, and follow-ups in your firm's specific voice. Reduce drafting time by 90%."
              features={["Personalized case tone", "Multi-language support", "One-click approval"]}
            />
            <FeatureCard
              icon={<ShieldCheck size={24} />}
              title="Bank-Grade Security"
              description="We use SOC2-compliant infrastructure and AES-256 encryption. Your client data is never used to train global models."
              features={["Role-based access", "Audit trails", "Data residency options"]}
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-slate-50 border-y border-slate-100 relative">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-light text-accent text-xs font-bold uppercase tracking-widest mb-5">
              Transparent Pricing
            </div>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-slate-900 mb-5">
              Invest in your firm&apos;s scale
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto items-center">
            <PricingCard
              plan="Starter"
              price="$299"
              description="Essential tools for solo practitioners and boutique firms."
              features={["Smart Intake Bot", "Public Portal", "Up to 3 Attorneys", "Basic Support"]}
              cta="Start Starter Trial"
            />
            <PricingCard
              plan="Growth"
              price="$599"
              description="Full suite for scaling firms with complex caseloads."
              features={["Everything in Starter", "AI Document Summarizer", "AI Email Drafts", "Up to 10 Attorneys", "Priority Support"]}
              highlighted
              cta="Start Growth Trial"
            />
            <PricingCard
              plan="Scale"
              price="$1,199"
              description="Advanced features for enterprise professional services."
              features={["Everything in Growth", "Deadline Tracker", "Custom Branding", "Unlimited Attorneys", "24/7 Dedicated Support"]}
              cta="Get Scale Access"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="process" className="py-24 relative overflow-hidden bg-white">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="relative rounded-xl overflow-hidden bg-primary p-12 md:p-24 text-center">
            {/* Mesh Gradient Background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,var(--brand-primary)_0%,transparent_50%)] opacity-30" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,var(--brand-primary)_0%,transparent_50%)] opacity-20" />
            <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(15,23,42,1)_0%,rgba(30,41,59,0.9)_100%)] -z-10" />

            <div className="relative z-10 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/80 text-[10px] font-bold uppercase tracking-widest mb-8 backdrop-blur-md border border-white/10">
                Ready to transform?
              </div>
              <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-8 tracking-tight leading-[1.1]">
                Stop Losing Billable Hours. <br />
                <span className="text-accent underline decoration-white/20 underline-offset-8">Start Growing</span> Your Practice.
              </h2>
              <p className="text-lg md:text-xl text-slate-300 mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
                Join the elite circle of firms using LexFlow to outperform the competition and delight their clients.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Link href="/signup">
                  <button className="bg-accent text-white px-10 py-5 rounded-full text-xl font-bold hover:shadow-[0_0_40px_rgba(192,133,82,0.3)] transition-all hover:scale-105 active:scale-95 flex items-center gap-3 group">
                    Get Started Now
                    <ArrowUpRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </button>
                </Link>
                <Link href="#pricing" className="text-white/70 hover:text-white font-bold transition-colors">
                  View full pricing plan →
                </Link>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-12 left-12 w-24 h-24 border border-white/5 rounded-full blur-xl" />
            <div className="absolute bottom-12 right-12 w-32 h-32 border border-accent/10 rounded-full blur-2xl" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-slate-100 bg-white">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-16">
            <div className="max-w-xs">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-9 h-9 bg-accent rounded-lg flex items-center justify-center text-white font-black italic shadow-lg shadow-accent/20">LF</div>
                <span className="text-xl font-display font-bold text-slate-900 tracking-tight">LexFlow</span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed font-medium">
                The next generation of legal operations. AI-powered infrastructure for the modern boutique law firm.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-10 md:gap-20">
              <FooterColumn title="Product" links={["Features", "Solutions", "Pricing", "API"]} />
              <FooterColumn title="Company" links={["About", "Blog", "Careers", "Contact"]} />
              <FooterColumn title="Legal" links={["Privacy", "Terms", "Security", "GDPR"]} />
            </div>
          </div>
          <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-5">
            <p className="text-slate-400 text-xs font-bold">&copy; 2024 LexFlow AI. All rights reserved.</p>
            <div className="flex gap-6 text-slate-400">
              <Link href="#" className="hover:text-accent transition-colors"><Globe size={18} /></Link>
              <Link href="#" className="hover:text-accent transition-colors"><TrendingUp size={18} /></Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-3xl md:text-4xl font-display font-bold text-slate-900 tracking-tight">{value}</span>
      <span className="text-[11px] font-bold text-accent uppercase tracking-widest">{label}</span>
    </div>
  );
}

function FeatureCard({ icon, title, description, features }: { icon: React.ReactNode; title: string; description: string; features: string[] }) {
  return (
    <div className="group p-8 rounded-xl bg-white border border-slate-100 hover:border-accent/30 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1.5 relative overflow-hidden">
      <div className="w-12 h-12 rounded-xl bg-brand-light flex items-center justify-center text-accent mb-6 group-hover:scale-105 group-hover:bg-accent group-hover:text-white transition-all duration-500">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-accent transition-colors">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed mb-6 font-medium">{description}</p>
      <ul className="space-y-2.5">
        {features.map((f, i) => (
          <li key={i} className="flex items-center gap-2.5 text-[13px] font-bold text-slate-600">
            <Check size={12} className="text-accent" />
            {f}
          </li>
        ))}
      </ul>
    </div>
  );
}

function PricingCard({
  plan,
  price,
  description,
  features,
  cta,
  highlighted = false
}: {
  plan: string;
  price: string;
  description: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
}) {
  return (
    <div className={cn(
      "p-8 rounded-xl border transition-all duration-700 relative overflow-hidden flex flex-col",
      highlighted
        ? "bg-linear-to-b from-accent to-accent/80 text-white border-accent shadow-xl scale-105 z-10 py-12"
        : "bg-white border-slate-200 text-slate-900 hover:border-accent/30 shadow-sm"
    )}>
      {highlighted && (
        <div className="absolute top-0 right-0 py-1.5 px-6 bg-white text-accent text-[10px] font-black uppercase tracking-widest rounded-bl-xl shadow-sm">
          Most Popular
        </div>
      )}
      <h3 className={cn("text-lg font-bold mb-1.5", highlighted ? "opacity-90" : "text-slate-500")}>{plan}</h3>
      <div className="flex items-end gap-1 mb-5">
        <span className="text-5xl font-black">{price}</span>
        <span className="text-base opacity-60 mb-1">/mo</span>
      </div>
      <p className={cn("text-sm mb-8 font-medium leading-relaxed", highlighted ? "text-white/80" : "text-slate-500")}>
        {description}
      </p>
      <ul className="space-y-4 mb-10 grow">
        {features.map((f, i) => (
          <li key={i} className="flex items-start gap-3.5 text-[13px] font-bold">
            <CheckCircle2 size={16} className={cn("mt-0.5 shrink-0", highlighted ? "text-white" : "text-accent")} />
            {f}
          </li>
        ))}
      </ul>
      <Link href="/signup">
        <button className={cn(
          "w-full py-4 rounded-xl text-base font-bold transition-all duration-500",
          highlighted
            ? "bg-white text-accent hover:shadow-xl hover:scale-[1.02]"
            : "bg-slate-900 text-white hover:bg-accent"
        )}>
          {cta}
        </button>
      </Link>
    </div>
  );
}

function FooterColumn({ title, links }: { title: string; links: string[] }) {
  return (
    <div className="flex flex-col gap-5">
      <h4 className="text-slate-900 font-bold text-base">{title}</h4>
      <ul className="space-y-3.5">
        {links.map((l) => (
          <li key={l}>
            <Link href="#" className="text-slate-500 hover:text-accent transition-colors text-[13px] font-bold">
              {l}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
