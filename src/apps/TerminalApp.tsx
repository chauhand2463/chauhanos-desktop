import { useState, useRef, useEffect } from 'react';
import { useDesktopStore } from '@/store/useDesktopStore';

const COMMANDS: Record<string, string> = {
  help: `Available commands:
  help      - Show this help message
  about     - About Dk Chauhan
  projects  - Open Projects app
  skills    - Open Skills Monitor
  contact   - Open Mail Client
  resume    - Open Resume Viewer
  clear     - Clear terminal
  whoami    - Display user info
  neofetch  - System info
  date      - Show current date
  echo      - Echo a message
  sudo      - Try it ;)
  matrix    - ???`,

  about: `> Dk Chauhan
  Role: Frontend Developer
  Stack: React, TypeScript, Tailwind
  Status: 🟢 Online & Building
  Mission: Creating memorable web experiences.`,

  whoami: '> dk_chauhan (admin)',

  neofetch: `
  ╔══════════════════════════════╗
  ║       ChauhanOS v2.0        ║
  ╠══════════════════════════════╣
  ║  User:    Dk Chauhan        ║
  ║  Shell:   TypeScript 5.x    ║
  ║  Kernel:  React 18.3        ║
  ║  UI:      Tailwind CSS      ║
  ║  Uptime:  Always coding     ║
  ╚══════════════════════════════╝`,

  sudo: '> Nice try! 😏 You need root access for that.',

  matrix: '> Wake up, Dk... The Matrix has you... Follow the white rabbit. 🐇',

  date: `> ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`,
};

interface TerminalLine {
  type: 'input' | 'output';
  text: string;
}

const TerminalApp = () => {
  const [lines, setLines] = useState<TerminalLine[]>([
    { type: 'output', text: 'ChauhanOS Terminal v2.0' },
    { type: 'output', text: 'Type "help" for available commands.\n' },
  ]);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { openApp } = useDesktopStore();

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [lines]);

  const processCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    const parts = trimmed.split(' ');
    const command = parts[0];

    if (command === 'clear') {
      setLines([]);
      return;
    }

    if (command === 'echo') {
      return parts.slice(1).join(' ') || '';
    }

    if (['projects', 'skills', 'contact', 'resume'].includes(command)) {
      openApp(command as any);
      return `> Opening ${command}...`;
    }

    if (command === 'about') {
      openApp('about');
      return COMMANDS.about;
    }

    if (COMMANDS[command]) return COMMANDS[command];

    return `> Command not found: "${command}". Type "help" for available commands.`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const output = processCommand(input);
    setLines((prev) => [
      ...prev,
      { type: 'input', text: `dk@chauhan-os:~$ ${input}` },
      ...(output ? [{ type: 'output' as const, text: output }] : []),
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
        <span className="text-primary shrink-0">dk@chauhan-os:~$</span>
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
