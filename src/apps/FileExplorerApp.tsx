import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Folder, FileText, ArrowLeft, Home, ChevronRight, Github, Star, GitFork } from 'lucide-react';
import { useDesktopStore, FileSystemItem } from '@/store/useDesktopStore';
import { getDirectoryContents } from '@/lib/fs';

const FileExplorerApp = () => {
  const { fileSystem } = useDesktopStore();
  const [currentPath, setCurrentPath] = useState('/home/user');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [ghRepos, setGhRepos] = useState<any[]>([]);
  const [loadingGh, setLoadingGh] = useState(false);

  const contents = useMemo(() => {
    if (currentPath === '/home/user/projects') {
      return ghRepos.map(repo => ({
        name: repo.name,
        type: 'folder', // Treat repos as folders for now
        isGithubRepo: true,
        repoData: repo
      }));
    }
    return getDirectoryContents(fileSystem, currentPath);
  }, [fileSystem, currentPath, ghRepos]);

  useEffect(() => {
    if (currentPath === '/home/user/projects' && ghRepos.length === 0) {
      setLoadingGh(true);
      fetch('https://api.github.com/users/chauhand2463/repos?sort=updated&per_page=12')
        .then(res => res.json())
        .then(data => {
          setGhRepos(data);
          setLoadingGh(false);
        })
        .catch(() => setLoadingGh(false));
    }
  }, [currentPath, ghRepos.length]);

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

  const handleItemClick = (item: any) => {
    if (item.isGithubRepo) {
      setSelectedItem(item);
    } else if (item.type === 'folder') {
      const newPath = currentPath === '/' ? `/${item.name}` : `${currentPath}/${item.name}`;
      handleNavigate(newPath);
    } else {
      setSelectedItem(item);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background/50">
      {/* Navigation Bar */}
      <div className="flex items-center gap-2 p-2 border-b border-white/10 bg-white/5 shrink-0">
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
          {loadingGh ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-primary/40">
              <Github className="w-8 h-8 animate-spin" />
              <span className="text-[10px] font-mono uppercase tracking-widest">Fetching Repositories...</span>
            </div>
          ) : !contents ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              Directory not found
            </div>
          ) : contents.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
              Empty folder
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
              {contents.map((item: any) => (
                <motion.button
                  key={item.name}
                  onClick={() => handleItemClick(item)}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.05)' }}
                  whileTap={{ scale: 0.95 }}
                  className="flex flex-col items-center gap-2 p-3 rounded-lg transition-colors group text-center"
                >
                  <div className={`p-3 rounded-xl ${item.isGithubRepo ? 'bg-primary/20 text-primary shadow-neon-sm' :
                    item.type === 'folder' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-white/10 text-white/70'
                    }`}>
                    {item.isGithubRepo ? (
                      <Github className="w-8 h-8" />
                    ) : item.type === 'folder' ? (
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
          {selectedItem && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 280, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="border-l border-white/10 bg-black/40 overflow-hidden flex flex-col"
            >
              <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
                <span className="font-bold text-xs truncate uppercase tracking-widest text-primary">
                  {selectedItem.isGithubRepo ? 'Repository Data' : 'File Preview'}
                </span>
                <button onClick={() => setSelectedItem(null)} className="text-muted-foreground hover:text-white">×</button>
              </div>

              <div className="p-5 flex-1 overflow-auto space-y-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white truncate">{selectedItem.name}</h4>
                  {selectedItem.isGithubRepo && (
                    <p className="text-[10px] text-muted-foreground font-mono">ID: {selectedItem.repoData.id}</p>
                  )}
                </div>

                {selectedItem.isGithubRepo ? (
                  <div className="space-y-5">
                    <p className="text-xs text-muted-foreground leading-relaxed italic">
                      {selectedItem.repoData.description || "No description provided."}
                    </p>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-2 rounded bg-white/5 border border-white/10 flex flex-col items-center">
                        <Star className="w-3 h-3 text-yellow-500 mb-1" />
                        <span className="text-xs font-bold">{selectedItem.repoData.stargazers_count}</span>
                      </div>
                      <div className="p-2 rounded bg-white/5 border border-white/10 flex flex-col items-center">
                        <GitFork className="w-3 h-3 text-primary mb-1" />
                        <span className="text-xs font-bold">{selectedItem.repoData.forks_count}</span>
                      </div>
                    </div>

                    <div className="pt-2">
                      <a
                        href={selectedItem.repoData.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full py-2 bg-primary/20 hover:bg-primary/30 border border-primary/30 rounded-lg text-[10px] font-mono font-bold text-primary transition-all"
                      >
                        OPEN IN CLOUD <ArrowLeft className="w-3 h-3 rotate-180" />
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="font-mono text-[10px] text-muted-foreground whitespace-pre-wrap bg-black/20 p-3 rounded-lg border border-white/5">
                    {selectedItem.content || '(No content)'}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default FileExplorerApp;
