import { motion } from 'framer-motion';

const stats = [
  { label: 'User', value: 'Dk Chauhan' },
  { label: 'Role', value: 'Frontend Developer' },
  { label: 'OS', value: 'ChauhanOS v2.0' },
  { label: 'Kernel', value: 'React 18.3 LTS' },
  { label: 'Shell', value: 'TypeScript 5.x' },
  { label: 'Uptime', value: 'Coding since 2024' },
  { label: 'Location', value: 'India' },
  { label: 'Status', value: '🟢 Online & Building' },
];

const AboutApp = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-14 h-14 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-2xl neon-glow">
          🧑
        </div>
        <div>
          <h2 className="font-display text-lg font-bold text-primary neon-text">Dk Chauhan</h2>
          <p className="text-xs text-muted-foreground">Developer • Creator • Builder</p>
        </div>
      </div>

      <div className="space-y-1.5">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-center gap-2 text-xs font-mono"
          >
            <span className="text-primary w-20 shrink-0">{stat.label}:</span>
            <span className="text-secondary-foreground">{stat.value}</span>
          </motion.div>
        ))}
      </div>

      <div className="mt-4 p-3 rounded bg-secondary/30 border border-border">
        <p className="text-xs text-muted-foreground leading-relaxed">
          Passionate developer focused on building modern web applications.
          I love creating unique user experiences and pushing the boundaries of
          what's possible on the web. Currently exploring React, TypeScript,
          and creative frontend development.
        </p>
      </div>
    </div>
  );
};

export default AboutApp;
