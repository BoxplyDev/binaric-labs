'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { Search, Palette, Rocket, Settings, Sparkles, Zap, Cpu, Users, Shield, ArrowRight } from 'lucide-react';

type TimelineItem = {
  step: number;
  icon: React.FC<{ className?: string }>;
  title: string; subtitle: string; description: string;
  highlights: string[];
  color: string; border: string; accent: string; delay: number;
};

function TimelineCard({ item, isLast }: { item: TimelineItem; isLast: boolean }) {
  const [hovered, setHovered] = useState(false);
  const Icon = item.icon;
  return (
    <div className="relative grid grid-cols-[36px_1fr] md:grid-cols-[64px_1fr]"
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <div className="relative flex flex-col items-center">
        <div className={`absolute top-0 bottom-0 w-px ${isLast ? 'h-8' : 'h-full'}`}
          style={{ left: '50%', transform: 'translateX(-50%)' }}>
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-white/12 to-white/5" />
          {item.step === 1 && (
            <motion.div className="absolute w-full"
              style={{ height: '200px', background: 'linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.55) 50%, transparent 100%)' }}
              animate={{ y: ['-200px', '1120px'] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'linear', repeatDelay: 0.6 }}
            />
          )}
        </div>
        <div className="relative z-10 mt-1">
          <motion.div animate={{ scale: hovered ? 1.7 : 1, opacity: hovered ? 1 : 0.45 }}
            transition={{ duration: 0.28 }} className="w-[5px] h-[5px] rounded-full bg-white" />
          {hovered && (
            <motion.div key="pulse" initial={{ scale: 1, opacity: 0.55 }} animate={{ scale: 4, opacity: 0 }}
              transition={{ duration: 0.65, ease: 'easeOut' }}
              className="absolute inset-0 rounded-full border border-white/50" style={{ margin: '-2px' }} />
          )}
        </div>
        <motion.span animate={{ opacity: hovered ? 0.55 : 0.18 }} transition={{ duration: 0.28 }}
          className="mt-2 text-[8px] tracking-[0.2em] font-light text-white select-none">
          {String(item.step).padStart(2, '0')}
        </motion.span>
      </div>

      <div className="pb-10 md:pb-20 pl-4 md:pl-10">
        <motion.div animate={{ x: hovered ? 4 : 0 }} transition={{ type: 'spring', stiffness: 260, damping: 24 }}>
          <div className="flex items-center gap-3 mb-4">
            <motion.div
              animate={{ borderColor: hovered ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.07)', backgroundColor: hovered ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.02)' }}
              transition={{ duration: 0.3 }}
              className="w-8 h-8 border flex items-center justify-center shrink-0">
              <Icon className="w-3.5 h-3.5 text-white/60" />
            </motion.div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xs md:text-sm font-bold tracking-[0.15em] md:tracking-[0.22em] text-white/90">{item.title}</h3>
                <motion.div animate={{ opacity: hovered ? 0.55 : 0.2, rotate: hovered ? 15 : 0 }} transition={{ duration: 0.3 }}>
                  <Sparkles className="w-2.5 h-2.5 text-white" />
                </motion.div>
              </div>
              <p className="text-[9px] tracking-[0.15em] text-white/30 mt-0.5">{item.subtitle}</p>
            </div>
          </div>
          <p className="text-white/38 text-xs md:text-sm leading-[1.85] mb-4 max-w-lg font-light">{item.description}</p>
          <div className="flex flex-wrap gap-x-3 gap-y-1.5 mb-4">
            {item.highlights.map((h) => (
              <motion.span key={h} animate={{ color: hovered ? 'rgba(255,255,255,0.48)' : 'rgba(255,255,255,0.2)' }}
                transition={{ duration: 0.28 }} className="text-[9px] tracking-[0.18em]">— {h}</motion.span>
            ))}
          </div>
          <motion.div className="h-px bg-gradient-to-r from-white/18 to-transparent"
            animate={{ scaleX: hovered ? 1 : 0.1, opacity: hovered ? 1 : 0.3 }}
            style={{ originX: 0 }} transition={{ duration: 0.4, ease: 'easeOut' }} />
        </motion.div>
      </div>
    </div>
  );
}

