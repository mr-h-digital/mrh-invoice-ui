import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import logoGreen from '../assets/mrhdigital-logo-green.png';

interface SplashScreenProps {
  onComplete: () => void;
}

// ── Animated code line ────────────────────────────────────────────────────
function CodeLine({ text, delay, color = '#5A6478' }: { text: string; delay: number; color?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.3, ease: 'easeOut' }}
      style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color, lineHeight: 1.8, whiteSpace: 'nowrap' }}
    >
      {text}
    </motion.div>
  );
}

// ── Floating grid dot ─────────────────────────────────────────────────────
function GridDot({ x, y, delay }: { x: number; y: number; delay: number }) {
  return (
    <motion.div
      style={{ position: 'absolute', left: `${x}%`, top: `${y}%`, width: 3, height: 3, borderRadius: '50%', background: 'rgba(170,219,30,0.25)' }}
      animate={{ opacity: [0.15, 0.6, 0.15], scale: [1, 1.4, 1] }}
      transition={{ delay, duration: 3 + Math.random() * 2, repeat: Infinity, ease: 'easeInOut' }}
    />
  );
}

// ── Progress bar ──────────────────────────────────────────────────────────
function ProgressBar({ progress }: { progress: number }) {
  return (
    <div style={{ width: '100%', height: 2, background: 'rgba(170,219,30,0.15)', borderRadius: 2, overflow: 'hidden' }}>
      <motion.div
        style={{ height: '100%', background: 'linear-gradient(90deg, #8AB818, #AADB1E, #CCEE44)', borderRadius: 2, boxShadow: '0 0 12px rgba(170,219,30,0.6)' }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Initialising…');
  const [visible, setVisible] = useState(true);

  const steps = [
    { at: 300,  pct: 18,  text: 'Loading workspace…' },
    { at: 700,  pct: 36,  text: 'Hydrating invoice store…' },
    { at: 1100, pct: 54,  text: 'Syncing client data…' },
    { at: 1500, pct: 72,  text: 'Preparing dashboard…' },
    { at: 1900, pct: 90,  text: 'Almost ready…' },
    { at: 2200, pct: 100, text: 'Ready.' },
  ];

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    steps.forEach(({ at, pct, text }) => {
      timers.push(setTimeout(() => { setProgress(pct); setStatusText(text); }, at));
    });
    // start exit
    timers.push(setTimeout(() => setVisible(false), 2700));
    // fire onComplete after exit animation
    timers.push(setTimeout(onComplete, 3300));
    return () => timers.forEach(clearTimeout);
  }, []);

  const dots: { x: number; y: number; delay: number }[] = [
    { x: 8,  y: 12, delay: 0 },    { x: 92, y: 8,  delay: 0.4 },
    { x: 5,  y: 85, delay: 0.8 },  { x: 95, y: 88, delay: 0.2 },
    { x: 20, y: 5,  delay: 1.2 },  { x: 80, y: 92, delay: 0.6 },
    { x: 15, y: 50, delay: 1.6 },  { x: 85, y: 45, delay: 1.0 },
    { x: 50, y: 3,  delay: 0.3 },  { x: 48, y: 95, delay: 0.9 },
    { x: 32, y: 18, delay: 1.4 },  { x: 68, y: 78, delay: 0.5 },
    { x: 72, y: 22, delay: 1.8 },  { x: 28, y: 75, delay: 1.1 },
  ];

  const codeLines = [
    { text: 'import { invoiceStore } from "./store"', delay: 0.2,  color: '#5A6478' },
    { text: '→ hydrating localStorage…',              delay: 0.5,  color: '#3d5266' },
    { text: 'const clients = await getClients()',     delay: 0.8,  color: '#5A6478' },
    { text: '✓ 3 clients loaded',                     delay: 1.1,  color: '#AADB1E' },
    { text: 'const invoices = await getInvoices()',   delay: 1.4,  color: '#5A6478' },
    { text: '✓ 1 invoice loaded',                     delay: 1.7,  color: '#AADB1E' },
    { text: '→ mounting React tree…',                 delay: 2.0,  color: '#3d5266' },
    { text: '✓ dashboard ready',                      delay: 2.3,  color: '#AADB1E' },
  ];

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: '#0F1013',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {/* ── Grid dots ── */}
          {dots.map((d, i) => <GridDot key={i} {...d} />)}

          {/* ── Radial lime glow behind logo ── */}
          <div style={{
            position: 'absolute', width: 480, height: 480,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(170,219,30,0.07) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />

          {/* ── Corner accent lines ── */}
          {/* top-left */}
          <motion.div initial={{ opacity: 0, scaleX: 0 }} animate={{ opacity: 1, scaleX: 1 }} transition={{ delay: 0.1, duration: 0.5, ease: 'easeOut' }} style={{ position: 'absolute', top: 32, left: 32, width: 48, height: 2, background: '#AADB1E', transformOrigin: 'left', borderRadius: 2 }} />
          <motion.div initial={{ opacity: 0, scaleY: 0 }} animate={{ opacity: 1, scaleY: 1 }} transition={{ delay: 0.1, duration: 0.5, ease: 'easeOut' }} style={{ position: 'absolute', top: 32, left: 32, width: 2, height: 48, background: '#AADB1E', transformOrigin: 'top', borderRadius: 2 }} />
          {/* top-right */}
          <motion.div initial={{ opacity: 0, scaleX: 0 }} animate={{ opacity: 1, scaleX: 1 }} transition={{ delay: 0.15, duration: 0.5, ease: 'easeOut' }} style={{ position: 'absolute', top: 32, right: 32, width: 48, height: 2, background: '#AADB1E', transformOrigin: 'right', borderRadius: 2 }} />
          <motion.div initial={{ opacity: 0, scaleY: 0 }} animate={{ opacity: 1, scaleY: 1 }} transition={{ delay: 0.15, duration: 0.5, ease: 'easeOut' }} style={{ position: 'absolute', top: 32, right: 32, width: 2, height: 48, background: '#AADB1E', transformOrigin: 'top', borderRadius: 2 }} />
          {/* bottom-left */}
          <motion.div initial={{ opacity: 0, scaleX: 0 }} animate={{ opacity: 1, scaleX: 1 }} transition={{ delay: 0.2, duration: 0.5, ease: 'easeOut' }} style={{ position: 'absolute', bottom: 32, left: 32, width: 48, height: 2, background: '#AADB1E', transformOrigin: 'left', borderRadius: 2 }} />
          <motion.div initial={{ opacity: 0, scaleY: 0 }} animate={{ opacity: 1, scaleY: 1 }} transition={{ delay: 0.2, duration: 0.5, ease: 'easeOut' }} style={{ position: 'absolute', bottom: 32, left: 32, width: 2, height: 48, background: '#AADB1E', transformOrigin: 'bottom', borderRadius: 2 }} />
          {/* bottom-right */}
          <motion.div initial={{ opacity: 0, scaleX: 0 }} animate={{ opacity: 1, scaleX: 1 }} transition={{ delay: 0.25, duration: 0.5, ease: 'easeOut' }} style={{ position: 'absolute', bottom: 32, right: 32, width: 48, height: 2, background: '#AADB1E', transformOrigin: 'right', borderRadius: 2 }} />
          <motion.div initial={{ opacity: 0, scaleY: 0 }} animate={{ opacity: 1, scaleY: 1 }} transition={{ delay: 0.25, duration: 0.5, ease: 'easeOut' }} style={{ position: 'absolute', bottom: 32, right: 32, width: 2, height: 48, background: '#AADB1E', transformOrigin: 'bottom', borderRadius: 2 }} />

          {/* ── Code terminal (bottom-left) ── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            style={{
              position: 'absolute', bottom: 90, left: 52,
              background: 'rgba(30,33,40,0.7)',
              border: '1px solid #2E333D',
              borderRadius: 8, padding: '14px 20px',
              backdropFilter: 'blur(8px)',
              minWidth: 300,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
              {['#EF4444','#F59E0B','#AADB1E'].map(c => (
                <div key={c} style={{ width: 9, height: 9, borderRadius: '50%', background: c }} />
              ))}
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: '#3d5266', marginLeft: 6 }}>terminal</span>
            </div>
            {codeLines.map((l, i) => <CodeLine key={i} {...l} />)}
          </motion.div>

          {/* ── Central content ── */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0, position: 'relative', zIndex: 1 }}>

            {/* Logo */}
            <motion.img
              src={logoGreen}
              alt="Mr. H Digital"
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.05, duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
              style={{ width: 88, height: 88, objectFit: 'contain', marginBottom: 24 }}
            />

            {/* Business name */}
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.5, ease: 'easeOut' }}
              style={{
                fontFamily: "'Syne', sans-serif", fontWeight: 800,
                fontSize: 'clamp(28px, 5vw, 44px)',
                color: '#E8EDF5', margin: 0, letterSpacing: -1,
              }}
            >
              Mr. H Digital
            </motion.h1>

            {/* Product label */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4, ease: 'easeOut' }}
              style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 10 }}
            >
              <div style={{ height: 1, width: 32, background: '#2E333D' }} />
              <span style={{
                fontFamily: "'Space Mono', monospace", fontSize: 11,
                letterSpacing: 3, textTransform: 'uppercase', color: '#5A6478',
              }}>
                Invoice Generator
              </span>
              <div style={{ height: 1, width: 32, background: '#2E333D' }} />
            </motion.div>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              style={{
                fontFamily: "'DM Sans', sans-serif", fontWeight: 300,
                fontSize: 14, color: '#5A6478',
                marginTop: 8, letterSpacing: 0.3,
              }}
            >
              Custom websites &amp; digital products for local businesses
            </motion.p>

            {/* Progress block */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              style={{ width: 260, marginTop: 48 }}
            >
              <ProgressBar progress={progress} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: '#5A6478', letterSpacing: 1 }}>
                  {statusText}
                </span>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: '#AADB1E' }}>
                  {progress}%
                </span>
              </div>
            </motion.div>
          </div>

          {/* ── Version tag ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.4 }}
            style={{
              position: 'absolute', bottom: 28, right: 52,
              fontFamily: "'Space Mono', monospace", fontSize: 10,
              color: '#2E333D', letterSpacing: 1,
            }}
          >
            v1.0.0
          </motion.div>

        </motion.div>
      )}
    </AnimatePresence>
  );
}
