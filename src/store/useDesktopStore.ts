import { create } from 'zustand';

export type AppId = 'about' | 'projects' | 'skills' | 'terminal' | 'contact' | 'resume' | 'browser' | 'settings' | 'github';

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
  parent?: FileSystemItem | null; // creating circular references in valid JSON state is tricky with Zustand/Immer, so maybe avoid parent pointers in the store state and handle traversal differently, or just use paths.
}

// Simplified FS for the store (using paths as keys might be easier, or just a recursive tree)
// Let's go with a recursive tree for now.

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
          { name: 'skills.txt', type: 'file', content: 'React, TypeScript, Node.js, Python...' },
          { name: 'about.md', type: 'file', content: '# About Me\n\nI am a developer...' },
          { name: 'contact.txt', type: 'file', content: 'Email: example@example.com' },
        ],
      },
    ],
  },
];

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
  settings: {
    wallpaper: string;
    darkMode: boolean;
  };
  setWallpaper: (url: string) => void;
  toggleDarkMode: () => void;
}

const APP_DEFAULTS: Record<AppId, { title: string; icon: string; size: { width: number; height: number } }> = {
  about: { title: 'System Info', icon: '🧑', size: { width: 500, height: 400 } },
  projects: { title: 'File Explorer', icon: '📂', size: { width: 800, height: 600 } },
  skills: { title: 'Stats Monitor', icon: '🧠', size: { width: 500, height: 420 } },
  terminal: { title: 'Terminal', icon: '⌨️', size: { width: 600, height: 400 } },
  contact: { title: 'Mail Client', icon: '📧', size: { width: 480, height: 420 } },
  resume: { title: 'Resume Viewer', icon: '📄', size: { width: 550, height: 450 } },
  browser: { title: 'Web Browser', icon: '🌐', size: { width: 800, height: 500 } },
  settings: { title: 'Settings', icon: '⚙️', size: { width: 600, height: 450 } },
};

const getInitialPosition = (index: number) => ({
  x: 80 + (index % 3) * 40,
  y: 60 + (index % 3) * 30,
});

export const useDesktopStore = create<DesktopStore>((set) => ({
  windows: [],
  nextZIndex: 10,
  fileSystem: INITIAL_FILE_SYSTEM,
  settings: {
    wallpaper: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop', // Cyberpunk city
    darkMode: true,
  },

  setFileSystem: (newFs) => set({ fileSystem: newFs }),
  setWallpaper: (wallpaper) => set((state) => ({ settings: { ...state.settings, wallpaper } })),
  toggleDarkMode: () => set((state) => ({ settings: { ...state.settings, darkMode: !state.settings.darkMode } })),

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
}));
