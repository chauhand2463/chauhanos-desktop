import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Monitor, Lock, Wallpaper, Settings } from 'lucide-react';
import { useDesktopStore } from '@/store/useDesktopStore';

interface ContextMenuProps {
    x: number;
    y: number;
    onClose: () => void;
}

const DesktopContextMenu = ({ x, y, onClose }: ContextMenuProps) => {
    const { lockScreen, openApp } = useDesktopStore();

    const menuItems = [
        { icon: RefreshCw, label: 'Refresh System', action: () => window.location.reload() },
        { icon: Monitor, label: 'Display Settings', action: () => openApp('settings') },
        { icon: Wallpaper, label: 'Change Wallpaper', action: () => openApp('settings') },
        { icon: Lock, label: 'Lock Session', action: () => lockScreen() },
        { icon: Settings, label: 'System Preferences', action: () => openApp('settings') },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            style={{ top: y, left: x }}
            className="fixed z-[999] w-56 glass shadow-neon-lg rounded-xl overflow-hidden py-1.5 border border-white/10"
            onMouseLeave={onClose}
        >
            {menuItems.map((item, i) => (
                <button
                    key={i}
                    onClick={() => {
                        item.action();
                        onClose();
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-[11px] font-mono text-secondary-foreground hover:bg-primary/10 hover:text-primary transition-all duration-200 group"
                >
                    <item.icon className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
                    <span className="tracking-wider uppercase">{item.label}</span>
                </button>
            ))}
        </motion.div>
    );
};

export default DesktopContextMenu;
