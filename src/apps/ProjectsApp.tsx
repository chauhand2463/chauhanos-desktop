import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Github, Folder, FolderOpen } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  description: string;
  tags: string[];
  github?: string;
  live?: string;
}

const PROJECTS: Project[] = [
  {
    id: '1',
    name: 'ChauhanOS Portfolio',
    description: 'An OS-themed interactive portfolio built with React, TypeScript, and Framer Motion. Features draggable windows, terminal, and cyberpunk aesthetics.',
    tags: ['React', 'TypeScript', 'Framer Motion'],
    github: '#',
    live: '#',
  },
  {
    id: '2',
    name: 'Project Alpha',
    description: 'A full-stack web application with authentication, real-time data, and responsive design.',
    tags: ['React', 'Node.js', 'Database'],
    github: '#',
  },
  {
    id: '3',
    name: 'Creative Dashboard',
    description: 'An analytics dashboard with interactive charts, dark mode, and data visualization.',
    tags: ['React', 'Charts', 'Tailwind'],
    live: '#',
  },
  {
    id: '4',
    name: 'CLI Tool',
    description: 'A command-line utility for automating development workflows and project scaffolding.',
    tags: ['Node.js', 'CLI', 'Automation'],
    github: '#',
  },
];

const ProjectsApp = () => {
  const [selected, setSelected] = useState<string | null>(null);
  const selectedProject = PROJECTS.find((p) => p.id === selected);

  return (
    <div className="flex h-full gap-3">
      {/* Sidebar */}
      <div className="w-40 shrink-0 border-r border-border pr-3 space-y-1">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Projects</p>
        {PROJECTS.map((project) => (
          <button
            key={project.id}
            onClick={() => setSelected(project.id)}
            className={`flex items-center gap-2 w-full text-left px-2 py-1.5 rounded text-xs font-mono transition-colors ${
              selected === project.id
                ? 'bg-primary/15 text-primary'
                : 'text-secondary-foreground hover:bg-secondary/50'
            }`}
          >
            {selected === project.id ? (
              <FolderOpen className="w-3.5 h-3.5" />
            ) : (
              <Folder className="w-3.5 h-3.5" />
            )}
            <span className="truncate">{project.name}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <AnimatePresence mode="wait">
          {selectedProject ? (
            <motion.div
              key={selectedProject.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              <h3 className="font-display text-base font-bold text-primary">{selectedProject.name}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{selectedProject.description}</p>
              <div className="flex flex-wrap gap-1.5">
                {selectedProject.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 text-[10px] rounded bg-primary/10 text-primary border border-primary/20 font-mono"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex gap-2 pt-2">
                {selectedProject.github && (
                  <a href={selectedProject.github} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors">
                    <Github className="w-3.5 h-3.5" /> GitHub
                  </a>
                )}
                {selectedProject.live && (
                  <a href={selectedProject.live} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors">
                    <ExternalLink className="w-3.5 h-3.5" /> Live Demo
                  </a>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center h-full text-xs text-muted-foreground"
            >
              Select a project to view details
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProjectsApp;
