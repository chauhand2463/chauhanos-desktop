import { motion } from 'framer-motion';
import { useDesktopStore, type AppId } from '@/store/useDesktopStore';

const Taskbar = () => {
  const { windows, openApp, focusApp } = useDesktopStore();

  const handleClick = (id: AppId) => {
    const win = windows.find((w) => w.id === id);
    if (win?.isMinimized) {
      openApp(id);
    } else {
      focusApp(id);
    }
  };

  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 h-12 glass-strong flex items-center justify-between px-4 z-[999]"
      initial={{ y: 48 }}
      animate={{ y: 0 }}
      transition={{ delay: 0.3, duration: 0.4 }}
    >
      <div className="flex items-center gap-2">
        <span className="text-primary neon-text font-display font-bold text-sm tracking-wide">
          ChauhanOS
        </span>
        <span className="text-muted-foreground text-[10px]">v2.0</span>
      </div>

      {/* Open apps */}
      <div className="flex items-center gap-1">
        {windows.map((win) => (
          <button
            key={win.id}
            onClick={() => handleClick(win.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono transition-all ${
              win.isMinimized
                ? 'bg-secondary/50 text-muted-foreground'
                : 'bg-primary/10 text-primary border border-primary/20'
            }`}
          >
            <span className="text-sm">{win.icon}</span>
            <span className="hidden sm:inline">{win.title}</span>
          </button>
        ))}
      </div>

      {/* Clock */}
      <Clock />
    </motion.div>
  );
};

const Clock = () => {
  const now = new Date();
  const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return (
    <span className="text-xs text-muted-foreground font-mono">{time}</span>
  );
};

export default Taskbar;
