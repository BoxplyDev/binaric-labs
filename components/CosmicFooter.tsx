'use client';

import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useState, useRef, useEffect, useCallback } from 'react';
import { Instagram, Linkedin, Github, ArrowRight } from 'lucide-react';

interface Particle {
  id: number; x: number; y: number;
  vx: number; vy: number; life: number; size: number;
}

function ParticleCanvas({ explodeRef }: { explodeRef: React.MutableRefObject<((x: number, y: number) => void) | null> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const idRef = useRef(0);

  const explode = useCallback((wx: number, wy: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const cx = wx - rect.left, cy = wy - rect.top;
    for (let i = 0; i < 36; i++) {
      const angle = (i / 36) * Math.PI * 2 + Math.random() * 0.5;
      const speed = 1.5 + Math.random() * 5.5;
      particles.current.push({ id: idRef.current++, x: cx, y: cy, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed - 2, life: 1, size: 0.8 + Math.random() * 2.2 });
    }
  }, []);

  useEffect(() => { explodeRef.current = explode; }, [explode, explodeRef]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener('resize', resize);
    let raf: number;
    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.current = particles.current.filter(p => p.life > 0.02);
      for (const p of particles.current) {
        p.x += p.vx; p.y += p.vy; p.vy += 0.1; p.vx *= 0.975; p.life -= 0.018;
        const a = Math.max(0, p.life);
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${a * 0.85})`; ctx.fill();
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${a * 0.08})`; ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-20" />;
}

function MagneticLetter({ char, index, total, dimmed, onExplode }: {
  char: string; index: number; total: number; dimmed: boolean;
  onExplode: (x: number, y: number) => void;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const mx = useMotionValue(0); const my = useMotionValue(0);
  const rx = useMotionValue(0); const ry = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 180, damping: 16 });
  const smy = useSpring(my, { stiffness: 180, damping: 16 });
  const srx = useSpring(rx, { stiffness: 280, damping: 22 });
  const sry = useSpring(ry, { stiffness: 280, damping: 22 });
  const [hot, setHot] = useState(false);
  const [burst, setBurst] = useState(false);

  useEffect(() => {
    const phase = (index / total) * Math.PI * 2;
    let raf: number;
    const tick = () => {
      const t = performance.now() / 1000;
      mx.set(Math.sin(t * 0.38 + phase) * 2.8);
      my.set(Math.cos(t * 0.28 + phase * 1.4) * 2);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [index, total, mx, my]);

  const onMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    const dx = e.clientX - cx, dy = e.clientY - cy;
    const dist = Math.hypot(dx, dy);
    if (dist < 100) {
      const f = (1 - dist / 100) * 32;
      mx.set(dx / dist * f); my.set(dy / dist * f);
      ry.set((dx / dist) * 18); rx.set(-(dy / dist) * 18);
      setHot(true);
    }
  }, [mx, my, rx, ry]);

  const onLeave = useCallback(() => { setHot(false); rx.set(0); ry.set(0); }, [rx, ry]);

  const onClick = useCallback(() => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    onExplode(r.left + r.width / 2, r.top + r.height / 2);
    setBurst(true);
    setTimeout(() => setBurst(false), 500);
  }, [onExplode]);

  return (
    <motion.span ref={ref}
      style={{ x: smx, y: smy, rotateX: srx, rotateY: sry, display: 'inline-block', transformStyle: 'preserve-3d', cursor: 'default' }}
      animate={burst ? { scale: [1, 1.5, 0.85, 1.1, 1] } : { scale: 1 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={onMove} onMouseLeave={onLeave} onClick={onClick}
      className="relative select-none">
      <span aria-hidden className="absolute inset-0 font-bold tracking-tighter leading-none pointer-events-none"
        style={{ color: hot ? 'rgba(255,180,160,0.18)' : 'transparent', transform: 'translate(-3px,0)', filter: 'blur(1px)', transition: 'color 0.2s' }}>{char}</span>
      <span aria-hidden className="absolute inset-0 font-bold tracking-tighter leading-none pointer-events-none"
        style={{ color: hot ? 'rgba(160,200,255,0.18)' : 'transparent', transform: 'translate(3px,0)', filter: 'blur(1px)', transition: 'color 0.2s' }}>{char}</span>
      <span className="relative font-bold tracking-tighter leading-none transition-all duration-150"
        style={{
          color: dimmed ? (hot ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.15)') : (hot ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.92)'),
          textShadow: hot ? '0 0 40px rgba(255,255,255,0.5), 0 0 80px rgba(255,255,255,0.15)' : 'none',
        }}>{char}</span>
    </motion.span>
  );
}

function InteractiveWordmark({ explodeRef }: { explodeRef: React.MutableRefObject<((x: number, y: number) => void) | null> }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [glitch, setGlitch] = useState(false);
  const line1 = 'BINARIC'; const line2 = 'LABS';
  const total = line1.length + line2.length;

  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !visible) {
        setVisible(true);
        [100, 180, 280, 400, 520].forEach(d => {
          setTimeout(() => { setGlitch(true); setTimeout(() => setGlitch(false), 65); }, d);
        });
      }
    }, { threshold: 0.25 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [visible]);

  const handleExplode = useCallback((x: number, y: number) => { explodeRef.current?.(x, y); }, [explodeRef]);

  // Fluid responsive font size
  const fs = 'clamp(2.5rem, 9vw, 8rem)';

  return (
    <div ref={ref} className="relative mb-12 md:mb-20 select-none">
      {glitch && (
        <>
          <div className="absolute inset-0 pointer-events-none z-10 mix-blend-screen"
            style={{ transform: `translate(${(Math.random()-0.5)*10}px, 0)`, opacity: 0.3, filter: 'blur(1px)' }}>
            <div className="font-bold tracking-tighter leading-none block text-blue-200" style={{ fontSize: fs }}>{line1}</div>
            <div className="font-bold tracking-tighter leading-none block text-blue-200/40" style={{ fontSize: fs }}>{line2}</div>
          </div>
          <div className="absolute inset-0 pointer-events-none z-10 mix-blend-screen"
            style={{ transform: `translate(${(Math.random()-0.5)*-8}px, 2px)`, opacity: 0.25, filter: 'blur(0.5px)' }}>
            <div className="font-bold tracking-tighter leading-none block text-red-200" style={{ fontSize: fs }}>{line1}</div>
            <div className="font-bold tracking-tighter leading-none block text-red-200/40" style={{ fontSize: fs }}>{line2}</div>
          </div>
        </>
      )}
      <motion.div initial={{ opacity: 0, y: 50, skewX: -3 }} animate={visible ? { opacity: 1, y: 0, skewX: 0 } : {}}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        style={{ fontSize: fs, perspective: '1000px' }} className="overflow-visible">
        {line1.split('').map((c, i) => (
          <MagneticLetter key={i} char={c} index={i} total={total} dimmed={false} onExplode={handleExplode} />
        ))}
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 50, skewX: -3 }} animate={visible ? { opacity: 1, y: 0, skewX: 0 } : {}}
        transition={{ duration: 1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        style={{ fontSize: fs, perspective: '1000px' }} className="overflow-visible">
        {line2.split('').map((c, i) => (
          <MagneticLetter key={i} char={c} index={line1.length + i} total={total} dimmed onExplode={handleExplode} />
        ))}
      </motion.div>
      <motion.div initial={{ scaleX: 0 }} animate={visible ? { scaleX: 1 } : {}}
        transition={{ duration: 1.4, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="h-px bg-gradient-to-r from-white/15 to-transparent mt-5 md:mt-6 max-w-xs"
        style={{ originX: 0 }} />
      <motion.p initial={{ opacity: 0 }} animate={visible ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 1.2 }}
        className="text-[9px] tracking-[0.25em] md:tracking-[0.3em] text-white/12 font-light mt-3">
        HOVER · CLICK · INTERACT
      </motion.p>
    </div>
  );
}

function FooterLink({ label, href, icon: Icon, delay }: {
  label: string; href: string; icon?: React.FC<{ className?: string }>; delay: number;
}) {
  const [hov, setHov] = useState(false);
  return (
    <motion.a href={href}
      target={href.startsWith('http') ? '_blank' : undefined}
      rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
      initial={{ opacity: 0, x: -8 }} whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }} transition={{ duration: 0.5, delay }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      className="flex items-center gap-2 md:gap-2.5 text-white/30 hover:text-white/70 transition-colors duration-200">
      {Icon && <Icon className="w-3 h-3 md:w-3.5 md:h-3.5 shrink-0" />}
      <span className="text-xs tracking-[0.12em] md:tracking-[0.15em] font-light">{label}</span>
      <motion.div animate={{ x: hov ? 3 : 0, opacity: hov ? 0.5 : 0 }} transition={{ type: 'spring', stiffness: 400, damping: 25 }}>
        <ArrowRight className="w-2.5 h-2.5" />
      </motion.div>
    </motion.a>
  );
}

