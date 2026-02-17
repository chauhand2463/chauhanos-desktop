import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDesktopStore } from '@/store/useDesktopStore';

const BIOS_SPECS = [
  "ARCHBOOT(C)2026 Chauhan Dynamics",
  "ChauhanOS Arch-Core Revision 3.1.0",
  "CPU: Dhairy Chauhan Core(TM) i9-X Extreme @ 5.80GHz",
  "Speed: 5800MHz  Count: 16",
  "Memory Test: 65536MB OK",
];

const KERNEL_LOGS = [
  { text: "[  OK  ] Started User Login Management.", delay: 0 },
  { text: "[  OK  ] Reached target Remote File Systems.", delay: 50 },
  { text: "[  OK  ] Started Network Manager Scripting Service.", delay: 100 },
  { text: "[  OK  ] Reached target System Initialization.", delay: 150 },
  { text: "[  OK  ] Started D-Bus System Message Bus.", delay: 200 },
  { text: "[  OK  ] Started Authorization Manager.", delay: 250 },
  { text: "[  OK  ] Reached target Paths.", delay: 300 },
  { text: "[  OK  ] Started Modem Manager.", delay: 350 },
  { text: "[  OK  ] Reached target Basic System.", delay: 400 },
  { text: "[  OK  ] Started TLP system startup/shutdown.", delay: 450 },
  { text: "[  OK  ] Started User Manager for UID 1000.", delay: 500 },
  { text: "[  OK  ] Started Session 1 of User dk-chauhan.", delay: 550 },
  { text: "[  OK  ] Reached target Graphical Interface.", delay: 600 },
  { text: "Starting ChauhanOS Desktop Environment...", delay: 650 },
];

const ArchLogo = () => (
  <svg viewBox="0 0 100 100" className="w-32 h-32 mb-8 fill-current text-primary drop-shadow-[0_0_20px_hsla(var(--primary),0.6)]">
    <path d="M50 10 L90 85 L75 85 L50 40 L25 85 L10 85 Z" fill="currentColor" />
    <path d="M50 30 L65 70 L35 70 Z" fill="black" opacity="0.4" />
    <path d="M50 10 L10 85 L90 85 Z" fill="none" stroke="currentColor" strokeWidth="2" strokeOpacity="0.5" />
  </svg>
);

const TuxLogo = () => (
  <div className="absolute top-8 right-8 mix-blend-screen opacity-40">
    <svg width="40" height="40" viewBox="0 0 40 40" fill="currentColor" className="text-primary">
      <path d="M20 2c-5 0-9 4-9 9 0 2 1 4 2 6-1 2-2 4-2 7 0 6 4 9 9 9s9-3 9-9c0-3-1-5-2-7 1-2 2-4 2-6 0-5-4-9-9-9zm-3 8c1 0 2 1 2 2s-1 2-2 2-2-1-2-2 1-2 2-2zm6 0c1 0 2 1 2 2s-1 2-2 2-2-1-2-2 1-2 2-2z" />
    </svg>
  </div>
);

interface BootScreenProps {
  onComplete: () => void;
}

type BootPhase = 'BIOS' | 'KERNEL' | 'WORKSPACE' | 'REVEAL';

