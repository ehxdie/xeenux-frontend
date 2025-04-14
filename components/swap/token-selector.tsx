'use client'

import { Button } from '@/components/ui/button'
import { ChevronDown } from 'lucide-react'
import Image from 'next/image'

interface TokenSelectorProps {
  token: {
    symbol: string
    icon: string
    balance: string;
    amount: string;
  }
  onAmountChange: (value: string) => void
  onTokenSelect?: () => void
}

export function TokenSelector({ token, onAmountChange, onTokenSelect }: TokenSelectorProps) {
  return (
    <div className="glass-card p-4 space-y-3">
      <div className="flex justify-between text-sm text-gray-400">
        <span>Amount</span>
        {token.balance && <span>Balance: {token.balance}</span>}
      </div>
      
      <div className="flex gap-2">
        <input
          type="text"
          value={token.amount}
          onChange={(e) => onAmountChange(e.target.value)}
          placeholder="0.0"
          className="bg-transparent w-full outline-none text-2xl text-gray-200"
        />
        
        <Button 
          variant="ghost" 
          className="glass-button flex items-center gap-2"
          onClick={onTokenSelect}
        >
          <Image
            src={token.icon}
            alt={token.symbol}
            width={24}
            height={24}
            className={'rounded-full'}
          />
          <span className="font-semibold">{token.symbol}</span>
          {onTokenSelect && <ChevronDown className="w-4 h-4" />}
        </Button>
      </div>
    </div>
  )
}