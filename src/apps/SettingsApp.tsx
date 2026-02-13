import { useDesktopStore } from '@/store/useDesktopStore';
import { Monitor, Moon, Sun, Image as ImageIcon } from 'lucide-react';

const WALLPAPERS = [
    { id: 'cyberpunk', url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop', label: 'Cyberpunk City' },
    { id: 'retro', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1964&auto=format&fit=crop', label: 'Abstract Waves' },
    { id: 'mountains', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop', label: 'Mountains' },
    { id: 'space', url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop', label: 'Deep Space' },
];

const SettingsApp = () => {
    const { settings, setWallpaper, toggleDarkMode } = useDesktopStore();

    return (
        <div className="p-6 space-y-8 h-full bg-background/50">
            {/* Theme Section */}
            <section className="space-y-3">
                <h3 className="flex items-center gap-2 text-sm font-bold text-primary border-b border-border pb-2">
                    <Monitor className="w-4 h-4" />
                    Display & Theme
                </h3>

                <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex items-center gap-3">
                        {settings.darkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                        <div>
                            <p className="text-sm font-medium">Dark Mode</p>
                            <p className="text-xs text-muted-foreground">Adjust system appearance</p>
                        </div>
                    </div>
                    <button
                        onClick={toggleDarkMode}
                        className={`w-12 h-6 rounded-full p-1 transition-colors ${settings.darkMode ? 'bg-primary' : 'bg-secondary'}`}
                    >
                        <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${settings.darkMode ? 'translate-x-6' : 'translate-x-0'}`} />
                    </button>
                </div>
            </section>

            {/* Wallpaper Section */}
            <section className="space-y-3">
                <h3 className="flex items-center gap-2 text-sm font-bold text-primary border-b border-border pb-2">
                    <ImageIcon className="w-4 h-4" />
                    Wallpaper
                </h3>

                <div className="grid grid-cols-2 gap-3">
                    {WALLPAPERS.map((wp) => (
                        <button
                            key={wp.id}
                            onClick={() => setWallpaper(wp.url)}
                            className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all group ${settings.wallpaper === wp.url ? 'border-primary shadow-neon-sm' : 'border-transparent hover:border-white/20'
                                }`}
                        >
                            <img src={wp.url} alt={wp.label} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-xs font-medium text-white">{wp.label}</span>
                            </div>
                        </button>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default SettingsApp;
