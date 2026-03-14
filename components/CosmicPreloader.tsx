'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function CosmicPreloader() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  // TWICE AS FAST loading
  useEffect(() => {
    const totalDuration = 2250; // WAS 4500 (cut in half)
    
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => setIsLoading(false), 200); // WAS 400
          return 100;
        }
        const increment = 100 / (totalDuration / 50);
        return Math.min(prev + increment, 100);
      });
    }, 50);

    return () => clearInterval(progressInterval);
  }, []);

  useEffect(() => {
  if (isLoading) {
    // Add a class to html/body instead of inline styles
    document.documentElement.classList.add('no-scroll');
    document.body.classList.add('no-scroll');
  } else {
    // Small delay to match animation
    setTimeout(() => {
      document.documentElement.classList.remove('no-scroll');
      document.body.classList.remove('no-scroll');
    }, 300);
  }

  return () => {
    document.documentElement.classList.remove('no-scroll');
    document.body.classList.remove('no-scroll');
  };
}, [isLoading]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0,
            transition: { duration: 0.3, ease: "easeInOut" } // WAS 0.6
          }}
          className="fixed top-0 left-0 w-screen h-screen z-[9999] bg-black flex items-center justify-center"
        >
          {/* Minimal star dots - FASTER */}
          <div className="absolute inset-0">
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-[1px] h-[1px] bg-white/40 rounded-full"
                style={{
                  left: `${10 + (i * 13) % 80}%`,
                  top: `${15 + (i * 17) % 70}%`,
                }}
                animate={{
                  opacity: [0.3, 0.7, 0.3],
                  scale: [1, 1.3, 1]
                }}
                transition={{
                  duration: 1 + i * 0.1, // WAS 2 + i * 0.2
                  repeat: Infinity,
                  delay: i * 0.05, // WAS i * 0.1
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>

          {/* Main content */}
          <div className="relative z-10 w-full max-w-md px-6">
            {/* Clean orbiting system - ALL TIMINGS HALVED */}
            <div className="relative h-48 mb-10 flex items-center justify-center">
              {/* Outer circle */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                  rotate: 360
                }}
                transition={{
                  opacity: { duration: 0.5 }, // WAS 1
                  scale: { 
                    duration: 0.6, // WAS 1.2
                    ease: [0.22, 1, 0.36, 1]
                  },
                  rotate: { 
                    duration: 20, // WAS 40
                    repeat: Infinity, 
                    ease: "linear",
                    delay: 0.25 // WAS 0.5
                  }
                }}
                className="absolute w-40 h-40 border border-white/10 rounded-full"
              />
              
              {/* Inner circle */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                  rotate: -360
                }}
                transition={{
                  opacity: { duration: 0.5, delay: 0.1 }, // WAS 1, delay: 0.2
                  scale: { 
                    duration: 0.6, // WAS 1.2
                    delay: 0.1, // WAS 0.2
                    ease: [0.22, 1, 0.36, 1] 
                  },
                  rotate: { 
                    duration: 15, // WAS 30
                    repeat: Infinity, 
                    ease: "linear",
                    delay: 0.35 // WAS 0.7
                  }
                }}
                className="absolute w-28 h-28 border border-white/15 rounded-full"
              />
              
              {/* Center dot */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: [1, 1.1, 1],
                  opacity: [0.8, 1, 0.8]
                }}
                transition={{
                  scale: { 
                    duration: 1, // WAS 2
                    repeat: Infinity, 
                    ease: "easeInOut",
                    delay: 0.4 // WAS 0.8
                  },
                  opacity: { 
                    duration: 1, // WAS 2
                    repeat: Infinity, 
                    ease: "easeInOut",
                    delay: 0.4 // WAS 0.8
                  }
                }}
                className="w-3 h-3 bg-white rounded-full z-10"
              />
              
              {/* Orbiting dot - STARTS AFTER CIRCLES ARE VISIBLE */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.25, delay: 0.75 }} // WAS 0.5, delay: 1.5
                className="absolute w-40 h-40"
              >
                <motion.div
                  animate={{
                    rotate: 360
                  }}
                  transition={{
                    duration: 4, // WAS 8
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  className="w-full h-full"
                  style={{
                    transformOrigin: 'center'
                  }}
                >
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <motion.div
                      animate={{
                        scale: [1, 1.3, 1]
                      }}
                      transition={{
                        duration: 0.5, // WAS 1
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="w-1.5 h-1.5 bg-white rounded-full"
                    />
                  </div>
                </motion.div>
              </motion.div>
            </div>

            {/* Ultra-clean progress */}
            <div className="space-y-3">
              {/* Progress bar */}
              <div className="relative h-[1px] bg-white/10 overflow-hidden">
                {/* Progress fill */}
                <motion.div
                  className="absolute top-0 left-0 h-full bg-white"
                  initial={{ width: "0%" }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.1 }} // WAS 0.2
                >
                  {/* Progress tip */}
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-white rounded-full" />
                </motion.div>
                
                {/* Scanning line */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{
                    x: ["-100%", "100%"],
                    opacity: 1
                  }}
                  transition={{
                    x: { duration: 1, repeat: Infinity, ease: "linear" }, // WAS 2
                    opacity: { duration: 0.25, delay: 0.75 } // WAS 0.5, delay: 1.5
                  }}
                  className="absolute top-0 h-full w-12 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                />
              </div>

              {/* Progress labels */}
              <div className="flex justify-between items-center">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.6 }}
                  transition={{ duration: 0.4, delay: 0.3 }} // WAS 0.8, delay: 0.6
                  className="text-gray-400 text-xs tracking-widest"
                >
                  LOADING
                </motion.div>
                
                <div className="text-white text-sm font-light tracking-widest">
                  {Math.round(progress)}%
                </div>
                
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.6 }}
                  transition={{ duration: 0.4, delay: 0.35 }} // WAS 0.8, delay: 0.7
                  className="text-gray-400 text-xs tracking-widest"
                >
                  {progress >= 100 ? "READY" : "SYNCING"}
                </motion.div>
              </div>
            </div>

            {/* Subtle text */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              transition={{ delay: 0.5, duration: 0.5 }} // WAS delay: 1, duration: 1
              className="text-center mt-8"
            >
              <p className="text-gray-500 text-xs tracking-widest">
                DIGITAL ECOSYSTEM INITIALIZED
              </p>
            </motion.div>
          </div>

          {/* Bottom line indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1 }}
            transition={{ delay: 0.75, duration: 0.5 }} // WAS delay: 1.5, duration: 1
            className="absolute bottom-8"
          >
            <div className="h-6 w-px bg-white" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}