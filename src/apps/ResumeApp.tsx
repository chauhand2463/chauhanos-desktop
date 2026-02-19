import { motion } from 'framer-motion';
import { Download, FileText } from 'lucide-react';

const ResumeApp = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-primary" />
          <span className="text-xs font-mono text-muted-foreground">resume_dk_chauhan.pdf</span>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-primary/20 border border-primary/30 text-primary text-[10px] font-mono hover:bg-primary/30 transition-colors"
        >
          <Download className="w-3 h-3" />
          Download
        </motion.button>
      </div>

      {/* Fake resume preview */}
      <div className="border border-border rounded-lg p-5 bg-secondary/20 space-y-4">
        <div className="text-center space-y-1">
          <h2 className="font-display text-lg font-bold text-primary">Dhairy Chauhan</h2>
          <p className="text-[10px] text-muted-foreground">Full Stack Developer • India</p>
          <p className="text-[10px] text-muted-foreground">dkc074837@gmail.com • +919428280245</p>
        </div>

        <div className="border-t border-border pt-3 space-y-3">
          <Section title="Summary">
            Passionate frontend developer specializing in React, TypeScript, and modern web technologies.
            Focused on creating performant, accessible, and visually stunning web applications.
          </Section>

          <Section title="Skills">
            React • TypeScript • Node.js • Python • Full Stack Dev • Web3 • AI • Tailwind CSS
          </Section>

          <Section title="Experience">
            <div className="space-y-1.5">
              <div>
                <p className="text-xs text-secondary-foreground font-semibold">Frontend Developer</p>
                <p className="text-[10px] text-muted-foreground">Freelance • 2024 - Present</p>
              </div>
            </div>
          </Section>

          <Section title="Education">
            <p className="text-xs text-secondary-foreground font-semibold">Computer Engineering</p>
            <p className="text-[10px] text-muted-foreground">Charotar University (CHARUSAT) - CSPIT • Present</p>
          </Section>
        </div>
      </div>
    </div>
  );
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div>
    <h3 className="text-[10px] text-primary uppercase tracking-wider font-bold mb-1">{title}</h3>
    <div className="text-xs text-muted-foreground leading-relaxed">{children}</div>
  </div>
);

export default ResumeApp;
