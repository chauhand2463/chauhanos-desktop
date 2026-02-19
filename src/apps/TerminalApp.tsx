import { useState, useRef, useEffect } from 'react';
import { useDesktopStore } from '@/store/useDesktopStore';
import { getDirectoryContents, resolvePath, formatPath } from '@/lib/fs';

const COMMANDS: Record<string, string> = {
  help: `Available commands:
  help      - Show this help message
  ls        - List directory contents
  cd [path] - Change directory
  cat [file]- Display file content
  pwd       - Print working directory
  clear     - Clear terminal
  whoami    - Display user info
  neofetch  - System info
  date      - Show current date
  echo      - Echo a message
  open      - Open an application
  
  Portfolio Commands:
  experience - Show work history
  projects   - Show project list
  skills     - Show technical skills
  contact    - Show contact details`,

  whoami: '> dhairy_chauhan (admin)',

  neofetch: `
  \x1b[1;36m       .---.        \x1b[0m   \x1b[1;36mUser:\x1b[0m    Dhairy Chauhan
  \x1b[1;36m      /     \\       \x1b[0m   \x1b[1;36mOS:\x1b[0m      ChauhanOS v2.4 (Custom)
  \x1b[1;36m     | () () |      \x1b[0m   \x1b[1;36mKernel:\x1b[0m  Web Runtime (V8)
  \x1b[1;36m      \\  ^  /       \x1b[0m   \x1b[1;36mShell:\x1b[0m   React Bash v4
  \x1b[1;36m       |||||        \x1b[0m   \x1b[1;36mUptime:\x1b[0m  Infinity
  \x1b[1;36m       '---'        \x1b[0m   \x1b[1;36mUni:\x1b[0m     Charotar University (CSPIT)`,

  experience: `
  \x1b[1;35mFull Stack Developer\x1b[0m @ Independent (2024 - Present)
  - Focused on Web3 architectures and AI integrations.
  - Built ChauhanOS - a premium web-based terminal OS.

  \x1b[1;35mComputer Engineering Student\x1b[0m @ CSPIT, CHARUSAT
  - Deep diving into core engineering principles and software architecture.`,

  skills: `
  \x1b[1;32mStack:\x1b[0m     Full Stack Development, React, Node.js, Python
  \x1b[1;32mAdvanced:\x1b[0m  Web3, AI Interfacing, Smart Contracts
  \x1b[1;32mSystems:\x1b[0m   Docker, Git, Linux, Cloud Deployments`,

  contact: `
  \x1b[1;33mEmail:\x1b[0m     dkc074837@gmail.com
  \x1b[1;33mMobile:\x1b[0m    +919428280245
  \x1b[1;33mGitHub:\x1b[0m    github.com/chauhand2463`,

  projects: `
  1. \x1b[1;34mChauhanOS\x1b[0m - Premium portfolio OS
  2. \x1b[1;34mHolo-Matrix\x1b[0m - 3D visual engine
  3. \x1b[1;34mNexus AI\x1b[0m - LLM collaboration agent
  4. \x1b[1;34mQuantum Ledger\x1b[0m - DeFi tracker`,
};

interface TerminalLine {
  type: 'input' | 'output';
  text: string;
}

