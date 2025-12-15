"use client";
import React from "react";
import { Bell, Menu, Send, Search, X } from "lucide-react";
import { useRouter } from "next/navigation";

const Header = ({ sidebarOpen, setSidebarOpen }) => {
    const router = useRouter();
    const handleLogout = () => {
    document.cookie = `token=; path=/; max-age=0; secure; samesite=strict`;
    router.push("/login");
  };
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-4 py-4 lg:px-6">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        <div className="flex-1 max-w-xl mx-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search messages, contacts..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <Bell className="w-6 h-6 text-gray-700" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
          </button>
          <button className="bg-red-600 px-4 py-2 text-white rounded">Logout</button>
          <button className="hidden sm:flex items-center gap-2 px-4 py-2 bg-linear-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:shadow-lg transition-all">
            <Send className="w-4 h-4" />
            <span className="font-medium">Send Message</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
