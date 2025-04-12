interface ProgressBarProps {
  progress: number;
  total: number;
}

export function ProgressBar({ progress, total }: ProgressBarProps) {
  const percentage = (progress / total) * 100;
  
  return (
    <div className="relative w-full h-2 bg-gray-800 rounded-full overflow-hidden">
      <div 
        className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#F0B90B] to-[#FCD435] rounded-full transition-all duration-500"
        style={{ width: `${percentage}%` }}
      />
      <div className="absolute top-1/2 -translate-y-1/2 left-[60%] w-4 h-4 bg-white rounded-full border-2 border-[#F0B90B] shadow-lg" />
    </div>
  );
}