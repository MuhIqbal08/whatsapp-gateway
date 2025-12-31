"use client"
import { assets } from '@/lib/assets'
import { ChevronRight, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Sidebar = ({ menuItems, isCollapse, isMobileMenuOpen, setIsMobileMenuOpen }) => {
  return (
    <>
    {/* SIDEBAR */}
          <aside
            className={`
              ${isCollapse ? "md:w-20" : "md:w-72"}
              ${
                isMobileMenuOpen
                  ? "translate-x-0"
                  : "-translate-x-full md:translate-x-0"
              }
              fixed md:sticky top-0 h-screen w-72 z-50
              bg-linear-to-b from-gray-900 via-gray-800 to-gray-900
              text-white shadow-2xl transition-all duration-500 ease-in-out flex flex-col
            `}
          >
            <div className="absolute inset-0 bg-linear-to-br from-emerald-500/10 via-transparent to-cyan-500/10 pointer-events-none" />
    
            {/* LOGO */}
            <div
              className={`${
                isCollapse ? "px-4" : "px-6"
              } py-4 flex justify-between md:justify-center items-center`}
            >
              <div className="flex items-center gap-3">
                <Image src={assets.logo} alt="logo" width={32} height={32} />
                {!isCollapse && (
                  <h1 className="text-xl font-bold bg-linear-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                    Chat Direct
                  </h1>
                )}
              </div>
              <div className="block md:hidden">
                <X
                  className="w-6 h-6"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                />
              </div>
            </div>
    
            {/* MENU */}
            <nav className="flex-1 mt-6 px-3 overflow-y-auto scrollbar-thin">
              <ul className="space-y-2">
                {menuItems.map((item, index) => (
                  <li key={item.id} className="animate-slide-in-left">
                    <Link
                      href={item.url}
                      className={`
                        group flex items-center gap-4 px-4 py-3.5 rounded-xl
                        hover:bg-white/10 transition-all duration-300
                        ${isCollapse ? "justify-center" : ""}
                      `}
                    >
                      <item.icon className="w-5 h-5" />
                      {!isCollapse && (
                        <>
                          <span className="flex-1">{item.label}</span>
                          <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100" />
                        </>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>
    </>
  )
}

export default Sidebar