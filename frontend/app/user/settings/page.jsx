"use client";

import React, { useEffect, useState } from "react";
import {
  User,
  Key,
  Lock,
  Shield,
  Mail,
  Phone,
  Globe,
  Code,
  Terminal,
  Zap,
  Eye,
  EyeOff,
  AlertCircle,
} from "lucide-react";
import api from "@/lib/axios";

const Page = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [apiKey, setApiKey] = useState(null); // null = belum ada, string = sudah ada
  const [showApiKey, setShowApiKey] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "password", label: "Change Password", icon: Lock },
    { id: "api", label: "API Keys", icon: Key },
  ];

  const generateApiKey = async () => {
    try {
      setIsGenerating(true);

      const res = await api.post("/api-key/keys");

      setApiKey(res.data.apiKey);
      setShowApiKey(true);
    } catch (err) {
      alert(err.response?.data?.error || "Failed to generate API key");
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (activeTab === "api") {
      fetchApiKey();
    }
  }, [activeTab]);

  const fetchApiKey = async () => {
    try {
      const res = await api.get("/api-key/keys");

      if (res.data.apiKey) {
      console.log('apiKey', res.data.apiKey)

        setApiKey(res.data.apiKey.apiKeyHash);
        // setApiKey(res.data.apiKey); // placeholder
      }
    } catch (err) {
      console.error(err);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // Bisa tambahkan toast notification di sini
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Configuration</h1>
        <p className="text-gray-500 text-sm">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-1.5 mb-6 overflow-x-auto">
        <ul className="flex gap-1.5 min-w-max md:min-w-0">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <li key={tab.id} className="flex-1 min-w-fit">
                <button
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 text-sm ${
                    activeTab === tab.id
                      ? "bg-white text-cyan-600 shadow-sm border border-cyan-100"
                      : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Content Panels */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center gap-4 pb-4 border-b border-gray-200">
              <div className="w-16 h-16 rounded-full bg-linear-to-br from-cyan-500 to-emerald-500 flex items-center justify-center text-white text-xl font-bold">
                JD
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">John Doe</h2>
                <p className="text-gray-500 text-sm">john.doe@example.com</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-gray-600 flex items-center gap-2 font-medium">
                  <User className="w-4 h-4 text-gray-400" />
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-600 flex items-center gap-2 font-medium">
                  <Mail className="w-4 h-4 text-gray-400" />
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="john.doe@example.com"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-600 flex items-center gap-2 font-medium">
                  <Phone className="w-4 h-4 text-gray-400" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="+1 234 567 8900"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-600 flex items-center gap-2 font-medium">
                  <Globe className="w-4 h-4 text-gray-400" />
                  Location
                </label>
                <input
                  type="text"
                  placeholder="Jakarta, Indonesia"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm"
                />
              </div>
            </div>

            <button className="px-6 py-2.5 bg-linear-to-r from-cyan-500 to-emerald-500 text-white font-semibold rounded-lg hover:shadow-md transition-all duration-200 text-sm">
              Save Changes
            </button>
          </div>
        )}

        {/* Change Password Tab */}
        {activeTab === "password" && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
              <div className="p-2.5 bg-cyan-50 rounded-lg border border-cyan-100">
                <Shield className="w-5 h-5 text-cyan-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-800">
                  Security Settings
                </h2>
                <p className="text-gray-500 text-xs">
                  Update your password to keep your account secure
                </p>
              </div>
            </div>

            <div className="max-w-md space-y-4">
              <div className="space-y-2">
                <label className="text-sm text-gray-600 flex items-center gap-2 font-medium">
                  <Lock className="w-4 h-4 text-gray-400" />
                  Current Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-600 flex items-center gap-2 font-medium">
                  <Lock className="w-4 h-4 text-gray-400" />
                  New Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-600 flex items-center gap-2 font-medium">
                  <Lock className="w-4 h-4 text-gray-400" />
                  Confirm New Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-sm"
                />
              </div>

              <div className="bg-cyan-50 border border-cyan-100 rounded-lg p-3">
                <p className="text-cyan-700 text-xs">
                  <strong className="font-semibold">
                    Password requirements:
                  </strong>{" "}
                  At least 8 characters, including uppercase, lowercase,
                  numbers, and special characters.
                </p>
              </div>

              <button className="w-full px-6 py-2.5 bg-linear-to-r from-cyan-500 to-emerald-500 text-white font-semibold rounded-lg hover:shadow-md transition-all duration-200 text-sm">
                Update Password
              </button>
            </div>
          </div>
        )}

        {/* API Keys Tab */}
        {activeTab === "api" && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between pb-4 border-b border-gray-200 flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-100">
                  <Terminal className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-800">API Key</h2>
                  <p className="text-gray-500 text-xs">
                    Generate and manage your API key
                  </p>
                </div>
              </div>
            </div>

            {/* Jika belum ada API Key */}
            {!apiKey && (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 border border-gray-200 mb-4">
                  <Key className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  No API Key Generated
                </h3>
                <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">
                  You havent generated an API key yet. Click the button below to
                  generate your unique API key for integrations.
                </p>
                <button
                  onClick={generateApiKey}
                  disabled={isGenerating}
                  className="px-6 py-2.5 bg-linear-to-r from-cyan-500 to-emerald-500 text-white font-semibold rounded-lg hover:shadow-md transition-all duration-200 flex items-center gap-2 mx-auto text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      Generate API Key
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Jika sudah ada API Key */}
            {apiKey && (
              <div className="space-y-4">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Code className="w-5 h-5 text-cyan-600" />
                    <h3 className="font-semibold text-gray-800">
                      Your API Key
                    </h3>
                    <span className="ml-auto px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-600 border border-emerald-200">
                      Active
                    </span>
                  </div>

                  {/* API Key Input dengan Toggle Password */}
                  <div className="relative mb-3">
                    <input
                      type={showApiKey ? "text" : "password"}
                      value={apiKey}
                      readOnly
                      className="w-full px-4 py-2.5 pr-20 bg-white border border-gray-200 rounded-lg text-gray-800 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                      <button
                        onClick={() => setShowApiKey(!showApiKey)}
                        className="p-1.5 hover:bg-gray-100 rounded-md transition-all"
                        title={showApiKey ? "Hide API Key" : "Show API Key"}
                      >
                        {showApiKey ? (
                          <EyeOff className="w-4 h-4 text-gray-500" />
                        ) : (
                          <Eye className="w-4 h-4 text-gray-500" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => copyToClipboard(apiKey)}
                      className="flex-1 px-4 py-2 bg-cyan-50 text-cyan-600 rounded-lg hover:bg-cyan-100 transition-all border border-cyan-200 text-sm font-medium"
                    >
                      Copy Key
                    </button>
                  </div>
                </div>

                {/* Security Tips */}
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                  <p className="text-emerald-700 text-xs">
                    <strong className="font-semibold">Security tips:</strong>{" "}
                    Keep your API key secure and never share it publicly. Store
                    it safely as you wont be able to view it again once you
                    leave this page.
                  </p>
                </div>
                
                {/* Warning untuk Revoke */}
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-amber-800 text-sm font-medium mb-1">
                      Need to revoke your API key?
                    </p>
                    <p className="text-amber-700 text-xs">
                      Please contact the administrator to revoke this API key.
                      You can only generate one key per account.
                    </p>
                  </div>
                </div>

              </div>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Page;
