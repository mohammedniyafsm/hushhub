"use client";

import { cn } from "@/lib/utils";
import React, {
  ComponentPropsWithoutRef,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";

// -----------------------------
// 🔹 Mouse Position Hook
// -----------------------------
interface MousePosition {
  x: number;
  y: number;
}

function useMousePosition(): MousePosition {
  const [mousePosition, setMousePosition] = useState<MousePosition>({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return mousePosition;
}

// -----------------------------
// 🔹 Component Props
// -----------------------------
interface ParticlesProps extends ComponentPropsWithoutRef<"div"> {
  className?: string;
  quantity?: number;
  staticity?: number;
  ease?: number;
  size?: number;
  refresh?: boolean;
  color?: string;
  vx?: number;
  vy?: number;
}

// Convert hex → RGB
function hexToRgb(hex: string): number[] {
  hex = hex.replace("#", "");
  if (hex.length === 3) hex = hex.split("").map((c) => c + c).join("");
  const hexInt = parseInt(hex, 16);
  return [(hexInt >> 16) & 255, (hexInt >> 8) & 255, hexInt & 255];
}

type Circle = {
  x: number;
  y: number;
  translateX: number;
  translateY: number;
  size: number;
  alpha: number;
  targetAlpha: number;
  dx: number;
  dy: number;
  magnetism: number;
};

// --------------------------------------
// 🔹 MAIN COMPONENT
// --------------------------------------
export const Particles: React.FC<ParticlesProps> = ({
  className = "",
  quantity = 100,
  staticity = 50,
  ease = 50,
  size = 0.4,
  refresh = false,
  color = "#ffffff",
  vx = 0,
  vy = 0,
  ...props
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const context = useRef<CanvasRenderingContext2D | null>(null);
  const circles = useRef<Circle[]>([]);
  const mousePosition = useMousePosition();
  const mouse = useRef({ x: 0, y: 0 });

  const canvasSize = useRef({ w: 0, h: 0 });
  const dpr = typeof window !== "undefined" ? window.devicePixelRatio : 1;
  const rafID = useRef<number | null>(null);
  const resizeTimeout = useRef<NodeJS.Timeout | null>(null);

  const rgb = hexToRgb(color);

  // --------------------------
  // 🔹 CREATE PARTICLE
  // --------------------------
  const createCircle = useCallback((): Circle => {
    const pSize = Math.random() * 2 + size;
    return {
      x: Math.random() * canvasSize.current.w,
      y: Math.random() * canvasSize.current.h,
      translateX: 0,
      translateY: 0,
      size: pSize,
      alpha: 0,
      targetAlpha: parseFloat((Math.random() * 0.6 + 0.1).toFixed(1)),
      dx: (Math.random() - 0.5) * 0.1,
      dy: (Math.random() - 0.5) * 0.1,
      magnetism: 0.1 + Math.random() * 4,
    };
  }, [size]);

  // --------------------------
  // 🔹 DRAW PARTICLE
  // --------------------------
  const drawCircle = useCallback(
    (circle: Circle, update = false) => {
      const ctx = context.current;
      if (!ctx) return;

      ctx.translate(circle.translateX, circle.translateY);
      ctx.beginPath();
      ctx.arc(circle.x, circle.y, circle.size, 0, 2 * Math.PI);
      ctx.fillStyle = `rgba(${rgb.join(", ")}, ${circle.alpha})`;
      ctx.fill();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (!update) circles.current.push(circle);
    },
    [rgb, dpr]
  );

  // --------------------------
  // 🔹 CLEAR CANVAS
  // --------------------------
  const clearCanvas = useCallback(() => {
    const ctx = context.current;
    if (!ctx) return;
    ctx.clearRect(0, 0, canvasSize.current.w, canvasSize.current.h);
  }, []);

  // --------------------------
  // 🔹 RESIZE CANVAS
  // --------------------------
  const resizeCanvas = useCallback(() => {
    const container = canvasContainerRef.current;
    const canvas = canvasRef.current;

    if (!container || !canvas || !context.current) return;

    canvasSize.current.w = container.offsetWidth;
    canvasSize.current.h = container.offsetHeight;

    canvas.width = canvasSize.current.w * dpr;
    canvas.height = canvasSize.current.h * dpr;
    canvas.style.width = `${canvasSize.current.w}px`;
    canvas.style.height = `${canvasSize.current.h}px`;

    context.current.scale(dpr, dpr);

    circles.current = [];
    for (let i = 0; i < quantity; i++) {
      const c = createCircle();
      drawCircle(c);
    }
  }, [createCircle, drawCircle, dpr, quantity]);

  // --------------------------
  // 🔹 INIT CANVAS
  // --------------------------
  const initCanvas = useCallback(() => {
    resizeCanvas();
  }, [resizeCanvas]);

  // --------------------------
  // 🔹 MAIN ANIMATION LOOP
  // --------------------------
  const animate = useCallback(() => {
    clearCanvas();

    circles.current.forEach((circle, i) => {
      const distLeft = circle.x - circle.size;
      const distRight = canvasSize.current.w - circle.x - circle.size;
      const distTop = circle.y - circle.size;
      const distBottom = canvasSize.current.h - circle.y - circle.size;

      const closest = Math.min(distLeft, distRight, distTop, distBottom);
      const factor = Math.min(1, Math.max(0, closest / 20));

      circle.alpha = circle.targetAlpha * factor;
      circle.x += circle.dx + vx;
      circle.y += circle.dy + vy;

      circle.translateX +=
        (mouse.current.x / (staticity / circle.magnetism) -
          circle.translateX) /
        ease;

      circle.translateY +=
        (mouse.current.y / (staticity / circle.magnetism) -
          circle.translateY) /
        ease;

      drawCircle(circle, true);

      if (
        circle.x < -circle.size ||
        circle.x > canvasSize.current.w + circle.size ||
        circle.y < -circle.size ||
        circle.y > canvasSize.current.h + circle.size
      ) {
        circles.current.splice(i, 1);
        drawCircle(createCircle());
      }
    });

    rafID.current = requestAnimationFrame(animate);
  }, [
    clearCanvas,
    createCircle,
    drawCircle,
    ease,
    staticity,
    vx,
    vy,
  ]);

  // --------------------------
  // 🔹 INIT + RESIZE LISTENERS
  // --------------------------
  useEffect(() => {
    if (canvasRef.current) {
      context.current = canvasRef.current.getContext("2d");
    }

    initCanvas();
    animate();

    const handleResize = () => {
      if (resizeTimeout.current) clearTimeout(resizeTimeout.current);
      resizeTimeout.current = setTimeout(initCanvas, 200);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      if (rafID.current) cancelAnimationFrame(rafID.current);
      if (resizeTimeout.current) clearTimeout(resizeTimeout.current);
      window.removeEventListener("resize", handleResize);
    };
  }, [initCanvas, animate]);

  // Refresh on demand
  useEffect(() => {
    initCanvas();
  }, [refresh, initCanvas]);

  // --------------------------
  // 🔹 MOUSE TRACKING
  // --------------------------
  useEffect(() => {
    if (!canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const { w, h } = canvasSize.current;

    const x = mousePosition.x - rect.left - w / 2;
    const y = mousePosition.y - rect.top - h / 2;

    const inside = x < w / 2 && x > -w / 2 && y < h / 2 && y > -h / 2;

    if (inside) {
      mouse.current.x = x;
      mouse.current.y = y;
    }
  }, [mousePosition]);

  // --------------------------
  // 🔹 RENDER
  // --------------------------
  return (
    <div
      className={cn("pointer-events-none", className)}
      ref={canvasContainerRef}
      aria-hidden="true"
      {...props}
    >
      <canvas ref={canvasRef} className="size-full" />
    </div>
  );
};
