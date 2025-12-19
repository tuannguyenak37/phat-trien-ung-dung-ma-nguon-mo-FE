"use client";

import { useEffect, useRef, useState } from "react";
import axiosClient from "@/lib/API/axiosConfig";
import { useAuthStore } from "@/lib/store/tokenStore";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const setAuth = useAuthStore((state) => state.setAuth);
  const [isChecking, setIsChecking] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  /* ================= AUTH ================= */
  useEffect(() => {
    const loadUserFromCookie = async () => {
      try {
        const res = await axiosClient.post("/token/refresh");
        const data = res.data;
        const token = data.access_token || data.accessToken;

        if (token) {
          setAuth(token, {
            user_id: data.user_id,
            role: data.role,
            firstName: data.firstName,
            lastName: data.lastName,
          });
        }
      } catch {}
      finally {
        setIsChecking(false);
      }
    };

    loadUserFromCookie();
  }, [setAuth]);

  /* ================= ORGANIC CANVAS ================= */
  useEffect(() => {
    if (!isChecking) return;

    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const center = { x: w / 2, y: h / 2 };
    let t = 0;

    const points = Array.from({ length: 300 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      life: Math.random() * 100,
    }));

    const field = (x: number, y: number) => {
      const dx = x - center.x;
      const dy = y - center.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      return {
        vx: Math.sin(dy * 0.01 + t) * 0.6 + dx / dist,
        vy: Math.cos(dx * 0.01 + t) * 0.6 + dy / dist,
      };
    };

    const draw = () => {
      ctx.fillStyle = "rgba(255,255,255,0.08)";
      ctx.fillRect(0, 0, w, h);

      points.forEach((p) => {
        const f = field(p.x, p.y);
        p.x += f.vx;
        p.y += f.vy;
        p.life--;

        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.2, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${200 + t * 40}, 80%, 60%, 0.6)`;
        ctx.fill();

        if (
          p.x < 0 || p.x > w ||
          p.y < 0 || p.y > h ||
          p.life <= 0
        ) {
          p.x = center.x;
          p.y = center.y;
          p.life = 100;
        }
      });

      // center pulse
      ctx.beginPath();
      ctx.arc(center.x, center.y, 20 + Math.sin(t) * 6, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(99,102,241,0.25)";
      ctx.lineWidth = 2;
      ctx.stroke();

      t += 0.01;
      requestAnimationFrame(draw);
    };

    draw();

    window.onresize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      center.x = w / 2;
      center.y = h / 2;
    };
  }, [isChecking]);

  /* ================= LOADER ================= */
  if (isChecking) {
    return (
      <div className="relative h-screen w-screen overflow-hidden bg-white">
        <canvas ref={canvasRef} className="absolute inset-0" />

        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="rounded-full bg-white/70 backdrop-blur px-10 py-4 shadow-xl">
            <p className="text-gray-700 font-medium tracking-wide">
               ✨
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
