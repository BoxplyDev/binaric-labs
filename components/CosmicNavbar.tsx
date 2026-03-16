'use client';

import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { useState } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function CosmicNavbar() {
  const { scrollY } = useScroll();
  const [isAtBottom, setIsAtBottom] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setIsScrolled(latest > 10);
    const bottom = document.documentElement.scrollHeight - window.innerHeight - 200;
    setIsAtBottom(latest >= bottom);
  });

  const navItems = [
    { label: 'Packages',  href: '#packages'  },
    { label: 'Portfolio', href: '#portfolio' },
  ];

  return (
    <>
      {/* Desktop */}
      <motion.nav
        animate={{ y: isAtBottom ? -80 : 0, opacity: isAtBottom ? 0 : 1 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20, opacity: { duration: 0.3 } }}
        className="fixed top-0 left-0 right-0 z-50 hidden md:block">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
        <div className="transition-all duration-500" style={{
          background: isScrolled ? 'rgba(0,0,0,0.85)' : 'rgba(0,0,0,0)',
          backdropFilter: isScrolled ? 'blur(12px)' : 'none',
          borderBottom: isScrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
        }}>
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex items-center justify-between h-16 relative">
              <Link href="/">
                <motion.div whileHover="hover" className="flex items-center gap-3 cursor-pointer">
                  <div>
                    <span className="text-white font-bold tracking-tighter text-base leading-none block">BINARIC</span>
                    <span className="text-white/30 text-[9px] tracking-[0.4em] font-light block">LABS</span>
                  </div>
                  <motion.div variants={{ hover: { opacity: 1, width: 16 } }}
                    initial={{ opacity: 0, width: 0 }}
                    className="h-px bg-white/20 overflow-hidden" transition={{ duration: 0.3 }} />
                </motion.div>
              </Link>

              <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-10">
                {navItems.map((item) => (
                  <motion.a key={item.label} href={item.href} whileHover="hover"
                    className="relative text-white/40 hover:text-white/80 text-[11px] tracking-[0.3em] uppercase font-light py-2 transition-colors duration-200">
                    {item.label}
                    <motion.div variants={{ hover: { scaleX: 1, opacity: 1 } }}
                      initial={{ scaleX: 0, opacity: 0 }} style={{ originX: 0 }}
                      className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-white/40 via-white/60 to-transparent"
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }} />
                  </motion.a>
                ))}
              </div>

              <Link href="/demo">
                <motion.button whileHover="hover" whileTap={{ scale: 0.98 }} className="group relative px-6 py-2.5">
                  <div className="absolute inset-0 border border-white/15 group-hover:border-white/35 transition-colors duration-300" />
                  {['top-0 left-0 border-l border-t', 'top-0 right-0 border-r border-t', 'bottom-0 left-0 border-l border-b', 'bottom-0 right-0 border-r border-b'].map((pos, i) => (
                    <motion.div key={i} variants={{ hover: { opacity: 1 } }} initial={{ opacity: 0 }}
                      transition={{ duration: 0.2 }} className={`absolute w-2 h-2 border-white/60 ${pos}`} />
                  ))}
                  <motion.div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent"
                    initial={{ scaleX: 0, opacity: 0 }}
                    variants={{ hover: { scaleX: 1, opacity: 1, transition: { duration: 0.35, ease: 'easeOut' } } }} />
                  <div className="relative flex items-center gap-3">
                    <span className="text-white/80 text-[11px] tracking-[0.25em] uppercase font-light">Book a Demo</span>
                    <motion.div variants={{ hover: { x: 3, rotate: 45 } }} transition={{ type: 'spring', stiffness: 400, damping: 25 }}>
                      <div className="w-2.5 h-2.5 border-r border-t border-white/50 rotate-45" />
                    </motion.div>
                  </div>
                </motion.button>
              </Link>
            </div>
          </div>
        </div>
        <motion.div animate={{ opacity: isScrolled ? 1 : 0 }} transition={{ duration: 0.4 }}
          className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent pointer-events-none" />
      </motion.nav>

      {/* Mobile */}
      <motion.nav
        animate={{ y: isAtBottom ? -80 : 0, opacity: isAtBottom ? 0 : 1 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        className="fixed top-0 left-0 right-0 z-50 md:hidden"
        style={{ background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/12 to-transparent" />
        <div className="px-4">
          <div className="flex items-center justify-between h-14">
            <Link href="/">
              <div className="flex items-center gap-2 cursor-pointer">
                <span className="text-white font-bold tracking-tighter text-sm">BINARIC</span>
                <span className="text-white/20 text-[8px] tracking-[0.4em] font-light">LABS</span>
              </div>
            </Link>
            <motion.button whileTap={{ scale: 0.93 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="relative w-9 h-9 flex items-center justify-center border border-white/12">
              <motion.div animate={{ rotate: isMobileMenuOpen ? 90 : 0 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}>
                {isMobileMenuOpen ? <X className="w-4 h-4 text-white/70" /> : <Menu className="w-4 h-4 text-white/70" />}
              </motion.div>
            </motion.button>
          </div>

          <motion.div initial={false}
            animate={{ height: isMobileMenuOpen ? 'auto' : 0, opacity: isMobileMenuOpen ? 1 : 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden">
            <div className="border-t border-white/[0.06] py-4 space-y-1">
              {navItems.map((item, i) => (
                <motion.a key={item.label} href={item.href}
                  initial={{ opacity: 0, x: -12 }}
                  animate={isMobileMenuOpen ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: i * 0.07, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-white/40 hover:text-white/80 text-[11px] tracking-[0.3em] uppercase font-light py-3 px-2 transition-colors duration-200">
                  {item.label}
                </motion.a>
              ))}
              <motion.div initial={{ opacity: 0, y: 8 }}
                animate={isMobileMenuOpen ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.18, duration: 0.3 }} className="pt-3 px-2">
                <Link href="/demo">
                  <button onClick={() => setIsMobileMenuOpen(false)}
                    className="group relative w-full py-3 border border-white/12 hover:border-white/30 transition-colors duration-300">
                    <div className="flex items-center justify-between px-4">
                      <span className="text-white/70 text-[11px] tracking-[0.25em] uppercase font-light">Book a Demo</span>
                      <ArrowRight className="w-3.5 h-3.5 text-white/30" />
                    </div>
                  </button>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.nav>
    </>
  );
}
