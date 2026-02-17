import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDesktopStore } from '@/store/useDesktopStore';

const BIOS_SPECS = [
  "AMIBIOS(C)2026 Chauhan Dynamics Tech Inc.",
  "ChauhanOS Low-Level Architecture v3.1.0-PRO",
  "CPU: Chauhan Core(TM) i9-X Extreme @ 5.80GHz",
  "Speed: 5800MHz  Core Count: 16  Threads: 32",
  "Memory Test: 65536MB OK (L1/L2/L3 Cache Valid)",
  "PCI Device Listing...",
  "Bus# Dev# Fun# VendorID DeviceID Class",
  "00    01   00   8086     1901     Display Controller",
  "00    14   00   8086     A12F     USB 3.0 Controller",
  "00    1F   02   8086     A102     SATA Controller",
  "Initializing NVMe Storage... Found 1 Device",
  "Checking for bootable media...",
];

const KERNEL_LOGS = [
  { text: "[  0.000000] Linux version 6.5.0-arch1-1 (gcc version 13.2.1)", delay: 0 },
  { text: "[  0.000342] Command line: root=PARTUUID=... quiet rw splash", delay: 10 },
  { text: "[  0.124512] x86/fpu: Supporting XSAVE feature set: 0x2ff", delay: 20 },
  { text: "[  0.451231] ACPI: Core revision 20230331", delay: 30 },
  { text: "[  OK  ] Started User Login Management.", delay: 40 },
  { text: "[  OK  ] Reached target Remote File Systems.", delay: 50 },
  { text: "[  OK  ] Started Network Manager Scripting Service.", delay: 60 },
  { text: "[  OK  ] Reached target System Initialization.", delay: 70 },
  { text: "[  OK  ] Started D-Bus System Message Bus.", delay: 80 },
  { text: "[  OK  ] Started Authorization Manager.", delay: 90 },
  { text: "[  OK  ] Reached target Paths.", delay: 100 },
  { text: "[  OK  ] Started Modem Manager.", delay: 110 },
  { text: "[  OK  ] Reached target Basic System.", delay: 120 },
  { text: "[  OK  ] Started TLP system startup/shutdown.", delay: 130 },
  { text: "[  OK  ] Started User Manager for UID 1000.", delay: 140 },
  { text: "[  OK  ] Started Session 1 of User dk-chauhan.", delay: 150 },
  { text: "[  OK  ] Reached target Graphical Interface.", delay: 160 },
  { text: "Mounting /home Partition... DONE", delay: 170 },
];

const DE_INIT_LOGS = [
  "Initializing Chauhan Window Manager v3.1...",
  "Loading Wayland session parameters...",
  "Fetching user configuration from /etc/chauhanos/config.json",
  "Starting PulseAudio Sound Service...",
  "Loading Wallpapers & Assets...",
  "Mounting Neural Workspace Architecture...",
  "Environment READY. Launching Desktop...",
];

const ArchASCII = `
      /\\
     /  \\
    /\\   \\
   /      \\
  /   ,,   \\
 /   |  |   \\
/_-''    ''-_\\
`;

const TuxASCII = `
    .--.
   |o_o |
   |:_/ |
  //   \\ \\
 (|     | )
/\\'\\_   _/ \`\\
\\___)=(___/
`;

interface BootScreenProps {
  onComplete: () => void;
}

type BootPhase = 'BIOS' | 'KERNEL' | 'LOGIN' | 'GRAYSWITCH' | 'REVEAL';

