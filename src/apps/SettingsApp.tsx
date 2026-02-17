import { useDesktopStore } from '@/store/useDesktopStore';
import { Monitor, Moon, Sun, Image as ImageIcon, Palette, Zap, Layers, Share2, Download, Upload, RotateCcw } from 'lucide-react';

const WALLPAPERS = [
    { id: 'cyberpunk', url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop', label: 'Cyberpunk City' },
    { id: 'retro', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1964&auto=format&fit=crop', label: 'Abstract Waves' },
    { id: 'mountains', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop', label: 'Mountains' },
    { id: 'space', url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop', label: 'Deep Space' },
    { id: 'matrix', url: 'https://images.unsplash.com/photo-1550645612-83f5d594b671?q=80&w=2070&auto=format&fit=crop', label: 'Neon Matrix' },
    { id: 'grid', url: 'https://images.unsplash.com/photo-1614850523296-32d87e0743b5?q=80&w=2070&auto=format&fit=crop', label: 'Retro Grid' },
];

const PRESET_COLORS = [
    { name: 'Cyber Cyan', hsl: '185 100% 50%' },
    { name: 'Matrix Green', hsl: '142 70% 50%' },
    { name: 'Synth Purple', hsl: '280 100% 60%' },
    { name: 'Magma Red', hsl: '0 80% 50%' },
    { name: 'Plasma Orange', hsl: '24 100% 50%' },
    { name: 'Ice Blue', hsl: '210 100% 70%' },
];

const SettingsApp = () => {
    const { settings, updateSettings, resetSettings, exportConfig, importConfig } = useDesktopStore();

    const handleImport = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/json';
        input.onchange = (e: any) => {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (event: any) => {
                if (importConfig(event.target.result)) {
                    alert('Configuration imported successfully!');
                } else {
                    alert('Invalid configuration file.');
                }
            };
            reader.readAsText(file);
        };
        input.click();
    };

    const handleExport = () => {
        const config = exportConfig();
        const blob = new Blob([config], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `chauhanos-config-${new Date().getTime()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="flex flex-col h-full bg-background/50 overflow-hidden">
            <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-10 pb-20">
                {/* Theme Section */}
                <section className="space-y-4">
                    <h3 className="flex items-center gap-2 text-[10px] font-mono font-black text-primary uppercase tracking-[0.3em] border-b border-white/5 pb-2">
                        <Monitor className="w-3.5 h-3.5" /> Appearance Protocol
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${settings.darkMode ? 'bg-primary/20 text-primary' : 'bg-yellow-500/20 text-yellow-500'}`}>
                                    {settings.darkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-white">Dark Mode</p>
                                    <p className="text-[9px] text-muted-foreground uppercase font-mono">System Aesthetics</p>
                                </div>
                            </div>
                            <button
                                onClick={() => updateSettings({ darkMode: !settings.darkMode })}
                                className={`w-10 h-5 rounded-full p-1 transition-colors ${settings.darkMode ? 'bg-primary' : 'bg-white/20'}`}
                            >
                                <div className={`w-3 h-3 rounded-full bg-white transition-transform ${settings.darkMode ? 'translate-x-5' : 'translate-x-0'}`} />
                            </button>
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${settings.isEffectsEnabled ? 'bg-primary/20 text-primary' : 'bg-white/10 text-white/40'}`}>
                                    <Zap className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-white">Visual Effects</p>
                                    <p className="text-[9px] text-muted-foreground uppercase font-mono">Neural Background</p>
                                </div>
                            </div>
                            <button
                                onClick={() => updateSettings({ isEffectsEnabled: !settings.isEffectsEnabled })}
                                className={`w-10 h-5 rounded-full p-1 transition-colors ${settings.isEffectsEnabled ? 'bg-primary' : 'bg-white/20'}`}
                            >
                                <div className={`w-3 h-3 rounded-full bg-white transition-transform ${settings.isEffectsEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
                            </button>
                        </div>
                    </div>
                </section>

                {/* Color Palette */}
                <section className="space-y-4">
                    <h3 className="flex items-center gap-2 text-[10px] font-mono font-black text-primary uppercase tracking-[0.3em] border-b border-white/5 pb-2">
                        <Palette className="w-3.5 h-3.5" /> Chromatic Matrix
                    </h3>

                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                        {PRESET_COLORS.map((color) => (
                            <button
                                key={color.name}
                                onClick={() => updateSettings({ primaryColor: color.hsl })}
                                className={`group flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all ${settings.primaryColor === color.hsl ? 'border-primary bg-primary/5 shadow-neon-sm' : 'border-transparent bg-white/5 hover:border-white/20'
                                    }`}
                            >
                                <div
                                    className="w-8 h-8 rounded-lg shadow-inner group-hover:scale-110 transition-transform"
                                    style={{ backgroundColor: `hsl(${color.hsl})` }}
                                />
                                <span className="text-[8px] font-mono uppercase text-muted-foreground group-hover:text-white transition-colors">
                                    {color.name.split(' ')[1]}
                                </span>
                            </button>
                        ))}
                    </div>
                </section>

                {/* Precision Controls */}
                <section className="space-y-6">
                    <h3 className="flex items-center gap-2 text-[10px] font-mono font-black text-primary uppercase tracking-[0.3em] border-b border-white/5 pb-2">
                        <Layers className="w-3.5 h-3.5" /> Precision Tuning
                    </h3>

                    <div className="space-y-8 px-2">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <label className="text-[10px] text-muted-foreground uppercase font-mono tracking-widest flex items-center gap-2">
                                    <Zap className="w-3 h-3" /> Animation Intensity
                                </label>
                                <span className="text-xs font-mono text-primary">{Math.round(settings.animationIntensity * 100)}%</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.1"
                                value={settings.animationIntensity}
                                onChange={(e) => updateSettings({ animationIntensity: parseFloat(e.target.value) })}
                                className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
                            />
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <label className="text-[10px] text-muted-foreground uppercase font-mono tracking-widest flex items-center gap-2">
                                    <Layers className="w-3.5 h-3.5" /> Glass Opacity
                                </label>
                                <span className="text-xs font-mono text-primary">{Math.round(settings.glassOpacity * 100)}%</span>
                            </div>
                            <input
                                type="range"
                                min="0.3"
                                max="0.95"
                                step="0.05"
                                value={settings.glassOpacity}
                                onChange={(e) => updateSettings({ glassOpacity: parseFloat(e.target.value) })}
                                className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
                            />
                        </div>
                    </div>
                </section>

                {/* Wallpaper Library */}
                <section className="space-y-4 pt-4">
                    <h3 className="flex items-center gap-2 text-[10px] font-mono font-black text-primary uppercase tracking-[0.3em] border-b border-white/5 pb-2">
                        <ImageIcon className="w-3.5 h-3.5" /> Visual Overlays
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                        {WALLPAPERS.map((wp) => (
                            <button
                                key={wp.id}
                                onClick={() => updateSettings({ wallpaper: wp.url })}
                                className={`relative aspect-video rounded-2xl overflow-hidden border-2 transition-all group ${settings.wallpaper === wp.url ? 'border-primary shadow-neon-sm' : 'border-transparent hover:border-white/20'
                                    }`}
                            >
                                <img src={wp.url} alt={wp.label} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]">
                                    <span className="text-[10px] font-mono font-bold text-white uppercase tracking-widest">{wp.label}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </section>
            </div>

            {/* Persistence Footer */}
            <div className="p-4 bg-black/40 border-t border-white/5 flex items-center justify-between gap-3 relative z-10 backdrop-blur-md">
                <button
                    onClick={resetSettings}
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-destructive/20 border border-white/10 hover:border-destructive/30 text-muted-foreground hover:text-destructive transition-all group lg:px-4"
                >
                    <div className="flex items-center gap-2">
                        <RotateCcw className="w-4 h-4 group-hover:rotate-[-90deg] transition-transform" />
                        <span className="text-[10px] font-mono font-bold uppercase tracking-widest hidden sm:inline">Reset System</span>
                    </div>
                </button>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handleImport}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
                    >
                        <Upload className="w-4 h-4 text-primary" />
                        <span className="text-[10px] font-mono font-bold uppercase tracking-widest hidden sm:inline text-white">Import</span>
                    </button>
                    <button
                        onClick={handleExport}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary/20 hover:bg-primary/30 border border-primary/30 text-primary transition-all shadow-neon-sm"
                    >
                        <Download className="w-4 h-4" />
                        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-primary">Export Config</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SettingsApp;
