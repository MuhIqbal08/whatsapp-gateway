import { Bell, Menu, Search, X } from 'lucide-react';
import React from 'react'

const Navbar = ({ isCollapse, setIsCollapse, isMobileMenuOpen, setIsMobileMenuOpen }) => {
  return (
    <>
    <nav className="py-[9.5px] bg-white/80 backdrop-blur-lg flex items-center justify-between px-4 sticky top-0 z-30 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setIsCollapse(!isCollapse);
                    setIsMobileMenuOpen(false);
                  }}
                  className="hidden md:flex p-2 hover:text-emerald-700 transition-all duration-300 ease-in-out"
                >
                  {isCollapse ? <Menu /> : <X />}
                </button>
    
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="md:hidden p-2"
                >
                  {isMobileMenuOpen ? <X /> : <Menu />}
                </button>
    
                {/* <div className="hidden md:flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-xl min-w-[300px]">
                  <Search className="w-4 h-4 text-gray-400" />
                  <input
                    placeholder="Search anything..."
                    className="bg-transparent outline-none text-sm flex-1"
                  />
                </div> */}
              </div>
    
              <div className="flex items-center gap-3">
                {/* <button className="relative p-2 rounded-xl hover:bg-gray-100">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                </button> */}
                <div className="w-9 h-9 rounded-full bg-linear-to-br from-emerald-400 to-cyan-400 flex items-center justify-center font-bold text-white">
                  JD
                </div>
              </div>
            </nav>
    </>
  )
}

export default Navbar