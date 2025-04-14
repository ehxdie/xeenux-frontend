'use client'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'

export function SearchBar() {
  return (
    <div className="flex gap-2">
      <Input
        placeholder="Search ID"
        className="bg-black/20 border-white/10"
      />
      <Button className="glass-button">
        <Search className="w-4 h-4 mr-2" />
        Search
      </Button>
    </div>
  )
}