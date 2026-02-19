import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Unlock, Clock, Calendar } from 'lucide-react';
import { useDesktopStore } from '@/store/useDesktopStore';

const LockScreen = () => {
    const { unlockScreen } = useDesktopStore();
    const [time, setTime] = useState(new Date());
    const [isUnlocking, setIsUnlocking] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const handleUnlock = () => {
        setIsUnlocking(true);
        setTimeout(() => {
            unlockScreen();
        }, 800);
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <motion.div
            className="fixed inset-0 z-[200] bg-[#0a0a0a] flex items-center justify-center overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{
                opacity: 0,
                scale: 1.1,
                filter: 'blur(20px)',
                transition: { duration: 0.8, ease: 'easeInOut' }
            }}
        >
            {/* Background Image / Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] opacity-80" />

            {/* Visual artifacts for OS feel */}
            <div className="absolute inset-0 desktop-grid opacity-20 pointer-events-none" />
            <div className="absolute inset-0 scanline opacity-30 pointer-events-none" />

            <div className="relative z-10 w-full max-w-2xl px-6 flex flex-col items-center gap-16">
                {/* Time and Date */}
                <motion.div
                    className="text-center space-y-4"
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 1 }}
                >
                    <motion.h1
                        className="text-[120px] font-display font-thin text-white tracking-tighter leading-none"
                    >
                        {formatTime(time)}
                    </motion.h1>
                    <div className="flex items-center justify-center gap-3 text-white/60 font-mono tracking-[0.3em] uppercase text-sm">
                        <Calendar className="w-4 h-4" />
                        {formatDate(time)}
                    </div>
                </motion.div>

                {/* Unlock Button Area */}
                <motion.div
                    className="relative"
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 1 }}
                >
                    <button
                        onClick={handleUnlock}
                        disabled={isUnlocking}
                        className="group relative p-8 rounded-full glass border border-white/10 hover:border-primary/40 transition-all duration-500 hover:scale-105 active:scale-95"
                    >
                        <AnimatePresence mode="wait">
                            {!isUnlocking ? (
                                <motion.div
                                    key="lock"
                                    initial={{ opacity: 0, rotate: -45 }}
                                    animate={{ opacity: 1, rotate: 0 }}
                                    exit={{ opacity: 0, rotate: 45, scale: 0.5 }}
                                >
                                    <Lock className="w-10 h-10 text-white/80 group-hover:text-primary transition-colors" />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="unlock"
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1.2 }}
                                    className="relative"
                                >
                                    <Unlock className="w-10 h-10 text-primary" />
                                    <motion.div
                                        className="absolute inset-0 rounded-full bg-primary/20 blur-xl"
                                        animate={{ scale: [1, 2, 1], opacity: [0.5, 0.8, 0.5] }}
                                        transition={{ duration: 1, repeat: Infinity }}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </button>

                    <motion.p
                        className="absolute top-24 left-1/2 -translate-x-1/2 whitespace-nowrap text-white/30 text-[10px] font-mono tracking-[0.5em] uppercase"
                        animate={{ opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        {isUnlocking ? "Authorizing..." : "Initialize Session"}
                    </motion.p>
                </motion.div>

                {/* System Info footer */}
                <motion.div
                    className="absolute bottom-12 flex flex-col items-center gap-4 opacity-40 font-mono text-[9px] tracking-widest text-white/50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.4 }}
                    transition={{ delay: 1 }}
                >
                    <div className="flex gap-8">
                        <span>SYS_STATUS: READY</span>
                        <span>KERNEL_VER: 24.0.2</span>
                        <span>ENCRYPTION: AES-256</span>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default LockScreen;
