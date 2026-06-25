"use client";

import { motion } from "motion/react";

type Props = {
  text: string;
  delay?: number;
  stagger?: number;
  startIndex?: number;
};

// Reveal blur-to-focus. Todas las palabras ocupan su lugar final desde el
// primer frame; solo se enfocan secuencialmente (layout-estable).
export function SplitText({
  text,
  delay = 0,
  stagger = 0.04,
  startIndex = 0,
}: Props) {
  const words = text.split(" ");
  return (
    <>
      {words.map((word, wIdx) => {
        const i = startIndex + wIdx;
        return (
          <span key={wIdx} className="inline-block">
            <motion.span
              className="inline-block will-change-[filter,opacity,transform]"
              initial={{ opacity: 0.12, filter: "blur(14px)", y: 14 }}
              animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
              transition={{
                delay: delay + i * stagger,
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {word}
            </motion.span>
            {wIdx < words.length - 1 && <span>&nbsp;</span>}
          </span>
        );
      })}
    </>
  );
}
