'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import dynamic from 'next/dynamic';
import { ArrowRight } from 'lucide-react';
import { useEffect, useRef } from 'react';

const ThreeScene = dynamic(() => import('./ThreeScene'), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-black" />,
});

// ─── Parallax text layer ──────────────────────────────────────────────────────
function useMouseParallax(strength = 1) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 60, damping: 20 });
  const springY = useSpring(y, { stiffness: 60, damping: 20 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth  - 0.5) * strength;
      const ny = (e.clientY / window.innerHeight - 0.5) * strength;
      x.set(nx);
      y.set(ny);
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [x, y, strength]);

  return { x: springX, y: springY };
}

export default function HeroSection() {
  const parallax = useMouseParallax(18);

  return (
    <section className="relative min-h-screen overflow-hidden bg-black mt-15">

      {/* ── Black hole canvas ── */}
      <div className="absolute inset-0 z-0">
        <ThreeScene />
      </div>

      {/* ── Vignette: keeps text legible without killing the scene ── */}
      <div
        className="absolute inset-0 z-1 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 60% 70% at 50% 50%, transparent 20%, rgba(0,0,0,0.45) 70%, rgba(0,0,0,0.85) 100%),
            linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 20%, transparent 75%, rgba(0,0,0,0.7) 100%)
          `,
        }}
      />

      {/* ── Content ── */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center pt-16">

        {/* Mouse-parallax wrapper — moves slightly opposite to cursor */}
        <motion.div
          style={{
            x: useTransform(parallax.x, v => v * -1),
            y: useTransform(parallax.y, v => v * -1),
          }}
          className="w-full max-w-4xl mx-auto px-4 flex flex-col items-center"
        >

          {/* Eyebrow label */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-4 mb-10"
          >
            <div className="h-px w-8 bg-white/20" />
            <span className="text-white/35 text-[10px] tracking-[0.45em]">BINARIC LABS</span>
            <div className="h-px w-8 bg-white/20" />
          </motion.div>

          {/* Main heading */}
          <div className="overflow-hidden mb-2 text-center">
            <motion.h1
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1.1, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="text-[clamp(3.5rem,12vw,9rem)] font-bold tracking-tighter leading-none"
            >
              <span className="text-white">ENGINEERING</span>
            </motion.h1>
          </div>
          <div className="overflow-hidden mb-10 text-center">
            <motion.h1
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1.1, delay: 0.48, ease: [0.22, 1, 0.36, 1] }}
              className="text-[clamp(3.5rem,12vw,9rem)] font-bold tracking-tighter leading-none text-white/25"
            >
              DIGITAL GRAVITY
            </motion.h1>
          </div>

          {/* Divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.4, delay: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="h-px w-40 bg-gradient-to-r from-transparent via-white/25 to-transparent mb-10"
          />

          {/* Type animation subtitle */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-center mb-14"
          >
            <div className="text-base sm:text-lg text-white/35 h-7 flex items-center justify-center tracking-[0.18em] font-light">
              <TypeAnimation
                sequence={[
                  'Digital presence perfected',
                  2800,
                  'Social media mastery',
                  2800,
                  'Websites that convert',
                  2800,
                  'Full-scale digital solutions',
                  2800,
                ]}
                speed={55}
                repeat={Infinity}
              />
            </div>
          </motion.div>

          {/* CTA button — exact same markup as provided, zero changes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0, ease: 'easeOut' }}
            className="flex justify-center mb-20"
          >
            <motion.button
              whileHover="hover"
              whileTap={{ scale: 0.98 }}
              className="group relative px-8 py-4 md:px-10 md:py-4"
            >
              {/* Main border */}
              <div className="absolute inset-0 border border-white/20 rounded-lg group-hover:border-white/40 transition-all duration-300" />

              {/* Hover line */}
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white to-transparent hidden md:block"
                initial={{ scaleX: 0, opacity: 0 }}
                variants={{
                  hover: { scaleX: 1, opacity: 1, transition: { duration: 0.4, ease: 'easeOut' } },
                }}
              />

              {/* Hover background */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent hidden md:block"
                initial={{ opacity: 0 }}
                variants={{ hover: { opacity: 1, transition: { duration: 0.3 } } }}
              />

              {/* Content */}
              <div className="relative flex items-center justify-between gap-6 md:gap-8">
                <span className="text-white tracking-widest text-sm uppercase font-light">
                  Begin Journey
                </span>
                <div className="flex items-center gap-2 md:gap-3">
                  <span className="text-white/60 text-sm tracking-widest uppercase font-light md:hidden">
                    Start
                  </span>
                  <motion.span
                    className="text-white/60 text-sm tracking-widest uppercase font-light hidden md:inline-block"
                    initial={{ opacity: 0, width: 0 }}
                    variants={{ hover: { opacity: 1, width: 'auto', transition: { delay: 0.1 } } }}
                    style={{ overflow: 'hidden' }}
                  >
                    Start
                  </motion.span>
                  <motion.div
                    variants={{ hover: { rotate: 45 } }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    className="relative"
                  >
                    <ArrowRight className="w-5 h-5 text-white" />
                    <motion.div
                      animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                      className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-white rounded-full md:hidden"
                    />
                  </motion.div>
                </div>
              </div>

              {/* Tap ripple */}
              <motion.div
                className="absolute inset-0 bg-white rounded-lg"
                initial={{ scale: 0, opacity: 0 }}
                whileTap={{ scale: 1, opacity: 0.1 }}
                transition={{ duration: 0.2 }}
              />
            </motion.button>
          </motion.div>
        </motion.div>

        {/* ── Scroll indicator ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <motion.div
            animate={{ y: [0, 7, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            className="h-7 w-px bg-gradient-to-b from-white/40 to-transparent"
          />
          <span className="text-white/25 text-[9px] tracking-[0.4em]">SCROLL</span>
        </motion.div>

        {/* ── Coordinate labels — subtle positional text for depth ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 1 }}
          className="absolute bottom-8 left-6 hidden md:block"
        >
          <span className="text-white/12 text-[9px] tracking-[0.3em] font-light">
            RA 17h 45m 40s
          </span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 1 }}
          className="absolute bottom-8 right-6 hidden md:block"
        >
          <span className="text-white/12 text-[9px] tracking-[0.3em] font-light">
            DEC −29° 00′ 28″
          </span>
        </motion.div>
      </div>
    </section>
  );
}