export default function ProcessPillars() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredPillar, setHoveredPillar] = useState<number | null>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] });
  const { ref, inView } = useInView({ threshold: 0.05, triggerOnce: false });

  const opacity = useTransform(scrollYProgress, [0, 0.05], [0.3, 1]);
  const scale   = useTransform(scrollYProgress, [0, 0.1],  [0.98, 1]);
  const y1 = useTransform(scrollYProgress, [0, 1], ['0%', '-20%']);
  const y2 = useTransform(scrollYProgress, [0, 1], ['0%', '-10%']);
  const y3 = useTransform(scrollYProgress, [0, 1], ['0%', '-5%']);

  const timeline: TimelineItem[] = [
    { step: 1, icon: Search,   title: 'DISCOVERY',    subtitle: 'Cosmic Analysis',     description: 'We analyze your digital position and gravitational pull, mapping your trajectory through the competitive cosmos.', highlights: ['Brand Gravity', 'Market Mapping', 'Goal Definition', 'Strategy Blueprint'], color: '', border: '', accent: '', delay: 0   },
    { step: 2, icon: Palette,  title: 'DESIGN',       subtitle: 'Orbital Architecture', description: 'Crafting visual systems that maintain perfect alignment with your objectives and audience expectations.',        highlights: ['UX/UI Design', 'Visual Identity', 'Content Strategy', 'Brand System'],         color: '', border: '', accent: '', delay: 0.1 },
    { step: 3, icon: Rocket,   title: 'DEVELOPMENT',  subtitle: 'Launch Sequence',      description: 'Precision engineering and deployment of your digital presence with flawless technical execution.',              highlights: ['Frontend', 'Backend', 'Performance', 'Security'],                             color: '', border: '', accent: '', delay: 0.2 },
    { step: 4, icon: Settings, title: 'OPTIMIZATION', subtitle: 'Perpetual Orbit',      description: 'Continuous monitoring and strategic course corrections to maintain perfect digital synchronization.',             highlights: ['Analytics', 'SEO', 'Maintenance', 'Growth'],                                 color: '', border: '', accent: '', delay: 0.3 },
  ];

  const pillars = [
    { id: 1, icon: Cpu,    title: 'TECHNICAL MASTERY',  description: 'Modern stacks, optimized performance, scalable architecture built for cosmic scale.',  delay: 0   },
    { id: 2, icon: Users,  title: 'STRATEGIC INSIGHT',  description: 'Data-driven decisions, audience understanding, and precise market navigation.',         delay: 0.1 },
    { id: 3, icon: Zap,    title: 'PERFORMANCE FOCUS',  description: 'Optimized for speed, conversion, and seamless user experience across all orbits.',      delay: 0.2 },
    { id: 4, icon: Shield, title: 'COSMIC RELIABILITY', description: 'Secure, stable, 99.9% uptime, and consistent performance across the digital galaxy.',   delay: 0.3 },
  ];

  const particles = Array.from({ length: 25 }, (_, i) => ({
    x: (i * 37) % 100, y: (i * 23) % 100, size: 0.5 + ((i * 7) % 10) * 0.1,
    delay: (i * 13) % 3000 / 1000, duration: 2 + ((i * 11) % 4),
  }));

  return (
    <section ref={ref} className="relative bg-black overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900/20 to-black" />
        <motion.div style={{ y: y1 }} className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-gradient-to-br from-white/[0.025] via-transparent to-transparent rounded-full blur-3xl" />
        </motion.div>
        <motion.div style={{ y: y2 }} className="absolute inset-0 opacity-[0.07]">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(90deg, transparent 49%, rgba(255,255,255,0.1) 50%, transparent 51%), linear-gradient(0deg, transparent 49%, rgba(255,255,255,0.1) 50%, transparent 51%)`,
            backgroundSize: '80px 80px',
          }} />
        </motion.div>
        <motion.div style={{ y: y3 }} className="absolute inset-0">
          {particles.map((p, i) => (
            <div key={i} className="absolute bg-white/15 rounded-full"
              style={{ width: `${p.size}px`, height: `${p.size}px`, left: `${p.x}%`, top: `${p.y}%` }} />
          ))}
        </motion.div>
      </div>

      <div ref={containerRef} className="relative z-10">
        <div className="container mx-auto px-4 sm:px-6 py-20 md:py-32">
          <motion.div style={{ opacity, scale }} className="max-w-6xl mx-auto">

            {/* Header */}
            <div className="mb-16 md:mb-32">
              <div className="overflow-hidden mb-8">
                <motion.div
                  initial={{ y: 80, opacity: 0 }}
                  animate={inView ? { y: 0, opacity: 1 } : {}}
                  transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                  className="text-center"
                >
                  <span className="text-white/20 text-[10px] md:text-sm tracking-[0.3em] block mb-4 md:mb-6">METHODOLOGY</span>
                  <h2 className="font-bold tracking-tighter leading-none"
                    style={{ fontSize: 'clamp(2.2rem, 9vw, 6rem)' }}>
                    <span className="text-white block">PROCESS</span>
                    <span className="text-white/30 block">ARCHITECTURE</span>
                  </h2>
                </motion.div>
              </div>
              <motion.div
                initial={{ scaleX: 0 }} animate={inView ? { scaleX: 1 } : {}}
                transition={{ duration: 1.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="h-px bg-gradient-to-r from-transparent via-white/30 to-transparent w-full max-w-xl mx-auto"
              />
              <motion.p
                initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="text-white/40 text-sm md:text-base max-w-xl mt-8 mx-auto text-center font-light"
              >
                Precision-engineered methodology for digital escape velocity.
              </motion.p>
            </div>

            {/* Timeline */}
            <div className="mb-20 md:mb-48">
              {timeline.map((item, i) => (
                <motion.div key={item.step}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.15 }}
                  transition={{ duration: 0.8, delay: item.delay, ease: [0.22, 1, 0.36, 1] }}>
                  <TimelineCard item={item} isLast={i === timeline.length - 1} />
                </motion.div>
              ))}
            </div>

            {/* Core Pillars */}
            <div className="mb-20 md:mb-48">
              <div className="mb-10 md:mb-20">
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ duration: 0.8 }}>
                  <span className="text-white/20 text-[10px] md:text-sm tracking-[0.3em] block mb-4 md:mb-6">CORE PILLARS</span>
                  <h2 className="font-bold tracking-tighter leading-none"
                    style={{ fontSize: 'clamp(1.8rem, 7vw, 3.5rem)' }}>
                    <span className="text-white block">BUILT ON</span>
                    <span className="text-white/30 block">PRINCIPLE</span>
                  </h2>
                </motion.div>
                <motion.div initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="h-px bg-gradient-to-r from-white/20 to-transparent w-full max-w-xl mt-8"
                  style={{ originX: 0 }} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/[0.06]">
                {pillars.map((pillar) => {
                  const Icon = pillar.icon;
                  const isHovered = hoveredPillar === pillar.id;
                  return (
                    <motion.div key={pillar.id}
                      initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.75, delay: pillar.delay, ease: [0.22, 1, 0.36, 1] }}
                      onMouseEnter={() => setHoveredPillar(pillar.id)}
                      onMouseLeave={() => setHoveredPillar(null)}
                      className="relative bg-black p-6 md:p-8 overflow-hidden cursor-default">
                      <motion.div className="absolute inset-0 pointer-events-none"
                        animate={{ opacity: isHovered ? 1 : 0 }} transition={{ duration: 0.35 }}
                        style={{ background: 'radial-gradient(ellipse at 30% 30%, rgba(255,255,255,0.04) 0%, transparent 70%)' }} />
                      <motion.div
                        animate={{ borderColor: isHovered ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.07)' }}
                        transition={{ duration: 0.3 }}
                        className="w-9 h-9 border flex items-center justify-center mb-6">
                        <Icon className="w-3.5 h-3.5 text-white/50" />
                      </motion.div>
                      <motion.h4
                        animate={{ color: isHovered ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.7)' }}
                        transition={{ duration: 0.3 }}
                        className="text-xs font-bold tracking-[0.18em] mb-3">{pillar.title}</motion.h4>
                      <motion.p
                        animate={{ color: isHovered ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.25)' }}
                        transition={{ duration: 0.3 }}
                        className="text-xs leading-[1.85] font-light">{pillar.description}</motion.p>
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"
                        animate={{ scaleX: isHovered ? 1 : 0, opacity: isHovered ? 1 : 0 }}
                        style={{ originX: 0 }} transition={{ duration: 0.4, ease: 'easeOut' }} />
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* CTA */}
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.8 }}
              className="text-center">
              <motion.div initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }}
                viewport={{ once: true }} transition={{ duration: 1.2 }}
                className="h-px bg-gradient-to-r from-transparent via-white/15 to-transparent w-full max-w-md mx-auto mb-12" />
              <div className="inline-block">
                <motion.button whileHover="hover" whileTap="tap" className="group relative px-8 md:px-14 py-4 md:py-5">
                  <div className="absolute inset-0 border border-white/15 group-hover:border-white/35 transition-colors duration-300" />
                  <motion.div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent"
                    initial={{ scaleX: 0, opacity: 0 }}
                    variants={{ hover: { scaleX: 1, opacity: 1, transition: { duration: 0.35, ease: 'easeOut' } } }} />
                  <div className="relative flex items-center gap-5 md:gap-8">
                    <span className="text-white/80 tracking-[0.2em] text-xs uppercase font-light">Begin Your Journey</span>
                    <motion.div variants={{ hover: { x: 5 } }} transition={{ type: 'spring', stiffness: 400, damping: 25 }}>
                      <ArrowRight className="w-4 h-4 text-white/50 group-hover:text-white/80 transition-colors duration-300" />
                    </motion.div>
                  </div>
                </motion.button>
              </div>
              <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
                viewport={{ once: true }} transition={{ duration: 1, delay: 0.3 }}
                className="text-white/15 text-[9px] mt-8 tracking-[0.35em]">ESCAPE VELOCITY AWAITS</motion.p>
            </motion.div>

            {/* Footer rule */}
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
              viewport={{ once: true }} transition={{ duration: 1 }}
              className="mt-20 md:mt-32 pt-10 border-t border-white/[0.06]">
              <div className="flex items-center justify-center gap-4">
                <div className="h-px flex-1 max-w-[80px] bg-gradient-to-r from-transparent to-white/10" />
                <span className="text-white/20 text-[9px] tracking-[0.3em]">PROCESS COMPLETE</span>
                <div className="h-px flex-1 max-w-[80px] bg-gradient-to-l from-transparent to-white/10" />
              </div>
            </motion.div>

          </motion.div>
        </div>
      </div>
    </section>
  );
}
