"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

export function ParallaxImage({
  src,
  alt,
  speed = 0.18,
  className = "",
  sizes = "(max-width: 768px) 100vw, 50vw",
}: {
  src: string;
  alt: string;
  speed?: number;
  className?: string;
  sizes?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [`${speed * -100}px`, `${speed * 100}px`],
  );

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div
        style={{ y }}
        className="relative h-[118%] -top-[9%] will-change-transform"
      >
        <motion.div
          initial={{ clipPath: "inset(8% round 24px)", opacity: 0.4 }}
          whileInView={{ clipPath: "inset(0% round 24px)", opacity: 1 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0"
        >
          <Image src={src} alt={alt} fill sizes={sizes} className="object-cover" />
        </motion.div>
      </motion.div>
    </div>
  );
}
