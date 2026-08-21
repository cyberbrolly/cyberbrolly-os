'use client';

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export function ScreenTransition({
  children,
}: Props) {
  return (
    <motion.div
      className="h-dvh w-full min-w-0 max-w-full overflow-hidden md:h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        duration: 0.4,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  );
}
