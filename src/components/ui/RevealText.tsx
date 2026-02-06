import { useRef } from "react";
import { motion, useInView } from "motion/react";
import type { ReactNode } from "react";

interface RevealTextProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  direction?: "up" | "down" | "left" | "right";
  mode?: "manual" | "auto";
  stagger?: number;
  once?: boolean;
  className?: string;
}

export default function RevealText({
  children,
  delay = 0,
  duration = 0.8,
  direction = "up",
  mode = "auto",
  stagger = 0.1,
  once = true,
  className = "",
}: RevealTextProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once, margin: "-50px" });

  const directionMap = {
    up: { y: 40, x: 0 },
    down: { y: -40, x: 0 },
    left: { x: 40, y: 0 },
    right: { x: -40, y: 0 },
  };

  const offset = directionMap[direction];

  if (mode === "manual") {
    return (
      <div ref={ref} className={`overflow-hidden ${className}`}>
        <motion.div
          initial={{ opacity: 0, ...offset }}
          animate={inView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, ...offset }}
          transition={{ duration, delay, ease: [0.25, 0.4, 0.25, 1] }}
        >
          {children}
        </motion.div>
      </div>
    );
  }

  // Auto mode: split text into words
  const text = typeof children === "string" ? children : "";
  const words = text.split(" ");

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <span className="inline-flex flex-wrap">
        {words.map((word, i) => (
          <span key={i} className="overflow-hidden inline-block">
            <motion.span
              className="inline-block"
              initial={{ opacity: 0, ...offset }}
              animate={inView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, ...offset }}
              transition={{
                duration,
                delay: delay + i * stagger,
                ease: [0.25, 0.4, 0.25, 1],
              }}
            >
              {word}
              {i < words.length - 1 ? "\u00A0" : ""}
            </motion.span>
          </span>
        ))}
      </span>
    </div>
  );
}