const BootScreen = ({ onComplete }: BootScreenProps) => {
  const { settings } = useDesktopStore();
  const [phase, setPhase] = useState<BootPhase>('BIOS');
  const [biosIndex, setBiosIndex] = useState(0);
  const [kernelIndex, setKernelIndex] = useState(0);
  const [loginStep, setLoginStep] = useState(0);
  const [deInitIndex, setDeInitIndex] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [kernelIndex, deInitIndex, phase]);

  // BIOS Phase
  useEffect(() => {
    if (phase === 'BIOS') {
      const fullBios = [
        ...BIOS_SPECS,
        ...settings.bootLogs,
        "GRUB Loading stage 1.5.",
        "GRUB loading, please wait...",
        "Loading kernel linux ...",
        "Loading initial ramdisk ...",
      ];

      const interval = setInterval(() => {
        setBiosIndex(prev => {
          if (prev >= fullBios.length - 1) {
            clearInterval(interval);
            setTimeout(() => setPhase('KERNEL'), 500);
            return prev;
          }
          return prev + 1;
        });
      }, 40);
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
            setTimeout(() => setPhase('LOGIN'), 400);
            return prev;
          }
          return prev + 1;
        });
      }, 80);
      return () => clearInterval(interval);
    }
  }, [phase]);

  // LOGIN Phase
  useEffect(() => {
    if (phase === 'LOGIN') {
      const timers = [
        setTimeout(() => setLoginStep(1), 800),  // Show prompt
        setTimeout(() => setLoginStep(2), 1600), // Type username
        setTimeout(() => setLoginStep(3), 2200), // Show password prompt
        setTimeout(() => setLoginStep(4), 3000), // Type password
        setTimeout(() => setLoginStep(5), 3600), // Welcome msg
        setTimeout(() => setPhase('GRAYSWITCH'), 4400),
      ];
      return () => timers.forEach(clearTimeout);
    }
  }, [phase]);

  // Transition Phase (Simulating video mode switch)
  useEffect(() => {
    if (phase === 'GRAYSWITCH') {
      setTimeout(() => setPhase('REVEAL'), 200);
    }
  }, [phase]);

  // REVEAL Phase (DE Initialization)
  useEffect(() => {
    if (phase === 'REVEAL') {
      const interval = setInterval(() => {
        setDeInitIndex(prev => {
          if (prev >= DE_INIT_LOGS.length - 1) {
            clearInterval(interval);
            setTimeout(() => {
              setIsDone(true);
              setTimeout(onComplete, 800);
            }, 1500);
            return prev;
          }
          return prev + 1;
        });
      }, 400);
      return () => clearInterval(interval);
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
          className="fixed inset-0 z-[100] bg-black text-[#d0d0d0] font-mono selection:bg-primary/30 overflow-hidden"
          exit={{
            opacity: 0,
            transition: { duration: 0.4 }
          }}
        >
          {/* Enhanced CRT Effects */}
          <div className="absolute inset-0 pointer-events-none noise-overlay opacity-5" />
          <div className="absolute inset-0 pointer-events-none opacity-30 crt-overlay" />
          <div className="absolute inset-0 scanline opacity-30 pointer-events-none" />

          {/* Phase: BIOS */}
          {phase === 'BIOS' && (
            <div className="p-4 md:p-8 space-y-1">
              <pre className="text-primary opacity-80 mb-6 leading-none text-[10px] md:text-xs">
                {TuxASCII}
              </pre>
              <div className="space-y-0.5">
                {[...BIOS_SPECS, ...settings.bootLogs, "GRUB Loading stage 1.5.", "GRUB loading, please wait...", "Loading kernel linux ...", "Loading initial ramdisk ..."].slice(0, biosIndex + 1).map((line, i) => (
                  <div key={i} className="text-[10px] md:text-sm tracking-tight opacity-90">
                    {line}
                  </div>
                ))}
                <span className="inline-block w-2 h-4 bg-primary/80 animate-pulse" />
              </div>
            </div>
          )}

          {/* Phase: KERNEL */}
          {phase === 'KERNEL' && (
            <div className="h-full flex flex-col p-4 md:p-8 bg-black">
              <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto no-scrollbar font-mono text-[10px] md:text-xs leading-relaxed"
              >
                {KERNEL_LOGS.slice(0, kernelIndex + 1).map((log, i) => (
                  <div key={i} className="flex gap-4">
                    {log.text.startsWith('[  OK  ]') ? (
                      <div className="flex gap-2">
                        <span className="text-white">[</span>
                        <span className="text-green-500 font-bold">  OK  </span>
                        <span className="text-white">]</span>
                        <span className="text-gray-300">{log.text.slice(8)}</span>
                      </div>
                    ) : (
                      <span className="text-gray-400">{log.text}</span>
                    )}
                  </div>
                ))}
                <span className="inline-block w-2 h-4 bg-gray-400 animate-pulse" />
              </div>
            </div>
          )}

          {/* Phase: LOGIN */}
          {phase === 'LOGIN' && (
            <div className="p-8 md:p-16 h-full flex flex-col justify-start bg-black tty-prompt">
              <div className="space-y-2 text-sm md:text-base">
                <div>Arch Linux 6.5.0-arch1-1 (tty1)</div>
                <div className="pt-4">
                  <span>chauhanos login: </span>
                  {loginStep >= 2 && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>dk-chauhan</motion.span>}
                  {loginStep === 1 && <span className="inline-block w-2 h-5 bg-white animate-pulse" />}
                </div>
                {loginStep >= 3 && (
                  <div>
                    <span>Password: </span>
                    {loginStep >= 4 && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>*********</motion.span>}
                    {loginStep === 3 && <span className="inline-block w-2 h-5 bg-white animate-pulse" />}
                  </div>
                )}
                {loginStep >= 5 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="pt-6 text-primary"
                  >
                    Welcome to ChauhanOS (dk-chauhan version)
                  </motion.div>
                )}
              </div>
            </div>
          )}

          {/* Phase: REVEAL (The GUI startup) */}
          {(phase === 'GRAYSWITCH' || phase === 'REVEAL') && (
            <div className="relative h-full w-full overflow-hidden bg-[#0c0c0c]">
              {/* Blurred desktop preview could go here if we had a screenshot */}

              <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                <motion.pre
                  initial={{ filter: "blur(20px)", scale: 0.8, opacity: 0 }}
                  animate={{ filter: "blur(0px)", scale: 1, opacity: 1 }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="text-primary text-[8px] md:text-[10px] leading-tight mb-12 font-black animate-holo-pulse"
                >
                  {ArchASCII}
                </motion.pre>

                <div className="text-center space-y-4">
                  <motion.h1
                    initial={{ letterSpacing: "1em", opacity: 0 }}
                    animate={{ letterSpacing: "0.2em", opacity: 1 }}
                    transition={{ duration: 1.5, ease: "circOut" }}
                    className="text-6xl md:text-8xl font-display font-black uppercase text-white relative"
                  >
                    CHAUHAN<span className="text-primary">OS</span>
                  </motion.h1>

                  <div className="flex flex-col items-center gap-1">
                    <div className="h-px w-64 bg-primary/20" />
                    <div className="h-[2px] w-32 bg-primary shadow-neon-sm" />
                    <div className="h-px w-64 bg-primary/20" />
                  </div>
                </div>

                {/* DE Initialization Logs */}
                {phase === 'REVEAL' && (
                  <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-full max-w-sm px-8">
                    <div className="text-[10px] md:text-xs font-mono text-center space-y-1">
                      {DE_INIT_LOGS.slice(0, deInitIndex + 1).map((log, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 0.6 }}
                          className="truncate"
                        >
                          <span className="text-primary mr-2">»</span>
                          {log}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Decorative Elements */}
              <div className="absolute top-10 left-10 w-24 h-24 border-t-2 border-l-2 border-primary/20" />
              <div className="absolute bottom-10 right-10 w-24 h-24 border-b-2 border-r-2 border-primary/20" />
            </div>
          )}

          {/* Skip Control */}
          <div className="fixed bottom-4 right-4 opacity-10 hover:opacity-50 transition-opacity">
            <button
              onClick={handleSkip}
              className="text-[10px] font-mono border border-white/20 px-3 py-1 uppercase"
            >
              Skip Boot
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BootScreen;
