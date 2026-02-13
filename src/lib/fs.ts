import { FileSystemItem } from '@/store/useDesktopStore';

export const resolvePath = (fs: FileSystemItem[], path: string): FileSystemItem | null => {
    if (path === '/') return { name: '/', type: 'folder', children: fs }; // specialized root handling if needed, or just assume fs is content of root

    // However, our store has `fs` as an array of items (like /home, /bin, etc at root level).
    // So "fs" IS the children of root.

    const parts = path.split('/').filter(Boolean);
    let current: FileSystemItem[] | undefined = fs;
    let target: FileSystemItem | null = null;

    for (let i = 0; i < parts.length; i++) {
        if (!current) return null;
        const part = parts[i];
        const found = current.find((item) => item.name === part);

        if (!found) return null;

        if (i === parts.length - 1) {
            target = found;
        } else {
            if (found.type !== 'folder') return null;
            current = found.children;
        }
    }

    return target;
};

export const getDirectoryContents = (fs: FileSystemItem[], path: string): FileSystemItem[] | null => {
    if (path === '/' || path === '') return fs;

    const item = resolvePath(fs, path);
    if (item && item.type === 'folder') {
        return item.children || [];
    }
    return null;
};

export const formatPath = (parts: string[]) => {
    return '/' + parts.join('/');
};
