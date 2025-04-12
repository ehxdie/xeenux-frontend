"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "@/lib/utils";

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & {
    indicatorClassName?: string;
    Earanings: number;
    earningsCompleted: number;
  }
>(
  (
    {
      className,
      value,
      indicatorClassName,
      Earanings,
      earningsCompleted,
      ...props
    },
    ref
  ) => {
    const progressPercentage = 50;
    const dynamicEaranings = Math.round(Earanings);

    return (
      <div className="relative w-full">
        <ProgressPrimitive.Root
          ref={ref}
          className={cn(
            "relative h-2 w-full overflow-hidden rounded-full bg-[#121212]", // Background dark tone
            className
          )}
          {...props}
        >
          {/* Progress bar indicator */}
          <ProgressPrimitive.Indicator
            className={cn(
              "h-full w-full flex-1 transition-all duration-500 ease-in-out bg-gradient-to-r from-[#4B51FF] to-[#B951FF]", // Blue to purple gradient
              indicatorClassName
            )}
            style={{
              transform: `translateX(-${100 - progressPercentage}%)`,
            }}
          />
        </ProgressPrimitive.Root>

        {/* White dot */}
        {Earanings !== undefined && (
          <div
            className="absolute top-1/2 -translate-y-1/2 bg-white rounded-full"
            style={{
              width: "24px",
              height: "24px",
              left: `calc(${progressPercentage}% - 12px)`,
            }}
          />
        )}

        {/* Tooltip */}
        {Earanings !== undefined && (
          <div
            className="absolute top-8 ml-8 break-words flex-wrap transform"
            style={{
              left: `calc(${progressPercentage}% - 50px)`,
            }}
          >
            <div className="bg-[#1E1E2E] border border-[#4B51FF] border-opacity-40 rounded-xl py-1 px-2 shadow-lg">
              <div className="text-center">
                <div className="text-xs md:text-sm font-bold text-[#4B51FF]">
                  {dynamicEaranings.toLocaleString()} XEE
                </div>
                <div className="text-[8px] md:text-xs text-[#B951FF]">
                  TOKENS SOLD
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
);

Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };