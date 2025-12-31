"use client";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/admin/Navbar";
import Sidebar from "@/components/admin/Sidebar";
import { LayoutDashboard, Shield, UserCog, Users } from "lucide-react";

const AdminLayout = ({ children }) => {
  const [isCollapse, setIsCollapse] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();

  const menuItems = [
    {
      id: "dashboard",
      icon: LayoutDashboard,
      label: "Dashboard",
      active: pathname === "/admin/dashboard",
      url: "/admin/dashboard",
    },
    {
      id: "users",
      icon: Users,
      label: "Users",
      active: pathname === "/admin/users",
      url: "/admin/users",
    },
    {
      id: "roles",
      icon: UserCog,
      label: "Roles",
      active: pathname === "/admin/roles",
      url: "/admin/roles",
    },
    {
      id: "permissions",
      icon: Shield,
      label: "Permissons",
      active: pathname === "/admin/permissions",
      url: "/admin/permissions",
    },
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
        <Navbar
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

export default AdminLayout;
