'use client'

import { Card } from '@/components/ui/card'
import { LucideIcon } from 'lucide-react'

interface Stat {
  label: string
  value: string
}

interface SidebarItemProps {
  icon: LucideIcon
  label: string
  value?: string
  stats?: Stat[]
}

export function SidebarItem({ icon: Icon, label, value, stats }: SidebarItemProps) {
  return (
    <Card className="glass-card p-4">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 rounded-full bg-purple-500/20">
          <Icon className="w-5 h-5 text-purple-400" />
        </div>
        <h3 className="font-semibold text-gray-200">{label}</h3>
      </div>
      
      {value && (
        <p className="text-sm text-gray-400 ml-11">{value}</p>
      )}
      
      {stats && (
        <div className="ml-11 space-y-2">
          {stats.map((stat, index) => (
            <div key={index} className="flex justify-between text-sm">
              <span className="text-gray-400">{stat.label}</span>
              <span className="text-gray-200">{stat.value}</span>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}