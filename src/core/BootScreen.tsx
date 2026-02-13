import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BOOT_LINES = [
  { text: '> Initializing ChauhanOS Kernel v2.0...', delay: 0 },
  { text: '> Loading system modules...', delay: 400 },
  { text: '> Mounting /dev/portfolio...', delay: 800 },
  { text: '> Starting graphics subsystem...', delay: 1200 },
  { text: '> Loading user profile: Dk Chauhan', delay: 1600 },
  { text: '> Establishing network connections...', delay: 2000 },
  { text: '> All systems operational.', delay: 2400 },
  { text: '> Welcome to ChauhanOS.', delay: 2800 },
];

interface BootScreenProps {
  onComplete: () => void;
}

const BootScreen = ({ onComplete }: BootScreenProps) => {
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    BOOT_LINES.forEach((line, index) => {
      setTimeout(() => {
        setVisibleLines(index + 1);
        setProgress(((index + 1) / BOOT_LINES.length) * 100);
      }, line.delay);
    });

    setTimeout(() => setFadeOut(true), 3400);
    setTimeout(onComplete, 4000);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!fadeOut && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background boot-flicker"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-full max-w-xl px-8">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 text-center"
            >
              <h1 className="text-3xl font-display font-bold text-primary neon-text tracking-wider">
                ChauhanOS
              </h1>
              <p className="text-xs text-muted-foreground mt-1 tracking-widest uppercase">
                Portfolio System v2.0
              </p>
            </motion.div>

            {/* Boot log */}
            <div className="font-mono text-sm space-y-1 mb-8 min-h-[200px]">
              {BOOT_LINES.slice(0, visibleLines).map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                  className={
                    i === BOOT_LINES.length - 1
                      ? 'text-primary neon-text font-semibold'
                      : 'text-muted-foreground'
                  }
                >
                  {line.text}
                  {i === visibleLines - 1 && (
                    <span className="cursor-blink text-primary ml-1">▋</span>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Progress bar */}
            <div className="w-full h-1 rounded-full bg-secondary overflow-hidden">
              <motion.div
                className="h-full progress-glow rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              {Math.round(progress)}% loaded
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BootScreen;
