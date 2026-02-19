import { useState, useCallback, useEffect } from 'react';
import BootScreen from '@/core/BootScreen';
import Desktop from '@/core/Desktop';
import LockScreen from '@/core/LockScreen';
import { useDesktopStore } from '@/store/useDesktopStore';
import { AnimatePresence } from 'framer-motion';

const Index = () => {
  const [booted, setBooted] = useState(false);
  const { settings } = useDesktopStore();

  const handleBootComplete = useCallback(() => {
    setBooted(true);
  }, []);

  return (
    <AnimatePresence mode="wait">
      {!booted ? (
        <BootScreen key="boot" onComplete={handleBootComplete} />
      ) : settings.isLocked ? (
        <LockScreen key="lock" />
      ) : (
        <Desktop key="desktop" />
      )}
    </AnimatePresence>
  );
};

export default Index;
