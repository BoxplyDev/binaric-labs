'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { ArrowRight } from 'lucide-react';

// ─── Service row — hover reveals description inline ──────────────────────────
function ServiceRow({
  index,
  title,
  description,
  tag,
  delay,
  inView,
}: {
  index: number;
  title: string;
  description: string;
  tag: string;
  delay: number;
  inView: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative border-b border-white/[0.07] cursor-default"
    >
      {/* Hover background */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{
          background: 'linear-gradient(90deg, rgba(255,255,255,0.025) 0%, transparent 60%)',
        }}
      />

      <div className="relative py-7 grid grid-cols-[40px_1fr_auto] md:grid-cols-[56px_1fr_160px_auto] gap-4 md:gap-8 items-start">
        {/* Index */}
        <motion.span
          animate={{ opacity: hovered ? 0.5 : 0.18 }}
          transition={{ duration: 0.25 }}
          className="text-[11px] tracking-[0.3em] text-white pt-0.5"
        >
          {String(index).padStart(2, '0')}
        </motion.span>

        {/* Title + description */}
        <div>
          <motion.h4
            animate={{ color: hovered ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.65)' }}
            transition={{ duration: 0.25 }}
            className="text-base md:text-lg font-bold tracking-[0.15em] mb-0"
          >
            {title}
          </motion.h4>

          {/* Description slides down on hover */}
          <motion.p
            animate={{
              height: hovered ? 'auto' : 0,
              opacity: hovered ? 1 : 0,
              marginTop: hovered ? 10 : 0,
            }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="text-white/35 text-xs leading-[1.85] font-light overflow-hidden"
            style={{ height: 0 }}
          >
            {description}
          </motion.p>
        </div>

        {/* Tag — desktop only */}
        <motion.span
          animate={{ opacity: hovered ? 0.4 : 0.15 }}
          transition={{ duration: 0.25 }}
          className="hidden md:block text-[9px] tracking-[0.35em] text-white self-start pt-1"
        >
          {tag}
        </motion.span>

        {/* Arrow */}
        <motion.div
          animate={{ x: hovered ? 4 : 0, opacity: hovered ? 0.7 : 0.2 }}
          transition={{ type: 'spring', stiffness: 300, damping: 22 }}
          className="self-start pt-0.5"
        >
          <ArrowRight className="w-3.5 h-3.5 text-white" />
        </motion.div>
      </div>
    </motion.div>
  );
}

// ─── Stat item ────────────────────────────────────────────────────────────────
function StatItem({
  value,
  label,
  delay,
  inView,
}: {
  value: string;
  label: string;
  delay: number;
  inView: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className="group"
    >
      <div className="text-4xl md:text-5xl font-bold tracking-tighter text-white mb-2 leading-none">
        {value}
      </div>
      <div className="text-[10px] tracking-[0.3em] text-white/30 font-light">
        {label}
      </div>
    </motion.div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function PremiumAbout() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const { ref, inView } = useInView({ threshold: 0.08, triggerOnce: false });

  // Fix: fade in only, never fade out
  const opacity = useTransform(scrollYProgress, [0, 0.12], [0, 1]);
  const scale   = useTransform(scrollYProgress, [0, 0.08], [0.97, 1]);
  const y       = useTransform(scrollYProgress, [0, 0.15], [40, 0]);

  // Parallax layers
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -25]);

  const services = [
    {
      title: 'CONTENT SINGULARITY',
      description: 'Posts, reels, and campaigns engineered to collapse attention into a single point — your brand. Every asset built to escape the algorithm.',
      tag: 'SOCIAL / CONTENT',
    },
    {
      title: 'ORBITAL PLATFORMS',
      description: 'Websites and web apps held in perpetual orbit — always current, always secure, always converting. Built to move at the speed of your growth.',
      tag: 'WEB / PLATFORMS',
    },
    {
      title: 'GRAVITY WELLS',
      description: 'Full-funnel acquisition strategies that pull audiences through every stage of the conversion event horizon. Traffic is irrelevant. Velocity is everything.',
      tag: 'STRATEGY / GROWTH',
    },
  ];

  const stats = [
    { value: '94%',  label: 'CLIENT RETENTION' },
    { value: '247%', label: 'AVG ENGAGEMENT LIFT' },
    { value: '100%', label: 'LAUNCH SUCCESS RATE' },
  ];

  return (
    <section ref={ref} className="relative min-h-screen bg-black overflow-hidden">

      {/* ── Background layers — identical structure to ProcessPillars ── */}
      <div className="absolute inset-0">
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
          {/* Nebula blob — mirrors hero depth */}
          <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-gradient-to-bl from-white/[0.025] via-transparent to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-1/3 w-[400px] h-[400px] bg-gradient-to-tr from-white/[0.02] via-transparent to-transparent rounded-full blur-3xl" />
          <div className="absolute top-1/4 left-1/4 w-64 h-64 border border-white/[0.04] rounded-full" />
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 border border-white/[0.04] rotate-45" />
        </motion.div>

        <motion.div style={{ y: y3 }} className="absolute inset-0">
          {Array.from({ length: 20 }, (_, i) => (
            <div
              key={i}
              className="absolute w-px h-px bg-white/25 rounded-full"
              style={{ left: `${(i * 7) % 100}%`, top: `${(i * 13) % 100}%` }}
            />
          ))}
        </motion.div>
      </div>

      {/* ── Content ── */}
      <div ref={containerRef} className="relative z-10">
        <div className="container mx-auto px-4 sm:px-6 py-24 md:py-36">
          <motion.div style={{ opacity, scale, y }} className="max-w-6xl mx-auto">

            {/* ── Section header ── */}
            <div className="mb-24 md:mb-32">
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="text-white/20 text-sm tracking-[0.3em] block mb-8"
              >
                ABOUT
              </motion.span>

              <div className="overflow-hidden">
                <motion.h2
                  initial={{ y: 110 }}
                  animate={inView ? { y: 0 } : {}}
                  transition={{ duration: 1.05, ease: [0.22, 1, 0.36, 1] }}
                  className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-none"
                >
                  <span className="text-white block">ENGINEERING</span>
                  <span className="text-white/25 block">DIGITAL GRAVITY</span>
                </motion.h2>
              </div>

              <motion.div
                initial={{ scaleX: 0 }}
                animate={inView ? { scaleX: 1 } : {}}
                transition={{ duration: 1.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="h-px bg-gradient-to-r from-white/20 to-transparent w-full max-w-2xl mt-10"
                style={{ originX: 0 }}
              />
            </div>

            {/* ── Two-column body ── */}
            <div className="grid lg:grid-cols-2 gap-16 md:gap-24 items-start mb-24">

              {/* Left — mission + stats ── */}
              <div>
                <motion.p
                  initial={{ opacity: 0, y: 24 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="text-2xl sm:text-3xl md:text-4xl font-light leading-[1.25] text-white/80 mb-16"
                >
                  We architect digital ecosystems where brands achieve{' '}
                  <span className="text-white/40 italic">escape velocity</span>.
                </motion.p>

                {/* Stats — 3-across grid */}
                <div className="grid grid-cols-3 gap-6 mb-16">
                  {stats.map((s, i) => (
                    <StatItem key={i} {...s} delay={0.55 + i * 0.1} inView={inView} />
                  ))}
                </div>

                {/* Manifesto lines */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: 1 } : {}}
                  transition={{ duration: 0.8, delay: 0.85 }}
                  className="space-y-4 border-l border-white/[0.08] pl-6"
                >
                  {[
                    'We don\'t manage brands. We accelerate them.',
                    'Every deliverable is engineered, not assembled.',
                    'Precision at every altitude.',
                  ].map((line, i) => (
                    <p key={i} className="text-white/30 text-sm leading-relaxed font-light tracking-wide">
                      {line}
                    </p>
                  ))}
                </motion.div>
              </div>

              {/* Right — services list ── */}
              <div>
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: 1 } : {}}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="text-[10px] tracking-[0.35em] text-white/20 block mb-6"
                >
                  CAPABILITIES
                </motion.span>

                <div>
                  {services.map((s, i) => (
                    <ServiceRow
                      key={i}
                      index={i + 1}
                      title={s.title}
                      description={s.description}
                      tag={s.tag}
                      delay={0.6 + i * 0.12}
                      inView={inView}
                    />
                  ))}
                </div>

                {/* CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 1.1, ease: 'easeOut' }}
                  className="mt-12"
                >
                  <motion.button
                    whileHover="hover"
                    whileTap={{ scale: 0.98 }}
                    className="group relative w-full px-8 py-5"
                  >
                    <div className="absolute inset-0 border border-white/12 group-hover:border-white/30 transition-colors duration-300" />
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent"
                      initial={{ scaleX: 0, opacity: 0 }}
                      variants={{
                        hover: { scaleX: 1, opacity: 1, transition: { duration: 0.35, ease: 'easeOut' } },
                      }}
                    />
                    <div className="relative flex items-center justify-between">
                      <span className="text-white/70 tracking-[0.25em] text-xs uppercase font-light">
                        Initiate Project
                      </span>
                      <motion.div
                        variants={{ hover: { x: 5 } }}
                        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                        className="flex items-center gap-3"
                      >
                        <motion.span
                          className="text-white/40 text-xs tracking-[0.2em] uppercase font-light"
                          initial={{ opacity: 0, width: 0 }}
                          variants={{ hover: { opacity: 1, width: 'auto', transition: { delay: 0.08 } } }}
                          style={{ overflow: 'hidden' }}
                        >
                          Begin
                        </motion.span>
                        <ArrowRight className="w-3.5 h-3.5 text-white/50 group-hover:text-white/80 transition-colors duration-200" />
                      </motion.div>
                    </div>
                  </motion.button>
                </motion.div>
              </div>
            </div>

            {/* ── Footer rule ── */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 1 }}
              className="pt-12 border-t border-white/[0.06]"
            >
              <div className="flex items-center justify-between">
                <span className="text-white/15 text-[10px] tracking-[0.4em]">
                  BINARIC LABS
                </span>
                <span className="text-white/15 text-[10px] tracking-[0.4em]">
                  OPERATING AT THE EVENT HORIZON OF DIGITAL INNOVATION
                </span>
                <span className="text-white/15 text-[10px] tracking-[0.4em] hidden md:block">
                  EST. MMXXIV
                </span>
              </div>
            </motion.div>

          </motion.div>
        </div>
      </div>
    </section>
  );
}