const TerminalApp = () => {
  const { fileSystem, openApp } = useDesktopStore();
  const [lines, setLines] = useState<TerminalLine[]>([
    { type: 'output', text: 'ChauhanOS Terminal v2.0' },
    { type: 'output', text: 'Type "help" for available commands.\n' },
  ]);
  const [input, setInput] = useState('');
  const [currentPath, setCurrentPath] = useState('/home/user');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [lines]);

  const processCommand = (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    const parts = trimmed.split(' ');
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    if (command === 'clear') {
      setLines([]);
      return;
    }

    if (command === 'pwd') {
      return currentPath;
    }

    if (command === 'ls') {
      const targetPath = args[0]
        ? (args[0].startsWith('/') ? args[0] : `${currentPath === '/' ? '' : currentPath}/${args[0]}`)
        : currentPath;

      const contents = getDirectoryContents(fileSystem, targetPath);

      if (!contents) {
        return `ls: cannot access '${args[0] || ''}': No such file or directory`;
      }

      if (contents.length === 0) return '(empty)';

      return contents.map(item => {
        if (item.type === 'folder') return `\x1b[1;34m${item.name}/\x1b[0m`;
        return item.name;
      }).join('  ');
    }

    if (command === 'cd') {
      if (!args[0]) {
        setCurrentPath('/home/user');
        return;
      }

      if (args[0] === '..') {
        if (currentPath === '/') return;
        const parts = currentPath.split('/').filter(Boolean);
        parts.pop();
        setCurrentPath(parts.length === 0 ? '/' : '/' + parts.join('/'));
        return;
      }

      const targetPath = args[0].startsWith('/')
        ? args[0]
        : `${currentPath === '/' ? '' : currentPath}/${args[0]}`;

      const item = resolvePath(fileSystem, targetPath);

      if (item && item.type === 'folder') {
        setCurrentPath(targetPath);
      } else {
        return `cd: ${args[0]}: No such file or directory`;
      }
      return;
    }

    if (command === 'cat') {
      if (!args[0]) return 'cat: missing file operand';

      const targetPath = args[0].startsWith('/')
        ? args[0]
        : `${currentPath === '/' ? '' : currentPath}/${args[0]}`;

      const item = resolvePath(fileSystem, targetPath);

      if (item && item.type === 'file') {
        return item.content || '';
      } else if (item && item.type === 'folder') {
        return `cat: ${args[0]}: Is a directory`;
      } else {
        return `cat: ${args[0]}: No such file or directory`;
      }
    }

    if (command === 'echo') {
      return args.join(' ');
    }

    if (command === 'open') {
      if (!args[0]) return 'open: missing application name';
      const app = args[0].toLowerCase();
      if (['projects', 'skills', 'contact', 'resume', 'about', 'terminal'].includes(app)) {
        openApp(app as any);
        return `Opening ${app}...`;
      }
      return `open: application '${app}' not found`;
    }

    // Fallback to static commands or unknown
    if (COMMANDS[command]) return COMMANDS[command];

    return `> Command not found: "${command}". Type "help" for available commands.`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const output = processCommand(input);

    setLines((prev) => [
      ...prev,
      { type: 'input', text: `dk@chauhan-os:${currentPath}$ ${input}` },
      ...(output !== undefined ? [{ type: 'output' as const, text: output }] : []),
    ]);
    setHistory((prev) => [input, ...prev]);
    setHistoryIndex(-1);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < history.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setInput(history[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(history[newIndex]);
      } else {
        setHistoryIndex(-1);
        setInput('');
      }
    }
  };

  return (
    <div
      className="h-full flex flex-col bg-background/50 rounded -m-4 p-3 cursor-text"
      onClick={() => inputRef.current?.focus()}
    >
      <div ref={scrollRef} className="flex-1 overflow-auto space-y-0.5 font-mono text-xs">
        {lines.map((line, i) => {
          if (line.type === 'input') {
            return (
              <div key={i} className="text-primary">
                {line.text}
              </div>
            );
          }

          // Simple ANSI to React formatter
          const parts = line.text.split(/(\x1b\[[0-9;]*m)/);
          let currentColor = 'text-secondary-foreground';

          return (
            <div key={i} className="whitespace-pre-wrap leading-relaxed">
              {parts.map((part, j) => {
                const match = part.match(/\x1b\[([0-9;]*)m/);
                if (match) {
                  const code = match[1];
                  if (code === '0') currentColor = 'text-secondary-foreground';
                  else if (code.includes('31')) currentColor = 'text-red-400';
                  else if (code.includes('32')) currentColor = 'text-green-400';
                  else if (code.includes('33')) currentColor = 'text-yellow-400';
                  else if (code.includes('34')) currentColor = 'text-blue-400';
                  else if (code.includes('35')) currentColor = 'text-purple-400';
                  else if (code.includes('36')) currentColor = 'text-cyan-400';
                  return null;
                }
                return <span key={j} className={currentColor}>{part}</span>;
              })}
            </div>
          );
        })}
      </div>

      <form onSubmit={handleSubmit} className="flex items-center gap-1 mt-2 font-mono text-xs">
        <span className="text-primary shrink-0">dk@chauhan-os:{currentPath === '/home/user' ? '~' : currentPath}$</span>
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent outline-none text-foreground caret-primary"
          autoFocus
          spellCheck={false}
        />
      </form>
    </div>
  );
};

export default TerminalApp;
