import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Folder, FileText, ArrowLeft, Home, ChevronRight } from 'lucide-react';
import { useDesktopStore, FileSystemItem } from '@/store/useDesktopStore';
import { getDirectoryContents } from '@/lib/fs';

const FileExplorerApp = () => {
  const { fileSystem } = useDesktopStore();
  const [currentPath, setCurrentPath] = useState('/home/user');
  const [selectedItem, setSelectedItem] = useState<FileSystemItem | null>(null);

  const contents = useMemo(() => {
    return getDirectoryContents(fileSystem, currentPath);
  }, [fileSystem, currentPath]);

  const breadcrumbs = useMemo(() => {
    return currentPath.split('/').filter(Boolean);
  }, [currentPath]);

  const handleNavigate = (path: string) => {
    setCurrentPath(path);
    setSelectedItem(null);
  };

  const handleUp = () => {
    if (currentPath === '/' || currentPath === '') return;
    const parts = currentPath.split('/').filter(Boolean);
    parts.pop();
    setCurrentPath(parts.length === 0 ? '/' : '/' + parts.join('/'));
    setSelectedItem(null);
  };

  const handleItemClick = (item: FileSystemItem) => {
    if (item.type === 'folder') {
      const newPath = currentPath === '/' ? `/${item.name}` : `${currentPath}/${item.name}`;
      handleNavigate(newPath);
    } else {
      setSelectedItem(item);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background/50">
      {/* Navigation Bar */}
      <div className="flex items-center gap-2 p-2 border-b border-white/10 bg-white/5">
        <button
          onClick={handleUp}
          disabled={currentPath === '/'}
          className="p-1.5 rounded-md hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div className="flex-1 flex items-center gap-1 bg-black/20 rounded px-3 py-1.5 text-xs font-mono overflow-x-auto whitespace-nowrap">
          <button
            onClick={() => handleNavigate('/')}
            className="hover:text-primary transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
          </button>

          {breadcrumbs.map((part, index) => {
            const path = '/' + breadcrumbs.slice(0, index + 1).join('/');
            return (
              <div key={path} className="flex items-center gap-1">
                <ChevronRight className="w-3 h-3 text-muted-foreground" />
                <button
                  onClick={() => handleNavigate(path)}
                  className="hover:text-primary transition-colors"
                >
                  {part}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Main Content Area */}
        <div className="flex-1 overflow-auto p-4">
          {!contents ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              Directory not found
            </div>
          ) : contents.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
              Empty folder
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
              {contents.map((item) => (
                <motion.button
                  key={item.name}
                  onClick={() => handleItemClick(item)}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.05)' }}
                  whileTap={{ scale: 0.95 }}
                  className="flex flex-col items-center gap-2 p-3 rounded-lg transition-colors group text-center"
                >
                  <div className={`p-3 rounded-xl ${item.type === 'folder' ? 'bg-blue-500/20 text-blue-400' : 'bg-white/10 text-white/70'}`}>
                    {item.type === 'folder' ? (
                      <Folder className="w-8 h-8" />
                    ) : (
                      <FileText className="w-8 h-8" />
                    )}
                  </div>
                  <span className="text-xs font-medium text-white/90 truncate w-full group-hover:text-primary transition-colors">
                    {item.name}
                  </span>
                </motion.button>
              ))}
            </div>
          )}
        </div>

        {/* Preview Pane (Right Side) */}
        <AnimatePresence>
          {selectedItem && selectedItem.type === 'file' && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 250, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="border-l border-white/10 bg-black/20 overflow-hidden flex flex-col"
            >
              <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
                <span className="font-medium text-sm truncate">{selectedItem.name}</span>
                <button onClick={() => setSelectedItem(null)} className="text-muted-foreground hover:text-white">×</button>
              </div>
              <div className="p-4 flex-1 overflow-auto font-mono text-xs text-muted-foreground whitespace-pre-wrap">
                {selectedItem.content || '(No content)'}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default FileExplorerApp;
