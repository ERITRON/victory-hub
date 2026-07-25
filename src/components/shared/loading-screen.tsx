/*
 * Victory Hub - Loading Screen
 * Animated splash screen shown on initial load
 */

'use client';

import { motion } from 'framer-motion';
import { GraduationCap } from 'lucide-react';

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="flex flex-col items-center gap-4"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 p-4 text-white shadow-xl"
        >
          <GraduationCap className="h-10 w-10" />
        </motion.div>
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-bold bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent"
        >
          Victory Hub
        </motion.h1>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: 120 }}
          transition={{ delay: 0.5, duration: 1.5, ease: 'easeInOut' }}
          className="h-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-600"
        />
      </motion.div>
    </div>
  );
}
