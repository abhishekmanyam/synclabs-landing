import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "motion/react";

interface Stat {
  value: number;
  suffix?: string;
  label: string;
  duration?: number;
}

interface StatsCountProps {
  stats: Stat[];
  className?: string;
  showDividers?: boolean;
}

function AnimatedNumber({ value, suffix = "", duration = 2 }: { value: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!inView) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setCount(Math.floor(eased * value));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(value);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [inView, value, duration]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

export default function StatsCount({
  stats,
  className = "",
  showDividers = true,
}: StatsCountProps) {
  return (
    <div className={`flex flex-wrap items-center justify-center gap-8 lg:gap-12 ${className}`}>
      {stats.map((stat, i) => (
        <div key={i} className="flex items-center gap-8 lg:gap-12">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: i * 0.15 }}
          >
            <div
              className="text-4xl lg:text-5xl font-extrabold"
              style={{
                background: "linear-gradient(135deg, #2bf8d4, #ffffff)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              <AnimatedNumber value={stat.value} suffix={stat.suffix} duration={stat.duration || 2} />
            </div>
            <p className="text-sm text-[#d0e8f2]/50 mt-2 max-w-[150px]">{stat.label}</p>
          </motion.div>
          {showDividers && i < stats.length - 1 && (
            <div className="hidden lg:block w-px h-16 bg-gradient-to-b from-transparent via-[#1e3d5c] to-transparent" />
          )}
        </div>
      ))}
    </div>
  );
}
