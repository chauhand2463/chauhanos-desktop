import { motion } from 'framer-motion';

const SKILLS = [
  { name: 'React', level: 85, color: 'from-neon-cyan to-neon-purple' },
  { name: 'TypeScript', level: 75, color: 'from-neon-cyan to-neon-purple' },
  { name: 'JavaScript', level: 80, color: 'from-neon-cyan to-neon-purple' },
  { name: 'Tailwind CSS', level: 90, color: 'from-neon-cyan to-neon-purple' },
  { name: 'C Programming', level: 70, color: 'from-neon-cyan to-neon-purple' },
  { name: 'HTML/CSS', level: 90, color: 'from-neon-cyan to-neon-purple' },
  { name: 'Git/GitHub', level: 75, color: 'from-neon-cyan to-neon-purple' },
  { name: 'Blockchain', level: 60, color: 'from-neon-cyan to-neon-purple' },
];

const SkillsApp = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
        <span className="text-[10px] text-muted-foreground uppercase tracking-wider">System Performance Monitor</span>
      </div>

      <div className="space-y-3">
        {SKILLS.map((skill, i) => (
          <motion.div
            key={skill.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}
            className="space-y-1"
          >
            <div className="flex justify-between text-xs font-mono">
              <span className="text-secondary-foreground">{skill.name}</span>
              <span className="text-primary">{skill.level}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-secondary/50 overflow-hidden">
              <motion.div
                className="h-full rounded-full skill-bar"
                initial={{ width: 0 }}
                animate={{ width: `${skill.level}%` }}
                transition={{ delay: 0.3 + i * 0.08, duration: 0.8, ease: 'easeOut' }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2 mt-4">
        {[
          { label: 'CPU', value: '87%', sub: 'React Kernel' },
          { label: 'RAM', value: '4.2 GB', sub: 'Projects Loaded' },
          { label: 'Network', value: '↓ 42ms', sub: 'API Latency' },
          { label: 'Threads', value: '12', sub: 'Active Tasks' },
        ].map((stat) => (
          <div key={stat.label} className="p-2 rounded bg-secondary/30 border border-border">
            <p className="text-[10px] text-muted-foreground">{stat.label}</p>
            <p className="text-sm font-bold text-primary font-mono">{stat.value}</p>
            <p className="text-[9px] text-muted-foreground">{stat.sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillsApp;
