import React, { useEffect, useRef } from 'react';

interface Burst {
  x: number;
  y: number;
  count?: number;
  colors?: string[];
}

interface SparkleEffectProps {
  bursts: Burst[];
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  rotSpeed: number;
  opacity: number;
  shape: 'star' | 'circle' | 'rect';
}

const DEFAULT_COLORS = ['#fde047', '#f59e0b', '#38bdf8', '#4ade80', '#ec4899', '#a855f7', '#ffffff'];

export const SparkleEffect: React.FC<SparkleEffectProps> = ({ bursts }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameIdRef = useRef<number | null>(null);
  const lastProcessedCountRef = useRef<number>(0);

  // Resize canvas to window dimensions
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Process only new bursts
  useEffect(() => {
    if (bursts.length === 0) {
      lastProcessedCountRef.current = 0;
      return;
    }

    if (bursts.length < lastProcessedCountRef.current) {
      lastProcessedCountRef.current = 0;
    }

    const newBursts = bursts.slice(lastProcessedCountRef.current);
    lastProcessedCountRef.current = bursts.length;

    if (newBursts.length === 0) return;

    const addedParticles: Particle[] = [];

    newBursts.forEach(burst => {
      const count = burst.count || 22;
      const colors = burst.colors || DEFAULT_COLORS;

      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.4;
        const speed = 2.5 + Math.random() * 5.5;
        const shapes: ('star' | 'circle' | 'rect')[] = ['star', 'circle', 'rect'];

        addedParticles.push({
          x: burst.x,
          y: burst.y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 2.0,
          size: 7 + Math.random() * 11,
          color: colors[Math.floor(Math.random() * colors.length)],
          rotation: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.25,
          opacity: 1,
          shape: shapes[Math.floor(Math.random() * shapes.length)],
        });
      }
    });

    particlesRef.current.push(...addedParticles);

    // Start animation loop if not already running
    if (animFrameIdRef.current === null) {
      const render = () => {
        const canvas = canvasRef.current;
        if (!canvas) {
          animFrameIdRef.current = null;
          return;
        }

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          animFrameIdRef.current = null;
          return;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Update and draw particles
        const aliveParticles: Particle[] = [];

        for (let i = 0; i < particlesRef.current.length; i++) {
          const p = particlesRef.current[i];
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.16; // gravity
          p.rotation += p.rotSpeed;
          p.opacity -= 0.024;

          if (p.opacity > 0) {
            aliveParticles.push(p);

            ctx.save();
            ctx.globalAlpha = Math.max(0, p.opacity);
            ctx.fillStyle = p.color;
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation);

            if (p.shape === 'circle') {
              ctx.beginPath();
              ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
              ctx.fill();
            } else if (p.shape === 'star') {
              // Draw 4-point sparkle star
              ctx.beginPath();
              const s = p.size;
              ctx.moveTo(0, -s);
              ctx.quadraticCurveTo(0, 0, s, 0);
              ctx.quadraticCurveTo(0, 0, 0, s);
              ctx.quadraticCurveTo(0, 0, -s, 0);
              ctx.quadraticCurveTo(0, 0, 0, -s);
              ctx.fill();
            } else {
              // Confetti rectangle
              ctx.fillRect(-p.size / 2, -p.size / 3, p.size, (p.size * 2) / 3);
            }

            ctx.restore();
          }
        }

        particlesRef.current = aliveParticles;

        if (particlesRef.current.length > 0) {
          animFrameIdRef.current = requestAnimationFrame(render);
        } else {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          animFrameIdRef.current = null;
        }
      };

      animFrameIdRef.current = requestAnimationFrame(render);
    }
  }, [bursts]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (animFrameIdRef.current !== null) {
        cancelAnimationFrame(animFrameIdRef.current);
        animFrameIdRef.current = null;
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50 w-full h-full"
    />
  );
};
