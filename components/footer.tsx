'use client'

import { Github, Twitter } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export function Footer() {
  return (
    <footer className="glass-card mt-16 border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Image 
                src="/images/xeenux.png" 
                alt="Xeenux" 
                width={40} 
                height={40} 
                className="w-10 h-10"
              />
              <span className="text-2xl font-bold gradient-text">Xeenux</span>
            </div>
            <p className="text-gray-400">
              The world's first 100% decentralized investment platform powered by smart contracts
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 xeenux-glow">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/packages" className="text-gray-400 hover:text-white transition-colors">
                  Packages
                </Link>
              </li>
              <li>
                <Link href="/rewards" className="text-gray-400 hover:text-white transition-colors">
                  Rewards
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 xeenux-glow">Connect With Us</h3>
            <div className="flex space-x-4">
              <a href="https://twitter.com/xeenux" 
                 className="glass-button p-2 hover:text-purple-400"
                 target="_blank"
                 rel="noopener noreferrer">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://discord.gg/xeenux" 
                 className="glass-button p-2 hover:text-purple-400"
                 target="_blank"
                 rel="noopener noreferrer">
                {/* <Discord className="w-5 h-5" /> */}
              </a>
              <a href="https://github.com/xeenux" 
                 className="glass-button p-2 hover:text-purple-400"
                 target="_blank"
                 rel="noopener noreferrer">
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-white/10 text-center text-gray-400">
          <p>© {new Date().getFullYear()} Xeenux. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}