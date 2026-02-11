import { useState, useCallback } from 'react';
import BootScreen from '@/core/BootScreen';
import Desktop from '@/core/Desktop';

const Index = () => {
  const [booted, setBooted] = useState(false);

  const handleBootComplete = useCallback(() => {
    setBooted(true);
  }, []);

  return (
    <>
      {!booted && <BootScreen onComplete={handleBootComplete} />}
      {booted && <Desktop />}
    </>
  );
};

export default Index;
