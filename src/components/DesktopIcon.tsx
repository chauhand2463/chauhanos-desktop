import { motion } from 'framer-motion';
import { AppId } from '@/store/useDesktopStore';

interface DesktopIconProps {
  id: AppId;
  icon: string;
  label: string;
  onClick: () => void;
}

const DesktopIcon = ({ icon, label, onClick }: DesktopIconProps) => {
  return (
    <motion.button
      onClick={onClick}
      onDoubleClick={onClick}
      className="flex flex-col items-center gap-1.5 p-3 rounded-lg hover:bg-primary/10 transition-colors group w-20"
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
    >
      <span className="text-3xl group-hover:drop-shadow-[0_0_8px_hsl(185,100%,50%,0.5)] transition-all">
        {icon}
      </span>
      <span className="text-[10px] text-secondary-foreground font-mono leading-tight text-center truncate w-full">
        {label}
      </span>
    </motion.button>
  );
};

export default DesktopIcon;
