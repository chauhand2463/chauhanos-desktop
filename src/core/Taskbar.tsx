import { useState } from 'react';
import { motion } from 'framer-motion';
import { Wifi, Volume2, Battery, Command } from 'lucide-react';
import { useDesktopStore, type AppId } from '@/store/useDesktopStore';
import StartMenu from '@/components/StartMenu';

const Taskbar = () => {
  const { windows, openApp, focusApp } = useDesktopStore();
  const [startOpen, setStartOpen] = useState(false);

  const handleClick = (id: AppId) => {
    const win = windows.find((w) => w.id === id);
    if (win?.isMinimized) {
      openApp(id);
    } else {
      focusApp(id);
      // If it's already focused, maybe minimize? 
      // For now, standard behavior is focus. 
      // Windows style: click focused -> minimize.
      if (win && !win.isMinimized && win.zIndex === Math.max(...windows.map(w => w.zIndex))) {
        // This check is a bit complex without store support for "active window ID" directly
        // simplified: just focus for now.
      }
    }
  };

  return (
    <>
      <StartMenu isOpen={startOpen} onClose={() => setStartOpen(false)} />

      <motion.div
        className="fixed bottom-0 left-0 right-0 h-12 glass-strong flex items-center justify-between px-2 z-[999] border-t border-white/10"
        initial={{ y: 48 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        <div className="flex items-center gap-2">
          <button
            onClick={() => setStartOpen(!startOpen)}
            className={`p-2 rounded-md transition-all duration-300 ${startOpen ? 'bg-primary/20 text-primary shadow-neon' : 'hover:bg-white/10 text-white'}`}
          >
            <Command className="w-5 h-5" />
          </button>

          <div className="w-[1px] h-6 bg-white/10 mx-1" />

          {/* Open apps */}
          <div className="flex items-center gap-1">
            {windows.map((win) => (
              <button
                key={win.id}
                onClick={() => handleClick(win.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all group relative overflow-hidden ${win.isMinimized
                    ? 'bg-transparent text-muted-foreground hover:bg-white/5'
                    : 'bg-white/10 text-primary shadow-sm border border-white/5'
                  }`}
              >
                <div className={`absolute bottom-0 left-0 right-0 h-[2px] ${win.isMinimized ? 'bg-transparent' : 'bg-primary shadow-neon-sm'}`} />
                <span>{win.icon}</span>
                <span className="hidden sm:inline max-w-[100px] truncate">{win.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* System Tray */}
        <div className="flex items-center gap-3 px-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Wifi className="w-4 h-4" />
            <Volume2 className="w-4 h-4" />
            <Battery className="w-4 h-4" />
          </div>
          <div className="w-[1px] h-6 bg-white/10" />
          <Clock />
        </div>
      </motion.div>
    </>
  );
};

const Clock = () => {
  const [time, setTime] = useState(new Date());

  useState(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  });

  return (
    <div className="flex flex-col items-end leading-none mr-2">
      <span className="text-xs font-medium text-foreground">
        {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </span>
      <span className="text-[10px] text-muted-foreground">
        {time.toLocaleDateString([], { month: 'short', day: 'numeric' })}
      </span>
    </div>
  );
};

export default Taskbar;
