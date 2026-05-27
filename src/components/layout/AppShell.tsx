import { useState, useEffect, useRef } from 'react';
import { Sidebar } from './Sidebar';
import { Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import navBg from '../../assets/nav-bg.jpg';

interface AppShellProps {
  children: React.ReactNode;
}

// Shown only on mobile — fades out once user scrolls down
function ScrollHint({ container }: { container: React.RefObject<HTMLElement | null> }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Watch the document scroll (main no longer has overflow-y-auto)
    const check = () => {
      const pageOverflows = document.documentElement.scrollHeight > window.innerHeight + 8;
      const atTop = window.scrollY < 10;
      setVisible(pageOverflows && atTop);
    };

    check();
    window.addEventListener('scroll', check, { passive: true });
    window.addEventListener('resize', check);
    return () => {
      window.removeEventListener('scroll', check);
      window.removeEventListener('resize', check);
    };
  }, [container]);

  if (!visible) return null;

  return (
    <div className="pointer-events-none fixed bottom-0 left-0 right-0 z-20 lg:hidden print:hidden">
      {/* Gradient fade */}
      <div className="h-20 bg-gradient-to-t from-brand-dark/90 to-transparent" />
      {/* Bounce arrow */}
      <div className="flex justify-center pb-3 -mt-6">
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-0.5"
        >
          <div className="w-5 h-0.5 bg-lime rounded-full opacity-80" />
          <div className="w-3.5 h-0.5 bg-lime rounded-full opacity-50 mt-0.5" />
          <div className="w-2 h-0.5 bg-lime rounded-full opacity-30 mt-0.5" />
        </motion.div>
      </div>
    </div>
  );
}

export function AppShell({ children }: AppShellProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const mainRef = useRef<HTMLElement>(null);

  return (
    <div className="flex min-h-screen print:min-h-0 bg-brand-dark print:bg-transparent">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex">
        <Sidebar />
      </div>

      {/* Mobile drawer overlay */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
              onClick={() => setDrawerOpen(false)}
            />
            <motion.div
              key="drawer"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 260 }}
              className="fixed inset-y-0 left-0 z-50 lg:hidden"
            >
              <Sidebar onNavClick={() => setDrawerOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main ref={mainRef} className="flex-1 min-w-0 flex flex-col print:overflow-visible">
        {/* Mobile top bar with hamburger */}
        <div
          className="relative flex items-center justify-between px-4 py-3 border-b border-brand-border/60 lg:hidden print:hidden sticky top-0 z-30"
          style={{ backgroundImage: `url(${navBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
          <div className="absolute inset-0 bg-brand-charcoal/85 pointer-events-none" />
          <div className="relative flex items-center gap-3">
            <button
              onClick={() => setDrawerOpen(true)}
              className="p-2.5 rounded-lg text-brand-text hover:bg-white/10 transition-colors"
              aria-label="Open navigation"
            >
              <Menu size={20} />
            </button>
            <span className="font-display font-bold text-brand-white text-base">Mr. H Digital</span>
          </div>
        </div>

        {children}
      </main>

      {/* Scroll hint — mobile only, disappears once user scrolls */}
      <ScrollHint container={mainRef} />
    </div>
  );
}
