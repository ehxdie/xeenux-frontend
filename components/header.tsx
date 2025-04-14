'use client'

import Image from 'next/image'


export function Header() {

  return (
    <header className="glass-card border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image 
              src="/images/xeenux.png" 
              alt="xeenux" 
              width={40} 
              height={40} 
              className="w-8 h-8 sm:w-10 sm:h-10"
            />
            <span className="text-sm sm:text-xl font-bold gradient-text">XEENUX</span>
          </div>
          
        </div>
      </div>
    </header>
  )
}