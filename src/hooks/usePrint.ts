import { useCallback, useState } from 'react';

export function usePrint() {
  const [isPrinting, setIsPrinting] = useState(false);

  const print = useCallback(() => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 300);
  }, []);

  return { print, isPrinting };
}
