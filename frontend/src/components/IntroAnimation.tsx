import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface IntroAnimationProps {
  onComplete: () => void;
}

const IntroAnimation = ({ onComplete }: IntroAnimationProps) => {
  const [phase, setPhase] = useState<'banner' | 'folding' | 'cup' | 'slide' | 'reveal' | 'complete'>('banner');

  useEffect(() => {
    // Scene 1: Banner breathes (2s)
    const bannerTimer = setTimeout(() => setPhase('folding'), 2000);
    
    // Scene 2: Folding animation (2s)
    const foldTimer = setTimeout(() => setPhase('cup'), 4000);
    
    // Scene 3: Cup reveal with steam (0.8s)
    const cupTimer = setTimeout(() => setPhase('slide'), 4800);
    
    // Scene 4: Slide right (1.2s)
    const slideTimer = setTimeout(() => setPhase('reveal'), 6000);
    
    // Scene 5: Homepage reveal (1.5s)
    const revealTimer = setTimeout(() => setPhase('complete'), 7500);
    
    // Complete
    const completeTimer = setTimeout(() => onComplete(), 8000);

    return () => {
      clearTimeout(bannerTimer);
      clearTimeout(foldTimer);
      clearTimeout(cupTimer);
      clearTimeout(slideTimer);
      clearTimeout(revealTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  const isFolding = phase === 'folding' || phase === 'cup' || phase === 'slide' || phase === 'reveal';
  const isCupFormed = phase === 'cup' || phase === 'slide' || phase === 'reveal';
  const isSliding = phase === 'slide' || phase === 'reveal';
  const showHomepage = phase === 'reveal';

  return (
    <AnimatePresence>
      {phase !== 'complete' && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
          style={{ backgroundColor: '#0F0B08' }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Background ambient gradient */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{ 
              background: 'radial-gradient(ellipse at center, rgba(26, 20, 16, 0.4) 0%, transparent 70%)' 
            }}
          />

          {/* Subtle coffee aroma particles */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(20)].map((_, i) => {
              const size = Math.random() * 4 + 2;
              const startX = 30 + Math.random() * 40;
              const driftX = (Math.random() - 0.5) * 30;
              const delay = Math.random() * 3;
              const duration = 4 + Math.random() * 3;
              
              return (
                <motion.div
                  key={`particle-${i}`}
                  className="absolute rounded-full"
                  style={{
                    width: size,
                    height: size,
                    left: `${startX}%`,
                    bottom: '30%',
                    background: `radial-gradient(circle, rgba(212, 196, 168, ${0.3 + Math.random() * 0.2}) 0%, transparent 70%)`,
                    boxShadow: `0 0 ${size * 2}px rgba(212, 196, 168, 0.15)`,
                  }}
                  animate={{
                    y: [-20, -200 - Math.random() * 150],
                    x: [0, driftX],
                    opacity: [0, 0.6, 0.4, 0],
                    scale: [0.5, 1.2, 0.8],
                  }}
                  transition={{
                    duration: duration,
                    delay: delay,
                    repeat: Infinity,
                    ease: "easeOut",
                  }}
                />
              );
            })}
          </div>

          {/* Background steam wisps - only in banner phase */}
          {phase === 'banner' && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 rounded-full"
                  style={{
                    left: `${35 + i * 8}%`,
                    bottom: '35%',
                    height: '100px',
                    background: 'linear-gradient(to top, transparent, rgba(212, 196, 168, 0.15))',
                  }}
                  animate={{
                    y: [-10, -60],
                    opacity: [0.15, 0],
                    scaleY: [1, 1.3],
                  }}
                  transition={{
                    duration: 2.5,
                    delay: i * 0.3,
                    repeat: Infinity,
                    ease: "easeOut",
                  }}
                />
              ))}
            </div>
          )}

          {/* Homepage content sliding in from left - Scene 5 */}
          <AnimatePresence>
            {showHomepage && (
              <motion.div
                className="absolute inset-0 pointer-events-none z-10"
                initial={{ x: '-100%', opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ 
                  duration: 1.4, 
                  ease: [0.4, 0, 0.2, 1],
                  opacity: { duration: 0.8 }
                }}
              >
                <div 
                  className="w-full h-full"
                  style={{ 
                    background: 'linear-gradient(135deg, #0F0B08 0%, #1a1410 50%, #0F0B08 100%)',
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main folding banner/cup container */}
          <motion.div
            className="relative flex items-center justify-center z-20"
            style={{
              backgroundColor: isCupFormed ? '#f5f0d9' : '#1a1410',
              border: isCupFormed 
                ? '5px solid #f5f0d9' 
                : '2px solid rgba(212, 196, 168, 0.2)',
              boxShadow: isCupFormed 
                ? '0 20px 60px rgba(0,0,0,0.5), inset 0 -20px 40px rgba(0,0,0,0.1)' 
                : '0 10px 40px rgba(0,0,0,0.3)',
            }}
            initial={{ 
              width: "80vw", 
              maxWidth: "900px",
              height: "280px",
              borderRadius: "12px",
              x: 0,
              scale: 1,
            }}
            animate={{ 
              width: isFolding ? "160px" : "80vw",
              maxWidth: isFolding ? "160px" : "900px",
              height: isFolding ? "180px" : "280px",
              borderRadius: isFolding ? "0px 0px 80px 80px" : "12px",
              x: isSliding ? "30vw" : 0,
              scale: isSliding ? 0.9 : 1,
            }}
            transition={{ 
              duration: isFolding && !isCupFormed ? 2 : 1.2,
              ease: [0.4, 0, 0.2, 1],
              width: { 
                duration: isFolding && !isCupFormed ? 1.3 : 1.2, 
                ease: [0.6, 0, 0.2, 1] 
              },
              height: { 
                duration: isFolding && !isCupFormed ? 1.5 : 1.2, 
                delay: isFolding && !isCupFormed ? 0.3 : 0,
                ease: [0.6, 0, 0.2, 1] 
              },
              borderRadius: { 
                duration: isFolding && !isCupFormed ? 1.6 : 1.2, 
                delay: isFolding && !isCupFormed ? 0.5 : 0,
                ease: [0.4, 0, 0.2, 1] 
              },
              x: { duration: 1.2, ease: [0.4, 0, 0.2, 1] },
              scale: { duration: 1.2, ease: [0.4, 0, 0.2, 1] },
            }}
          >
            {/* Fold shadow overlays - creates depth during folding */}
            {isFolding && !isCupFormed && (
              <>
                {/* Left fold shadow */}
                <motion.div
                  className="absolute inset-y-0 left-0 pointer-events-none z-30"
                  style={{ 
                    background: 'linear-gradient(to right, rgba(0,0,0,0.5), transparent)',
                    borderRadius: 'inherit',
                  }}
                  initial={{ width: '0%' }}
                  animate={{ width: '35%' }}
                  transition={{ duration: 1.3, ease: [0.4, 0, 0.2, 1] }}
                />
                {/* Right fold shadow */}
                <motion.div
                  className="absolute inset-y-0 right-0 pointer-events-none z-30"
                  style={{ 
                    background: 'linear-gradient(to left, rgba(0,0,0,0.5), transparent)',
                    borderRadius: 'inherit',
                  }}
                  initial={{ width: '0%' }}
                  animate={{ width: '35%' }}
                  transition={{ duration: 1.3, ease: [0.4, 0, 0.2, 1] }}
                />
                {/* Top fold shadow */}
                <motion.div
                  className="absolute inset-x-0 top-0 pointer-events-none z-30"
                  style={{ 
                    background: 'linear-gradient(to bottom, rgba(0,0,0,0.4), transparent)',
                    borderRadius: 'inherit',
                  }}
                  initial={{ height: '0%' }}
                  animate={{ height: '30%' }}
                  transition={{ duration: 1.3, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
                />
                {/* Bottom fold crease highlight */}
                <motion.div
                  className="absolute inset-x-0 bottom-0 pointer-events-none z-30"
                  style={{ 
                    background: 'linear-gradient(to top, rgba(212, 196, 168, 0.1), transparent)',
                    borderRadius: 'inherit',
                  }}
                  initial={{ height: '0%' }}
                  animate={{ height: '20%' }}
                  transition={{ duration: 1, delay: 0.6, ease: [0.4, 0, 0.2, 1] }}
                />
              </>
            )}

            {/* Banner text - shrinks WITH the banner */}
            <motion.div
              className="flex flex-col items-center justify-center z-20 relative"
              initial={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              animate={{ 
                opacity: isFolding ? 0 : 1, 
                scale: isFolding ? 0.2 : 1, 
                filter: isFolding ? "blur(12px)" : "blur(0px)" 
              }}
              transition={{ 
                duration: 1.6, 
                ease: [0.4, 0, 0.2, 1],
                opacity: { duration: 1.2, delay: 0.3 },
                filter: { duration: 1, delay: 0.2 },
              }}
            >
              <motion.h1
                className="font-bold tracking-[0.35em] uppercase whitespace-nowrap"
                style={{
                  color: '#f5f0d9',
                  fontSize: 'clamp(2.5rem, 7vw, 5.5rem)',
                  fontFamily: "'Playfair Display', serif",
                  textShadow: '0 4px 30px rgba(0,0,0,0.4)',
                }}
              >
                RABUSTE
              </motion.h1>
              
              <motion.div
                className="mt-4 h-px bg-gradient-to-r from-transparent via-amber-700/50 to-transparent"
                style={{ width: '50%' }}
              />
              
              <motion.p
                className="mt-4 tracking-[0.4em] uppercase text-sm"
                style={{ 
                  color: 'rgba(168, 144, 112, 0.7)', 
                  fontFamily: "'Inter', sans-serif" 
                }}
              >
                Bold Robusta Coffee
              </motion.p>
            </motion.div>

            {/* Coffee cup interior - appears as banner fully folds */}
            <AnimatePresence>
              {isCupFormed && (
                <>
                  {/* Coffee liquid */}
                  <motion.div
                    className="absolute z-10"
                    style={{
                      background: 'linear-gradient(to top, #1a0f0a 0%, #2d1810 40%, #4a2c20 100%)',
                      width: '80%',
                      height: '70%',
                      bottom: '8%',
                      left: '10%',
                      borderRadius: '0 0 65px 65px',
                    }}
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                  />
                  
                  {/* Coffee bean silhouette */}
                  <motion.div
                    className="absolute z-20 flex items-center justify-center"
                    style={{
                      width: '45px',
                      height: '60px',
                      bottom: '20%',
                      left: '50%',
                      transform: 'translateX(-50%)',
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.5 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <svg viewBox="0 0 45 60" fill="none" className="w-full h-full">
                      <ellipse cx="22.5" cy="30" rx="18" ry="26" fill="#f5f0d9" opacity="0.25"/>
                      <path d="M22.5 8 Q18 30 22.5 52" stroke="#f5f0d9" strokeWidth="2.5" fill="none" opacity="0.3"/>
                    </svg>
                  </motion.div>
                  
                  {/* Rim highlight */}
                  <motion.div
                    className="absolute top-0 left-0 right-0 z-30"
                    style={{
                      height: '8px',
                      background: 'linear-gradient(to bottom, #f5f0d9, #e8e0c8)',
                      borderRadius: '4px 4px 0 0',
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                  />
                </>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Cup handle - appears when cup is formed */}
          <AnimatePresence>
            {isCupFormed && (
              <motion.div
                className="absolute z-20"
                style={{
                  width: '45px',
                  height: '75px',
                  border: '5px solid #f5f0d9',
                  borderLeft: 'none',
                  borderRadius: '0 40px 40px 0',
                  boxShadow: '5px 5px 20px rgba(0,0,0,0.3)',
                }}
                initial={{ 
                  opacity: 0, 
                  x: 'calc(50% + 75px)', 
                  y: '10px',
                  scale: 0.5 
                }}
                animate={{ 
                  opacity: 1, 
                  x: isSliding ? 'calc(50% + 30vw + 75px)' : 'calc(50% + 75px)', 
                  y: '10px',
                  scale: isSliding ? 0.9 : 1,
                }}
                transition={{ 
                  duration: isCupFormed && !isSliding ? 0.6 : 1.2, 
                  delay: isCupFormed && !isSliding ? 0.2 : 0,
                  ease: [0.4, 0, 0.2, 1] 
                }}
              />
            )}
          </AnimatePresence>

          {/* Saucer - appears when cup is formed */}
          <AnimatePresence>
            {isCupFormed && (
              <motion.div
                className="absolute z-15"
                style={{
                  width: '200px',
                  height: '16px',
                  background: 'linear-gradient(to right, #c8c0a8, #f5f0d9 30%, #f5f0d9 70%, #c8c0a8)',
                  borderRadius: '50%',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
                }}
                initial={{ 
                  opacity: 0, 
                  scaleX: 0,
                  x: '-50%',
                  y: '110px',
                  left: '50%',
                }}
                animate={{ 
                  opacity: 1, 
                  scaleX: isSliding ? 0.9 : 1,
                  x: isSliding ? 'calc(-50% + 30vw)' : '-50%',
                  y: '110px',
                  left: '50%',
                }}
                transition={{ 
                  duration: isCupFormed && !isSliding ? 0.6 : 1.2, 
                  delay: isCupFormed && !isSliding ? 0.3 : 0,
                  ease: [0.4, 0, 0.2, 1] 
                }}
              />
            )}
          </AnimatePresence>

          {/* Steam wisp - appears after cup is formed */}
          <AnimatePresence>
            {isCupFormed && (
              <motion.div
                className="absolute z-25 pointer-events-none"
                initial={{ 
                  opacity: 0,
                  x: '-50%',
                  y: '-130px',
                  left: '50%',
                }}
                animate={{ 
                  opacity: 1,
                  x: isSliding ? 'calc(-50% + 30vw)' : '-50%',
                  y: '-130px',
                  left: '50%',
                }}
                transition={{ 
                  duration: isSliding ? 1.2 : 0.5, 
                  delay: isSliding ? 0 : 0.4,
                  ease: [0.4, 0, 0.2, 1] 
                }}
              >
                <svg width="70" height="90" viewBox="0 0 70 90" fill="none">
                  <motion.path
                    d="M35 90 Q28 70 35 50 Q42 30 35 15 Q28 5 35 0"
                    stroke="rgba(212, 196, 168, 0.5)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    fill="none"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.6 }}
                    transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
                  />
                  <motion.path
                    d="M25 85 Q18 65 25 45 Q32 25 25 10"
                    stroke="rgba(212, 196, 168, 0.35)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    fill="none"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.4 }}
                    transition={{ duration: 1.4, delay: 0.7, ease: "easeOut" }}
                  />
                  <motion.path
                    d="M45 82 Q52 62 45 42 Q38 22 45 8"
                    stroke="rgba(212, 196, 168, 0.25)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    fill="none"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.3 }}
                    transition={{ duration: 1.3, delay: 0.9, ease: "easeOut" }}
                  />
                </svg>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default IntroAnimation;
