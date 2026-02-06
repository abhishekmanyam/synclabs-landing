import { useRef, useCallback, type ReactNode } from "react";

interface ClickSparkProps {
  sparkColor?: string;
  sparkSize?: number;
  sparkRadius?: number;
  sparkCount?: number;
  duration?: number;
  children?: ReactNode;
}

export default function ClickSpark({
  sparkColor = "#fff",
  sparkSize = 10,
  sparkRadius = 15,
  sparkCount = 8,
  duration = 400,
  children,
}: ClickSparkProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      canvas.width = rect.width;
      canvas.height = rect.height;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const sparks: {
        x: number;
        y: number;
        angle: number;
        speed: number;
        size: number;
        life: number;
      }[] = [];

      for (let i = 0; i < sparkCount; i++) {
        const angle = (Math.PI * 2 * i) / sparkCount;
        sparks.push({
          x,
          y,
          angle,
          speed: sparkRadius * (0.5 + Math.random() * 0.5),
          size: sparkSize * (0.5 + Math.random() * 0.5),
          life: 1,
        });
      }

      const start = performance.now();
      const animate = (now: number) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        sparks.forEach((spark) => {
          const eased = 1 - Math.pow(1 - progress, 3);
          const currentX = spark.x + Math.cos(spark.angle) * spark.speed * eased;
          const currentY = spark.y + Math.sin(spark.angle) * spark.speed * eased;
          const currentSize = spark.size * (1 - progress);
          const currentOpacity = 1 - progress;

          ctx.save();
          ctx.globalAlpha = currentOpacity;
          ctx.fillStyle = sparkColor;
          ctx.beginPath();
          ctx.arc(currentX, currentY, currentSize / 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        });

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      };

      requestAnimationFrame(animate);
    },
    [sparkColor, sparkSize, sparkRadius, sparkCount, duration]
  );

  return (
    <div style={{ position: "relative", display: "contents" }} onClick={handleClick}>
      {children}
      <canvas
        ref={canvasRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 9999,
        }}
      />
    </div>
  );
}
