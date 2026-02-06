import { type ReactNode } from "react";

interface GradientTextProps {
  children: ReactNode;
  className?: string;
  colors?: string[];
  animationSpeed?: number;
  direction?: "horizontal" | "vertical" | "diagonal";
}

export default function GradientText({
  children,
  className = "",
  colors = ["#2bf8d4", "#ffffff", "#2bf8d4"],
  animationSpeed = 6,
  direction = "horizontal",
}: GradientTextProps) {
  const gradientDirection =
    direction === "horizontal"
      ? "to right"
      : direction === "vertical"
        ? "to bottom"
        : "to bottom right";

  const colorString = colors.join(", ");

  return (
    <span
      className={`inline-block ${className}`}
      style={{
        backgroundImage: `linear-gradient(${gradientDirection}, ${colorString})`,
        backgroundSize: "300% 100%",
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        animation: `gradientShift ${animationSpeed}s ease infinite`,
      }}
    >
      {children}
      <style>{`
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </span>
  );
}