export default function CosmicFooter() {
  const explodeRef = useRef<((x: number, y: number) => void) | null>(null);

  return (
    <footer className="relative bg-black overflow-hidden">
      <div className="h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-[0.035]"
          style={{ backgroundImage: `linear-gradient(90deg,transparent 49%,rgba(255,255,255,.2) 50%,transparent 51%),linear-gradient(0deg,transparent 49%,rgba(255,255,255,.2) 50%,transparent 51%)`, backgroundSize: '100px 100px' }} />
        {Array.from({ length: 18 }, (_, i) => (
          <div key={i} className="absolute w-px h-px bg-white/15 rounded-full"
            style={{ left: `${(i * 13) % 100}%`, top: `${(i * 7) % 100}%` }} />
        ))}
      </div>

      <ParticleCanvas explodeRef={explodeRef} />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-16 md:pt-20 pb-10 md:pb-12">
        <InteractiveWordmark explodeRef={explodeRef} />

        {/* Links */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-16 mb-14 md:mb-20">
          <div>
            <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              transition={{ duration: 0.6 }} className="text-[9px] tracking-[0.35em] text-white/20 font-light block mb-4 md:mb-5">COMPANY</motion.span>
            <div className="space-y-3">
              <FooterLink label="Packages"  href="#packages"  delay={0.05} />
              <FooterLink label="Portfolio" href="#portfolio" delay={0.10} />
            </div>
          </div>
          <div>
            <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.08 }} className="text-[9px] tracking-[0.35em] text-white/20 font-light block mb-4 md:mb-5">LEGAL</motion.span>
            <div className="space-y-3">
              <FooterLink label="Terms of Service" href="#" delay={0.12} />
              <FooterLink label="Privacy Policy"   href="#" delay={0.16} />
            </div>
          </div>
          <div className="col-span-2 md:col-span-1">
            <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.16 }} className="text-[9px] tracking-[0.35em] text-white/20 font-light block mb-4 md:mb-5">CONNECT</motion.span>
            <div className="flex md:flex-col gap-5 md:gap-3">
              <FooterLink label="Instagram" href="https://instagram.com" icon={Instagram} delay={0.18} />
              <FooterLink label="LinkedIn"  href="https://linkedin.com"  icon={Linkedin}  delay={0.22} />
              <FooterLink label="GitHub"    href="https://github.com"    icon={Github}    delay={0.26} />
            </div>
          </div>
        </div>

        {/* Divider */}
        <motion.div initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }}
          transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
          className="h-px bg-gradient-to-r from-white/[0.08] via-white/[0.04] to-transparent mb-6 md:mb-8"
          style={{ originX: 0 }} />

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-white/15 text-[9px] tracking-[0.3em] font-light">
            © {new Date().getFullYear()} BINARIC LABS. ALL TRAJECTORIES RESERVED.
          </p>
          <p className="text-white/15 text-[9px] tracking-[0.3em] font-light hidden md:block">ENGINEERING DIGITAL GRAVITY</p>
          <motion.a href="#" whileHover="hover"
            className="group flex items-center gap-2.5 text-white/20 hover:text-white/50 transition-colors duration-200">
            <span className="text-[9px] tracking-[0.3em] font-light">RETURN TO ORBIT</span>
            <motion.div variants={{ hover: { y: -3 } }} transition={{ type: 'spring', stiffness: 400, damping: 20 }}>
              <div className="w-2.5 h-2.5 border-l border-t border-white/30 group-hover:border-white/60 transition-colors rotate-45" />
            </motion.div>
          </motion.a>
        </div>
      </div>
    </footer>
  );
}
