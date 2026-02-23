"use client"

import { assets } from "@/lib/assets"
import { X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"

const Sidebar = ({
  menuItems,
  isCollapse,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}) => {
  const pathname = usePathname()

  return (
    <>
      {/* MOBILE OVERLAY */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          ${isCollapse ? "md:w-20" : "md:w-[280px]"}
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          fixed md:sticky top-0 h-screen w-[280px] z-50
          bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950
          border-r border-white/5
          transition-all duration-500 ease-in-out
          flex flex-col
        `}
      >
        {/* AMBIENT GLOW */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* HEADER */}
        <div className={`${isCollapse ? "px-4" : "px-6"} pt-6 pb-8 relative z-10`}>
          <div className="flex items-center justify-between">
            <div
              className={`flex items-center gap-3 ${
                isCollapse ? "justify-center w-full" : ""
              }`}
            >
              <div className="relative">
                {/* <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-lg blur-md opacity-50" /> */}
                <div className="relative  p-1.5 rounded-lg">
                  <Image
                    src={assets.logo}
                    alt="logo"
                    width={28}
                    height={28}
                  />
                </div>
              </div>

              {!isCollapse && (
                <div className="flex flex-col">
                  <h1 className="text-lg font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent tracking-tight">
                    Chat Direct
                  </h1>
                  <p className="text-[10px] text-gray-500 tracking-wider uppercase">
                    Dashboard
                  </p>
                </div>
              )}
            </div>

            {/* MOBILE CLOSE */}
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="md:hidden p-2 hover:bg-white/5 rounded-lg transition-colors duration-200"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 px-3 pb-6 overflow-y-auto scrollbar-thin">
          <ul className="space-y-1.5">
            {menuItems.map((item, index) => {
              const isActive = pathname === item.url

              return (
                <li
                  key={item.id}
                  style={{ animationDelay: `${index * 50}ms` }}
                  className="animate-fade-in-up"
                >
                  <Link
                    href={item.url}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`
                      group relative flex items-center gap-3.5 px-3.5 py-3
                      rounded-xl transition-all duration-300 ease-in-out
                      ${isCollapse ? "justify-center" : ""}
                      ${
                        isActive
                          ? "text-white"
                          : "text-gray-400 hover:text-gray-200"
                      }
                    `}
                  >
                    {/* ACTIVE BACKGROUND */}
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-xl" />
                    )}

                    {/* ACTIVE INDICATOR */}
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-emerald-400 to-cyan-400 rounded-r-full" />
                    )}

                    {/* ICON */}
                    <div
                      className={`relative z-10 transition-all duration-300 ${
                        isActive
                          ? "text-emerald-400"
                          : "text-gray-500 group-hover:text-gray-300"
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                    </div>

                    {/* LABEL */}
                    {!isCollapse && (
                      <span className="relative z-10 flex-1 font-medium text-[15px] tracking-tight group-hover:translate-x-0.5 transition-all duration-300">
                        {item.label}
                      </span>
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* FOOTER ACCENT */}
        <div className={`${isCollapse ? "px-3" : "px-6"} pb-6 relative z-10`}>
          <div
            className={`h-1 bg-gradient-to-r from-emerald-500/50 via-cyan-500/50 to-emerald-500/50 rounded-full transition-all duration-500 ${
              isCollapse ? "w-12 mx-auto" : "w-full"
            }`}
          />
        </div>
      </aside>
    </>
  )
}

export default Sidebar
