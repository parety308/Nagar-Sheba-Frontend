"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

// Opacity only: a transform here would break fixed/sticky descendants.
export default function Template({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
