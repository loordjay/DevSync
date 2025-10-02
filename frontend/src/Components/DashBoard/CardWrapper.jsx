import React from "react";
import { motion } from "framer-motion";

export default function CardWrapper({ 
  children, 
  className = "", 
  variant = "default",
  interactive = true,
  glowing = false,
  elevated = false
}) {
  const variants = {
    default: "bg-white/80 backdrop-blur-xl border border-white/30",
    glass: "bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl",
    solid: "bg-white border border-slate-200",
    gradient: "bg-gradient-to-br from-white/90 to-slate-50/90 backdrop-blur-xl border border-white/40",
    neumorphic: "bg-gradient-to-br from-slate-50 to-white shadow-neumorphic border-0"
  };

  const baseClasses = `
    relative rounded-2xl p-6 transition-all duration-300 ease-out
    ${variants[variant]}
    ${elevated ? 'shadow-2xl shadow-slate-900/10' : 'shadow-lg shadow-slate-900/5'}
    ${glowing ? 'ring-1 ring-indigo-500/20 shadow-indigo-500/10' : ''}
    ${interactive ? 'hover:shadow-xl hover:shadow-slate-900/10 hover:-translate-y-1 cursor-pointer' : ''}
    ${className}
  `;

  if (interactive) {
    return (
      <motion.div
        className={baseClasses}
        whileHover={interactive ? { 
          y: -4,
          transition: { type: "spring", stiffness: 300, damping: 20 }
        } : {}}
        whileTap={interactive ? { scale: 0.98 } : {}}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-slate-100/30 rounded-2xl pointer-events-none" />
        
        {glowing && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-pink-500/10 rounded-2xl"
            animate={{ opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
        
        <div className="relative z-10">{children}</div>
      </motion.div>
    );
  }

  return (
    <div className={baseClasses}>
      <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-slate-100/30 rounded-2xl pointer-events-none" />
      {glowing && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-pink-500/10 rounded-2xl"
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
