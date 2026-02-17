import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle } from 'lucide-react';

const ContactApp = () => {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 3000);
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <div className="space-y-6 overflow-y-auto no-scrollbar h-full pb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm">📧</span>
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Communication Channel</span>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="https://github.com/chauhand2463"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-2 py-1 rounded bg-black/20 border border-white/5 hover:border-primary/30 transition-all group"
          >
            <span className="text-[9px] font-mono text-muted-foreground group-hover:text-primary">GITHUB</span>
            <CheckCircle className="w-2.5 h-2.5 text-primary/50 group-hover:text-primary" />
          </a>
        </div>
      </div>

      {sent ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-12 gap-3 bg-primary/5 rounded-2xl border border-primary/10"
        >
          <CheckCircle className="w-10 h-10 text-primary" />
          <p className="text-sm text-primary font-display font-semibold uppercase tracking-widest">Transmission Successful</p>
          <p className="text-[10px] font-mono text-muted-foreground">The message has been encrypted and sent.</p>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[9px] text-muted-foreground uppercase tracking-[0.2em] ml-1">Identity</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Name"
                required
                className="w-full mt-1 px-4 py-3 bg-secondary/30 border border-white/5 rounded-xl text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 focus:bg-primary/5 transition-all"
              />
            </div>
            <div>
              <label className="text-[9px] text-muted-foreground uppercase tracking-[0.2em] ml-1">Protocol</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="Email"
                required
                className="w-full mt-1 px-4 py-3 bg-secondary/30 border border-white/5 rounded-xl text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 focus:bg-primary/5 transition-all"
              />
            </div>
          </div>
          <div>
            <label className="text-[9px] text-muted-foreground uppercase tracking-[0.2em] ml-1">Encrypted Payload</label>
            <textarea
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="Type your message here..."
              required
              rows={4}
              className="w-full mt-1 px-4 py-3 bg-secondary/30 border border-white/5 rounded-xl text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 focus:bg-primary/5 transition-all resize-none"
            />
          </div>
          <motion.button
            type="submit"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary/20 border border-primary/30 text-primary text-xs font-mono font-bold uppercase tracking-widest hover:bg-primary/30 transition-all neon-glow"
          >
            <Send className="w-3.5 h-3.5" />
            Send Transmission
          </motion.button>
        </form>
      )}
    </div>
  );
};

export default ContactApp;
