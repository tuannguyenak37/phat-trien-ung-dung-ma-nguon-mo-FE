"use client";
import { motion } from "framer-motion";
import React from "react";

export const FeedWrapper = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 20, scale: 0.98 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ duration: 0.45, ease: "easeOut" }}
    className="
      space-y-6 
      p-2 
      rounded-2xl 
      backdrop-blur-sm 
      bg-white/60 
      shadow-[0_4px_20px_-8px_rgba(0,0,0,0.08)]
      dark:bg-slate-800/40
      dark:shadow-[0_4px_20px_-8px_rgba(0,0,0,0.35)]
    "
  >
    {children}
  </motion.div>
);
