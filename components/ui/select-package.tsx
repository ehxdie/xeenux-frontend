import React, { PropsWithChildren } from "react";
import { Label } from "@/components/ui/label";
import { Check, Wallet } from "lucide-react";
import { Button } from "./button";
import { packages } from "@/lib/data/packages";

interface SelectPackageProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

function SelectPackage({
  value,
  onChange,
  disabled = false,
  children,
}: PropsWithChildren<SelectPackageProps>) {
  return (
    <div id="select-package">
      <Label className="mb-4 block">Select Package</Label>
      <div className="grid grid-cols-2 gap-4">
        {packages.map((pkg) => (
          <button
            key={pkg.value}
            type="button"
            onClick={() => onChange(pkg.value)}
            className={`
              relative p-2 rounded-xl transition-all duration-300
              ${
                value === pkg.value
                  ? "ring-2 ring-purple-500 shadow-[0_0_30px_rgba(139,92,246,0.2)] opacity-100 bg-purple-500/20"
                  : "hover:opacity-100 hover:shadow-[0_0_20px_rgba(139,92,246,0.1)] hover:bg-purple-500/10 glass-card opacity-40"
              }
            `}
            disabled={disabled}
          >
            <span
              className={`text-xl font-bold ${
                value === pkg.value ? "text-purple-400" : "text-gray-400"
              }`}
            >
              {pkg.label}
            </span>
            {value === pkg.value && (
              <Check className="absolute top-2 right-2 w-4 h-4 text-purple-500" />
            )}
          </button>
        ))}

        {!!children && children}
      </div>
    </div>
  );
}

export default SelectPackage;
