'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import CosmicNavbar from '@/components/CosmicNavbar';
import CosmicFooter from '@/components/CosmicFooter';
import DemoForm from '@/components/DemoForm';

export default function DemoPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -25]);

  const credentials = [
    { value: '94%',  label: 'CLIENT RETENTION' },
    { value: '<24H', label: 'RESPONSE TIME' },
    { value: '100%', label: 'LAUNCH SUCCESS' },
  ];

  const promises = [
    'No sales pressure. No obligation.',
    'Live walkthrough tailored to your goals.',
    'Direct line to the team, not a bot.',
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <CosmicNavbar />

      {/* ── Background — identical parallax system ── */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <motion.div style={{ y: y1 }} className="absolute inset-0 opacity-[0.07]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(90deg, transparent 49%, rgba(255,255,255,0.15) 50%, transparent 51%),
                linear-gradient(0deg,  transparent 49%, rgba(255,255,255,0.15) 50%, transparent 51%)
              `,
              backgroundSize: '100px 100px',
            }}
          />
        </motion.div>

        <motion.div style={{ y: y2 }} className="absolute inset-0">
          <div className="absolute top-1/4 right-1/3 w-[600px] h-[600px] bg-gradient-to-bl from-white/[0.02] via-transparent to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 left-1/4 w-[400px] h-[400px] bg-gradient-to-tr from-white/[0.015] via-transparent to-transparent rounded-full blur-3xl" />
          <div className="absolute top-1/3 left-1/3 w-80 h-80 border border-white/[0.04] rounded-full" />
          <div className="absolute bottom-1/4 right-1/4 w-56 h-56 border border-white/[0.03] rotate-45" />
        </motion.div>

        <motion.div style={{ y: y3 }} className="absolute inset-0">
          {Array.from({ length: 20 }, (_, i) => (
            <div
              key={i}
              className="absolute w-px h-px bg-white/20 rounded-full"
              style={{ left: `${(i * 9) % 100}%`, top: `${(i * 14) % 100}%` }}
            />
          ))}
        </motion.div>
      </div>

      {/* ── Page content ── */}
      <main ref={containerRef} className="relative z-10 min-h-screen pt-24 sm:pt-32 pb-16 sm:pb-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">

          {/* ── Section eyebrow ── */}
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-white/20 text-[10px] tracking-[0.35em] block mb-8"
          >
            BINARIC LABS
          </motion.span>

          {/* ── Two-column grid ── */}
          <div className="grid lg:grid-cols-2 gap-16 md:gap-24 items-start">

            {/* LEFT — heading, credentials, promises */}
            <div className="lg:sticky lg:top-32">

              {/* Heading — same two-line split as the rest of the site */}
              <div className="overflow-hidden mb-6">
                <motion.h1
                  initial={{ y: 110 }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1.05, ease: [0.22, 1, 0.36, 1] }}
                  className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tighter leading-none"
                >
                  <span className="text-white block">BOOK A</span>
                  <span className="text-white/25 block">DEMO</span>
                </motion.h1>
              </div>

              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.3, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="h-px bg-gradient-to-r from-white/20 to-transparent mb-10 max-w-xs"
                style={{ originX: 0 }}
              />

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="text-white/40 text-base font-light leading-relaxed mb-14 max-w-sm"
              >
                Schedule a live walkthrough and see exactly how Binaric Labs can
                accelerate your brand's{' '}
                <span className="text-white/60 italic">escape velocity</span>.
              </motion.p>

              {/* Stats — same 3-column grid as About/Services */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="grid grid-cols-3 gap-6 mb-14"
              >
                {credentials.map((c, i) => (
                  <div key={i}>
                    <div className="text-3xl md:text-4xl font-bold tracking-tighter text-white mb-1.5 leading-none">
                      {c.value}
                    </div>
                    <div className="text-[9px] tracking-[0.3em] text-white/25 font-light">
                      {c.label}
                    </div>
                  </div>
                ))}
              </motion.div>

              {/* Manifesto lines — same left-border treatment */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.75 }}
                className="space-y-4 border-l border-white/[0.08] pl-6"
              >
                {promises.map((line, i) => (
                  <p key={i} className="text-white/30 text-sm leading-relaxed font-light tracking-wide">
                    {line}
                  </p>
                ))}
              </motion.div>
            </div>

            {/* RIGHT — form panel */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              {/* Sharp border panel — no rounded corners, no bg fill */}
              <div className="relative border border-white/[0.08] p-8 md:p-10">
                {/* Corner accents */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-white/25" />
                <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-white/25" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-white/25" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-white/25" />

                <DemoForm />
              </div>
            </motion.div>

          </div>

          {/* ── Footer rule ── */}
          {/* <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 1 }}
            className="mt-32 pt-12 border-t border-white/[0.06]"
          >
            <div className="flex items-center justify-between">
              <span className="text-white/15 text-[10px] tracking-[0.4em]">BINARIC LABS</span>
              <span className="text-white/15 text-[10px] tracking-[0.4em]">
                OPERATING AT THE EVENT HORIZON OF DIGITAL INNOVATION
              </span>
              <span className="text-white/15 text-[10px] tracking-[0.4em] hidden md:block">
                EST. MMXXIV
              </span>
            </div>
          </motion.div> */}

        </div>
      </main>

      <CosmicFooter />
    </div>
  );
}
