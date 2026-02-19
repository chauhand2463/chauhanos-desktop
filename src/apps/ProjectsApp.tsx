import { motion } from 'framer-motion';
import { ExternalLink, Github, Code2, Layers, Cpu, Globe } from 'lucide-react';

interface Project {
    id: number;
    title: string;
    description: string;
    tech: string[];
    link?: string;
    github?: string;
    type: 'WEB' | 'SYSTEM' | 'AI' | 'MOBILE';
    image: string;
}

const PROJECTS: Project[] = [
    {
        id: 1,
        title: "ChauhanOS Desktop",
        description: "A premium, OS-style portfolio environment built with React and Framer Motion. Features a custom window manager, virtual file system, and interactive terminal.",
        tech: ["React", "TypeScript", "Tailwind CSS", "Zustand", "Framer Motion"],
        github: "https://github.com/chauhand2463/chauhanos-desktop",
        type: "WEB",
        image: "https://images.unsplash.com/photo-1614332287897-cdc485fa562d?q=80&w=2070&auto=format&fit=crop"
    },
    {
        id: 2,
        title: "Holo-Matrix Engine",
        description: "An experimental 3D visual engine for web-based data visualization. Uses WebGL and custom shaders for high-performance holographic effects.",
        tech: ["Three.js", "WebGL", "GLSL", "React Three Fiber"],
        github: "https://github.com/chauhand2463/holo-matrix",
        type: "SYSTEM",
        image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2070&auto=format&fit=crop"
    },
    {
        id: 3,
        title: "Nexus AI Interface",
        description: "A collaborative AI interface allowing multiple LLMs to interact within a shared canvas. Features real-time state synchronization and voice control.",
        tech: ["Next.js", "Supabase", "OpenAI API", "Socket.io"],
        link: "https://nexus-ai-demo.com",
        github: "https://github.com/chauhand2463/nexus-ai",
        type: "AI",
        image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2070&auto=format&fit=crop"
    },
    {
        id: 4,
        title: "Quantum Ledger",
        description: "A decentralized finance tracker for multi-chain assets. Provides real-time market analysis and portfolio optimization using genetic algorithms.",
        tech: ["Python", "Rust", "React", "Ethers.js"],
        github: "https://github.com/chauhand2463/quantum-ledger",
        type: "WEB",
        image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2070&auto=format&fit=crop"
    }
];

const ProjectsApp = () => {
    return (
        <div className="flex flex-col h-full gap-8 overflow-y-auto no-scrollbar pb-8 px-1">
            {/* Header section */}
            <div className="flex flex-col gap-2 relative p-6 rounded-3xl bg-primary/5 border border-primary/10 overflow-hidden shrink-0">
                <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                    <Layers className="w-32 h-32" />
                </div>
                <h2 className="text-3xl font-display font-black text-primary tracking-tight">Deployed Projects</h2>
                <p className="text-sm text-secondary-foreground max-w-lg leading-relaxed font-medium">
                    A collection of experimental systems, architectural prototypes, and visual explorations.
                </p>
                <div className="flex gap-4 mt-2">
                    <span className="text-[10px] font-mono text-primary/70 bg-primary/10 px-2 py-0.5 rounded-lg border border-primary/20 uppercase tracking-widest flex items-center gap-1.5">
                        <Cpu className="w-3 h-3" /> System: Stable
                    </span>
                    <span className="text-[10px] font-mono text-primary/70 bg-primary/10 px-2 py-0.5 rounded-lg border border-primary/20 uppercase tracking-widest flex items-center gap-1.5">
                        <Globe className="w-3 h-3" /> Network: Online
                    </span>
                </div>
            </div>

            {/* Grid of Projects */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {PROJECTS.map((project, i) => (
                    <motion.div
                        key={project.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="group relative flex flex-col glass border border-white/10 hover:border-primary/40 rounded-3xl overflow-hidden transition-all duration-500"
                    >
                        {/* Image area */}
                        <div className="relative h-48 overflow-hidden">
                            <img
                                src={project.image}
                                alt={project.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-60" />
                            <div className="absolute top-4 left-4">
                                <span className="text-[9px] px-2 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-white font-mono uppercase tracking-widest font-bold">
                                    {project.type}
                                </span>
                            </div>
                        </div>

                        {/* Content area */}
                        <div className="p-6 flex-1 flex flex-col gap-4">
                            <div className="space-y-2">
                                <h3 className="text-xl font-display font-bold text-white group-hover:text-primary transition-colors">
                                    {project.title}
                                </h3>
                                <p className="text-xs text-muted-foreground leading-relaxed h-12 overflow-hidden">
                                    {project.description}
                                </p>
                            </div>

                            {/* Tech stack */}
                            <div className="flex flex-wrap gap-2">
                                {project.tech.map((t) => (
                                    <span key={t} className="text-[9px] font-mono text-secondary-foreground bg-secondary/50 px-2 py-0.5 rounded border border-white/5">
                                        {t}
                                    </span>
                                ))}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-3 mt-auto pt-4 border-t border-white/5">
                                {project.github && (
                                    <a
                                        href={project.github}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        <Github className="w-3.5 h-3.5" /> SOURCE
                                    </a>
                                )}
                                {project.link && (
                                    <a
                                        href={project.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        <ExternalLink className="w-3.5 h-3.5" /> DEPLOY
                                    </a>
                                )}
                                <div className="ml-auto">
                                    <Code2 className="w-4 h-4 text-primary/20 group-hover:text-primary/60 transition-colors" />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between opacity-30 text-[8px] font-mono tracking-widest uppercase mt-4">
                <span>PROJECT_REGISTRY_V2.4</span>
                <span>AUTH_VERIFIED</span>
            </div>
        </div>
    );
};

export default ProjectsApp;
