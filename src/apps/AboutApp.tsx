import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Github, Users, Book } from 'lucide-react';

const stats = [
  { label: 'User', value: 'Dhairy Chauhan' },
  { label: 'Role', value: 'Full Stack Developer' },
  { label: 'Uni', value: 'Charotar University (CSPIT)' },
  { label: 'OS', value: 'ChauhanOS v2.4' },
  { label: 'Kernel', value: 'React 18.3 LTS' },
  { label: 'Focus', value: 'Web3 & AI' },
  { label: 'Location', value: 'Gujarat, India' },
  { label: 'Status', value: '🟢 Building the Future' },
];

const AboutApp = () => {
  const [ghStats, setGhStats] = useState({ followers: 0, repos: 0 });

  useEffect(() => {
    fetch('https://api.github.com/users/chauhand2463')
      .then(res => res.json())
      .then(data => {
        setGhStats({ followers: data.followers || 0, repos: data.public_repos || 0 });
      })
      .catch(console.error);
  }, []);

  return (
    <div className="space-y-4 overflow-y-auto no-scrollbar h-full pb-4">
      <div className="flex items-center gap-3 mb-4 shrink-0">
        <div className="w-14 h-14 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-2xl neon-glow">
          🧑
        </div>
        <div>
          <h2 className="font-display text-lg font-bold text-primary neon-text">Dhairy Chauhan</h2>
          <p className="text-xs text-muted-foreground">Full Stack Dev • Web3 & AI Enthusiast</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="p-3 rounded-lg bg-primary/5 border border-primary/10 flex flex-col items-center">
          <span className="text-[10px] text-muted-foreground uppercase font-mono tracking-tighter">Followers</span>
          <span className="text-xl font-bold text-secondary-foreground">{ghStats.followers}</span>
        </div>
        <div className="p-3 rounded-lg bg-primary/5 border border-primary/10 flex flex-col items-center">
          <span className="text-[10px] text-muted-foreground uppercase font-mono tracking-tighter">Repositories</span>
          <span className="text-xl font-bold text-secondary-foreground">{ghStats.repos}</span>
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
          Computer Engineering student at Charotar University (CSPIT).
          Focused on building scalable Full Stack applications and exploring
          the decentralized frontier of Web3 and the cognitive capabilities of AI.
          I love pushing the boundaries of what's possible in the digital realm.
        </p>
      </div>
    </div>
  );
};

export default AboutApp;
