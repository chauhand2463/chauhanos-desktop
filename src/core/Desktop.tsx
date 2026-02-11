import { AnimatePresence, motion } from 'framer-motion';
import { useDesktopStore, type AppId } from '@/store/useDesktopStore';
import DesktopIcon from '@/components/DesktopIcon';
import Window from '@/components/Window';
import Taskbar from '@/core/Taskbar';
import AboutApp from '@/apps/AboutApp';
import ProjectsApp from '@/apps/ProjectsApp';
import SkillsApp from '@/apps/SkillsApp';
import TerminalApp from '@/apps/TerminalApp';
import ContactApp from '@/apps/ContactApp';
import ResumeApp from '@/apps/ResumeApp';

const DESKTOP_ICONS: { id: AppId; icon: string; label: string }[] = [
  { id: 'about', icon: '🧑', label: 'System Info' },
  { id: 'projects', icon: '💻', label: 'Projects' },
  { id: 'skills', icon: '🧠', label: 'Skills' },
  { id: 'terminal', icon: '⌨️', label: 'Terminal' },
  { id: 'contact', icon: '📧', label: 'Contact' },
  { id: 'resume', icon: '📄', label: 'Resume' },
];

const APP_COMPONENTS: Record<AppId, React.ComponentType> = {
  about: AboutApp,
  projects: ProjectsApp,
  skills: SkillsApp,
  terminal: TerminalApp,
  contact: ContactApp,
  resume: ResumeApp,
};

const Desktop = () => {
  const { windows, openApp } = useDesktopStore();

  return (
    <div className="fixed inset-0 bg-background desktop-grid overflow-hidden">
      {/* Scanline overlay */}
      <div className="fixed inset-0 scanline z-[998] pointer-events-none" />

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
