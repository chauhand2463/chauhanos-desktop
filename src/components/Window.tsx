import { useRef, useCallback, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Minus, Square, X } from 'lucide-react';
import { type AppId, useDesktopStore } from '@/store/useDesktopStore';

interface WindowProps {
  id: AppId;
  title: string;
  icon: string;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
  children: ReactNode;
}

const Window = ({ id, title, icon, isMinimized, isMaximized, zIndex, position, size, children }: WindowProps) => {
  const { closeApp, minimizeApp, maximizeApp, focusApp, updatePosition } = useDesktopStore();
  const dragRef = useRef<{ startX: number; startY: number; posX: number; posY: number } | null>(null);
  const windowRef = useRef<HTMLDivElement>(null);

  const handleDragStart = useCallback(
    (e: React.MouseEvent) => {
      if (isMaximized) return;
      e.preventDefault();
      focusApp(id);
      dragRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        posX: position.x,
        posY: position.y,
      };

      const handleMouseMove = (ev: MouseEvent) => {
        if (!dragRef.current) return;
        const dx = ev.clientX - dragRef.current.startX;
        const dy = ev.clientY - dragRef.current.startY;
        updatePosition(id, {
          x: dragRef.current.posX + dx,
          y: dragRef.current.posY + dy,
        });
      };

      const handleMouseUp = () => {
        dragRef.current = null;
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };

      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    },
    [id, isMaximized, position, focusApp, updatePosition]
  );

  // No early return here - let Framer Motion handle it through animate/variants

  return (
    <motion.div
      ref={windowRef}
      className="absolute glass-strong rounded-lg overflow-hidden flex flex-col neon-glow"
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{
        opacity: isMinimized ? 0 : 1,
        scale: isMinimized ? 0.3 : 1,
        x: isMaximized ? 0 : position.x,
        y: isMinimized ? window.innerHeight : (isMaximized ? 0 : position.y),
        width: isMaximized ? '100%' : size.width,
        height: isMaximized ? 'calc(100% - 48px)' : size.height,
        zIndex: zIndex,
        pointerEvents: isMinimized ? 'none' : 'auto'
      }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 26,
        mass: 0.8,
        opacity: { duration: 0.2 },
        // Custom durations for window resizing/moving for premium feel
        width: { duration: 0.4 },
        height: { duration: 0.4 }
      }}
      onMouseDown={() => focusApp(id)}
      layoutId={`window-${id}`}
    >
      {/* Title bar */}
      <div
        className="window-title-bar flex items-center justify-between px-3 py-2 cursor-grab active:cursor-grabbing select-none shrink-0"
        onMouseDown={handleDragStart}
        onDoubleClick={() => maximizeApp(id)}
      >
        <div className="flex items-center gap-2">
          <span className="text-sm">{icon}</span>
          <span className="text-xs font-mono text-secondary-foreground">{title}</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => { e.stopPropagation(); minimizeApp(id); }}
            className="p-1 rounded hover:bg-primary/20 transition-colors"
          >
            <Minus className="w-3 h-3 text-muted-foreground" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); maximizeApp(id); }}
            className="p-1 rounded hover:bg-primary/20 transition-colors"
          >
            <Square className="w-3 h-3 text-muted-foreground" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); closeApp(id); }}
            className="p-1 rounded hover:bg-destructive/30 transition-colors"
          >
            <X className="w-3 h-3 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        {children}
      </div>
    </motion.div>
  );
};

export default Window;
