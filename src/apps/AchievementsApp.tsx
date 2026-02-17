import { motion } from 'framer-motion';
import { Trophy, Star, Target, Zap, Shield, Code } from 'lucide-react';

const ACHIEVEMENTS = [
    { id: 1, title: 'OS Architect', description: 'Built the core desktop environment.', icon: <Shield className="w-5 h-5 text-blue-400" />, status: 'completed' },
    { id: 2, title: 'GitHub Explorer', description: 'Connected the system to the cloud.', icon: <Zap className="w-5 h-5 text-yellow-400" />, status: 'completed' },
    { id: 3, title: 'Animation Master', description: 'Implemented the glitch entry sequence.', icon: <Star className="w-5 h-5 text-purple-400" />, status: 'completed' },
    { id: 4, title: 'Power User', description: 'Customized all available system settings.', icon: <Target className="w-5 h-5 text-red-400" />, status: 'locked' },
    { id: 5, title: 'Clean Coder', description: 'Wrote 1000+ lines of clean TypeScript.', icon: <Code className="w-5 h-5 text-green-400" />, status: 'locked' },
];

const AchievementsApp = () => {
    return (
        <div className="space-y-6 overflow-y-auto no-scrollbar pb-4 h-full">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-primary/10 border border-primary/20">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-3xl">🏆</div>
                <div>
                    <h2 className="text-xl font-display font-bold text-primary">System Achievements</h2>
                    <p className="text-xs text-muted-foreground font-mono tracking-wider">LEVEL 10 // OS VETERAN</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ACHIEVEMENTS.map((achievement, i) => (
                    <motion.div
                        key={achievement.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className={`p-4 rounded-xl border transition-all relative overflow-hidden group ${achievement.status === 'completed'
                            ? 'bg-primary/5 border-primary/20 hover:border-primary/50 shadow-neon-sm hover:shadow-neon-lg'
                            : 'bg-black/20 border-white/5 opacity-50 grayscale'
                            }`}
                    >
                        {achievement.status === 'completed' && (
                            <div className="absolute inset-0 pointer-events-none holographic-glow opacity-0 group-hover:opacity-100 transition-opacity" />
                        )}

                        <div className="flex items-start gap-4 relative z-10">
                            <div className={`p-2 rounded-lg ${achievement.status === 'completed' ? 'bg-primary/10' : 'bg-white/5'}`}>
                                {achievement.icon}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-bold text-secondary-foreground group-hover:text-primary transition-colors">{achievement.title}</h3>
                                    {achievement.status === 'completed' && (
                                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-green-500/20 text-green-400 font-mono uppercase font-bold">Unlocked</span>
                                    )}
                                </div>
                                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                                    {achievement.description}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="text-center opacity-30 text-[9px] font-mono tracking-widest uppercase py-4">
                SYSTEM_RANKING // GLOBAL_LEADERBOARD_DISABLED
            </div>
        </div>
    );
};

export default AchievementsApp;
