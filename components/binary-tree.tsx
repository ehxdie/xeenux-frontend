'use client'

import { Card } from '@/components/ui/card'
import Image from 'next/image'
import { ChevronDown, ArrowUp, ArrowLeft, User } from 'lucide-react'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface TreeNode {
  id: string
  name: string
  leftValue: number
  rightValue: number
  left?: TreeNode
  right?: TreeNode
}

interface BinaryTreeProps {
  data: TreeNode
}

function TreeNodeComponent({ node }: { node: TreeNode }) {
  const [isHovered, setIsHovered] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="flex flex-col items-center">
      <Card 
        className={cn(
          "bg-[#1E0B2F] p-4 w-[240px] rounded-xl flex flex-col items-center gap-3",
          "transition-all duration-300 ease-in-out",
          "border-2 border-[#2D1245]",
          isHovered && "transform scale-105"
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="">
          <Image src="/images/xeenux.png" alt="xeenux" width={40} height={40} />
        </div>
        
        <h3 className={cn(
          "font-light text-sm text-purple-300",
          "transition-all duration-300",
          isHovered && "scale-105"
        )}>
          {node.name}
        </h3>
        
        <div className="w-full space-y-2">
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className={cn(
              "bg-[#2D1245] px-4 py-2 text-sm w-full rounded-md",
              "transition-all duration-300 ease-in-out",
              "flex items-center justify-between",
              "hover:bg-purple-700",
              isExpanded && "bg-purple-700"
            )}
          >
            <span className="text-purple-100 text-[10px]">Left: 1013400 / Right: 858000</span>
            <ChevronDown className={cn(
              "w-4 h-4 transition-transform duration-300",
              isExpanded && "transform rotate-180"
            )} />
          </button>
          
          <div className={cn(
            "overflow-hidden transition-all duration-300",
            "text-sm space-y-2 px-4",
            isExpanded ? "max-h-24 opacity-100" : "max-h-0 opacity-0"
          )}>
            <div className="flex justify-between font-light text-[10px] items-center">
              <span className="text-purple-200">Left count</span>
              <span className="text-purple-300">{node.leftValue.toLocaleString()}</span>

            </div>
            <div className="flex justify-between ont-light text-[10px] items-center">
              <span className="text-purple-200">Right count</span>
              <span className="text-purple-300">{node.rightValue.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </Card>
      
      {(node.left || node.right) && (
        <>
          <div className={cn(
            "h-12 w-px bg-gradient-to-b from-purple-600 to-purple-800",
            "transition-all duration-300",
            isHovered && "from-purple-500 to-purple-700 h-16"
          )} />
          <div className="flex items-start gap-16">
            <div className="flex flex-col items-center">
              {node.left && (
                <>
                  <div className={cn(
                    "w-20 h-px bg-gradient-to-r from-purple-600 to-purple-800",
                    "transition-all duration-300",
                    isHovered && "from-purple-500 to-purple-700"
                  )} />
                  <TreeNodeComponent node={node.left} />
                </>
              )}
            </div>
            <div className="flex flex-col items-center">
              {node.right && (
                <>
                  <div className={cn(
                    "w-20 h-px bg-gradient-to-l from-purple-600 to-purple-800",
                    "transition-all duration-300",
                    isHovered && "from-purple-500 to-purple-700"
                  )} />
                  <TreeNodeComponent node={node.right} />
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export function BinaryTree({ data }: BinaryTreeProps) {
  const [showNav, setShowNav] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowNav(window.scrollY > 200)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    document.querySelector('#tree-container')?.scrollTo({ top: 0, behavior: 'smooth' })
  }

//   const goBack = () => {
//     window.history.back()
//   }

  return (
    <div className="relative">
      <div 
        id="tree-container"
        className="w-full max-w-4xl mx-auto p-8 overflow-x-auto overflow-y-auto h-[600px]glass-card rounded-lg"
      >
        <div className="min-w-[1000px] flex justify-center">
          <TreeNodeComponent node={data} />
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className={cn(
        "absolute bottom-8 right-8 flex gap-4 transition-all duration-300",
        showNav ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
      )}>
       
        <button
          onClick={scrollToTop}
          className="bg-purple-700 hover:bg-purple-600 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}