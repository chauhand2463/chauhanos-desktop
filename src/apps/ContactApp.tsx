import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle, MessageCircle, Mail } from 'lucide-react';

const ContactApp = () => {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Construct notifications
    const subject = encodeURIComponent(`ChauhanOS: New message from ${form.name}`);
    const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\nMessage:\n${form.message}`);

    // WhatsApp pre-filled message
    const waText = encodeURIComponent(`*New Portfolio Contact*\n\n*Name:* ${form.name}\n*Email:* ${form.email}\n*Message:* ${form.message}`);
    const waUrl = `https://wa.me/919428280245?text=${waText}`;
    const mailUrl = `mailto:dkc074837@gmail.com?subject=${subject}&body=${body}`;

    // Open triggers (browser usually requires user interaction, but since this is an OS-feel app and triggered by button...)
    window.open(waUrl, '_blank');
    window.location.href = mailUrl;

    setSent(true);
    setTimeout(() => setSent(false), 5000);
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <div className="space-y-6 overflow-y-auto no-scrollbar h-full pb-4 px-1">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm">📧</span>
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-mono">Communication Channel</span>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="https://github.com/chauhand2463"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-2 py-1 rounded bg-black/20 border border-white/5 hover:border-primary/30 transition-all group"
          >
            <span className="text-[9px] font-mono text-muted-foreground group-hover:text-primary uppercase">github</span>
            <CheckCircle className="w-2.5 h-2.5 text-primary/50 group-hover:text-primary" />
          </a>
        </div>
      </div>

      {sent ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-12 gap-5 bg-primary/5 rounded-3xl border border-primary/10 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-primary/5 animate-pulse" />
          <div className="relative z-10 flex flex-col items-center gap-3 text-center px-4">
            <div className="p-4 rounded-full bg-primary/20 shadow-neon-sm">
              <CheckCircle className="w-8 h-8 text-primary" />
            </div>
            <div>
              <p className="text-sm text-primary font-display font-bold uppercase tracking-widest">Global Broadcast Initiated</p>
              <p className="text-[10px] font-mono text-muted-foreground mt-1">Notifications have been dispatched via WhatsApp and SMTP.</p>
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[9px] text-muted-foreground uppercase tracking-[0.2em] ml-1 font-bold">Identity</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Your Name"
                  required
                  className="w-full px-4 py-3 bg-secondary/30 border border-white/5 rounded-2xl text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/40 focus:bg-primary/5 transition-all text-shadow-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] text-muted-foreground uppercase tracking-[0.2em] ml-1 font-bold">Protocol</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="Your Email"
                  required
                  className="w-full px-4 py-3 bg-secondary/30 border border-white/5 rounded-2xl text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/40 focus:bg-primary/5 transition-all text-shadow-none"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[9px] text-muted-foreground uppercase tracking-[0.2em] ml-1 font-bold">Message Payload</label>
              <textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Synchronize your message here..."
                required
                rows={5}
                className="w-full px-4 py-3 bg-secondary/30 border border-white/5 rounded-2xl text-xs text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/40 focus:bg-primary/5 transition-all resize-none text-shadow-none"
              />
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-primary/20 border border-primary/30 text-primary text-xs font-mono font-bold uppercase tracking-[0.3em] hover:bg-primary/30 transition-all shadow-neon-sm"
            >
              <Send className="w-3.5 h-3.5" />
              Transmit Data
            </motion.button>
          </form>

          <div className="pt-6 border-t border-white/5 space-y-4">
            <h3 className="text-[10px] text-primary uppercase tracking-[0.2em] font-bold font-mono">Manual Uplinks</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a
                href="mailto:dkc074837@gmail.com"
                className="p-4 rounded-2xl bg-secondary/30 border border-white/5 flex flex-col gap-1 hover:border-primary/30 hover:bg-primary/5 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[9px] text-muted-foreground uppercase tracking-wider font-mono">SMTP Path</span>
                  <Mail className="w-3 h-3 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <span className="text-xs font-mono text-secondary-foreground truncate">dkc074837@gmail.com</span>
              </a>
              <a
                href="https://wa.me/919428280245"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-2xl bg-secondary/30 border border-white/5 flex flex-col gap-1 hover:border-primary/30 hover:bg-primary/5 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[9px] text-muted-foreground uppercase tracking-wider font-mono">WhatsApp Protocol</span>
                  <MessageCircle className="w-3 h-3 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <span className="text-xs font-mono text-secondary-foreground">+91 9428280245</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactApp;
