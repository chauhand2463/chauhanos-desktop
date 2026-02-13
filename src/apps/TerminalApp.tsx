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
  open      - Open an application`,

  whoami: '> dk_chauhan (admin)',

  neofetch: `
  ╔══════════════════════════════╗
  ║       ChauhanOS v2.0         ║
  ╠══════════════════════════════╣
  ║  User:    Dhairy Chauhan     ║
  ║  Shell:   React Term v2      ║
  ║  Kernel:  Web                ║
  ║  UI:      Tailwind CSS       ║
  ║  Uptime:  Always coding      ║
  ╚══════════════════════════════╝`,
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

    // Handle coloring for ls output and others if needed (basic simplified ansi strip or render)
    // For now, react renders strings. usage of \x1b is just meta-data here, simple rendering needed.
    // We can strip colors for now or implement a parser. Let's keep it simple text.

    const cleanOutput = output?.replace(/\x1b\[[0-9;]*m/g, '') || '';

    setLines((prev) => [
      ...prev,
      { type: 'input', text: `dk@chauhan-os:${currentPath}$ ${input}` },
      ...(output !== undefined ? [{ type: 'output' as const, text: cleanOutput }] : []),
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
        {lines.map((line, i) => (
          <div
            key={i}
            className={
              line.type === 'input'
                ? 'text-primary'
                : 'text-secondary-foreground whitespace-pre-wrap'
            }
          >
            {line.text}
          </div>
        ))}
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
