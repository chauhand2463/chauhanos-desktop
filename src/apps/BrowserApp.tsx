import { useState } from 'react';
import { ArrowLeft, ArrowRight, RotateCcw, X } from 'lucide-react';

const BrowserApp = () => {
    const [url, setUrl] = useState('https://github.com/dkchauhan');
    const [inputValue, setInputValue] = useState('https://github.com/dkchauhan');
    const [history, setHistory] = useState<string[]>(['https://github.com/dkchauhan']);
    const [historyIndex, setHistoryIndex] = useState(0);

    const handleNavigate = (e: React.FormEvent) => {
        e.preventDefault();
        let newUrl = inputValue;
        if (!newUrl.startsWith('http')) {
            newUrl = 'https://' + newUrl;
        }
        setUrl(newUrl);
        const newHistory = [...history.slice(0, historyIndex + 1), newUrl];
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
    };

    const goBack = () => {
        if (historyIndex > 0) {
            const newIndex = historyIndex - 1;
            setHistoryIndex(newIndex);
            setUrl(history[newIndex]);
            setInputValue(history[newIndex]);
        }
    };

    const goForward = () => {
        if (historyIndex < history.length - 1) {
            const newIndex = historyIndex + 1;
            setHistoryIndex(newIndex);
            setUrl(history[newIndex]);
            setInputValue(history[newIndex]);
        }
    };

    return (
        <div className="flex flex-col h-full bg-background/50">
            {/* Browser Toolbar */}
            <div className="flex items-center gap-2 p-2 border-b border-white/10 bg-white/5">
                <div className="flex items-center gap-1">
                    <button onClick={goBack} disabled={historyIndex === 0} className="p-1.5 rounded-md hover:bg-white/10 disabled:opacity-30 transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                    </button>
                    <button onClick={goForward} disabled={historyIndex === history.length - 1} className="p-1.5 rounded-md hover:bg-white/10 disabled:opacity-30 transition-colors">
                        <ArrowRight className="w-4 h-4" />
                    </button>
                    <button onClick={() => setUrl(url)} className="p-1.5 rounded-md hover:bg-white/10 transition-colors">
                        <RotateCcw className="w-4 h-4" />
                    </button>
                </div>

                <form onSubmit={handleNavigate} className="flex-1">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        className="w-full bg-black/20 border border-white/10 rounded-full px-4 py-1.5 text-xs focus:outline-none focus:border-primary/50 transition-colors font-mono"
                    />
                </form>
            </div>

            {/* Browser Content (IFrame) */}
            <div className="flex-1 bg-white relative">
                <iframe
                    src={url}
                    className="w-full h-full border-none"
                    title="Browser"
                    sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                />
                {/* Overlay for "security" or just indicating it's a mock */}
                <div className="absolute top-0 left-0 right-0 bg-yellow-500/10 text-yellow-600 px-2 py-1 text-[10px] text-center pointer-events-none">
                    Note: Many sites block embedding via iframe (X-Frame-Options).
                </div>
            </div>
        </div>
    );
};

export default BrowserApp;
