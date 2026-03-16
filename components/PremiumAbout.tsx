'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { ArrowRight } from 'lucide-react';

function ServiceRow({ index, title, description, tag, delay, inView }: {
  index: number; title: string; description: string; tag: string; delay: number; inView: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      className="group relative border-b border-white/[0.07] cursor-default">
      <motion.div className="absolute inset-0 pointer-events-none"
        animate={{ opacity: hovered ? 1 : 0 }} transition={{ duration: 0.3 }}
        style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.025) 0%, transparent 60%)' }} />
      <div className="relative py-5 md:py-7 grid grid-cols-[32px_1fr_auto] md:grid-cols-[56px_1fr_160px_auto] gap-3 md:gap-8 items-start">
        <motion.span animate={{ opacity: hovered ? 0.5 : 0.18 }} transition={{ duration: 0.25 }}
          className="text-[10px] tracking-[0.25em] text-white pt-0.5">
          {String(index).padStart(2, '0')}
        </motion.span>
        <div>
          <motion.h4 animate={{ color: hovered ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.65)' }}
            transition={{ duration: 0.25 }}
            className="text-sm md:text-lg font-bold tracking-[0.12em] md:tracking-[0.15em]">{title}</motion.h4>
          <motion.p
            animate={{ height: hovered ? 'auto' : 0, opacity: hovered ? 1 : 0, marginTop: hovered ? 8 : 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="text-white/35 text-xs leading-[1.85] font-light overflow-hidden" style={{ height: 0 }}>
            {description}
          </motion.p>
        </div>
        <motion.span animate={{ opacity: hovered ? 0.4 : 0.15 }} transition={{ duration: 0.25 }}
          className="hidden md:block text-[9px] tracking-[0.35em] text-white self-start pt-1">{tag}</motion.span>
        <motion.div animate={{ x: hovered ? 4 : 0, opacity: hovered ? 0.7 : 0.2 }}
          transition={{ type: 'spring', stiffness: 300, damping: 22 }} className="self-start pt-0.5">
          <ArrowRight className="w-3 h-3 md:w-3.5 md:h-3.5 text-white" />
        </motion.div>
      </div>
    </motion.div>
  );
}

function StatItem({ value, label, delay, inView }: { value: string; label: string; delay: number; inView: boolean }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}>
      <div className="text-3xl md:text-5xl font-bold tracking-tighter text-white mb-1.5 leading-none">{value}</div>
      <div className="text-[9px] md:text-[10px] tracking-[0.25em] md:tracking-[0.3em] text-white/30 font-light">{label}</div>
    </motion.div>
  );
}

