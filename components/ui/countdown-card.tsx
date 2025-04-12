import { Card } from "@/components/ui/card";

interface CountdownCardProps {
  value: number;
  label: string;
}

export function   CountdownCard({ value, label }: CountdownCardProps) {
  return (
    <Card className="w-24 h-24 flex flex-col items-center justify-center bg-black/40 backdrop-blur-xl border border-[#F0B90B]/20 rounded-xl">
      <span className="text-4xl font-bold bg-gradient-to-r from-[#F0B90B] to-[#FCD435] bg-clip-text text-transparent">
        {value.toString().padStart(2, '0')}
      </span>
      <span className="text-xs text-gray-400 uppercase mt-1">
        {label}
      </span>
    </Card>
  );
}