import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BootScreenProps {
  onComplete: () => void;
}

type BootPhase = 'FADE_IN' | 'BREATHING' | 'PROGRESS' | 'FADE_OUT';

const BootScreen = ({ onComplete }: BootScreenProps) => {
  const [phase, setPhase] = useState<BootPhase>('FADE_IN');
  const [progress, setProgress] = useState(0);

  // Phase transitions
  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase('BREATHING'), 1500),
      setTimeout(() => setPhase('PROGRESS'), 3500),
      setTimeout(() => setPhase('FADE_OUT'), 5500),
      setTimeout(onComplete, 6500),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  // Progress animation
  useEffect(() => {
    if (phase === 'PROGRESS') {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 2;
        });
      }, 40);
      return () => clearInterval(interval);
    }
  }, [phase]);

  const handleSkip = useCallback(() => {
    onComplete();
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] bg-[#0a0a0a] flex items-center justify-center overflow-hidden"
        exit={{
          opacity: 0,
          transition: { duration: 0.8, ease: 'easeInOut' }
        }}
      >
        {/* Subtle gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#0f0f0f] to-[#0a0a0a]" />

        {/* Main content */}
        <div className="relative z-10 flex flex-col items-center gap-12">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
            animate={{
              opacity: phase === 'FADE_OUT' ? 0 : 1,
              scale: phase === 'BREATHING' || phase === 'PROGRESS' ? [1, 1.05, 1] : 1,
              rotate: phase === 'FADE_IN' ? [-5, 0] : 0,
            }}
            transition={{
              opacity: { duration: 1.5, ease: 'easeInOut' },
              scale: {
                duration: 4,
                ease: 'easeInOut',
                repeat: phase === 'BREATHING' || phase === 'PROGRESS' ? Infinity : 0,
              },
              rotate: { duration: 2, ease: 'easeOut' }
            }}
            className="relative"
          >
            {/* Premium Geometric Logo */}
            <div className="w-56 h-56 relative group">
              <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                <defs>
                  <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="white" stopOpacity="0.9" />
                    <stop offset="50%" stopColor="white" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="white" stopOpacity="0.9" />
                  </linearGradient>

                  <filter id="ultra-glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>

                  <filter id="inner-glow">
                    <feGaussianBlur stdDeviation="1" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="arithmetic" k2="1" k3="0.5" />
                  </filter>
                </defs>

                {/* Outer Hexagon Frame */}
                <motion.path
                  d="M 60 10 L 105 35 L 105 85 L 60 110 L 15 85 L 15 35 Z"
                  fill="none"
                  stroke="url(#logo-grad)"
                  strokeWidth="0.5"
                  strokeDasharray="4 4"
                  initial={{ opacity: 0, rotate: 90 }}
                  animate={{ opacity: 0.3, rotate: 0 }}
                  transition={{ duration: 2, ease: "linear" }}
                />

                {/* Primary 'C' Structure - Modernized */}
                <motion.path
                  d="M 85 35 A 35 35 0 1 0 85 85"
                  stroke="white"
                  strokeWidth="7"
                  strokeLinecap="round"
                  fill="none"
                  filter="url(#ultra-glow)"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                />

                {/* Accent Inner Curve */}
                <motion.path
                  d="M 75 45 A 20 20 0 1 0 75 75"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  fill="none"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.6 }}
                  transition={{ duration: 1.5, delay: 0.5, ease: "easeInOut" }}
                />

                {/* Central Core Point */}
                <motion.circle
                  cx="60"
                  cy="60"
                  r="3"
                  fill="white"
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.5, 1] }}
                  transition={{ delay: 1, duration: 1 }}
                />

                {/* Orbiting Particles */}
                {[0, 120, 240].map((angle, i) => (
                  <motion.circle
                    key={i}
                    cx="60"
                    cy="60"
                    r="1"
                    fill="white"
                    animate={{
                      cx: 60 + Math.cos((angle * Math.PI) / 180) * 45,
                      cy: 60 + Math.sin((angle * Math.PI) / 180) * 45,
                      opacity: [0, 0.8, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: i * 0.5,
                      ease: "linear"
                    }}
                  />
                ))}
              </svg>

              {/* Background Glass Plate */}
              <div className="absolute inset-0 bg-white/5 rounded-full blur-3xl -z-10 animate-pulse" />
            </div>
          </motion.div>

          {/* ChauhanOS text */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{
              opacity: phase === 'FADE_OUT' ? 0 : phase === 'FADE_IN' ? 0 : 1,
              y: phase === 'FADE_IN' ? 10 : 0
            }}
            transition={{ duration: 1, delay: 1.2, ease: 'easeOut' }}
            className="text-white/90 text-2xl font-light tracking-[0.3em] uppercase"
            style={{ fontFamily: 'Inter, SF Pro Display, system-ui, sans-serif' }}
          >
            ChauhanOS
          </motion.div>

          {/* Progress indicator */}
          {phase === 'PROGRESS' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="absolute bottom-24"
            >
              {/* Circular progress */}
              <div className="relative w-12 h-12">
                <svg className="w-full h-full -rotate-90">
                  {/* Background circle */}
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="2"
                    fill="none"
                  />
                  {/* Progress circle */}
                  <motion.circle
                    cx="24"
                    cy="24"
                    r="20"
                    stroke="white"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: progress / 100 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    style={{
                      strokeDasharray: 2 * Math.PI * 20,
                    }}
                  />
                </svg>
              </div>
            </motion.div>
          )}
        </div>

        {/* Skip button (hidden, only on hover) */}
        <motion.button
          onClick={handleSkip}
          className="fixed bottom-8 right-8 text-white/20 hover:text-white/60 text-sm font-light transition-colors duration-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          whileHover={{ opacity: 1 }}
          style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
        >
          Skip
        </motion.button>
      </motion.div>
    </AnimatePresence>
  );
};

export default BootScreen;
