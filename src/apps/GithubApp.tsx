import { useState, useEffect } from 'react';
import { Github, Star, GitFork, Users, Book, ExternalLink, Calendar, Zap, Bookmark } from 'lucide-react';
import { motion } from 'framer-motion';

interface GithubProfile {
    login: string;
    avatar_url: string;
    html_url: string;
    name: string;
    bio: string;
    public_repos: number;
    followers: number;
    following: number;
    created_at: string;
}

interface GithubRepo {
    id: number;
    name: string;
    description: string;
    html_url: string;
    stargazers_count: number;
    forks_count: number;
    language: string;
}

const GithubApp = () => {
    const [profile, setProfile] = useState<GithubProfile | null>(null);
    const [repos, setRepos] = useState<GithubRepo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [profileRes, reposRes] = await Promise.all([
                    fetch('https://api.github.com/users/chauhand2463'),
                    fetch('https://api.github.com/users/chauhand2463/repos?sort=updated&per_page=6')
                ]);

                if (!profileRes.ok || !reposRes.ok) throw new Error('Failed to fetch GitHub data');

                const profileData = await profileRes.json();
                const reposData = await reposRes.json();

                setProfile(profileData);
                setRepos(reposData);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-primary/60">
                <Github className="w-12 h-12 animate-pulse" />
                <span className="font-mono text-xs animate-pulse tracking-widest uppercase">Initializing Secure Payload Stream...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-destructive">
                <div className="text-4xl">⚠️</div>
                <span className="font-mono text-sm uppercase tracking-widest">Protocol Failure: {error}</span>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full gap-6 overflow-y-auto no-scrollbar pb-6 px-1">
            {/* Profile Header */}
            {profile && (
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6 p-6 rounded-3xl bg-primary/5 border border-primary/10 shadow-[0_0_40px_rgba(0,0,0,0.3)] relative overflow-hidden group shrink-0">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Github className="w-32 h-32 rotate-12" />
                    </div>

                    <div className="relative z-10">
                        <img
                            src={profile.avatar_url}
                            alt={profile.login}
                            className="w-28 h-28 rounded-2xl border-2 border-primary/30 shadow-arch group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute -bottom-2 -right-2 bg-primary p-2 rounded-xl border-2 border-background shadow-neon-sm">
                            <Star className="w-3.5 h-3.5 text-background fill-background" />
                        </div>
                    </div>

                    <div className="flex-1 text-center md:text-left space-y-3 relative z-10">
                        <div className="flex flex-col md:flex-row md:items-center gap-2">
                            <h2 className="text-3xl font-display font-black text-primary tracking-tight">{profile.name || profile.login}</h2>
                            <span className="text-[10px] font-mono text-primary/70 bg-primary/10 px-2 py-0.5 rounded-lg border border-primary/20 uppercase tracking-widest">@{profile.login}</span>
                        </div>
                        <p className="text-sm text-secondary-foreground leading-relaxed font-medium">
                            {profile.bio || "No bio available"}
                        </p>

                        <div className="flex flex-wrap justify-center md:justify-start gap-5 pt-1">
                            <div className="flex flex-col items-center md:items-start">
                                <span className="text-[10px] text-muted-foreground uppercase font-mono tracking-tighter">Network</span>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                    <Users className="w-3 h-3 text-primary" />
                                    <span className="text-sm font-bold text-secondary-foreground">{profile.followers}</span>
                                </div>
                            </div>
                            <div className="flex flex-col items-center md:items-start">
                                <span className="text-[10px] text-muted-foreground uppercase font-mono tracking-tighter">Payloads</span>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                    <Book className="w-3 h-3 text-primary" />
                                    <span className="text-sm font-bold text-secondary-foreground">{profile.public_repos}</span>
                                </div>
                            </div>
                            <div className="flex flex-col items-center md:items-start">
                                <span className="text-[10px] text-muted-foreground uppercase font-mono tracking-tighter">Activation</span>
                                <div className="flex items-center gap-1.5 mt-0.5 font-mono text-xs text-secondary-foreground">
                                    {new Date(profile.created_at).getFullYear()}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 z-10">
                        <a
                            href={profile.html_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-primary/20 hover:bg-primary/30 border border-primary/30 rounded-xl text-xs font-mono font-bold text-primary transition-all group/btn"
                        >
                            UPSTREAM <ExternalLink className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                        </a>
                    </div>
                </div>
            )}

            {/* Repositories Grid */}
            <div className="space-y-4">
                <h3 className="text-[10px] font-mono text-primary flex items-center gap-2 uppercase tracking-[0.4em] pl-1">
                    <Bookmark className="w-3.5 h-3.5" /> Deployed Modules
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {repos.map((repo, i) => (
                        <motion.a
                            key={repo.id}
                            href={repo.html_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + i * 0.08 }}
                            className="flex flex-col justify-between p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/40 hover:bg-primary/5 transition-all group overflow-hidden relative"
                        >
                            <div className="absolute top-0 left-0 w-1 h-0 group-hover:h-full bg-primary transition-all duration-300" />

                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Book className="w-4 h-4 text-primary/60" />
                                        <span className="text-sm font-bold text-secondary-foreground group-hover:text-primary transition-colors truncate">
                                            {repo.name}
                                        </span>
                                    </div>
                                    {repo.language && (
                                        <span className="text-[9px] px-2 py-0.5 rounded-lg bg-primary/10 border border-primary/20 text-primary uppercase font-mono tracking-tighter">
                                            {repo.language}
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed h-8">
                                    {repo.description || "Experimental module awaiting further documentation."}
                                </p>
                            </div>

                            <div className="flex items-center gap-5 mt-5">
                                <div className="flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground">
                                    <Star className="w-3 h-3 text-yellow-500/70" /> {repo.stargazers_count}
                                </div>
                                <div className="flex items-center gap-1.5 text-[10px] font-mono text-muted-foreground">
                                    <GitFork className="w-3 h-3 text-primary/70" /> {repo.forks_count}
                                </div>
                            </div>
                        </motion.a>
                    ))}
                </div>
            </div>

            {/* Footer Info */}
            <div className="flex items-center justify-between opacity-30 text-[8px] font-mono tracking-widest uppercase mt-4">
                <span>GITHUB_PROTOCOL_V3</span>
                <span>STREAMING_FROM_EDGE</span>
            </div>
        </div>
    );
};

export default GithubApp;
