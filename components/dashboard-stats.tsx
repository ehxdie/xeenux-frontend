'use client'

import { Card } from '@/components/ui/card'
import { 
  Wallet, 
  ArrowUpRight,
  ArrowDownRight,
  DollarSign 
} from 'lucide-react'

export function DashboardStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
      <div className="glass-card p-6 border !border-none">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-full bg-purple-500/20">
            <Wallet className="w-6 h-6 text-purple-500" />
          </div>
          <div>
            <p className="text-sm text-gray-400">My Id</p>
            <p className="text-sm opacity-50 font-bold">0x1234...5678</p>
          </div>
        </div>
      </div>

     
    </div>
  )
}