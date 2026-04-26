import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const GlassCard = ({ children, className, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      className={twMerge(
        'luminous-glass p-6 relative',
        className
      )}
    >
      {/* Dynamic Luminous Glow in Background */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary-500/10 blur-[80px] pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-blue-500/10 blur-[80px] pointer-events-none" />
      
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};


export default GlassCard;
