'use client'

import { Button } from '@/components/ui/button'
import { Settings, Info } from 'lucide-react'
import { Tooltip } from '@/components/ui/tooltip'

interface SwapSettingsProps {
  slippage: string
  onSlippageChange: (value: string) => void
}

export function SwapSettings({ slippage, onSlippageChange }: SwapSettingsProps) {
  return (
    <div className="flex items-center justify-between text-sm text-gray-400">
      <div className="flex items-center gap-2">
        <span>Slippage Tolerance</span>
        {/* <Tooltip content="Your transaction will revert if the price changes unfavorably by more than this percentage.">
          <Info className="w-4 h-4" />
        </Tooltip> */}
      </div>
      
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={slippage}
          onChange={(e) => onSlippageChange(e.target.value)}
          className="w-16 bg-black/20 rounded px-2 py-1 text-right"
        />
        <span>%</span>
        <Button variant="ghost" size="icon" className="glass-button">
          <Settings className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}