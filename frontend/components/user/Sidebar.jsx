"use client"
import React from "react";
import { MessageSquare } from "lucide-react";
import Image from "next/image";
import { assets } from "@/lib/assets";
import { useRouter } from "next/navigation";

const Sidebar = ({ menuItems, selectedMenu, setSelectedMenu }) => {
  const router = useRouter();

  return (
    <aside
      className={`block md:fixed top-0 left-0 z-40 h-screen w-64 bg-white shadow-xl transition-transform duration-300 lg:translate-x-0`}
    >
      <div className="h-full flex flex-col">
        <div className="px-6 py-4 ">
          <div className="flex items-center gap-3">
            {/* <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-green-600" />
            </div> */}
            <Image src={assets.logo} alt="logo" width={40} height={40} />
            <div>
              <h1 className="text-xl font-bold bg-linear-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">WA Gateway</h1>
              <p className="text-xs bg-linear-to-r from-emerald-700 to-cyan-700 bg-clip-text text-transparent">Pro Version</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = selectedMenu === item.id;
            return (
              <a
                href={item.url}
                key={item.id}
                onClick={() => setSelectedMenu(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-linear-to-r from-emerald-500 to-cyan-500 text-white shadow-lg scale-105"
                    : "text-gray-700 hover:bg-green-50 hover:scale-102"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </a>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-linear-to-r from-green-50 to-emerald-50 border border-green-200">
            <div className="w-10 h-10 rounded-full bg-linear-to-r from-emerald-400 to-cyan-400 flex items-center justify-center text-white font-semibold">
              A
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-800">Admin User</p>
              <p className="text-xs text-gray-500">admin@gateway.com</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
