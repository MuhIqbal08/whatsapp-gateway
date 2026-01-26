"use client";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/admin/Sidebar";
import { BarChart3, LayoutDashboard, MessageSquare, Phone, Settings, Shield, UserCog, Users } from "lucide-react";
import Header from "@/components/user/Header";

const UserLayoutClient = ({ children }) => {
  const [isCollapse, setIsCollapse] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();

  const menuItems = [
    { id: "dashboard", icon: BarChart3, label: "Dashboard", active: pathname === "/user/dashboard", url: "/user/dashboard" },
    { id: "messages", icon: MessageSquare, label: "Messages", active: pathname === "/user/message", url: "/user/message" },
    { id: "contacts", icon: Users, label: "MessagesGrup", active: pathname === "/user/group", url: "/user/group" },
    { id: "devices", icon: Phone, label: "Devices", active: pathname === "/user/device", url: "/user/device" },
    { id: "settings", icon: Settings, label: "Settings", url: "/user/settings" },
  ];


  return (
    <div className="min-h-screen flex bg-linear-to-br from-gray-50 to-gray-100">
      {/* OVERLAY MOBILE */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <Sidebar
        menuItems={menuItems}
        isCollapse={isCollapse}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* NAVBAR */}
        <Header
          isCollapse={isCollapse}
          setIsCollapse={setIsCollapse}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />

        {/* CONTENT */}
        <main className="flex-1 p-6 overflow-y-auto space-y-4">
          {children}
        </main>
      </div>
    </div>
  );
};

export default UserLayoutClient;
