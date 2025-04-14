'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SidebarDropdownProps {
  title: string
  icon: React.ReactNode
  children: React.ReactNode
}

export function SidebarDropdown({ title, icon, children }: SidebarDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="glass-card overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-purple-500/20">
            {icon}
          </div>
          <span className="font-semibold text-gray-200">{title}</span>
        </div>
        <ChevronDown className={cn(
          "w-5 h-5 transition-transform duration-200",
          isOpen && "transform rotate-180"
        )} />
      </button>
      
      <div className={cn(
        "overflow-hidden transition-all duration-200",
        isOpen ? "max-h-96" : "max-h-0"
      )}>
        <div className="p-4 pt-0">
          {children}
        </div>
      </div>
    </div>
  )
}