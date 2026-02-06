import { type ReactNode } from "react";

interface AnimatedButtonProps {
  children: ReactNode;
  className?: string;
  glow?: boolean;
  shimmerColor?: string;
  shimmerSize?: string;
  shimmerDuration?: string;
  background?: string;
  borderRadius?: string;
  href?: string;
  onClick?: () => void;
}

export default function AnimatedButton({
  children,
  className = "",
  glow = true,
  shimmerColor = "#2bf8d4",
  shimmerSize = "0.15em",
  shimmerDuration = "3s",
  background = "linear-gradient(135deg, #2bf8d4, #1cc4a8)",
  borderRadius = "0.75rem",
  href,
  onClick,
}: AnimatedButtonProps) {
  const buttonContent = (
    <span
      className={`relative inline-flex items-center gap-2 font-semibold text-white cursor-pointer overflow-hidden ${className}`}
      style={{
        background,
        borderRadius,
        padding: "0.875rem 2rem",
        border: "none",
        position: "relative",
        isolation: "isolate",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget;
        el.style.transform = "translateY(-2px)";
        if (glow) {
          el.style.boxShadow = `0 10px 40px ${shimmerColor}66`;
        }
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.transform = "translateY(0)";
        el.style.boxShadow = "none";
      }}
    >
      {/* Shimmer overlay */}
      <span
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(
            110deg,
            transparent 33%,
            ${shimmerColor}33 44%,
            ${shimmerColor}55 48%,
            ${shimmerColor}33 52%,
            transparent 66%
          )`,
          backgroundSize: "300% 100%",
          animation: `shimmer ${shimmerDuration} ease-in-out infinite`,
          borderRadius,
        }}
      />
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </span>
  );

  if (href) {
    return (
      <a href={href} style={{ textDecoration: "none" }} onClick={onClick}>
        {buttonContent}
      </a>
    );
  }

  return <button onClick={onClick} style={{ all: "unset" }}>{buttonContent}</button>;
}