const BootScreen = ({ onComplete }: BootScreenProps) => {
  const { settings } = useDesktopStore();
  const [phase, setPhase] = useState<BootPhase>('BIOS');
  const [biosIndex, setBiosIndex] = useState(0);
  const [kernelIndex, setKernelIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll kernel logs
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [kernelIndex]);

  // BIOS Phase
  useEffect(() => {
    if (phase === 'BIOS') {
      const fullBios = [
        ...BIOS_SPECS,
        ...settings.bootLogs,
        "Mounting /dev/sda1 on /boot...",
        "Loading vmlinuz-linux...",
        "Loading initial ramdisk...",
        "Arch Linux 6.5.0-arch1-1 (tty1)",
      ];

      const interval = setInterval(() => {
        setBiosIndex(prev => {
          if (prev >= fullBios.length - 1) {
            clearInterval(interval);
            setTimeout(() => setPhase('KERNEL'), 800);
            return prev;
          }
          return prev + 1;
        });
      }, 35);
      return () => clearInterval(interval);
    }
  }, [phase, settings.bootLogs]);

  // KERNEL Phase
  useEffect(() => {
    if (phase === 'KERNEL') {
      const interval = setInterval(() => {
        setKernelIndex(prev => {
          if (prev >= KERNEL_LOGS.length - 1) {
            clearInterval(interval);
            setTimeout(() => setPhase('WORKSPACE'), 800);
            return prev;
          }
          return prev + 1;
        });
        setProgress(prev => {
          const next = prev + (Math.random() * 10 + 2);
          return Math.min(next, 100);
        });
      }, 120);
      return () => clearInterval(interval);
    }
  }, [phase]);

  // WORKSPACE Phase
  useEffect(() => {
    if (phase === 'WORKSPACE') {
      setTimeout(() => setPhase('REVEAL'), 600);
    }
  }, [phase]);

  // Final Transition
  useEffect(() => {
    if (phase === 'REVEAL') {
      setTimeout(() => {
        setIsDone(true);
        setTimeout(onComplete, 1200);
      }, 3000);
    }
  }, [phase, onComplete]);

  const handleSkip = useCallback(() => {
    setIsDone(true);
    onComplete();
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          className="fixed inset-0 z-[100] bg-[#0c0c0c] text-primary font-mono selection:bg-primary/30 overflow-hidden"
          exit={{
            opacity: 0,
            scale: 1.05,
            filter: "brightness(1.5) blur(30px)",
            transition: { duration: 0.8, ease: "circIn" }
          }}
        >
          {/* Subtle Visual Overlays */}
          <div className="absolute inset-0 pointer-events-none noise-overlay opacity-10" />
          <div className="absolute inset-0 pointer-events-none opacity-20 crt-overlay" />
          <div className="absolute inset-0 scanline opacity-20 pointer-events-none" />

          <TuxLogo />

          <div className="relative h-full flex flex-col p-8 md:p-16 max-w-5xl mx-auto">

            {/* Header / Brand */}
            <div className="flex justify-between items-start mb-12 opacity-40 text-[10px] tracking-[0.3em] uppercase">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_10px_hsl(var(--primary))]" />
                ARCH_CORE v2026.02
              </div>
              <div>STATION: PORTFOLIO-01</div>
            </div>

            {/* Phase 1: BIOS */}
            {phase === 'BIOS' && (
              <div className="space-y-1.5">
                <div className="text-white/90 mb-8 text-lg font-bold tracking-widest">
                  [ ARCH_BOOT_LOADER ]
                </div>
                {[...BIOS_SPECS, ...settings.bootLogs, "Mounting /dev/sda1 on /boot...", "Loading vmlinuz-linux...", "Loading initial ramdisk...", "Arch Linux 6.5.0-arch1-1 (tty1)"].slice(0, biosIndex + 1).map((line, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 0.7, x: 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-xs md:text-sm"
                  >
                    {line}
                  </motion.div>
                ))}
                <span className="inline-block w-2.5 h-4.5 bg-primary animate-pulse ml-1 mt-3" />
              </div>
            )}

            {/* Phase 2: KERNEL */}
            {phase === 'KERNEL' && (
              <div className="flex-1 flex flex-col">
                <div
                  ref={scrollRef}
                  className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col justify-end mb-12 scroll-smooth no-scrollbar"
                >
                  {KERNEL_LOGS.slice(0, kernelIndex + 1).map((line, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -3 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-[10px] md:text-xs font-mono mb-1.5 flex gap-3"
                    >
                      {line.text.startsWith('[  OK  ]') ? (
                        <>
                          <span className="text-white font-bold">[</span>
                          <span className="text-primary font-bold">  OK  </span>
                          <span className="text-white font-bold">]</span>
                          <span className="text-white/80">{line.text.slice(8)}</span>
                        </>
                      ) : (
                        <span className="text-primary italic opacity-60">:: {line.text}</span>
                      )}
                    </motion.div>
                  ))}
                </div>

                {/* Progress Visual */}
                <div className="w-full max-w-xl mx-auto space-y-5">
                  <div className="flex justify-between items-end">
                    <div className="space-y-1.5">
                      <div className="text-[9px] uppercase text-primary/50 tracking-[0.4em]">Mounting User Environment</div>
                      <div className="text-3xl font-display font-black tracking-tighter tabular-nums text-white text-shadow-arch">
                        {progress.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                  <div className="h-1 bg-primary/10 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-primary arch-glow"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.2 }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Phase 4: REVEAL */}
            {(phase === 'WORKSPACE' || phase === 'REVEAL') && (
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, filter: "blur(20px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  className="space-y-10 relative"
                >
                  <ArchLogo />

                  <div className="space-y-3">
                    <h1 className="text-6xl md:text-8xl font-display font-black tracking-[0.2em] uppercase text-white relative animate-glitch-text">
                      CHAUHAN<span className="text-primary">OS</span>
                    </h1>
                    <p className="text-primary/60 tracking-[0.8em] font-medium text-[10px] md:text-xs uppercase">
                      Simple // Minimalist // Powerful
                    </p>
                  </div>

                  <div className="h-px w-32 mx-auto bg-white/10" />

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="flex flex-col items-center gap-4"
                  >
                    <div className="flex items-center gap-3 text-primary text-xs">
                      <span className="animate-pulse">●</span>
                      AUTHENTICATION SUCCESSFUL
                    </div>
                  </motion.div>

                  {/* Minimalist corners */}
                  <div className="absolute -top-12 -left-12 w-8 h-8 border-t border-l border-white/5" />
                  <div className="absolute -top-12 -right-12 w-8 h-8 border-t border-r border-white/5" />
                  <div className="absolute -bottom-12 -left-12 w-8 h-8 border-b border-l border-white/5" />
                  <div className="absolute -bottom-12 -right-12 w-8 h-8 border-b border-r border-white/5" />
                </motion.div>
              </div>
            )}

            {/* Footer Control */}
            <div className="mt-12 flex justify-between items-center opacity-25 text-[9px] tracking-[0.4em]">
              <div>© 2026 Chauhan Dynamics // ARCH_V3</div>
              <button
                onClick={handleSkip}
                className="hover:text-white hover:opacity-100 transition-all border border-primary/30 px-5 py-1.5 bg-primary/5"
              >
                [ SKIP_BOOT ]
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BootScreen;
