"use client";

import { useEffect, useState } from "react";
import type { CountdownTimer } from "@/types";
import { Tag } from "lucide-react";

interface CountdownProps {
  targetDate: Date;
}

export function CountdownTimer({ targetDate }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<CountdownTimer>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;
      if (distance < 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        });
        return;
      }
      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        ),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex gap-2 md:gap-4 justify-center">
      {Object.entries(timeLeft).map(([key, value]) => (
        <div key={key} className="text-center">
          <div className="bg-black/30 backdrop-blur-sm px-2 py-2 text-white border glass-card border-primary/20">
            <div className="text-sm md:text-sm font-bold">
              {String(value).padStart(2, "0")}
            </div>
          </div>
          <div className="text-xs md:text-xs text-muted-foreground uppercase mt-1">
            {key}
          </div>
        </div>
      ))}
    </div>
  );
}
