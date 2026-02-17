import { AnimatePresence, motion } from 'framer-motion';
import { useDesktopStore, type AppId } from '@/store/useDesktopStore';
import DesktopIcon from '@/components/DesktopIcon';
import Window from '@/components/Window';
import Taskbar from '@/core/Taskbar';
import AboutApp from '@/apps/AboutApp';
import FileExplorerApp from '@/apps/FileExplorerApp';
import SkillsApp from '@/apps/SkillsApp';
import TerminalApp from '@/apps/TerminalApp';
import ContactApp from '@/apps/ContactApp';
import ResumeApp from '@/apps/ResumeApp';
import BrowserApp from '@/apps/BrowserApp';
import SettingsApp from '@/apps/SettingsApp';
import GithubApp from '@/apps/GithubApp';
import AchievementsApp from '@/apps/AchievementsApp';
import ParticleBackground from '@/components/ParticleBackground';

const DESKTOP_ICONS: { id: AppId; icon: string; label: string }[] = [
  { id: 'about', icon: '🧑', label: 'System Info' },
  { id: 'projects', icon: '📂', label: 'Files' },
  { id: 'skills', icon: '🧠', label: 'Skills' },
  { id: 'terminal', icon: '⌨️', label: 'Terminal' },
  { id: 'browser', icon: '🌐', label: 'Browser' },
  { id: 'contact', icon: '📧', label: 'Contact' },
  { id: 'resume', icon: '📄', label: 'Resume' },
  { id: 'github', icon: '🐙', label: 'GitHub' },
  { id: 'settings', icon: '⚙️', label: 'Settings' },
];

const APP_COMPONENTS: Record<AppId, React.ComponentType> = {
  about: AboutApp,
  projects: FileExplorerApp,
  skills: SkillsApp,
  terminal: TerminalApp,
  contact: ContactApp,
  resume: ResumeApp,
  browser: BrowserApp,
  github: GithubApp,
  settings: SettingsApp,
  achievements: AchievementsApp,
};

const Desktop = () => {
  const { windows, openApp, settings } = useDesktopStore();

  return (
    <div
      className="fixed inset-0 bg-background overflow-hidden bg-cover bg-center bg-no-repeat transition-all duration-500"
      style={{ backgroundImage: `url(${settings.wallpaper})` }}
    >
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 desktop-grid opacity-50 pointer-events-none" />

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/30 pointer-events-none" />

      {/* Dynamic Background Effects */}
      <ParticleBackground />

      {/* Scanline overlay */}
      <div className="fixed inset-0 scanline z-[998] pointer-events-none opacity-50" />

      {/* Desktop icons */}
      <motion.div
        className="absolute top-4 left-4 flex flex-col gap-1 z-[5]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        {DESKTOP_ICONS.map((app, i) => (
          <motion.div
            key={app.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.08 }}
          >
            <DesktopIcon
              id={app.id}
              icon={app.icon}
              label={app.label}
              onClick={() => openApp(app.id)}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Windows */}
      <AnimatePresence>
        {windows.map((win) => {
          const AppComponent = APP_COMPONENTS[win.id];
          return (
            <Window key={win.id} {...win}>
              <AppComponent />
            </Window>
          );
        })}
      </AnimatePresence>

      {/* Taskbar */}
      <Taskbar />
    </div>
  );
};

export default Desktop;
