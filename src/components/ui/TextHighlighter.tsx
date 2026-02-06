import { useRef, useState, useEffect, type ReactNode } from "react";

interface TextHighlighterProps {
  children: ReactNode;
  highlightColor?: string;
  type?: "wavy" | "zigzag";
  animationDuration?: number;
  triggerOnView?: boolean;
  strokeWidth?: number;
  highlightOpacity?: number;
  className?: string;
}

export default function TextHighlighter({
  children,
  highlightColor = "#2bf8d4",
  type = "wavy",
  animationDuration = 1.2,
  triggerOnView = true,
  strokeWidth = 2.5,
  highlightOpacity = 0.8,
  className = "",
}: TextHighlighterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [isVisible, setIsVisible] = useState(!triggerOnView);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (!ref.current) return;
    setWidth(ref.current.offsetWidth);

    if (!triggerOnView) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [triggerOnView]);

  const pathD =
    type === "wavy"
      ? `M0 8 Q ${width * 0.125} 0, ${width * 0.25} 8 Q ${width * 0.375} 16, ${width * 0.5} 8 Q ${width * 0.625} 0, ${width * 0.75} 8 Q ${width * 0.875} 16, ${width} 8`
      : `M0 8 L${width * 0.1} 2 L${width * 0.2} 14 L${width * 0.3} 2 L${width * 0.4} 14 L${width * 0.5} 2 L${width * 0.6} 14 L${width * 0.7} 2 L${width * 0.8} 14 L${width * 0.9} 2 L${width} 8`;

  const pathLength = width * 1.5;

  return (
    <span ref={ref} className={`relative inline-block ${className}`}>
      {children}
      {width > 0 && (
        <svg
          className="absolute left-0 -bottom-1 w-full"
          height="16"
          viewBox={`0 0 ${width} 16`}
          fill="none"
          style={{ overflow: "visible", opacity: highlightOpacity }}
        >
          <path
            d={pathD}
            stroke={highlightColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            fill="none"
            style={{
              strokeDasharray: pathLength,
              strokeDashoffset: isVisible ? 0 : pathLength,
              transition: `stroke-dashoffset ${animationDuration}s ease-in-out`,
            }}
          />
        </svg>
      )}
    </span>
  );
}
