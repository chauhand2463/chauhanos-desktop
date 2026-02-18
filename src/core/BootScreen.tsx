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
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{
              opacity: phase === 'FADE_OUT' ? 0 : 1,
              scale: phase === 'BREATHING' || phase === 'PROGRESS' ? [1, 1.02, 1] : 1,
            }}
            transition={{
              opacity: { duration: 1.5, ease: 'easeInOut' },
              scale: {
                duration: 2,
                ease: 'easeInOut',
                repeat: phase === 'BREATHING' || phase === 'PROGRESS' ? Infinity : 0,
              }
            }}
            className="relative"
          >
            {/* Premium Geometric Logo */}
            <div className="w-40 h-40 relative">
              <svg viewBox="0 0 120 120" className="w-full h-full">
                <defs>
                  {/* Premium glow effect */}
                  <filter id="premium-glow">
                    <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* "C" shape */}
                <motion.path
                  d="M 70 20 A 30 30 0 0 1 70 80"
                  stroke="white"
                  strokeWidth="8"
                  strokeLinecap="round"
                  fill="none"
                  filter="url(#soft-glow)"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1.5, ease: 'easeInOut' }}
                />
              </svg>
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
