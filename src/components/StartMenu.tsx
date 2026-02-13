import { motion, AnimatePresence } from 'framer-motion';
import { Power, User, Search, Terminal, FolderOpen, Mail, Monitor, FileText, Settings } from 'lucide-react';
import { useDesktopStore, type AppId } from '@/store/useDesktopStore';

interface StartMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

const StartMenu = ({ isOpen, onClose }: StartMenuProps) => {
    const { openApp } = useDesktopStore();

    const handleAppClick = (id: AppId) => {
        openApp(id);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop to close menu */}
                    <div
                        className="fixed inset-0 z-[998]"
                        onClick={onClose}
                    />

                    <motion.div
                        className="fixed bottom-14 left-4 w-80 glass-strong border border-white/10 rounded-xl overflow-hidden z-[999] shadow-2xl origin-bottom-left"
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                    >
                        {/* User Profile Header */}
                        <div className="p-4 border-b border-white/10 flex items-center gap-3 bg-white/5">
                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30 text-primary">
                                <User className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm">Dk Chauhan</h3>
                                <p className="text-xs text-muted-foreground">Admin</p>
                            </div>
                        </div>

                        {/* Search Bar */}
                        <div className="p-3">
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder="Type to search..."
                                    className="w-full bg-black/20 border border-white/10 rounded-md py-2 pl-9 pr-3 text-sm focus:outline-none focus:border-primary/50 transition-colors"
                                />
                            </div>
                        </div>

                        {/* Pinned Apps */}
                        <div className="px-2 pb-2">
                            <p className="px-2 py-1 text-[10px] uppercase text-muted-foreground font-semibold tracking-wider">Pinned</p>
                            <div className="grid grid-cols-4 gap-1">
                                <StartMenuItem icon={<Terminal className="w-5 h-5 text-green-400" />} label="Terminal" onClick={() => handleAppClick('terminal')} />
                                <StartMenuItem icon={<FolderOpen className="w-5 h-5 text-blue-400" />} label="Files" onClick={() => handleAppClick('projects')} />
                                <StartMenuItem icon={<Monitor className="w-5 h-5 text-purple-400" />} label="Skills" onClick={() => handleAppClick('skills')} />
                                <StartMenuItem icon={<Mail className="w-5 h-5 text-orange-400" />} label="Contact" onClick={() => handleAppClick('contact')} />
                                <StartMenuItem icon={<FileText className="w-5 h-5 text-yellow-400" />} label="Resume" onClick={() => handleAppClick('resume')} />
                                <StartMenuItem icon={<User className="w-5 h-5 text-pink-400" />} label="About" onClick={() => handleAppClick('about')} />
                            </div>
                        </div>

                        {/* Bottom Actions */}
                        <div className="p-3 border-t border-white/10 flex items-center justify-between bg-black/20">
                            <button className="p-2 hover:bg-white/10 rounded-md transition-colors" title="Settings">
                                <Settings className="w-4 h-4 text-muted-foreground" />
                            </button>
                            <button className="p-2 hover:bg-destructive/20 hover:text-destructive rounded-md transition-colors" title="Shut Down">
                                <Power className="w-4 h-4" />
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

const StartMenuItem = ({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick: () => void }) => (
    <button
        onClick={onClick}
        className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-white/10 transition-colors group"
    >
        <div className="p-2 rounded-md bg-white/5 group-hover:scale-110 transition-transform">
            {icon}
        </div>
        <span className="text-[10px] text-muted-foreground group-hover:text-primary transition-colors">{label}</span>
    </button>
);

export default StartMenu;
