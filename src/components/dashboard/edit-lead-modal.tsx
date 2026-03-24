import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, Mail, Phone, Send, Loader2 } from "lucide-react";

interface EditLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  lead: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
}

export function EditLeadModal({ isOpen, onClose, onSuccess, lead }: EditLeadModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: lead.name,
    email: lead.email === "No Email" ? "" : lead.email,
    phone: lead.phone === "No Phone" ? "" : lead.phone
  });

  useEffect(() => {
    setFormData({
      name: lead.name,
      email: lead.email === "No Email" ? "" : lead.email,
      phone: lead.phone === "No Phone" ? "" : lead.phone
    });
  }, [lead]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    try {
      setIsSubmitting(true);
      const res = await fetch(`/api/leads/${lead.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone
        })
      });

      if (res.ok) {
        onSuccess?.();
        onClose();
      }
    } catch (err) {
      console.error("Failed to update lead:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-full max-w-xl bg-white rounded-xl shadow-2xl overflow-hidden relative"
          >
            {/* Header */}
            <div className="p-8 border-b border-slate-50 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-display font-bold text-slate-900 mb-1">Edit Lead Details</h2>
                <p className="text-sm text-slate-500 font-medium">Update contact information for {lead.name}.</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Form Body */}
              <div className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Name</label>
                  <div className="relative group">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-accent transition-colors" size={16} />
                    <input
                      required
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. John Doe"
                      className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-accent/10 focus:border-accent transition-all text-sm font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Address</label>
                    <div className="relative group">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-accent transition-colors" size={16} />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@example.com"
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-accent/10 focus:border-accent transition-all text-sm font-medium"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phone Number</label>
                    <div className="relative group">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-accent transition-colors" size={16} />
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+1 (555) 000-0000"
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-accent/10 focus:border-accent transition-all text-sm font-medium"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-8 bg-slate-50 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-2.5 bg-slate-900 text-white rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-slate-900/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : "Save Changes"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
