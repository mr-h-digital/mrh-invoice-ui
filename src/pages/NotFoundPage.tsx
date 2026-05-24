import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';
import logoGreen from '../assets/mrhdigital-logo-green.png';

// ── Floating grid dot ─────────────────────────────────────────────────────
function Dot({ x, y, delay, size = 3 }: { x: string; y: string; delay: number; size?: number }) {
  return (
    <motion.div
      style={{ position: 'absolute', left: x, top: y, width: size, height: size, borderRadius: '50%', background: 'rgba(170,219,30,0.3)' }}
      animate={{ opacity: [0.2, 0.7, 0.2], scale: [1, 1.5, 1] }}
      transition={{ delay, duration: 3 + Math.random() * 2, repeat: Infinity, ease: 'easeInOut' }}
    />
  );
}

// ── Animated code line ────────────────────────────────────────────────────
function CodeLine({ children, delay, color = '#5A6478' }: { children: string; delay: number; color?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.35 }}
      style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color, lineHeight: 2, whiteSpace: 'nowrap' }}
    >
      {children}
    </motion.div>
  );
}

const dots = [
  { x: '6%',  y: '10%', delay: 0,   size: 3 },
  { x: '93%', y: '7%',  delay: 0.5, size: 2 },
  { x: '4%',  y: '88%', delay: 1,   size: 3 },
  { x: '94%', y: '85%', delay: 0.3, size: 2 },
  { x: '18%', y: '4%',  delay: 1.4, size: 2 },
  { x: '82%', y: '93%', delay: 0.7, size: 3 },
  { x: '12%', y: '52%', delay: 1.8, size: 2 },
  { x: '88%', y: '48%', delay: 0.9, size: 2 },
  { x: '50%', y: '2%',  delay: 0.4, size: 3 },
  { x: '47%', y: '96%', delay: 1.1, size: 2 },
];

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 50,
      background: '#0F1013',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden',
    }}>

      {/* ── Ambient glow ── */}
      <div style={{
        position: 'absolute', width: 600, height: 600,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(170,219,30,0.055) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />

      {/* ── Floating dots ── */}
      {dots.map((d, i) => <Dot key={i} {...d} />)}

      {/* ── Corner accents ── */}
      {/* top-left */}
      <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.05, duration: 0.4 }} style={{ position: 'absolute', top: 28, left: 28, width: 44, height: 2, background: '#AADB1E', transformOrigin: 'left', borderRadius: 2 }} />
      <motion.div initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ delay: 0.05, duration: 0.4 }} style={{ position: 'absolute', top: 28, left: 28, width: 2, height: 44, background: '#AADB1E', transformOrigin: 'top', borderRadius: 2 }} />
      {/* top-right */}
      <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.1, duration: 0.4 }} style={{ position: 'absolute', top: 28, right: 28, width: 44, height: 2, background: '#AADB1E', transformOrigin: 'right', borderRadius: 2 }} />
      <motion.div initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ delay: 0.1, duration: 0.4 }} style={{ position: 'absolute', top: 28, right: 28, width: 2, height: 44, background: '#AADB1E', transformOrigin: 'top', borderRadius: 2 }} />
      {/* bottom-left */}
      <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.15, duration: 0.4 }} style={{ position: 'absolute', bottom: 28, left: 28, width: 44, height: 2, background: '#AADB1E', transformOrigin: 'left', borderRadius: 2 }} />
      <motion.div initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ delay: 0.15, duration: 0.4 }} style={{ position: 'absolute', bottom: 28, left: 28, width: 2, height: 44, background: '#AADB1E', transformOrigin: 'bottom', borderRadius: 2 }} />
      {/* bottom-right */}
      <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.2, duration: 0.4 }} style={{ position: 'absolute', bottom: 28, right: 28, width: 44, height: 2, background: '#AADB1E', transformOrigin: 'right', borderRadius: 2 }} />
      <motion.div initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ delay: 0.2, duration: 0.4 }} style={{ position: 'absolute', bottom: 28, right: 28, width: 2, height: 44, background: '#AADB1E', transformOrigin: 'bottom', borderRadius: 2 }} />

      {/* ── Terminal card (bottom-left) ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.4 }}
        style={{
          position: 'absolute', bottom: 80, left: 48,
          background: 'rgba(30,33,40,0.75)',
          border: '1px solid #2E333D', borderRadius: 8,
          padding: '14px 20px', backdropFilter: 'blur(8px)',
          minWidth: 280,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
          {['#EF4444', '#F59E0B', '#AADB1E'].map(c => (
            <div key={c} style={{ width: 9, height: 9, borderRadius: '50%', background: c }} />
          ))}
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: '#3d5266', marginLeft: 6 }}>terminal</span>
        </div>
        <CodeLine delay={0.7}  color="#5A6478">{'$ GET /unknown-path'}</CodeLine>
        <CodeLine delay={1.0}  color="#EF4444">{'→ Error 404: Route not found'}</CodeLine>
        <CodeLine delay={1.3}  color="#5A6478">{'$ router.resolve(location)'}</CodeLine>
        <CodeLine delay={1.6}  color="#F59E0B">{'→ No matching route'}</CodeLine>
        <CodeLine delay={1.9}  color="#5A6478">{'$ navigate("/dashboard")'}</CodeLine>
        <CodeLine delay={2.2}  color="#AADB1E">{'✓ Ready when you are'}</CodeLine>
      </motion.div>

      {/* ── Centre content ── */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 1 }}>

        {/* Logo */}
        <motion.img
          src={logoGreen}
          alt="Mr. H Digital"
          initial={{ opacity: 0, scale: 0.75, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.55, ease: [0.34, 1.56, 0.64, 1] }}
          style={{ width: 56, height: 56, objectFit: 'contain', marginBottom: 32 }}
        />

        {/* 404 number */}
        <div style={{ position: 'relative', marginBottom: 8 }}>
          {/* Ghost "404" behind */}
          <div style={{
            position: 'absolute', inset: 0,
            fontFamily: "'Syne', sans-serif", fontWeight: 800,
            fontSize: 'clamp(120px, 20vw, 200px)',
            color: 'rgba(170,219,30,0.045)',
            lineHeight: 1, letterSpacing: -6,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            userSelect: 'none', pointerEvents: 'none',
            whiteSpace: 'nowrap',
          }}>
            404
          </div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.55, ease: [0.34, 1.2, 0.64, 1] }}
            style={{
              fontFamily: "'Syne', sans-serif", fontWeight: 800,
              fontSize: 'clamp(88px, 15vw, 148px)',
              color: '#E8EDF5', lineHeight: 1,
              letterSpacing: -4, margin: 0,
              position: 'relative', zIndex: 1,
            }}
          >
            4<span style={{ color: '#AADB1E' }}>0</span>4
          </motion.h1>
        </div>

        {/* Divider with label */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 0.35, duration: 0.4 }}
          style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}
        >
          <div style={{ height: 1, width: 48, background: '#2E333D' }} />
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: '#5A6478' }}>
            Page Not Found
          </span>
          <div style={{ height: 1, width: 48, background: '#2E333D' }} />
        </motion.div>

        {/* Message */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.4 }}
          style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 300,
            fontSize: 15, color: '#5A6478',
            margin: '0 0 36px', textAlign: 'center',
            maxWidth: 340, lineHeight: 1.7,
          }}
        >
          The page you're looking for doesn't exist or has been moved.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.4 }}
          style={{ display: 'flex', gap: 12 }}
        >
          <motion.button
            onClick={() => navigate(-1)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'transparent',
              border: '1px solid #2E333D',
              color: '#B8C4D4',
              borderRadius: 8, padding: '11px 20px',
              fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500,
              cursor: 'pointer', transition: 'border-color 0.2s, color 0.2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#5A6478'; e.currentTarget.style.color = '#E8EDF5'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#2E333D'; e.currentTarget.style.color = '#B8C4D4'; }}
          >
            <ArrowLeft size={15} />
            Go Back
          </motion.button>

          <motion.button
            onClick={() => navigate('/dashboard')}
            whileHover={{ scale: 1.03, boxShadow: '0 0 28px rgba(170,219,30,0.35)' }}
            whileTap={{ scale: 0.97 }}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: '#AADB1E', color: '#0F1013',
              border: 'none', borderRadius: 8, padding: '11px 20px',
              fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 0 20px rgba(170,219,30,0.25)',
              transition: 'box-shadow 0.2s',
              letterSpacing: 0.2,
            }}
          >
            <Home size={15} />
            Dashboard
          </motion.button>
        </motion.div>
      </div>

      {/* Version tag */}
      <div style={{
        position: 'absolute', bottom: 20, right: 36,
        fontFamily: "'Space Mono', monospace", fontSize: 10,
        color: '#2E333D', letterSpacing: 1,
      }}>
        v1.0.0
      </div>
    </div>
  );
}
