// components/ui/FeedWrapper.tsx
"use client";
import { motion } from "framer-motion";
import React from "react";

export const FeedWrapper = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 20, scale: 0.98 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{
      duration: 0.45,
      ease: "easeOut",
    }}
    className="space-y-8 font-semibold"
  >
    {children}
  </motion.div>
);
