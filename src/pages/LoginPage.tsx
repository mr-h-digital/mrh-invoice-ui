import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, LogIn, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import logoGreen from '../assets/mrhdigital-logo-green.png';
import splashBg from '../assets/splash-bg.jpg';

export function LoginPage() {
  const login = useAuthStore((s) => s.login);

  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw]     = useState(false);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [shake, setShake]       = useState(false);

  const emailRef = useRef<HTMLInputElement>(null);
  useEffect(() => { emailRef.current?.focus(); }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate a brief async check (drop this when swapping to a real API)
    await new Promise((r) => setTimeout(r, 600));

    const ok = login(email, password);
    setLoading(false);

    if (!ok) {
      setError('Invalid email or password.');
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0F1013', overflow: 'hidden' }}>

      {/* ── Background photo ── */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `url(${splashBg})`,
        backgroundSize: 'cover', backgroundPosition: 'center 40%',
        opacity: 0.55, mixBlendMode: 'luminosity', pointerEvents: 'none',
      }} />
      {/* ── Gradient overlay ── */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(135deg, rgba(15,16,19,0.88) 0%, rgba(15,16,19,0.70) 50%, rgba(15,16,19,0.92) 100%)',
        pointerEvents: 'none',
      }} />

      {/* ── Corner accents ── */}
      {/* top-left */}
      <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.10, duration: 0.45 }} style={{ position: 'absolute', top: 28, left: 28, width: 40, height: 2, background: '#AADB1E', borderRadius: 2, transformOrigin: 'left' }} />
      <motion.div initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ delay: 0.10, duration: 0.45 }} style={{ position: 'absolute', top: 28, left: 28, width: 2, height: 40, background: '#AADB1E', borderRadius: 2, transformOrigin: 'top' }} />
      {/* top-right */}
      <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.15, duration: 0.45 }} style={{ position: 'absolute', top: 28, right: 28, width: 40, height: 2, background: '#AADB1E', borderRadius: 2, transformOrigin: 'right' }} />
      <motion.div initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ delay: 0.15, duration: 0.45 }} style={{ position: 'absolute', top: 28, right: 28, width: 2, height: 40, background: '#AADB1E', borderRadius: 2, transformOrigin: 'top' }} />
      {/* bottom-left */}
      <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.20, duration: 0.45 }} style={{ position: 'absolute', bottom: 28, left: 28, width: 40, height: 2, background: '#AADB1E', borderRadius: 2, transformOrigin: 'left' }} />
      <motion.div initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ delay: 0.20, duration: 0.45 }} style={{ position: 'absolute', bottom: 28, left: 28, width: 2, height: 40, background: '#AADB1E', borderRadius: 2, transformOrigin: 'bottom' }} />
      {/* bottom-right */}
      <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.25, duration: 0.45 }} style={{ position: 'absolute', bottom: 28, right: 28, width: 40, height: 2, background: '#AADB1E', borderRadius: 2, transformOrigin: 'right' }} />
      <motion.div initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ delay: 0.25, duration: 0.45 }} style={{ position: 'absolute', bottom: 28, right: 28, width: 2, height: 40, background: '#AADB1E', borderRadius: 2, transformOrigin: 'bottom' }} />

      {/* ── Login card ── */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.15, duration: 0.5, ease: [0.34, 1.1, 0.64, 1] }}
        animate-if={shake ? 'shake' : 'idle'}
        style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 420, margin: '0 16px' }}
      >
        <motion.div
          animate={shake ? { x: [0, -10, 10, -8, 8, -4, 4, 0] } : { x: 0 }}
          transition={{ duration: 0.45, ease: 'easeInOut' }}
        >
          <div style={{
            background: 'rgba(22,24,29,0.92)',
            border: '1px solid #2E333D',
            borderRadius: 16,
            padding: '40px 40px 36px',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(170,219,30,0.06)',
          }}>

            {/* Header */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 36 }}>
              <motion.img
                src={logoGreen}
                alt="Mr. H Digital"
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.25, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
                style={{ width: 64, height: 64, objectFit: 'contain', marginBottom: 20 }}
              />
              <motion.h1
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.4 }}
                style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 26, color: '#E8EDF5', margin: '0 0 6px', letterSpacing: -0.5 }}
              >
                Mr. H Digital
              </motion.h1>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45, duration: 0.4 }}
                style={{ display: 'flex', alignItems: 'center', gap: 8 }}
              >
                <div style={{ height: 1, width: 24, background: '#2E333D' }} />
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: '#5A6478' }}>
                  Invoice Generator
                </span>
                <div style={{ height: 1, width: 24, background: '#2E333D' }} />
              </motion.div>
            </div>

            {/* Form */}
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
            >
              {/* Email */}
              <div>
                <label style={{ display: 'block', fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: '#5A6478', marginBottom: 8 }}>
                  Email
                </label>
                <input
                  ref={emailRef}
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(''); }}
                  placeholder="admin@mrhdigital.co.za"
                  autoComplete="username"
                  required
                  style={{
                    width: '100%', background: '#0F1013', border: `1px solid ${error ? '#EF4444' : '#2E333D'}`,
                    borderRadius: 8, padding: '12px 14px', fontSize: 14,
                    fontFamily: "'DM Sans', sans-serif", color: '#E8EDF5',
                    outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s',
                  }}
                  onFocus={(e) => { if (!error) e.currentTarget.style.borderColor = '#AADB1E'; }}
                  onBlur={(e) => { if (!error) e.currentTarget.style.borderColor = '#2E333D'; }}
                />
              </div>

              {/* Password */}
              <div>
                <label style={{ display: 'block', fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: '#5A6478', marginBottom: 8 }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(''); }}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    required
                    style={{
                      width: '100%', background: '#0F1013', border: `1px solid ${error ? '#EF4444' : '#2E333D'}`,
                      borderRadius: 8, padding: '12px 44px 12px 14px', fontSize: 14,
                      fontFamily: "'DM Sans', sans-serif", color: '#E8EDF5',
                      outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s',
                    }}
                    onFocus={(e) => { if (!error) e.currentTarget.style.borderColor = '#AADB1E'; }}
                    onBlur={(e) => { if (!error) e.currentTarget.style.borderColor = '#2E333D'; }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((v) => !v)}
                    style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#5A6478', padding: 2, display: 'flex', alignItems: 'center' }}
                  >
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Error message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, y: -4, height: 0 }}
                    transition={{ duration: 0.2 }}
                    style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#EF4444', fontFamily: "'DM Sans', sans-serif", fontSize: 13 }}
                  >
                    <AlertCircle size={14} style={{ flexShrink: 0 }} />
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                style={{
                  marginTop: 4,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  background: loading ? '#8AB818' : '#AADB1E',
                  color: '#0F1013', border: 'none', borderRadius: 8,
                  padding: '13px 20px', fontSize: 15,
                  fontFamily: "'Syne', sans-serif", fontWeight: 700,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  boxShadow: loading ? 'none' : '0 0 24px rgba(170,219,30,0.3)',
                  transition: 'background 0.2s, box-shadow 0.2s',
                  letterSpacing: 0.3,
                }}
              >
                {loading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                      style={{ width: 16, height: 16, border: '2px solid rgba(15,16,19,0.3)', borderTopColor: '#0F1013', borderRadius: '50%' }}
                    />
                    Signing in…
                  </>
                ) : (
                  <>
                    <LogIn size={16} />
                    Sign In
                  </>
                )}
              </motion.button>
            </motion.form>

            {/* Footer */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.65, duration: 0.4 }}
              style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: '#5A6478', textAlign: 'center', margin: '28px 0 0' }}
            >
              Custom websites &amp; digital products for local businesses
            </motion.p>
          </div>
        </motion.div>
      </motion.div>

      {/* Version tag */}
      <div style={{ position: 'absolute', bottom: 20, right: 32, fontFamily: "'Space Mono', monospace", fontSize: 10, color: '#2E333D', letterSpacing: 1, zIndex: 1 }}>
        v1.0.0
      </div>
    </div>
  );
}
