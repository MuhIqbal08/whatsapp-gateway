"use client";

import { useAuth } from "@/app/context/AuthContext";
import api, { clearAccessToken } from "@/lib/axios";
import {
  LogOut,
  Menu,
  X,
  Bell,
  User,
  Lock,
  ChevronDown,
  Home,
  LayoutDashboard,
  Info,
  Settings,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { Slide, toast } from "react-toastify";

const Navbar = ({
  isCollapse,
  setIsCollapse,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}) => {
  const router = useRouter();
  const { setUser } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");

  const profileRef = useRef(null);

  // Detect scroll for shadow effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const res = await api.get("user/id");
        console.log('header', res.data)
        setName(res.data.user.name);
        setRole(res.data.role.name);
      } catch (error) {
        console.error(error);
      }
    }
    getUsers();
  }, []);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    if (isProfileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileOpen]);

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    setIsProfileOpen(false);
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      clearAccessToken();
      setUser(null);
      toast.success("Logout berhasil", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Slide,
      });
      router.push("/login");
      setIsLoggingOut(false);
    }
  };

  const profileMenuItems = [
    {
      name: "Profile",
      icon: User,
      onClick: () => {
        router.push("/profile");
        setIsProfileOpen(false);
      },
    },
    {
      name: "Ubah Password",
      icon: Lock,
      onClick: () => {
        router.push("/change-password");
        setIsProfileOpen(false);
      },
    },
    {
      name: "Logout",
      icon: LogOut,
      onClick: handleLogout,
      danger: true,
    },
  ];

  return (
    <header
      className={`
        sticky top-0 z-40
        bg-white/80 dark:bg-slate-900/80 
        backdrop-blur-2xl backdrop-saturate-150
        border-b transition-all duration-300 ease-in-out
        ${
          scrolled
            ? "border-slate-200 dark:border-slate-800 shadow-lg shadow-slate-900/5 dark:shadow-black/20"
            : "border-slate-200/50 dark:border-slate-800/50"
        }
      `}
    >
      <div className="flex items-center justify-between px-4 sm:px-6 h-16">
        {/* LEFT SECTION */}
        <div className="flex items-center gap-3">
          {/* Desktop Sidebar Toggle */}
          <button
            onClick={() => {
              setIsCollapse(!isCollapse);
              setIsMobileMenuOpen(false);
            }}
            className="
              hidden md:flex items-center justify-center
              w-10 h-10 rounded-xl
              text-slate-600 dark:text-slate-400
              hover:bg-slate-100/80 dark:hover:bg-slate-800/80
              hover:text-slate-900 dark:hover:text-white
              transition-all duration-300 ease-out
              active:scale-95
              hover:shadow-md hover:shadow-slate-900/5
            "
            aria-label={isCollapse ? "Expand sidebar" : "Collapse sidebar"}
          >
            <Menu
              className={`w-5 h-5 transition-transform duration-300 ${isCollapse ? "rotate-0" : "rotate-90"}`}
            />
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="
              md:hidden flex items-center justify-center
              w-10 h-10 rounded-xl
              text-slate-600 dark:text-slate-400
              hover:bg-slate-100/80 dark:hover:bg-slate-800/80
              hover:text-slate-900 dark:hover:text-white
              transition-all duration-300 ease-out
              active:scale-95
              hover:shadow-md hover:shadow-slate-900/5
            "
            aria-label="Toggle mobile menu"
          >
            <div className="relative w-5 h-5 flex items-center justify-center">
              <Menu
                className={`
                w-5 h-5 absolute transition-all duration-300 ease-in-out
                ${isMobileMenuOpen ? "opacity-0 rotate-90 scale-0" : "opacity-100 rotate-0 scale-100"}
              `}
              />
              <X
                className={`
                w-5 h-5 absolute transition-all duration-300 ease-in-out
                ${isMobileMenuOpen ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-0"}
              `}
              />
            </div>
          </button>

          {/* Brand/Title - Hidden on small mobile */}
          <div className="hidden sm:flex items-center gap-2">
            {/* <div className="
              w-9 h-9 rounded-xl
              bg-linear-to-br from-emerald-400 via-emerald-500 to-cyan-500
              flex items-center justify-center
              font-bold text-sm text-white
              shadow-lg shadow-emerald-500/30
              transition-all duration-300 ease-out
            ">
              JD
            </div> */}
            <div className="hidden lg:block">
              <h1 className="text-sm font-bold text-slate-900 dark:text-white">
                Dashboard
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Welcome back
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="flex items-center gap-2">
          {/* Notification Button */}
          <button
            className="
            hidden sm:flex
            relative items-center justify-center
            w-10 h-10 rounded-xl
            text-slate-600 dark:text-slate-400
            hover:bg-slate-100/80 dark:hover:bg-slate-800/80
            hover:text-slate-900 dark:hover:text-white
            transition-all duration-300 ease-out
            active:scale-95
            hover:shadow-md hover:shadow-slate-900/5
            group
          "
          >
            <Bell className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" />
            <span
              className="
              absolute top-2 right-2 w-2 h-2
              bg-red-500 rounded-full
              ring-2 ring-white dark:ring-slate-900
            "
            >
              <span className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75" />
            </span>
          </button>

          {/* Divider */}
          <div className="hidden sm:block w-px h-6 bg-slate-200 dark:bg-slate-700" />

          {/* Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="
                flex items-center gap-2 sm:gap-3 px-2 sm:pl-3 sm:pr-2 py-1.5 rounded-xl
                hover:bg-slate-100/80 dark:hover:bg-slate-800/80
                transition-all duration-300 ease-out
                active:scale-95
                hover:shadow-md hover:shadow-slate-900/5
                group
              "
            >
              <div className="hidden sm:block text-right">
                <div className="text-sm font-semibold text-slate-900 dark:text-white leading-tight">
                  {name}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 leading-tight capitalize">
                  {role}
                </div>
              </div>

              <div className="relative">
                <div
                  className="
                  w-10 h-10 rounded-xl
                  bg-linear-to-br from-emerald-400 via-emerald-500 to-cyan-500
                  flex items-center justify-center
                  font-bold text-sm text-white
                  shadow-lg shadow-emerald-500/30
                  transition-all duration-300 ease-out
                  group-hover:shadow-xl group-hover:shadow-emerald-500/40
                  group-hover:scale-105
                  ring-2 ring-white/50 dark:ring-slate-800/50
                "
                >
                  JDK
                </div>
                <div
                  className={`
                  absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5
                  bg-emerald-500 rounded-full
                  ring-2 ring-white dark:ring-slate-900
                  transition-transform duration-300
                  ${isProfileOpen ? "scale-110" : "scale-100"}
                `}
                />
              </div>

              <ChevronDown
                className={`
                hidden sm:block w-4 h-4 text-slate-400 dark:text-slate-500
                transition-all duration-300 ease-out
                ${isProfileOpen ? "rotate-180 text-slate-600 dark:text-slate-300" : "rotate-0"}
              `}
              />
            </button>

            {/* Dropdown Menu */}
            <div
              className={`
              absolute right-0 mt-3 w-64
              bg-white dark:bg-slate-800
              rounded-md shadow-2xl shadow-slate-900/20 dark:shadow-black/40
              border border-slate-200/80 dark:border-slate-700/80
              overflow-hidden
              transition-all duration-300 ease-out origin-top-right
              ${
                isProfileOpen
                  ? "opacity-100 scale-100 translate-y-0 visible"
                  : "opacity-0 scale-95 -translate-y-2 invisible"
              }
            `}
            >
              {/* Profile Navbar */}
              <div
                className="
                p-4 
                bg-linear-to-br from-emerald-50 to-cyan-50 
                dark:from-slate-800/50 dark:to-slate-800/30
                border-b border-slate-200/80 dark:border-slate-700/80
              "
              >
                <div className="flex items-center gap-3">
                  <div
                    className="
                    w-12 h-12 rounded-xl
                    bg-linear-to-br from-emerald-400 via-emerald-500 to-cyan-500
                    flex items-center justify-center
                    font-bold text-base text-white
                    shadow-lg shadow-emerald-500/30
                  "
                  >
                    JDK
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      John Doe Kurniawan
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-400 truncate">
                      john.doe@example.com
                    </div>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="p-2">
                {profileMenuItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={index}
                      onClick={item.onClick}
                      disabled={item.danger && isLoggingOut}
                      className={`
                        w-full flex items-center gap-3 px-4 py-3 rounded-xl
                        text-sm font-medium
                        transition-all duration-300 ease-out
                        active:scale-95
                        group/item
                        ${
                          item.danger
                            ? "text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 hover:shadow-md hover:shadow-red-500/10"
                            : "text-slate-700 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-700/50 hover:shadow-md hover:shadow-slate-900/5"
                        }
                        disabled:opacity-50 disabled:cursor-not-allowed
                      `}
                    >
                      <div
                        className={`
                        p-2 rounded-lg transition-all duration-300
                        ${
                          item.danger
                            ? "bg-red-100 dark:bg-red-950/50 group-hover/item:bg-red-200 dark:group-hover/item:bg-red-950/70"
                            : "bg-slate-100 dark:bg-slate-700 group-hover/item:bg-slate-200 dark:group-hover/item:bg-slate-600"
                        }
                      `}
                      >
                        <Icon
                          className={`w-4 h-4 ${item.danger && isLoggingOut ? "animate-spin" : "group-hover/item:scale-110 transition-transform duration-300"}`}
                        />
                      </div>
                      <span className="flex-1 text-left">{item.name}</span>
                      {item.danger && (
                        <ChevronDown className="-rotate-90 w-4 h-4 opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all duration-300" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="p-3 border-t border-slate-200/80 dark:border-slate-700/80 bg-slate-50/50 dark:bg-slate-800/30">
                <div className="text-xs text-center text-slate-500 dark:text-slate-400">
                  Version 1.0.0
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
