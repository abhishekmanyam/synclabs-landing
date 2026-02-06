import { useRef, useEffect, useState, type CSSProperties } from "react";
import { motion, useInView } from "motion/react";

interface BlurTextProps {
  text?: string;
  delay?: number;
  className?: string;
  animateBy?: "words" | "letters";
  direction?: "top" | "bottom";
  threshold?: number;
  rootMargin?: string;
  animationFrom?: Record<string, string | number>;
  animationTo?: Record<string, string | number>[];
  easing?: number[];
  onAnimationComplete?: () => void;
  stepDuration?: number;
}

export default function BlurText({
  text = "",
  delay = 200,
  className = "",
  animateBy = "words",
  direction = "top",
  threshold = 0.1,
  rootMargin = "0px",
  animationFrom,
  animationTo,
  easing = [0.25, 0.1, 0.25, 1],
  onAnimationComplete,
  stepDuration = 0.35,
}: BlurTextProps) {
  const elements = animateBy === "words" ? text.split(" ") : text.split("");
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: rootMargin, amount: threshold });
  const [completedCount, setCompletedCount] = useState(0);

  const defaultFrom = {
    filter: "blur(10px)",
    opacity: 0,
    y: direction === "top" ? -20 : 20,
  };

  const defaultTo = [
    {
      filter: "blur(0px)",
      opacity: 1,
      y: 0,
    },
  ];

  const from = animationFrom || defaultFrom;
  const to = animationTo || defaultTo;

  useEffect(() => {
    if (completedCount === elements.length && onAnimationComplete) {
      onAnimationComplete();
    }
  }, [completedCount, elements.length, onAnimationComplete]);

  return (
    <span ref={ref} className={`inline-flex flex-wrap ${className}`}>
      {elements.map((element, i) => (
        <motion.span
          key={i}
          initial={from}
          animate={inView ? to[to.length - 1] : from}
          transition={{
            duration: stepDuration,
            delay: (i * delay) / 1000,
            ease: easing,
          }}
          onAnimationComplete={() => setCompletedCount((prev) => prev + 1)}
          style={{ display: "inline-block", willChange: "transform, filter, opacity" }}
        >
          {element}
          {animateBy === "words" && i < elements.length - 1 ? "\u00A0" : ""}
        </motion.span>
      ))}
    </span>
  );
}
