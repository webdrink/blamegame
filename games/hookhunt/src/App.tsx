import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Music, ArrowLeft, Zap, Play, Headphones, Users, Trophy, Star, Sparkles } from 'lucide-react';
import { useAnimations } from '@game-core';

// Animation toggle component
function AnimationToggle() {
  const { animationsEnabled, toggleAnimations } = useAnimations();
  
  return (
    <button
      onClick={toggleAnimations}
      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white/80 hover:text-white text-sm"
      aria-label={animationsEnabled ? 'Disable animations' : 'Enable animations'}
    >
      {animationsEnabled ? <Zap size={16} /> : <Zap size={16} className="opacity-50" />}
      <span className="hidden sm:inline">{animationsEnabled ? 'Animations On' : 'Animations Off'}</span>
    </button>
  );
}

function App() {
  const [playerId, setPlayerId] = useState<string>('');
  const [returnUrl, setReturnUrl] = useState<string>('');
  const { animationsEnabled } = useAnimations();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pid = params.get('playerId');
    const rurl = params.get('returnUrl');
    
    if (pid) {
      setPlayerId(pid);
      localStorage.setItem('hookhunt.playerId', pid);
    }
    
    if (rurl) {
      setReturnUrl(rurl);
    }
  }, []);

  const handleReturnToHub = () => {
    if (returnUrl) {
      const url = new URL(decodeURIComponent(returnUrl));
      url.searchParams.set('playerId', playerId);
      url.searchParams.set('gameId', 'hookhunt');
      url.searchParams.set('score', '0');
      url.searchParams.set('playedAt', new Date().toISOString());
      window.location.href = url.toString();
    }
  };

  const floatingAnimation = animationsEnabled
    ? {
        y: [0, -10, 0],
        transition: {
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut'
        }
      }
    : {};

  const containerVariants = animationsEnabled
    ? {
        initial: { opacity: 0, scale: 0.95 },
        animate: { 
          opacity: 1, 
          scale: 1,
          transition: { duration: 0.5, type: 'spring', stiffness: 100 }
        }
      }
    : {
        initial: { opacity: 1, scale: 1 },
        animate: { opacity: 1, scale: 1 }
      };

  const itemVariants = animationsEnabled
    ? {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 }
      }
    : {
        initial: { opacity: 1, y: 0 },
        animate: { opacity: 1, y: 0 }
      };

  const features = [
    { icon: <Headphones size={20} />, text: 'Listen to 7-12 second hooks' },
    { icon: <Users size={20} />, text: 'Play with friends' },
    { icon: <Trophy size={20} />, text: 'Compete for high scores' },
    { icon: <Star size={20} />, text: 'Connect your Spotify' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {animationsEnabled && (
          <>
            <motion.div
              className="absolute top-20 left-10 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl"
              animate={floatingAnimation}
            />
            <motion.div
              className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl"
              animate={{ ...floatingAnimation, transition: { ...floatingAnimation.transition, delay: 1 } }}
            />
            <motion.div
              className="absolute top-1/2 left-1/3 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl"
              animate={{ ...floatingAnimation, transition: { ...floatingAnimation.transition, delay: 0.5 } }}
            />
          </>
        )}
        
        {!animationsEnabled && (
          <>
            <div className="absolute top-20 left-10 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl" />
          </>
        )}
      </div>

      {/* Settings bar */}
      <div className="absolute top-4 right-4 z-20">
        <AnimationToggle />
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <motion.div
          variants={containerVariants}
          initial="initial"
          animate="animate"
          className="max-w-2xl w-full"
        >
          {/* Main card */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20">
            {/* Decorative header */}
            <div className="h-2 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400" />
            
            <div className="p-8 md:p-12 text-center">
              {/* Icon */}
              <motion.div
                variants={itemVariants}
                initial="initial"
                animate="animate"
                transition={{ delay: 0.1 }}
                className="mb-8"
              >
                <motion.div
                  animate={animationsEnabled ? floatingAnimation : {}}
                  className="inline-block"
                >
                  <div className="relative">
                    <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 rounded-full flex items-center justify-center shadow-2xl">
                      <Music size={48} className="text-white" />
                    </div>
                    {animationsEnabled && (
                      <motion.div
                        className="absolute -top-1 -right-1"
                        animate={{ rotate: [0, 15, 0, -15, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Sparkles size={24} className="text-yellow-400" />
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              </motion.div>
              
              {/* Title */}
              <motion.h1
                variants={itemVariants}
                initial="initial"
                animate="animate"
                transition={{ delay: 0.2 }}
                className="text-5xl md:text-6xl font-extrabold text-white mb-4 tracking-tight"
              >
                Hook<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-pink-300">Hunt</span>
              </motion.h1>
              
              <motion.p
                variants={itemVariants}
                initial="initial"
                animate="animate"
                transition={{ delay: 0.3 }}
                className="text-xl text-white/90 mb-8"
              >
                Guess the hit from the hook! 🎵
              </motion.p>
              
              {/* Coming Soon Badge */}
              <motion.div
                variants={itemVariants}
                initial="initial"
                animate="animate"
                transition={{ delay: 0.4 }}
                className="mb-8"
              >
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-full border border-yellow-400/30">
                  <Sparkles size={20} className="text-yellow-400" />
                  <span className="text-yellow-300 font-semibold text-lg">Coming Soon!</span>
                </div>
              </motion.div>
              
              {/* Description */}
              <motion.div
                variants={itemVariants}
                initial="initial"
                animate="animate"
                transition={{ delay: 0.5 }}
                className="bg-white/5 rounded-2xl p-6 mb-8 border border-white/10"
              >
                <p className="text-white/80 leading-relaxed text-lg">
                  HookHunt is under development! Get ready to test your music knowledge
                  by identifying songs from their iconic hooks. Connect your Spotify playlist
                  and challenge friends to see who knows their tunes best!
                </p>
              </motion.div>

              {/* Features grid */}
              <motion.div
                variants={itemVariants}
                initial="initial"
                animate="animate"
                transition={{ delay: 0.6 }}
                className="grid grid-cols-2 gap-4 mb-8"
              >
                {features.map((feature, index) => (
                  <motion.div
                    key={feature.text}
                    className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10"
                    whileHover={animationsEnabled ? { scale: 1.02, backgroundColor: 'rgba(255,255,255,0.1)' } : {}}
                    initial={animationsEnabled ? { opacity: 0, x: -10 } : { opacity: 1, x: 0 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                  >
                    <div className="text-purple-300">{feature.icon}</div>
                    <span className="text-white/80 text-sm">{feature.text}</span>
                  </motion.div>
                ))}
              </motion.div>

              {/* Player ID */}
              {playerId && (
                <motion.div
                  variants={itemVariants}
                  initial="initial"
                  animate="animate"
                  transition={{ delay: 0.7 }}
                  className="text-sm text-white/50 mb-6 font-mono"
                >
                  Player ID: {playerId.slice(0, 8)}...
                </motion.div>
              )}
              
              {/* Action buttons */}
              <motion.div
                variants={itemVariants}
                initial="initial"
                animate="animate"
                transition={{ delay: 0.8 }}
                className="space-y-4"
              >
                {/* Disabled play button */}
                <button
                  disabled
                  className="w-full flex items-center justify-center gap-3 bg-white/20 text-white/50 font-bold py-4 px-8 rounded-2xl cursor-not-allowed"
                >
                  <Play size={20} />
                  Game Coming Soon
                </button>
                
                {/* Return to hub */}
                {returnUrl && (
                  <motion.button
                    onClick={handleReturnToHub}
                    className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 px-8 rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                    whileHover={animationsEnabled ? { scale: 1.02 } : {}}
                    whileTap={animationsEnabled ? { scale: 0.98 } : {}}
                  >
                    <ArrowLeft size={20} />
                    Back to League of Fun
                  </motion.button>
                )}
              </motion.div>
            </div>
          </div>
          
          {/* Footer */}
          <motion.footer
            initial={animationsEnabled ? { opacity: 0 } : { opacity: 1 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-center py-8 text-white/50 text-sm"
          >
            <p>Part of League of Fun 🎮</p>
          </motion.footer>
        </motion.div>
      </div>
    </div>
  );
}

export default App;
