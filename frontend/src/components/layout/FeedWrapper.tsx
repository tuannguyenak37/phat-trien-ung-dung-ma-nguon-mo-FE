// components/ui/FeedWrapper.tsx
"use client";
import { motion } from "framer-motion";
import React from "react";

export const FeedWrapper = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="space-y-6"
  >
    {children}
  </motion.div>
);