export default function PremiumAbout() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start end', 'end start'] });
  const { ref, inView } = useInView({ threshold: 0.08, triggerOnce: false });

  const opacity = useTransform(scrollYProgress, [0, 0.12], [0, 1]);
  const scale   = useTransform(scrollYProgress, [0, 0.08], [0.97, 1]);
  const y       = useTransform(scrollYProgress, [0, 0.15], [40, 0]);
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -25]);

  const services = [
    { title: 'CONTENT SINGULARITY', description: 'Posts, reels, and campaigns engineered to collapse attention into a single point — your brand. Every asset built to escape the algorithm.', tag: 'SOCIAL / CONTENT' },
    { title: 'ORBITAL PLATFORMS',   description: 'Websites and web apps held in perpetual orbit — always current, always secure, always converting. Built to move at the speed of your growth.', tag: 'WEB / PLATFORMS'  },
    { title: 'GRAVITY WELLS',       description: 'Full-funnel acquisition strategies that pull audiences through every stage of the conversion event horizon. Traffic is irrelevant. Velocity is everything.', tag: 'STRATEGY / GROWTH' },
  ];

  const stats = [
    { value: '94%',  label: 'RETENTION'  },
    { value: '247%', label: 'ENGAGEMENT' },
    { value: '100%', label: 'SUCCESS'    },
  ];

  return (
    <section ref={ref} className="relative min-h-screen bg-black overflow-hidden">
      <div className="absolute inset-0">
        <motion.div style={{ y: y1 }} className="absolute inset-0 opacity-[0.07]">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(90deg, transparent 49%, rgba(255,255,255,0.15) 50%, transparent 51%), linear-gradient(0deg, transparent 49%, rgba(255,255,255,0.15) 50%, transparent 51%)`,
            backgroundSize: '100px 100px',
          }} />
        </motion.div>
        <motion.div style={{ y: y2 }} className="absolute inset-0">
          <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-gradient-to-bl from-white/[0.025] via-transparent to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-1/3 w-[300px] h-[300px] bg-gradient-to-tr from-white/[0.02] via-transparent to-transparent rounded-full blur-3xl" />
        </motion.div>
        <motion.div style={{ y: y3 }} className="absolute inset-0">
          {Array.from({ length: 20 }, (_, i) => (
            <div key={i} className="absolute w-px h-px bg-white/25 rounded-full"
              style={{ left: `${(i * 7) % 100}%`, top: `${(i * 13) % 100}%` }} />
          ))}
        </motion.div>
      </div>

      <div ref={containerRef} className="relative z-10">
        <div className="container mx-auto px-4 sm:px-6 py-20 md:py-36">
          <motion.div style={{ opacity, scale, y }} className="max-w-6xl mx-auto">

            {/* Header */}
            <div className="mb-12 md:mb-24">
              <motion.span initial={{ opacity: 0, y: 10 }} animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7 }} className="text-white/20 text-[10px] md:text-sm tracking-[0.3em] block mb-6 md:mb-8">ABOUT</motion.span>
              <div className="overflow-hidden">
                <motion.h2 initial={{ y: 110 }} animate={inView ? { y: 0 } : {}}
                  transition={{ duration: 1.05, ease: [0.22, 1, 0.36, 1] }}
                  className="font-bold tracking-tighter leading-none"
                  style={{ fontSize: 'clamp(2.2rem, 9vw, 6rem)' }}>
                  <span className="text-white block">ENGINEERING</span>
                  <span className="text-white/25 block">DIGITAL GRAVITY</span>
                </motion.h2>
              </div>
              <motion.div initial={{ scaleX: 0 }} animate={inView ? { scaleX: 1 } : {}}
                transition={{ duration: 1.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="h-px bg-gradient-to-r from-white/20 to-transparent w-full max-w-2xl mt-8 md:mt-10"
                style={{ originX: 0 }} />
            </div>

            {/* Body */}
            <div className="grid lg:grid-cols-2 gap-12 md:gap-24 items-start mb-16 md:mb-24">
              <div>
                <motion.p initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="text-xl sm:text-2xl md:text-4xl font-light leading-[1.3] text-white/80 mb-10 md:mb-16">
                  We architect digital ecosystems where brands achieve{' '}
                  <span className="text-white/40 italic">escape velocity</span>.
                </motion.p>
                <div className="grid grid-cols-3 gap-3 md:gap-6 mb-10 md:mb-16">
                  {stats.map((s, i) => <StatItem key={i} {...s} delay={0.55 + i * 0.1} inView={inView} />)}
                </div>
                <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
                  transition={{ duration: 0.8, delay: 0.85 }}
                  className="space-y-3 md:space-y-4 border-l border-white/[0.08] pl-5 md:pl-6">
                  {["We don't manage brands. We accelerate them.", 'Every deliverable is engineered, not assembled.', 'Precision at every altitude.'].map((line, i) => (
                    <p key={i} className="text-white/30 text-xs md:text-sm leading-relaxed font-light tracking-wide">{line}</p>
                  ))}
                </motion.div>
              </div>

              <div>
                <motion.span initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="text-[9px] md:text-[10px] tracking-[0.35em] text-white/20 block mb-5 md:mb-6">CAPABILITIES</motion.span>
                <div>
                  {services.map((s, i) => (
                    <ServiceRow key={i} index={i + 1} title={s.title} description={s.description} tag={s.tag} delay={0.6 + i * 0.12} inView={inView} />
                  ))}
                </div>
                <motion.div initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 1.1 }} className="mt-10 md:mt-12">
                  <motion.button whileHover="hover" whileTap={{ scale: 0.98 }} className="group relative w-full px-6 md:px-8 py-4 md:py-5">
                    <div className="absolute inset-0 border border-white/12 group-hover:border-white/30 transition-colors duration-300" />
                    <motion.div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent"
                      initial={{ scaleX: 0, opacity: 0 }}
                      variants={{ hover: { scaleX: 1, opacity: 1, transition: { duration: 0.35, ease: 'easeOut' } } }} />
                    <div className="relative flex items-center justify-between">
                      <span className="text-white/70 tracking-[0.2em] text-xs uppercase font-light">Initiate Project</span>
                      <motion.div variants={{ hover: { x: 5 } }} transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                        className="flex items-center gap-2 md:gap-3">
                        <motion.span className="text-white/40 text-xs tracking-[0.2em] uppercase font-light"
                          initial={{ opacity: 0, width: 0 }}
                          variants={{ hover: { opacity: 1, width: 'auto', transition: { delay: 0.08 } } }}
                          style={{ overflow: 'hidden' }}>Begin</motion.span>
                        <ArrowRight className="w-3.5 h-3.5 text-white/50 group-hover:text-white/80 transition-colors duration-200" />
                      </motion.div>
                    </div>
                  </motion.button>
                </motion.div>
              </div>
            </div>

            {/* Footer rule */}
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.5 }} transition={{ duration: 1 }}
              className="pt-10 md:pt-12 border-t border-white/[0.06]">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-white/15 text-[9px] tracking-[0.3em]">BINARIC LABS</span>
                <span className="text-white/15 text-[9px] tracking-[0.25em] hidden sm:block">OPERATING AT THE EVENT HORIZON</span>
                <span className="text-white/15 text-[9px] tracking-[0.3em] hidden md:block">EST. MMXXIV</span>
              </div>
            </motion.div>

          </motion.div>
        </div>
      </div>
    </section>
  );
}
