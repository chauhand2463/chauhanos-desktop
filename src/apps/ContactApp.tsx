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
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-sm">📧</span>
        <span className="text-[10px] text-muted-foreground uppercase tracking-wider">New Message</span>
      </div>

      {sent ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-12 gap-3"
        >
          <CheckCircle className="w-10 h-10 text-neon-green" />
          <p className="text-sm text-primary font-display font-semibold">Message Sent!</p>
          <p className="text-xs text-muted-foreground">Thanks for reaching out.</p>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-[10px] text-muted-foreground uppercase tracking-wider">From</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Your name"
              required
              className="w-full mt-1 px-3 py-2 bg-secondary/30 border border-border rounded text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-colors"
            />
          </div>
          <div>
            <label className="text-[10px] text-muted-foreground uppercase tracking-wider">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="your@email.com"
              required
              className="w-full mt-1 px-3 py-2 bg-secondary/30 border border-border rounded text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-colors"
            />
          </div>
          <div>
            <label className="text-[10px] text-muted-foreground uppercase tracking-wider">Message</label>
            <textarea
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="Type your message..."
              required
              rows={4}
              className="w-full mt-1 px-3 py-2 bg-secondary/30 border border-border rounded text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-colors resize-none"
            />
          </div>
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-4 py-2 rounded bg-primary/20 border border-primary/30 text-primary text-xs font-mono hover:bg-primary/30 transition-colors neon-glow"
          >
            <Send className="w-3.5 h-3.5" />
            Send Message
          </motion.button>
        </form>
      )}
    </div>
  );
};

export default ContactApp;
