"use client";
import React, { useState } from "react";
import { MessageSquare, Send, Users, BarChart3, Settings, Phone, CheckCheck, Zap } from "lucide-react";
import Sidebar from "@/components/user/Sidebar";
import Header from "@/components/user/Header";
import { usePathname } from "next/navigation";

const UserLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState("dashboard");
  const pathname = usePathname();

  const menuItems = [
    { id: "dashboard", icon: BarChart3, label: "Dashboard", active: pathname === "/user/dashboard" ? true : false, url: "/user/dashboard" },
    { id: "messages", icon: MessageSquare, label: "Messages", active: pathname === "/user/message" ? true : false, url: "/user/message" },
    { id: "contacts", icon: Users, label: "Contacts" },
    { id: "devices", icon: Phone, label: "Devices", active: pathname === "/user/device" ? true : false, url: "/user/device" },
    { id: "settings", icon: Settings, label: "Settings" },
  ];


  return (
    <div className="min-h-screen bg-linear-to-br z-1 from-gray-50 via-green-50 to-gray-100">
      <Sidebar menuItems={menuItems} selectedMenu={selectedMenu} setSelectedMenu={setSelectedMenu} />
      <div className="lg:ml-64">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="p-4 lg:p-6 space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default UserLayout;
