import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type AppId = 'about' | 'projects' | 'skills' | 'terminal' | 'contact' | 'resume' | 'browser' | 'settings' | 'github' | 'achievements';

export interface WindowState {
  id: AppId;
  title: string;
  icon: string;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

export interface FileSystemItem {
  name: string;
  type: 'file' | 'folder';
  content?: string;
  children?: FileSystemItem[];
}

export const INITIAL_FILE_SYSTEM: FileSystemItem[] = [
  {
    name: 'home',
    type: 'folder',
    children: [
      {
        name: 'user',
        type: 'folder',
        children: [
          { name: 'projects', type: 'folder', children: [] },
          { name: 'skills.txt', type: 'file', content: 'Full Stack Development, Web3, AI, React, TypeScript, Node.js, Python...' },
          { name: 'about.md', type: 'file', content: '# About Me\n\nI am a Computer Engineering student at Charotar University (CSPIT). I specialize in Full Stack Development with a strong interest in Web3 and AI.' },
          { name: 'contact.txt', type: 'file', content: 'Email: dkc074837@gmail.com\nMobile: +919428280245' },
        ],
      },
    ],
  },
];

interface DesktopSettings {
  wallpaper: string;
  darkMode: boolean;
  primaryColor: string; // HSL format like "185 100% 50%"
  animationIntensity: number; // 0 to 1
  isEffectsEnabled: boolean;
  glassOpacity: number; // 0 to 1
  bootLogs: string[];
  isLocked: boolean;
}

interface DesktopStore {
  windows: WindowState[];
  nextZIndex: number;
  openApp: (id: AppId) => void;
  closeApp: (id: AppId) => void;
  minimizeApp: (id: AppId) => void;
  maximizeApp: (id: AppId) => void;
  focusApp: (id: AppId) => void;
  updatePosition: (id: AppId, position: { x: number; y: number }) => void;

  // File System
  fileSystem: FileSystemItem[];
  setFileSystem: (fs: FileSystemItem[]) => void;

  // Settings
  settings: DesktopSettings;
  updateSettings: (settings: Partial<DesktopSettings>) => void;
  resetSettings: () => void;

  // Config Actions
  exportConfig: () => string;
  importConfig: (configJson: string) => boolean;

  // Lock Actions
  lockScreen: () => void;
  unlockScreen: () => void;
}

const DEFAULT_SETTINGS: DesktopSettings = {
  wallpaper: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop',
  darkMode: true,
  primaryColor: '185 100% 50%',
  animationIntensity: 1,
  isEffectsEnabled: true,
  glassOpacity: 0.85,
  bootLogs: [
    "GPU: NVIDIA RTX 5090 Ti - 32GB VRAM",
    "VULKAN: VK_LAYER_CHAUHAN_OVERLAY detected",
  ],
  isLocked: true,
};

const APP_DEFAULTS: Record<AppId, { title: string; icon: string; size: { width: number; height: number } }> = {
  about: { title: 'System Info', icon: '🧑', size: { width: 500, height: 400 } },
  projects: { title: 'File Explorer', icon: '📂', size: { width: 800, height: 600 } },
  skills: { title: 'Stats Monitor', icon: '🧠', size: { width: 500, height: 420 } },
  terminal: { title: 'Terminal', icon: '⌨️', size: { width: 600, height: 400 } },
  contact: { title: 'Mail Client', icon: '📧', size: { width: 480, height: 420 } },
  resume: { title: 'Resume Viewer', icon: '📄', size: { width: 550, height: 450 } },
  browser: { title: 'Web Browser', icon: '🌐', size: { width: 800, height: 500 } },
  settings: { title: 'Settings', icon: '⚙️', size: { width: 600, height: 450 } },
  github: { title: 'GitHub Explorer', icon: '🐙', size: { width: 800, height: 600 } },
  achievements: { title: 'Achievements', icon: '🏆', size: { width: 600, height: 400 } },
};

const getInitialPosition = (index: number) => ({
  x: 80 + (index % 3) * 40,
  y: 60 + (index % 3) * 30,
});

export const useDesktopStore = create<DesktopStore>()(
  persist(
    (set, get) => ({
      windows: [],
      nextZIndex: 10,
      fileSystem: INITIAL_FILE_SYSTEM,
      settings: DEFAULT_SETTINGS,

      setFileSystem: (newFs) => set({ fileSystem: newFs }),

      updateSettings: (newSettings) => set((state) => ({
        settings: { ...state.settings, ...newSettings }
      })),

      resetSettings: () => set({ settings: DEFAULT_SETTINGS }),

      openApp: (id) =>
        set((state) => {
          const existing = state.windows.find((w) => w.id === id);
          if (existing) {
            return {
              windows: state.windows.map((w) =>
                w.id === id ? { ...w, isMinimized: false, zIndex: state.nextZIndex } : w
              ),
              nextZIndex: state.nextZIndex + 1,
            };
          }
          const defaults = APP_DEFAULTS[id];
          const newWindow: WindowState = {
            id,
            title: defaults.title,
            icon: defaults.icon,
            isMinimized: false,
            isMaximized: false,
            zIndex: state.nextZIndex,
            position: getInitialPosition(state.windows.length),
            size: defaults.size,
          };
          return {
            windows: [...state.windows, newWindow],
            nextZIndex: state.nextZIndex + 1,
          };
        }),

      closeApp: (id) =>
        set((state) => ({
          windows: state.windows.filter((w) => w.id !== id),
        })),

      minimizeApp: (id) =>
        set((state) => ({
          windows: state.windows.map((w) =>
            w.id === id ? { ...w, isMinimized: true } : w
          ),
        })),

      maximizeApp: (id) =>
        set((state) => ({
          windows: state.windows.map((w) =>
            w.id === id ? { ...w, isMaximized: !w.isMaximized, zIndex: state.nextZIndex } : w
          ),
          nextZIndex: state.nextZIndex + 1,
        })),

      focusApp: (id) =>
        set((state) => ({
          windows: state.windows.map((w) =>
            w.id === id ? { ...w, zIndex: state.nextZIndex } : w
          ),
          nextZIndex: state.nextZIndex + 1,
        })),

      updatePosition: (id, position) =>
        set((state) => ({
          windows: state.windows.map((w) =>
            w.id === id ? { ...w, position } : w
          ),
        })),

      exportConfig: () => {
        return JSON.stringify(get().settings, null, 2);
      },

      importConfig: (configJson) => {
        try {
          const config = JSON.parse(configJson);
          set({ settings: { ...DEFAULT_SETTINGS, ...config } });
          return true;
        } catch (e) {
          console.error('Failed to import config:', e);
          return false;
        }
      },

      lockScreen: () => set((state) => ({ settings: { ...state.settings, isLocked: true } })),
      unlockScreen: () => set((state) => ({ settings: { ...state.settings, isLocked: false } })),
    }),
    {
      name: 'chauhanos-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ settings: state.settings, fileSystem: state.fileSystem }),
    }
  )
);
